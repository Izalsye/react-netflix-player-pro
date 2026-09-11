'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, User, Shield, Bell,
    Camera, Save, Trash2, Send, Key, AlertTriangle, HardHat
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('umum');
    const [isSaving, setIsSaving] = useState(false);

    // Data disesuaikan dengan Schema Prisma
    const [formData, setFormData] = useState({
        firstName: 'Faisol',
        lastName: 'Developer',
        username: 'Developer_V3',
        telegramId: '123456789',
    });

    useEffect(() => {
        const savedKey = localStorage.getItem('indocast_api_key');
        if (!savedKey) {
            router.push('/');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Profil berhasil diperbarui!');
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0ea5e9]"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* HEADER KONTEN */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-[#0ea5e9] transition-colors text-sm font-bold">
                    <ArrowLeft size={16} />
                    Kembali ke Dashboard
                </Link>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profil Saya</h1>
            </div>

            <div className="flex flex-col gap-6">

                {/* =========================================
            HORIZONTAL TABS (Mobile Friendly)
        ========================================= */}
                <div className="w-full relative">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <button
                            onClick={() => setActiveTab('umum')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeTab === 'umum'
                                    ? 'bg-[#0ea5e9] text-white border-[#0ea5e9] shadow-md shadow-[#0ea5e9]/20'
                                    : 'bg-white dark:bg-[#151822] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <User size={16} /> Informasi Umum
                        </button>
                        <button
                            onClick={() => setActiveTab('keamanan')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeTab === 'keamanan'
                                    ? 'bg-[#0ea5e9] text-white border-[#0ea5e9] shadow-md shadow-[#0ea5e9]/20'
                                    : 'bg-white dark:bg-[#151822] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <Shield size={16} /> Keamanan Akun
                        </button>
                        <button
                            onClick={() => setActiveTab('notifikasi')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeTab === 'notifikasi'
                                    ? 'bg-[#0ea5e9] text-white border-[#0ea5e9] shadow-md shadow-[#0ea5e9]/20'
                                    : 'bg-white dark:bg-[#151822] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <Bell size={16} /> Notifikasi
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT AREA DENGAN OVERLAY BLUR */}
                <div className="w-full relative rounded-[2rem] overflow-hidden">

                    {/* 🔥 OVERLAY BLUR "MASIH DALAM PENGEMBANGAN" 🔥 */}
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-[#0B0E14]/60 backdrop-blur-[4px]">
                        <div className="bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 shadow-2xl p-6 md:p-8 rounded-[2rem] flex flex-col items-center text-center max-w-sm mx-4 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                                <HardHat size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Masih Dalam Pengembangan</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Fungsi form ini masih dalam tahap *development* ya bre kwkwkw. Tunggu update selanjutnya!
                            </p>
                        </div>
                    </div>

                    {/* Konten di bawahnya akan kena efek blur karena ada overlay di atas */}
                    <div className="pointer-events-none opacity-80 select-none">

                        {/* =========================================
                TAB: INFORMASI UMUM
            ========================================= */}
                        {activeTab === 'umum' && (
                            <div className="bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">Informasi Umum</h2>

                                {/* SECTION: FOTO PROFIL */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-white/5">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] flex items-center justify-center text-white text-4xl font-bold shadow-lg shrink-0">
                                        {formData.firstName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base">Foto Profil</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">PNG, JPG atau GIF maksimal 2MB.</p>
                                        <div className="flex items-center justify-center sm:justify-start gap-3">
                                            <button type="button" className="text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg">
                                                Ubah Foto
                                            </button>
                                            <button type="button" className="text-xs font-bold text-rose-500 px-5 py-2.5 rounded-lg">
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: FORM DATA */}
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Depan</label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    readOnly
                                                    className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Belakang (Opsional)</label>
                                            <div className="relative">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-50" />
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    readOnly
                                                    className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                                <input
                                                    type="text"
                                                    value={formData.username}
                                                    readOnly
                                                    className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telegram ID (Opsional)</label>
                                            <div className="relative">
                                                <Send size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={formData.telegramId}
                                                    readOnly
                                                    className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 flex justify-end">
                                        <button type="button" className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#0ea5e9] text-white font-bold py-3 px-8 rounded-xl opacity-50 cursor-not-allowed">
                                            <Save size={18} /> Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* =========================================
                TAB: KEAMANAN AKUN 
            ========================================= */}
                        {activeTab === 'keamanan' && (
                            <div className="bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Keamanan Akun</h2>
                                <div className="space-y-8">
                                    <div className="p-5 rounded-2xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex gap-4">
                                        <Key size={24} className="text-[#0ea5e9] shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-[#0ea5e9] mb-1">Sistem Otentikasi API Key</h4>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                Sistem kami tidak menggunakan password tradisional. Seluruh akses akun Anda dijamin oleh <strong>API Key</strong> unik yang bersifat privat. Pastikan Anda menyimpan API Key Anda dengan aman.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex flex-col sm:flex-row items-start gap-4">
                                            <AlertTriangle size={24} className="text-rose-500 shrink-0 mt-1 hidden sm:block" />
                                            <div>
                                                <h3 className="font-bold text-rose-500 mb-2 flex items-center gap-2">
                                                    <AlertTriangle size={18} className="sm:hidden" /> Hapus Akun Permanen
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                                    Menghapus akun bersifat permanen dan tidak dapat dibatalkan. Semua API key yang terhubung akan langsung hangus dan akses ke layanan langganan VIP Anda akan dibatalkan tanpa pengembalian dana.
                                                </p>
                                                <button type="button" className="flex items-center justify-center sm:justify-start w-full sm:w-auto gap-2 text-sm font-bold border-2 border-rose-500/20 text-rose-600 dark:text-rose-400 px-6 py-2.5 rounded-xl opacity-50 cursor-not-allowed">
                                                    <Trash2 size={16} /> Hapus Akun Saya
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =========================================
                TAB: NOTIFIKASI
            ========================================= */}
                        {activeTab === 'notifikasi' && (
                            <div className="bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Pengaturan Notifikasi</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                                    Karena sistem terintegrasi dengan Telegram, atur preferensi pesan bot yang ingin Anda terima.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                                        <div className="pr-4">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white">Info Kuota & Masa Aktif VIP</div>
                                            <div className="text-xs text-slate-500 mt-1 leading-relaxed">Dapatkan pengingat otomatis via Telegram H-3 sebelum masa aktif VIP habis.</div>
                                        </div>
                                        <input type="checkbox" defaultChecked readOnly className="w-5 h-5 accent-[#0ea5e9] opacity-50" />
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                                        <div className="pr-4">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white">Pembaruan API & Downtime</div>
                                            <div className="text-xs text-slate-500 mt-1 leading-relaxed">Info *real-time* jika ada provider yang bermasalah atau penambahan endpoint baru.</div>
                                        </div>
                                        <input type="checkbox" defaultChecked readOnly className="w-5 h-5 accent-[#0ea5e9] opacity-50" />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}