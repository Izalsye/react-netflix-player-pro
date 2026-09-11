'use client';

import { X, Loader2, Play, ChevronDown, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PreviewDetail } from '@/lib/adapter/types';
import { useMediaParser } from '@/hooks/useMediaParser';

const CustomPlayer = dynamic(() => import('@/components/player/CustomPlayer'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-black z-20"><Loader2 className="animate-spin text-[var(--primary)]" size={32} /></div>
});

interface PreviewDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    detailData: PreviewDetail | null;
    isLoading: boolean;
    providerId: string;
    playResult: any;
    isPlayLoading: boolean;
    playEndpointId: string;
    onPlayVideo: (epNum: number, seasonNum: number, vid?: string) => void;
    onClosePlayer: () => void;
}

export default function PreviewDetailModal({
    isOpen, onClose, detailData, isLoading, providerId,
    playResult, isPlayLoading, playEndpointId, onPlayVideo, onClosePlayer
}: PreviewDetailModalProps) {

    const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
    const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

    // 🔥 State buat nyimpen nomor episode yang lagi ditonton
    const [playingEpNumber, setPlayingEpNumber] = useState<number>(1);

    const parsedMedia = useMediaParser(playResult, playEndpointId);
    const isPlayingVideo = isPlayLoading || parsedMedia?.type === 'video';

    // 🔥 Fungsi wrapper biar state episode selalu sinkron pas ganti video
    const handlePlay = (epNum: number, seasonNum: number, vid?: string) => {
        setPlayingEpNumber(epNum);
        onPlayVideo(epNum, seasonNum, vid);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex justify-center items-center p-0 md:p-6 lg:p-10">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => { onClose(); onClosePlayer(); }} />

            <div className={`relative w-full bg-[#151822] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col transition-all ${isPlayingVideo ? 'max-w-6xl w-full aspect-video max-h-[100dvh] md:max-h-[85vh] rounded-none mx-auto' : 'max-w-4xl max-h-full rounded-t-2xl md:rounded-2xl overflow-hidden'}`}>

                {!isPlayingVideo && (
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition-colors"><X size={20} /></button>
                )}

                {isLoading ? (
                    <div className="h-96 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[var(--primary)]" /></div>
                ) : detailData ? (
                    isPlayingVideo ? (
                        <div className="relative w-full h-full bg-black flex flex-col animate-in fade-in duration-300">

                            {isPlayLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center"><Loader2 size={48} className="animate-spin text-[var(--primary)] mb-4" /><span className="text-lg font-bold text-slate-300">Menyiapkan Streaming...</span></div>
                            ) : (parsedMedia && parsedMedia.type === 'video') ? (
                                <div className="flex-1 w-full h-full relative z-50 min-h-0 bg-black block [&>div]:h-full [&>div]:w-full">
                                    <CustomPlayer
                                        src={parsedMedia.url}
                                        subtitles={parsedMedia.subtitles}
                                        licenseServers={parsedMedia.licenseServers}
                                        customData={parsedMedia.customData}
                                        provider={providerId}
                                        audioConf={parsedMedia.audioConf}
                                        onBack={onClosePlayer}
                                        meta={{
                                            title: detailData.title || '',
                                            season: detailData.seasonsList?.[selectedSeasonIdx]?.season_number || 1,
                                            year: Number(detailData.year) || new Date().getFullYear(),
                                            genre: detailData.genres || detailData.type || 'Unknown',
                                            qualityTag: 'HD',
                                            episodeTitle: detailData.type === 'movie'
                                                ? (detailData.title || 'Movie')
                                                : (detailData.seasonsList?.[selectedSeasonIdx]?.episodes?.[playingEpNumber - 1]?.title || `Episode ${playingEpNumber}`),
                                            description: detailData.description || ''
                                        }}
                                        episodes={detailData.seasonsList?.[selectedSeasonIdx]?.episodes || []}
                                        currentEpisodeIndex={playingEpNumber - 1}
                                        onPlayEpisode={(ep, idx) => handlePlay(idx + 1, detailData.seasonsList![selectedSeasonIdx].season_number || 1, ep.id || ep.vid)}

                                        // 🔥 3 BARIS INI TAMBAHANNYA BUAT LEMPAR DATA SEASON KE PLAYER 🔥
                                        seasons={detailData.seasonsList || []}
                                        currentSeasonIndex={selectedSeasonIdx}
                                        onSeasonChange={(idx) => setSelectedSeasonIdx(idx)}
                                    />
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                    <button onClick={onClosePlayer} className="mb-4 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"><ArrowLeft size={16} /> Kembali</button>
                                    <p>Gagal memuat video atau format media tidak didukung.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-1 scroll-smooth">
                            <div className="relative w-full aspect-video md:aspect-[21/9] bg-black shrink-0">
                                <img src={detailData.posterUrl} alt={detailData.title} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#151822] to-transparent pointer-events-none" />
                            </div>

                            <div className="p-6 md:p-10 space-y-8 bg-[#151822]">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                            {detailData.rating && <span className="text-emerald-400">{detailData.rating} Match</span>}
                                            {detailData.year && <span className="text-white">{detailData.year}</span>}
                                            <span className="border border-slate-600 bg-white/5 px-2 py-0.5 rounded text-[10px] text-white tracking-wider uppercase">{detailData.type}</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{detailData.title}</h2>
                                        <div className="pt-2 pb-1">
                                            <button onClick={() => {
                                                const isMovie = detailData.type === 'movie';
                                                const firstEpVid = detailData.seasonsList?.[0]?.episodes?.[0]?.id || detailData.seasonsList?.[0]?.episodes?.[0]?.vid;
                                                // 🔥 GANTI onPlayVideo JADI handlePlay
                                                handlePlay(isMovie ? 0 : 1, isMovie ? 0 : 1, isMovie ? detailData.id.toString() : firstEpVid);
                                            }} className="flex items-center justify-center gap-2 bg-white text-black px-8 py-2.5 rounded-md font-bold hover:bg-slate-200 transition-colors shadow-lg">
                                                <Play size={18} fill="currentColor" /> {detailData.type === 'movie' ? 'Putar Film' : 'Putar Episode 1'}
                                            </button>
                                        </div>
                                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">{detailData.description || 'Tidak ada deskripsi tersedia.'}</p>
                                    </div>
                                    <div className="w-full md:w-1/3 text-sm bg-[#1A1F2C] border border-white/5 p-5 rounded-xl h-fit space-y-3 shadow-lg">
                                        <div className="text-slate-400"><span className="text-white font-bold mr-1">Genres:</span> {detailData.genres || '-'}</div>
                                        <div className="text-slate-400"><span className="text-white font-bold mr-1">Country:</span> {detailData.country || '-'}</div>
                                    </div>
                                </div>

                                {detailData.seasonsList && detailData.seasonsList.length > 0 && detailData.type !== 'movie' && (
                                    <div className="border-t border-white/10 pt-8 mt-8 space-y-6">
                                        <div className="flex items-center justify-between relative z-50">
                                            <h3 className="text-xl md:text-2xl font-bold">Episodes</h3>
                                            <div className="relative">
                                                <button onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)} className="flex items-center justify-between gap-3 w-40 md:w-48 bg-[#1A1F2C] hover:bg-[#252b3b] border border-white/10 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-[var(--primary)]">
                                                    <span className="truncate">{detailData.seasonsList[selectedSeasonIdx]?.season_name || `Season ${detailData.seasonsList[selectedSeasonIdx]?.season_number || 1}`}</span>
                                                    <ChevronDown size={16} className={`transition-transform duration-300 text-slate-400 ${isSeasonDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isSeasonDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setIsSeasonDropdownOpen(false)} />
                                                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1F2C] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col py-1.5">
                                                                {detailData.seasonsList.map((season: any, idx: number) => (
                                                                    <button key={idx} onClick={() => { setSelectedSeasonIdx(idx); setIsSeasonDropdownOpen(false); }} className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between ${selectedSeasonIdx === idx ? 'bg-white/10 text-white font-bold' : 'text-slate-400 font-medium hover:bg-white/5 hover:text-slate-200'}`}>
                                                                        <span className="truncate">{season.season_name || `Season ${season.season_number}`}</span>
                                                                        {selectedSeasonIdx === idx && <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {detailData.seasonsList[selectedSeasonIdx]?.episodes.map((ep: any, idx: number) => {
                                                const epNumber = idx + 1;
                                                return (
                                                    // 🔥 GANTI onPlayVideo JADI handlePlay
                                                    <div key={idx} onClick={() => handlePlay(epNumber, detailData.seasonsList![selectedSeasonIdx].season_number || 1, ep.id || ep.vid)} className="p-3 md:p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all group bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20">
                                                        <div className="flex items-center gap-4 md:gap-5 overflow-hidden">
                                                            {ep.thumbnail ? (
                                                                <div className="relative w-24 md:w-32 aspect-video rounded-lg overflow-hidden shrink-0 hidden sm:block">
                                                                    <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                                                </div>
                                                            ) : (
                                                                <span className="text-xl md:text-2xl font-bold w-8 text-center text-slate-600 group-hover:text-slate-400 shrink-0">{epNumber}</span>
                                                            )}
                                                            <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                                                                <h4 className="font-bold text-sm md:text-base leading-snug transition-colors text-white group-hover:text-[var(--primary)] line-clamp-2">{ep.title || `Episode ${epNumber}`}</h4>
                                                                {ep.badge && <span className="w-fit bg-gradient-to-r from-[#FF6022] to-[#FF8A00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">{ep.badge}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-colors shadow-sm bg-white/10 group-hover:bg-white"><Play size={16} className="transition-all ml-1 text-white group-hover:text-black fill-transparent group-hover:fill-black" /></div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">Gagal memuat detail</div>
                )}
            </div>
        </div>
    );
}