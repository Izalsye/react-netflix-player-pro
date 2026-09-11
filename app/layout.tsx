import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast'; // 🎯 1. Import Toaster-nya
import { headers } from 'next/headers'; // 👈 IMPORT INI
import { recordHit } from '@/lib/stats'; // 👈 IMPORT INI (pastikan path sesuai)
// @ts-ignore: side-effect import for global CSS
import './globals.css'; // Global styles

// 👇 TAMBAHIN BARIS INI DI SINI 👇
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Indocast API Docs',
  description: 'API Documentation and Tester for Indocast REST API',
};

// 👈 UBAH JADI 'async function'
export default async function RootLayout({ children }: { children: React.ReactNode }) {

  // 👇 ----- MULAI LOGIC TRACKING VISITOR ----- 👇
  try {
    // 👇 TAMBAHKAN AWAIT DI SINI 👇
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown-ip';
    const userAgent = headersList.get('user-agent') || 'unknown-browser';

    const visitorFingerprint = `${ipAddress}|${userAgent}`;

    // Catat sebagai "PAGE_VIEW" ke endpoint "/" (atau bisa lu ganti tulisan 'Website Visit')
    // req kita kasih 'null as any' karena di fungsi recordHit sebenernya parameter req nggak dipake buat ekstrak apa-apa.
    await recordHit(null as any, visitorFingerprint, 'Website Visit', 'PAGE_VIEW');
  } catch (error) {
    // Dibungkus try-catch biar kalau file stats error, web lu nggak ikut down
    console.error("Gagal track visitor", error);
  }
  // 👆 ----------------------------------------- 👆

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        
        {/* TAMBAHKAN INI BRE */}
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="bg-[#0B0E14] text-slate-300 font-sans antialiased" suppressHydrationWarning>
        {children}

        <Toaster
          position="top-right"
          containerStyle={{
            top: 20,
            right: 20,
            zIndex: 9999999, // 🎯 Z-index level dewa biar nembus semua popup/modal
          }}
        />
      </body>
    </html>
  );
}