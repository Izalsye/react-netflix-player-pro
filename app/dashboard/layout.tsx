'use client';

import { useState, useEffect } from 'react';
import { Menu, Search, Bell, UserCircle, Sun, Moon } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 🔥 STATE BARU UNTUK DATA USER DI NAVBAR
    const [userData, setUserData] = useState<any>(null);

    // Cek tema & Ambil Data Profil pas pertama kali load
    useEffect(() => {
        // --- 1. LOGIKA TEMA DARK/LIGHT ---
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }

        // --- 2. AMBIL DATA USER UNTUK PROFIL NAVBAR ---
        const fetchProfile = async () => {
            const savedKey = localStorage.getItem('indocast_api_key');
            if (savedKey) {
                try {
                    const res = await fetch('/api/user/me', {
                        headers: { 'x-api-key': savedKey }
                    });
                    if (res.ok) {
                        const json = await res.json();
                        setUserData(json.data);
                    }
                } catch (error) {
                    console.error("Gagal load data profil:", error);
                }
            }
        };
        fetchProfile();
    }, []);

    // Fungsi Toggle Tema
    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div
            className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#090C10] selection:bg-[var(--primary)] selection:text-white transition-colors duration-300"
            style={{ '--primary': process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9' } as React.CSSProperties}
        >
            {/* BACKDROP MOBILE */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR COMPONENT */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* AREA KANAN */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">

                {/* 🔥 NAVBAR / HEADER GLOBAL 🔥 */}
                <header className="h-16 shrink-0 bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 md:px-8 z-30 transition-colors">

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-white/5 border border-transparent focus-within:border-[var(--primary)]/50 focus-within:bg-white dark:focus-within:bg-[#151822] rounded-xl transition-all w-64 shadow-inner">
                            <Search size={16} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari endpoint atau data..."
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Kanan: Theme Toggle, Notifikasi & Profil */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all"
                            title={isDarkMode ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-[#0B0E14]"></span>
                        </button>

                        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 hidden sm:block mx-1"></div>

                        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-1">
                            {/* 🔥 PROFIL DINAMIS 🔥 */}
                            <div className="hidden sm:block text-right">
                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {userData ? userData.firstName : 'Memuat...'}
                                </div>
                                <div className="text-[10px] font-medium text-[var(--primary)]">
                                    {userData ? `${userData.role} Member` : ''}
                                </div>
                            </div>

                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-purple-500 p-[2px]">
                                <div className="w-full h-full bg-white dark:bg-[#151822] rounded-full flex items-center justify-center overflow-hidden">
                                    <UserCircle size={24} className="text-slate-400" />
                                </div>
                            </div>
                        </button>
                    </div>
                </header>

                {/* AREA SCROLL */}
                <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar relative">

                    <main className="flex-1 p-4 sm:p-6 md:p-8">
                        {children}
                    </main>

                    {/* FOOTER GLOBAL */}
                    <footer className="shrink-0 border-t border-slate-200 dark:border-white/5 py-4 px-4 sm:px-6 md:px-8 mt-auto md:sticky md:bottom-0 bg-slate-50 dark:bg-[#090C10] z-20 transition-colors">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <p>© {new Date().getFullYear()} Indocast API. All rights reserved.</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-[var(--primary)] transition-colors">Dokumentasi</a>
                                <a href="#" className="hover:text-[var(--primary)] transition-colors">Bantuan</a>
                                <a href="#" className="hover:text-[var(--primary)] transition-colors">Syarat & Ketentuan</a>
                            </div>
                        </div>
                    </footer>

                </div>

            </div>
        </div>
    );
}