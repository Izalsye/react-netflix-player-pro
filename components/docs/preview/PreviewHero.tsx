'use client';

import { useState, useEffect } from 'react';
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { PreviewMedia } from '@/lib/adapter/types';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2364748b'%3ENo Banner Image%3C/text%3E%3C/svg%3E";

// 🔥 Bikin interface extention biar Typescript nggak rewel 
// (Lu juga bisa pindahin ini ke types.ts lu nanti)
export interface ExtendedPreviewMedia extends PreviewMedia {
    bannerLayers?: {
        background?: string;
        cover?: string;
        title?: string;
    };
}

interface PreviewHeroProps {
    banners: ExtendedPreviewMedia[];
    onCardClick: (id: string, slug: string) => void;
}

export default function PreviewHero({ banners, onCardClick }: PreviewHeroProps) {
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        if (!banners || banners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (!banners || banners.length === 0) return null;

    return (
        <div className="relative w-full aspect-[4/5] sm:aspect-[21/9] md:aspect-[2.5/1] overflow-hidden bg-[#090b10] group">
            {banners.map((banner, idx) => (
                <div
                    key={`${banner.id}-${idx}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    onClick={() => onCardClick(banner.id.toString(), banner.slug || '')}
                >
                    {/* 🔥 LOGIC LAYER BANNER 🔥 */}
                    {banner.bannerLayers ? (
                        <>
                            {/* Layer 1: Background */}
                            <img
                                src={banner.bannerLayers.background || FALLBACK_IMG}
                                alt={banner.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading={idx === 0 ? "eager" : "lazy"}
                            />
                            {/* Layer 2: Cover Orang (Merapat ke Kanan Bawah) */}
                            {banner.bannerLayers.cover && (
                                <img
                                    src={banner.bannerLayers.cover}
                                    alt="Cover"
                                    className="absolute right-0 bottom-0 h-[80%] md:h-[95%] w-[80%] md:w-[60%] object-contain object-right-bottom z-0 drop-shadow-2xl"
                                    loading={idx === 0 ? "eager" : "lazy"}
                                />
                            )}
                        </>
                    ) : (
                        // Fallback buat provider lain (contoh: Viu)
                        <img
                            src={banner.posterUrl || FALLBACK_IMG}
                            alt={banner.title}
                            className="absolute inset-0 w-full h-full object-cover sm:object-top"
                            loading={idx === 0 ? "eager" : "lazy"}
                        />
                    )}

                    {/* Layer 3: Overlay Gradient biar teks & tombol bisa dibaca + Shadow gelap di kiri */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/60 to-transparent md:bg-gradient-to-r md:from-[#090b10]/90 md:via-[#090b10]/40 md:to-transparent z-10" />

                    {/* Layer 4: Info Konten (Logo/Teks, Genre, Tombol) */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 pb-10 md:p-10 lg:p-14 z-20">

                        {/* 🔥 LOGIC TITLE LOGO VS TEKS 🔥 */}
                        {banner.bannerLayers?.title ? (
                            <img
                                src={banner.bannerLayers.title}
                                alt={banner.title}
                                className="h-16 sm:h-24 md:h-32 w-auto object-contain mx-auto md:mx-0 object-center md:object-left mb-4 md:mb-6"
                            />
                        ) : (
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 md:mb-4 drop-shadow-xl max-w-3xl leading-tight text-center md:text-left">
                                {banner.title}
                            </h2>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-sm font-bold text-slate-200 mb-4 md:mb-6 drop-shadow-md">
                            {banner.year && <span className="bg-white/20 px-2 py-0.5 rounded">{banner.year}</span>}
                            {banner.rating && <span className="flex items-center gap-1 text-emerald-400"><Star size={14} className="fill-emerald-400" /> {banner.rating} Match</span>}
                            <span className="border border-white/30 px-2 py-0.5 rounded text-[10px] uppercase">{banner.type || 'Movie'}</span>
                        </div>

                        <div className="flex w-full md:w-auto items-center justify-center md:justify-start gap-3">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white text-black py-2.5 md:px-8 md:py-3 rounded-md font-bold hover:bg-slate-200 transition-colors shadow-lg text-sm md:text-base">
                                <Play size={16} fill="currentColor" className="md:w-[18px] md:h-[18px]" /> Play
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white/20 text-white backdrop-blur-md py-2.5 md:px-8 md:py-3 rounded-md font-bold hover:bg-white/30 transition-colors text-sm md:text-base">
                                More Info
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                <button onClick={(e) => { e.stopPropagation(); setCurrentBanner(prev => prev === 0 ? banners.length - 1 : prev - 1); }} className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all"><ChevronLeft size={24} /></button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                <button onClick={(e) => { e.stopPropagation(); setCurrentBanner(prev => (prev + 1) % banners.length); }} className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all"><ChevronRight size={24} /></button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-1.5">
                {banners.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
                ))}
            </div>
        </div>
    );
}