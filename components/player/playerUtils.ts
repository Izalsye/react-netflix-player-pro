export const getNiceLanguageName = (langCode?: string, originalLabel?: string) => {
    const rawCode = (langCode || '').toLowerCase().replace(/_/g, '-');
    const rawLabel = (originalLabel || '').toLowerCase();

    if (rawCode.includes('id') || rawCode === 'in' || rawLabel.includes('indo')) return 'Indonesia';
    if (rawCode.includes('en') || rawLabel.includes('eng')) return 'English';
    if (rawCode.includes('ms') || rawLabel.includes('malay')) return 'Melayu';

    if (originalLabel && originalLabel.length > 2 && !originalLabel.includes('_') && !originalLabel.startsWith('und')) {
        return originalLabel;
    }
    if (!langCode) return originalLabel || 'Unknown';
    try {
        const displayName = new Intl.DisplayNames(['id'], { type: 'language' });
        const cleanCode = rawCode.split('-')[0];
        const name = displayName.of(cleanCode);
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : langCode.toUpperCase();
    } catch (e) {
        return langCode.toUpperCase();
    }
};

export const fetchToBlobUrl = async (url: string) => {
    try {
        const res = await fetch(url);
        if (!res.ok) return url;
        let text = await res.text();
        let type = 'text/vtt';

        text = text.trim();
        if (text.startsWith('WEBVTT')) {
            type = 'text/vtt';
        } else if (text.includes('<?xml') || text.includes('<tt')) {
            type = 'application/ttml+xml';
        } else if (text.includes('-->')) {
            text = 'WEBVTT\n\n' + text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
            type = 'text/vtt';
        }

        const blob = new Blob([text], { type });
        return URL.createObjectURL(blob);
    } catch (e) {
        return url;
    }
};

export const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};