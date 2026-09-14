'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Globe, ChevronDown, User, LogOut, X, Menu } from 'lucide-react';
import { ProviderConfig, Endpoint } from '@/data/endpoints';
import { PreviewMenu } from '@/lib/adapter/types';

interface PreviewNavbarProps {
    provider: ProviderConfig;
    endpoints: Endpoint[];
    apiMenus: PreviewMenu[];
    activeEndpoint: string;
    onMenuClick: (endpointId: string) => void;
    lang: string;
    onLangChange: (lang: string) => void;
    apiKey: string;
    onOpenLogin: () => void;
    availableLangs?: { code: string, name: string }[];
}

export default function PreviewNavbar({ provider, endpoints, apiMenus, activeEndpoint, onMenuClick, lang, onLangChange, apiKey, onOpenLogin, availableLangs }: PreviewNavbarProps) {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State for the expanding search bar
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close search when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isSearchOpen && searchInputRef.current && !searchInputRef.current.contains(event.target as Node) && !(event.target as Element).closest('.search-toggle-btn')) {
                setIsSearchOpen(false);
                setSearchQuery('');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

    const validMenuIds = [
        'home', 'trending', 'movies', 'series', 'ongoing', 'terbaru',
        'hbo-home', 'hbo-series', 'hbo-movies'
    ];

    // Asumsi lu pake properti 'name' dari adapter, tapi dirender jadi 'label' di UI
    const displayMenus = apiMenus.length > 0
        ? apiMenus.map(m => ({ id: m.id, label: (m as any).name || (m as any).label, isActive: activeEndpoint === m.id }))
        : endpoints
            .filter(e => validMenuIds.includes(e.id))
            .map(e => ({ id: e.id, label: e.name, isActive: activeEndpoint === e.id }));

    // 🔥 LOGIC PEMBATASAN MENU DEKTOP DENGAN EXPLORE DI LUAR DROPDOWN 🔥
    const MAX_VISIBLE_MENUS = 5;

    // Pisahkan 'explore' dari daftar menu utama supaya bisa kita tempatkan di paling ujung
    const exploreMenu = displayMenus.find(m => m.id === 'explore' || m.id === 'search');
    const filteredMenus = displayMenus.filter(m => m.id !== 'explore' && m.id !== 'search');

    const visibleMenus = filteredMenus.slice(0, MAX_VISIBLE_MENUS);
    const dropdownMenus = filteredMenus.slice(MAX_VISIBLE_MENUS);

    const handleLogout = () => {
        localStorage.removeItem('indocast_api_key');
        window.location.reload();
    };

    return (
        <>
            <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 md:px-6 bg-[#0B0E14] md:bg-gradient-to-b md:from-[#0B0E14] md:via-[#0B0E14]/95 md:to-transparent md:backdrop-blur-md">

                {/* 1. LOGO & MENU */}
                <div className="flex items-center gap-4 md:gap-10">

                    {/* Tombol Garis Tiga (Hanya Mobile) */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-slate-300 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="h-7 md:h-8 flex items-center cursor-pointer shrink-0">
                        {typeof provider.logo === 'string' && provider.logo.startsWith('<svg') ? (
                            <div className="h-full text-[var(--primary)] [&>svg]:h-full [&>svg]:w-auto" dangerouslySetInnerHTML={{ __html: provider.logo }} />
                        ) : typeof provider.logo === 'string' && (provider.logo.startsWith('http') || provider.logo.startsWith('/')) ? (
                            <img src={provider.logo} alt="Logo" className="h-full object-contain" />
                        ) : (
                            <span className="text-2xl">{provider.logo}</span>
                        )}
                    </div>

                    {/* 🔥 Menu Web / Desktop 🔥 */}
                    <nav className="hidden lg:flex items-center gap-5">

                        {/* 1. Render Menu Utama (Misal: Home, Anime, Drama, dll) */}
                        {visibleMenus.map(menu => (
                            <button
                                key={menu.id}
                                onClick={() => onMenuClick(menu.id)}
                                className={`text-sm font-semibold transition-colors capitalize whitespace-nowrap py-2 ${menu.isActive || activeEndpoint === menu.id ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-slate-400 hover:text-white'}`}
                            >
                                {menu.label}
                            </button>
                        ))}

                        {/* 2. Render Menu Dropdown "Lainnya" (Jika ada sisa menu) */}
                        {dropdownMenus.length > 0 && (
                            <div className="relative group cursor-pointer py-2">
                                <button className="flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                    Lainnya <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                                </button>

                                <div className="absolute left-0 top-full mt-0 w-48 bg-[#151822] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2 max-h-96 overflow-y-auto custom-scrollbar">
                                    {dropdownMenus.map(menu => (
                                        <button
                                            key={menu.id}
                                            onClick={() => onMenuClick(menu.id)}
                                            className={`text-left px-4 py-2 text-sm transition-colors ${menu.isActive || activeEndpoint === menu.id ? 'text-white bg-white/10 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {menu.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. 🔥 SELALU RENDER EXPLORE DI SINI (Di luar dropdown) 🔥 */}
                        {exploreMenu && (
                            <button
                                key={exploreMenu.id}
                                onClick={() => onMenuClick(exploreMenu.id)}
                                className={`text-sm font-semibold transition-colors capitalize whitespace-nowrap py-2 ${exploreMenu.isActive || activeEndpoint === exploreMenu.id ? 'text-[var(--primary)] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-slate-400 hover:text-white'}`}
                            >
                                {exploreMenu.label}
                            </button>
                        )}
                    </nav>
                </div>

                {/* 2. TOOLBAR KANAN */}
                <div className="flex items-center gap-3 md:gap-5 text-slate-300">

                    {/* Expanding Search Bar */}
                    <div className={`flex items-center transition-all duration-300 ease-in-out border border-transparent ${isSearchOpen ? 'bg-black/50 border-white/20 rounded-md px-2 py-1' : ''}`}>
                        <button
                            onClick={() => {
                                setIsSearchOpen(true);
                                setTimeout(() => searchInputRef.current?.focus(), 100);
                            }}
                            className={`search-toggle-btn transition-colors ${isSearchOpen ? 'text-white' : 'hover:text-white'}`}
                        >
                            <Search size={20} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${isSearchOpen ? 'w-32 md:w-48 ml-2 opacity-100' : 'w-0 opacity-0'}`}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Cari tayangan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-400"
                                onKeyDown={(e) => {
                                    // PENTING: Bikin logic biar pencarian jalan
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        // Panggil fungsi search atau pindah ke endpoint explore dengan query string
                                        window.location.href = `?q=${encodeURIComponent(searchQuery.trim())}`;
                                    }
                                }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white ml-1">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Dropdown Bahasa - HANYA MUNCUL JIKA ADA DATA availableLangs */}
                    {availableLangs && availableLangs.length > 0 && (
                        <div className="relative flex items-center">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 hover:text-white transition-colors text-sm font-bold uppercase"
                            >
                                <Globe size={18} /> {lang.split('_')[0]} <ChevronDown size={14} />
                            </button>

                            {isLangOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                                    <div className="absolute right-0 top-8 w-36 bg-[#151822] border border-white/10 rounded-lg shadow-xl z-50 py-1 text-xs font-bold max-h-64 overflow-y-auto custom-scrollbar">
                                        {availableLangs.map(l => (
                                            <button
                                                key={l.code}
                                                onClick={() => { onLangChange(l.code); setIsLangOpen(false); }}
                                                className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors ${lang === l.code ? 'text-[var(--primary)] bg-white/5' : 'text-white'}`}
                                            >
                                                {l.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Profil & Logout */}
                    {apiKey ? (
                        <div className="relative">
                            <div
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                            >
                                <User size={16} className="text-white" />
                            </div>
                            {isUserMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-40 bg-[#151822] border border-white/10 rounded-lg shadow-xl z-50 py-1 text-xs font-bold overflow-hidden">
                                        <div className="px-4 py-2 border-b border-white/5 text-slate-400 font-mono truncate">{apiKey.substring(0, 8)}...</div>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-500/20 text-rose-400 transition-colors">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button onClick={onOpenLogin} className="bg-[var(--primary)] text-white text-xs font-bold px-4 py-1.5 rounded-md hover:brightness-110">
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* SIDEBAR MOBILE */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-[200] flex">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    <div className="relative w-64 bg-[#11141D] h-full shadow-2xl flex flex-col animate-in slide-in-from-left-full duration-300">
                        <div className="p-5 flex items-center justify-between border-b border-white/10">
                            <span className="font-bold text-white text-lg">Menu Navigasi</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col py-4 overflow-y-auto custom-scrollbar">
                            {/* Di mobile, biarin aja ngumpul berjejer ke bawah semua */}
                            {displayMenus.map(menu => (
                                <button
                                    key={menu.id}
                                    onClick={() => {
                                        onMenuClick(menu.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`text-left px-6 py-3.5 font-semibold transition-colors capitalize border-l-4 ${menu.isActive || activeEndpoint === menu.id
                                        ? 'text-white bg-white/5 border-[var(--primary)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                                        }`}
                                >
                                    {menu.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}