// Base interface untuk kategori (Digunakan sebagai referensi data)
export interface ViuCategory {
    id: string;
    name: string;
}

// Master interface untuk semua item konten Viu (Banner, Series, Movie, Product, Search)
export interface ViuMediaItem {
    id: string;                 // product_id / series_id
    seriesId: string;
    title: string;              // name / series_name / title
    synopsis: string;           // synopsis / description
    thumbnail: string;          // cover_landscape / cover_image
    portraitThumbnail?: string; // cover_portrait
    isPremium: boolean;
    episodeCount: string;       // number / product_number
    category?: ViuCategory;
    type?: 'series' | 'movie' | 'product'; // Membantu membedakan tipe di frontend
}

// Banner adalah media item dengan tambahan target URL
export interface ViuBanner extends ViuMediaItem {
    targetUrl: string;
}

// Section untuk Homepage
export interface ViuSection {
    sectionId: string;
    sectionName: string;
    description: string;
    items: ViuMediaItem[];
}

// Response: Homepage
export interface ViuHomeResponse {
    status: string;
    banners: ViuBanner[];
    sections: ViuSection[];
}

// Response: Category Page
export interface ViuCategoryResponse {
    status: string;
    heroSection: ViuMediaItem[]; // Header kategori
    series: ViuMediaItem[];      // List drama/film dalam kategori
}

// Response: Search Page
export interface ViuSearchResponse {
    status: string;
    results: ViuMediaItem[];
    totals: {
        series: number;
        movie: number;
        product: number;
    };
}

// Utility: Bahasa dan Kategori Statis
export interface ViuLanguage {
    code: string;
    label: string;
}

export interface ViuEpisode {
    id: string;
    idEp: string | null;
    seriesId: string;
    name: string;
    episodeNum: string;
    coverEpisode: string; // cover_image_url
    type: 'product';
}

export interface ViuDetailResponse {
    status: string;
    detail: ViuMediaItem;
    episodes: ViuEpisode[];
}

export interface ViuSubtitle {
    language: string;
    url: string;
    code: string;
}

export interface ViuStream {
    quality: string;
    url: string;
}

export interface ViuPlayResponse {
    status: string;
    subtitles: ViuSubtitle[];
    streams: ViuStream[];
}