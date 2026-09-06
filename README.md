# ZMDINATA | AI Engineer & Full-Stack Portfolio

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

Website portofolio profesional dan modern milik **Zacky Muhammad Dinata (ZMDinata)** — AI Engineer & Information Systems Student di STMIK IKMI Cirebon. Portofolio ini dibangun dari dasar dengan filosofi *performance-first*, estetika *clean-tech*, serta kemudahan pengelolaan data melalui Admin Panel terintegrasi.

Platform ini menggabungkan database cloud Supabase dengan sistem fail-safe lokal, animasi GPU hardware-accelerated 60+ FPS, dan viewer PDF interaktif instan (<60ms).

---

## ✨ Fitur-Fitur Utama

### 1. 🍱 Linear & Vercel-Grade Bento Grid (`HomePage.jsx`)
- **Spotlight Cards (`SpotlightCard.jsx`)**: Efek kursor interaktif dengan radial glow dinamis dan aksen border laser shimmer yang diproses melalui akselerasi GPU.
- **Ambient Grid Mesh (`AmbientGridMesh.jsx`)**: Latar belakang grid sirkuit modern dengan native CSS gradient murni tanpa beban blur berat.
- **Profile Interactive Deck (`ProfileInteractiveDeck.jsx`)**: Kartu profil interaktif dengan 3 tab spesialisasi:
  - 🤖 **LLM & Agents**: Homelab ThinkPad T440 daur ulang, OpenClaw, Hermes Agent, Gemini API, Docker.
  - ⚡ **Workflow & Cloud**: LestariRimba #JuaraVibeCoding di Google Cloud Run, FastAPI, n8n Automation.
  - 📊 **ML & Research**: Makalah riset SISFOTEK 9 (Multiple Linear Regression 116K+ records).
  - Dilengkapi *live pulse status* homelab dan tombol aksi cepat (*Hubungi*, *Salin Email* dengan feedback badge, dan *Trigger Agent-Z*).

### 2. 💻 Interactive AI Terminal (`InteractiveTerminal.jsx`)
- Terminal UNIX emulator interaktif yang merefleksikan data telemetri nyata dari server homelab lokal Zacky.
- Mendukung interaksi command prompt: `help`, `neofetch`, `skills`, `projects`, `telemetry`, `status`, dan `clear`.
- Output informatif mengenai hardware specs (ThinkPad T440, Ubuntu Server 22.04 LTS, Tailscale VPN, Docker container stacks).

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
  - Telemetri realtime koneksi Supabase (`vafesoxvobxnvuhpffeb.supabase.co`).
  - Matriks ringkasan status tabel: Projects, Certificates, Honors, Experience, Education, Skills, Profile.
  - **Hybrid Migration Hub**: Tombol **"Salin Skrip SQL Migrasi CV Terbaru (1-Click)"** ke clipboard untuk update instan di Supabase SQL Editor.
  - Tombol **"Direct In-App Sync"** untuk sinkronisasi otomatis satu klik dari frontend.
- **Split-Screen Interactive Quick-Editor (`/admin/quick-editor`)**:
  - Dual-pane layout: form editor di sisi kiri dan **Live Preview** interaktif di sisi kanan.
  - Live preview mendukung ganti bahasa (🇮🇩 ID / 🇬🇧 EN) dan format layar (💻 Desktop / 📱 Mobile).
  - Tombol pre-fill satu klik untuk mengisi data CV terbaru secara instan.
- **Categorized Modern Sidebar (`AdminLayout.jsx`)**: Navigasi intuitif yang dikelompokkan ke dalam *Aksi Cepat*, *Konten Utama*, dan *Kredensial*.

### 6. 🤖 Agent-Z AI Assistant (`Chatbot.jsx`)
- Chatbot AI floating interaktif yang ditenagai oleh model Groq (Llama 3) dengan failover otomatis ke OpenRouter.
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
| **AI Integration** | Groq API & OpenRouter API | Engine chatbot Agent-Z |
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
│   │   ├── latestCvData.js          # Terpusat: CV data, riset SISFOTEK, LestariRimba
│   │   ├── projects.js
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
4. Skrip ini akan secara otomatis membuat tabel yang dibutuhkan, memperbarui constraint schema, dan melakukan seeding data profil, proyek unggulan (Agent-Z, LestariRimba, Prediksi Tiket Pesawat), dan keahlian terkini.

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser pada `http://localhost:3000` (atau port yang ditunjuk oleh Vite).

### 5. Build Produksi
```bash
npm run build
```

---

## 🗺️ Rute Aplikasi

### 🌐 Halaman Publik
- `#/` : Bento Grid Landing Page (Hero, Profil Deck, AI Terminal, Featured Projects, Experience, Skills, Contact).
- `#/projects` : Galeri Proyek Lengkap dengan filter kategori dan modal pratinjau dokumen.
- `#/certificates` : Arsip Sertifikasi Resmi dengan viewer PDF/gambar instan.
- `#/honors` : Penghargaan Kompetisi dan Prestasi Akademik.

### 🔒 Halaman Admin (Protected)
- `#/admin/dashboard` : Unified Command Dashboard & Hub Migrasi Supabase.
- `#/admin/quick-editor` : Split-Screen Editor dengan Live Preview interaktif.
- `#/admin/profile` : Manajemen Profil dan Narasi Bio.
- `#/admin/projects` : CRUD Proyek & Pengaturan Featured (Maksimal 3 item).
- `#/admin/certificates` : CRUD Sertifikat & Pengelompokan Kategori.
- `#/admin/honors` : CRUD Penghargaan & Kompetisi.
- `#/admin/experience` & `#/admin/education` : CRUD Riwayat Karir & Studi.

---

## 📄 Lisensi

Proyek ini dirancang dan dikembangkan untuk penggunaan portofolio profesional pribadi.  
Hak Cipta © 2026 **Zacky Muhammad Dinata**. Seluruh hak cipta dilindungi undang-undang.

---

<div align="center">
  <b>Dibangun dengan dedikasi dan performa tinggi oleh Zacky Muhammad Dinata</b>
</div>
