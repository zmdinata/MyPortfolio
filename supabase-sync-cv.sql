-- =========================================================
-- SQL Migration Script: Sinkronisasi CV Terbaru Zacky Muhammad Dinata
-- Jalankan skrip ini langsung di Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- 1. UPDATE PROFILE
UPDATE public.profile
SET 
  hero_description_en = 'Results-driven AI Engineer | LLM Automation (OpenClaw, Hermes Agent, n8n) | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id = 'Results-driven AI Engineer | Otomasi LLM (OpenClaw, Hermes Agent, n8n) | Scholar Pijak x IBM SkillsBuild',
  about_description_en = 'Results-driven AI Engineer focused on building automated systems powered by Large Language Models. Backed by a strong technical foundation from PIJAK in Collaboration with the IBM SkillsBuild AI Intensive Program, I specialize in streamlining complex, repetitive operations. I am actively using OpenClaw, Hermes Agent, and n8n to integrate state-of-the-art LLMs (such as Gemini) into seamless, automated workflows. Passionate about leveraging intelligent tools to eliminate manual effort and drive impactful business efficiency.',
  about_description_id = 'Results-driven AI Engineer yang berfokus pada pembangunan sistem otomasi bertenaga Large Language Models (LLM). Didukung fondasi teknis kuat dari program intensif PIJAK x IBM SkillsBuild, saya berspesialisasi dalam menyederhanakan operasi repetitif yang kompleks. Saya aktif menggunakan OpenClaw, Hermes Agent, dan n8n untuk mengintegrasikan LLM canggih (seperti Gemini) ke dalam alur kerja otomatis yang efisien untuk mendorong produktivitas dan dampak bisnis nyata.',
  available_for_hire = true,
  updated_at = NOW()
WHERE id = 1;

-- 2. UPDATE EDUCATION (GPA 3.55 & Prestasi Medali Perunggu UNY)
UPDATE public.education
SET 
  grade_type = 'IPK',
  grade_value = '3.55',
  date_start = '2024-10-01',
  date_end = '2028-10-01',
  description_en = 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (business idea: "Es Krim Jamu"). Coursework: Data Science, Statistics, Machine Learning, AI Engineer.',
  description_id = 'Medali Perunggu, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025) di Universitas Negeri Yogyakarta (ide bisnis: "Es Krim Jamu"). Mata kuliah: Data Science, Statistika, Machine Learning, AI Engineer.'
WHERE school = 'STMIK IKMI Cirebon' OR id = '7e473f25-743e-4e67-ae75-52013d9226e1';

-- 3. UPDATE EXPERIENCE (Pijak x IBM SkillsBuild & Freelance)
UPDATE public.experience
SET 
  date_start = '2026-02-01',
  date_end = '2026-07-31',
  role_en = 'AI Engineer Intensive Program Scholar',
  role_id = 'AI Engineer Intensive Program Scholar',
  company_en = 'Pijak x IBM SkillsBuild',
  company_id = 'Pijak x IBM SkillsBuild',
  description_en = 'Selected through a competitive process to receive a full scholarship for the Pijak x IBM SkillsBuild AI Engineer Cohort, a program built to produce job-ready AI Engineers backed by IBM.',
  description_id = 'Terpilih melalui proses kompetitif untuk menerima beasiswa penuh pada program Pijak x IBM SkillsBuild AI Engineer Cohort, sebuah program pencetak AI Engineer siap kerja didukung oleh IBM.'
WHERE role_en ILIKE '%AI Engineer Intensive%';

UPDATE public.experience
SET 
  date_start = '2020-12-01',
  date_end = '2024-10-31',
  role_en = 'Freelance NFT & Digital Illustration Artist',
  role_id = 'Seniman Ilustrasi Digital & NFT Lepas',
  description_en = 'Completed 60+ custom NFT illustrations for FlokyApe collection, 30+ layered traits inspired by Azuki style, and 20+ digital portraits.',
  description_id = 'Menyelesaikan 60+ karya NFT kustom untuk koleksi FlokyApe, 30+ trait berlayer terinspirasi gaya Azuki, dan 20+ potret digital pesanan.'
WHERE role_en ILIKE '%NFT%';

-- 4. INSERT OR UPDATE PROYEK BARU UNGGULAN (Agent-Z Homelab, LestariRimba, & SISFOTEK MLR)
-- Pastikan project lama tidak lagi featured
UPDATE public.projects SET is_featured = false, featured_order = null;

-- Masukkan/Update Proyek 1: Agent-Z Homelab
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-1',
  'static:ai-1',
  'data',
  'Agent-Z Homelab: AI Agent Orchestrator',
  'Agent-Z Homelab: AI Agent Orchestrator',
  'https://github.com/zmdinata',
  '/assets/images/preview.png',
  'link',
  true,
  1,
  1
)
ON CONFLICT (id_string) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_id = EXCLUDED.title_id,
  file = EXCLUDED.file,
  is_featured = true,
  featured_order = 1;

-- Masukkan/Update Proyek 2: LestariRimba
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-2',
  'static:ai-2',
  'web',
  'LestariRimba: AI Sustainability Prototype',
  'LestariRimba: Prototype Web AI Berkelanjutan',
  'https://lestari-rimba-661373468998.asia-southeast2.run.app/',
  '/assets/images/preview.png',
  'link',
  true,
  2,
  2
)
ON CONFLICT (id_string) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_id = EXCLUDED.title_id,
  file = EXCLUDED.file,
  is_featured = true,
  featured_order = 2;

-- Masukkan/Update Proyek 3: SISFOTEK Flight Price Prediction
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-3',
  'static:ai-3',
  'data',
  'Flight Ticket Price Prediction with Multiple Linear Regression',
  'Prediksi Harga Tiket Penerbangan (Multiple Linear Regression)',
  'https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
  '/assets/projects/Data/data1.png',
  'link',
  true,
  3,
  3
)
ON CONFLICT (id_string) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_id = EXCLUDED.title_id,
  file = EXCLUDED.file,
  is_featured = true,
  featured_order = 3;
