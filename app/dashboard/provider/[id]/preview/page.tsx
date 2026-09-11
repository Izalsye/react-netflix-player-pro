'use client';

import { use, useEffect, useState } from 'react';
import PreviewTab from '@/components/docs/PreviewTab';
import { providers } from '@/data/endpoints';

export default function FullscreenPreviewPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const providerId = resolvedParams.id;
    const provider = providers[providerId as keyof typeof providers];
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        // Ambil API key dari local storage
        const key = localStorage.getItem('indocast_api_key') || '';
        setApiKey(key);

        // Kunci scroll bawaan browser biar nggak dobel
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!provider) {
        return (
            <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-[#0B0E14] text-white">
                Provider Not Found
            </div>
        );
    }

    return (
        // 🔥 FIX UTAMA: Pakai fixed, inset-0, dan z-[9999] biar nindih sidebar layout dashboard!
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#0B0E14] overflow-hidden">
            {/* Panggil komponen PreviewTab dengan isStandalone = true */}
            <PreviewTab providerId={providerId} apiKey={apiKey} isStandalone={true} />
        </div>
    );
}