'use client';

import { X, Filter, Check } from 'lucide-react';

const IDLIX_SORTS = [
    { code: 'releaseDate', name: 'Terbaru' },
    { code: 'popularity', name: 'Populer' },
    { code: 'views', name: 'Paling Banyak Ditonton' },
    { code: 'rating', name: 'Rating Tertinggi' }
];

const IDLIX_GENRES = [
    { code: '', name: 'Semua Genre' },
    { code: 'action', name: 'Action' }, { code: 'adventure', name: 'Adventure' },
    { code: 'animation', name: 'Animation' }, { code: 'comedy', name: 'Comedy' },
    { code: 'drama', name: 'Drama' }, { code: 'fantasy', name: 'Fantasy' },
    { code: 'horror', name: 'Horror' }, { code: 'romance', name: 'Romance' }
];

const IDLIX_COUNTRIES = [
    { code: '', name: 'Semua Negara' },
    { code: 'US', name: 'United States' }, { code: 'ID', name: 'Indonesia' },
    { code: 'KR', name: 'South Korea' }, { code: 'JP', name: 'Japan' }
];

interface IdlixFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    selectedSort: string;
    setSelectedSort: (val: string) => void;
    selectedGenre: string;
    setSelectedGenre: (val: string) => void;
    selectedCountry: string;
    setSelectedCountry: (val: string) => void;
}

export default function IdlixFilterModal({
    isOpen, onClose, onApply,
    selectedSort, setSelectedSort,
    selectedGenre, setSelectedGenre,
    selectedCountry, setSelectedCountry
}: IdlixFilterModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex justify-center items-center p-0 md:p-6 lg:p-10">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-[#12151C] md:rounded-2xl h-full md:h-auto max-h-[90vh] flex flex-col shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/10 shrink-0">
                    <h3 className="text-xl font-bold text-white tracking-wide">Filters & Sort</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                    {/* Sort */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2"><Filter size={14} /> URUTKAN</h4>
                        <div className="flex flex-wrap gap-3">
                            {IDLIX_SORTS.map(sort => (
                                <button key={sort.code} onClick={() => setSelectedSort(sort.code)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${selectedSort === sort.code ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'}`}>
                                    {sort.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Genre & Country (Disingkat biar muat, sama persis kayak punya lu) */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">GENRE</h4>
                        <div className="flex flex-wrap gap-2.5">
                            {IDLIX_GENRES.map(genre => (
                                <button key={genre.code} onClick={() => setSelectedGenre(genre.code)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedGenre === genre.code ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'}`}>{genre.name}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">NEGARA</h4>
                        <div className="flex flex-wrap gap-2.5">
                            {IDLIX_COUNTRIES.map(country => (
                                <button key={country.code} onClick={() => setSelectedCountry(country.code)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCountry === country.code ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'}`}>{country.name}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-white/10 bg-[#0B0E14]/50 backdrop-blur-md flex justify-end gap-3 shrink-0 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={onApply} className="flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-colors"><Check size={16} /> Selesai</button>
                </div>
            </div>
        </div>
    );
}