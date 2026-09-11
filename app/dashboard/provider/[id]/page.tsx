'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Info, Box, Code2, BookOpen, Layout, Globe, Play, MonitorPlay } from 'lucide-react';
import { providers } from '@/data/endpoints';
import EndpointCard from '@/components/dashboard/EndpointCard';
import LivePlayerTab from '@/components/docs/LivePlayerTab';
import PrimeVideoDoc from '@/components/docs/PrimeVideoDoc';
import HboDoc from '@/components/docs/HboDoc';
import PreviewTab from '@/components/docs/PreviewTab';

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const providerId = resolvedParams.id;
    const provider = providers[providerId as keyof typeof providers];

    const [apiKey, setApiKey] = useState<string>('');
    const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'endpoints' | 'docs' | 'live' | 'preview'>('endpoints');
    const [lang, setLang] = useState<'id' | 'en'>('id');

    useEffect(() => {
        const key = localStorage.getItem('indocast_api_key') || '';
        setApiKey(key);
    }, []);

    if (!provider) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <Box size={64} className="text-slate-300 dark:text-slate-700 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Provider Tidak Ditemukan</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Mungkin provider ini sedang dimaintenance atau URL tidak valid.</p>
                <Link href="/dashboard" className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
                    Kembali ke Dashboard
                </Link>
            </div>
        );
    }

    const renderDocumentation = () => {
        switch (providerId) {
            case 'primevideo':
                return <PrimeVideoDoc lang={lang} />;
            case 'hbo':
                return <HboDoc lang={lang} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 rounded-2xl">
                        <Code2 size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            {lang === 'id' ? 'Dokumentasi Belum Tersedia' : 'Documentation Unavailable'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center max-w-md">
                            {lang === 'id'
                                ? <>Dokumentasi khusus untuk <span className="font-semibold text-[var(--primary)]">{provider.name}</span> sedang dalam tahap penyusunan.</>
                                : <>Specific documentation for <span className="font-semibold text-[var(--primary)]">{provider.name}</span> is currently being drafted.</>}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--primary)] transition-colors">
                <ArrowLeft size={16} /> Kembali
            </Link>

            <div className="relative bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/5 p-6 md:p-10 rounded-[2rem] shadow-sm overflow-hidden transition-colors duration-300">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-slate-50 dark:bg-[#090C10] border border-slate-200 dark:border-white/10 flex items-center justify-center text-4xl shrink-0 overflow-hidden shadow-inner">
                        {typeof provider.logo === 'string' && provider.logo.startsWith('<svg') ? (
                            <div className="w-12 h-12 text-slate-700 dark:text-white [&>svg]:w-full [&>svg]:h-full transition-colors" dangerouslySetInnerHTML={{ __html: provider.logo }} />
                        ) : typeof provider.logo === 'string' && (provider.logo.startsWith('http') || provider.logo.startsWith('/')) ? (
                            <img src={provider.logo} alt={provider.name} className="w-12 h-12 object-contain" />
                        ) : (
                            <span>{provider.logo}</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{provider.name}</h1>
                            <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                API Ready
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl text-sm md:text-base">
                            {provider.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-xl w-full sm:w-fit overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setActiveTab('endpoints')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'endpoints' ? 'bg-white dark:bg-[#1A1F2C] text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Layout size={16} className="shrink-0" /> Endpoints
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'docs' ? 'bg-white dark:bg-[#1A1F2C] text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <BookOpen size={16} className="shrink-0" /> {lang === 'id' ? 'Dokumentasi' : 'Docs'}
                    </button>
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'live' ? 'bg-white dark:bg-[#1A1F2C] text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Play size={16} className="shrink-0" /> Playground
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'preview' ? 'bg-white dark:bg-[#1A1F2C] text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <MonitorPlay size={16} className="shrink-0" /> Preview
                    </button>
                </div>

                {activeTab === 'docs' && (
                    <div className="flex items-center gap-2 bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 p-1 rounded-lg shadow-sm w-fit self-start sm:self-auto">
                        <Globe size={14} className="ml-2 text-slate-400" />
                        <button onClick={() => setLang('id')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'id' ? 'bg-[var(--primary)] text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                            ID
                        </button>
                        <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-[var(--primary)] text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                            EN
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6">
                {activeTab === 'endpoints' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {provider.groups.map((group, groupIdx) => (
                            <div key={groupIdx} className="space-y-4">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-2">
                                    <Terminal size={20} className="text-[var(--primary)]" />
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{group.name}</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {group.endpoints.map((endpoint, endIdx) => {
                                        const uniqueKey = `${groupIdx}-${endIdx}`;
                                        return (
                                            <EndpointCard
                                                key={uniqueKey}
                                                endpoint={endpoint}
                                                providerId={providerId}
                                                apiKey={apiKey}
                                                isExpanded={expandedEndpoint === uniqueKey}
                                                onToggle={() => setExpandedEndpoint(expandedEndpoint === uniqueKey ? null : uniqueKey)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {renderDocumentation()}
                    </div>
                )}

                {activeTab === 'live' && (
                    <LivePlayerTab providerId={providerId} lang={lang} />
                )}

                {/* 🔥 BUG FIX: Props lang dihapus karena sudah di-handle di dalam PreviewTab */}
                {activeTab === 'preview' && (
                    <PreviewTab providerId={providerId} apiKey={apiKey} />
                )}
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl text-blue-800 dark:text-blue-300 text-sm mt-8">
                <Info size={20} className="shrink-0 mt-0.5" />
                <p>
                    <strong>{lang === 'id' ? 'Catatan:' : 'Note:'}</strong> {lang === 'id' ? 'Jangan lupa sertakan header' : 'Do not forget to include the'} <code className="bg-white dark:bg-black/20 px-1 py-0.5 rounded border border-blue-200 dark:border-blue-500/30 font-mono text-xs">x-api-key</code> {lang === 'id' ? 'di setiap request Anda untuk melewati otentikasi API.' : 'header in your requests to bypass API authentication.'}
                </p>
            </div>
        </div>
    );
}