'use client';

import { useRef, useState, useEffect } from 'react';
import { useVideoEngine } from './useVideoEngine';

// Import komponen UI yang udah dipecah
import VideoOverlay from './ui/VideoOverlay';
import TopControls from './ui/TopControls';
import CenterControls from './ui/CenterControls';
import BottomControls from './ui/BottomControls';
import EpisodeList from './ui/menus/EpisodeList';

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
    src, provider, customData, licenseServers, subtitles, audioConf, meta, episodes, onBack, currentEpisodeIndex, onPlayEpisode, seasons, currentSeasonIndex, onSeasonChange, qualities
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        isVideoReady,
        availableSubtitles, changeSubtitle,
        availableAudios, changeAudio,
        availableQualities, changeQuality,
        playbackRate, changeSpeed
    } = useVideoEngine(videoRef, src, provider, customData, licenseServers, audioConf, subtitles, qualities);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [activeMenu, setActiveMenu] = useState<'none' | 'episodes' | 'audioSub' | 'settings' | 'season'>('none');

    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [showNextPrompt, setShowNextPrompt] = useState(false);
    const [countdownNext, setCountdownNext] = useState(15);
    const isAutoPlayingRef = useRef(false);

    // STATE UNTUK HOVER WAKTU PROGRESS BAR
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<number>(0);
    // 🔥 KEYBOARD SHORTCUTS LEVEL DEWA 🔥
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Abaikan shortcut kalau user lagi ngetik di form input / search bar
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault(); // Biar space gak bikin halaman scroll ke bawah
                    togglePlay();
                    break;
                case 'arrowright':
                case 'l':
                    e.preventDefault();
                    handleSeek(10);
                    break;
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    handleSeek(-10);
                    break;
                case 'f':
                case 'enter':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    if (videoRef.current) {
                        videoRef.current.muted = !videoRef.current.muted;
                    }
                    break;
                case 'arrowup':
                    e.preventDefault(); // Biar panah atas gak scroll halaman
                    if (videoRef.current) {
                        videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
                    }
                    break;
                case 'arrowdown':
                    e.preventDefault(); // Biar panah bawah gak scroll halaman
                    if (videoRef.current) {
                        videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
                    }
                    break;
            }
        };

        // Pasang event listener ke seluruh halaman
        window.addEventListener('keydown', handleKeyDown);

        // Bersihkan listener kalau player di-close
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // Kosongin array dependency karena fungsi toggle kita ambil langsung dari state videoRef
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

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const cTime = videoRef.current.currentTime;
        const dur = videoRef.current.duration;
        setCurrentTime(cTime);
        setDuration(dur);
        setProgress((cTime / dur) * 100);

        const iStart = meta?.introStart || 0;
        const iEnd = meta?.introEnd || 0;

        if (iEnd > 0 && cTime >= iStart && cTime <= iEnd) {
            setShowSkipIntro(true);
        } else if (iEnd > 0) {
            setShowSkipIntro(false);
        } else {
            if (cTime >= 30 && cTime <= 90) setShowSkipIntro(true);
            else setShowSkipIntro(false);
        }

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

    const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setHoverPos(pos);
        setHoverTime((pos / rect.width) * duration);
    };

    // LOGIC TIMEOUT OVERLAY
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showControls && isPlaying && activeMenu === 'none') {
            timeout = setTimeout(() => setShowControls(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [showControls, isPlaying, activeMenu]);

    const handleMouseMove = () => {
        setShowControls(true);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => { });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleSkipIntro = () => {
        if (videoRef.current) {
            if (meta?.introEnd) {
                videoRef.current.currentTime = meta.introEnd;
            } else {
                videoRef.current.currentTime += 85;
            }
            setShowSkipIntro(false);
        }
    };

    const handlePlayNext = () => {
        if (isAutoPlayingRef.current) return;
        const hasNextEp = episodes && currentEpisodeIndex !== undefined && currentEpisodeIndex < episodes.length - 1;
        if (hasNextEp && onPlayEpisode) {
            isAutoPlayingRef.current = true;
            setShowNextPrompt(false);
            onPlayEpisode(episodes[currentEpisodeIndex + 1], currentEpisodeIndex + 1);
            setTimeout(() => { isAutoPlayingRef.current = false; }, 2000);
        }
    };

    useEffect(() => {
        if (showNextPrompt && countdownNext <= 0) handlePlayNext();
    }, [countdownNext, showNextPrompt]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

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
            {/* 🔥 FIX: onClick & onDoubleClick dihapus dari tag video agar tidak bentrok 🔥 */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handlePlayNext}
                playsInline
            />

            {/* 🔥 LAYER 1: OVERLAY KLIK (Untuk nge-handle klik kiri/tengah/kanan) 🔥 */}
            <VideoOverlay
                togglePlay={togglePlay}
                toggleFullscreen={toggleFullscreen}
                handleSeek={handleSeek}
                setActiveMenu={setActiveMenu}
            />

            {/* NOTIFIKASI SKIP INTRO */}
            {showSkipIntro && (
                <button
                    onClick={handleSkipIntro}
                    className="absolute bottom-[20%] sm:bottom-24 right-4 sm:right-10 bg-black/60 hover:bg-white hover:text-black border border-white/40 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-5 rounded transition-all z-40 flex items-center gap-2 text-[10px] sm:text-sm shadow-2xl backdrop-blur-md group pointer-events-auto"
                >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M5 4l10 8-10 8V4zm12 0v16h2V4h-2z" />
                    </svg>
                    Skip Intro
                </button>
            )}

            {/* NOTIFIKASI NEXT EPISODE */}
            {showNextPrompt && nextEpData && (
                <div className="absolute bottom-[20%] sm:bottom-24 right-4 sm:right-10 w-60 sm:w-80 bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-2.5 sm:p-4 flex items-center gap-3 sm:gap-4 z-40 animate-in slide-in-from-right shadow-2xl pointer-events-auto">
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

            {/* 🔥 LAYER 2: UI CONTROLS 🔥 */}
            <div className={`absolute inset-0 z-10 transition-opacity duration-300 pointer-events-none flex flex-col justify-between p-2 sm:p-4 md:p-8 
                bg-gradient-to-t from-black/95 via-transparent to-black/70 ${showControls || !isPlaying || activeMenu !== 'none' ? 'opacity-100' : 'opacity-0'}`}>

                <TopControls
                    onBack={onBack}
                    seasons={seasons}
                    currentSeasonIndex={currentSeasonIndex}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    onSeasonChange={onSeasonChange}
                    meta={meta}
                />

                <CenterControls
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    handleSeek={handleSeek}
                />

                <BottomControls
                    meta={meta}
                    episodes={episodes}
                    currentTime={currentTime}
                    duration={duration}
                    progress={progress}
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    toggleFullscreen={toggleFullscreen}
                    isFullscreen={isFullscreen}
                    handleProgressClick={handleProgressClick}
                    handleProgressMouseMove={handleProgressMouseMove}
                    setHoverTime={setHoverTime}
                    hoverTime={hoverTime}
                    hoverPos={hoverPos}
                    availableAudios={availableAudios}
                    changeAudio={changeAudio}
                    availableSubtitles={availableSubtitles}
                    changeSubtitle={changeSubtitle}
                    playbackRate={playbackRate}
                    changeSpeed={changeSpeed}
                    availableQualities={availableQualities}
                    changeQuality={changeQuality}
                />
            </div>

            {/* 🔥 LAYER 3: SIDEBAR MENU EPISODES 🔥 */}
            {activeMenu === 'episodes' && (
                <EpisodeList
                    episodes={episodes || []} // 🔥 TAMBAHIN || [] DI SINI
                    currentEpisodeIndex={currentEpisodeIndex}
                    onPlayEpisode={onPlayEpisode}
                    setActiveMenu={setActiveMenu}
                />
            )}
        </div>
    );
}