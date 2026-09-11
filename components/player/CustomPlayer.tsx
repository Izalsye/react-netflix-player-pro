'use client';

import { useRef, useState, useEffect } from 'react';
import { useVideoEngine } from './useVideoEngine';
import { formatTime } from './playerUtils';

interface VideoPlayerProps {
    src: string;
    qualities?: any[];
    subtitles?: any[];
    licenseServers?: any;
    customData?: any;
    provider?: string;
    audioConf?: any;
    meta?: {
        title: string; season: number; year: number; genre: string; qualityTag: string; episodeTitle: string; description: string;
        // 🔥 DATA INTRO DARI API (Opsional)
        introStart?: number;
        introEnd?: number;
    };
    episodes?: any[];
    onBack?: () => void;
    currentEpisodeIndex?: number;
    onPlayEpisode?: (ep: any, index: number) => void;
    seasons?: any[];
    currentSeasonIndex?: number;
    onSeasonChange?: (index: number) => void;
}

export default function CustomPlayer({
    src, provider, customData, licenseServers, subtitles, audioConf, meta, episodes, onBack, currentEpisodeIndex, onPlayEpisode, seasons, currentSeasonIndex, onSeasonChange
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        isVideoReady,
        availableSubtitles, changeSubtitle,
        availableAudios, changeAudio,
        availableQualities, changeQuality,
        playbackRate, changeSpeed
    } = useVideoEngine(videoRef, src, provider, customData, licenseServers, audioConf, subtitles);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [activeMenu, setActiveMenu] = useState<'none' | 'episodes' | 'audioSub' | 'settings' | 'season'>('none');

    // 🔥 STATE FITUR DEWA 🔥
    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [showNextPrompt, setShowNextPrompt] = useState(false);
    const [countdownNext, setCountdownNext] = useState(15);
    const isAutoPlayingRef = useRef(false);

    let controlsTimeout: any;

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (amount: number) => {
        if (videoRef.current) videoRef.current.currentTime += amount;
    };

    // 🔥 LOGIC DEWA: DETEKSI INTRO & AKHIR VIDEO 🔥
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const cTime = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        setCurrentTime(cTime);
        setDuration(dur);
        setProgress((cTime / dur) * 100);

        // 1. Deteksi Skip Intro
        // Jika API ngasih data introStart & introEnd, ikuti API. Kalau nggak ada, kita sediain tombolnya secara manual jika developer butuh
        const iStart = meta?.introStart || 0;
        const iEnd = meta?.introEnd || 0;

        if (iEnd > 0 && cTime >= iStart && cTime <= iEnd) {
            setShowSkipIntro(true);
        } else if (iEnd > 0) {
            setShowSkipIntro(false);
        } else {
            // (Opsional) Trik Netflix: Munculin Skip Intro di menit 0:30 s/d 1:30 kalau nggak ada API data
            if (cTime >= 30 && cTime <= 90) setShowSkipIntro(true);
            else setShowSkipIntro(false);
        }

        // 2. Deteksi Auto Next Episode (15 detik terakhir)
        const hasNextEp = episodes && currentEpisodeIndex !== undefined && currentEpisodeIndex < episodes.length - 1;
        if (dur > 0 && dur - cTime <= 15 && hasNextEp) {
            setShowNextPrompt(true);
            setCountdownNext(Math.ceil(dur - cTime));
        } else {
            setShowNextPrompt(false);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current || duration === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        videoRef.current.currentTime = (clickPosition / rect.width) * duration;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isPlaying && activeMenu === 'none') setShowControls(false);
        }, 3000);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => { });
        } else {
            document.exitFullscreen();
        }
    };

    // 🔥 AKSI SKIP INTRO 🔥
    const handleSkipIntro = () => {
        if (videoRef.current) {
            if (meta?.introEnd) {
                videoRef.current.currentTime = meta.introEnd; // Skip pakai data API
            } else {
                videoRef.current.currentTime += 85; // Fallback: Skip 85 detik ke depan (Standar Anime)
            }
            setShowSkipIntro(false);
        }
    };

    // 🔥 AKSI PLAY NEXT EPISODE 🔥
    const handlePlayNext = () => {
        if (isAutoPlayingRef.current) return;

        const hasNextEp = episodes && currentEpisodeIndex !== undefined && currentEpisodeIndex < episodes.length - 1;
        if (hasNextEp && onPlayEpisode) {
            isAutoPlayingRef.current = true;
            setShowNextPrompt(false);

            // Putar episode selanjutnya
            onPlayEpisode(episodes[currentEpisodeIndex + 1], currentEpisodeIndex + 1);

            setTimeout(() => { isAutoPlayingRef.current = false; }, 2000);
        }
    };

    // Auto Play Next ketika countdown habis (atau video End)
    useEffect(() => {
        if (showNextPrompt && countdownNext <= 0) {
            handlePlayNext();
        }
    }, [countdownNext, showNextPrompt]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const IconRewind10 = ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5" />
            <text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="bold" fontFamily="sans-serif">10</text>
        </svg>
    );

    const IconForward10 = ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v5h-5" />
            <text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="bold" fontFamily="sans-serif">10</text>
        </svg>
    );

    const nextEpData = (episodes && currentEpisodeIndex !== undefined && currentEpisodeIndex < episodes.length - 1)
        ? episodes[currentEpisodeIndex + 1] : null;

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex font-sans group select-none"
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseMove}
            onMouseLeave={() => { if (isPlaying && activeMenu === 'none') setShowControls(false); }}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-pointer"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={() => { togglePlay(); setActiveMenu('none'); }}
                onDoubleClick={toggleFullscreen}
                onEnded={handlePlayNext} // 🔥 Kalau video murni abis, auto next!
                playsInline
            />

            {/* 🔥 FITUR DEWA: TOMBOL SKIP INTRO 🔥 */}
            {/* Tombol ini sengaja ditaruh di luar bungkus opacity controls biar tetep muncul biarpun mouse diem */}
            {showSkipIntro && (
                <button
                    onClick={handleSkipIntro}
                    className="absolute bottom-[20%] sm:bottom-24 right-4 sm:right-10 bg-black/60 hover:bg-white hover:text-black border border-white/40 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-5 rounded transition-all z-40 flex items-center gap-2 text-[10px] sm:text-sm shadow-2xl backdrop-blur-md"
                >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M5 4l10 8-10 8V4zm12 0v16h2V4h-2z" /></svg>
                    Skip Intro
                </button>
            )}

            {/* 🔥 FITUR DEWA: NEXT EPISODE POP-UP (Kaya Netflix pas mau abis) 🔥 */}
            {showNextPrompt && nextEpData && (
                <div className="absolute bottom-[20%] sm:bottom-24 right-4 sm:right-10 w-60 sm:w-80 bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-2.5 sm:p-4 flex items-center gap-3 sm:gap-4 z-40 animate-in slide-in-from-right shadow-2xl">
                    {nextEpData.thumbnail && (
                        <div className="w-16 sm:w-24 aspect-video bg-gray-800 rounded overflow-hidden shrink-0">
                            <img src={nextEpData.thumbnail} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-gray-400 text-[9px] sm:text-xs font-bold">Selanjutnya dalam {countdownNext}s</span>
                        <span className="text-white text-[11px] sm:text-sm font-bold line-clamp-1">{nextEpData.title || `Episode ${currentEpisodeIndex! + 2}`}</span>
                    </div>
                    <button onClick={handlePlayNext} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white flex items-center justify-center shrink-0 group transition">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-white group-hover:fill-black" viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z" /></svg>
                    </button>
                </div>
            )}

            {/* OVERLAY UI */}
            <div className={`absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none flex flex-col justify-between p-2 sm:p-4 md:p-8 
                bg-gradient-to-t from-black/95 via-transparent to-black/70 ${showControls || !isPlaying || activeMenu !== 'none' ? 'opacity-100' : 'opacity-0'}`}>

                {/* TOP BAR */}
                <div className="flex justify-between items-start pointer-events-auto drop-shadow-md">
                    <button onClick={onBack} className="text-white hover:text-gray-300 transition p-1 sm:p-2">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>

                    {seasons && seasons.length > 0 && (
                        <div className="flex items-center gap-2 sm:gap-4 relative">
                            <button
                                onClick={() => setActiveMenu(activeMenu === 'season' ? 'none' : 'season')}
                                className="flex items-center gap-1 sm:gap-2 bg-black/50 hover:bg-black/70 border border-white/20 text-white rounded-md px-2 py-1 sm:px-3 sm:py-1.5 transition-colors backdrop-blur-md font-medium text-[10px] sm:text-sm"
                            >
                                {seasons[currentSeasonIndex || 0]?.season_name || `Season ${meta?.season || 1}`}
                                <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${activeMenu === 'season' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {activeMenu === 'season' && (
                                <div className="absolute top-full right-0 mt-2 w-32 sm:w-48 bg-black/95 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar">
                                    {seasons.map((s: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                onSeasonChange?.(idx);
                                                setActiveMenu('episodes');
                                            }}
                                            className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 text-[10px] sm:text-sm transition-colors flex items-center justify-between ${idx === currentSeasonIndex ? 'bg-white/20 text-white font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                                        >
                                            <span className="truncate">{s.season_name || `Season ${s.season_number}`}</span>
                                            {idx === currentSeasonIndex && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CENTER CONTROLS */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 sm:gap-12 pointer-events-auto">
                    <button onClick={() => handleSeek(-10)} className="text-white hover:scale-110 transition opacity-80 hover:opacity-100 drop-shadow-2xl">
                        <IconRewind10 className="w-8 h-8 sm:w-10 sm:h-10" />
                    </button>
                    <button onClick={togglePlay} className="text-white hover:scale-110 transition drop-shadow-2xl">
                        {isPlaying ? (
                            <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <circle cx="12" cy="12" r="10.5" />
                                <rect x="9" y="8" width="2" height="8" fill="currentColor" stroke="none" />
                                <rect x="13" y="8" width="2" height="8" fill="currentColor" stroke="none" />
                            </svg>
                        ) : (
                            <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <circle cx="12" cy="12" r="10.5" />
                                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                            </svg>
                        )}
                    </button>
                    <button onClick={() => handleSeek(10)} className="text-white hover:scale-110 transition opacity-80 hover:opacity-100 drop-shadow-2xl">
                        <IconForward10 className="w-8 h-8 sm:w-10 sm:h-10" />
                    </button>
                </div>

                {/* BOTTOM CONTROLS */}
                <div className="w-full flex flex-col gap-2 sm:gap-4 pointer-events-auto">
                    <div className="flex justify-between items-end gap-2">

                        <div className="text-white flex-1 min-w-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pb-1 sm:pb-0">
                            <h3 className="text-[10px] sm:text-sm font-medium text-gray-200 mb-0.5 sm:mb-1 line-clamp-1">{meta?.title}</h3>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-gray-300 mb-0.5 sm:mb-2">
                                <span>Season {meta?.season}</span>
                                <span className="border border-gray-400 px-1 rounded bg-black/20">16+</span>
                                <span className="hidden sm:inline">{meta?.year}</span>
                                <span className="hidden sm:inline">• {meta?.genre}</span>
                                <span className="border border-gray-400 px-1 rounded bg-black/20">{meta?.qualityTag}</span>
                            </div>
                            <h1 className="text-base sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 drop-shadow-lg line-clamp-1">{meta?.episodeTitle}</h1>
                            <p className="hidden md:block text-sm text-gray-300 line-clamp-2 pr-4">{meta?.description}</p>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-4 text-white relative shrink-0">
                            <div className="flex items-center gap-1 text-[10px] sm:text-sm font-medium drop-shadow-md whitespace-nowrap mr-1 sm:mr-0">
                                <span>{formatTime(currentTime)}</span>
                                <span className="text-gray-400 hidden sm:inline">/</span>
                                <span className="text-gray-400 hidden sm:inline">{formatTime(duration)}</span>
                            </div>

                            {episodes && episodes.length > 0 && (
                                <button onClick={() => setActiveMenu(activeMenu === 'episodes' ? 'none' : 'episodes')} className="hover:text-gray-300 transition p-1.5 sm:p-2">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </button>
                            )}

                            <button onClick={() => setActiveMenu(activeMenu === 'audioSub' ? 'none' : 'audioSub')} className="hover:text-gray-300 transition p-1.5 sm:p-2 relative">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01M12 10h.01M16 10h.01"></path></svg>
                            </button>

                            <button onClick={() => setActiveMenu(activeMenu === 'settings' ? 'none' : 'settings')} className="hover:text-gray-300 transition p-1.5 sm:p-2 relative">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </button>

                            <button onClick={toggleFullscreen} className="hover:text-gray-300 transition p-1.5 sm:p-2 relative block">
                                {isFullscreen ? (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
                                )}
                            </button>

                            {activeMenu === 'audioSub' && (
                                <div className="absolute bottom-full right-0 sm:right-10 mb-4 sm:mb-6 w-[280px] sm:w-96 bg-black/95 backdrop-blur-md rounded-lg border border-white/10 p-3 sm:p-4 flex gap-4 sm:gap-6 z-50 shadow-2xl max-h-[140px] sm:max-h-[350px]">
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-[11px] sm:text-sm font-bold text-gray-300 mb-2 border-b border-white/20 pb-1 shrink-0">Audio</div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                                            {availableAudios.length > 0 ? availableAudios.map((a: any) => (
                                                <button key={a.id} onClick={() => changeAudio(a.id)} className={`block w-full text-left text-[10px] sm:text-sm py-1.5 hover:text-white transition ${a.active ? 'text-white font-bold' : 'text-gray-400'}`}>
                                                    {a.active && <span className="text-red-500 mr-1 sm:mr-2">✓</span>} {a.label}
                                                </button>
                                            )) : <span className="text-[10px] sm:text-sm text-gray-500">Default</span>}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-[11px] sm:text-sm font-bold text-gray-300 mb-2 border-b border-white/20 pb-1 shrink-0">Subtitles</div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                                            {availableSubtitles.map((sub: any) => (
                                                <button key={sub.id} onClick={() => changeSubtitle(sub.id)} className={`block w-full text-left text-[10px] sm:text-sm py-1.5 hover:text-white transition ${sub.active ? 'text-white font-bold' : 'text-gray-400'}`}>
                                                    {sub.active && <span className="text-red-500 mr-1 sm:mr-2">✓</span>} {sub.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'settings' && (
                                <div className="absolute bottom-full right-0 mb-4 sm:mb-6 w-[260px] sm:w-80 bg-black/95 backdrop-blur-md rounded-lg border border-white/10 p-3 sm:p-4 flex gap-4 sm:gap-6 z-50 shadow-2xl max-h-[140px] sm:max-h-[350px]">
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-[11px] sm:text-sm font-bold text-gray-300 mb-2 border-b border-white/20 pb-1 shrink-0">Speed</div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                                <button key={speed} onClick={() => changeSpeed(speed)} className={`block w-full text-left text-[10px] sm:text-sm py-1.5 hover:text-white transition ${playbackRate === speed ? 'text-white font-bold' : 'text-gray-400'}`}>
                                                    {playbackRate === speed && <span className="text-red-500 mr-1 sm:mr-2">✓</span>} {speed === 1 ? 'Normal' : `${speed}x`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="text-[11px] sm:text-sm font-bold text-gray-300 mb-2 border-b border-white/20 pb-1 shrink-0">Quality</div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                                            {availableQualities.length > 0 ? availableQualities.map((q: any) => (
                                                <button key={q.id} onClick={() => changeQuality(q.id)} className={`block w-full text-left text-[10px] sm:text-sm py-1.5 hover:text-white transition ${q.active ? 'text-white font-bold' : 'text-gray-400'}`}>
                                                    {q.active && <span className="text-red-500 mr-1 sm:mr-2">✓</span>} {q.label}
                                                </button>
                                            )) : <span className="text-[10px] sm:text-sm text-gray-500">Auto</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-1 sm:h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer group hover:h-1.5 sm:hover:h-2 transition-all relative" onClick={handleProgressClick}>
                        <div className="h-full bg-red-600 absolute left-0 top-0 transition-all duration-150" style={{ width: `${progress}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>
                    </div>
                </div>
            </div>

            {activeMenu === 'episodes' && (
                <div className="absolute top-0 right-0 h-full w-64 sm:w-80 bg-black/95 backdrop-blur-xl z-50 p-3 sm:p-4 shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-4 text-white shrink-0">
                        <h3 className="font-bold text-base sm:text-lg">Episodes</h3>
                        <button onClick={() => setActiveMenu('none')} className="hover:bg-white/20 p-1 sm:p-1.5 rounded-full transition">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-1 sm:px-2 pb-20 pt-2 -space-y-4 sm:-space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {episodes && episodes.length > 0 ? episodes.map((ep, idx) => {
                            const isActive = idx === (currentEpisodeIndex || 0);
                            return (
                                <div
                                    key={idx}
                                    onClick={() => { onPlayEpisode?.(ep, idx); setActiveMenu('none'); }}
                                    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform
                                        ${isActive
                                            ? 'z-30 scale-100 ring-2 ring-white opacity-100 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                                            : 'z-10 scale-[0.92] opacity-40 hover:opacity-100 hover:scale-95 hover:z-20 shadow-lg'
                                        }
                                    `}
                                >
                                    <div className="aspect-[16/10] bg-gray-900 relative">
                                        {ep.thumbnail ? (
                                            <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white/10">{idx + 1}</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                                        <div className="absolute bottom-2 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white z-10">
                                            <div className="font-bold text-xs sm:text-sm drop-shadow-md line-clamp-2">
                                                {idx + 1}. {ep.title || `Episode ${idx + 1}`}
                                            </div>
                                            {isActive && (
                                                <div className="w-full h-0.5 sm:h-1 bg-white/20 mt-2 sm:mt-3 rounded-full overflow-hidden">
                                                    <div className="h-full bg-red-600 w-1/3 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                                                </div>
                                            )}
                                        </div>

                                        {isActive && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                                    <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="white"><path d="M6 4l15 8-15 8z" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-gray-500 text-[10px] sm:text-sm">No other episodes available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}