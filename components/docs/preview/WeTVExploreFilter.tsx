'use client';

interface WeTVExploreFilterProps {
    filters: any[];
    activeFilters: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

export default function WeTVExploreFilter({ filters, activeFilters, onChange }: WeTVExploreFilterProps) {
    if (!filters || filters.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3 md:gap-4 px-4 md:px-6 mb-8 -mt-2">
            {filters.map((filterGroup) => (
                <div key={filterGroup.paramKey} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{filterGroup.name}</label>
                    <select
                        value={activeFilters[filterGroup.paramKey] || ''}
                        className="bg-[#151822] text-white text-sm font-semibold border border-white/10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer hover:border-white/30 transition-colors"
                        onChange={(e) => onChange(filterGroup.paramKey, e.target.value)}
                    >
                        {filterGroup.options.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}