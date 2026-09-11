'use client';
import React, { useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

export default function ComicReader({ images, onClose }: { images: any[], onClose: () => void }) {
    const [isFull, setIsFull] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0 md:p-4 animate-in fade-in duration-200">
            <div className={`
                flex flex-col bg-[#0B0E14] border border-[#222634] overflow-hidden transition-all duration-300
                ${isFull ? 'w-screen h-screen rounded-none' : 'w-full max-w-3xl h-[90vh] rounded-2xl'}
            `}>
                <div className="flex justify-between items-center p-3 border-b border-[#222634] shrink-0">
                    <span className="text-sm font-bold text-slate-200 ml-2">Reading Mode</span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsFull(!isFull)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
                            {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                        <button onClick={onClose} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-2xl mx-auto">
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.url_proxy || img.url}
                                alt={img.alt || `Page ${idx}`}
                                className="w-full h-auto block bg-[#111522]"
                                loading="lazy"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}