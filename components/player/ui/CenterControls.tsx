import React from 'react';

interface CenterControlsProps {
    isPlaying: boolean;
    togglePlay: () => void;
    handleSeek: (amount: number) => void;
}

export default function CenterControls({ isPlaying, togglePlay, handleSeek }: CenterControlsProps) {
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

    return (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 sm:gap-12 pointer-events-auto transition-all duration-300 z-20 ${isPlaying ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
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
    );
}