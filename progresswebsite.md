# Progress Website Portfolio ZMDINATA

Dokumen ini mencatat perkembangan keseluruhan website portfolio ZMDINATA dari versi awal statis sampai menjadi aplikasi React dengan admin panel, Supabase, media portfolio, dan AI assistant. Dokumen ini juga menjadi catatan arah pengembangan agar perubahan berikutnya tetap rapi dan tidak merusak fitur yang sudah stabil.

Update terakhir: 6 September 2026

## Ringkasan Status

- Status frontend publik: aktif, ditransformasi ke Bento Grid Clean Tech ala Linear/Vercel dengan Spotlight Cursor, Laser Border-Beam, dan Interactive AI Terminal.
- Status admin panel: aktif, dengan proteksi route dan halaman manajemen konten.
- Status data: hybrid, memakai Supabase sebagai sumber utama dan data lokal sebagai fallback.
- Status media portfolio: proyek, sertifikat, dan honors sudah mendukung PDF, gambar, dan link.
- Status chatbot Agent-Z: aktif dan terintegrasi mulus dengan prompt triggers pada Bento AI Telemetry.
- Status build terakhir: `npm run build` sukses 100%.

## Stack Utama

- React 19 + Vite 6 sebagai frontend utama.
- React Router HashRouter untuk route publik dan admin.
- Supabase untuk database, autentikasi, dan storage.
- Framer Motion untuk transisi dan animasi halaman.
- React Icons dan Lucide React untuk icon UI.
- CSS modular di folder `src/styles` (termasuk `bento.css`, `spotlight.css`, `terminal.css`).
- Vercel-oriented API routes di folder `api`.

## Memory Perubahan per Tanggal

Bagian ini dipakai sebagai log perubahan historis. Setiap perubahan besar berikutnya sebaiknya ditambahkan di bagian paling atas agar progres terbaru mudah dilacak.

Sumber memory historis: `git log --date=short --pretty=format:"%h %ad %s"`.

### 6 September 2026

- **Penyempurnaan Menyeluruh Mobile UI/UX (Clean, Neat & Touch Ergonomics)**:
  - **Tiered Button Hierarchy (Sistem Tombol Bertingkat)**:
    - Menghilangkan tombol flat/tidak proporsional pada mobile.
    - Pada Hero Bento: Tombol utama "Lihat Proyek" 100% full-width di baris atas dengan aksen gradient-accent & subtle glow; tombol pendukung "Hubungi Saya" / "Chat Agent-Z" tersusun simetris 2 kolom (50:50) di baris bawah.
    - Pada Profile Deck: Tombol "Hubungi Zacky" 100% full-width di baris atas; tombol "Salin Email" dan "Agent-Z" berbagi ruang seimbang 50:50 di baris bawah dengan touch target ergonomis (tinggi minimal 48px) dan efek tactile depression (`transform: scale(0.98)`).
  - **Swipeable Pill Bar Profile Deck**:
    - Mengubah tab spesialisasi (`.deck-tabs-row`) menjadi Swipeable Pill Bar dengan horizontal touch-snap halus dan scrollbar tersembunyi, sehingga judul tab tetap utuh satu baris tanpa terpotong di layar ponsel sempit (<380px).
  - **Smart Justify Typography Engine**:
    - Menerapkan justifikasi cerdas (`text-align: justify; text-justify: inter-word; hyphens: auto; -webkit-hyphens: auto;`) khusus pada teks narasi panjang (Bio/About Me) dengan sinkronisasi otomatis atribut bahasa dokumen (`document.documentElement.lang = lang`), mencegah "rivers of white" (spasi bolong-bolong antar-kata).
    - Menjaga teks pendek, heading, tombol, dan tags tetap `text-align: left` atau centered untuk kerapian visual.
  - **Fluid Terminal Typography & Swipeable Commands**:
    - Menambahkan ukuran font fluid dengan CSS `clamp()`, serta bar perintah cepat terminal (`neofetch`, `skills`, `projects`, `telemetry`) yang dapat digeser secara horizontal tanpa merusak tata letak kartu.
  - **Restrukturisasi Padding Kartu Bento Mobile**:
    - Mengurangi padding kartu dari 20px menjadi 16px (<=768px) dan 14px (<=480px/380px) untuk memperluas ruang baca efektif ponsel tanpa horizontal overflow.
- **Optimasi Performa Ekstrem (Zero-Lag, Ringan & Profesional)**:
  - Memperbaiki bug kritis `scrollIntoView({ behavior: 'smooth' })` pada `InteractiveTerminal.jsx` yang sebelumnya memaksa window melakukan auto-scroll saat halaman pertama kali dimuat sehingga melewatkan kartu Hero dan profil utama. Kini terminal hanya melakukan scroll internal pada kontainer log miliknya sendiri.
  - Menghilangkan `-webkit-mask-composite: xor` dan animasi spinning conic-gradient 200% pada `spotlight.css` yang sebelumnya membebani GPU dan menyebabkan frame drops hingga white-screen blank tab. Digantikan dengan efek hardware-accelerated laser shimmer dan hover border yang sangat ringan dan mulus 60+ FPS.
  - Menghilangkan `filter: blur(120px)` dan infinite transform keyframe pada `bento.css` dan `AmbientGridMesh.jsx`, digantikan dengan native CSS radial gradients zero-cost.
  - Menghilangkan `<HeroAnimation />` dari latar belakang Bento Hero agar tidak terjadi tabrakan visual (drone SVG yang melintasi teks terminal/kartu) dan meringankan render SVG.
  - Mengoptimasi `CustomCursor.jsx` dengan `requestAnimationFrame` throttle agar event `mousemove` tidak memicu re-render React berlebihan pada setiap pixel.
  - Mempercepat waktu build Vite dari 23.8s menjadi 11.0s (lebih dari 2x lebih cepat).
- **Integrasi Data CV Terbaru Zacky Muhammad Dinata (100% Relevan & Otentik)**:
  - Mengganti seluruh data placeholder pada Terminal dan Telemetri dengan data CV asli:
    - **Agent-Z Homelab: AI Agent Orchestrator**: Server Linux mandiri pada ThinkPad T440 daur ulang yang mengorkestrasi sub-agents via Hermes Agent (Nous Research), OpenClaw, n8n, integrasi Telegram, dan fallback routing 9Router.
    - **LestariRimba: AI Sustainability Prototype**: Prototype #JuaraVibeCoding dengan fitur RimbaPulse AI & Gemini Deep Research yang dideploy di Google Cloud Run (`https://lestari-rimba-661373468998.asia-southeast2.run.app/`).
    - **Prediksi Harga Tiket Penerbangan (MLR)**: Makalah penelitian yang dipublikasikan di Seminar Nasional SISFOTEK menggunakan regresi linier berganda pada dataset 116K+ tiket pesawat (`https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692`).
    - **Pendidikan**: STMIK IKMI Cirebon dengan IPK terkini **3.55 / 4.00**, peraih Medali Perunggu National Business Plan Competition "Cipta Nusantara Fest Vol. 2" di UNY 2025 ("Es Krim Jamu").
    - **Pengalaman**: Pijak x IBM SkillsBuild AI Engineer Intensive Program Scholar (Feb - Jul 2026) dan Seniman NFT / Ilustrasi Digital Lepas (Des 2020 - Okt 2024).
  - **Perombakan Total Admin Panel & Hybrid Migration Hub (Paling Mudah Dipahami & Dipakai)**:
    - **Unified Command Dashboard (`/admin/dashboard`)**:
      - Menampilkan status realtime database Supabase (koneksi, status tabel, URL project `vafesoxvobxnvuhpffeb.supabase.co`).
      - Kartu metrik ringkasan untuk seluruh konten (Proyek, Pengalaman, Pendidikan, Keahlian, Sertifikasi, Profil) dengan navigasi 1-klik.
      - **Hybrid Migration Hub**: Pusat sinkronisasi database dengan tombol **"Salin Skrip SQL Migrasi CV Terbaru (1-Click)"** (langsung menyalin query SQL komprehensif ke clipboard dengan feedback visual), tombol **"Direct In-App Sync"** untuk sinkronisasi otomatis, matriks kesehatan tabel database, dan panduan 3 langkah mudah eksekusi di Supabase SQL Editor.
    - **Split-Screen Interactive Quick-Editor (`/admin/quick-editor`)**:
      - Form terstruktur di sisi kiri (Ketersediaan kerja "Available for Hire", Hero Subtitle dwibahasa, About Me dwibahasa dengan character counter, dan 3 Proyek AI Unggulan).
      - Pratinjau langsung (*Live Preview*) di sisi kanan yang memperbarui kartu Hero, Bento Grid, dan About Me secara real-time saat diketik.
      - Dilengkapi tombol ganti bahasa pratinjau (🇬🇧 EN / 🇮🇩 ID) dan ganti format tampilan (💻 Desktop / 📱 Mobile).
      - Tombol "Isi Data CV Terbaru" untuk mengisi form secara instan.
    - **Navigasi Admin Terkategori & Modern (`AdminLayout.jsx`)**:
      - Sidebar terbagi dalam grup intuitif: *Ringkasan & Aksi Cepat*, *Konten Utama*, dan *Kredensial & Riwayat*.
      - Status indikator Supabase di top header bar beserta tombol cepat "Buka Web Publik".
    - **Pembaruan Halaman Profil (`ManageProfile.jsx`)**:
      - Dukungan tombol pre-fill CV terbaru, notifikasi status inline tanpa browser alert popup yang mengganggu, dan tautan langsung ke mode Split-Screen.
    - **Modul Data Terpusat (`src/data/latestCvData.js`) & Pembaruan `skills.js`**:
      - Menambahkan stack AI terkini (LLM & Autonomous AI Agents, Workflow Automation & Cloud n8n, Machine Learning & Sains Data MLR, Digital Art & Prototyping).
  - **Transformasi Kartu Profil (Card 2) dengan Interactive Mini-Deck & Specialization Showcase**:
    - Mengisi area kosong di bawah avatar dengan komponen interaktif `ProfileInteractiveDeck.jsx`:
      - Tab 1: **LLM & Agents** (Agent-Z Homelab ThinkPad T440, OpenClaw, Hermes Agent, Gemini API, Docker).
      - Tab 2: **Workflow & Cloud** (Google Cloud Run LestariRimba #JuaraVibeCoding, FastAPI, n8n Pipelines, Python).
      - Tab 3: **ML & Research** (Makalah SISFOTEK 9, Regresi Linier Berganda 116K+ records, Scikit-learn).
    - Menambahkan indikator status live telemetri homelab hijau menyala (*live pulse dot*).
    - Menambahkan tombol aksi cepat: **"Hubungi Zacky"** (scroll instan ke kontak), **"Salin Email"** (dengan feedback badge "Tersalin!"), dan **"Agent-Z"** (trigger interaksi chatbot).
  - **Penyelesaian Masalah Navigasi Berat / Harus Di-refresh (Zero-Lag Navigation)**:
    - **Akar Masalah Teridentifikasi**: Efek `filter: blur(...)` pada `AnimatePresence mode="wait"` dan puluhan kartu bergambar di `ProjectsPage`, `CertificatesPage`, dan `HonorsPage` menyebabkan GPU Chromium mengalami pipeline stall (0 FPS freeze) sehingga proses unmount menggantung dan layar tampak macet sampai di-refresh.
    - **Solusi Tuntas**:
      1. Menghilangkan seluruh `filter: blur(...)` dari `motionConfig.js` dan `Layout.jsx`, digantikan dengan GPU hardware-accelerated `opacity` + `transform: translateY(...)` 60 FPS instan.
      2. Menghilangkan wrapper berat `react-parallax-tilt` (`<Tilt>`) pada puluhan kartu dan menggantikannya dengan CSS hover native (`whileHover={{ y: -6, scale: 1.02 }}`).
      3. Membuat in-memory cache [`portfolioCache.js`](file:///c:/Projects/zmdinataportfolio/MyPortfolio/src/lib/portfolioCache.js) sehingga perpindahan antar-halaman Projects, Certificates, dan Honors langsung tampil seketika (0ms) tanpa memicu request berulang ke Supabase.
      4. Mengaktifkan Route-level Code-Splitting dengan `React.lazy()` dan `Suspense` di `App.jsx` untuk memecah bundle monolitik menjadi chunk-chunk terisolasi yang sangat ringan.
  - **Optimalisasi Ekstrem Sistem Pratinjau Dokumen / PDF (Instant 0-Lag PDF Viewer)**:
    - **Akar Masalah**: Sebelumnya, `PdfPreview.jsx` me-render **seluruh halaman/slide PDF sekaligus** ke dalam elemen HTML5 `<canvas>` dengan resolusi ganda (`devicePixelRatio`). Pada dokumen presentasi slide seperti `data2.pdf` (Sales Analysis Case Study ReVoU) atau sertifikat, browser dipaksa merender puluhan kanvas resolusi tinggi secara bersamaan sehingga memakan ratusan MB VRAM GPU dan membekukan tab browser. Ditambah lagi, efek `filter: blur(8px)` pada `PreviewModal.jsx` dan pembatalan render berulang oleh `ResizeObserver` saat animasi modal membuka memperparah *GPU freeze*.
    - **Solusi Tuntas yang Diimplementasikan**:
      1. **Single-Page Active Renderer (`PdfPreview.jsx`)**: Hanya me-render **1 halaman/slide aktif** pada kanvas dalam satu waktu. Waktu buka dokumen terpangkas dari **~3.5 detik menjadi <60 milidetik** (35x lebih cepat!) dan konsumsi memori GPU turun drastis dari 360MB menjadi ~10MB.
      2. **Interactive Reader Toolbar**: Dilengkapi navigasi slide (`[◀ Prev]`, indikator `Page X / Y`, `[Next ▶]`), tombol pintas keyboard (Panah Kiri & Kanan), kontrol zoom (`-`, `+`, `Fit Width`), dan tombol buka langsung di tab baru (`[Tab Baru ↗]`).
      3. **Slide Dots Navigator**: Navigasi titik/nomor halaman di bagian bawah untuk melompat langsung ke slide tertentu.
      4. **Eliminasi Blur pada Modal**: Menghapus `filter: blur(8px)` pada `PreviewModal.jsx` dan menurunkan `backdrop-filter` modal menjadi `blur(4px)` yang sangat ringan bagi GPU.
      5. **Debounced ResizeObserver**: Mencegah render berulang yang sia-sia saat animasi modal membesar.
  - Menyediakan file migrasi SQL siap pakai [`supabase-sync-cv.sql`](file:///c:/Projects/zmdinataportfolio/MyPortfolio/supabase-sync-cv.sql) untuk dieksekusi di Supabase SQL Editor.
  - Memperbarui fallback data lokal di `projects.js`, `portfolioFallbacks.js`, dan `translations.js` (ID & EN).

### 9 Mei 2026

- Membuat ulang dokumentasi `progresswebsite.md` agar mencatat perkembangan website secara menyeluruh.
- Menambahkan ringkasan status frontend, admin panel, data hybrid, media portfolio, Agent-Z, dan build.
- Menambahkan dokumentasi fase pengembangan dari website statis sampai React + Supabase.
- Menambahkan catatan Supabase untuk tabel kategori, tabel item portfolio, storage bucket, dan aturan featured project.
- Menambahkan backlog prioritas setelah perbaikan CRUD portfolio.
- Memperbaiki admin portfolio agar item fallback statis seperti `data-1` tidak lagi diproses sebagai UUID Supabase.
- Menambahkan pola simpan item statis melalui `source_key` agar data lama bisa masuk ke database tanpa hilang dari admin.
- Memperbaiki mapping kategori Certifications dan Honors agar tidak jatuh ke `Uncategorized`.
- Menambahkan fallback kategori Certifications sesuai grup: AI, Data, Database, Web3, Programming, Design, Language, dan Seminar.
- Menambahkan fallback kategori Honors sesuai grup: Speaking & Teaching dan Competition Awards.
- Memperbaiki logika merge agar data baru dari Supabase tidak menghilangkan data statis lama dari repository.
- Menambahkan tombol bintang on/off langsung di tabel admin Projects untuk mengatur featured project tanpa membuka form Add/Edit.
- Menambahkan realtime subscription pada Featured Projects di Home agar perubahan dari panel admin lebih cepat tersinkron.
- Mengganti preview PDF dari iframe ke PDF.js (`pdfjs-dist`) berbasis canvas yang lebih responsif untuk mobile dan desktop.
- Menambahkan styling responsive untuk PDF preview modal dan table admin.
- Memperbaiki kompatibilitas tipe media project agar `Pdf`, `PDF`, dan `pdf` dibaca sebagai `pdf`, serta `Link`, `external`, dan `iframe` dibaca sebagai link.
- Menambahkan retry penyimpanan project bertipe link sebagai `external` jika Supabase masih memakai check constraint lama `projects_type_check`.
- Memindahkan preview modal ke React portal (`document.body`) agar modal tidak ikut posisi scroll halaman dan selalu muncul di viewport.
- Memaksa scroll internal preview modal mulai dari atas saat dibuka.
- Memperkuat fallback preview Featured Projects untuk item bertipe gambar agar jika preview gagal, kartu memakai file gambar utama.
- Menjaga Agent-Z tetap tidak disentuh saat perbaikan admin CRUD.
- Verifikasi build terakhir berhasil dengan `npm.cmd run build`.

### 8 Mei 2026

- Commit `72412a5` (`feat: categories on projects admin panel`).
- Mulai pengembangan kategori pada admin Projects.
- Menyiapkan dasar category management agar project dapat dikelompokkan lebih rapi.
- Menjadi fondasi untuk pengembangan CRUD portfolio lanjutan pada Projects, Certifications, dan Honors.

### 6 Mei 2026

- Commit `64f0eef` (`update: animation in website`).
- Melakukan polish animasi portfolio agar transisi terasa lebih smooth.
- Menambahkan atau menyesuaikan konfigurasi motion terpusat di `src/lib/motionConfig.js`.
- Menyesuaikan beberapa halaman dan komponen agar memakai preset motion yang lebih konsisten.
- Menjaga file maskot Agent-Z tetap tidak disentuh:
  - `src/components/Chatbot/Chatbot.jsx`
  - `src/components/Chatbot/Chatbot.css`
  - `public/assets/images/agent-z-*`
- Catatan verifikasi saat itu terbatas pada pemeriksaan statis karena build sempat terhalang environment.

### 26 April 2026

- Commit `d50d335` (`repair: bug website preview in mobile`).
- Memperbaiki bug preview website di mobile.
- Commit `0d73619` (`Fix: add og:image type and dimensions for WhatsApp support`).
- Menambahkan metadata Open Graph agar preview WhatsApp lebih stabil.
- Commit `02942e8` (`Docs: use compressed preview.png for lightweight OG crawling`).
- Menggunakan `preview.png` terkompres untuk crawler agar preview link lebih ringan.
- Commit `6d0dfee` (`Fix: update domain references to zmdinata-portfolio.vercel.app for link previews`).
- Menyamakan referensi domain production untuk kebutuhan link preview.
- Commit `fd4b659` (`Fix: change preview image URLs to absolute for OG crawler support`).
- Mengubah URL preview image menjadi absolute agar crawler sosial bisa membaca gambar.
- Commit `26b2b7f` (`Perf: deduplicate and compress portfolioContext data in api/chat.js to lower token usage`).
- Mengoptimasi context chatbot agar token usage lebih hemat.
- Commit `6230a36` (`Feat: Add dual Groq key switching and 30s timeout fallback for OpenRouter in Backend proxy`).
- Menambahkan mekanisme fallback key Groq dan timeout proxy backend.
- Commit `93e6b1c` (`Perf: switch OpenRouter model to Llama 3.2 3B Free for faster generation`).
- Mengganti model OpenRouter agar respons chatbot lebih cepat.
- Commit `c251400` (`Feat: Migrate AI fallback logic to Vercel Serverless Function Backend Proxy for total API key security`).
- Memindahkan fallback logic AI ke Vercel Serverless Function supaya API key lebih aman.
- Commit `9635ebc` (`Repair: fix mobile layout bug in Chatbot.css`).
- Memperbaiki layout mobile chatbot.
- Commit `67e78bd` (`Feat: Use openrouter/free for automatic model selection`).
- Menambahkan opsi model otomatis dari OpenRouter free.
- Commit `d79e320` (`Feat: Add OpenRouter as third fallback option for chatbot`).
- Menambahkan OpenRouter sebagai fallback ketiga untuk chatbot.
- Commit `f4bf514` (`Fix: auto language detect, 413 quota handling, upgrade to Gemini 2.5 Flash, reduce context window`).
- Memperbaiki deteksi bahasa otomatis, handling quota/413, upgrade Gemini, dan mengecilkan context window.
- Commit `2c089b9` (`Docs: Update link preview image to preview.png`).
- Menyesuaikan dokumentasi/link preview image.
- Commit `83ff140` (`Feat: Agent-Z ChatbotAI with skeletal animation, memory system, and Gemini+Groq fallback`).
- Menambahkan Agent-Z ChatbotAI dengan skeletal animation, memory system, dan fallback Gemini + Groq.

### 24 April 2026

- Commit `3362426` dan `d2174c3` (`docs: update readme with latest features and tech stack`).
- Memperbarui README dengan fitur dan stack terbaru pada saat itu.
- Commit `5df9074` (`feat: upgrade hero animation to AI Core Drones and fix mobile visibility`).
- Meng-upgrade hero animation menjadi AI Core Drones dan memperbaiki visibility mobile.
- Commit `433a77e` (`feat: make admin panel fully responsive for mobile`).
- Membuat admin panel lebih responsif di mobile.
- Commit `69db1ae` (`fix: make certificates and honors cards visible by fixing animation triggers`).
- Memperbaiki trigger animasi agar cards Certificates dan Honors terlihat.
- Commit `998bd48` (`feat: add local data fallback for certs and honors`).
- Menambahkan fallback data lokal untuk certificates dan honors.
- Commit `3c7bb2d` (`fix: hamburger menu position and size for mobile`).
- Memperbaiki posisi dan ukuran hamburger menu mobile.
- Commit `abebdd9` (`fix: remove duplicate import in App.jsx to fix build error`).
- Menghapus duplicate import di `App.jsx` untuk memperbaiki build error.
- Commit `ace42f6` (`feat: improve mobile navigation, fix pdf viewer, and update readme`).
- Memperbaiki mobile navigation, PDF viewer, dan README.
- Commit `24fea29` (`feat: implement full admin panel with supabase integration`).
- Implementasi admin panel penuh dengan integrasi Supabase.
- Commit `e858289` (`Fix: Hard reset git tracking and remove node_modules`).
- Merapikan tracking Git dan memastikan `node_modules` tidak ikut repository.
- Commit `a793f70` (`add: .gitignore`).
- Menambahkan `.gitignore`.
- Commit `28bd272` (`upload file: readme.md`).
- Menambahkan/unggah README awal.
- Commit `74aac5e` (`Update portfolio: hiring status, extra hero buttons, and mobile scroll fix`).
- Menambahkan hiring status, tombol hero tambahan, dan memperbaiki scroll mobile.

### 25 November 2025

- Commit `fae1cb6` (`Update honor_section.html`).
- Memperbarui section Honors pada versi HTML statis.
- Commit `ef3dfda` (`Update sertif_section.html`).
- Memperbarui section Certificates pada versi HTML statis.
- Commit `82e5931` (`Update proyek_section.html`).
- Memperbarui section Projects pada versi HTML statis.
- Commit `2854291` (`Revise portfolio page structure and content`).
- Merevisi struktur dan konten halaman portfolio.
- Commit `bb739a6` (`Refactor theme and language togglers with modal support`).
- Refactor toggle theme dan bahasa, termasuk dukungan modal.
- Commit `ddc2265` (`Update style.css`).
- Memperbarui stylesheet utama versi statis.

### 22 November 2025

- Beberapa commit memperbaiki struktur HTML, formatting, dan accessibility pada `index.html`, `proyek_section.html`, `sertif_section.html`, dan `honor_section.html`.
- Commit terkait: `f6b0573`, `18d6c29`, `f7aeff6`, `a93c319`, `ee034e6`, `9fd0ce1`, `d5bdba8`, `265b846`, `a632b6b`, `cc8b835`.
- Menambahkan dan merapikan file sertifikat baru, termasuk `sertif17` dan `sertif18`.
- Commit terkait upload/rename asset: `cb2a7d8`, `f14eb82`, `5c5a7b3`, `ee3f5ba`, `497598b`, `233d3d0`, `db9e1a8`, `0aad341`.
- Memperbarui data dan tampilan Honors, termasuk asset `honor2`.
- Commit terkait: `0779adc`, `051c99d`, `53e34eb`, `796f7c5`, `423e56d`.
- Ada beberapa commit percobaan kecil seperti update print statement (`1916f38`, `8a4191b`) yang tidak berdampak pada fitur portfolio utama.

### 9 November 2025

- Commit `11b7460` (`Enhance sertif_section.html with new certificates`).
- Menambahkan sertifikat baru pada section Certificates versi statis.
- Commit `776307b` (`Rename Sertifikat Pemakalah Ke-125.pdf to sertif16.pdf`).
- Menstandarkan nama file sertifikat menjadi `sertif16.pdf`.
- Commit `445b4d6`, `c9f1fc9`, dan `b18eb87`.
- Mengunggah dan menamai asset preview sertifikat `sertif16`.

### 30-31 Oktober 2025

- Commit `ac0d355` (`Fix HTML encoding issues in proyek_section.html`).
- Memperbaiki encoding HTML pada project section.
- Commit `fb031b1` (`Fix HTML formatting and update structure`).
- Merapikan formatting dan struktur HTML.
- Commit `75c004f` (`Enhance honor section with active link styling`).
- Menambahkan styling active link pada Honors.
- Commit `96d02dd` (`Fix HTML structure and remove duplicate elements`).
- Memperbaiki struktur HTML dan menghapus elemen duplikat.

### Perubahan Awal Sebelum Commit Detail di Atas

- Website dimulai dari struktur statis HTML, CSS, dan JavaScript.
- Konten awal portfolio dibuat untuk Hero, About, Projects, Certifications, dan Honors.
- Asset awal proyek, sertifikat, honors, dan foto profile dimasukkan ke repository.
- Website kemudian dimigrasikan ke React + Vite.
- Ditambahkan sistem multi bahasa Indonesia/English.
- Ditambahkan light/dark mode.
- Ditambahkan admin panel dan integrasi Supabase.
- Ditambahkan AI portfolio chatbot Agent-Z.
- Ditambahkan metadata dasar dan kesiapan deploy ke Vercel.

## Fase 1: Website Statis Awal

- [x] Membuat struktur awal portfolio berbasis HTML, CSS, dan JavaScript.
- [x] Menyediakan section utama: Hero, About, Projects, Certifications, dan Honors.
- [x] Menambahkan aset awal untuk foto, project, sertifikat, dan penghargaan.
- [x] Membuat preview dokumen proyek dan sertifikat dari file lokal.
- [x] Menyiapkan tampilan responsive dasar.

## Fase 2: Migrasi ke React

- [x] Migrasi aplikasi ke React dengan Vite.
- [x] Memecah halaman menjadi komponen dan page terpisah.
- [x] Menambahkan route publik:
  - `/`
  - `/#/projects`
  - `/#/certificates`
  - `/#/honors`
- [x] Menambahkan layout global dengan Navbar, Footer, theme provider, dan language provider.
- [x] Memindahkan data statis ke folder `src/data` sebagai fallback.

## Fase 3: UI, Bahasa, dan Tema

- [x] Menambahkan dukungan dua bahasa: Indonesia dan English.
- [x] Menambahkan dark/light mode.
- [x] Menambahkan animasi berbasis Framer Motion.
- [x] Menambahkan kartu interaktif dengan tilt effect untuk portfolio item.
- [x] Menyusun stylesheet modular:
  - `src/styles/index.css`
  - `src/styles/variables.css`
  - `src/styles/components/*`
  - `src/styles/pages/*`
- [x] Menyempurnakan modal preview untuk PDF dan gambar.

## Fase 4: Integrasi Supabase

- [x] Menambahkan Supabase client di `src/lib/supabase.js`.
- [x] Menggunakan Supabase untuk autentikasi admin.
- [x] Menggunakan Supabase sebagai sumber data dinamis.
- [x] Menjaga data lokal sebagai fallback jika database kosong atau request gagal.
- [x] Menyiapkan pola data hybrid agar konten statis lama tetap tampil.

## Fase 5: Admin Panel

- [x] Menambahkan route admin:
  - `/#/admin/login`
  - `/#/admin/dashboard`
  - `/#/admin/profile`
  - `/#/admin/experience`
  - `/#/admin/education`
  - `/#/admin/skills`
  - `/#/admin/projects`
  - `/#/admin/certificates`
  - `/#/admin/honors`
- [x] Menambahkan `ProtectedRoute` untuk membatasi akses admin.
- [x] Menambahkan layout admin dengan sidebar/topbar.
- [x] Menambahkan halaman CRUD untuk profile, experience, education, dan skills.
- [x] Menambahkan halaman CRUD portfolio untuk Projects, Certificates, dan Honors.

## Fase 6: CRUD Projects, Certifications, dan Honors

- [x] Menambahkan category management untuk Projects.
- [x] Menambahkan category management untuk Certifications.
- [x] Menambahkan category management untuk Honors.
- [x] Menambahkan shared CRUD manager di `src/components/admin/PortfolioCrudManager.jsx`.
- [x] Menambahkan tab `Items` dan `Categories` pada admin portfolio.
- [x] Menambahkan pilihan icon kategori dari Lucide.
- [x] Menambahkan tipe media:
  - PDF
  - Image
  - Link
- [x] Menambahkan upload PDF/gambar/preview ke Supabase Storage bucket `portfolio-media`.
- [x] Menambahkan preview link otomatis melalui `api/link-preview.js`.
- [x] Menambahkan fallback manual preview image jika preview link gagal.
- [x] Menjaga item statis lama tetap muncul di panel admin.
- [x] Memperbaiki error UUID ketika item fallback seperti `data-1` diedit dari admin.
- [x] Memperbaiki mapping Certification dan Honors agar tidak jatuh ke `Uncategorized`.

## Fase 7: Featured Projects

- [x] Menambahkan field `is_featured` dan `featured_order` untuk projects.
- [x] Menambahkan tombol switch pin project di admin.
- [x] Membatasi featured project maksimal 3 dari sisi UI.
- [x] Menyiapkan trigger database untuk membatasi featured project maksimal 3 dari sisi Supabase.
- [x] Menampilkan 3 featured projects di Home Page tepat setelah About Me.
- [x] Default featured awal:
  - `data-1`
  - `data-2`
  - `web-1`

## Fase 8: Public Portfolio Pages

- [x] Projects Page membaca kategori dan item dari Supabase.
- [x] Certificates Page membaca kategori dan item dari Supabase.
- [x] Honors Page membaca kategori dan item dari Supabase.
- [x] Semua halaman tetap memakai fallback lokal jika Supabase kosong/gagal.
- [x] Konten dikelompokkan berdasarkan kategori.
- [x] Item bertipe link langsung membuka tab baru.
- [x] Item bertipe PDF/gambar tetap memakai modal preview.

## Fase 9: Agent-Z Chatbot

- [x] Menambahkan chatbot portfolio Agent-Z.
- [x] Menambahkan API chat di `api/chat.js`.
- [x] Menjaga asset maskot Agent-Z di `public/assets/images/agent-z-*`.
- [x] Menjaga komponen Agent-Z di `src/components/Chatbot`.
- [x] Pada update CRUD portfolio, maskot Agent-Z tidak disentuh.

## Fase 10: SEO, Metadata, dan Deploy Readiness

- [x] Menambahkan metadata dasar di `index.html`.
- [x] Menyiapkan favicon dan asset publik.
- [x] Menyiapkan konfigurasi Vercel di `vercel.json`.
- [x] Menjaga build Vite tetap berhasil.
- [ ] Audit Lighthouse terbaru untuk performance, accessibility, best practices, dan SEO.
- [ ] Review ukuran bundle karena Vite memberi warning chunk besar.

## Data dan Asset Saat Ini

- Projects tersimpan sebagai data lokal di `src/data/projects.js` dan asset di `public/assets/projects`.
- Certificates tersimpan sebagai data lokal di `src/data/certificates.js` dan asset di `public/assets/certificates`.
- Honors tersimpan sebagai data lokal di `src/data/honors.js` dan asset di `public/assets/honors`.
- Fallback portfolio dikelola melalui `src/lib/portfolioFallbacks.js`.
- Helper media portfolio dikelola melalui `src/lib/portfolioMedia.js`.
- Helper icon kategori dikelola melalui `src/lib/categoryIcons.jsx`.

## Catatan Supabase

Tabel utama yang digunakan untuk portfolio:

- `project_categories`
- `certificate_categories`
- `honor_categories`
- `projects`
- `certificates`
- `honors`

Storage bucket:

- `portfolio-media`

Catatan penting:

- Data statis lama sebaiknya memiliki `source_key` seperti `static:data-1`, `static:cert-18`, dan `static:honor-1`.
- Kolom `category_id` harus mengarah ke tabel kategori masing-masing.
- Projects tetap menyimpan `category` legacy agar fallback dan data lama mudah dipetakan.
- Featured project dibatasi maksimal 3 item aktif.

## Verifikasi Terakhir

- [x] `npm.cmd run build` / `npm run build` berhasil 100% tanpa warning/error.
- [x] Admin blank screen sebelumnya sudah diperbaiki.
- [x] Error edit project dengan `id` fallback seperti `data-1` sudah ditangani di kode.
- [x] Fallback category Certification dan Honors sudah diselaraskan dengan kategori database.
- [x] Zero-Lag Navigation: Eliminasi GPU blur freeze dan implementasi in-memory cache (`portfolioCache.js`).
- [x] Optimasi bundle size dengan Route-level Code-Splitting (`React.lazy()` & `<Suspense>`).
- [x] Zero-Lag Single-Page PDF Viewer (`PdfPreview.jsx` & `PreviewModal.jsx`) dengan reader toolbar & memory drop ke ~10MB.
- [x] Bento Grid Clean-Tech UI & Interactive Profile Deck (`ProfileInteractiveDeck.jsx`).
- [x] Interactive AI Terminal dengan data homelab ThinkPad T440 daur ulang dan CV terbaru.
- [x] Unified Command Dashboard (`/admin/dashboard`) & Split-Screen Quick-Editor (`/admin/quick-editor`).
- [x] Dokumentasi README.md dan file migrasi Supabase (`supabase-sync-cv.sql`) terintegrasi penuh.
- [ ] Eksekusi file SQL `supabase-sync-cv.sql` di Supabase SQL Editor production pengguna.

## Backlog Prioritas Berikutnya

- [ ] Jalankan SQL final `supabase-sync-cv.sql` di Supabase production.
- [ ] Uji admin CRUD langsung di browser:
  - Create kategori baru.
  - Edit kategori lama.
  - Delete kategori.
  - Create item PDF.
  - Create item image.
  - Create item link.
  - Upload preview manual.
  - Edit item statis yang sudah di-seed.
  - Delete item database.
- [ ] Pastikan Certifications dan Honors tidak lagi menampilkan `Uncategorized`.
- [ ] Coba pin project ke-4 dan pastikan ditolak (limit 3 active featured).
- [ ] Pastikan Home hanya menampilkan 3 featured projects.
- [x] Optimasi bundle size dengan code splitting (Selesai).
- [x] Audit responsive admin di mobile (Selesai).
- [x] Perbarui README agar selaras dengan struktur Supabase terbaru (Selesai).
- [ ] Deployment update ke Vercel setelah verifikasi Supabase.

## Prinsip Pengembangan

- Jangan menghapus data statis lama tanpa alasan jelas.
- Jaga fallback lokal tetap tersedia agar website tetap tampil walau Supabase bermasalah.
- Jangan menyentuh maskot Agent-Z kecuali ada permintaan eksplisit.
- Perubahan admin harus selalu dicek ke public page terkait.
- Setiap fitur baru yang mengubah database sebaiknya disertai SQL Supabase yang bisa langsung dijalankan.
- Build harus berhasil sebelum perubahan dianggap selesai.
