import React from 'react';

interface EpisodeListProps {
    episodes?: any[];
    currentEpisodeIndex?: number;
    onPlayEpisode?: (ep: any, index: number) => void;
    setActiveMenu: (menu: any) => void;
}

export default function EpisodeList({ episodes, currentEpisodeIndex, onPlayEpisode, setActiveMenu }: EpisodeListProps) {
    return (
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
    );
}