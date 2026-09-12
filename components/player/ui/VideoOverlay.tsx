import React, { useState, useEffect } from 'react';

interface VideoOverlayProps {
    togglePlay: () => void;
    toggleFullscreen: () => void;
    handleSeek: (amount: number) => void;
    setActiveMenu: (menu: any) => void;
}

export default function VideoOverlay({ togglePlay, toggleFullscreen, handleSeek, setActiveMenu }: VideoOverlayProps) {
    const [seekIndicator, setSeekIndicator] = useState<'left' | 'right' | null>(null);

    const onDoubleClickSeek = (direction: 'left' | 'right') => {
        handleSeek(direction === 'left' ? -10 : 10);
        setSeekIndicator(direction);
        setTimeout(() => setSeekIndicator(null), 500);
    };

    return (
        <div className="absolute inset-0 z-0 flex cursor-pointer pointer-events-auto">
            {/* Kiri - Mundur 10 detik */}
            <div
                className="w-1/3 h-full relative flex items-center justify-center"
                onClick={() => { togglePlay(); setActiveMenu('none'); }}
                onDoubleClick={() => onDoubleClickSeek('left')}
            >
                {seekIndicator === 'left' && (
                    <div className="absolute bg-black/50 rounded-full p-4 animate-ping">
                        <span className="text-white font-bold text-xl">-10s</span>
                    </div>
                )}
            </div>

            {/* Tengah - Play/Pause & Fullscreen */}
            <div
                className="w-1/3 h-full"
                onClick={() => { togglePlay(); setActiveMenu('none'); }}
                onDoubleClick={toggleFullscreen}
            />

            {/* Kanan - Maju 10 detik */}
            <div
                className="w-1/3 h-full relative flex items-center justify-center"
                onClick={() => { togglePlay(); setActiveMenu('none'); }}
                onDoubleClick={() => onDoubleClickSeek('right')}
            >
                {seekIndicator === 'right' && (
                    <div className="absolute bg-black/50 rounded-full p-4 animate-ping">
                        <span className="text-white font-bold text-xl">+10s</span>
                    </div>
                )}
            </div>
        </div>
    );
}