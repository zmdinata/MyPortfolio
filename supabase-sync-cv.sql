-- =========================================================
-- SQL Migration Script: Sinkronisasi CV & Portofolio Zacky Muhammad Dinata (2026)
-- Jalankan skrip ini langsung di Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- 1. UPDATE PROFILE
UPDATE public.profile
SET 
  hero_description_en = 'AI Engineer & Autonomous Agent Architect | Research & Quantitative Risk Systems | Scholar at Pijak x IBM SkillsBuild',
  hero_description_id = 'AI Engineer & Arsitek Agen Mandiri | Riset & Sistem Risiko Kuantitatif | Scholar Pijak x IBM SkillsBuild',
  about_description_en = 'Results-driven AI Engineer & ML Researcher specializing in Autonomous Multi-Agent Orchestration (Hermes Agent, OpenClaw, n8n) and Quantitative Risk Management. Full Scholarship Graduate of the PIJAK in Collaboration with IBM SkillsBuild AI Intensive Program. I specialize in architecting explainable agentic workflows, deterministic options trading risk layers (Monte Carlo Merton Jump Diffusion VaR), and autonomous homelab infrastructure.',
  about_description_id = 'AI Engineer & Peneliti ML yang berfokus pada Orkestrasi Multi-Agent Mandiri (Hermes Agent, OpenClaw, n8n) dan Manajemen Risiko Kuantitatif. Lulusan Beasiswa Penuh Program Beasiswa AI Engineer PIJAK x IBM SkillsBuild. Saya berdedikasi membangun alur kerja agen cerdas yang dapat diaudit, lapisan manajemen risiko opsi trading deterministik (Monte Carlo Merton Jump Diffusion VaR), serta infrastruktur server homelab mandiri.',
  available_for_hire = true,
  updated_at = NOW()
WHERE id = 1;

-- 2. UPDATE EDUCATION (STMIK IKMI Cirebon)
UPDATE public.education
SET 
  degree = 'Bachelor of Information Systems',
  major = 'Information Systems',
  gpa = '3.55 / 4.00',
  description_en = 'Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta. Finalist/Participant in AMD Hackathon ACT II, Alpaca AI Trading, and AI HACKFEST 2026.',
  description_id = 'Medali Perunggu, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025) di Universitas Negeri Yogyakarta. Partisipan di AMD Hackathon ACT II, Alpaca AI Trading, dan AI HACKFEST 2026.',
  updated_at = NOW()
WHERE school ILIKE '%IKMI%' OR id = 1;

-- 3. UPSERT EXPERIENCE (Alpaca Hackathon, AI HACKFEST, Pijak x IBM & Freelance)
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

-- 4. INSERT OR UPDATE FEATURED PROJECTS
UPDATE public.projects SET is_featured = false, featured_order = null;

INSERT INTO public.projects (
  id_string, source_key, category, title_en, title_id, file, preview, type, is_featured, featured_order, sort_order
) VALUES 
  (
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
  ),
  (
    'ai-1',
    'static:ai-1',
    'data',
    'Agent-Z Homelab: AI Agent Orchestrator',
    'Agent-Z Homelab: Orkestrasi Agen AI Mandiri',
    'https://github.com/zmdinata',
    '/assets/images/preview.png',
    'link',
    true,
    2,
    2
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
    true,
    3,
    3
  )
ON CONFLICT (id_string) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_id = EXCLUDED.title_id,
  file = EXCLUDED.file,
  is_featured = EXCLUDED.is_featured,
  featured_order = EXCLUDED.featured_order;
