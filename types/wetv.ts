// ==========================================
// 📦 BASE TYPES (Dipakai di banyak tempat)
// ==========================================

export interface WeTVBadge {
    text: string;
    type?: string; // e.g. "VIP", "Free", "Sewa"
}

export interface WeTVItem {
    id: string;
    title: string;
    subtitle: string;
    coverVertical: string;
    coverHorizontal: string;
    score: string;
    badge: string;
    statusText: string;
    tags?: string[]; // Untuk genre dll
    episodes?: number;
}

export interface WeTVSearchFilterOption {
    name: string;
    value: string;
    isSelected: boolean;
}

export interface WeTVSearchFilter {
    paramKey: string;
    name: string;
    options: WeTVSearchFilterOption[];
}

export interface WeTVPagination {
    hasNextPage: boolean;
    nextPageContext: string;
}

// ==========================================
// 🏠 HOME & CHANNEL PAGE TYPES
// ==========================================

export interface WeTVMenu {
    id: string;
    name: string;
    pageType: string;
}

export interface WeTVHomeResponse {
    success: boolean;
    message?: string;
    pageName?: string;
    serverTime?: string;
    menus?: WeTVMenu[];
    sections?: {
        banners: WeTVItem[];
        wetvHot: WeTVItem[];
        segeraTayang: WeTVItem[];
        terbaru: WeTVItem[];
    };
}

export interface SearchResponseData {
    success: boolean;
    message: string;
    data: {
        query: string;
        totalResults: number;
        currentPage: number;
        items: WeTVItem[]; // Kita pakai WeTVStandardItem yang udah dibuat sebelumnya!
    } | null;
}

export interface WeTVModule {
    moduleType: string;
    moduleName: string;
    itemCount: number;
    items: WeTVItem[];
}

export interface WeTVChannelResponse {
    success: boolean;
    message?: string;
    namaChannel: string;
    totalModules: number;
    modules: WeTVModule[];
    pagination?: WeTVPagination; // Untuk infinite scroll
}

// ==========================================
// 🔍 EXPLORE / SEARCH TYPES
// ==========================================

export interface WeTVExploreResponse {
    success: boolean;
    message?: string;
    filters: WeTVSearchFilter[];
    items: WeTVItem[];
    pagination: WeTVPagination;
}

// ==========================================
// 🎬 PLAY / DETAIL TYPES
// ==========================================

export interface WeTVPlayEpisode {
    vid: string;
    title: string;
    episodeNumber: string;
    durationSeconds: number;
    isFree: boolean;
    badge: string;
    thumbnail: string;
}

export interface WeTVPlayDetailResponse {
    success: boolean;
    message?: string;
    pageName?: string;
    series?: {
        id: string;
        title: string;
        subtitle: string;
        description: string;
        year: string;
        region: string;
        genres: string[];
        score: string;
        coverVertical: string;
        coverHorizontal: string;
        episodeTotal: number;
        episodeUpdated: number;
        updateInfo: string;
    };
    episodes?: WeTVPlayEpisode[];
    trailers?: WeTVPlayEpisode[];
    extras?: WeTVPlayEpisode[];
    recommendations?: WeTVItem[];
}

// ==========================================
// 📺 STREAMING TYPES
// ==========================================

export interface WeTVStreamResolution {
    id: string | number;
    name: string;
    resolution: string;
    fileSizeByte: number;
}

export interface WeTVSubtitle {
    id: string | number;
    language: string;
    langCode: string;
    url: string;
    isSelected: boolean;
}

export interface WeTVStreamInfoResponse {
    success: boolean;
    message?: string;
    errCode?: number;
    previewDurationSeconds?: number;
    ipAddress?: string;
    videoMeta?: {
        vid: string;
        title: string;
        durationSeconds: number;
        audioTrack: string;
    };
    stream?: {
        manifestUrl: string;
        resolutions: WeTVStreamResolution[];
    };
    subtitles?: WeTVSubtitle[];
}