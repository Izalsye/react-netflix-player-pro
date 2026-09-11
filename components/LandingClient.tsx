'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Tidak perlu useRouter lagi karena kita pakai Link
import { Key, Play, ChevronRight, X, UserPlus, Database, LayoutGrid, Sun, Moon, User, ChevronDown, LogOut, Send, Globe } from 'lucide-react';
import { ProviderConfig } from '@/data/endpoints';

export default function LandingClient({ providers }: { providers: ProviderConfig[] }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('indocast_api_key');
    if (savedKey) setIsLoggedIn(true);

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    localStorage.setItem('indocast_api_key', apiKey);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('indocast_api_key');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setApiKey('');
  };

  return (
    // Kita pastikan semantik HTML bagus (nav, header, section)
    <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 transition-colors duration-300">

      {/* NAVBAR */}
      <nav aria-label="Main Navigation" className="sticky top-4 z-40 flex items-center justify-between mb-12 bg-white/80 dark:bg-[#111522]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-3 px-5 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white">
            <Play className="ml-1" size={20} fill="currentColor" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Indocast.
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title="Toggle Light/Dark Mode"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isLoggedIn ? (
            /* DROPDOWN MENU JIKA SUDAH LOGIN */
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <User size={16} className="text-[var(--primary)]" />
                <span className="hidden sm:inline">Akun Saya</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <LayoutGrid size={16} className="text-slate-400" />
                      Dashboard
                    </Link>

                    <div className="h-[1px] bg-slate-100 dark:bg-white/10 my-1 mx-4" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* TOMBOL LOGIN & DAFTAR (JIKA BELUM LOGIN) */
            <>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors px-3 py-2 hidden md:block"
              >
                Masuk
              </button>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 dark:bg-[var(--primary)] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all active:scale-95"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="text-center max-w-3xl mx-auto mb-16 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-[var(--primary)]/10 border border-slate-200 dark:border-[var(--primary)]/20 text-slate-600 dark:text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
          <Database size={14} aria-hidden="true" /> V3 API Engine Ready
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight transition-colors">
          Pusat Kontrol <br className="hidden md:block" />
          <span className="text-[var(--primary)]">
            Streaming & Metadata
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto transition-colors">
          Satu API untuk mengakses ribuan data film, drama, anime, hingga komik. Dilengkapi dukungan raw M3U8, DASH, subtitle multi-bahasa, dan bypass DRM.
        </p>
      </header>

      {/* PROVIDER GRID */}
      <section aria-labelledby="provider-heading">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 id="provider-heading" className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Layanan Tersedia</h2>
          <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full transition-colors">
            {providers.length} Provider
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {providers.map((p) => (
            /* 
               🔥 FIX SEO TERBAIK: 
               Kembalikan jadi <Link href="..."> biar Googlebot bisa index.
               Tapi buat manusia, kita interupsi pakai onClick + e.preventDefault() kalau belum login. 
            */
            <Link
              key={p.id}
              href={`/dashboard`}
              onClick={(e) => {
                // Kalau user belum login, STOP pindah halaman & munculin modal
                if (!isLoggedIn) {
                  e.preventDefault();
                  setIsLoginModalOpen(true);
                }
              }}
              className="group bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 p-5 md:p-6 rounded-3xl hover:border-[var(--primary)] dark:hover:border-[var(--primary)]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-[#0B0E14] border border-slate-100 dark:border-white/5 flex items-center justify-center text-3xl shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  {typeof p.logo === 'string' && p.logo.startsWith('<svg') ? (
                    <div className="w-8 h-8 text-slate-700 dark:text-white [&>svg]:w-full [&>svg]:h-full transition-colors" dangerouslySetInnerHTML={{ __html: p.logo }} />
                  ) : typeof p.logo === 'string' && (p.logo.startsWith('http') || p.logo.startsWith('/')) ? (
                    <img src={p.logo} alt={`Logo provider ${p.name}`} className="w-8 h-8 object-contain" />
                  ) : (
                    <span>{p.logo}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--primary)] transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-[10px] md:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                    {p.groups.reduce((acc, g) => acc + g.endpoints.length, 0)} Endpoints
                  </div>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6 transition-colors">
                {p.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 transition-colors">
                <span className="text-xs font-bold text-slate-400 group-hover:text-[var(--primary)] transition-colors">Lihat Dokumentasi</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <ChevronRight size={16} aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================
          MODAL LOGIN POPUP 
      ========================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setIsLoginModalOpen(false)}
          />

          <div
            className="relative w-full max-w-md bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-labelledby="login-title"
          >
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 rounded-full p-2"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            <h3 id="login-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Selamat Datang</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 transition-colors">
              Masukkan API Key Anda untuk masuk.
            </p>

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="apiKey" className="sr-only">API Key</label>
                <input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste API Key di sini..."
                  className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-400"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!apiKey}
                className="w-full bg-[var(--primary)] hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 text-white font-bold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2"
              >
                Masuk
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500 transition-colors">
              Belum punya API Key?{' '}
              <button onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} className="text-[var(--primary)] hover:underline font-bold">
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL REGISTER (PILIH METODE DAFTAR)
      ========================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setIsRegisterModalOpen(false)}
          />

          <div
            className="relative w-full max-w-md bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-labelledby="register-title"
          >
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 rounded-full p-2"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            <h3 id="register-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Pilih Metode Daftar</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 transition-colors">
              Silakan pilih cara pendaftaran yang paling nyaman buat Anda.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="https://t.me/wenetviqi"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsRegisterModalOpen(false)}
                className="group flex items-center gap-4 bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 hover:border-[#0088cc] dark:hover:border-[#0088cc] p-4 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] shrink-0 group-hover:scale-105 transition-transform">
                  <Send size={20} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0088cc] transition-colors">Via Telegram Bot</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cepat & instan. Dapatkan API Key langsung dari chat bot.</p>
                </div>
              </a>

              <Link
                href="/register"
                onClick={() => setIsRegisterModalOpen(false)}
                className="group flex items-center gap-4 bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] p-4 rounded-2xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0 group-hover:scale-105 transition-transform">
                  <Globe size={20} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[var(--primary)] transition-colors">Via Halaman Web</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gunakan username dan nama lengkap untuk mendaftar.</p>
                </div>
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500 transition-colors">
              Sudah punya API Key?{' '}
              <button onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} className="text-[var(--primary)] hover:underline font-bold">
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}