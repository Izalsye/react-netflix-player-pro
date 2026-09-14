'use client';

import { useState, useEffect } from 'react';
import { PreviewFeed, PreviewDetail, PreviewMenu } from '@/lib/adapter/types';
import { ProviderFactory } from '@/lib/adapter/ProviderFactory';
import { providers } from '@/data/endpoints';

import PreviewNavbar from './preview/PreviewNavbar';
import PreviewHero from './preview/PreviewHero';
import PreviewSection from './preview/PreviewSection';
import IdlixFilterModal from './preview/IdlixFilterModal';
import WeTVFilterModal from './preview/WeTVFilterModal';
import PreviewDetailModal from './preview/PreviewDetailModal';

import { X, Maximize, Loader2, Wrench, Filter } from 'lucide-react';
import Link from 'next/link';

interface PreviewTabProps { providerId: string; apiKey: string; isStandalone?: boolean; }

export default function PreviewTab({ providerId, apiKey, isStandalone = false }: PreviewTabProps) {
    const pId = providerId?.toLowerCase();
    const providerConfig = providers[providerId as keyof typeof providers];
    const allEndpoints = providerConfig?.groups.flatMap(g => g.endpoints) || [];

    const [feed, setFeed] = useState<PreviewFeed | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [activeEndpoint, setActiveEndpoint] = useState('home');
    const [lang, setLang] = useState('id');
    const [availableLangs, setAvailableLangs] = useState<{ code: string, name: string }[]>([]);
    const [navMenus, setNavMenus] = useState<PreviewMenu[]>([]);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [detailData, setDetailData] = useState<PreviewDetail | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [playResult, setPlayResult] = useState<any>(null);
    const [isPlayLoading, setIsPlayLoading] = useState(false);
    const [playEndpointId, setPlayEndpointId] = useState<string>('');

    // Modal Filter Master State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Filter Idlix States
    const [selectedSort, setSelectedSort] = useState('releaseDate');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

    // Filter WeTV States
    const [wetvFilters, setWetvFilters] = useState<any[]>([]);
    const [activeWetvFilters, setActiveWetvFilters] = useState<Record<string, string>>({});

    let adapter: any = null;
    let isMaintenance = false;
    try { if (pId) adapter = ProviderFactory.getAdapter(pId); } catch (err) { isMaintenance = true; }

    const buildUrl = (endpoint: any, customParams: Record<string, string>, currentLang: string, targetPage: number | string) => {
        if (!endpoint) return '';
        const queryParams = new URLSearchParams(customParams);
        if (endpoint.params.some((p: any) => p.name === 'lang') && !queryParams.has('lang')) queryParams.append('lang', currentLang);
        if (endpoint.params.some((p: any) => p.name === 'page') && !queryParams.has('page')) queryParams.append('page', targetPage.toString());

        const limitParam = endpoint.params.find((p: any) => p.name === 'perPage' || p.name === 'limit');
        if (limitParam?.default && !queryParams.has(limitParam.name)) queryParams.append(limitParam.name, limitParam.default);

        const qs = queryParams.toString();
        return qs ? `${endpoint.path}?${qs}` : endpoint.path;
    };

    useEffect(() => {
        if (!apiKey || !providerConfig) return;
        // Pindahkan pencarian endpoint ke dalam agar aman
        const langEndpoint = (providerConfig?.groups.flatMap(g => g.endpoints) || []).find((e: any) => e.id === 'lang');

        if (langEndpoint) {
            fetch(langEndpoint.path, { headers: { 'x-api-key': apiKey } })
                .then(res => res.json())
                .then(data => {
                    if (data?.data && Array.isArray(data.data)) {
                        const mappedLangs = data.data.map((l: any) => ({
                            code: l.code,
                            name: l.native || l.label || l.name || l.code
                        }));
                        setAvailableLangs(mappedLangs);
                    }
                })
                .catch(err => console.error("Gagal fetch lang:", err));
        }
    }, [providerId, apiKey]); // ✅ HAPUS allEndpoints DARI SINI // tambah allEndpoints ke dependency

    // Fetch WeTV Filters
    useEffect(() => {
        if (pId !== 'wetv' || !apiKey) return;
        const filterEndpoint = allEndpoints.find(e => e.id === 'explore-filters');
        if (filterEndpoint) {
            fetch(buildUrl(filterEndpoint, { lang }, lang, 1), { headers: { 'x-api-key': apiKey } })
                .then(res => res.json())
                .then(data => {
                    if (data?.data && Array.isArray(data.data)) {
                        // Data dari JSON API Lu (data.filters, bukan data.data lagi)
                        const filterList = data.filters || data.data;

                        setWetvFilters(filterList);
                        const initialActive: Record<string, string> = {};
                        filterList.forEach((f: any) => {
                            if (f.options && f.options.length > 0) initialActive[f.paramKey] = f.options[0].value;
                        });
                        setActiveWetvFilters(initialActive);
                    }
                }).catch(err => console.error("Gagal fetch filter WeTV:", err));
        }
    }, [pId, apiKey, lang]);

    const fetchFeed = async (menuId: string, currentLang: string, targetPage: number | string, isLoadMore: boolean = false) => {
        if (isLoadMore) setIsLoadingMore(true);
        else { setIsLoading(true); setFeed(null); }
        setErrorMsg(null);

        try {
            if (!adapter) throw new Error("Adapter tidak tersedia");
            const reqConfig = adapter.getFeedRequest(menuId, currentLang, targetPage);
            const baseEndpoint = allEndpoints.find(e => e.id === reqConfig.baseEndpointId || (reqConfig.baseEndpointId === 'channel' && e.path.includes('/channel')));
            if (!baseEndpoint) throw new Error(`Endpoint ${reqConfig.baseEndpointId} tidak ditemukan.`);

            const baseUrl = buildUrl(baseEndpoint, reqConfig.params, currentLang, targetPage);
            const baseRes = await fetch(baseUrl, { headers: { 'x-api-key': apiKey } });
            const baseRaw = await baseRes.json();

            let gridRaw = null;
            if (reqConfig.gridEndpointId && isLoadMore === false) {
                const gridEndpoint = allEndpoints.find(e => e.id === reqConfig.gridEndpointId);
                if (gridEndpoint) {
                    const gridUrl = buildUrl(gridEndpoint, reqConfig.params, currentLang, targetPage);
                    const gridRes = await fetch(gridUrl, { headers: { 'x-api-key': apiKey } });
                    gridRaw = await gridRes.json();
                }
            } else if (reqConfig.gridEndpointId && isLoadMore === true) {
                const gridEndpoint = allEndpoints.find(e => e.id === reqConfig.gridEndpointId);
                if (gridEndpoint) {
                    const gridUrl = buildUrl(gridEndpoint, reqConfig.params, currentLang, targetPage);
                    const gridRes = await fetch(gridUrl, { headers: { 'x-api-key': apiKey } });
                    gridRaw = await gridRes.json();
                    baseRaw.data = null;
                }
            }

            const finalFeed = adapter.normalizeFeed(baseRaw, gridRaw);

            if (!isLoadMore && finalFeed.menus && finalFeed.menus.length > 0) setNavMenus(finalFeed.menus);
            else if (!isLoadMore) finalFeed.menus = navMenus;

            if (isLoadMore) {
                setFeed(prev => {
                    if (!prev) return prev;
                    const newSections = [...prev.sections];
                    let nextHasMore = finalFeed.hasMore;

                    if (finalFeed.sections.length > 0) {
                        const lastPrevSection = newSections[newSections.length - 1];
                        const firstNewSection = finalFeed.sections[0];
                        if (finalFeed.sections.length === 1 && (newSections.length === 1 || lastPrevSection.title === firstNewSection.title)) {
                            const newGridItems = firstNewSection.items;
                            if (!newGridItems || newGridItems.length === 0) nextHasMore = false;
                            else newSections[newSections.length - 1] = { ...lastPrevSection, items: [...lastPrevSection.items, ...newGridItems] };
                        } else {
                            newSections.push(...finalFeed.sections);
                        }
                    } else {
                        nextHasMore = false;
                    }
                    return { ...prev, hasMore: nextHasMore, nextPageContext: finalFeed.nextPageContext, sections: newSections };
                });
            } else {
                setFeed(finalFeed);
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Gagal memuat pratinjau.");
        } finally {
            setIsLoading(false); setIsLoadingMore(false);
        }
    };

    const handleCardClick = async (id: string, slug: string) => {
        setIsDetailOpen(true); setIsDetailLoading(true); setDetailData(null); setPlayResult(null);
        try {
            const reqConfig = adapter.getDetailRequest(id, slug, lang);
            const detailEndpoint = allEndpoints.find(e => e.id === reqConfig.endpointId || e.path.includes('/detail'));
            if (!detailEndpoint) throw new Error("Endpoint detail tidak ditemukan.");
            const url = buildUrl(detailEndpoint, reqConfig.params, lang, 1);
            const res = await fetch(url, { headers: { 'x-api-key': apiKey } });
            setDetailData(adapter.normalizeDetail(await res.json()));
        } catch (error) { console.error("Gagal load detail:", error); } finally { setIsDetailLoading(false); }
    };

    const handlePlayVideo = async (epNum: number, seasonNum: number, vid?: string) => {
        if (!detailData || !adapter) return;
        setIsPlayLoading(true); setPlayResult(null);
        try {
            const reqConfig = adapter.getPlayRequest(detailData, epNum, seasonNum, lang, vid);
            const playEndpoint = allEndpoints.find(e => e.id === reqConfig.endpointId || (e.id.includes('play') && !e.id.includes('info')));
            if (!playEndpoint) throw new Error("Endpoint play tidak ditemukan.");
            setPlayEndpointId(playEndpoint.id);
            const url = buildUrl(playEndpoint, reqConfig.params, lang, 1);
            const res = await fetch(url, { headers: { 'x-api-key': apiKey } });
            setPlayResult(await res.json());
        } catch (error) { console.error("Gagal load video:", error); } finally { setIsPlayLoading(false); }
    };

    useEffect(() => {
        if (!apiKey) { setIsLoginModalOpen(true); return; }
        if (isMaintenance) return;
        setPage(1);
        fetchFeed(activeEndpoint, lang, 1, false);
    }, [providerId, apiKey, activeEndpoint, lang]);

    // Handle Idlix Filter
    const handleApplyIdlixFilter = () => {
        const baseMenu = activeEndpoint.split('?')[0];
        let qs = `sort=${selectedSort}`;
        if (selectedGenre) qs += `&genre=${selectedGenre}`;
        if (selectedCountry) qs += `&country=${selectedCountry}`;
        setActiveEndpoint(`${baseMenu}?${qs}`);
        setIsFilterModalOpen(false);
    };

    // Handle WeTV Filter
    const handleApplyWetvFilter = () => {
        const qs = Object.entries(activeWetvFilters).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
        setActiveEndpoint(`explore?${qs}`);
        setIsFilterModalOpen(false);
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputKey = new FormData(e.currentTarget).get('apiKey') as string;
        if (inputKey) { localStorage.setItem('indocast_api_key', inputKey); window.location.reload(); }
    };

    const baseActiveEndpoint = activeEndpoint.split('?')[0];
    const isIdlixCatalog = pId === 'idlix' && baseActiveEndpoint !== 'home';
    const isWeTVExplore = pId === 'wetv' && baseActiveEndpoint === 'explore';

    if (!providerConfig) return null;
    if (isMaintenance) {
        return (
            <div className={isStandalone ? "w-full h-full flex flex-col" : "animate-in fade-in slide-in-from-bottom-2 duration-500"}>
                <div className={`relative w-full flex flex-col items-center justify-center bg-[#0B0E14] text-white transition-all duration-300 ${isStandalone ? 'flex-1 h-full rounded-none border-none' : 'h-[800px] rounded-2xl border border-[#222634] shadow-2xl'}`}>
                    <Wrench size={64} className="text-slate-500 mb-6 animate-pulse" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">Dalam Perbaikan 🚧</h2>
                    <p className="text-slate-400 text-center max-w-md px-6 leading-relaxed">UI Preview untuk {providerConfig.name} belum tersedia.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={isStandalone ? "w-full h-full" : "animate-in fade-in slide-in-from-bottom-2 duration-500"}>
            {!isStandalone && (
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">UI Preview</h3>
                    <Link href={`/dashboard/provider/${providerId}/preview`} target="_blank" className="flex items-center gap-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 transition-colors px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300"><Maximize size={16} /> Layar Penuh</Link>
                </div>
            )}

            <div className={`relative w-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#0B0E14] text-white shadow-2xl transition-all duration-300 ${isStandalone ? 'h-screen rounded-none border-none' : 'h-[800px] rounded-2xl border border-[#222634]'}`}>

                <PreviewNavbar
                    provider={providerConfig} endpoints={allEndpoints} apiMenus={navMenus.length > 0 ? navMenus : (feed?.menus || [])}
                    activeEndpoint={baseActiveEndpoint} lang={lang} onLangChange={setLang} apiKey={apiKey} availableLangs={availableLangs}
                    onOpenLogin={() => setIsLoginModalOpen(true)}
                    onMenuClick={(id) => {
                        setSelectedSort('releaseDate'); setSelectedGenre(''); setSelectedCountry('');
                        setActiveEndpoint(id);
                    }}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-[var(--primary)]" /></div>
                ) : errorMsg ? (
                    <div className="p-8 text-center text-rose-500">{errorMsg}</div>
                ) : feed ? (
                    <div className="pb-12">
                        <PreviewHero banners={feed.banners} onCardClick={handleCardClick} />
                        <div className="space-y-6 md:space-y-10 pt-8">

                            {feed.sections.map((section, idx) => {
                                const isGrid = (!feed.banners?.length && feed.sections.length === 1) || section.isGrid;

                                // 🔥 TOMBOL FILTER UNTUK IDLIX & WETV 🔥
                                const FilterBtn = (isIdlixCatalog || (isWeTVExplore && wetvFilters.length > 0)) ? (
                                    <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-semibold transition-colors shadow-sm">
                                        <Filter size={14} /> Filter
                                    </button>
                                ) : null;

                                return <PreviewSection key={idx} section={section} layout={isGrid ? 'grid' : 'slider'} providerId={providerConfig.id} onCardClick={handleCardClick} actionButton={FilterBtn} />
                            })}
                        </div>

                        {/* 🔥 TOMBOL LOAD MORE FIX INFINITE SCROLL 🔥 */}
                        {feed.hasMore && (
                            <div className="flex justify-center pt-10 pb-8">
                                <button onClick={() => {
                                    const nextPageParam = feed.nextPageContext || (page + 1);
                                    setPage(page + 1);
                                    fetchFeed(activeEndpoint, lang, nextPageParam, true);
                                }} disabled={isLoadingMore} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-8 rounded-full transition-all disabled:opacity-50">
                                    {isLoadingMore && <Loader2 className="animate-spin" size={18} />} {isLoadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                                </button>
                            </div>
                        )}

                        {feed?.sections.length === 0 && feed?.banners.length === 0 && (
                            <div className="w-full flex flex-col items-center justify-center py-32 text-slate-500">
                                <p className="text-xl font-bold">Tidak ada konten ditemukan</p>
                            </div>
                        )}
                    </div>
                ) : null}

                {/* MODALS EXTRACTED TO COMPONENTS */}
                {pId === 'wetv' ? (
                    <WeTVFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} filters={wetvFilters} activeFilters={activeWetvFilters} onChange={(k, v) => setActiveWetvFilters(prev => ({ ...prev, [k]: v }))} onApply={handleApplyWetvFilter} />
                ) : (
                    <IdlixFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={handleApplyIdlixFilter} selectedSort={selectedSort} setSelectedSort={setSelectedSort} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
                )}

                <PreviewDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} detailData={detailData} isLoading={isDetailLoading} providerId={providerConfig.id} playResult={playResult} isPlayLoading={isPlayLoading} playEndpointId={playEndpointId} onPlayVideo={handlePlayVideo} onClosePlayer={() => setPlayResult(null)} />

            </div>
        </div>
    );
}