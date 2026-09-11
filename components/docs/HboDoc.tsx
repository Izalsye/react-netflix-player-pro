'use client';

import { useState } from 'react';
import { Box } from 'lucide-react';

interface DocProps {
    lang: 'id' | 'en';
}

export default function HboDoc({ lang }: DocProps) {
    const [docLang, setDocLang] = useState<'html' | 'react' | 'django'>('html');

    // 🌐 Dictionary untuk Terjemahan
    const t = {
        title: lang === 'id' ? 'Cara Play Video (HBO Max DRM)' : 'How to Play Video (HBO Max DRM)',
        desc: lang === 'id'
            ? <>Response API dari HBO Max terenkripsi menggunakan <strong>Widevine DRM</strong>. Untuk memutar video, Anda harus menginisialisasi <a href="https://shaka-player-demo.appspot.com/docs/api/shaka.Player.html" target="_blank" className="text-[var(--primary)] hover:underline font-semibold">Shaka Player</a> dengan mengarahkan <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-rose-500 text-xs font-mono">streamUrl</code> ke player, dan <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-rose-500 text-xs font-mono">drm.licenseUrl</code> ke konfigurasi Widevine server.</>
            : <>The API response from HBO Max is encrypted using <strong>Widevine DRM</strong>. To play the video, you must initialize <a href="https://shaka-player-demo.appspot.com/docs/api/shaka.Player.html" target="_blank" className="text-[var(--primary)] hover:underline font-semibold">Shaka Player</a> by passing the <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-rose-500 text-xs font-mono">streamUrl</code> to the player, and <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-rose-500 text-xs font-mono">drm.licenseUrl</code> to the Widevine server configuration.</>,
    };

    return (
        <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#161b22] px-6 py-4">
                <Box size={20} className="text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.title}</h2>
            </div>

            <div className="p-6">
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                    {t.desc}
                </p>

                {/* Sub-Tabs Code Language */}
                <div className="flex border-b border-slate-200 dark:border-white/10 mb-4 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setDocLang('html')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${docLang === 'html' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>HTML / Vanilla JS</button>
                    <button onClick={() => setDocLang('react')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${docLang === 'react' ? 'border-[#61DAFB] text-[#61DAFB]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>React / Next.js</button>
                    <button onClick={() => setDocLang('django')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${docLang === 'django' ? 'border-[#092E20] text-[#092E20] dark:border-[#44B78B] dark:text-[#44B78B]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Django / PHP Blade</button>
                </div>

                {/* Snippet HTML/Vanilla JS */}
                {docLang === 'html' && (
                    <div className="bg-[#090C10] p-4 rounded-xl border border-white/5 font-mono text-[13px] overflow-x-auto shadow-inner">
                        <pre><code className="text-[#c9d1d9]">
                            {`<!-- 1. ${lang === 'id' ? 'Panggil Shaka Player via CDN' : 'Load Shaka Player via CDN'} -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.1/shaka-player.ui.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.1/controls.min.css">

<!-- 2. ${lang === 'id' ? 'Siapkan wadah Video' : 'Prepare Video container'} -->
<video id="my-video" width="100%" controls autoplay></video>

<script>
async function initApp() {
    shaka.polyfill.installAll();

    const video = document.getElementById('my-video');
    const player = new shaka.Player(video);

    // ${lang === 'id' ? 'Ambil dari response API HBO' : 'Fetch from HBO API response'}
    const videoUrl = "ISI_DENGAN_streamUrl_DARI_RESPONSE"; 
    const licenseUrl = "ISI_DENGAN_drm_licenseUrl_DARI_RESPONSE";

    // 3. ${lang === 'id' ? 'Konfigurasi DRM Widevine' : 'Widevine DRM Configuration'}
    player.configure({
        drm: {
            servers: { 
                'com.widevine.alpha': licenseUrl,
                'com.microsoft.playready': licenseUrl 
            }
        }
    });

    try {
        await player.load(videoUrl);
        console.log('Video loaded successfully!');
    } catch (e) {
        console.error('Error loading video:', e);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
</script>`}
                        </code></pre>
                    </div>
                )}

                {/* React Snippet */}
                {docLang === 'react' && (
                    <div className="bg-[#090C10] p-4 rounded-xl border border-white/5 font-mono text-[13px] overflow-x-auto shadow-inner">
                        <pre><code className="text-[#c9d1d9]">
                            {`import { useEffect, useRef } from 'react';
import shaka from 'shaka-player/dist/shaka-player.ui.js';
import 'shaka-player/dist/controls.css';

export default function HboPlayer({ responseData }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current || !responseData) return;
        
        shaka.polyfill.installAll();
        const player = new shaka.Player();
        player.attach(videoRef.current);

        const videoUrl = responseData.streamUrl;
        const licenseUrl = responseData.drm.licenseUrl;

        player.configure({
            drm: {
                servers: { 
                    'com.widevine.alpha': licenseUrl,
                    'com.microsoft.playready': licenseUrl
                }
            }
        });

        player.load(videoUrl).catch(e => console.error("Error loading video:", e));

        return () => player.destroy();
    }, [responseData]);

    return <video ref={videoRef} autoPlay controls className="w-full h-auto" />;
}`}
                        </code></pre>
                    </div>
                )}

                {/* Django/Blade Snippet */}
                {docLang === 'django' && (
                    <div className="bg-[#090C10] p-4 rounded-xl border border-white/5 font-mono text-[13px] overflow-x-auto shadow-inner">
                        <pre><code className="text-[#c9d1d9]">
                            {`<!-- 
  ${lang === 'id' ? 'Injeksi variabel dari Backend' : 'Variable injection from Backend'} 
-->
<video id="video-player" controls autoplay></video>

<script>
    // Django / Jinja2:
    const videoUrl = "{{ stream_url|escapejs }}";
    const licenseUrl = "{{ license_url|escapejs }}";

    // PHP Laravel Blade:
    // const videoUrl = "{{ $streamUrl }}";
    // const licenseUrl = "{{ $licenseUrl }}";

    const player = new shaka.Player(document.getElementById('video-player'));

    player.configure({
        drm: {
            servers: { 
                'com.widevine.alpha': licenseUrl,
                'com.microsoft.playready': licenseUrl
            }
        }
    });

    player.load(videoUrl).catch(e => console.error("Error loading video:", e));
</script>`}
                        </code></pre>
                    </div>
                )}
            </div>
        </div>
    );
}