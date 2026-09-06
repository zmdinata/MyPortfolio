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
  hero_description_en: 'AI Engineer & Autonomous Agent Architect | Quantitative Risk Systems & LLM Automation | Full Scholarship Graduate at Pijak x IBM SkillsBuild',
  hero_description_id: 'AI Engineer & Arsitek Agen Mandiri | Sistem Risiko Kuantitatif & Otomasi LLM | Lulusan Beasiswa Penuh Pijak x IBM SkillsBuild',
  about_description_en: 'Results-driven AI Engineer & ML Researcher specializing in Autonomous Multi-Agent Orchestration (Hermes Agent, OpenClaw, n8n) and Quantitative Risk Management. Full Scholarship Graduate of the PIJAK x IBM SkillsBuild AI Engineer Cohort. I build explainable agentic workflows, autonomous homelab infrastructure, and deterministic risk engines for algorithmic execution.',
  about_description_id: 'AI Engineer & Peneliti ML yang berfokus pada Orkestrasi Multi-Agent Mandiri (Hermes Agent, OpenClaw, n8n) dan Manajemen Risiko Kuantitatif. Lulusan Beasiswa Penuh Program Beasiswa AI Engineer PIJAK x IBM SkillsBuild. Saya merancang alur kerja agen cerdas yang dapat diaudit, infrastruktur homelab mandiri, serta mesin risiko deterministik untuk eksekusi algoritma.',
};

export const LATEST_CV_EDUCATION = [
  {
    school: 'STMIK IKMI Cirebon',
    degree: "Bachelor's Degree",
    major: 'Information Systems',
    gpa: '3.55 / 4.00',
    date_start: '2024-10-01',
    date_end: '2028-10-01',
    achievements: 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (Es Krim Jamu). Participant in AMD Hackathon ACT II, Alpaca AI Trading Hackathon, and AI HACKFEST 2026.',
  },
];

export const LATEST_CV_EXPERIENCE = [
  {
    role: 'AI Engineer & Quant Lead (Hackathon Contributor)',
    company: 'AutoOverlay AI (Alpaca AI Trading Hackathon)',
    date_start: '2026-08-01',
    date_end: '2026-09-04',
    work_type: 'Remote',
    description: 'Architected a 4-layer autonomous options risk engine featuring Monte Carlo Merton Jump Diffusion simulations, a 6-persona investor council, pre-trade kill-switches, and deterministic mid-price limit order execution.',
  },
  {
    role: 'Project Manager & AI Agent Architect',
    company: 'LifeOS Agent (AI HACKFEST 2026 - IDwebhost x AICLUB.ID)',
    date_start: '2026-08-15',
    date_end: '2026-10-01',
    work_type: 'Remote',
    description: 'Leading a 3-person squad in developing an autonomous personal productivity and life management agent leveraging Hermes Agent and OpenClaw on CloudBaik VPS infrastructure.',
  },
  {
    role: 'AI Engineer Intensive Program Scholar (Full Graduate)',
    company: 'Pijak x IBM SkillsBuild',
    date_start: '2026-02-01',
    date_end: '2026-07-31',
    work_type: 'Remote',
    description: 'Selected through a competitive national process for a full scholarship in the Pijak x IBM SkillsBuild AI Engineer Cohort. Completed intensive end-to-end ML/DL curriculum, prompt engineering, and soft skills with official Full Graduation certification.',
  },
  {
    role: 'Freelance NFT & Digital Illustration Artist',
    company: 'Self-Employed (Global Clients)',
    date_start: '2020-12-01',
    date_end: '2024-10-31',
    work_type: 'Remote',
    description: 'Delivered 60+ custom commercial NFT illustrations for FlokyApe collection, 30+ layered traits inspired by Azuki anime aesthetics, and 20+ vector/vexel portraits before transitioning full-time to AI/ML engineering.',
  },
];

export const LATEST_CV_PROJECTS = [
  {
    id_string: 'ai-0',
    title_en: 'AutoOverlay AI: Autonomous Options Alpha & Risk Engine',
    title_id: 'AutoOverlay AI: Mesin Alpha & Manajemen Risiko Opsi Mandiri',
    description_en: 'Institutional-grade options trading engine with Monte Carlo Merton Jump Diffusion VaR, 6-persona council, pre-trade kill-switches, and deterministic execution for Alpaca AI Hackathon.',
    description_id: 'Mesin trading opsi mandiri dengan simulasi Monte Carlo Merton Jump Diffusion VaR, konsensus 6 persona investor, pre-trade kill-switch, dan eksekusi limit order deterministik.',
    file: 'https://github.com/zmdinata/autooverlay-ai',
    category: 'data',
    type: 'link',
    is_featured: true,
    featured_order: 1,
    tech_stack: ['Python', 'FastAPI', 'Monte Carlo VaR', 'Alpaca API', 'SQLite WAL', 'Pytest'],
  },
  {
    id_string: 'ai-1',
    title_en: 'Agent-Z Homelab: AI Agent Orchestrator',
    title_id: 'Agent-Z Homelab: Orkestrator Agen AI Mandiri',
    description_en: 'Self-hosted AI agentic orchestrator on ThinkPad T440 running Hermes Agent, OpenClaw, and n8n with continuous telemetry and 9Router LLM failover.',
    description_id: 'Sistem orkestrator agen AI mandiri di ThinkPad T440 menggunakan Hermes Agent, OpenClaw, dan n8n dengan telemetri real-time serta fallback 9Router.',
    file: 'https://github.com/zmdinata',
    category: 'data',
    type: 'link',
    is_featured: true,
    featured_order: 2,
    tech_stack: ['Hermes Agent', 'OpenClaw', 'n8n', 'Linux (T440)', 'PM2', 'Docker'],
  },
  {
    id_string: 'ai-2',
    title_en: 'LestariRimba: AI-Powered Sustainability Platform',
    title_id: 'LestariRimba: Platform AI Keberlanjutan Lingkungan',
    description_en: 'Cloud Run deployed environmental sustainability platform with AI vision and forest conservation analysis (#JuaraVibeCoding).',
    description_id: 'Platform keberlanjutan lingkungan berbasis AI yang dideploy di Google Cloud Run dengan analisis AI vision dan konservasi hutan (#JuaraVibeCoding).',
    file: 'https://lestari-rimba-661373468998.asia-southeast2.run.app/',
    category: 'web',
    type: 'link',
    is_featured: true,
    featured_order: 3,
    tech_stack: ['Google Cloud Run', 'FastAPI', 'Gemini API', 'Python'],
  },
  {
    id_string: 'ai-3',
    title_en: 'Flight Ticket Price Prediction with Multiple Linear Regression',
    title_id: 'Prediksi Harga Tiket Penerbangan (Multiple Linear Regression)',
    description_en: 'Published research paper on flight ticket price forecasting using Multiple Linear Regression in SISFOTEK Journal (116K+ records).',
    description_id: 'Publikasi penelitian prediksi harga tiket pesawat menggunakan regresi linier berganda pada Jurnal SISFOTEK (116K+ data).',
    file: 'https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
    category: 'data',
    type: 'link',
    is_featured: false,
    featured_order: null,
    tech_stack: ['Python', 'Multiple Linear Regression', 'Scikit-learn', 'Pandas'],
  },
  {
    id_string: 'ai-amd',
    title_en: 'A2Z Agentz: Autonomous Web3 Airdrop Intelligence (AMD Hackathon)',
    title_id: 'A2Z Agentz: Agen Intelijen Airdrop Web3 Mandiri (AMD Hackathon)',
    description_en: 'Autonomous multi-agent platform for discovering and automating Web3 airdrop opportunities with on-chain Agent-to-Agent (A2A) payments on Base Network (AMD ROCm & Llama 3.1).',
    description_id: 'Platform multi-agen mandiri untuk riset dan otomasi airdrop Web3 dengan transaksi on-chain Agent-to-Agent (A2A) di Base Network (AMD ROCm & Llama 3.1).',
    file: 'https://lablab.ai/event/amd-developer-hackathon-act-ii',
    category: 'web3',
    type: 'link',
    is_featured: false,
    featured_order: null,
    tech_stack: ['AMD ROCm', 'Llama 3.1', 'DeepSeek V3', 'React', 'Base Network (A2A)'],
  },
];

export const LATEST_CV_SKILLS = [
  { name: 'Autonomous Multi-Agent Systems', category: 'ai', level: 'Advanced', description: 'Hermes Agent, OpenClaw, Sub-Agent Delegation, Multi-Persona Consensus, Tool Calling' },
  { name: 'Quantitative Risk & Modeling', category: 'data', level: 'Advanced', description: 'Monte Carlo Simulation (Merton Jump Diffusion), VaR 95%, Sortino Ratio, Regression Models' },
  { name: 'Workflow Automation & Pipelines', category: 'automation', level: 'Advanced', description: 'n8n Enterprise Automation, Webhook Routers, Python Automation, Systemd/PM2 Supervision' },
  { name: 'Cloud, DevOps & Homelab', category: 'devops', level: 'Intermediate', description: 'Linux Homelab (ThinkPad T440), Google Cloud Run, Supabase, Docker, SQLite WAL, Git/GitHub CLI' },
  { name: 'Web & Interactive Frontend', category: 'web', level: 'Intermediate', description: 'React 19, Vite, Tailwind CSS, Framer Motion, REST APIs' },
  { name: 'Digital Art & Asset Design', category: 'design', level: 'Advanced', description: 'Adobe Photoshop, Vector/Vexel Art, NFT Layered Trait Architecture, UI/UX Prototyping' },
];

export const FULL_MIGRATION_SQL = `-- =========================================================
-- SQL Migration Script: Sinkronisasi CV & Portofolio 2026
-- Zacky Muhammad Dinata (ZMDinata)
-- Jalankan skrip ini langsung di Supabase Dashboard > SQL Editor
-- =========================================================

-- 1. UPDATE PROFILE
UPDATE public.profile
SET 
  hero_description_en = 'AI Engineer & Autonomous Agent Architect | Quantitative Risk Systems & LLM Automation | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id = 'AI Engineer & Arsitek Agen Mandiri | Sistem Risiko Kuantitatif & Otomasi LLM | Lulusan Beasiswa Penuh Pijak x IBM SkillsBuild',
  about_description_en = 'Results-driven AI Engineer & ML Researcher specializing in Autonomous Multi-Agent Orchestration (Hermes Agent, OpenClaw, n8n) and Quantitative Risk Management. Full Scholarship Graduate of the PIJAK x IBM SkillsBuild AI Engineer Cohort. I design explainable agentic workflows, autonomous homelab infrastructure, and deterministic risk layers for algorithmic execution.',
  about_description_id = 'AI Engineer & Peneliti ML yang berfokus pada Orkestrasi Multi-Agent Mandiri (Hermes Agent, OpenClaw, n8n) dan Manajemen Risiko Kuantitatif. Lulusan Beasiswa Penuh Program Beasiswa AI Engineer PIJAK x IBM SkillsBuild. Saya merancang alur kerja agen cerdas yang dapat diaudit, infrastruktur homelab mandiri, serta lapisan risiko deterministik untuk eksekusi algoritma.',
  available_for_hire = true,
  updated_at = NOW()
WHERE id = 1;

-- 2. UPDATE PENDIDIKAN & PRESTASI
UPDATE public.education
SET 
  degree = 'Bachelor of Information Systems',
  major = 'Information Systems',
  grade_type = 'IPK',
  grade_value = '3.55',
  date_start = '2024-10-01',
  date_end = '2028-10-01',
  description_en = 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (Es Krim Jamu). Participant in AMD Hackathon ACT II, Alpaca AI Trading Hackathon, and AI HACKFEST 2026.',
  description_id = 'Medali Perunggu, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025) di Universitas Negeri Yogyakarta (Es Krim Jamu). Partisipan di AMD Hackathon ACT II, Alpaca AI Trading Hackathon, dan AI HACKFEST 2026.',
  updated_at = NOW()
WHERE school ILIKE '%IKMI%' OR id = 1;

-- 3. UPSERT PENGALAMAN KERJA 2026
INSERT INTO public.experience (
  company_en, company_id, role_en, role_id, date_start, date_end, description_en, description_id, sort_order
) VALUES 
  (
    'AutoOverlay AI (Alpaca AI Hackathon)',
    'AutoOverlay AI (Alpaca AI Hackathon)',
    'AI Engineer & Quant Lead (Hackathon Contributor)',
    'AI Engineer & Quant Lead (Kontributor Hackathon)',
    '2026-08-01',
    '2026-09-04',
    'Architected an autonomous 4-layer options trading engine with Monte Carlo Merton Jump Diffusion VaR and 6-persona investor council.',
    'Merancang arsitektur 4-layer mesin trading opsi mandiri dengan simulasi Monte Carlo Merton Jump Diffusion VaR dan konsensus 6 persona investor.',
    1
  ),
  (
    'LifeOS Agent (AI HACKFEST 2026)',
    'LifeOS Agent (AI HACKFEST 2026)',
    'Project Manager & AI Agent Architect',
    'Project Manager & Arsitek Agen AI',
    '2026-08-15',
    '2026-10-01',
    'Leading a 3-person squad in developing an autonomous personal productivity and life management agent leveraging Hermes Agent and OpenClaw on CloudBaik VPS.',
    'Memimpin tim 3 orang membangun agen produktivitas dan manajemen hidup otonom menggunakan Hermes Agent dan OpenClaw di VPS CloudBaik.',
    2
  ),
  (
    'Pijak x IBM SkillsBuild',
    'Pijak x IBM SkillsBuild',
    'AI Engineer Intensive Program Scholar (Full Graduate)',
    'Scholar Program Intensif AI Engineer (Lulus Penuh)',
    '2026-02-01',
    '2026-07-31',
    'Full scholarship graduate across end-to-end Machine Learning, Deep Learning, and Soft Skills curriculum with official Full Graduation credentials.',
    'Lulusan beasiswa penuh kurikulum Machine Learning, Deep Learning, dan Soft Skills end-to-end dengan sertifikasi Kelulusan Penuh resmi.',
    3
  ),
  (
    'Self-Employed (Global Clients)',
    'Mandiri (Klien Global)',
    'Freelance NFT & Digital Illustration Artist',
    'Artis NFT & Ilustrasi Digital Lepas',
    '2020-12-01',
    '2024-10-31',
    'Delivered 60+ commercial NFT artworks for FlokyApe and 30+ layered anime traits before career pivoting full-time to AI/ML engineering.',
    'Menyelesaikan 60+ karya seni NFT komersial FlokyApe dan 30+ trait modular anime sebelum beralih karier penuh ke AI/ML.',
    4
  )
ON CONFLICT DO NOTHING;

-- 4. RESET DAN UPDATE 3 PROYEK UNGGULAN (AutoOverlay AI, Agent-Z Homelab, LestariRimba)
UPDATE public.projects SET is_featured = false, featured_order = null;

-- Proyek 1: AutoOverlay AI
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-0',
  'static:ai-0',
  'data',
  'AutoOverlay AI: Autonomous Options Alpha & Risk Engine',
  'AutoOverlay AI: Mesin Alpha & Manajemen Risiko Opsi Mandiri',
  'https://github.com/zmdinata/autooverlay-ai',
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

-- Proyek 2: Agent-Z Homelab
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-1',
  'static:ai-1',
  'data',
  'Agent-Z Homelab: AI Agent Orchestrator',
  'Agent-Z Homelab: Orkestrator Agen AI Mandiri',
  'https://github.com/zmdinata',
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

-- Proyek 3: LestariRimba Cloud Run
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES (
  'ai-2',
  'static:ai-2',
  'web',
  'LestariRimba: AI-Powered Sustainability Platform',
  'LestariRimba: Platform AI Keberlanjutan Lingkungan',
  'https://lestari-rimba-661373468998.asia-southeast2.run.app/',
  '/assets/images/preview.png',
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

-- Masukkan juga Proyek Tambahan 2026 ke katalog umum (non-featured)
INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES 
  (
    'ai-3',
    'static:ai-3',
    'data',
    'Flight Ticket Price Prediction with Multiple Linear Regression',
    'Prediksi Harga Tiket Penerbangan (Multiple Linear Regression)',
    'https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
    '/assets/projects/Data/data1.png',
    'link',
    false,
    null,
    4
  ),
  (
    'ai-amd',
    'static:ai-amd',
    'web3',
    'A2Z Agentz: Autonomous Web3 Airdrop Intelligence (AMD Hackathon)',
    'A2Z Agentz: Agen Intelijen Airdrop Web3 Mandiri (AMD Hackathon)',
    'https://lablab.ai/event/amd-developer-hackathon-act-ii',
    '/assets/images/preview.png',
    'link',
    false,
    null,
    5
  )
ON CONFLICT (id_string) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_id = EXCLUDED.title_id,
  file = EXCLUDED.file;
`;
