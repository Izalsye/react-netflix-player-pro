
# 🎬 React Netflix Player Pro

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Shaka Player](https://img.shields.io/badge/Shaka_Player-Video-blue?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

The most advanced, production-ready Netflix UI clone built on top of Shaka Player & HLS.js. Fully optimized for Next.js App Router and mobile-responsive.

> **Note:** This repository contains the **Frontend UI Player component**.

<br>

<div align="center">
  <img width="1084" alt="Player Preview 1" src="https://github.com/user-attachments/assets/9e4678fa-93bb-4148-838a-fe3a9ed83f5c" />
  <br><br>
  <img width="1084" alt="Player Preview 2" src="https://github.com/user-attachments/assets/b65ef6e2-5ef0-41b5-91b7-1131c0d278eb" />
</div>

## ✨ God-Tier Features

* 🛡️ **Multi-DRM Support**: (Widevine, PlayReady) for Vidio, HBO, Amazon Prime.
* 🎬 **Netflix-Grade UI/UX**: Precision SVG icons, 3D stacked episode sidebar, and smooth responsive overlay.
* ⚡ **Smart Engine Fallback**: Seamlessly switches between Shaka v5, HLS.js, and Native HTML5 depending on the provider.
* 🌍 **Multi-Language Subtitles & Audio**: With auto-conversion and sleek scrollable selection menus.
* ⏭️ **Binge-Watching Ready**: Features "Skip Intro" logic and Netflix-style "Auto-Next Episode" countdown.

---

## 🔒 Premium Full-Stack Version Available

What you see here is just the frontend masterpiece. **The complete VOD/Streaming ecosystem is available for purchase!**

If you want to build a fully functional streaming platform, the premium source code includes:

* **Full REST API Streaming Backend**: Multi-language catalog, auto-scraping, and dynamic video URL generation.
* **Advanced Media Parser System**: The secret sauce to bypass provider protections.
* **Complete Dashboard & Database**: Fully integrated with this player.

📩 **Interested in buying the full source code?**
Contact me to get the pricing and full demo:

* **Email**: [cyberdeveloper17@gmail.com]
* **Telegram**: [@Faisal_Nw16]

---

## 🚀 How to Use (Frontend Only)

Just drop the `CustomPlayer.tsx` and `useVideoEngine.ts` into your Next.js project.

```tsx
import CustomPlayer from '@/components/player/CustomPlayer';

export default function WatchPage() {
  return (
    <div className="w-full h-screen bg-black">
      <CustomPlayer "Action", "Awesome "Episode "HD", 1" 1, 2026, Series", episodeTitle: genre: meta="{{" qualityTag: season: src="[https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8](https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8)" title: year: }}/>
    </div>
  )
}
```
