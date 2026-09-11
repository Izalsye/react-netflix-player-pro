'use client';

import { useRef } from 'react';
import { Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { PreviewSection as PreviewSectionType, PreviewMedia } from '@/lib/adapter/types';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";

interface ExtendedSectionType extends PreviewSectionType {
    variation?: string;
}

interface PreviewSectionProps {
    section: ExtendedSectionType;
    layout?: 'slider' | 'grid';
    providerId?: string;
    onCardClick: (id: string, slug: string) => void;
    actionButton?: React.ReactNode; // 🔥 Ditambah di sini
}

export default function PreviewSection({ section, layout = 'slider', providerId, onCardClick, actionButton }: PreviewSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!section.items || section.items.length === 0) return null;
    const isGrid = layout === 'grid';
    const isVidio = providerId === 'vidio';

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollContainerRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, behavior: 'smooth' });
        }
    };

    let aspectClass = "aspect-[2/3] rounded-md";
    let widthClass = "w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px]";
    let imgFitClass = "object-cover";

    if (isVidio && section.variation) {
        if (section.variation.includes('landscape') || section.variation === 'subheadline') {
            aspectClass = "aspect-[16/9] rounded-md";
            widthClass = "w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px]";
        } else if (section.variation.includes('circle')) {
            aspectClass = "aspect-square rounded-full";
            widthClass = "w-[90px] sm:w-[110px] md:w-[130px] lg:w-[150px]";
            imgFitClass = "object-contain p-2 bg-[#1a1f2e]";
        }
    }

    const MediaCard = ({ media }: { media: PreviewMedia }) => (
        <div
            className={`group relative w-full h-full overflow-hidden cursor-pointer bg-[#111522] transition-all duration-300 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-[var(--primary)] shadow-lg ${aspectClass}`}
            onClick={() => onCardClick(media.id.toString(), media.slug || '')}
        >
            <img src={media.posterUrl || FALLBACK_IMG} alt={media.title} className={`w-full h-full ${imgFitClass}`} loading="lazy" />

            {media.badge && (
                <div className="absolute top-2 right-2 z-10 bg-[#FF6022] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm shadow-md uppercase tracking-wider">
                    {media.badge}
                </div>
            )}

            {!(isVidio && section.variation?.includes('circle')) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h4 className="text-white font-bold text-xs md:text-sm line-clamp-2 leading-tight mb-2">{media.title}</h4>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                                <Play size={10} className="text-black fill-black ml-0.5" />
                            </div>
                            {media.rating && <span className="text-[10px] font-bold text-emerald-400">{media.rating}</span>}
                        </div>
                        {media.statusText && (
                            <span className="text-[10px] font-medium text-slate-300 truncate pl-2">{media.statusText}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full relative px-4 md:px-6 mb-8">
            <div className="flex items-center justify-between mb-4 px-1 group/header">
                <h4 className="text-base md:text-xl font-bold text-white tracking-tight flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                    {section.title}
                    {!isGrid && <ChevronRight size={18} className="opacity-0 group-hover/header:opacity-100 transition-opacity text-[var(--primary)]" />}
                </h4>
                {/* 🔥 Render Action Button di sini (sejajar dengan title) 🔥 */}
                {actionButton && <div>{actionButton}</div>}
            </div>

            {isGrid ? (
                <div className={`grid gap-3 md:gap-4 pb-8 ${isVidio && section.variation?.includes('landscape') ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'}`}>
                    {section.items.map((media, idx) => <MediaCard key={`${media.id}-${idx}`} media={media} />)}
                </div>
            ) : (
                <div className="relative group/slider">
                    <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:flex"><ChevronLeft size={24} /></button>
                    <div ref={scrollContainerRef} className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {section.items.map((media, idx) => (
                            <div key={`${media.id}-${idx}`} className={`shrink-0 snap-start ${widthClass}`}>
                                <MediaCard media={media} />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/10 hidden md:flex"><ChevronRight size={24} /></button>
                </div>
            )}
        </div>
    );
}