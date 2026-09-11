'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, Copy, CheckCircle, AlertCircle, Code2, Image as ImageIcon } from 'lucide-react';
import { useMediaParser } from '@/hooks/useMediaParser';

// const VideoPlayer = dynamic(() => import('@/components/dashboard/VideoPlayer'), {
//     ssr: false,
//     loading: () => <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-slate-500 font-mono text-xs">Loading Player...</div>
// });
// ✅ GANTI JADI INI:
const CustomPlayer = dynamic(() => import('@/components/player/CustomPlayer'), {
    ssr: false,
    loading: () => <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-slate-500 font-mono text-xs">Loading Player...</div>
});
interface LivePlayerProps {
    providerId: string;
    lang: 'id' | 'en';
}

export default function LivePlayerTab({ providerId, lang }: LivePlayerProps) {
    const [jsonInput, setJsonInput] = useState('');
    const [testResult, setTestResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [docLang, setDocLang] = useState<'html' | 'react' | 'django'>('html');
    const [isCopied, setIsCopied] = useState(false);

    const parsedMedia = useMediaParser(testResult, `${providerId}-play`);

    const handlePlay = () => {
        try {
            setError(null);
            const data = JSON.parse(jsonInput);
            if (!data || typeof data !== 'object') throw new Error("Invalid JSON Object");
            setTestResult(data);
        } catch (err: any) {
            setError(err.message || "Format JSON tidak valid");
            setTestResult(null);
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // 🔄 SMART CODE GENERATOR
    const generateCode = () => {
        if (!parsedMedia) return '';

        // 📚 FORMAT KOMIK
        if (parsedMedia.type === 'comic') {
            const imagesJson = JSON.stringify(parsedMedia.images.map((img: any) => img.url_proxy || img.url).slice(0, 3), null, 2) + '\n  // ... (dan seterusnya)';

            if (docLang === 'html' || docLang === 'django') {
                return `<!-- Template HTML untuk Render Komik -->
<div id="comic-container" style="display: flex; flex-direction: column; gap: 0; align-items: center;">
    <!-- Looping data gambar dari response JSON Anda -->
    <img src="URL_GAMBAR_1" alt="Page 1" style="width: 100%; max-width: 800px;" loading="lazy" />
    <img src="URL_GAMBAR_2" alt="Page 2" style="width: 100%; max-width: 800px;" loading="lazy" />
</div>

<script>
// 💡 INFO: URL Gambar didapat dari response API: 
// response.images[i].url_proxy (atau .url)
/* CONTOH DATA:
${imagesJson}
*/
</script>`;
            }
            if (docLang === 'react') {
                return `export default function ComicReader({ responseData }) {
    // 💡 INFO: Ambil array gambar dari JSON
    // let images = responseData.images || responseData.data.images;
    
    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
            {images.map((img, idx) => (
                <img 
                    key={idx} 
                    src={img.url_proxy || img.url} 
                    alt={\`Page \${idx + 1}\`} 
                    className="w-full object-contain"
                    loading="lazy"
                />
            ))}
        </div>
    );
}`;
            }
        }

        // 🎬 FORMAT VIDEO DENGAN DRM & RAW HLS
        if (parsedMedia.type === 'video') {
            let drmVariables = ``;
            let shakaConfig = ``;

            const isBlobUrl = parsedMedia.url.startsWith('blob:');
            let videoUrlConfigHtml = ``;
            let videoUrlConfigReact = ``;

            // 🔥 LOGIC KHUSUS JIKA RAW HLS (BLOB URL)
            if (isBlobUrl) {
                videoUrlConfigHtml = `    // 🌐 Didapat dari: response.data.m3u8 (Bentuk string raw HLS)
    // Ubah string m3u8 menjadi Blob URL agar bisa dibaca player
    const m3u8Data = response.data.m3u8; // <--- Ganti dengan data asli dari API
    const blob = new Blob([m3u8Data], { type: 'application/vnd.apple.mpegurl' });
    const videoUrl = URL.createObjectURL(blob);`;

                videoUrlConfigReact = `        // 🌐 Didapat dari: responseData.data.m3u8 (Bentuk string raw HLS)
        // Ubah string m3u8 menjadi Blob URL agar bisa dibaca player
        const m3u8Data = responseData.data.m3u8;
        const blob = new Blob([m3u8Data], { type: 'application/vnd.apple.mpegurl' });
        const videoUrl = URL.createObjectURL(blob);`;
            } else {
                videoUrlConfigHtml = `    // 🌐 Didapat dari: response.dashUrl_Proxy ATAU response.data.vid_url / hls
    const videoUrl = "${parsedMedia.url}";`;

                videoUrlConfigReact = `        // 🌐 Didapat dari: responseData.dashUrl_Proxy ATAU responseData.data.vid_url / hls
        const videoUrl = "${parsedMedia.url}";`;
            }

            // 🔥 FIX: Tambahkan fallback untuk cari License URL di JSON HBO atau provider lain
            const licenseUrl = parsedMedia.licenseServers?.drm_license_url || testResult?.data?.drm?.licenseUrl || '';

            const customToken = parsedMedia.customData?.token || '';
            const pallyconToken = parsedMedia.customData?.widevine || parsedMedia.customData?.playready || '';

            if (providerId.includes('prime')) {
                drmVariables = `\n    // 🔑 Didapat dari: response.licenseServers.drm_license_url\n    const licenseUrl = "${licenseUrl}";`;
                shakaConfig = `\n    // 2. KONFIGURASI DRM PRIME VIDEO (L3 / SW_SECURE)\n    player.configure({\n        drm: {\n            servers: { 'com.widevine.alpha': licenseUrl },\n            advanced: { 'com.widevine.alpha': { audioRobustness: ['SW_SECURE_CRYPTO'], videoRobustness: ['SW_SECURE_CRYPTO'] } }\n        },\n        manifest: { ignoreDrmInfo: true }\n    });`;
            } else if (providerId.includes('vidio')) {
                drmVariables = `\n    // 🔑 Didapat dari: response.licenseServers.drm_license_url\n    const licenseUrl = "${licenseUrl}";\n    // 🔑 Didapat dari: response.customData.widevine\n    const pallyconToken = "${pallyconToken}";`;
                shakaConfig = `\n    // 2. KONFIGURASI DRM VIDIO (PALLYCON)\n    player.configure({ drm: { servers: { 'com.widevine.alpha': licenseUrl } } });\n    player.getNetworkingEngine().registerRequestFilter((type, request) => {\n        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {\n            // Injeksi token Pallycon ke Header request lisensi\n            request.headers['pallycon-customdata-v2'] = pallyconToken;\n        }\n    });`;
            } else if (providerId.includes('viu')) {
                drmVariables = `\n    // 🔑 Didapat dari: response.licenseServers.drm_license_url\n    const licenseUrl = "${licenseUrl}";\n    // 🔑 Didapat dari: response.customData.token\n    const authToken = "${customToken}";`;
                shakaConfig = `\n    // 2. KONFIGURASI DRM VIU (AUTH HEADER)\n    player.configure({ drm: { servers: { 'com.widevine.alpha': licenseUrl } } });\n    player.getNetworkingEngine().registerRequestFilter((type, request) => {\n        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {\n            // Injeksi Auth Token ke Header request lisensi\n            request.headers['authorization'] = authToken;\n        }\n    });`;
            } else if (providerId.includes('hbo')) {
                drmVariables = `\n    // 🔑 Didapat dari: response.data.drm.licenseUrl\n    const licenseUrl = "${licenseUrl}";`;
                shakaConfig = `\n    // 2. KONFIGURASI DRM HBO MAX (WIDEVINE)\n    player.configure({\n        drm: {\n            servers: { 'com.widevine.alpha': licenseUrl }\n        }\n    });`;
            } else {
                drmVariables = `\n    // 💡 Video ini tidak menggunakan proteksi DRM`;
                shakaConfig = `\n    // 2. KONFIGURASI PLAYER (Non-DRM / Clear Video)\n    // Tidak perlu set license server khusus`;
            }

            if (docLang === 'html' || docLang === 'django') {
                return `<!-- Setup Shaka Player CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.1/shaka-player.ui.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.1/controls.min.css">

<!-- Container Video -->
<video id="my-video" width="100%" controls autoplay></video>

<script>
async function initApp() {
    shaka.polyfill.installAll();
    const player = new shaka.Player(document.getElementById('my-video'));

    // 1. INISIALISASI DATA DARI JSON RESPONSE
${videoUrlConfigHtml}
${drmVariables}
${shakaConfig}

    // 3. LOAD VIDEO
    try { 
        await player.load(videoUrl); 
        console.log("Video berhasil dimuat!");
    } catch (e) { 
        console.error('Error load video:', e); 
    }
}
document.addEventListener('DOMContentLoaded', initApp);
</script>`;
            }

            if (docLang === 'react') {
                return `import { useEffect, useRef } from 'react';
import shaka from 'shaka-player/dist/shaka-player.ui.js';
import 'shaka-player/dist/controls.css';

export default function VideoPlayer({ responseData }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current || !responseData) return;
        
        shaka.polyfill.installAll();
        const player = new shaka.Player();
        player.attach(videoRef.current);

        // 1. INISIALISASI DATA DARI JSON RESPONSE
${videoUrlConfigReact}
${drmVariables}
${shakaConfig}

        // 3. LOAD VIDEO
        player.load(videoUrl).catch(e => console.error(e));

        return () => player.destroy();
    }, [responseData]);

    return <video ref={videoRef} autoPlay controls className="w-full rounded-lg" />;
}`;
            }
        }
        return '';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161b22] px-6 py-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Code2 size={16} className="text-[var(--primary)]" />
                        {lang === 'id' ? 'Paste JSON Response di Sini' : 'Paste JSON Response Here'}
                    </h2>
                    <button onClick={handlePlay} className="flex items-center gap-2 bg-[var(--primary)] hover:brightness-110 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                        <Play size={14} fill="currentColor" /> Load Player
                    </button>
                </div>
                <div className="p-4">
                    <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder='{\n  "success": true,\n  ... \n}' className="w-full h-40 bg-slate-50 dark:bg-[#090C10] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-xs font-mono text-slate-700 dark:text-slate-300 focus:border-[var(--primary)] focus:ring-1 outline-none resize-y custom-scrollbar" />
                    {error && <div className="mt-3 flex items-center gap-2 text-rose-500 bg-rose-500/10 px-3 py-2 rounded-lg text-xs font-medium border border-rose-500/20"><AlertCircle size={14} /> {error}</div>}
                    {testResult && !parsedMedia && !error && <div className="mt-3 flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg text-xs font-medium border border-amber-500/20"><AlertCircle size={14} /> Format URL Video/Komik tidak ditemukan oleh parser.</div>}
                </div>
            </div>

            {parsedMedia && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm sticky top-6">
                        <div className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161b22] px-4 py-3">
                            <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {parsedMedia.type === 'comic' ? <ImageIcon size={14} className="text-purple-500" /> : <Play size={14} className="text-emerald-500" />} Live Preview
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className={`rounded-lg overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner bg-black ${parsedMedia.type === 'comic' ? 'h-[400px] overflow-y-auto custom-scrollbar' : ''}`}>
                                {parsedMedia.type === 'comic' ? (
                                    <div className="flex flex-col items-center">
                                        {parsedMedia.images.map((img: any, idx: number) => (
                                            <img key={idx} src={img.url_proxy || img.url || img.imageUrl} alt={`Page ${idx}`} className="w-full object-cover" loading="lazy" />
                                        ))}
                                    </div>
                                ) : (
                                    // ✅ GANTI JADI INI:
                                    <CustomPlayer
                                        src={parsedMedia.url}
                                        subtitles={parsedMedia.subtitles}
                                        licenseServers={parsedMedia.licenseServers}
                                        customData={parsedMedia.customData}
                                        provider={providerId}
                                        audioConf={parsedMedia.audioConf}
                                        // 👇 Tambahan bumbu UI Netflix biar gak kosong
                                        meta={{
                                            title: "Live Preview API",
                                            season: 1,
                                            year: 2024,
                                            genre: providerId.toUpperCase(),
                                            qualityTag: "HD",
                                            episodeTitle: "Preview Episode",
                                            description: "Ini adalah live preview dari JSON yang lu paste. Cek apakah video dan subtitle berjalan dengan lancar."
                                        }}
                                        episodes={[{ title: "Preview Episode" }, { title: "Next Episode (Dummy)" }]}
                                        onBack={() => console.log("Back diclick")}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161b22] px-2 py-2 pr-4">
                            <div className="flex overflow-x-auto custom-scrollbar">
                                <button onClick={() => setDocLang('html')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${docLang === 'html' ? 'bg-white dark:bg-[#0d1117] text-[var(--primary)] shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>HTML/JS</button>
                                <button onClick={() => setDocLang('react')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${docLang === 'react' ? 'bg-white dark:bg-[#0d1117] text-[#61DAFB] shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>React</button>
                                <button onClick={() => setDocLang('django')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${docLang === 'django' ? 'bg-white dark:bg-[#0d1117] text-[#44B78B] shadow-sm border border-slate-200 dark:border-white/5' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Django/Blade</button>
                            </div>
                            <button onClick={() => handleCopy(generateCode())} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] rounded-lg text-[10px] font-bold shrink-0">
                                {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />} {isCopied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>
                        <div className="p-4 bg-[#090C10]">
                            <pre className="text-[11px] font-mono text-[#c9d1d9] overflow-x-auto custom-scrollbar"><code>{generateCode()}</code></pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}