// types/iqiyi.ts

// --- IDLIX NORMALIZED TYPES ---
export type ContentType = 'movie' | 'tv_series';

// 🎯 Interface baru untuk Banner (Slider)
export interface ItemBanner {
    cover: string | null;
    background: string | null;
    title: string | null;
}

// 🎯 Interface baru untuk Cover (Section / Detail)
export interface ItemCover {
    potrait: string | null;
    landscape: string | null;
}

export interface NormalizedItem {
    pathdetail: string | null;
    id: string;
    contentType: ContentType;
    title: string;
    slug: string;
    overview: string;
    tagline?: string | null;
    banner: ItemBanner | null;
    cover: ItemCover | null;
    releaseDate: string | null;
    runtimeMinutes: number | null;
    voteAverage: number;
    viewCount: number;
    genres: string[];
    hasVideo: boolean;
    numberOfSeasons?: number;
    numberOfEpisodes?: number;
}

export interface Section {
    sectionId: string;
    type: string;
    title: string;
    slug: string;
    items: NormalizedItem[];
}

export interface NormalizedHomeResponse {
    sliderItems?: NormalizedItem[];
    sections: Section[];
    hasNextPage?: boolean; // 🎯 Buat penanda pagination di frontend
}

// --- RAW NEXT.JS / PCW API TYPES ---
export interface PcwBlock {
    score?: string;
    update?: string;
    image?: { url: string; url_webp?: string };
    image_bg?: { url: string; url_webp?: string };
    image_h?: { url: string; url_webp?: string };
    image_title?: { url: string; url_webp?: string };
    title?: string;
    desc?: string;
    statistics?: { rank?: string };
    kv_pair?: {
        qipu_id?: string;
        year?: string;
        tags?: string;
        channel_id?: string;
        is_exclusive?: string;
        loc_Suffix_play?: string;
        loc_suffix_album?: string;
    };
}

// 🎯 TAMBAHAN BARU: Tipe data untuk Banner Title (Judul Section)
export interface PcwTopBanner {
    title?: string;
    block_type?: string;
    image?: { url: string };
}

// 🎯 TAMBAHAN BARU: Tipe data untuk Base (Info Pagination)
export interface PcwBase {
    has_next?: number;
    next_url?: string;
}

export interface PcwCard {
    id: string;
    name: string;
    card_type: string;
    top_banner?: PcwTopBanner[]; // 🎯 Didaftarkan ke card
    blocks?: PcwBlock[];
}

export interface PcwCommonResponse {
    code: number;
    base?: PcwBase; // 🎯 Didaftarkan ke response utama
    cards?: PcwCard[];
}

// --- DETAIL API TYPES ---
export interface SubtitleResponse {
    lid: number;
    srt: string;
    webvtt: string;
    _name: string;
}

export interface NormalizedSubtitle {
    label: string;
    url: string;
    vtt: string;
}

export interface IqiyiVideo {
    quality: string;
    m3u8: string;
}

export interface IqiyiEpisode {
    slug: string;
    id: string;
    episodeNumber: number;
    title: string;
    airDate: string;
    _iqiyi_tvId: number;
    _iqiyi_vid: string;
}

export interface IqiyiSeason {
    id: string;
    tmdbId: number;
    seasonNumber: number;
    title: string;
    episodes: IqiyiEpisode[];
}

export interface IqiyiPlayData {
    subtitles?: SubtitleResponse[];
    video?: IqiyiVideo | null;
    error?: boolean;
    message?: string;
    rawDash?: any;
    _debug?: any;
}

export interface IqiyiDetailResponse {
    id: string;
    title: string;
    originalTitle: string;
    slug: string;
    overview: string;
    banner: ItemBanner | null;
    cover: ItemCover | null;
    releaseDate: string;
    runtimeMinutes: number;
    voteAverage: number;
    genres: string[];
    hasVideo: boolean;
    seasons: IqiyiSeason[];
}