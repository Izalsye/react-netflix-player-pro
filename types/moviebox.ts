// types/moviebox.ts

// Tipe untuk standard response API Next.js kita
export interface MappedResponse<T> {
    code: number;
    message: string;
    data: T | null;
}

// Tipe untuk data SubTab yang sudah dirapikan (Modal buat hit /tabdata)
export interface MappedSubTab {
    tabId: number;
    name: string;
    tabCode: string;
    type: string;
}

// Tipe untuk isi data Home Tab yang sudah dirapikan
export interface MappedHomeData {
    version: string;
    tabs: MappedSubTab[];
}

export interface VideoItem {
    subjectId: string;
    title: string;
    coverUrl: string;
    genre: string;
    releaseDate: string;
    imdbRate: string;
    country: string;
    detailPath: string;    // Hasil ekstrak dari detailUrl (untuk SEO/Routing)
    isVip: boolean;        // Apakah butuh VIP?
    durationSeconds: number;
}

export interface SectionGroup {
    sectionType: string;   // BANNER, SUBJECTS_MOVIE, dll
    sectionTitle: string;  // "Peringkat Drama", "Baru di Moviebox", dll
    items: VideoItem[];
}

export interface MappedTabData {
    tabId: number;
    sections: SectionGroup[];
}

export interface MappedCast {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

export interface MappedDub {
    language: string;
    code: string;
    subjectId: string; // Sangat krusial! Beda dubbing kadang beda ID Film/Series.
    isOriginal: boolean;
}

export interface MappedEpisode {
    id: number;
    name: string;
    episodeNumber: number;
    // Nanti bisa ditambahkan data lain jika punya endpoint list episode spesifik
}

export interface MappedSeason {
    seasonNumber: number;
    totalEpisodes: number;
    episodes: MappedEpisode[]; // Berisi detail urutan episode [1, 2, 3... maxEp]
}

export interface MappedDetailData {
    subjectId: string;
    type: number; // 1: Movie, 2: Series, 5: Kids, dll.
    title: string;
    description: string;
    coverUrl: string;
    trailerUrl: string | null;
    releaseDate: string;
    genres: string[];
    country: string;
    rating: string;
    viewers: number;
    vipRules: {
        isVipRequired: boolean;
        freeEpisodes: number;
        previewSeconds: number;
    };
    cast: MappedCast[];
    subtitles: string[];
    dubs: MappedDub[];
    seasons: MappedSeason[];
}

export interface MappedPlayDash {
    streamId: string;
    url: string;          // Link .mpd
    codec: string;        // Contoh: "hevc"
    resolutions: string[]; // Contoh: ["1080", "720", "480"]
    authCookie: string;   // CloudFront Cookie (Sangat Penting buat Player!)
}

export interface MappedPlaySubtitle {
    language: string;
    languageCode: string;
    url: string;          // URL asli
    urlProxy: string;     // URL yang dilewatkan ke /api/moviebox/indocast
}

export interface MappedPlayMp4 {
    id: number;
    episodeNumber: number;
    episodeName: string;
    url: string;          // URL MP4 asli
    urlProxy: string;     // URL MP4 via proxy indocast
    resolution: number;
    codec: string;
    sizeBytes: string;
    isVipLocked: boolean;
}

export interface MappedPlayData {
    subjectId: string;
    dash: MappedPlayDash | null;
    subtitles: MappedPlaySubtitle[];
    mp4: MappedPlayMp4[];
}


// untuk filmbox ini
export interface MappedPlayHls {
    resolutions: string;
    url: string;
    url_proxy: string;
}

export interface MappedPlayDashFilmbox {
    url: string;
    url_proxy: string;
    signCookie: string | null;
    signHeaderKey: string | null;
    resolutions: string | null;
}

export interface MappedPlaySubtitleFilmbox {
    lang: string;
    label: string;
    subUrl: string; // url_proxy
    id: string;
    url: string;    // original
    url_proxy: string;
}

export interface MappedPlayDataFilmbox {
    subjectId: string;
    se: number;
    episode: number;
    quality: number;
    format: string;
    vid_url: string;
    vid_url_proxy: string;
    hls: MappedPlayHls[] | null;
    dash: MappedPlayDashFilmbox | null;
    sub_url: string | null;
    sub_url_proxy: string | null;
    subtitles: MappedPlaySubtitleFilmbox[];
}

// ___________________________________________________________