// types/komiku.ts

export interface KomikuCard {
    title: string;
    slug: string;
    thumbnail: string;
    type: string;
    genre: string;
    views?: string; 
    updateTime?: string;
    latestChapter: string;
    chapterNumber: string;
    isColored?: boolean;
    description?: string; // 🎯 TAMBAHIN INI BRE
}

// 🎯 TAMBAHIN INTERFACE SEARCH JUGA DI BAWAHNYA
export interface KomikuSearchResponse {
    success: boolean;
    keyword: string;
    items: KomikuCard[];
}

export interface KomikuChildSection {
    id: string;
    title: string;
    items: KomikuCard[];
}

export interface KomikuSection {
    id: string;
    title: string;
    children: KomikuChildSection[];
}

export interface KomikuHomeResponse {
    success: boolean;
    sections: KomikuSection[];
}

export interface KomikuFilterOption {
    value: string;
    label: string;
}

export interface KomikuFilterGroup {
    name: string; 
    options: KomikuFilterOption[];
}

export interface KomikuFiltersResponse {
    success: boolean;
    filters: KomikuFilterGroup[];
}

export interface KomikuTerbaruResponse {
    success: boolean;
    page: number;
    items: KomikuCard[]; 
    hasNext: boolean; 
}

export interface KomikuChapterItem {
    slugChapter:string;
    title: string;
    chapterNumber: string;
    apiLink: string | null;
    views: string;
    date: string;
}

export interface KomikuDetailResponse {
    success: boolean;
    title: string;
    alternativeTitle: string;
    description: string;
    sinopsis: string;
    thumbnail: string;
    genres: string[];
    slug: string;
    info: Record<string, string>;
    chapters: KomikuChapterItem[];
    similarKomik: KomikuCard[];
}

export interface KomikuImage {
    src: string;
    fallbackSrc: string;
    url_proxy: string;        // 🎯 BARU
    fallbackSrc_proxy: string; // 🎯 BARU
    alt: string;
    id: string;
}

export interface KomikuChapterNav {
    apiLink: string | null;
    slug: string;
    chapter: string;
}

export interface KomikuViewResponse {
    success: boolean;
    title: string;
    mangaTitle: string;
    mangaSlug: string;
    mangaApiLink: string | null;
    description: string;
    info: Record<string, string>;
    images: KomikuImage[];
    meta: {
        chapterNumber: string;
        totalImages: number;
        publishDate: string;
        viewAnalyticsUrl: string;
    };
    navigation: {
        prevChapter: KomikuChapterNav | null;
        nextChapter: KomikuChapterNav | null;
        allChaptersApiLink: string | null;
    };
}