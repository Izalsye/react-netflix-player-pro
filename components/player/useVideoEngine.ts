import { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';
import Hls from 'hls.js';
import { fetchToBlobUrl, getNiceLanguageName } from './playerUtils';

export function useVideoEngine(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    src: string,
    provider?: string,
    customData?: any,
    licenseServers?: any,
    audioConf?: any,
    subtitles?: any[],
    qualities?: any[] // 🔥 TAMBAHAN PROP QUALITIES DARI WETV/FILMBOX
) {
    const shakaRef = useRef<any>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const [availableSubtitles, setAvailableSubtitles] = useState<any[]>([]);
    const [availableAudios, setAvailableAudios] = useState<any[]>([]);
    const [availableQualities, setAvailableQualities] = useState<any[]>([]);
    const [playbackRate, setPlaybackRate] = useState(1);

    // 🔥 STATE INTERNAL UNTUK SWITCH URL RESOLUSI (WETV / FILMBOX) 🔥
    const [internalSrc, setInternalSrc] = useState(src);
    const restoreTimeRef = useRef(0);
    const wasPlayingRef = useRef(false);

    // Kalau dari luar ngasih src baru, update internalSrc
    useEffect(() => { setInternalSrc(src); }, [src]);

    const toggleSubtitles = (player: any, video: HTMLVideoElement | null, show: boolean) => {
        if (player && typeof player.setTextTrackVisibility === 'function') {
            player.setTextTrackVisibility(show);
        }
        if (video && video.textTracks) {
            Array.from(video.textTracks).forEach(track => {
                track.mode = show ? 'showing' : 'hidden';
            });
        }
    };

    // Event listener untuk balikin durasi pas ganti resolusi (Hard URL Switch)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handleLoaded = () => {
            if (restoreTimeRef.current > 0) {
                video.currentTime = restoreTimeRef.current;
                restoreTimeRef.current = 0;
                if (wasPlayingRef.current) video.play();
            }
        };
        video.addEventListener('loadeddata', handleLoaded);
        return () => video.removeEventListener('loadeddata', handleLoaded);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !internalSrc) return;

        let isDestroyed = false;
        let activeBlobUrls: string[] = [];

        const isMp4 = internalSrc.includes('.mp4') || provider?.includes('filmbox');
        const isWeTv = provider?.includes('wetv');

        // 1. SETUP HARD QUALITIES (Jika dari API dapet array Resolusi beda URL)
        if (qualities && qualities.length > 0) {
            setAvailableQualities(qualities.map((q, i) => {
                // Biar centangnya akurat ngikutin URL yang lagi di-play
                const isCurrentlyActive = internalSrc === q.url || (!qualities.some(x => x.url === internalSrc) && q.default);
                return {
                    id: q.url,
                    label: q.html || q.name || q.resolution || `Res ${i + 1}`,
                    active: !!isCurrentlyActive
                };
            }));
        }

        // 🔥 FUNGSI INJECT NATIVE SUBTITLE (Buat WeTV & Filmbox yg bypass Shaka) 🔥
        const injectNativeSubtitles = async () => {
            if (isDestroyed || !subtitles || subtitles.length === 0) return;

            // Bersihin track lama biar ga dobel pas ganti kualitas
            const existingTracks = video.querySelectorAll('track');
            existingTracks.forEach(t => t.remove());

            const nativeTracks: any[] = [];
            const promises = subtitles.map(async (sub) => {
                const trackUrl = sub.subUrl || sub.url_proxy || sub.url;
                if (!trackUrl) return;
                try {
                    const blobUrl = await fetchToBlobUrl(trackUrl);
                    activeBlobUrls.push(blobUrl);
                    const track = document.createElement('track');
                    track.kind = 'subtitles';
                    track.label = sub.label;
                    track.srclang = sub.lang;
                    track.src = blobUrl;
                    if (sub.default) track.default = true;
                    video.appendChild(track);
                    nativeTracks.push({ id: sub.lang, label: sub.label, active: !!sub.default });
                } catch (e) { }
            });

            await Promise.all(promises);

            if (!isDestroyed && nativeTracks.length > 0) {
                const hasActive = nativeTracks.some(t => t.active);
                const formatted = [{ id: 'off', label: 'Off', active: !hasActive }, ...nativeTracks.sort((a, b) => a.label.localeCompare(b.label))];
                setAvailableSubtitles(formatted);

                // Aktifin Subtitle Default
                if (video.textTracks) {
                    Array.from(video.textTracks).forEach((t: any) => {
                        t.mode = (t.language === nativeTracks.find(nt => nt.active)?.id) ? 'showing' : 'hidden';
                    });
                }
            }
        };

        const initPlayer = async () => {
            if (isMp4) {
                video.src = internalSrc;
                setIsVideoReady(true);
                injectNativeSubtitles(); // Inject subtitle native mp4
            }
            else if (isWeTv && Hls.isSupported()) {
                // 🔥 1. CONFIG DEWA HASIL COPY DARI EXPRESS LU 🔥
                const hls = new Hls({
                    maxBufferLength: 60,
                    maxMaxBufferLength: 120,
                    maxBufferHole: 5,
                    highBufferWatchdogPeriod: 2,
                    nudgeOffset: 0.5,
                    nudgeMaxRetry: 20,
                    enableWorker: true,
                    lowLatencyMode: false,
                    progressive: false,
                    startFragPrefetch: true,
                    fragLoadingTimeOut: 30000,
                    fragLoadingMaxRetry: 6,
                    fragLoadingRetryDelay: 1000,
                    levelLoadingTimeOut: 15000,
                    manifestLoadingTimeOut: 15000,
                    // xhrSetup: function (xhr) {
                    //     xhr.withCredentials = false;
                    // }
                });

                hlsRef.current = hls;

                // 🔥 2. PENANGKAL ERROR SAKTI (Official Recovery Pattern) 🔥
                let recoverDecodingErrorDate = 0;

                hls.on(Hls.Events.ERROR, (_, d) => {
                    if (d.fatal) {
                        if (d.type === Hls.ErrorTypes.MEDIA_ERROR) {
                            const now = performance.now();
                            // Cegah Infinite Loop: Kasih jeda 3 detik tiap recovery
                            if (now - recoverDecodingErrorDate > 3000) {
                                recoverDecodingErrorDate = now;
                                console.warn('🎬 [HLS.js] Media error cacat WeTV, recovering...');
                                hls.recoverMediaError();
                            } else {
                                // Kalau masih error juga, tuker codec audionya (Jurus Pamungkas HLS.js)
                                console.warn('🎬 [HLS.js] Media error bandel, Swapping Audio Codec...');
                                hls.swapAudioCodec();
                                hls.recoverMediaError();
                            }
                        } else if (d.type === Hls.ErrorTypes.NETWORK_ERROR) {
                            console.warn('🌐 [HLS.js] Network error, loading ulang...');
                            // Kasih jeda dikit biar CDN nggak ngambek
                            setTimeout(() => hls.startLoad(), 1000);
                        } else {
                            console.error('💥 [HLS.js] Error Fatal, Destroying...');
                            hls.destroy();
                        }
                    } else if (d.details === 'bufferStalledError') {
                        // Benerin buffer nyangkut (non-fatal)
                        hls.recoverMediaError();
                    }
                });

                hls.loadSource(internalSrc);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (!qualities || qualities.length === 0) {
                        const levels = hls.levels.map((l: any, i: number) => ({ id: i, label: `${l.height}p`, height: l.height }));
                        setAvailableQualities([{ id: 'auto', label: 'Auto', active: true }, ...levels.sort((a, b) => b.height - a.height)]);
                    }
                    setIsVideoReady(true);
                    injectNativeSubtitles(); // Inject subtitle native WeTV
                });
            }
            else if (shaka.Player.isBrowserSupported()) {
                const player = new shaka.Player();
                await player.attach(video);
                shakaRef.current = player;

                let defaultAudioLang = audioConf?.languageCode ? audioConf.languageCode.toLowerCase() : 'id';
                player.configure({
                    streaming: { bufferBehind: 30, bufferingGoal: 60 },
                    manifest: { hls: { ignoreTextStreamFailures: true, ignoreImageStreamFailures: true } },
                    preferredAudio: [{ language: defaultAudioLang }]
                });

                player.getNetworkingEngine()?.registerRequestFilter((type: any, request: any) => {
                    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                        if (provider?.includes('vidio') && customData) {
                            const pallyconToken = customData.widevine || customData.playready;
                            if (pallyconToken) request.headers['pallycon-customdata-v2'] = pallyconToken;
                        } else if (customData?.token) {
                            request.headers['authorization'] = customData.token.trim();
                        }
                    }
                });

                if (provider?.includes('hbo') && licenseServers?.licenseUrl) {
                    player.configure({ drm: { servers: { 'com.widevine.alpha': licenseServers.licenseUrl, 'com.microsoft.playready': licenseServers.licenseUrl } } });
                } else if (provider?.includes('vidio') && licenseServers?.drm_license_url) {
                    const drmProxyUrl = `/api/vidio/drm-proxy?url=${encodeURIComponent(licenseServers.drm_license_url)}`;
                    player.configure({ drm: { servers: { 'com.widevine.alpha': drmProxyUrl, 'com.microsoft.playready': drmProxyUrl } } });
                } else if ((provider?.includes('prime') || licenseServers?.certificate_base64) && licenseServers?.drm_license_url) {
                    player.configure({ drm: { servers: { 'com.widevine.alpha': licenseServers.drm_license_url }, advanced: { 'com.widevine.alpha': { audioRobustness: ['SW_SECURE_CRYPTO'], videoRobustness: ['SW_SECURE_CRYPTO'] } } }, manifest: { ignoreDrmInfo: true } });
                } else if (provider?.includes('viu') && licenseServers?.drm_license_url) {
                    const drmProxyUrl = `/api/viu/drm-proxy?url=${encodeURIComponent(licenseServers.drm_license_url)}`;
                    player.configure({ drm: { servers: { 'com.widevine.alpha': drmProxyUrl } } });
                }

                let forceMimeType = undefined;
                if (provider?.includes('idlix') || provider?.includes('iqiyi') || internalSrc.includes('.json') || internalSrc.includes('.m3u8')) forceMimeType = 'application/x-mpegurl';

                await player.load(internalSrc, null, forceMimeType);

                const variantTracks = player.getVariantTracks();
                const uniqueHeights = Array.from(new Set(variantTracks.map((t: any) => t.height).filter(Boolean))).sort((a: any, b: any) => b - a);
                setAvailableQualities([{ id: 'auto', label: 'Auto', active: true }, ...uniqueHeights.map(h => ({ id: h, label: `${h}p`, active: false }))]);

                const uniqueAudios = Array.from(new Set(variantTracks.map((t: any) => t.language).filter(Boolean)));
                if (uniqueAudios.length > 0) {
                    const activeTrack = variantTracks.find((t: any) => t.active) || variantTracks[0];
                    const formattedAudios = uniqueAudios.map((lang: any) => ({
                        id: lang,
                        label: getNiceLanguageName(lang || undefined, variantTracks.find((t: any) => t.language === lang)?.label || undefined),
                        active: lang === activeTrack.language
                    })).sort((a: any, b: any) => a.label.localeCompare(b.label));
                    setAvailableAudios(formattedAudios);
                }

                if (subtitles && subtitles.length > 0 && !isDestroyed) {
                    const injectPromises = subtitles.map(async (sub) => {
                        const trackUrl = sub.subUrl || sub.url_proxy || sub.url;
                        if (!trackUrl) return;
                        try {
                            const blobUrl = await fetchToBlobUrl(trackUrl);
                            activeBlobUrls.push(blobUrl);
                            await player.addTextTrackAsync(blobUrl, sub.lang || sub.code || 'id', 'subtitles', 'text/vtt', undefined, sub.label || sub.language || 'Subtitle');
                        } catch (err) { }
                    });

                    await Promise.all(injectPromises);

                    if (!isDestroyed) {
                        const textTracks = player.getTextTracks();
                        if (textTracks.length > 0) {
                            const indoTrack = textTracks.find((t: any) => t?.language?.toLowerCase().startsWith('id') || t?.label?.toLowerCase().includes('indo'));
                            const activeTrack = indoTrack || textTracks[0];

                            player.selectTextTrack(activeTrack);
                            toggleSubtitles(player, video, true);

                            const formattedSubtitles = textTracks.map((t: any) => ({
                                id: t.id,
                                label: getNiceLanguageName(t.language || undefined, t.label || undefined),
                                track: t,
                                active: t.id === activeTrack.id
                            })).sort((a: any, b: any) => a.label.localeCompare(b.label));

                            setAvailableSubtitles([{ id: 'off', label: 'Off', track: null, active: false }, ...formattedSubtitles]);
                        }
                    }
                }
                setIsVideoReady(true);
            }
        };

        initPlayer();

        return () => {
            isDestroyed = true;
            activeBlobUrls.forEach(url => URL.revokeObjectURL(url));
            if (hlsRef.current) hlsRef.current.destroy();
            if (shakaRef.current) shakaRef.current.destroy().catch(() => { });
            video.pause();
            video.removeAttribute('src');
            video.load();
        };
    }, [internalSrc, provider, customData, licenseServers, subtitles, audioConf, qualities]); // 🔥 Tambahin qualities di ujung

    const changeSubtitle = (trackId: any) => {
        const player = shakaRef.current;
        const video = videoRef.current;
        if (!video) return;

        if (player) {
            // SHAKA SUBTITLE SWITCH
            if (trackId === 'off') {
                toggleSubtitles(player, video, false);
            } else {
                const track = player.getTextTracks().find((t: any) => t.id === trackId);
                if (track) {
                    player.selectTextTrack(track);
                    toggleSubtitles(player, video, true);
                }
            }
        } else if (video.textTracks) {
            // NATIVE SUBTITLE SWITCH (Buat WeTV / Filmbox)
            Array.from(video.textTracks).forEach((t: any) => {
                if (trackId === 'off') {
                    t.mode = 'hidden';
                } else {
                    t.mode = (t.language === trackId) ? 'showing' : 'hidden';
                }
            });
        }
        setAvailableSubtitles(prev => prev.map(s => ({ ...s, active: s.id === trackId })));
    };

    const changeAudio = (langId: string) => {
        if (!shakaRef.current) return;
        const player = shakaRef.current;
        const tracks = player.getVariantTracks();
        const targetTrack = tracks.find((t: any) => t.language === langId);
        if (targetTrack) {
            player.selectVariantTrack(targetTrack, true, true);
            setAvailableAudios(prev => prev.map(a => ({ ...a, active: a.id === langId })));
        }
    };

    const changeQuality = (qualityId: any) => {
        if (qualities && qualities.find(q => q.url === qualityId)) {
            // 🔥 HARD URL SWITCH (WeTV & Filmbox API yg resolusinya beda URL) 🔥
            const video = videoRef.current;
            if (video) {
                restoreTimeRef.current = video.currentTime; // Simpan durasi sekarang
                wasPlayingRef.current = !video.paused; // Simpan status play
            }
            setInternalSrc(qualityId); // Paksa component ke-render ulang pake URL resolusi baru!
            setAvailableQualities(prev => prev.map(q => ({ ...q, active: q.id === qualityId })));
        } else if (shakaRef.current) {
            const player = shakaRef.current;
            if (qualityId === 'auto') {
                player.configure({ abr: { enabled: true } });
            } else {
                player.configure({ abr: { enabled: false } });
                const tracks = player.getVariantTracks();
                const targetTrack = tracks.find((t: any) => t.height === qualityId);
                if (targetTrack) player.selectVariantTrack(targetTrack, true);
            }
            setAvailableQualities(prev => prev.map(q => ({ ...q, active: q.id === qualityId })));
        } else if (hlsRef.current) {
            hlsRef.current.currentLevel = qualityId === 'auto' ? -1 : qualityId;
            setAvailableQualities(prev => prev.map(q => ({ ...q, active: q.id === qualityId })));
        }
    };

    const changeSpeed = (speed: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackRate(speed);
        }
    };

    return {
        isVideoReady,
        availableSubtitles, changeSubtitle,
        availableAudios, changeAudio,
        availableQualities, changeQuality,
        playbackRate, changeSpeed
    };
}