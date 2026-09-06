// Data CV Terbaru Zacky Muhammad Dinata
// Digunakan oleh Admin Panel (Dashboard & Quick-Editor) untuk preview dan sinkronisasi Supabase

export const LATEST_CV_PROFILE = {
  id: 1,
  name: 'Zacky Muhammad Dinata',
  email: 'zmdinata@gmail.com',
  location: 'Cirebon, Jawa Barat, Indonesia',
  github: 'https://github.com/zmdinata',
  website: 'https://zmdinata.web.id',
  linkedin: 'https://www.linkedin.com/in/zacky-muhammad-dinata-463995280',
  portfolio_badge: 'https://pijak-career-fair.dicoding.com/u/dc_4435233',
  available_for_hire: true,
  hero_description_en: 'Results-driven AI Engineer | LLM Automation (OpenClaw, Hermes Agent, n8n) | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id: 'Results-driven AI Engineer | Otomasi LLM (OpenClaw, Hermes Agent, n8n) | Scholar Pijak x IBM SkillsBuild',
  about_description_en: 'Results-driven AI Engineer focused on building automated systems powered by Large Language Models. Backed by a strong technical foundation from PIJAK in Collaboration with the IBM SkillsBuild AI Intensive Program, I specialize in streamlining complex, repetitive operations. I am actively using OpenClaw, Hermes Agent, and n8n to integrate state-of-the-art LLMs (such as Gemini) into seamless, automated workflows. Passionate about leveraging intelligent tools to eliminate manual effort and drive impactful business efficiency.',
  about_description_id: 'Results-driven AI Engineer yang berfokus pada pembangunan sistem otomasi bertenaga Large Language Models (LLM). Didukung fondasi teknis kuat dari program intensif PIJAK x IBM SkillsBuild, saya berspesialisasi dalam menyederhanakan operasi repetitif yang kompleks. Saya aktif menggunakan OpenClaw, Hermes Agent, dan n8n untuk mengintegrasikan LLM canggih (seperti Gemini) ke dalam alur kerja otomatis yang efisien untuk mendorong produktivitas dan dampak bisnis nyata.',
};

export const LATEST_CV_EDUCATION = [
  {
    school: 'STMIK IKMI Cirebon',
    degree: "Bachelor's Degree",
    major: 'Information Systems',
    gpa: '3.55 / 4.00',
    date_start: '2024-10-01',
    date_end: '2028-10-01',
    achievements: 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (Es Krim Jamu).',
  },
];

export const LATEST_CV_EXPERIENCE = [
  {
    role: 'AI Engineer Intensive Program Scholar',
    company: 'Pijak x IBM SkillsBuild',
    date_start: '2026-02-01',
    date_end: '2026-07-31',
    work_type: 'Remote',
    description: 'Selected through a competitive process to receive a full scholarship for the Pijak x IBM SkillsBuild AI Engineer Cohort, an intensive program built to produce job-ready AI Engineers backed by IBM.',
  },
  {
    role: 'Freelance NFT & Digital Illustration Artist',
    company: 'Self-Employed',
    date_start: '2020-12-01',
    date_end: '2024-10-31',
    work_type: 'Remote',
    description: 'Completed 60+ custom NFT illustrations for FlokyApe collection, 30+ layered traits inspired by Azuki style, and 20+ custom digital portraits.',
  },
];

export const LATEST_CV_PROJECTS = [
  {
    id_string: 'ai-1',
    title_en: 'Agent-Z Homelab: AI Agent Orchestrator',
    title_id: 'Agent-Z Homelab: Orkestrasi Agen AI Mandiri',
    description_en: 'Self-hosted AI agentic orchestrator on ThinkPad T440 running Hermes Agent, OpenClaw, and n8n with continuous telemetry.',
    description_id: 'Sistem orkestrator agen AI mandiri di ThinkPad T440 menggunakan Hermes Agent, OpenClaw, dan n8n dengan telemetri real-time.',
    file: 'https://github.com/zmdinata',
    category: 'data',
    type: 'link',
    is_featured: true,
    featured_order: 1,
    tech_stack: ['Hermes Agent', 'OpenClaw', 'n8n', 'Gemini API', 'Docker'],
  },
  {
    id_string: 'ai-2',
    title_en: 'LestariRimba: AI Sustainability Prototype',
    title_id: 'LestariRimba: Prototipe Web AI Keberlanjutan',
    description_en: 'Cloud Run deployed environmental sustainability platform with AI vision and forest conservation analysis.',
    description_id: 'Platform keberlanjutan lingkungan berbasis AI yang dideploy di Google Cloud Run dengan analisis konservasi hutan.',
    file: 'https://lestari-rimba-661373468998.asia-southeast2.run.app/',
    category: 'web',
    type: 'link',
    is_featured: true,
    featured_order: 2,
    tech_stack: ['Google Cloud Run', 'FastAPI', 'Gemini API', 'Python'],
  },
  {
    id_string: 'ai-3',
    title_en: 'Flight Ticket Price Prediction with Multiple Linear Regression',
    title_id: 'Prediksi Harga Tiket Penerbangan (Multiple Linear Regression)',
    description_en: 'Published research paper on flight ticket price forecasting using Multiple Linear Regression in SISFOTEK Journal.',
    description_id: 'Publikasi penelitian prediksi harga tiket pesawat menggunakan regresi linier berganda pada Jurnal SISFOTEK.',
    file: 'https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
    category: 'data',
    type: 'link',
    is_featured: true,
    featured_order: 3,
    tech_stack: ['Python', 'Multiple Linear Regression', 'Scikit-learn', 'Pandas'],
  },
];

export const LATEST_CV_SKILLS = [
  { name: 'LLM Orchestration', category: 'ai', level: 'Advanced', description: 'OpenClaw, Hermes Agent, LangChain, Gemini API integration' },
  { name: 'Workflow Automation', category: 'automation', level: 'Advanced', description: 'n8n pipelines, Python automations, Webhook routers' },
  { name: 'Machine Learning & Data', category: 'data', level: 'Intermediate', description: 'Multiple Linear Regression, Scikit-learn, Pandas, SQL' },
  { name: 'Cloud & Infrastructure', category: 'devops', level: 'Intermediate', description: 'Google Cloud Run, Supabase, Linux Homelab, Docker' },
];

export const FULL_MIGRATION_SQL = `-- =========================================================
-- SQL Migration Script: Sinkronisasi CV Terbaru Zacky Muhammad Dinata
-- Jalankan skrip ini langsung di Supabase Dashboard > SQL Editor
-- =========================================================

-- 1. UPDATE PROFILE DENGAN BIO AI ENGINEER TERBARU
UPDATE public.profile
SET 
  hero_description_en = 'Results-driven AI Engineer | LLM Automation (OpenClaw, Hermes Agent, n8n) | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id = 'Results-driven AI Engineer | Otomasi LLM (OpenClaw, Hermes Agent, n8n) | Scholar Pijak x IBM SkillsBuild',
  about_description_en = 'Results-driven AI Engineer focused on building automated systems powered by Large Language Models. Backed by a strong technical foundation from PIJAK in Collaboration with the IBM SkillsBuild AI Intensive Program, I specialize in streamlining complex, repetitive operations. I am actively using OpenClaw, Hermes Agent, and n8n to integrate state-of-the-art LLMs (such as Gemini) into seamless, automated workflows. Passionate about leveraging intelligent tools to eliminate manual effort and drive impactful business efficiency.',
  about_description_id = 'Results-driven AI Engineer yang berfokus pada pembangunan sistem otomasi bertenaga Large Language Models (LLM). Didukung fondasi teknis kuat dari program intensif PIJAK x IBM SkillsBuild, saya berspesialisasi dalam menyederhanakan operasi repetitif yang kompleks. Saya aktif menggunakan OpenClaw, Hermes Agent, dan n8n untuk mengintegrasikan LLM canggih (seperti Gemini) ke dalam alur kerja otomatis yang efisien untuk mendorong produktivitas dan dampak bisnis nyata.',
  available_for_hire = true,
  updated_at = NOW()
WHERE id = 1;

-- 2. UPDATE PENDIDIKAN & PRESTASI MEDALI UNY
UPDATE public.education
SET 
  grade_type = 'IPK',
  grade_value = '3.55',
  date_start = '2024-10-01',
  date_end = '2028-10-01',
  description_en = 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (business idea: "Es Krim Jamu"). Coursework: Data Science, Statistics, Machine Learning, AI Engineer.',
  description_id = 'Medali Perunggu, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025) di Universitas Negeri Yogyakarta (ide bisnis: "Es Krim Jamu"). Mata kuliah: Data Science, Statistika, Machine Learning, AI Engineer.'
WHERE school ILIKE '%IKMI%' OR school ILIKE '%STMIK%';

-- 3. UPDATE PENGALAMAN KERJA (PIJAK x IBM & FREELANCE)
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
WHERE role_en ILIKE '%AI Engineer%' OR company_en ILIKE '%IBM%';

UPDATE public.experience
SET 
  date_start = '2020-12-01',
  date_end = '2024-10-31',
  role_en = 'Freelance NFT & Digital Illustration Artist',
  role_id = 'Seniman Ilustrasi Digital & NFT Lepas',
  description_en = 'Completed 60+ custom NFT illustrations for FlokyApe collection, 30+ layered traits inspired by Azuki style, and 20+ digital portraits.',
  description_id = 'Menyelesaikan 60+ karya NFT kustom untuk koleksi FlokyApe, 30+ trait berlayer terinspirasi gaya Azuki, dan 20+ potret digital pesanan.'
WHERE role_en ILIKE '%NFT%' OR role_en ILIKE '%Artist%';

-- 4. RESET DAN UPDATE 3 PROYEK UNGGULAN AI
UPDATE public.projects SET is_featured = false, featured_order = null;

-- Proyek 1: Agent-Z Homelab
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-1',
  'static:ai-1',
  'data',
  'Agent-Z Homelab: AI Agent Orchestrator',
  'Agent-Z Homelab: Orkestrasi Agen AI Mandiri',
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

-- Proyek 2: LestariRimba Cloud Run
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-2',
  'static:ai-2',
  'web',
  'LestariRimba: AI Sustainability Prototype',
  'LestariRimba: Prototipe Web AI Keberlanjutan',
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

-- Proyek 3: SISFOTEK Ticket MLR
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
`;
