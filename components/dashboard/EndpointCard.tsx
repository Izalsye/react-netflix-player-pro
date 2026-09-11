'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy, CheckCircle, ChevronDown, Play, Loader2, Info, Film, BookOpen, X, Braces } from 'lucide-react';
import { Endpoint } from '@/data/endpoints';

// 🚀 Import Custom Hooks MVVM
import { useApiTester } from '@/hooks/useApiTester';
import { useMediaParser } from '@/hooks/useMediaParser';

// 🚀 Import Komponen JSON Viewer Baru
import JsonResponse from '../JsonResponse';

// 🚀 Dynamic Import untuk Komponen Media
import ComicReader from './ComicReader';
// ✅ GANTI JADI INI:
const CustomPlayer = dynamic(() => import('@/components/player/CustomPlayer'), {
    ssr: false,
    loading: () => <div className="w-full h-64 flex items-center justify-center bg-black rounded-lg text-slate-500 font-mono text-xs">Loading Player...</div>
});

interface EndpointCardProps {
    endpoint: Endpoint;
    providerId: string;
    apiKey: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function EndpointCard({ endpoint, providerId, apiKey, isExpanded, onToggle }: EndpointCardProps) {
    const [copiedType, setCopiedType] = useState<string | null>(null);
    const [isCopyMenuOpen, setIsCopyMenuOpen] = useState(false);

    // State baru untuk Copy Response JSON
    const [isResponseCopied, setIsResponseCopied] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const method = endpoint.method?.toUpperCase() || 'GET';
    const methodColor = method === 'POST'
        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}${endpoint.path}`;

    // 🎯 VIEWMODEL: Konsumsi Hooks
    const { formData, setFormData, isTesting, testResult, responseTime, executeTest } = useApiTester(endpoint, fullUrl, method, apiKey);

    // 🎯 PARSER: Otomatis deteksi & parse media dari JSON result
    const parsedMedia = useMediaParser(testResult, endpoint.id);

    // 🔥 FUNGSI BARU: Merakit URL & cURL beserta parameter dinamis dari formData
    const getRequestDetails = () => {
        let finalUrl = fullUrl;
        const queryParams = new URLSearchParams();
        const bodyPayload: Record<string, any> = {};
        let hasBody = false;

        endpoint.params?.forEach((param) => {
            const value = formData[param.name];
            if (value !== undefined && value !== '') {
                if (param.in === 'query') {
                    queryParams.append(param.name, value);
                } else if (param.in === 'body') {
                    bodyPayload[param.name] = value;
                    hasBody = true;
                }
            }
        });

        const qs = queryParams.toString();
        if (qs) finalUrl += `?${qs}`;

        let curl = `curl -X ${method} "${finalUrl}" -H "x-api-key: ${apiKey}"`;
        if (hasBody && (method === 'POST' || method === 'PUT')) {
            curl += ` -H "Content-Type: application/json" -d '${JSON.stringify(bodyPayload)}'`;
        }

        return { finalUrl, curl };
    };

    const handleCopy = (type: 'url' | 'curl') => {
        const { finalUrl, curl } = getRequestDetails();
        const textToCopy = type === 'url' ? finalUrl : curl;

        navigator.clipboard.writeText(textToCopy);
        setCopiedType(type);
        setIsCopyMenuOpen(false);
        setTimeout(() => setCopiedType(null), 2000);
    };

    // Fungsi khusus buat nge-copy JSON Response
    const handleCopyResponse = () => {
        if (testResult) {
            navigator.clipboard.writeText(JSON.stringify(testResult, null, 2));
            setIsResponseCopied(true);
            setTimeout(() => setIsResponseCopied(false), 2000);
        }
    };

    return (
        <div className={`bg-white dark:bg-[#151822] border rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${isExpanded ? 'border-[var(--primary)]/50 ring-1 ring-[var(--primary)]/20' : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'}`}>

            {/* ✨ HEADER ROW ✨ */}
            <div onClick={onToggle} className="flex items-center justify-between p-3 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors select-none">
                <div className="flex items-center gap-4">
                    <div className={`w-14 text-center px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${methodColor}`}>{method}</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{endpoint.name || "Endpoint"}</h3>
                        <span className="hidden sm:block text-slate-300 dark:text-slate-600 px-1">•</span>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 line-clamp-1">{endpoint.path}</p>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            {/* ✨ EXPANDED AREA ✨ */}
            {isExpanded && (
                <div className="flex flex-col lg:flex-row border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0B0E14]/30">

                    {/* KOLOM KIRI: FORM & URL */}
                    <div className="w-full lg:w-[50%] p-4 lg:p-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5">

                        <div className="flex items-center justify-between bg-white dark:bg-[#111522] border border-slate-200 dark:border-white/10 rounded-lg p-1 pl-3 mb-5 shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden pr-2">
                                <span className={`text-[10px] font-bold ${method === 'POST' ? 'text-amber-500' : 'text-emerald-500'}`}>{method}</span>
                                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">{endpoint.path}</span>
                            </div>

                            <div className="relative shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); setIsCopyMenuOpen(!isCopyMenuOpen); }} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded text-slate-600 dark:text-slate-300 transition-colors">
                                    {copiedType ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    <span className="text-[10px] font-bold">Copy</span>
                                </button>
                                {isCopyMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsCopyMenuOpen(false); }} />
                                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#151822] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl z-20 py-1 text-xs">
                                            {/* 🔥 TOMBOL COPY SUDAH MENGGUNAKAN GETREQUESTDETAILS 🔥 */}
                                            <button onClick={() => handleCopy('url')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">URL Only</button>
                                            <button onClick={() => handleCopy('curl')} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300">cURL</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Parameters</h4>
                            <form id={`form-${endpoint.id}`} onSubmit={executeTest} className="space-y-3">
                                {!endpoint.params || endpoint.params.length === 0 ? (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Info size={14} className="text-slate-400" /> Endpoint ini tidak membutuhkan parameter.
                                    </div>
                                ) : (
                                    endpoint.params.map((param, pIdx) => (
                                        <div key={pIdx} className="grid grid-cols-[100px_1fr] items-center gap-3">
                                            <div className="flex flex-col">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate" title={param.name}>{param.name}</label>
                                                <span className="text-[9px] text-slate-400 font-mono">{param.required ? <span className="text-rose-500">req</span> : 'opt'} • {param.in}</span>
                                            </div>
                                            {param.options && param.options.length > 0 ? (
                                                <select value={formData[param.name] || ''} onChange={(e) => setFormData(prev => ({ ...prev, [param.name]: e.target.value }))} required={param.required} className="w-full bg-white dark:bg-[#111522] border border-slate-200 dark:border-white/10 rounded-md px-3 py-1.5 text-xs focus:border-[var(--primary)] text-slate-900 dark:text-white">
                                                    {!param.required && <option value="">- Kosong -</option>}
                                                    {param.options.map((opt, i) => <option key={i} value={opt}>{opt === "" ? "- Kosong -" : opt}</option>)}
                                                </select>
                                            ) : (
                                                <input type="text" value={formData[param.name] || ''} onChange={(e) => setFormData(prev => ({ ...prev, [param.name]: e.target.value }))} required={param.required} placeholder={param.default || ''} className="w-full bg-white dark:bg-[#111522] border border-slate-200 dark:border-white/10 rounded-md px-3 py-1.5 text-xs font-mono focus:border-[var(--primary)] text-slate-900 dark:text-white" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </form>
                        </div>

                        {/* 🎯 AREA ACTION BUTTON (Send Request Kiri, Play Video Kanan) 🎯 */}
                        <div className="mt-auto pt-4 flex items-center gap-3">
                            <button
                                type="submit"
                                form={`form-${endpoint.id}`}
                                disabled={isTesting}
                                className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:brightness-110 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all shadow-sm"
                            >
                                {isTesting ? <><Loader2 size={14} className="animate-spin" /> Sedang Proses...</> : <><Play size={14} fill="currentColor" /> Send Request</>}
                            </button>

                            <button
                                type="button"
                                disabled={!parsedMedia || isTesting}
                                onClick={() => {
                                    if (parsedMedia) setShowMediaModal(true);
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg text-xs transition-all shadow-sm ${parsedMedia && !isTesting
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white'
                                    : 'bg-slate-100 dark:bg-[#111522] border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                {parsedMedia?.type === 'comic' ? <BookOpen size={14} /> : <Film size={14} />}
                                {parsedMedia?.type === 'comic' ? 'Read Comic' : 'Play Video'}
                            </button>
                        </div>
                    </div>

                    {/* KOLOM KANAN: RESPONSE */}
                    <div className="w-full lg:w-[50%] bg-[#0d1117] flex flex-col min-h-[250px] lg:max-h-[500px]">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#161b22] shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Response</span>
                                {testResult && !isTesting && (
                                    <button onClick={handleCopyResponse} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[10px] font-bold transition-all" title="Copy Full JSON Response">
                                        {isResponseCopied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                        {isResponseCopied ? 'Copied!' : 'Copy All'}
                                    </button>
                                )}
                            </div>
                            {responseTime !== null && (
                                <span className={`text-[10px] font-mono ${testResult?.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {testResult?.error ? 'Error' : '200 OK'} • {responseTime}ms
                                </span>
                            )}
                        </div>

                        <div className="p-4 flex-1 overflow-auto custom-scrollbar">
                            {isTesting ? (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-500 gap-3">
                                    <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
                                    <span className="font-mono text-[10px] animate-pulse">Menunggu respon server...</span>
                                </div>
                            ) : testResult ? (
                                <JsonResponse data={testResult} />
                            ) : (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                                    <Braces size={24} />
                                    <span className="text-[10px]">Klik "Send Request" untuk melihat hasil JSON.</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}

            {/* ✨ RENDER MODAL MEDIA (Video / Comic) ✨ */}
            {showMediaModal && parsedMedia && (
                parsedMedia.type === 'comic' ? (
                    <ComicReader images={parsedMedia.images} onClose={() => setShowMediaModal(false)} />
                ) : (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                        <div className="w-full max-w-4xl bg-[#0B0E14] border border-[#222634] rounded-2xl p-4 animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                    <Film size={16} className="text-[var(--primary)]" /> Video Preview
                                </span>
                                <button onClick={() => setShowMediaModal(false)} className="text-slate-400 hover:text-white bg-[#111522] px-3 py-1 rounded-lg text-xs border border-[#222634]">Close</button>
                            </div>
                            <CustomPlayer
                                src={parsedMedia.url}
                                subtitles={parsedMedia.subtitles}
                                licenseServers={parsedMedia.licenseServers}
                                customData={parsedMedia.customData}
                                provider={endpoint.id}
                                qualities={parsedMedia.qualities} // 🔥 INI YANG BIKIN MENUNYA NONGOL!
                                audioConf={parsedMedia.audioConf}
                                onBack={() => setShowMediaModal(false)} // Tutup modal saat tombol panah kiri diklik
                                meta={{
                                    title: "API Preview",
                                    season: 1,
                                    year: new Date().getFullYear(),
                                    genre: "Testing",
                                    qualityTag: "HD",
                                    episodeTitle: endpoint.name || "Test Video",
                                    description: `Preview respons streaming dari endpoint: ${endpoint.path}`
                                }}
                            />
                        </div>
                    </div>
                )
            )}
        </div>
    );
}