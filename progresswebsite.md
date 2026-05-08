# Progress Website Portfolio ZMDINATA

Dokumen ini mencatat perkembangan keseluruhan website portfolio ZMDINATA dari versi awal statis sampai menjadi aplikasi React dengan admin panel, Supabase, media portfolio, dan AI assistant. Dokumen ini juga menjadi catatan arah pengembangan agar perubahan berikutnya tetap rapi dan tidak merusak fitur yang sudah stabil.

Update terakhir: 9 Mei 2026

## Ringkasan Status

- Status frontend publik: aktif dan sudah memakai React + Vite.
- Status admin panel: aktif, dengan proteksi route dan halaman manajemen konten.
- Status data: hybrid, memakai Supabase sebagai sumber utama dan data lokal sebagai fallback.
- Status media portfolio: proyek, sertifikat, dan honors sudah mendukung PDF, gambar, dan link.
- Status chatbot Agent-Z: aktif dan dipertahankan tanpa perubahan pada aset/maskot.
- Status build terakhir: `npm.cmd run build` berhasil.

## Stack Utama

- React 19 + Vite 6 sebagai frontend utama.
- React Router HashRouter untuk route publik dan admin.
- Supabase untuk database, autentikasi, dan storage.
- Framer Motion untuk transisi dan animasi halaman.
- React Icons dan Lucide React untuk icon UI.
- CSS modular di folder `src/styles`.
- Vercel-oriented API routes di folder `api`.

## Memory Perubahan per Tanggal

Bagian ini dipakai sebagai log perubahan historis. Setiap perubahan besar berikutnya sebaiknya ditambahkan di bagian paling atas agar progres terbaru mudah dilacak.

Sumber memory historis: `git log --date=short --pretty=format:"%h %ad %s"`.

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

- [x] `npm.cmd run build` berhasil.
- [x] Admin blank screen sebelumnya sudah diperbaiki.
- [x] Error edit project dengan `id` fallback seperti `data-1` sudah ditangani di kode.
- [x] Fallback category Certification dan Honors sudah diselaraskan dengan kategori database.
- [ ] Uji manual penuh di browser untuk create, edit, delete, upload file, preview link, dan pin project setelah SQL Supabase dijalankan.

## Backlog Prioritas Berikutnya

- [ ] Jalankan SQL final di Supabase production.
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
- [ ] Coba pin project ke-4 dan pastikan ditolak.
- [ ] Pastikan Home hanya menampilkan 3 featured projects.
- [ ] Optimasi bundle size dengan code splitting.
- [ ] Audit responsive admin di mobile.
- [ ] Perbarui README agar selaras dengan struktur Supabase terbaru.
- [ ] Deployment update ke Vercel setelah semua test manual lolos.

## Prinsip Pengembangan

- Jangan menghapus data statis lama tanpa alasan jelas.
- Jaga fallback lokal tetap tersedia agar website tetap tampil walau Supabase bermasalah.
- Jangan menyentuh maskot Agent-Z kecuali ada permintaan eksplisit.
- Perubahan admin harus selalu dicek ke public page terkait.
- Setiap fitur baru yang mengubah database sebaiknya disertai SQL Supabase yang bisa langsung dijalankan.
- Build harus berhasil sebelum perubahan dianggap selesai.
