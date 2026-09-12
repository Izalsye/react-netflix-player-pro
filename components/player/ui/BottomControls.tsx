import React from 'react';
import { formatTime } from '../playerUtils'; // Pastikan path ini benar

interface BottomControlsProps {
    meta: any;
    episodes?: any[];
    currentTime: number;
    duration: number;
    progress: number;
    isPlaying: boolean;
    togglePlay: () => void;
    activeMenu: string;
    setActiveMenu: (menu: any) => void;
    toggleFullscreen: () => void;
    isFullscreen: boolean;
    handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleProgressMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    setHoverTime: (val: number | null) => void;
    hoverTime: number | null;
    hoverPos: number;
    availableAudios: any[];
    changeAudio: (id: string) => void;
    availableSubtitles: any[];
    changeSubtitle: (id: string) => void;
    playbackRate: number;
    changeSpeed: (speed: number) => void;
    availableQualities: any[];
    changeQuality: (id: string) => void;
}

export default function BottomControls({
    meta, episodes, currentTime, duration, progress, isPlaying, togglePlay, activeMenu, setActiveMenu, toggleFullscreen, isFullscreen, handleProgressClick, handleProgressMouseMove, setHoverTime, hoverTime, hoverPos, availableAudios, changeAudio, availableSubtitles, changeSubtitle, playbackRate, changeSpeed, availableQualities, changeQuality
}: BottomControlsProps) {
    return (
        <div className="w-full flex flex-col gap-2 sm:gap-4 pointer-events-auto z-20">
            <div className="flex justify-between items-end gap-2">
                <div className="text-white flex-1 min-w-0 max-w-[75%] md:max-w-[60%] lg:max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pb-1 sm:pb-0">
                    <h3 className="text-[10px] sm:text-sm font-medium text-gray-200 mb-0.5 sm:mb-1 truncate">{meta?.title}</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs text-gray-300 mb-0.5 sm:mb-2 overflow-hidden whitespace-nowrap">
                        <span className="shrink-0">Season {meta?.season}</span>
                        <span className="shrink-0 border border-gray-400 px-1 rounded bg-black/20">16+</span>
                        <span className="hidden sm:inline shrink-0">{meta?.year}</span>
                        <span className="hidden sm:inline shrink-0">•</span>
                        <span className="hidden sm:inline truncate">{meta?.genre}</span>
                        <span className="shrink-0 border border-gray-400 px-1 rounded bg-black/20">{meta?.qualityTag}</span>
                    </div>
                    <h1 className="text-base sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 drop-shadow-lg truncate">{meta?.episodeTitle}</h1>
                    <div className="hidden md:block pr-4">
                        <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">{meta?.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-4 text-white relative shrink-0">
                    <button onClick={togglePlay} className="hover:text-gray-300 transition p-1.5 sm:p-2 hidden sm:block">
                        {isPlaying ? (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        )}
                    </button>

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

                    {/* Menu Popups */}
                    {activeMenu === 'audioSub' && (
                        <div className="absolute bottom-full right-0 sm:right-10 mb-4 sm:mb-6 w-[280px] sm:w-96 bg-black/95 backdrop-blur-md rounded-lg border border-white/10 p-3 sm:p-4 flex gap-4 sm:gap-6 z-50 shadow-2xl max-h-[160px] sm:max-h-[220px]">
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
                        <div className="absolute bottom-full right-0 mb-4 sm:mb-6 w-[260px] sm:w-80 bg-black/95 backdrop-blur-md rounded-lg border border-white/10 p-3 sm:p-4 flex gap-4 sm:gap-6 z-50 shadow-2xl max-h-[160px] sm:max-h-[220px]">
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

            {/* Progress Bar */}
            <div
                className="w-full h-1 sm:h-1.5 bg-white/30 rounded-full cursor-pointer group hover:h-1.5 sm:hover:h-2 transition-all relative flex items-center"
                onClick={handleProgressClick}
                onMouseMove={handleProgressMouseMove}
                onMouseLeave={() => setHoverTime(null)}
            >
                <div className="h-full bg-red-600 rounded-full relative transition-all duration-150" style={{ width: `${progress}%` }}>
                    <div className="absolute right-[-6px] sm:right-[-8px] top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform z-20"></div>
                </div>

                {hoverTime !== null && (
                    <div
                        className="absolute top-[-35px] -translate-x-1/2 bg-black/90 text-white text-[10px] sm:text-xs font-bold py-1 px-2 rounded shadow-lg pointer-events-none z-30"
                        style={{ left: `${hoverPos}px` }}
                    >
                        {formatTime(hoverTime)}
                    </div>
                )}
            </div>
        </div>
    );
}