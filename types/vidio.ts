// types/vidio.ts

export interface ItemVideo {
    id: string;
    type: string;             // 'content_profile', 'video', 'livestreaming_schedule', 'category'
    title: string;
    altTitle?: string | null;
    coverUrl: string;
    streamUrl?: string | null; // <-- Ini untuk URL Trailer / m3u8 langsung jika ada
    duration?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    contentRating?: string | null;
}

export interface Section {
    id: string;
    title: string;
    variation: string;
    items: ItemVideo[];
}

// Udah gak pake pagination biar bersih
export interface HomeResponse {
    success: boolean;
    sections: Section[];
}

// types/vidio.ts

export interface Tag {
    id: string;
    name: string;
}

export interface Subtitle {
    language: string;
    url: string;
}

export interface Resolution {
    name: string;
    min: number;
    max: number;
}

// 🎯 STRUKTUR BARU UNTUK EPISODE
export interface EpisodeItem {
    id: string;
    type: string;
    title: string;
    description: string;
    duration: number; // dalam detik
    coverUrl: string;
    freeToWatch: boolean;
    isPremier: boolean;
    isDrm: boolean;
    publishDate: string;
}

// 🎯 STRUKTUR BARU UNTUK SEASON
export interface Season {
    id: string;
    name: string; // Contoh: "Season 1", "Trailer", "Extra"
    totalEpisodes: number;
    episodes: EpisodeItem[];
}

export interface DetailResponse {
    success: boolean;
    id: string;
    type: string; // 'content_profile' atau 'video'
    title: string;
    description: string;
    coverPortrait?: string;
    coverLandscape?: string;
    contentRating?: string;

    // --- Khusus Tipe: content_profile (Series / Movie Induk) ---
    releaseDate?: string;
    country?: string;
    totalEpisodes?: number;
    genres?: Tag[];
    actors?: Tag[];
    directors?: Tag[];
    trailerId?: string;
    trailerUrl?: string;
    seasons?: Season[]; // 🌟 SEASONS & EPISODES MASUK SINI

    // --- Khusus Tipe: video (Video Satuan / Direct Play) ---
    streamUrl?: string | null;
    subtitles?: Subtitle[];
    resolutions?: Resolution[];
    duration?: number;
    isPremium?: boolean;
}

export interface SubtitleResponse {
    language: string;
    url: string | null;
    url_proxy: string | null;
}

export interface PlayResponse {
    success: boolean;
    message?: string;
    streamUrl?: string | null;
    streamUrl_Proxy?: string | null;
    dashUrl?: string | null;
    dashUrl_Proxy?: string | null;
    subtitles: SubtitleResponse[];
    resolutions: any[];
    isDrm?: boolean;
    licenseServers?: any;
    customData?: any;
}