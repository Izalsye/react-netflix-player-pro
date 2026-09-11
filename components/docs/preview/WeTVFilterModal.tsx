'use client';

import { X, Filter, Check } from 'lucide-react';

interface WeTVFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: any[];
    activeFilters: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onApply: () => void;
}

export default function WeTVFilterModal({ isOpen, onClose, filters, activeFilters, onChange, onApply }: WeTVFilterModalProps) {
    if (!isOpen || !filters || filters.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex justify-center items-center p-0 md:p-6 lg:p-10">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-[#12151C] md:rounded-2xl h-full md:h-auto max-h-[90vh] flex flex-col shadow-2xl border border-white/5 animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/10 shrink-0">
                    <h3 className="text-xl font-bold text-white tracking-wide">Filter Eksplorasi WeTV</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    {filters.map((filterGroup) => (
                        <div key={filterGroup.paramKey} className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                                {filterGroup.paramKey === 'sort' && <Filter size={14} />} {filterGroup.name}
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                                {filterGroup.options.map((opt: any) => {
                                    const isActive = activeFilters[filterGroup.paramKey] === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => onChange(filterGroup.paramKey, opt.value)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isActive
                                                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-[0_0_10px_var(--primary)]'
                                                    : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                                                }`}
                                        >
                                            {opt.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t border-white/10 bg-[#0B0E14]/50 backdrop-blur-md flex justify-end gap-3 shrink-0 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">Batal</button>
                    <button onClick={onApply} className="flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold bg-[var(--primary)] hover:brightness-110 text-white shadow-lg transition-colors">
                        <Check size={16} /> Terapkan Filter
                    </button>
                </div>
            </div>
        </div>
    );
}