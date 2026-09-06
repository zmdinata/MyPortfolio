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
  hero_description_en: 'AI Engineer & Autonomous Agent Architect | Research & Quantitative Risk Systems | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id: 'AI Engineer & Arsitek Agen Mandiri | Riset & Sistem Risiko Kuantitatif | Scholar Pijak x IBM SkillsBuild',
  about_description_en: 'Results-driven AI Engineer & ML Researcher specializing in Autonomous Multi-Agent Orchestration (Hermes Agent, OpenClaw, n8n) and Quantitative Risk Management. Full Scholarship Graduate of the PIJAK x IBM SkillsBuild AI Engineer Cohort. I design explainable agentic workflows, autonomous homelab infrastructure, and deterministic risk layers for algorithmic execution.',
  about_description_id: 'AI Engineer & Peneliti ML yang berfokus pada Orkestrasi Multi-Agent Mandiri (Hermes Agent, OpenClaw, n8n) dan Manajemen Risiko Kuantitatif. Lulusan Beasiswa Penuh Program Beasiswa AI Engineer PIJAK x IBM SkillsBuild. Saya merancang alur kerja agen cerdas yang dapat diaudit, infrastruktur homelab mandiri, serta lapisan risiko deterministik untuk eksekusi algoritma.',
};

export const LATEST_CV_EDUCATION = [
  {
    school: 'STMIK IKMI Cirebon',
    degree: "Bachelor's Degree",
    major: 'Information Systems',
    gpa: '3.55 / 4.00',
    date_start: '2024-10-01',
    date_end: '2028-10-01',
    achievements: 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (Es Krim Jamu). Finalist & Participant in AI Hackathons (AMD Act II, Alpaca AI Trading, AI HACKFEST 2026).',
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
    title_en: 'Agent-Z Homelab: Autonomous Agent Orchestrator',
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
    id_string: 'ai-amd',
    title_en: 'A2Z Agentz: Autonomous Web3 Airdrop Intelligence (AMD Hackathon)',
    title_id: 'A2Z Agentz: Agen Intelijen Airdrop Web3 Mandiri (AMD Hackathon)',
    description_en: 'Autonomous multi-agent platform for discovering and automating Web3 airdrop opportunities with on-chain Agent-to-Agent (A2A) payments on Base Network (AMD ROCm & Llama 3.1).',
    description_id: 'Platform multi-agen mandiri untuk riset dan otomasi airdrop Web3 dengan transaksi on-chain Agent-to-Agent (A2A) di Base Network (AMD ROCm & Llama 3.1).',
    file: 'https://lablab.ai/event/amd-developer-hackathon-act-ii',
    category: 'web3',
    type: 'link',
    is_featured: true,
    featured_order: 3,
    tech_stack: ['AMD ROCm', 'Llama 3.1', 'DeepSeek V3', 'React', 'Base Network (A2A)'],
  },
  {
    id_string: 'ai-2',
    title_en: 'LestariRimba: AI Sustainability Platform',
    title_id: 'LestariRimba: Platform AI Keberlanjutan Lingkungan',
    description_en: 'Cloud Run deployed environmental sustainability platform with AI vision and forest conservation analysis (#JuaraVibeCoding).',
    description_id: 'Platform keberlanjutan lingkungan berbasis AI yang dideploy di Google Cloud Run dengan analisis AI vision dan konservasi hutan (#JuaraVibeCoding).',
    file: 'https://lestari-rimba-661373468998.asia-southeast2.run.app/',
    category: 'web',
    type: 'link',
    is_featured: false,
    featured_order: null,
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
];

export const LATEST_CV_SKILLS = [
  { name: 'Autonomous Multi-Agent Systems', category: 'ai', level: 'Advanced', description: 'Hermes Agent, OpenClaw, Sub-Agent Delegation, Multi-Persona Consensus, Tool Calling' },
  { name: 'Quantitative Risk & Modeling', category: 'data', level: 'Advanced', description: 'Monte Carlo Simulation (Merton Jump Diffusion), VaR 95%, Sortino Ratio, Regression Models' },
  { name: 'Workflow Automation & Pipelines', category: 'automation', level: 'Advanced', description: 'n8n Enterprise Automation, Webhook Routers, Python Automation, Systemd/PM2 Supervision' },
  { name: 'Cloud, DevOps & Homelab', category: 'devops', level: 'Intermediate', description: 'Linux Homelab (ThinkPad T440), Google Cloud Run, Supabase, Docker, SQLite WAL, Git/GitHub CLI' },
  { name: 'Web & Interactive Frontend', category: 'web', level: 'Intermediate', description: 'React 19, Vite, Tailwind CSS, Framer Motion, REST APIs' },
  { name: 'Digital Art & Asset Design', category: 'design', level: 'Advanced', description: 'Adobe Photoshop, Vector/Vexel Art, NFT Layered Trait Architecture, UI/UX Prototyping' },
];

export const FULL_MIGRATION_SQL = `-- SQL Migration Script
UPDATE public.profile
SET 
  hero_description_en = 'AI Engineer & Autonomous Agent Architect | Research & Quantitative Risk Systems | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id = 'AI Engineer & Arsitek Agen Mandiri | Riset & Sistem Risiko Kuantitatif | Scholar Pijak x IBM SkillsBuild',
  about_description_en = 'Results-driven AI Engineer & ML Researcher specializing in Autonomous Multi-Agent Orchestration (Hermes Agent, OpenClaw, n8n) and Quantitative Risk Management. Full Scholarship Graduate of the PIJAK x IBM SkillsBuild AI Engineer Cohort.',
  about_description_id = 'AI Engineer & Peneliti ML yang berfokus pada Orkestrasi Multi-Agent Mandiri (Hermes Agent, OpenClaw, n8n) dan Manajemen Risiko Kuantitatif. Lulusan Beasiswa Penuh Program Beasiswa AI Engineer PIJAK x IBM SkillsBuild.',
  available_for_hire = true,
  updated_at = NOW()
WHERE id = 1;
`;
