# ZMDINATA | AI Engineer & Multi-Agent Systems Portfolio

<div align="center">

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Personal Portfolio & Command-Grade Content Management System**  
Designed with a sleek **Linear / Vercel Clean-Tech Bento Grid**, real-time AI terminal telemetry, zero-lag navigation engine, and seamless Supabase cloud integration.

[🌐 Live Demo](https://zmdinata.web.id) · [📦 GitHub Repository](https://github.com/zmdinata/MyPortfolio) · [💬 Chat with Agent-Z](https://zmdinata.web.id/#/chat)

</div>

---

## 🌟 Overview

Website portofolio profesional dan modern milik **Zacky Muhammad Dinata (ZMDinata)** — AI Engineer & Autonomous Agent Architect di STMIK IKMI Cirebon. Portofolio ini dibangun dari dasar dengan filosofi *performance-first*, estetika *clean-tech*, serta kemudahan pengelolaan data melalui Admin Panel terintegrasi.

Platform ini merefleksikan keahlian dalam **Autonomous Multi-Agent Orchestration**, **Quantitative Risk Management (Monte Carlo Merton Jump Diffusion VaR)**, riset Machine Learning, dan transisi karier dari Digital/NFT Artist ke AI/ML Engineering.

---

## ✨ Fitur-Fitur Utama

### 1. 🍱 Linear & Vercel-Grade Bento Grid (`HomePage.jsx`)
- **Spotlight Cards (`SpotlightCard.jsx`)**: Efek kursor interaktif dengan radial glow dinamis dan aksen border laser shimmer yang diproses melalui akselerasi GPU.
- **Ambient Grid Mesh (`AmbientGridMesh.jsx`)**: Latar belakang grid sirkuit modern dengan native CSS gradient murni tanpa beban blur berat.
- **Profile Interactive Deck (`ProfileInteractiveDeck.jsx`)**: Kartu profil interaktif dengan 3 tab spesialisasi:
  - 🤖 **LLM & Agents**: Homelab ThinkPad T440, OpenClaw, Hermes Agent, sub-agent delegation, Docker.
  - ⚡ **Workflow & Cloud**: LestariRimba #JuaraVibeCoding di Google Cloud Run, FastAPI, n8n Automation.
  - 📊 **ML & Quant**: AutoOverlay AI (Monte Carlo Merton Jump Diffusion VaR) & Makalah riset SISFOTEK 9 (MLR 116K+ records).
  - Dilengkapi *live pulse status* homelab dan tombol aksi cepat (*Hubungi*, *Salin Email* dengan feedback badge, dan *Trigger Agent-Z*).
- **Mobile Touch Ergonomics & Smart Justify**:
  - **Tiered Button Hierarchy**: Tombol utama 100% full-width di baris atas, tombol aksi pendukung 50:50 di baris bawah dengan touch target ergonomis (min 48px) dan tactile feedback.
  - **Swipeable Pill Bar**: Tab Profile Deck dapat digeser horizontal dengan touch-snap halus tanpa terpotong di layar ponsel sempit (<380px).
  - **Smart Justify Typography Engine**: Justifikasi cerdas dengan hyphenation otomatis (`hyphens: auto; text-justify: inter-word;`) pada narasi panjang untuk mencegah *rivers of white*, sambil menjaga teks pendek tetap rata kiri yang rapi.

### 2. 💻 Interactive AI Terminal (`InteractiveTerminal.jsx`)
- Terminal UNIX emulator interaktif yang merefleksikan data telemetri nyata dari server homelab lokal ThinkPad T440.
- Mendukung interaksi command prompt: `help`, `neofetch`, `skills`, `projects`, `telemetry`, `whoami`, `education`, `experience`, `cert`, `contact`, `agent-z`, dan `clear`.
- Menampilkan output sistem informatif (Linux Homelab T440, PM2, Docker container stacks, sub-agent orchestrators).

### 3. ⚡ Zero-Lag & High-Performance Engine
- **Eliminasi GPU Blur Stall**: Menghilangkan seluruh `filter: blur(...)` pada transisi halaman Framer Motion dan kartu list yang sebelumnya membekukan Chromium compositor. Digantikan dengan transisi `opacity` dan `translateY` hardware-accelerated 60+ FPS.
- **Route-Level Code-Splitting**: Memanfaatkan `React.lazy()` dan `<Suspense>` di `App.jsx`, memecah bundle monolitik menjadi sub-chunk ringan (~2.4–2.6 kB per rute publik).
- **In-Memory Cache (`portfolioCache.js`)**: Caching cerdas untuk data Projects, Certificates, dan Honors. Berpindah halaman antar tab terjadi dalam **0ms (instan)** tanpa loading spinner berulang.
- **Native CSS Hover**: Menggantikan wrapper berat `react-parallax-tilt` dengan transisi native Framer Motion `whileHover={{ y: -6, scale: 1.02 }}`.

### 4. 📄 Zero-Lag Single-Page PDF Viewer (`PdfPreview.jsx` & `PreviewModal.jsx`)
- **Single-Page Active Rendering**: Hanya merender 1 halaman/slide aktif pada HTML5 `<canvas>`, memangkas konsumsi memori GPU dari **360MB menjadi ~10MB** dan mempercepat buka dokumen dari **3.5 detik menjadi <60 milidetik** (35x lebih cepat).
- **Reader Controls**: Navigasi slide (`[◀ Prev]`, `Page X / Y`, `[Next ▶]`), slide dots navigator di footer, pintasan keyboard panah (←/→), kontrol zoom (`-`, `+`, `Fit Width`), dan tombol buka tab baru.
- **Backdrop Ringan**: Backdrop modal dioptimalkan menjadi `blur(4px)` tanpa freeze.

### 5. 🛠️ Command-Grade Admin Suite & Migration Hub
- **Unified Command Dashboard (`/admin/dashboard`)**:
  - Telemetri realtime koneksi Supabase.
  - Matriks ringkasan status tabel: Projects, Certificates, Honors, Experience, Education, Skills, Profile.
  - **Hybrid Migration Hub**: Tombol **"Salin Skrip SQL Migrasi CV Terbaru (1-Click)"** ke clipboard untuk update instan di Supabase SQL Editor.
  - Tombol **"Direct In-App Sync"** untuk sinkronisasi otomatis satu klik dari frontend.
- **Split-Screen Interactive Quick-Editor (`/admin/quick-editor`)**:
  - Dual-pane layout: form editor di sisi kiri dan **Live Preview** interaktif di sisi kanan.
  - Live preview mendukung ganti bahasa (🇮🇩 ID / 🇬🇧 EN) dan format layar (💻 Desktop / 📱 Mobile).
  - Tombol pre-fill satu klik untuk mengisi data CV terbaru secara instan.
- **Categorized Modern Sidebar (`AdminLayout.jsx`)**: Navigasi intuitif yang dikelompokkan ke dalam *Aksi Cepat*, *Konten Utama*, dan *Kredensial*.

### 6. 🤖 Agent-Z AI Assistant (`Chatbot.jsx`)
- Chatbot AI floating interaktif yang ditenagai oleh model Groq / Gemini dengan payload sliding window hemat token.
- Paham seluruh riwayat, pencapaian, dan detail proyek ZMDinata untuk menjawab pertanyaan pengunjung secara akurat.

### 7. 🛡️ Hybrid Cloud & Local Fallback Architecture
- **Fail-Safe Reliability**: Jika koneksi internet terputus atau Supabase mengalami downtime/rate-limit, website secara otomatis mengambil data fallback lokal dari `src/data/` tanpa error blank screen.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, Vite 6 | Framework reaktif modern dan build bundler ultra-cepat |
| **Routing** | React Router v7 (`HashRouter`) | Client-side routing dengan lazy loading per halaman |
| **Database & Auth** | Supabase (PostgreSQL) | Database relasional cloud, storage bucket, dan autentikasi |
| **Animations** | Framer Motion | Animasi deklaratif GPU-accelerated |
| **Icons & UI** | Lucide React, React Icons | Iconset minimalis dan modern |
| **Styling** | Modular Vanilla CSS | Desain glassmorphism kustom tanpa overhead Tailwind bundle |
| **Document Rendering** | PDF.js (`pdfjs-dist`) | High-performance HTML5 canvas rendering |
| **AI Integration** | Groq API, Gemini API & OpenRouter | Engine chatbot Agent-Z |
| **Deployment** | Vercel | Global Edge CDN hosting |

---

## 📦 Struktur Direktori Proyek

```plaintext
MyPortfolio/
├── api/                             # Serverless API routes (Chatbot proxy & fallback)
│   └── chat.js
├── public/                          # Static assets (gambar, sertifikat, dokumen PDF)
│   ├── assets/
│   ├── proyek/
│   └── sertif/
├── src/
│   ├── components/
│   │   ├── admin/                   # Layout & komponen admin panel
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Chatbot/                 # Floating AI Agent-Z
│   │   ├── layout/                  # Navbar, Footer, Layout wrapper
│   │   └── ui/                      # Reusable UI components
│   │       ├── AiTelemetryCard.jsx
│   │       ├── AmbientGridMesh.jsx
│   │       ├── CustomCursor.jsx
│   │       ├── InteractiveTerminal.jsx
│   │       ├── PdfPreview.jsx       # Zero-lag single-page PDF renderer
│   │       ├── PreviewModal.jsx     # Universal document & media modal
│   │       ├── ProfileInteractiveDeck.jsx # 3-tab specialization mini deck
│   │       └── SpotlightCard.jsx    # Hardware-accelerated spotlight bento card
│   ├── data/                        # Local fallback data & CV single-source-of-truth
│   │   ├── latestCvData.js          # Terpusat: CV data, AutoOverlay AI, AMD Hackathon
│   │   ├── projects.js
│   │   ├── certificates.js
│   │   ├── honors.js
│   │   ├── skills.js
│   │   └── translations.js          # Bilingual ID/EN dictionary
│   ├── lib/
│   │   ├── motionConfig.js          # Preset animasi Framer Motion (GPU optimized)
│   │   ├── portfolioCache.js        # In-memory instant navigation cache
│   │   ├── portfolioFallbacks.js    # Logika auto-merge data Supabase + lokal
│   │   └── supabaseClient.js        # Supabase client initializer
│   ├── pages/
│   │   ├── admin/                   # Admin pages
│   │   │   ├── DashboardPage.jsx    # Unified dashboard & migration hub
│   │   │   ├── QuickEditorPage.jsx  # Split-screen live preview editor
│   │   │   ├── ManageProfile.jsx
│   │   │   ├── ManageProjects.jsx
│   │   │   └── ...
│   │   ├── CertificatesPage.jsx
│   │   ├── HonorsPage.jsx
│   │   ├── HomePage.jsx             # Bento Grid landing page
│   │   └── ProjectsPage.jsx
│   └── styles/                      # Modular CSS stylesheets
│       ├── components/              # bento.css, spotlight.css, terminal.css, modal.css
│       ├── pages/                   # admin-dashboard.css, admin-quick-editor.css
│       └── variables.css            # Design tokens & color system
├── supabase-sync-cv.sql             # Skrip SQL migrasi komprehensif Supabase
├── progresswebsite.md               # Catatan riwayat dan progres pengembangan lengkap
└── README.md
```

---

## 🚀 Panduan Memulai (Setup)

### 1. Kloning Repositori
```bash
git clone https://github.com/zmdinata/MyPortfolio.git
cd MyPortfolio
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` pada root direktori:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Eksekusi Skrip Database (Supabase)
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih proyek Anda.
2. Masuk ke menu **SQL Editor**.
3. Buka file [`supabase-sync-cv.sql`](./supabase-sync-cv.sql) pada repositori ini, salin seluruh kueri, lalu jalankan (**Run**).
4. Skrip ini akan secara otomatis membuat tabel yang dibutuhkan, memperbarui constraint schema, dan melakukan seeding data profil, proyek unggulan (AutoOverlay AI, Agent-Z, A2Z Agentz), dan keahlian terkini.

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser pada `http://localhost:3000` (atau port yang ditunjuk oleh Vite).

---

## 📄 Lisensi

Proyek ini dirancang dan dikembangkan untuk penggunaan portofolio profesional pribadi.  
Hak Cipta © 2026 **Zacky Muhammad Dinata**. Seluruh hak cipta dilindungi undang-undang.

---

<div align="center">
  <b>Dibangun dengan dedikasi dan performa tinggi oleh Zacky Muhammad Dinata</b>
</div>
