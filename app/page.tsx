import { providers } from '@/data/endpoints';
import LandingClient from '@/components/LandingClient';

export default function LandingPage() {
  const providerList = Object.values(providers);

  return (
    // Gunakan background putih/abu terang untuk Light Mode, dan hitam pekat untuk Dark Mode
    <main
      className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-200 selection:bg-[var(--primary)] selection:text-white"
      style={{ '--primary': process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#ea580c' } as React.CSSProperties}
    // Default gue set orange ala referensi kedua lu kalau .env kosong
    >
      {/* Sembunyikan H1 ini secara visual tapi biarkan kebaca oleh Google Bot untuk SEO */}
      <h1 className="sr-only">Indocast API - Layanan Streaming Video, Drakor, dan Anime Terlengkap</h1>

      {/* Semua UI interaktif kita lempar ke Client Component */}
      <LandingClient providers={providerList} />
    </main>
  );
}