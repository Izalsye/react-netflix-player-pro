export type IdlixContentType = 'movie' | 'tv_series' | 'episode';

export interface IdlixMediaItem {
    id: string;
    contentType: IdlixContentType;
    title: string;
    slug: string;
    overview: string;
    tagline: string | null;
    posterPath: string;
    backdropPath: string;
    logoPath: string | null;
    releaseDate: string | null; // Digabung dari releaseDate atau firstAirDate
    runtimeMinutes: number | null; // runtime biasa
    voteAverage: number; // Langsung diconvert ke number float
    viewCount: number;
    genres: string[]; // Cukup array string nama genrenya saja ['Action', 'Thriller']
    hasVideo: boolean;

    // Spesifik untuk TV Series / Episode (opsional)
    numberOfSeasons?: number;
    numberOfEpisodes?: number;
    episodeNumber?: number;
}

export interface IdlixHomeSection {
    sectionId: string;
    type: 'featured' | 'trending' | 'network' | 'collection' | 'latest_movies' | 'latest_series' | 'latest_episodes';
    title: string;
    slug: string;
    items: IdlixMediaItem[];
}

export interface IdlixCleanHomeResponse {
    sliderItems: IdlixMediaItem[];
    sections: IdlixHomeSection[];
}

// Tambahan untuk menangani route Network / Filter List
export interface IdlixPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IdlixNetworkResponse {
    networkName: string;
    sortBy: string;
    pagination: IdlixPagination;
    data: IdlixMediaItem[];
}

// Tambahan untuk menangani route Tab Movies List
export interface IdlixMoviesResponse {
    pagination: IdlixPagination;
    items: IdlixMediaItem[];
}

export interface IdlixCastMember {
    id: string;
    name: string;
    character: string;
    profilePath: string | null;
    order: number;
}

export interface IdlixCompany {
    id: number;
    name: string;
    logoPath: string | null;
}

export interface IdlixEpisode {
    id: string;
    tmdbId: number | null;
    episodeNumber: number;
    thumbnail: string,
    title: string; // Mengubah 'name' menjadi 'title' agar seragam dengan film
    overview: string;
    airDate: string | null;
    runtimeMinutes: number | null; // Mengubah 'runtime' ke 'runtimeMinutes'
    voteAverage: number; // Langsung diconvert ke float number
    hasVideo: boolean;
}

export interface IdlixSeason {
    id: string;
    tmdbId: number | null;
    seasonNumber: number;
    title: string; // Mengubah 'name' menjadi 'title'
    episodes: IdlixEpisode[];
}

export interface IdlixMediaDetail {
    id: string;
    tmdbId: number | null;
    imdbId: string | null;
    contentType: IdlixContentType;
    title: string;
    originalTitle: string | null;
    slug: string;
    overview: string;
    tagline: string | null;
    posterPath: string;
    backdropPath: string;
    logoPath: string | null;
    backdrops: string[];
    releaseDate: string | null;
    runtimeMinutes: number | null;
    voteAverage: number;
    viewCount: number;
    country: string | null;
    status: string | null;
    trailerUrl: string | null;
    quality: string | null;
    director: { name: string | null; profilePath: string | null } | null;
    productionCompanies: IdlixCompany[];
    genres: string[];
    keywords: string[];
    cast: IdlixCastMember[];
    hasVideo: boolean;

    // 🎯 SUNTIKKAN STRUKTUR SEASONS DI DETAIL UTAMA
    seasons?: IdlixSeason[];
}

export interface IdlixSubtitleItem {
    lang: string;
    label: string;
    subUrl: string; // 🎯 Mengubah 'path' menjadi 'subUrl'
}

export interface IdlixPlayConfig {
    videoId: string;
    vidUrl: string; // 🎯 Mengubah 'url' menjadi 'vidUrl'
    mode: string;
    playbackCode: string; // Mengubah 'code' menjadi 'playbackCode' agar lebih jelas
    sessionTimeout: {
        expiresAtUnix: number; // expiresAt aslinya
        expiresAtReadable: string; // Diubah jadi format jam terbaca manusia
        ttlSeconds: number;
    };
    subtitles: IdlixSubtitleItem[];
}