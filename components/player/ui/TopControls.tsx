import React from 'react';

interface TopControlsProps {
    onBack?: () => void;
    seasons?: any[];
    currentSeasonIndex?: number;
    activeMenu: string;
    setActiveMenu: (menu: any) => void;
    onSeasonChange?: (index: number) => void;
    meta?: any;
}

export default function TopControls({ onBack, seasons, currentSeasonIndex, activeMenu, setActiveMenu, onSeasonChange, meta }: TopControlsProps) {
    return (
        <div className="flex justify-between items-start pointer-events-auto drop-shadow-md z-20">
            <button onClick={onBack} className="text-white hover:text-gray-300 transition p-1 sm:p-2">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>

            {seasons && seasons.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-4 relative">
                    <button
                        onClick={() => setActiveMenu(activeMenu === 'season' ? 'none' : 'season')}
                        className="flex items-center gap-1 sm:gap-2 bg-black/50 hover:bg-black/70 border border-white/20 text-white rounded-md px-2 py-1 sm:px-3 sm:py-1.5 transition-colors backdrop-blur-md font-medium text-[10px] sm:text-sm"
                    >
                        {seasons[currentSeasonIndex || 0]?.season_name || seasons[currentSeasonIndex || 0]?.name || `Season ${meta?.season || currentSeasonIndex! + 1 || 1}`}
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
                                    <span className="truncate">{s.season_name || s.name || `Season ${s.season_number || idx + 1}`}</span>
                                    {idx === currentSeasonIndex && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}