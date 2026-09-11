import { useMemo } from 'react';

export type ParsedMedia =
    | { type: 'video', url: string, qualities?: any[], subtitles: any[], licenseServers?: any, customData?: any, audioConf?: any }
    | { type: 'comic', images: any[] }
    | null;

export function useMediaParser(testResult: any, endpointId: string): ParsedMedia {
    return useMemo(() => {
        if (!testResult || testResult.error) return null;

        const response = testResult;
        const isVidio = endpointId.includes('vidio');
        const isViu = endpointId.includes('viu');
        const isIdlix = endpointId.includes('idlix');
        const isPrime = endpointId.includes('primevideo');
        const isKomik = endpointId.includes('komiku') || endpointId.includes('mangaplus');
        const isFilmboxOrDramovnime = endpointId.includes('filmbox') || endpointId.includes('dramovnime');
        const isAnimekompi = endpointId.includes('animekompi');
        const isHbo = endpointId.includes('hbo');

        if (isKomik || endpointId.includes('view')) {
            const rawImages = response?.images || response?.data?.images || response?.data?.pages || response?.pages || response?.data?.halamankomik || [];
            if (rawImages.length > 0) {
                const formattedImages = rawImages.map((img: any, idx: number) => ({
                    ...img,
                    url_proxy: img.url_proxy || img.url || img.imageUrl || img.image_url,
                    alt: img.alt || img.title || `Page ${idx + 1}`
                }));
                return { type: 'comic', images: formattedImages };
            }
        }

        let playableUrl = '';
        let extractedQualities: any[] = [];
        const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);

        if (isPrime) {
            playableUrl = response.dashUrl || response.streamUrl;
        } else if (isIdlix) {
            const idlixUrl = response?.data?.vidUrl || response?.vidUrl;
            if (idlixUrl) playableUrl = `/api/idlix/stream-proxy?url=${encodeURIComponent(idlixUrl)}`;
        } else if (isVidio) {
            playableUrl = response?.dashUrl_Proxy || response?.streamUrl_Proxy || '';
        } else if (isViu) {
            if (isIOS) {
                playableUrl = response?.hls?.url_proxy || response?.hls?.url || '';
            } else {
                playableUrl = response?.dash?.url_proxy || response?.dash?.url || response?.hls?.url_proxy || '';
            }
        } else if (isAnimekompi) {
            const servers = response?.data?.servers || [];
            const validServer = servers.find((s: any) => s.url && s.url.trim() !== "");
            if (validServer) playableUrl = validServer.url;
        } else if (isHbo) {
            playableUrl = response?.data?.streamUrl || '';
        } else {
            const streamType = response?.data?.streamType;
            const format = response?.data?.format;
            const m3u8Data = response?.data?.m3u8;
            const vidUrl = response?.data?.vid_url_proxy || response?.data?.vid_url;
            const hlsArray = response?.data?.hls || response?.hls || [];
            const wetvUrl = response?.data?.url || response?.url;
            const wetvResolutions = response?.data?.resolutions;

            if (streamType === 'raw_hls' && m3u8Data) {
                const blob = new Blob([m3u8Data], { type: 'application/vnd.apple.mpegurl' });
                playableUrl = URL.createObjectURL(blob);
            } else if (streamType === 'hls_url' && m3u8Data) {
                playableUrl = m3u8Data;
            } else if (hlsArray.length > 0 && (hlsArray[0].url_proxy || hlsArray[0].url)) {
                // Ekstrak resolusi Filmbox & Hakuna Matata
                extractedQualities = hlsArray.map((item: any, index: number) => ({
                    html: item.resolutions ? `${item.resolutions}p` : `Res ${index + 1}`,
                    url: item.url_proxy || item.url,
                    default: index === 0
                }));
                playableUrl = extractedQualities[0].url;
            } else if (wetvResolutions && wetvResolutions.length > 0) {
                // Ekstrak resolusi WeTV
                extractedQualities = wetvResolutions.map((item: any, index: number) => ({
                    html: item.resolution ? item.resolution.toUpperCase() : item.name ? item.name.toUpperCase() : `Res ${index + 1}`,
                    url: item.url_proxy || item.url,
                    default: item.name === 'fhd' || item.name === 'shd'
                }));
                // Pastikan cuma 1 default terpilih (Prioritas FHD)
                let hasDefault = false;
                extractedQualities = extractedQualities.reverse().map(q => {
                    if (q.default && !hasDefault) { hasDefault = true; return q; }
                    return { ...q, default: false };
                }).reverse();
                if (!hasDefault && extractedQualities.length > 0) extractedQualities[0].default = true;

                playableUrl = extractedQualities.find(q => q.default)?.url || extractedQualities[0].url;
            } else if (format === 'MP4' && vidUrl) {
                playableUrl = vidUrl;
            } else if (vidUrl) {
                playableUrl = vidUrl;
            } else if (wetvUrl) {
                playableUrl = wetvUrl;
            }
        }

        if (!playableUrl) return null;

        let rawSubs = response?.subtitles || response?.data?.subtitles || [];
        if (rawSubs.length === 0 && (response?.data?.sub_url || response?.sub_url || response?.data?.sub_url_proxy || response?.sub_url_proxy)) {
            rawSubs = [{ id: 'id', label: 'Indonesia', url: response?.data?.sub_url || response?.sub_url, url_proxy: response?.data?.sub_url_proxy || response?.sub_url_proxy }];
        }

        const formattedSubs = rawSubs.map((sub: any) => {
            let rawSubUrl = isFilmboxOrDramovnime ? (sub.url_proxy || sub.subUrl_proxy || sub.url) : (sub.url_proxy || sub.subUrl_proxy || sub.subUrl || sub.url);
            let finalSubUrl = rawSubUrl;
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
            const isAlreadyProxied = rawSubUrl?.includes('/api/proxy') || rawSubUrl?.includes('localhost');

            if (!isAlreadyProxied) {
                if (isFilmboxOrDramovnime) {
                    const prov = endpointId.includes('filmbox') ? 'filmbox' : 'dramovnime';
                    finalSubUrl = `${baseUrl}/api/proxy?provider=${prov}&type=sub&url=${encodeURIComponent(rawSubUrl)}`;
                } else if (isIdlix && !rawSubUrl?.startsWith('http')) {
                    finalSubUrl = `${baseUrl}/api/idlix/stream-proxy?isSub=true&url=${encodeURIComponent(rawSubUrl)}`;
                }
            } else if (rawSubUrl?.startsWith('/api/')) {
                finalSubUrl = `${baseUrl}${rawSubUrl}`;
            }

            const rawLang = String(sub.code || sub.id || sub.lang || sub.langCode || sub.language || 'id').toLowerCase();
            let cleanLangCode = ['in_id', 'id_id', 'ind', 'indonesia'].includes(rawLang) ? 'id' : rawLang;

            let cleanLabel = sub.displayName || sub.label || sub.name || sub.language || 'Subtitle';
            if (cleanLangCode === 'id') cleanLabel = 'Indonesia';
            if (cleanLangCode === 'en') cleanLabel = 'English';

            return { ...sub, subUrl: finalSubUrl, lang: cleanLangCode, label: cleanLabel };
        });

        const uniqueSubsMap = new Map();
        formattedSubs.forEach((sub: any) => {
            if (!uniqueSubsMap.has(sub.lang)) {
                sub.default = sub.lang === 'id';
                uniqueSubsMap.set(sub.lang, sub);
            }
        });

        return {
            type: 'video',
            url: playableUrl,
            qualities: extractedQualities.length > 0 ? extractedQualities : undefined,
            subtitles: Array.from(uniqueSubsMap.values()),
            licenseServers: isHbo ? response?.data?.drm : (response?.licenseServers || response?.data?.licenseServers),
            customData: response?.customData || response?.data?.customData,
            audioConf: response?.audioConf || response?.data?.audioConf
        };

    }, [testResult, endpointId]);
}