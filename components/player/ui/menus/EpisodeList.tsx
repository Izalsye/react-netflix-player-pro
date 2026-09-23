import { useEffect, useRef } from 'react';
import { X, Play } from 'lucide-react'; // Sesuaikan icon yang lu pakai

interface EpisodeListProps {
    episodes: any[];
    currentEpisodeIndex?: number;
    onPlayEpisode?: (ep: any, index: number) => void;
    setActiveMenu: (menu: 'none' | 'episodes' | 'audioSub' | 'settings' | 'season') => void;
}

export default function EpisodeList({ episodes, currentEpisodeIndex, onPlayEpisode, setActiveMenu }: EpisodeListProps) {
    // 🔥 1. Buat Ref untuk menandai elemen episode yang sedang aktif
    const activeEpisodeRef = useRef<HTMLButtonElement>(null);

    // 🔥 2. Auto-scroll ke episode aktif pas menu dibuka
    useEffect(() => {
        if (activeEpisodeRef.current) {
            // Kasih delay 350ms buat nunggu animasi 'duration-300' selesai
            const timer = setTimeout(() => {
                activeEpisodeRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 350);

            // Bersihkan timer kalau komponen ditutup sebelum 350ms
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="absolute top-0 right-0 bottom-0 w-full sm:w-80 bg-[#0B0E14]/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header Sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                <h3 className="text-white font-bold text-lg">Episodes</h3>
                <button onClick={() => setActiveMenu('none')} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition">
                    <X size={20} />
                </button>
            </div>

            {/* List Episodes */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 relative">
                {episodes && episodes.map((ep, idx) => {
                    const isActive = currentEpisodeIndex === idx;

                    return (
                        <button
                            key={idx}
                            // 🔥 3. Tempelkan ref HANYA pada episode yang sedang aktif
                            ref={isActive ? activeEpisodeRef : null}
                            onClick={() => {
                                if (onPlayEpisode) onPlayEpisode(ep, idx);
                                setActiveMenu('none'); // Tutup menu setelah klik
                            }}
                            className={`w-full text-left flex flex-col gap-2 p-3 rounded-xl transition-all border ${isActive
                                ? 'bg-white/10 border-[var(--primary)] ring-1 ring-[var(--primary)]/50'
                                : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            {/* Jika punya thumbnail */}
                            {ep.thumbnail ? (
                                <div className="relative w-full aspect-video bg-black/50 rounded-lg overflow-hidden shrink-0">
                                    <img src={ep.thumbnail} alt={ep.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80" />
                                    {isActive && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <Play size={24} className="text-[var(--primary)] fill-current" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Jika tidak ada thumbnail (seperti Animekompi) */
                                <div className="flex items-center gap-3">
                                    <span className={`text-2xl font-black ${isActive ? 'text-[var(--primary)]' : 'text-slate-700'}`}>
                                        {idx + 1}
                                    </span>
                                    {isActive && <Play size={14} className="text-[var(--primary)] fill-current shrink-0" />}
                                </div>
                            )}

                            <div className="flex flex-col">
                                <span className={`font-bold text-sm line-clamp-2 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                    {ep.title || `Episode ${idx + 1}`}
                                </span>
                                {ep.badge && (
                                    <span className="text-[10px] font-mono text-slate-500 mt-1">{ep.badge}</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}