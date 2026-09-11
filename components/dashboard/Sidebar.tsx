'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutGrid,
    User,
    LogOut,
    Play,
    ChevronDown,
    FilePlay,
    X,
    ChevronLeft,
    ChevronRight,
    Folder
} from 'lucide-react';
import { providers } from '@/data/endpoints';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const providerList = Object.values(providers);
    const [isProviderOpen, setIsProviderOpen] = useState(true);

    // State buat minimize sidebar (Desktop)
    const [isMinimized, setIsMinimized] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('indocast_api_key');
        window.location.href = '/';
    };

    const handleCloseMobile = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        // 🔥 FIX ADA DI BARIS INI: Tambahin md:translate-x-0 dan shrink-0 🔥
        <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-50 dark:bg-[#0B0E14] border-r border-slate-200 dark:border-white/5 flex flex-col transition-all duration-300 ease-in-out md:relative md:translate-x-0 shrink-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${isMinimized ? 'md:w-20' : 'md:w-64'} w-64`}>

            {/* TOMBOL MINIMIZE DESKTOP */}
            <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hidden md:flex absolute -right-3 top-7 w-6 h-6 bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-full items-center justify-center text-slate-500 hover:text-[var(--primary)] transition-colors z-50 shadow-sm"
            >
                {isMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* LOGO AREA */}
            <div className={`h-20 flex items-center px-6 border-b border-slate-200 dark:border-white/5 shrink-0 transition-all ${isMinimized ? 'md:justify-center md:px-0' : 'justify-between'}`}>
                <Link href="/" className="flex items-center gap-3 group overflow-hidden">
                    <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0">
                        <Play className="ml-0.5" size={16} fill="currentColor" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-300 whitespace-nowrap ${isMinimized ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                        Indocast<span className="text-[var(--primary)]">.</span>
                    </span>
                </Link>

                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* MENU AREA */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar pb-10">

                {/* MENU: UTAMA */}
                <div>
                    <div className={`text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 transition-all duration-300 whitespace-nowrap overflow-hidden ${isMinimized ? 'md:w-0 md:opacity-0 md:h-0' : 'w-auto opacity-100 px-3'}`}>
                        Menu Utama
                    </div>
                    <Link
                        href="/dashboard"
                        onClick={handleCloseMobile}
                        className={`flex items-center gap-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${pathname === '/dashboard'
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            } ${isMinimized ? 'md:justify-center px-0' : 'px-3'}`}
                    >
                        <LayoutGrid size={18} className="shrink-0" />
                        <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isMinimized ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                            Dashboard
                        </span>
                    </Link>
                </div>

                {/* MENU: PROVIDER (DROPDOWN) */}
                <div>
                    <button
                        onClick={() => {
                            if (isMinimized) setIsMinimized(false);
                            setIsProviderOpen(!isProviderOpen);
                        }}
                        className={`w-full flex items-center hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-2 ${isMinimized ? 'md:justify-center px-0 mb-3' : 'justify-between px-3 mb-1'}`}
                    >
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <Folder size={18} className="shrink-0" />
                            <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isMinimized ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                                Providers
                            </span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProviderOpen ? 'rotate-180' : ''} ${isMinimized ? 'md:hidden' : 'block'}`} />
                    </button>

                    <div className={`space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${isProviderOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        {providerList.map((p: any) => {
                            const isActive = pathname === `/dashboard/provider/${p.id}`;

                            // Ambil URL icon dari data provider (sesuaikan jika nama fieldnya p.icon / p.logo / p.image)
                            const providerIcon = p.icon || p.logo || p.image;

                            return (
                                <Link
                                    key={p.id}
                                    href={`/dashboard/provider/${p.id}`}
                                    onClick={handleCloseMobile}
                                    className={`flex items-center gap-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${isActive
                                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        } ${isMinimized ? 'md:justify-center px-0' : 'px-3 ml-2'}`}>

                                    {/* 🎯 LOGO DINAMIS PER PROVIDER (Support Gambar, Emoji, & Raw SVG) */}
                                    <div className="w-5 h-5 shrink-0 flex items-center justify-center rounded overflow-hidden">
                                        {providerIcon ? (
                                            typeof providerIcon === 'string' ? (
                                                // 1. Cek apakah ini raw SVG string
                                                providerIcon.trim().startsWith('<svg') ? (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                                        dangerouslySetInnerHTML={{ __html: providerIcon }}
                                                    />
                                                ) :
                                                    // 2. Cek apakah ini URL gambar
                                                    providerIcon.startsWith('http') || providerIcon.startsWith('/') || providerIcon.includes('.') ? (
                                                        <img
                                                            src={providerIcon}
                                                            alt={p.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        // 3. Kalau cuma Emoji, render sebagai teks
                                                        <span className="text-sm leading-none">{providerIcon}</span>
                                                    )
                                            ) : (
                                                // 4. Kalau bentuknya komponen React (contoh: <Play />)
                                                providerIcon
                                            )
                                        ) : (
                                            // 5. Fallback kalau gak ada data icon sama sekali
                                            <FilePlay size={16} className={`shrink-0 ${isActive ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                                        )}
                                    </div>

                                    <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isMinimized ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                                        {p.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* FOOTER MENU (AKUN & LOGOUT) */}
            <div className={`p-4 border-t border-slate-200 dark:border-white/5 space-y-1 shrink-0 bg-slate-50 dark:bg-[#0B0E14] ${isMinimized ? 'md:px-2' : ''}`}>
                <Link
                    href="/dashboard/account"
                    onClick={handleCloseMobile}
                    className={`flex items-center gap-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${pathname === '/dashboard/account'
                        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                        } ${isMinimized ? 'md:justify-center px-0' : 'px-3'}`}
                >
                    <User size={18} className="shrink-0" />
                    <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isMinimized ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                        Akun Saya
                    </span>
                </Link>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-all font-semibold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 ${isMinimized ? 'md:justify-center px-0' : 'px-3'}`}
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isMinimized ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                        Keluar
                    </span>
                </button>
            </div>

        </aside>
    );
}