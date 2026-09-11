'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle, Crown, Zap, Activity, Loader2, QrCode, X, Key, ArrowRight, Download } from 'lucide-react'; // 🎯 Tambah ikon Download
import { notify } from '@/lib/customToast';

export default function DashboardPage() {
    const [apiKey, setApiKey] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState<{ value: string; label: string; priceText: string } | null>(null);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [qrisData, setQrisData] = useState<{ url: string; amount: number; orderId: string } | null>(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('indocast_api_key');
        if (!savedKey) {
            window.location.href = '/';
            return;
        }
        setApiKey(savedKey);
        fetchUserData(savedKey);
    }, []);

    const fetchUserData = async (key: string) => {
        try {
            const res = await fetch('/api/user/me', {
                headers: { 'x-api-key': key }
            });
            if (res.ok) {
                const json = await res.json();
                setUserData(json.data);
            } else {
                localStorage.removeItem('indocast_api_key');
                window.location.href = '/';
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyKey = () => {
        navigator.clipboard.writeText(apiKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleProcessPayment = async () => {
        if (!selectedPlan) return;

        setIsPaymentLoading(true);
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ planType: selectedPlan.value })
            });
            const json = await res.json();

            if (json.success) {
                setQrisData({ url: json.data.qrisUrl, amount: json.data.amount, orderId: json.data.orderId });
                setSelectedPlan(null);
                notify.info('Doing OK', 'Tagihan berhasil dibuat. Silakan scan QRIS.'); // 🎯 Custom Toast
            } else {
                notify.error('Pay Attention!', 'Gagal membuat tagihan: ' + json.error); // 🎯 Custom Toast
            }
        } catch (error) {
            notify.error('Pay Attention!', 'Terjadi kesalahan jaringan.'); // 🎯 Custom Toast
        } finally {
            setIsPaymentLoading(false);
        }
    };

    // 🎯 FUNGSI DOWNLOAD GAMBAR QRIS
    const handleDownloadQris = async () => {
        if (!qrisData) return;
        try {
            const response = await fetch(qrisData.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `QRIS_${qrisData.orderId}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Fallback kalau kena block CORS
            window.open(qrisData.url, '_blank');
        }
    };

    // 🎯 FUNGSI POLLING (AUTO-SUCCESS): Mengecek status pembayaran setiap 3 detik
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (qrisData) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payment/status?orderId=${qrisData.orderId}`, {
                        headers: { 'x-api-key': apiKey }
                    });
                    const json = await res.json();

                    if (json.status === 'SETTLEMENT') {
                        clearInterval(interval);
                        setQrisData(null);

                        // 🎯 Ganti alert ini
                        notify.success('Doing Great!', 'Pembayaran Berhasil! Akun Anda sudah VIP.');

                        fetchUserData(apiKey);
                    } else if (json.status === 'EXPIRE') {
                        clearInterval(interval);
                        setQrisData(null);

                        // 🎯 Ganti alert ini
                        notify.error('Pay Attention!', 'Waktu pembayaran habis.');
                    }
                } catch (error) {
                    console.error("Gagal ngecek status:", error);
                }
            }, 3000); // Cek tiap 3 detik
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [qrisData, apiKey]);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center text-[var(--primary)]">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );
    }

    const usagePercent = Math.min((userData.usage / userData.limit) * 100, 100);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header & Status */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                        Halo, {userData.firstName}! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Kelola akses API dan pantau penggunaan harian Anda di sini.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-[#151822] px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm w-fit">
                    <div className={`w-2.5 h-2.5 rounded-full ${userData.role === 'VIP' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                    <span className="text-sm font-bold tracking-wider">{userData.role} PLAN</span>
                </div>
            </div>

            {/* Grid Konten Utama */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                {/* KIRI: STATS & API KEY */}
                <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                    {/* ... (CARD KUOTA & API KEY TETAP SAMA KAYA PUNYA LU) ... */}
                    <div className="bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-sm relative overflow-hidden transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kuota Harian</h2>
                        </div>

                        <div className="flex justify-between items-end mb-4">
                            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {userData.usage.toLocaleString()} <span className="text-lg font-medium text-slate-500">/ {userData.limit.toLocaleString()}</span>
                            </span>
                            <span className="text-sm font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">{usagePercent.toFixed(1)}%</span>
                        </div>

                        <div className="w-full h-3 bg-slate-100 dark:bg-[#090C10] rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-rose-500' : 'bg-[var(--primary)]'}`}
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-4 font-medium">Reset otomatis setiap jam 00:00 UTC.</p>
                    </div>

                    {/* Card API Key */}
                    <div className="bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-sm transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <Key size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">API Key Anda</h2>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#090C10] border border-slate-200 dark:border-white/10 p-2 pl-5 rounded-2xl">
                            <input
                                type="password"
                                value={apiKey}
                                readOnly
                                className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-white font-mono text-sm focus:outline-none"
                            />
                            <button
                                onClick={copyKey}
                                className="flex shrink-0 items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] rounded-xl text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
                            >
                                {isCopied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                <span className="text-xs font-bold hidden sm:block">{isCopied ? 'Tersalin' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* KANAN: UPGRADE VIP CARD */}
                <div className="space-y-6 lg:space-y-8">
                    <div className="bg-white dark:bg-[#151822] border-2 border-[var(--primary)]/20 dark:border-[var(--primary)]/30 p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden h-full flex flex-col transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] rounded-full blur-[60px] opacity-10 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <Crown size={28} className="text-amber-500" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upgrade VIP</h2>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">
                            Nikmati akses premium dan tingkatkan limit Anda hingga <strong className="text-slate-900 dark:text-white">1.000.000 request/hari</strong>.
                        </p>

                        <div className="space-y-3 relative z-10 flex-1">
                            {[
                                { label: '1 Bulan', value: '1_MONTH', priceText: 'Rp 45.000' },
                                { label: '2 Bulan', value: '2_MONTHS', priceText: 'Rp 80.000' },
                                { label: '3 Bulan', value: '3_MONTHS', priceText: 'Rp 105.000' },
                                { label: '6 Bulan', value: '6_MONTHS', priceText: 'Rp 180.000' },
                            ].map((plan) => (
                                <button
                                    key={plan.value}
                                    onClick={() => setSelectedPlan(plan)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-all group active:scale-95 text-left"
                                >
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{plan.label}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{plan.priceText}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                        <Zap size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* MODAL 1: PILIH METODE PEMBAYARAN */}
            {selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => !isPaymentLoading && setSelectedPlan(null)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95">

                        <button
                            onClick={() => setSelectedPlan(null)}
                            disabled={isPaymentLoading}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 rounded-full p-2"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Pilih Metode Pembayaran</h3>
                        <p className="text-sm text-slate-500 mb-6">Paket terpilih: <strong className="text-[var(--primary)]">{selectedPlan.label}</strong> ({selectedPlan.priceText})</p>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#090C10] border-2 border-[var(--primary)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xs">
                                        QR
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">QRIS (Instan)</div>
                                        <div className="text-xs text-slate-500">Scan pakai semua e-wallet & m-banking</div>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs">✓</div>
                            </div>
                        </div>

                        <button
                            onClick={handleProcessPayment}
                            disabled={isPaymentLoading}
                            className="w-full bg-[var(--primary)] hover:brightness-110 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-lg"
                        >
                            {isPaymentLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Memproses QRIS...</span>
                                </>
                            ) : (
                                <>
                                    <span>Buat Tagihan Pembayaran</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL 2: TAMPILAN QRIS MIDTRANS */}
            {qrisData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 text-center">

                        <button
                            onClick={() => setQrisData(null)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 rounded-full p-2"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center mb-4">
                            <QrCode size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Scan QRIS</h3>
                        <p className="text-sm text-slate-500 mb-6">Total Tagihan: <strong className="text-[var(--primary)] text-lg">Rp {qrisData.amount.toLocaleString()}</strong></p>

                        <div className="bg-white p-2 rounded-2xl border border-slate-200 mx-auto w-fit mb-4 shadow-sm relative group">
                            <img src={qrisData.url} alt="QRIS Midtrans" className="w-48 h-48 object-contain" />
                        </div>

                        {/* 🎯 TOMBOL DOWNLOAD QRIS 🎯 */}
                        <button
                            onClick={handleDownloadQris}
                            className="w-full flex items-center justify-center gap-2 mb-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
                        >
                            <Download size={16} />
                            Download QRIS
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--primary)] animate-pulse mb-2">
                            <Loader2 size={14} className="animate-spin" /> Menunggu Pembayaran...
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                            Halaman ini akan otomatis tertutup saat pembayaran berhasil.
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}