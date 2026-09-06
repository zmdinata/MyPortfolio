# Progress Website Portfolio ZMDINATA

Dokumen ini mencatat perkembangan keseluruhan website portfolio ZMDINATA dari versi awal statis sampai menjadi aplikasi React dengan admin panel, Supabase, media portfolio, dan AI assistant. Dokumen ini juga menjadi catatan arah pengembangan agar perubahan berikutnya tetap rapi dan tidak merusak fitur yang sudah stabil.

Update terakhir: 6 September 2026

## Ringkasan Status

- Status frontend publik: aktif, ditransformasi ke Bento Grid Clean Tech ala Linear/Vercel dengan Spotlight Cursor, Laser Border-Beam, Profile Mini-Deck, dan Interactive AI Terminal.
- Status admin panel: aktif, dengan proteksi route, Unified Command Dashboard, dan Split-Screen Quick-Editor.
- Status data: hybrid, memakai Supabase sebagai sumber utama dan data lokal sebagai fallback.
- Status media portfolio: proyek, sertifikat, dan honors sudah mendukung PDF, gambar, dan link.
- Status chatbot Agent-Z: aktif dan terintegrasi mulus dengan prompt triggers pada Bento AI Telemetry serta optimasi sliding window token.
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

### 6 September 2026 (Pembaruan Terkini: AI Engineering & Multi-Agent Transition)

- **Pemutakhiran Data & Rekam Jejak Portofolio 2026 (100% Otentik & Akurat)**:
  - **AutoOverlay AI (Featured #1)**: Mesin alpha & manajemen risiko trading opsi otonom (Monte Carlo Merton Jump Diffusion VaR + 6-persona investor council) untuk Alpaca AI Trading Hackathon.
  - **Agent-Z Homelab (Featured #2)**: Orkestrator agen AI mandiri di ThinkPad T440 (Hermes Agent, OpenClaw, n8n, 9Router failover).
  - **A2Z Agentz (Featured #3)**: Agen intelijen airdrop Web3 mandiri di Base Network ditenagai AMD ROCm & Llama 3.1 (AMD Developer Hackathon ACT II).
  - **Pijak x IBM SkillsBuild**: Lulusan Beasiswa Penuh (Full Graduate) Program Intensif AI Engineer dengan kredensial resmi terverifikasi.
  - **Pendidikan & Prestasi**: Mahasiswa S1 Sistem Informasi STMIK IKMI Cirebon (IPK 3.55 / 4.00), Medali Perunggu Lomba Business Plan Nasional UNY 2025 (*Herbelice*), dan partisipan aktif hackathon AI.
  - **Transisi Karier**: Narasi autentik peralihan dari Digital/NFT Artist (2020–2024, 60+ karya komersial) ke AI Engineering & Quantitative Systems.
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
    - Menambahkan ukuran font fluid dengan CSS `clamp()`, serta bar perintah cepat terminal (`neofetch`, `skills`, `projects`, `telemetry`, `whoami`, `contact`, `clear`) yang dapat digeser secara horizontal tanpa merusak tata letak kartu.
  - **Restrukturisasi Padding Kartu Bento Mobile**:
    - Mengurangi padding kartu dari 20px menjadi 16px (<=768px) dan 14px (<=480px/380px) untuk memperluas ruang baca efektif ponsel tanpa horizontal overflow.
- **Optimasi Backend & Chatbot Agent-Z (`Chatbot.jsx`)**:
  - Memangkas payload injection konteks pada chatbot dari 8 objek berulang menjadi format ringkas terpartisi, menghemat konsumsi token dan mencegah rate-limit (TPM).
- **Perombakan Admin Panel & Hub Migrasi Supabase**:
  - **Unified Command Dashboard (`/admin/dashboard`)**: Pemantauan telemetri Supabase dinamis, matriks tabel, dan generator SQL migrasi CV 2026.
  - **Split-Screen Quick-Editor (`/admin/quick-editor`)**: Editor dual-pane interaktif dengan live preview instan.
- **Audit Keamanan Data Sensitif**:
  - Seluruh informasi sensitif (nomor telepon, token privat, dan hardcoded API endpoint) telah diaudit dan dibersihkan dari seluruh file markdown dan kode sumber.

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
