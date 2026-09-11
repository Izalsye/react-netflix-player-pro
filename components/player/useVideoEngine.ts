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
    subtitles?: any[]
) {
    const shakaRef = useRef<any>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    // States untuk Menu Player
    const [availableSubtitles, setAvailableSubtitles] = useState<any[]>([]);
    const [availableAudios, setAvailableAudios] = useState<any[]>([]);
    const [availableQualities, setAvailableQualities] = useState<any[]>([]);
    const [playbackRate, setPlaybackRate] = useState(1);

    // 🔥 HELPER FIX SHAKA V5 (Penangkal Bug setTextTrackVisibility) 🔥
    const toggleSubtitles = (player: any, video: HTMLVideoElement | null, show: boolean) => {
        // Coba pakai fungsi Shaka versi lama (v4)
        if (typeof player.setTextTrackVisibility === 'function') {
            player.setTextTrackVisibility(show);
        }
        // Paksa tembak native HTML5 TextTracks (Buat Shaka v5+)
        if (video && video.textTracks) {
            Array.from(video.textTracks).forEach(track => {
                track.mode = show ? 'showing' : 'hidden';
            });
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let isDestroyed = false;
        let activeBlobUrls: string[] = [];

        const isMp4 = src.includes('.mp4') || provider?.includes('filmbox');
        const isWeTv = provider?.includes('wetv');

        const initPlayer = async () => {
            if (isMp4) {
                video.src = src;
                setIsVideoReady(true);
            }
            else if (isWeTv && Hls.isSupported()) {
                const hls = new Hls();
                hlsRef.current = hls;
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    const levels = hls.levels.map((l: any, i: number) => ({ id: i, label: `${l.height}p`, height: l.height }));
                    setAvailableQualities([{ id: 'auto', label: 'Auto', active: true }, ...levels.sort((a, b) => b.height - a.height)]);
                    setIsVideoReady(true);
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
                if (provider?.includes('idlix') || provider?.includes('iqiyi') || src.includes('.json') || src.includes('.m3u8')) forceMimeType = 'application/x-mpegurl';

                await player.load(src, null, forceMimeType);

                // Ekstrak Kualitas Video & Audio dari Shaka
                const variantTracks = player.getVariantTracks();

                // 1. Ambil Kualitas (Resolusi)
                const uniqueHeights = Array.from(new Set(variantTracks.map((t: any) => t.height).filter(Boolean))).sort((a: any, b: any) => b - a);
                setAvailableQualities([{ id: 'auto', label: 'Auto', active: true }, ...uniqueHeights.map(h => ({ id: h, label: `${h}p`, active: false }))]);

                // 2. Ambil Audio Languages (Diurutkan A-Z)
                const uniqueAudios = Array.from(new Set(variantTracks.map((t: any) => t.language).filter(Boolean)));
                if (uniqueAudios.length > 0) {
                    const activeTrack = variantTracks.find((t: any) => t.active) || variantTracks[0];

                    // Format dan urutkan
                    const formattedAudios = uniqueAudios.map((lang: any) => ({
                        id: lang,
                        label: getNiceLanguageName(lang || undefined, variantTracks.find((t: any) => t.language === lang)?.label || undefined),
                        active: lang === activeTrack.language
                    })).sort((a: any, b: any) => a.label.localeCompare(b.label));

                    setAvailableAudios(formattedAudios);
                }

                // 3. Inject Subtitles
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

                            // Format dan urutkan
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
    }, [src, provider, customData, licenseServers, subtitles, audioConf]);

    const changeSubtitle = (trackId: any) => {
        if (!shakaRef.current) return;
        const player = shakaRef.current;
        const video = videoRef.current;

        if (trackId === 'off') {
            // 🔥 FIX SHAKA V5 🔥
            toggleSubtitles(player, video, false);
        } else {
            const track = player.getTextTracks().find((t: any) => t.id === trackId);
            if (track) {
                player.selectTextTrack(track);
                // 🔥 FIX SHAKA V5 🔥
                toggleSubtitles(player, video, true);
            }
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
        if (shakaRef.current) {
            const player = shakaRef.current;
            if (qualityId === 'auto') {
                player.configure({ abr: { enabled: true } });
            } else {
                player.configure({ abr: { enabled: false } });
                const tracks = player.getVariantTracks();
                const targetTrack = tracks.find((t: any) => t.height === qualityId);
                if (targetTrack) player.selectVariantTrack(targetTrack, true);
            }
        } else if (hlsRef.current) {
            hlsRef.current.currentLevel = qualityId === 'auto' ? -1 : qualityId;
        }
        setAvailableQualities(prev => prev.map(q => ({ ...q, active: q.id === qualityId })));
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