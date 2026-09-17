export type Param = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  in: 'query' | 'header' | 'body';
  options?: string[]; // ✨ Tambahkan ini: Opsional array of string
};

export type Endpoint = {
  id: string;
  name: string; // ✨ Properti name berhasil ditambahkan
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params: Param[];
};

export type ApiGroup = {
  name: string;
  tag: string;
  tagColor: string;
  endpoints: Endpoint[];
};

export type ProviderConfig = {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  groups: ApiGroup[];
};

export const providers: Record<string, ProviderConfig> = {
  // --- PROVIDER 2: DRAMAMOVNIME ---
  dramovnime: {
    id: 'dramovnime',
    name: 'Dramovnime',
    logo: '🎬',
    description: 'Anime, Drama, and Movie Streaming Provider.',
    color: 'from-fuchsia-500/20 to-purple-500/20',
    groups: [
      {
        name: "Movie Api Doc",
        tag: "VIDEO",
        tagColor: "bg-blue-500/20 text-blue-400",
        endpoints: [
          {
            id: "tab",
            name: "Bottom Tab",
            method: "GET",
            path: "/api/dramovnime/tab",
            description: "Get bottom tab data",
            params: []
          },
          {
            id: "tabsearch",
            name: "Tab Search",
            method: "GET",
            path: "/api/dramovnime/tabsearch",
            description: "Search within tabs",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "tabId", type: "string", required: false, default: "0", in: "query" },
              { name: "version", type: "string", required: false, in: "query" }
            ]
          },
          {
            id: "filteritems",
            name: "Filter Items",
            method: "GET",
            path: "/api/dramovnime/filteritems",
            description: "Get filter categories for subjects",
            params: [
              { name: "tabId", type: "string", required: true, default: "2", in: "query" },
              { name: "filterItemVer", type: "string", required: false, default: "v3", in: "query" }
            ]
          },
          {
            id: "subject-list",
            name: "Subject List",
            method: "POST",
            path: "/api/dramovnime/list",
            description: "Get paginated list of subjects/movies",
            params: [
              { name: "channelId", type: "string", required: true, default: "2", in: "body" },
              { name: "page", type: "string", required: true, default: "1", in: "body" },
              { name: "perPage", type: "string", required: true, default: "12", in: "body" },
              { name: "sort", type: "string", required: false, default: "ForYou", in: "body" },
              { name: "genre", type: "string", required: false, default: "All", in: "body" },
              { name: "country", type: "string", required: false, default: "All", in: "body" }
            ]
          },
          {
            id: "info",
            name: "Season Info",
            method: "GET",
            path: "/api/dramovnime/info",
            description: "Get season info",
            params: [
              { name: "id", type: "string", required: true, default: "5865563338519757904", in: "query" }
            ]
          },
          {
            id: "detaildata",
            name: "Detail Data",
            method: "GET",
            path: "/api/dramovnime/detaildata",
            description: "Get detail data",
            params: [
              { name: "id", type: "string", required: true, default: "5865563338519757904", in: "query" },
              { name: "detailPath", type: "string", required: false, default: "that-time-i-got-reincarnated-as-a-slime-EwyIkSdliZ6", in: "query" },
              { name: "se", type: "string", required: false, default: "0", in: "query" }
            ]
          },
          {
            id: "dramovnime-getplay",
            name: "Get Play URL",
            method: "GET",
            path: "/api/dramovnime/getplay",
            description: "Get play payload with quality and subtitles",
            params: [
              { name: "id", type: "string", required: true, default: "753945081585059560", in: "query" },
              { name: "se", type: "string", required: false, default: "1", in: "query" },
              { name: "ep", type: "string", required: false, default: "1", in: "query" },
              { name: "quality", type: "string", required: false, in: "query" },
              { name: "lang", type: "string", required: false, default: "in_id", in: "query" },
              {
                name: "detailPath",
                type: "string",
                required: false,
                default: "teach-you-a-lesson-2Z8swXJ4HT",
                description: "Slug nama film (contoh: ashes-to-crown-xxx). Sangat disarankan untuk diisi agar fallback Filmbox berjalan lancar.",
                in: "query"
              }
            ]
          },
          {
            id: "play",
            name: "Play Info",
            method: "GET",
            path: "/api/dramovnime/play",
            description: "Get play info",
            params: [
              { name: "id", type: "string", required: true, in: "query" },
              { name: "se", type: "string", required: false, default: "1", in: "query" },
              { name: "ep", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "subtitle",
            name: "Get Subtitle",
            method: "GET",
            path: "/api/dramovnime/subtitle",
            description: "Get stream captions",
            params: [
              { name: "id", type: "string", required: true, in: "query" },
              { name: "resId", type: "string", required: true, in: "query" },
              { name: "ep", type: "string", required: true, default: "0", in: "query" }
            ]
          }
        ]
      }
    ]
  },

  filmbox: {
    id: 'filmbox',
    name: 'Filmbox',
    logo: '🍿',
    description: 'Premium Movie Database and Streaming Links.',
    color: 'from-sky-500/20 to-emerald-500/20',
    groups: [
      {
        name: "Filmbox Core API",
        tag: "PREMIUM",
        tagColor: "bg-emerald-500/20 text-emerald-400",
        endpoints: [
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/filmbox/home",
            description: "Get home page data (Banners & Categories)",
            params: []
          },
          {
            id: "trending",
            name: "Trending",
            method: "GET",
            path: "/api/filmbox/trending",
            description: "Get trending movies and dramas",
            params: [
              { name: "page", type: "string", required: false, default: "0", in: "query" },
              { name: "perPage", type: "string", required: false, default: "18", in: "query" }
            ]
          },
          {
            id: "18plus-home",
            name: "18+ Midnight Home",
            method: "GET",
            path: "/api/filmbox/18plus",
            description: "Get home page data (Banners & Categories) for Midnight 18+ section",
            params: []
          },
          {
            id: "18plus-trending",
            name: "18+ Midnight Trending",
            method: "GET",
            path: "/api/filmbox/18plus/trending",
            description: "Get trending/suggestion movies for Midnight 18+ section (supports pagination)",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "perPage", type: "string", required: false, default: "18", in: "query" }
            ]
          },
          {
            id: "movie-home",
            name: "Movie Home",
            method: "GET",
            path: "/api/filmbox/movie",
            description: "Get home page data (Banners & Categories) specifically for Movie section",
            params: []
          },
          {
            id: "movie-trending",
            name: "Movie Trending",
            method: "GET",
            path: "/api/filmbox/movie/trending",
            description: "Get trending/suggestion movies for Movie section (supports pagination)",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "perPage", type: "string", required: false, default: "18", in: "query" }
            ]
          },
          {
            id: "section-list",
            name: "Section Content List",
            method: "GET",
            path: "/api/filmbox/section",
            description: "Get full list of movies/series for a specific section using its ID (See All feature)",
            params: [
              { name: "id", type: "string", required: true, default: "8170622407217234072", in: "query" },
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "perPage", type: "string", required: false, default: "20", in: "query" }
            ]
          },
          {
            id: "search",
            name: "Search",
            method: "POST",
            path: "/api/filmbox/search",
            description: "Search for movies, dramas, or animes by keyword",
            params: [
              { name: "keyword", type: "string", required: true, default: "jujutsu kaisen", in: "body" },
              { name: "page", type: "string", required: false, default: "1", in: "body" },
              { name: "perPage", type: "string", required: false, default: "28", in: "body" },
              { name: "subjectType", type: "string", required: false, default: "2", in: "body" }
            ]
          },
          {
            id: "detail",
            name: "Detail Info",
            method: "GET",
            path: "/api/filmbox/details",
            description: "Get detail info for a specific movie",
            params: [
              {
                name: "detailPath",
                type: "string",
                required: true,
                default: "timur-MUyFxi62XA7",
                in: "query"
              },
              {
                name: "id", // Bisa 'id' atau 'subjectId' sesuai backend lu
                type: "string",
                required: false, // Set opsional
                default: "6375320143991919952", // Contoh ID wefeed dari timur
                in: "query"
              }
            ]
          },
          {
            id: "filmbox-getplay",
            name: "Get Play URL",
            method: "GET",
            path: "/api/filmbox/getplay",
            description: "Get playback stream URL and subtitles",
            params: [
              { name: "subjectId", type: "string", required: true, default: "6375320143991919952", in: "query" },
              { name: "detailPath", type: "string", required: true, default: "timur-MUyFxi62XA7", in: "query" },
              { name: "se", type: "string", required: false, default: "0", in: "query" },
              { name: "ep", type: "string", required: false, default: "0", in: "query" },
              { name: "quality", type: "string", required: false, in: "query" },
              { name: "lang", type: "string", required: false, default: "in_id", in: "query" }
            ]
          }
        ]
      }
    ]
  },

  animekompi: {
    id: 'animekompi',
    name: 'Animekompi',
    logo: '🍥',
    description: 'Anime Streaming and Information Provider.',
    color: 'from-yellow-500/20 to-orange-500/20',
    groups: [
      {
        name: "Animekompi Core API",
        tag: "ANIME",
        tagColor: "bg-yellow-500/20 text-yellow-400",
        endpoints: [
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/animekompi/home",
            description: "Get home page data for Animekompi (Supports Pagination)",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "schedule",
            name: "Release Schedule",
            method: "GET",
            path: "/api/animekompi/schedule",
            description: "Get the weekly anime release schedule",
            params: []
          },
          {
            id: "genres",
            name: "Genres",
            method: "GET",
            path: "/api/animekompi/genres",
            description: "Get all available genres from Animekompi",
            params: []
          },
          {
            id: "genre-detail",
            name: "Genre Detail",
            method: "GET",
            path: "/api/animekompi/genre-detail",
            description: "Get detail info for a specific genre",
            params: [
              { name: "genre", type: "string", required: true, default: "romance", in: "query" },
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "list",
            name: "Anime List A-Z",
            method: "GET",
            path: "/api/animekompi/list",
            description: "Get full A-Z anime list from Animekompi",
            params: []
          },
          {
            id: "detail",
            name: "Anime Detail",
            method: "GET",
            path: "/api/animekompi/detail",
            description: "Get detail info for a specific anime",
            params: [
              { name: "path", type: "string", required: true, default: "3d-kanojo-real-girl-season-2", in: "query" }
            ]
          },
          {
            id: "animekompi-play",
            name: "Get Play URL",
            method: "GET",
            path: "/api/animekompi/play",
            description: "Get playback stream URL for a specific anime episode",
            params: [
              { name: "episode_id", type: "string", required: true, default: "a-day-before-us-2-episode-01", in: "query" }
            ]
          }
        ]
      }
    ]
  },

  drakorid: {
    id: 'drakorid',
    name: 'DrakorID',
    logo: 'https://drakorid.co/assets/favicon/android-icon-192x192.png',
    description: 'Korean Drama Streaming and Information Provider.',
    color: 'from-red-500/20 to-pink-500/20',
    groups: [
      {
        name: "DrakorID Core API",
        tag: "DRAKOR",
        tagColor: "bg-red-500/20 text-red-400",
        endpoints: [
          {
            id: "ongoing",
            name: "Ongoing Series",
            method: "GET",
            path: "/api/drakorid/ongoing",
            description: "Get ongoing dramas for DrakorID",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "trending",
            name: "Trending Series",
            method: "GET",
            path: "/api/drakorid/trending",
            description: "Get trending dramas for DrakorID",
            params: []
          },
          {
            id: "terbaru",
            name: "Latest Update",
            method: "GET",
            path: "/api/drakorid/terbaru",
            description: "Get latest dramas for DrakorID",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "cari",
            name: "Search Series",
            method: "GET",
            path: "/api/drakorid/cari",
            description: "Search for dramas on DrakorID",
            params: [
              { name: "q", type: "string", required: true, in: "query" },
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "kategori",
            name: "Categories",
            method: "GET",
            path: "/api/drakorid/kategori",
            description: "Get all available categories for DrakorID",
            params: []
          },
          {
            id: "kategori-detail",
            name: "Category Detail",
            method: "GET",
            path: "/api/drakorid/kategori/detail",
            description: "Get detail info for a specific category",
            params: [
              { name: "slug", type: "string", required: true, default: "film-korea", in: "query" },
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "details",
            name: "Drama Detail",
            method: "GET",
            path: "/api/drakorid/details",
            description: "Get detail info for a specific drama",
            params: [
              { name: "slug", type: "string", required: true, default: "fifties-professionals-2026", in: "query" }
            ]
          },
          {
            id: "drakorid-play",
            name: "Get Play URL",
            method: "POST",
            path: "/api/drakorid/play",
            description: "Get playback stream URL for a specific drama episode",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "fate-chooses-you-2026", // Ubah default dari angka jadi slug
                in: "body",
                description: "Slug drama dari URL, contoh: fate-chooses-you-2026"
              },
              {
                name: "episode",
                type: "string",
                required: true,
                default: "1",
                in: "body"
              },
              {
                name: "quality",
                type: "string",
                required: false,
                default: "720",
                in: "body",
                description: "Resolusi video: 360, 480, atau 720"
              }
            ]
          }
        ]
      }
    ]
  },

  mangaplus: {
    id: 'mangaplus',
    name: 'MangaPlus',
    logo: 'https://mangaplus.shueisha.co.jp/img/web_logo_190118_light-txt.06756983.png',
    description: 'Official Manga Streaming and Information Provider by Shueisha.',
    color: 'from-green-500/20 to-teal-500/20',
    groups: [
      {
        name: "MangaPlus Core API",
        tag: "MANGA",
        tagColor: "bg-green-500/20 text-green-400",
        endpoints: [
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/mangaplus/home",
            description: "Get home data for MangaPlus",
            params: [
              { name: "lang", type: "string", required: false, default: "ind", in: "query" },
            ]
          },
          {
            id: "search",
            name: "Search Manga",
            method: "GET",
            path: "/api/mangaplus/search",
            description: "Search for manga on MangaPlus",
            params: [
              { name: "lang", type: "string", required: false, default: "ind", in: "query" },
              { name: "q", type: "string", required: true, in: "query" }
            ]
          },
          {
            id: "unggulan",
            name: "Featured Titles",
            method: "GET",
            path: "/api/mangaplus/unggulan",
            description: "Get featured titles and rankings for MangaPlus",
            params: [
              { name: "lang", type: "string", required: false, default: "ind", in: "query" },
            ]
          },
          {
            id: "ranking",
            name: "Manga Ranking",
            method: "GET",
            path: "/api/mangaplus/ranking",
            description: "Get ranking data for MangaPlus, type can be hottest, trending, or completed",
            params: [
              { name: "lang", type: "string", required: false, default: "ind", in: "query" },
              { name: "type", type: "string", required: false, default: "hottest", in: "query" }
            ]
          },
          {
            id: "list",
            name: "Manga List",
            method: "GET",
            path: "/api/mangaplus/list",
            description: "Get list of manga with optional type filter (ongoing, completed, one-shot)",
            params: [
              { name: "lang", type: "string", required: false, default: "ind", in: "query" },
              { name: "type", type: "string", required: false, default: "ongoing", in: "query" }
            ]
          },
          {
            id: "detail",
            name: "Manga Detail",
            method: "GET",
            path: "/api/mangaplus/detail",
            description: "Get detail information for a specific manga",
            params: [
              { name: "titleId", type: "string", required: true, default: "400004", in: "query" },
              { name: "lang", type: "string", required: false, default: "ind", in: "query" }
            ]
          },
          {
            id: "mangaku-view",
            name: "Read Chapter",
            method: "GET",
            path: "/api/mangaplus/view",
            description: "Get manga viewer data for a specific chapter",
            params: [
              { name: "chapterId", type: "string", required: true, default: "4002390", in: "query" },
              { name: "lang", type: "string", required: false, default: "ind", in: "query" },
            ]
          }
        ]
      }
    ]
  },
  sinetron: {
    id: 'sinetron',
    name: 'Sinetron',
    logo: 'https://play-lh.googleusercontent.com/-4Ph_6Otp_LtzgubdWuAi6rhhzu6nNzLL-EYICZAA-J4AAxVc5dao8d_2goEN1_URwJU-lgir6OJgW487YIugg',
    description: 'API for Sinetron Indonesia (India) Streaming Service.',
    color: 'from-yellow-500/20 to-red-500/20',
    groups: [
      {
        name: "Sinetron Core API",
        tag: "SINETRON INDONESIA",
        tagColor: "bg-yellow-500/20 text-yellow-400",
        endpoints: [
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/sinetron/home",
            description: "Get home page data for Sinetron",
            params: []
          },
          {
            id: "series",
            name: "Series List",
            method: "GET",
            path: "/api/sinetron/series",
            description: "Get series data for Sinetron",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" }
            ]
          },
          {
            id: "search",
            name: "Search Content",
            method: "GET",
            path: "/api/sinetron/search",
            description: "Search content for Sinetron",
            params: [
              { name: "q", type: "string", required: false, default: "seher", in: "query" },
              { name: "type", type: "string", required: false, default: "movietvserieslive", in: "query" },
              { name: "range_to", type: "string", required: false, default: "2026", in: "query" },
              { name: "range_from", type: "string", required: false, default: "1900", in: "query" },
              { name: "tv_category_id", type: "string", required: false, default: "0", in: "query" },
              { name: "genre_id", type: "string", required: false, default: "0", in: "query" },
              { name: "country_id", type: "string", required: false, default: "0", in: "query" }
            ]
          },
          {
            id: "detail",
            name: "Detail",
            method: "GET",
            path: "/api/sinetron/details",
            description: "Get detail data for Sinetron",
            params: [
              { name: "id", type: "string", required: false, in: "query" },
              { name: "type", type: "string", required: false, default: "tvseries", in: "query" }
            ]
          }
        ]
      }
    ]
  },
  idlix: {
    id: 'idlix',
    name: 'Idlix',
    logo: 'https://z2.idlixku.com/idlix.webp',
    description: 'Api Platform Streaming Online Idlix Not Official',
    color: 'from-red-500/20 to-pink-500/20',
    groups: [
      {
        name: "Idlix Core Api",
        tag: "IDLIX",
        tagColor: "bg-red-500/20 text-red-400",
        endpoints: [
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/idlix/home",
            description: "Get home page data for idlix",
            params: []
          },
          {
            id: "network",
            name: "Network List",
            method: "GET",
            path: "/api/idlix/home/network",
            description: "Get Data by Category Network",
            params: [
              {
                name: "network",
                type: "string",
                required: true,
                default: "netflix",
                in: "query",
                options: [
                  "netflix",
                  "hbo",
                  "prime-video",
                  "disney-plus",
                  "apple-tv-plus",
                ]
              },
              { name: "page", type: "string", required: true, default: "1", in: "query" },
              { name: "limit", type: "string", required: true, default: "36", in: "query" },
              { name: "sort", type: "string", required: true, default: "latest", in: "query", options: ["latest", "popular", "release", "views", "rating"] },
            ]
          },
          {
            id: "movie filter tab",
            name: "Movie Filters",
            method: "GET",
            path: "/api/idlix/movie/filters",
            description: "Detail data for filter tab movies",
            params: []
          },
          {
            id: "movies",
            name: "Movies Catalog",
            method: "GET",
            path: "/api/idlix/movie", // <-- Mengarah ke route Next.js baru kita di atas
            description: "Get Movies with Advanced Filter Options",
            params: [
              { name: "page", type: "string", required: true, default: "1", in: "query" },
              { name: "limit", type: "string", required: true, default: "36", in: "query" },
              {
                name: "sort",
                type: "string",
                required: true,
                default: "releaseDate",
                in: "query",
                options: ["releaseDate", "popularity", "views", "rating", "createdAt"]
              },
              {
                name: "genre",
                type: "string",
                required: false,
                in: "query",
                // Dipetakan dari 'slug' data filter-options kamu
                options: ["action", "adventure", "animation", "comedy", "crime", "documentary", "drama", "family", "fantasy", "history", "horror", "kids", "music", "mystery", "reality", "romance", "science-fiction", "soap", "talk", "thriller", "tv-movie", "war", "western"]
              },
              {
                name: "country",
                type: "string",
                required: false,
                in: "query",
                // Dipetakan dari 'code' data filter-options kamu
                options: ["US", "CN", "ID", "KR", "JP", "GB", "IN", "FR", "DE", "HK", "TW", "TH", "PH", "MY", "SG", "AU", "CA", "BR", "MX", "ES", "IT", "RU"]
              },
              {
                name: "year",
                type: "string",
                required: false,
                in: "query",
                options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"]
              },
              {
                name: "quality",
                type: "string",
                required: false,
                in: "query",
                options: ["WEB-DL", "HD", "BLU-RAY", "4K"]
              }
            ]
          },
          {
            id: "series",
            name: "Series Catalog",
            method: "GET",
            path: "/api/idlix/series", // <-- Mengarah ke route Next.js baru kita di atas
            description: "Get Series with Advanced Filter Options",
            params: [
              { name: "page", type: "string", required: true, default: "1", in: "query" },
              { name: "limit", type: "string", required: true, default: "36", in: "query" },
              {
                name: "sort",
                type: "string",
                required: true,
                default: "releaseDate",
                in: "query",
                options: ["releaseDate", "popularity", "views", "rating", "createdAt"]
              },
              {
                name: "genre",
                type: "string",
                required: false,
                in: "query",
                // Dipetakan dari 'slug' data filter-options kamu
                options: ["action", "adventure", "animation", "comedy", "crime", "documentary", "drama", "family", "fantasy", "history", "horror", "kids", "music", "mystery", "reality", "romance", "science-fiction", "soap", "talk", "thriller", "tv-movie", "war", "western"]
              },
              {
                name: "country",
                type: "string",
                required: false,
                in: "query",
                // Dipetakan dari 'code' data filter-options kamu
                options: ["US", "CN", "ID", "KR", "JP", "GB", "IN", "FR", "DE", "HK", "TW", "TH", "PH", "MY", "SG", "AU", "CA", "BR", "MX", "ES", "IT", "RU"]
              },
              {
                name: "year",
                type: "string",
                required: false,
                in: "query",
                options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"]
              },
            ]
          },
          {
            id: "detail",
            name: "Content Detail",
            method: "GET",
            path: "/api/idlix/detail",
            description: "Get Detail Movie/Series",
            params: [
              { name: "slug", type: "string", required: true, default: "michael-2026", in: "query" },
              {
                name: "type", type: "string", required: true, default: "movies", in: "query",
                options: [
                  "movies",
                  "series",
                ]
              },
            ]
          },
          {
            id: "idlix-getplay",
            name: "Get Play URL",
            method: "GET",
            path: "/api/idlix/getplay",
            description: "Bypass stream url idlix",
            params: [
              { name: "slug", type: "string", required: true, default: "michael-2026", in: "query" },
              {
                name: "id",
                type: "string",
                required: true,
                default: "074d46f6-a071-4303-86a4-172192ff0563",
                in: "query"
              },
              {
                name: "type",
                type: "string",
                required: true,
                default: "movie",
                in: "query",
                options: ["movie", "series"] // 🎯 Langsung jadi custom dropdown senada di UI lu!
              }
            ]
          }
        ]
      }
    ]
  },
  iqiyi: {
    id: 'iqiyi',
    name: 'IQIYI',
    logo: 'https://iq.com/apple-touch-icon-152_152.png',
    description: 'Api Platform Streaming Online IQIYI Not Official',
    color: 'from-green-500/20 to-yellow-500/20',
    groups: [
      {
        name: "IQIYI Core Api",
        tag: "IQIYI",
        tagColor: "bg-green-500/20 text-green-400",
        endpoints: [
          {
            id: "lang",
            name: "Languages",
            method: "GET",
            path: "/api/iqiyi/lang",
            description: "Get list of supported languages for iQIYI API",
            params: [] // Kosongin aja karena gak butuh parameter buat get list bahasanya
          },
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/iqiyi/home",
            description: "Get home page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "trending",
            name: "Trending / Ranking",
            method: "GET",
            path: "/api/iqiyi/trending",
            description: "Get trending/ranking page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "drama",
            name: "Drama",
            method: "GET",
            path: "/api/iqiyi/drama",
            description: "Get drama page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "kdrama",
            name: "K-Drama",
            method: "GET",
            path: "/api/iqiyi/kdrama",
            description: "Get K-Drama page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "movie",
            name: "Movie",
            method: "GET",
            path: "/api/iqiyi/movie",
            description: "Get movie page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "anime",
            name: "Anime",
            method: "GET",
            path: "/api/iqiyi/anime",
            description: "Get anime page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "variety",
            name: "Variety Show",
            method: "GET",
            path: "/api/iqiyi/variety",
            description: "Get variety show page data for iqiyi",
            params: [
              { name: "page", type: "string", required: false, default: "1", in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          {
            id: "search",
            name: "Search Content",
            method: "GET",
            path: "/api/iqiyi/search",
            description: "Search for dramas, movies, or anime on iqiyi",
            params: [
              {
                name: "q",
                type: "string",
                required: true,
                default: "pursuit of jade",
                in: "query"
              }
            ]
          },
          {
            id: "detail",
            name: "Drama Detail",
            method: "GET",
            path: "/api/iqiyi/detail",
            description: "Get detail data for drama",
            params: [
              { name: "pathplay", type: "string", required: true, default: 'love-has-fireworks-episode-1-10fkcnssk4g', in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          },
          // 🎯 ENDPOINT BARU KHUSUS M3U8 & SUBTITLE
          {
            id: "playurl",
            name: "Get Play URL",
            method: "GET",
            path: "/api/iqiyi/play",
            description: "Get streaming raw M3U8 and subtitles for specific episode",
            params: [
              { name: "slug", type: "string", required: true, default: 'love-has-fireworks-episode-1-10fkcnssk4g', in: "query" },
              { name: "lang", type: "string", required: false, default: "id_id", in: "query" }
            ]
          }
        ]
      }
    ]
  },
  vidio: {
    id: 'vidio',
    name: 'Vidio',
    logo: 'https://play-lh.googleusercontent.com/SfWzLXzi9uSRLuy_tnmOrf3h7GFB_zQUcFU6S18l3UzyW1WoF9WqVa-tibyK8_AfXgvPLYMzbUQsRqaYBqCyVQ=w480-h960-rw', // Logo favicon Vidio
    description: 'Api Platform Streaming Online Vidio Not Official',
    color: 'from-red-500/20 to-red-700/20', // Vidio identik dengan gradasi merah
    groups: [
      {
        name: "Vidio Core Api",
        tag: "VIDIO",
        tagColor: "bg-red-500/20 text-red-400",
        endpoints: [
          {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/vidio/home",
            description: "Get home page data for Vidio with mapped categories and sections",
            params: [
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query"
              },
              {
                name: "size",
                type: "number",
                required: false,
                default: "10",
                in: "query"
              }
            ]
          },
          {
            id: "Search",
            name: "Search Content",
            method: "GET",
            path: "/api/vidio/search",
            description: "Get data drama/movie by search",
            params: [
              {
                name: "q",
                type: "string",
                required: true,
                default: "sugar baby",
                in: "query"
              }
            ]
          },
          {
            id: "series",
            name: "Series List",
            method: "GET",
            path: "/api/vidio/series",
            description: "Get series page data for Vidio with mapped categories and sections",
            params: [
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query"
              },
              {
                name: "size",
                type: "number",
                required: false,
                default: "10",
                in: "query"
              }
            ]
          },
          {
            id: "movies",
            name: "Movies List",
            method: "GET",
            path: "/api/vidio/movie",
            description: "Get movies page data for Vidio with mapped categories and sections",
            params: [
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query"
              },
              {
                name: "size",
                type: "number",
                required: false,
                default: "10",
                in: "query"
              }
            ]
          },
          {
            id: "Channel-TV",
            name: "Channel TV",
            method: "GET",
            path: "/api/vidio/channels",
            description: "Get list channel TV livestreaming",
            params: []
          },
          // 🎯 Endpoint 2: Detail (BARU DITAMBAHKAN)
          {
            id: "detail",
            name: "Content Detail",
            method: "GET",
            path: "/api/vidio/detail",
            description: "Get metadata detail for Vidio content (content_profile, video, livestreaming)",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "12714",
                in: "query"
              },
              {
                name: "type",
                type: "string",
                required: false,
                default: "content_profile",
                in: "query",
                description: "Type of content: 'content_profile' (for Series/Movie Cover), 'video', or 'livestreaming'",
                // 👇 Tambahin options di sini
                options: [
                  "content_profile",
                  "video",
                  "livestreaming"
                ]
              }
            ]
          },

          {
            id: "vidio-play",
            name: "Get Play URL",
            method: "GET",
            path: "/api/vidio/play",
            description: "Get streaming raw M3U8, DASH, and Subtitles for a specific video",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "9339782",
                in: "query"
              },
              {
                name: "type",
                type: "string",
                required: false,
                default: "video",
                in: "query",
                description: "Type of play request: 'video' or 'livestreaming'",
                // 👇 Tambahin options di sini
                options: [
                  "video",
                  "livestreaming"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  komiku: {
    id: 'komiku',
    name: 'Komiku',
    logo: '<svg class="svg-inline--fa fa-korvue fa-w-14" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="korvue" role="img" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 446 512"><path fill="currentColor" d="M386.5 34h-327C26.8 34 0 60.8 0 93.5v327.1C0 453.2 26.8 480 59.5 480h327.1c33 0 59.5-26.8 59.5-59.5v-327C446 60.8 419.2 34 386.5 34zM87.1 120.8h96v116l61.8-116h110.9l-81.2 132H87.1v-132zm161.8 272.1l-65.7-113.6v113.6h-96V262.1h191.5l88.6 130.8H248.9z"></path></svg>', // Default favicon Komiku
    description: 'Api Scraping Web Komiku.org Not Official',
    color: 'from-blue-500/20 to-blue-700/20', // Komiku kita kasih tema biru
    groups: [
      {
        name: "Komiku Core Api",
        tag: "KOMIKU",
        tagColor: "bg-blue-500/20 text-blue-400",
        endpoints: [

          {
            id: "filters",
            name: "Komik Filters",
            method: "GET",
            path: "/api/komiku/filters",
            description: "Mengambil data opsi filter secara real-time dari website Komiku (orderby, tipe, genre, status) untuk digunakan pada form pencarian/pustaka.",
            params: [] // Nggak butuh parameter apa-apa
          }, {
            id: "home",
            name: "Home",
            method: "GET",
            path: "/api/komiku/home/home",
            description: "Get home page data including Komik Terbaru and Populer sections",
            params: [] // Tidak butuh parameter tambahan untuk saat ini
          },
          {
            id: "terbaru",
            name: "Komik Terbaru",
            method: "GET",
            path: "/api/komiku/terbaru",
            description: "Get daftar komik pustaka/terbaru dengan dukungan filter dan pagination",
            params: [
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query",
                description: "Halaman yang ingin diambil"
              },
              {
                name: "orderby",
                type: "string",
                required: false,
                default: "modified",
                in: "query",
                description: "Urutkan berdasarkan",
                options: ["modified", "meta_value_num", "date", "rand"]
              },
              {
                name: "tipe",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Tipe komik",
                options: ["", "manga", "manhwa", "manhua"]
              },
              {
                name: "status",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Status komik",
                options: ["", "ongoing", "end"]
              },
              {
                name: "genre",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Filter berdasarkan Genre 1",
                // 👇 Ini dia list dropdown genrenya bre
                options: [
                  "", "academy", "action", "adaptation", "adult", "adventure", "apocalypse", "beasts",
                  "blacksmith", "comedy", "comic", "cooking", "crime", "crossdressing", "dark-fantasy",
                  "demon", "demons", "doujinshi", "drama", "ecchi", "entertainment", "fantasy", "fight",
                  "game", "gender-bender", "genderswap", "genius", "ghosts", "gore", "gyaru", "harem",
                  "hentai", "historical", "horror", "isekai", "josei", "knight", "long-strip", "magic",
                  "magical-girls", "manga", "mangatoon", "manhwa", "martial-art", "martial-arts", "mature",
                  "mc-rebirth", "mecha", "medical", "military", "monster", "monster-girls", "monsters",
                  "murim", "music", "mystery", "office-workers", "one-shot", "oneshot", "police",
                  "psychological", "regression", "reincarnation", "revenge", "romance", "school",
                  "school-life", "sci-fi", "seinen", "sexual-violence", "shotacon", "shoujo", "shoujo-ai",
                  "shoujog", "shounen", "shounen-ai", "slice-of-life", "slow-life", "smut", "sport",
                  "sports", "strategy", "super-power", "supernatural", "survival", "sword-fight",
                  "sword-master", "swormanship", "system", "thriller", "time-travel", "tragedy",
                  "trauma", "vampire", "video-games", "villainess", "violence", "web-comic", "webtoon",
                  "webtoons", "xianxia", "xuanhuan", "yuri"
                ]
              },
              {
                name: "genre2",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Filter berdasarkan Genre 2 (kombinasi)",
                // 👇 Samain aja optionsnya dengan genre 1
                options: [
                  "", "academy", "action", "adaptation", "adult", "adventure", "apocalypse", "beasts",
                  "blacksmith", "comedy", "comic", "cooking", "crime", "crossdressing", "dark-fantasy",
                  "demon", "demons", "doujinshi", "drama", "ecchi", "entertainment", "fantasy", "fight",
                  "game", "gender-bender", "genderswap", "genius", "ghosts", "gore", "gyaru", "harem",
                  "hentai", "historical", "horror", "isekai", "josei", "knight", "long-strip", "magic",
                  "magical-girls", "manga", "mangatoon", "manhwa", "martial-art", "martial-arts", "mature",
                  "mc-rebirth", "mecha", "medical", "military", "monster", "monster-girls", "monsters",
                  "murim", "music", "mystery", "office-workers", "one-shot", "oneshot", "police",
                  "psychological", "regression", "reincarnation", "revenge", "romance", "school",
                  "school-life", "sci-fi", "seinen", "sexual-violence", "shotacon", "shoujo", "shoujo-ai",
                  "shoujog", "shounen", "shounen-ai", "slice-of-life", "slow-life", "smut", "sport",
                  "sports", "strategy", "super-power", "supernatural", "survival", "sword-fight",
                  "sword-master", "swormanship", "system", "thriller", "time-travel", "tragedy",
                  "trauma", "vampire", "video-games", "villainess", "violence", "web-comic", "webtoon",
                  "webtoons", "xianxia", "xuanhuan", "yuri"
                ]
              }
            ]
          },
          {
            id: "populer",
            name: "Komik Populer",
            method: "GET",
            path: "/api/komiku/populer",
            description: "Get daftar komik populer (hot) dengan dukungan filter dan pagination",
            params: [
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query",
                description: "Halaman yang ingin diambil"
              },
              {
                name: "orderby",
                type: "string",
                required: false,
                default: "modified",
                in: "query",
                description: "Urutkan berdasarkan",
                options: ["modified", "meta_value_num", "date", "rand"]
              },
              {
                name: "tipe",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Tipe komik",
                options: ["", "manga", "manhwa", "manhua"]
              }
            ]
          },
          {
            id: "search",
            name: "Search Komik",
            method: "GET",
            path: "/api/komiku/search",
            description: "Mencari komik berdasarkan judul",
            params: [
              {
                name: "q",
                type: "string",
                required: true,
                default: "one piece",
                in: "query",
                description: "Kata kunci pencarian komik"
              }
            ]
          },
          {
            id: "detail",
            name: "Comic Detail",
            method: "GET",
            path: "/api/komiku/detail",
            description: "Get detail metadata, synopsis, and chapter list for a specific comic",
            params: [
              {
                name: "slug",
                type: "string",
                required: true,
                default: "i-became-the-first-prince",
                in: "query",
                description: "Slug dari URL komik (contoh: one-piece, jujutsu-kaisen)"
              }
            ]
          },
          {
            id: "komiku-view",
            name: "Read Chapter",
            method: "GET",
            path: "/api/komiku/view",
            description: "Get daftar gambar komik dan navigasi untuk sebuah chapter spesifik",
            params: [
              {
                name: "slug",
                type: "string",
                required: true,
                default: "one-piece",
                in: "query",
                description: "Slug dari komik (contoh: one-piece)"
              },
              {
                name: "chapter",
                type: "string",
                required: true,
                default: "1110",
                in: "query",
                description: "Nomor chapter yang ingin dibaca (contoh: 1110 atau 1110.5)"
              }
            ]
          }
        ]
      }
    ]
  },
  viu: {
    id: 'viu',
    name: 'Viu',
    logo: 'https://www.viu.com/favicon.ico',
    description: 'Unofficial Viu API to fetch Asian K-dramas, movies, and anime. Access streaming metadata, premium subscription status, and raw M3U8 links.',
    color: 'from-yellow-400/20 to-orange-500/20',
    groups: [
      {
        name: "Viu Core Api",
        tag: "VIU",
        tagColor: "bg-yellow-500/20 text-yellow-500",
        endpoints: [
          // {
          //   id: "viu-status",
          //   name: "Subscription Status",
          //   method: "GET",
          //   path: "/api/viu/status",
          //   description: "Check Viu user premium subscription status, active offers, and partner bundling details.",
          //   params: []
          // },
          {
            id: "viu-languages",
            name: "Language List",
            method: "GET",
            path: "/api/viu/languages",
            description: "Get a list of supported language codes for content metadata.",
            params: []
          },
          {
            id: "viu-categories",
            name: "Category List",
            method: "GET",
            path: "/api/viu/categories",
            description: "Get a list of all available Viu content categories (e.g., Drama Korea, Anime, Viu Original).",
            params: []
          },
          {
            id: "viu-home",
            name: "Home",
            method: "GET",
            path: "/api/viu/home",
            description: "Fetch Viu homepage content including latest K-dramas, trending Asian movies, and premium banner carousels.",
            params: [
              {
                name: "country",
                type: "string",
                required: false,
                default: "ID",
                // Tambahkan enum biar jadi dropdown di UI
                options: ["ID", "MY"],
                description: "Country code for content region.",
                in: "query"
              },
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                // Tambahkan enum untuk dropdown bahasa
                options: ["id", "en"],
                description: "Language code for the metadata.",
                in: "query"
              }
            ]
          },
          {
            id: "viu-category",
            name: "Category Detail",
            method: "GET",
            path: "/api/viu/category",
            description: "Browse content list by category ID with pagination support.",
            params: [
              { name: "category_id", type: "string", required: true, default: "549", in: "query" },
              { name: "length", type: "number", required: false, default: "44", in: "query" },
              { name: "offset", type: "number", required: false, default: "0", in: "query" }
            ]
          },
          {
            id: "viu-search",
            name: "Search Content",
            method: "GET",
            path: "/api/viu/search",
            description: "Search for dramas, movies, or episodes. Use 'field' param for filtering (series, movie, product).",
            params: [
              {
                name: "q",
                type: "string",
                required: true,
                default: "perfect",
                in: "query"
              },
              {
                name: "field",
                type: "string",
                required: false,
                options: ["series", "movie", "product"], // 🎯 Diganti jadi options
                description: "Filter search results by type",
                in: "query"
              },
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query"
              },
              {
                name: "limit",
                type: "number",
                required: false,
                default: "16",
                in: "query"
              }
            ]
          },
          {
            id: "viu-detail",
            name: "Series Detail",
            method: "GET",
            path: "/api/viu/detail",
            description: "Get series details and full episode list by series_id.",
            params: [
              {
                name: "series_id",
                type: "string",
                required: true,
                default: "103335",
                in: "query"
              }
            ]
          },
          {
            id: "viu-play",
            name: "Get Play URL",
            method: "GET",
            path: "/api/viu/play",
            description: "Retrieve streaming URLs (M3U8) and subtitle tracks for a specific product/episode.",
            params: [
              { name: "product_id", type: "string", required: true, default: "3099766", in: "query" },
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                // Tambahkan enum untuk dropdown bahasa
                options: ["id", "en"],
                description: "Language code for the metadata.",
                in: "query"
              },
              { name: "quality", type: "string", required: false, in: "query" },
            ]
          }
        ]
      }
    ]
  },
  primevideo: {
    id: 'primevideo',
    name: 'Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Amazon_Prime_Video_blue_logo_1.svg/500px-Amazon_Prime_Video_blue_logo_1.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20230318051251',
    description: 'Unofficial Prime Video API to fetch series/movie metadata, DASH stream URLs (MPD), subtitles, and Widevine DRM licenses.',
    color: 'from-blue-600/20 to-cyan-500/20',
    groups: [
      {
        name: "Prime Video Core API",
        tag: "PRIME",
        tagColor: "bg-blue-500/20 text-blue-500",
        endpoints: [
          // 🚀 TAMBAHAN ENDPOINT HOME DI SINI
          {
            id: "primevideo-home",
            name: "Home Storefront",
            method: "GET",
            path: "/api/primevideo/home",
            description: "Get the Prime Video Home storefront data.",
            params: []
          },
          {
            id: "primevideo-movie",
            name: "Movie Storefront",
            method: "GET",
            path: "/api/primevideo/movie",
            description: "Get the Prime Video Film storefront data.",
            params: []
          },
          {
            id: "primevideo-tv",
            name: "TV Show Storefront",
            method: "GET",
            path: "/api/primevideo/tv",
            description: "Get the Prime Video Acara TV storefront data.",
            params: []
          },
          // 🚀 TAMBAHAN ENDPOINT SEARCH DI SINI
          {
            id: "primevideo-search",
            name: "Search Content",
            method: "GET",
            path: "/api/primevideo/search",
            description: "Search for movies or TV shows on Prime Video.",
            params: [
              {
                name: "q",
                type: "string",
                required: true,
                default: "the ghost in the shell",
                description: "The search query or phrase to find movies/series.",
                in: "query"
              }
            ]
          },
          {
            id: "primevideo-detail",
            name: "Title Detail",
            method: "GET",
            path: "/api/primevideo/detail",
            description: "Get movie/series details and episode list along with their DRM playback envelopes.",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "0NKUDJIM5VAE9079ZGUUVI3SS4", // Compact ID Drakor See You at Work Tomorrow!
                description: "The Amazon Prime Video Title ID (Series or Movie) extracted from the URL.",
                in: "query"
              }
            ]
          },
          {
            id: "primevideo-play",
            name: "Get Play URL",
            method: "POST",
            path: "/api/primevideo/play",
            description: "Exchange short envelope ID (shortid) for MPD stream URL, DRM custom data, and subtitle tracks.",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "amzn1.dv.gti.6ede2474-f89f-4e84-b1ad-6eb1f226d197",
                description: "The specific Episode or Movie Title ID.",
                in: "body"
              },
              {
                name: "shortid", // Ubah jadi env
                type: "string",
                required: true,
                default: "a1b2c3d4e5", // Short ID dari respon detail
                description: "The short playback envelope ID obtained from the detail endpoint.",
                in: "body"
              }
            ]
          },
          {
            id: "primevideo-license",
            name: "DRM License Proxy",
            method: "POST",
            path: "/api/primevideo/license",
            description: "Widevine DRM License Proxy. Normally called directly by Shaka/Video.js Player. Requires Raw Binary Challenge in Body.",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "amzn1.dv.gti.22635f32-1462-4803-86d8-2b6dcc70b6f0",
                description: "The specific Episode or Movie Title ID.",
                in: "query"
              },
              {
                name: "shortid", // Ubah jadi env
                type: "string",
                required: true,
                default: "a1b2c3d4e5", // Short ID dari respon detail
                description: "The short playback envelope ID obtained from the detail endpoint.",
                in: "query"
              },
            ]
          }
        ]
      }
    ]
  },
  moviebox: {
    id: 'moviebox',
    name: 'MovieBox',
    // Bisa ganti logo sesuai selera, ini pakai placeholder logo clapperboard
    logo: 'https://h5-static.aoneroom.com/ssrStatic/mbOfficial/public/_nuxt/image-1.apJjVir2.svg',
    description: 'Unofficial MovieBox (OneRoom) API to fetch home storefront, movie/series details, and stream data bypassing HMAC signature.',
    color: 'from-emerald-600/20 to-teal-500/20',
    groups: [
      {
        name: "MovieBox Core API",
        tag: "MOVIEBOX",
        tagColor: "bg-emerald-500/20 text-emerald-500",
        endpoints: [
          // 🚀 ENDPOINT HOME TAB YANG BARU DIBUAT
          {
            id: "moviebox-hometab",
            name: "Home Tab & Navigation",
            method: "GET",
            path: "/api/moviebox/hometab",
            description: "Get the MovieBox bottom navigation tabs and primary UI layout.",
            params: []
          },
          // 🚀 ENDPOINT TAB DATA
          {
            id: "moviebox-tabdata",
            name: "Tab Content Data",
            method: "GET",
            path: "/api/moviebox/tabdata",
            description: "Fetch content for a specific tab based on tabId and page parameter.",
            params: [
              {
                name: "page",
                type: "string", // atau "number" tergantung definisi sistem UI kamu
                required: false,
                default: "1",
                description: "Page number for pagination.",
                in: "query"
              },
              {
                name: "tabId",
                type: "string",
                required: false,
                default: "0",
                // Sesuaikan opsi ini dengan ID yang muncul di response hometab
                options: ["0", "1", "2", "3", "4"],
                description: "ID of the tab to fetch (e.g., 0 for Home, 1 for Movies, etc.).",
                in: "query"
              },
              {
                name: "version",
                type: "string",
                required: false,
                default: "", // Kosongkan saja default-nya, nanti di-handle dari .env di backend
                description: "Tab version hash (optional, defaults to .env variable).",
                in: "query"
              }
            ]
          },
          // 🚀 ENDPOINT SUBJECT DETAIL & SEASON INFO
          {
            id: "moviebox-detail",
            name: "Subject Detail & Season Info",
            method: "GET",
            path: "/api/moviebox/detail",
            description: "Fetch comprehensive details and season/episode information for a movie or series by combining upstream detail and season APIs.",
            params: [
              {
                name: "subjectId",
                type: "string",
                required: true,
                description: "Unique identifier for the movie or series (e.g., 6093200780452941384).",
                in: "query"
              }
            ]
          },
          // 🚀 ENDPOINT GET PLAY (COMBINED DASH, MP4, SUBTITLES)
          {
            id: "moviebox-getplay",
            name: "Combined Play Data (BFF)",
            method: "GET",
            path: "/api/moviebox/getplay",
            description: "Fetches and combines adaptive streaming (DASH), MP4 resource links, and subtitle captions into a single response to optimize frontend loading.",
            params: [
              {
                name: "subjectId",
                type: "string",
                required: true,
                description: "Unique identifier for the movie or series.",
                in: "query"
              },
              {
                name: "se",
                type: "string",
                required: false,
                default: "1",
                description: "Season number.",
                in: "query"
              },
              {
                name: "ep",
                type: "string",
                required: false,
                default: "1",
                description: "Episode number.",
                in: "query"
              }
            ]
          },
          // 🚀 ENDPOINT MOVIE/EPISODE RESOURCES (PLAY LINKS)
          {
            id: "moviebox-play",
            name: "Video Resource Links",
            method: "GET",
            path: "/api/moviebox/play",
            description: "Fetch actual direct streaming/download links (MP4/HLS) for episodes or movies. Contains time-sensitive CDN tokens.",
            params: [
              {
                name: "subjectId",
                type: "string",
                required: true,
                description: "Unique identifier for the movie or series.",
                in: "query"
              },
              {
                name: "se",
                type: "string",
                required: false,
                default: "1",
                description: "Season number.",
                in: "query"
              },
              {
                name: "resolution",
                type: "string",
                required: false,
                default: "0",
                description: "Target resolution (0 for auto/lowest, 360, 480, 720, 1080).",
                in: "query"
              },
              {
                name: "page",
                type: "string",
                required: false,
                default: "1",
                description: "Page number for listing episodes.",
                in: "query"
              },
              {
                name: "perPage",
                type: "string",
                required: false,
                default: "10",
                description: "Number of episodes to fetch per request.",
                in: "query"
              }
            ]
          },
          // 🚀 ENDPOINT DASH ADAPTIVE STREAMING (PLAY-INFO)
          {
            id: "moviebox-play-info",
            name: "Adaptive Streaming (DASH/MPD)",
            method: "GET",
            path: "/api/moviebox/playdash",
            description: "Fetch premium adaptive streaming manifest (.mpd) with AWS CloudFront Signed Cookies. Best for in-app or web video players.",
            params: [
              {
                name: "subjectId",
                type: "string",
                required: true,
                description: "Unique identifier for the movie or series.",
                in: "query"
              },
              {
                name: "se",
                type: "string",
                required: false,
                default: "1",
                description: "Season number.",
                in: "query"
              },
              {
                name: "ep",
                type: "string",
                required: false,
                default: "1",
                description: "Episode number.",
                in: "query"
              }
            ]
          },
          // 🚀 ENDPOINT SUBTITLES (CAPTIONS)
          {
            id: "moviebox-captions",
            name: "Video Subtitles (.srt)",
            method: "GET",
            path: "/api/moviebox/subtitles",
            description: "Fetch subtitle (.srt) links for a specific video stream. Returns time-sensitive AWS signed URLs.",
            params: [
              {
                name: "subjectId",
                type: "string",
                required: true,
                description: "Unique identifier for the movie or series.",
                in: "query"
              },
              {
                name: "streamId",
                type: "string",
                required: true,
                description: "The resourceId of the specific video stream/episode being played.",
                in: "query"
              }
            ]
          },
        ]
      }
    ]
  },
  hbo: {
    id: 'hbo',
    name: 'HBO Max (WBD)',
    // Placeholder logo HBO Max (Ganti sama URL logo yang lu punya kalo ada)
    logo: 'https://static.cdn.turner.com/inline-images/1d006709-499e-952e-288a-c9a16d0b0766.png',
    description: 'Unofficial HBO Max / Max API to fetch curated storefronts, bypassing geo-restrictions and proxying session authentication.',
    color: 'from-purple-600/20 to-blue-500/20', // Warna tema ala Max (Biru/Ungu)
    groups: [
      {
        name: "HBO Core API",
        tag: "MAX",
        tagColor: "bg-blue-500/20 text-blue-500",
        endpoints: [
          // 🚀 ENDPOINT HOMEPAGE YANG BARU DIBUAT
          {
            id: "hbo-home",
            name: "Homepage & Collections",
            method: "GET",
            path: "/api/hbo/home",
            description: "Get the primary HBO Max storefront including Hero Banners, Top 10 lists, and personalized content rows.",
            params: []
          },
          // 🎬 ENDPOINT SERIES YANG BARU DITAMBAHIN
          {
            id: "hbo-series",
            name: "Series & TV Shows Hub",
            method: "GET",
            path: "/api/hbo/series",
            description: "Get the HBO Max Series landing page, including brand hubs (Adult Swim, TLC, HBO, etc.), K-Drama, and series collections.",
            params: [
            ]
          },
          {
            id: "hbo-movies",
            name: "Movies",
            method: "GET",
            path: "/api/hbo/movies",
            description: "Get the HBO Max Movies landing page, including brand hubs (Adult Swim, TLC, HBO, etc.), K-Drama, and series collections.",
            params: [
            ]
          },
          {
            id: "hbo-explore",
            name: "Explore / Catalog",
            method: "GET",
            path: "/api/hbo/explore",
            description: "Get lists of content based on Category, Channel, or Collection",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                default: "action",
                in: "query",
                description: "ID of the target (e.g., 'action' for genre, 'c0d1f27a-...' for channel, or collection ID)"
              },
              {
                name: "type",
                type: "string",
                required: true,
                default: "genre",
                in: "query",
                description: "Type of content grouping",
                options: [
                  "genre",
                  "channel",
                  "collection"
                ]
              },
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query",
                description: "Page number (Only applies if type is 'collection')"
              }
            ]
          },
          {
            id: "hbo-detail",
            name: "Show/Movie Detail",
            method: "GET",
            path: "/api/hbo/detail",
            description: "Get detailed information about a specific Show or Movie including episodes and recommendations",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                in: "query",
                description: "Target ID of the Show/Movie (e.g., '6f7eb3df-4232-4252-8ef1-df3a02505e99')"
              }
            ]
          },

          {
            id: "hbo-play",
            name: "Get Url Stream",
            method: "GET",
            path: "/api/hbo/play",
            description: "Get Stream url, subtitle url & Drm",
            params: [
              {
                name: "id",
                type: "string",
                required: true,
                in: "query",
                description: "Target ID of the episode id (e.g., '6f7eb3df-4232-4252-8ef1-df3a02505e99')"
              }
            ]
          },
        ]
      }
    ]
  },
  wetv: {
    id: 'wetv',
    name: 'WeTV Unofficial API',
    logo: 'https://static.wikia.nocookie.net/drama/images/8/88/Tencent_Video.png/revision/latest/thumbnail/width/360/height/450?cb=20200703120416',
    description: 'Layanan REST API Unofficial untuk mengambil data platform streaming WeTV. Dapatkan akses lengkap ke metadata film, Drama Asia (Tiongkok, Korea, Thailand, Indonesia), Anime, Variety Show, hingga dukungan ekstraksi link streaming m3u8 kualitas HD dan Subtitle Multi-bahasa.',
    color: 'from-blue-400/20 to-orange-500/20',
    groups: [
      {
        name: "WeTV Core Api",
        tag: "WETV",
        tagColor: "bg-blue-500/20 text-blue-500",
        endpoints: [
          {
            id: "lang",
            name: "Language List",
            method: "GET",
            path: "/api/wetv/lang",
            description: "Mengambil daftar lengkap kode bahasa (language codes) yang didukung oleh sistem WeTV. Digunakan untuk keperluan lokalisasi UI, sinopsis cerita, terjemahan judul, dan subtitle video.",
            params: []
          },
          {
            id: "home",
            name: "Home Page Feed",
            method: "GET",
            path: "/api/wetv/home",
            description: "Mengambil data lengkap halaman utama (Home / Beranda) WeTV. Endpoint ini mengembalikan susunan carousel banner promosi, daftar rekomendasi WeTV Hot, seri terbaru, hingga konten eksklusif yang segera tayang (Coming Soon).",
            params: [
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                in: "query",
                description: "Kode bahasa lokalisasi response (judul & deskripsi) WeTV",
                options: [
                  "en", "id", "ja", "ko", "hi", "ar", "bn", "fr", "es",
                  "ru", "ta", "te", "ml", "pt", "de", "th", "vi", "zh", "zh-tw"
                ]
              }
            ]
          },
          {
            id: "feed",
            name: "Channel Feed API",
            method: "GET",
            path: "/api/wetv/channel",
            description: "Mendapatkan daftar feed atau section rekomendasi konten (Film, Drama, Anime) berdasarkan ID Channel spesifik di WeTV. Telah dilengkapi dengan dukungan Infinite Scroll / Pagination via context token untuk meload data halaman berikutnya.",
            params: [
              {
                name: "id",
                type: "string",
                required: false,
                default: "1001",
                in: "query",
                description: "ID Channel WeTV (Contoh: 1001 untuk Home/Untukmu, 10022 untuk Anime, 10054 untuk Mandarin)"
              },
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                in: "query",
                description: "Kode bahasa lokalisasi response judul dan sinopsis",
                options: [
                  "en", "id", "ja", "ko", "hi", "ar", "bn", "fr", "es",
                  "ru", "ta", "te", "ml", "pt", "de", "th", "vi", "zh", "zh-tw"
                ]
              },
              {
                name: "pageCtx",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Context Token untuk Pagination (Infinite Scroll). Didapatkan dari properti 'nextPageContext' pada request API sebelumnya."
              }
            ]
          },
          {
            id: "explore-filters",
            name: "Get Explore Filters",
            method: "GET",
            path: "/api/wetv/explore/filters",
            description: "Mengambil metadata dan daftar master filter WeTV (Kategori/Saluran, Genre, Negara Produksi, Tahun Rilis, dan Status VIP/Gratis). Sangat berguna untuk membangun UI dropdown filter yang dinamis pada halaman pencarian/eksplorasi frontend.",
            params: [
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                in: "query",
                description: "Bahasa output label filter (Contoh: 'Tahun' atau 'Year')",
                options: [
                  "en", "id", "ja", "ko", "hi", "ar", "bn", "fr", "es",
                  "ru", "ta", "te", "ml", "pt", "de", "th", "vi", "zh", "zh-tw"
                ]
              }
            ]
          },
          {
            id: "explore",
            name: "Explore & Filtering",
            method: "GET",
            path: "/api/wetv/explore",
            description: "Mencari dan menyaring daftar tayangan film, serial drama, atau anime di WeTV secara spesifik. Endpoint ini mendukung parameter multi-filter (urutkan, kategori, negara, tahun rilis, tipe akses VIP/Gratis) serta sistem pagination (Infinite Scroll).",
            params: [
              {
                name: "sort",
                type: "string",
                required: false,
                default: "1",
                in: "query",
                description: "Metode pengurutan hasil (1 = Terbaru, 2 = Terpopuler, 4 = Rating Tertinggi)",
                options: ["1 (Terbaru)", "2 (Terpopuler)", "4 (Rating)"]
              },
              {
                name: "first_category",
                type: "string",
                required: false,
                default: "0",
                in: "query",
                description: "Filter Kategori Utama WeTV",
                options: ["0 (Semua)", "1 (Film)", "2 (Serial)", "3 (Anime)", "9 (Dokumenter)", "10 (Variety Show)", "106 (Anak)"]
              },
              {
                name: "area_id",
                type: "string",
                required: false,
                default: "0",
                in: "query",
                description: "Filter Negara Produksi",
                options: ["0 (Semua)", "153513 (Indonesia)", "153505 (Tiongkok)", "153574 (Korea Selatan)", "153538 (Jepang)", "153548 (Thailand)", "153576 (Malaysia)"]
              },
              {
                name: "pay_status",
                type: "string",
                required: false,
                default: "0",
                in: "query",
                description: "Filter Akses / Jenis Konten",
                options: ["0 (Semua)", "1 (Khusus VIP)", "2 (Tonton Gratis)"]
              },
              {
                name: "year",
                type: "string",
                required: false,
                default: "0",
                in: "query",
                description: "Filter Tahun Rilis (Kirim angka tahun, contoh: 2024, 2023. Kirim 0 untuk Semua Tahun)"
              },
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                in: "query",
                description: "Bahasa output metadata konten",
                options: [
                  "en", "id", "ja", "ko", "hi", "ar", "bn", "fr", "es",
                  "ru", "ta", "te", "ml", "pt", "de", "th", "vi", "zh", "zh-tw"
                ]
              },
              {
                name: "pageCtx",
                type: "string",
                required: false,
                default: "",
                in: "query",
                description: "Token Pagination dari request sebelumnya. Jika diisi, filter lain akan diabaikan karena filter sudah ter-encode secara otomatis di dalam token ini."
              }
            ]
          },
          {
            id: "search",
            name: "Search Video",
            method: "GET",
            path: "/api/wetv/search",
            description: "Mencari film, drama, anime, atau variety show berdasarkan kata kunci (judul, aktor, atau topik). Mendukung pagination.",
            params: [
              {
                name: "q",
                type: "string",
                required: true,
                default: "perfect",
                in: "query",
                description: "Kata kunci pencarian (Judul film, nama aktor/aktris, dll)"
              },
              {
                name: "page",
                type: "number",
                required: false,
                default: "1",
                in: "query",
                description: "Nomor halaman untuk pagination hasil pencarian"
              },
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                in: "query",
                description: "Bahasa output metadata konten",
                options: [
                  "en", "id", "ja", "ko", "hi", "ar", "bn", "fr", "es",
                  "ru", "ta", "te", "ml", "pt", "de", "th", "vi", "zh", "zh-tw"
                ]
              }
            ]
          },
          {
            id: "detail",
            name: "Drama Detail & Episodes",
            method: "GET",
            path: "/api/wetv/detail",
            description: "Mengambil informasi metadata detail dari sebuah konten (Series/Film), mencakup sinopsis lengkap, rating, daftar genre, cover poster, serta daftar lengkap episode utama, cuplikan (trailer), dan konten ekstra (BTS/Bloopers).",
            params: [
              {
                name: "cid",
                type: "string",
                required: true,
                default: "f5ya6dcwpdeqqfv",
                in: "query",
                description: "Content ID (cid) unik dari series atau film yang dituju"
              },
              {
                name: "lang",
                type: "string",
                required: false,
                default: "id",
                in: "query",
                description: "Kode bahasa lokalisasi sinopsis dan judul episode",
                options: [
                  "en", "id", "ja", "ko", "hi", "ar", "bn", "fr", "es",
                  "ru", "ta", "te", "ml", "pt", "de", "th", "vi", "zh", "zh-tw"
                ]
              }
            ]
          },
          {
            id: "play",
            name: "Generate Play URL",
            method: "GET",
            path: "/api/wetv/play",
            description: "Menghasilkan link streaming m3u8 video (Play URL) dari server WeTV, beserta daftar resolusi HD/FHD dan daftar URL Subtitle multi-bahasa berformat VTT. Jika konten dilindungi (VIP), sistem bypass stream akan diaktifkan secara otomatis.",
            params: [
              {
                name: "cid",
                type: "string",
                required: true,
                default: "f5ya6dcwpdeqqfv",
                in: "query",
                description: "Content ID (cid) milik induk series atau film"
              },
              {
                name: "vid",
                type: "string",
                required: true,
                default: "v4102rjghmt",
                in: "query",
                description: "Video ID (vid) unik untuk memutar episode spesifik"
              },
              {
                name: "defn",
                type: "string",
                required: false,
                default: "shd",
                in: "query",
                description: "Permintaan kualitas resolusi streaming (SD hingga Full HD)",
                options: ["fhd", "shd", "hd", "sd"]
              }
            ]
          }
        ]
      }
    ]
  }
};