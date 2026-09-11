'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, AtSign, CheckCircle, Copy, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State untuk nyimpen hasil balikan dari API (terutama raw API Key)
    const [successData, setSuccessData] = useState<{ apiKey: string; firstName: string } | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Gagal mendaftar, silakan coba lagi.');
            }

            // Berhasil! Simpan datanya buat ditampilin
            setSuccessData({
                apiKey: data.data.apiKey,
                firstName: data.data.firstName,
            });

            // (Opsional) Langsung simpan ke localStorage biar user otomatis login
            localStorage.setItem('indocast_api_key', data.data.apiKey);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (successData?.apiKey) {
            navigator.clipboard.writeText(successData.apiKey);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <main
            className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-200 p-4 transition-colors duration-300"
            style={{ '--primary': process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#0ea5e9' } as React.CSSProperties}
        >
            <div className="relative w-full max-w-md bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">

                {/* Tombol Back */}
                {!successData && (
                    <Link
                        href="/"
                        className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 rounded-full p-2"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                )}

                {/* --- STATE 1: FORM PENDAFTARAN --- */}
                {!successData ? (
                    <div className="mt-8 md:mt-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Daftar Akun</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Buat akun untuk mendapatkan akses API Key gratis.
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Nama Depan *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Budi"
                                        className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Nama Belakang <span className="text-slate-400 lowercase font-normal">(Opsional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Santoso"
                                        className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Username <span className="text-slate-400 lowercase font-normal">(Opsional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <AtSign size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="budisantoso"
                                        className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[var(--primary)] dark:focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.firstName}
                                className="w-full mt-2 bg-[var(--primary)] hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 text-white font-bold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2"
                            >
                                {isLoading ? (
                                    <><Loader2 size={18} className="animate-spin" /> Memproses...</>
                                ) : (
                                    'Buat Akun'
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    /* --- STATE 2: BERHASIL DAFTAR (TAMPILIN API KEY) --- */
                    <div className="text-center py-4 animate-in slide-in-from-right-4 duration-500">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pendaftaran Sukses!</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Halo {successData.firstName}, ini adalah rahasia API Key Anda.
                            <span className="font-bold text-rose-500 block mt-1">Simpan baik-baik, key ini tidak akan ditampilkan lagi!</span>
                        </p>

                        <div className="relative mb-8">
                            <input
                                type="text"
                                readOnly
                                value={successData.apiKey}
                                className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-slate-900 dark:text-white font-mono text-center focus:outline-none"
                            />
                            <button
                                onClick={copyToClipboard}
                                title="Copy API Key"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-600 dark:text-white rounded-xl transition-colors"
                            >
                                {isCopied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
                            </button>
                        </div>

                        <Link
                            href="/dashboard"
                            className="w-full inline-flex justify-center items-center bg-[var(--primary)] hover:brightness-110 text-white font-bold py-3.5 rounded-2xl transition-all"
                        >
                            Masuk ke Dashboard
                        </Link>
                    </div>
                )}

            </div>
        </main>
    );
}