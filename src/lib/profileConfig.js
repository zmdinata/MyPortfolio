import { supabase } from './supabase';

export const DEFAULT_PROFILE_CONFIG = {
  avatar_url: '/assets/images/photo.png',
  cover_url: 'https://iixsejoqecilicxvmjty.supabase.co/storage/v1/object/public/portfolio-media/profile/covers/1792276904902-cover_1792276904820.webp',
  full_name: 'Zacky Muhammad Dinata',
  hero_role: 'AI Engineer & Multi-Agent Architect',
  email: 'zmdinata@gmail.com',
  chips: ['PyTorch', 'LLMs & RAG', 'Computer Vision', 'Fullstack'],
  languages: {
    id: 'Indonesian (Native)',
    en: 'English (Professional Working)',
  },
  core_architecture_en: 'Sovereign RAG, Autonomous Swarms, Deterministic Tool Gates',
  core_architecture_id: 'Sovereign RAG, Agen Mandiri, Evaluasi Tool Deterministik',
  production_standard_en: 'Sub-second latency (<1.2s), continuous homelab telemetry',
  production_standard_id: 'Latensi sub-detik (<1.2s), pemantauan telemetri homelab kontinu',
  agentz_prompts: [
    {
      text_id: 'Ceritakan proyek Agent-Z Homelab di ThinkPad T440',
      text_en: 'Tell me about Agent-Z Homelab on ThinkPad T440',
    },
    {
      text_id: 'Bagaimana riset prediksi harga tiket di SISFOTEK?',
      text_en: 'How was the flight price prediction research done at SISFOTEK?',
    },
    {
      text_id: 'Apa itu proyek LestariRimba & RimbaPulse AI?',
      text_en: 'What is LestariRimba & RimbaPulse AI prototype?',
    },
  ],
  specialization_decks: [
    {
      id: 'llm',
      tabLabel: 'LLM & Agents',
      icon: 'cpu',
      color: '#00d2ff',
      badge: 'ThinkPad T440 Homelab',
      title: 'Agent-Z Autonomous Orchestrator',
      metric: '3 Agents Running • Nous Hermes & OpenClaw',
      desc: 'Sistem agen AI mandiri self-hosted dengan integrasi multi-agent routing (9Router) dan telemetri kontinu.',
      descEn: 'Self-hosted autonomous AI agent orchestrator with multi-agent routing (9Router) and continuous telemetry.',
      stack: ['Hermes Agent', 'OpenClaw', 'n8n', 'Gemini API', 'Docker'],
      link: 'https://github.com/zmdinata',
    },
    {
      id: 'workflow',
      tabLabel: 'Workflow & Cloud',
      icon: 'zap',
      color: '#2ed573',
      badge: 'Google Cloud Run',
      title: 'LestariRimba #JuaraVibeCoding',
      metric: 'Cloud Run Production • RimbaPulse AI',
      desc: 'Prototipe AI keberlanjutan hutan berbasis FastAPI & Gemini Vision yang dideploy pada Google Cloud Run.',
      descEn: 'Cloud Run production environmental sustainability AI platform powered by FastAPI & Gemini Vision.',
      stack: ['Google Cloud Run', 'FastAPI', 'Gemini API', 'n8n Pipelines', 'Python'],
      link: 'https://lestari-rimba-661373468998.asia-southeast2.run.app/',
    },
    {
      id: 'ml',
      tabLabel: 'ML & Research',
      icon: 'activity',
      color: '#a55eea',
      badge: 'Makalah SISFOTEK 9',
      title: 'Flight Ticket Price Prediction (MLR)',
      metric: '116K+ Records • Multiple Linear Regression',
      desc: 'Penelitian forecasting harga tiket penerbangan berakurasi tinggi yang dipublikasikan di jurnal nasional terakreditasi.',
      descEn: 'High-accuracy flight ticket price prediction research published in accredited national academic journal.',
      stack: ['Multiple Linear Regression', 'Scikit-Learn', 'Pandas', 'SQL', 'Seaborn'],
      link: 'https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
    },
  ],
};

const STORAGE_KEY = 'portfolio_profile_config';

export function getLocalProfileConfig() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const decks = (parsed.specialization_decks || DEFAULT_PROFILE_CONFIG.specialization_decks).map((d, i) => {
        const fallback = DEFAULT_PROFILE_CONFIG.specialization_decks[i] || {};
        return {
          ...fallback,
          ...d,
          icon: d.icon || fallback.icon || (d.id === 'workflow' ? 'zap' : d.id === 'ml' ? 'activity' : 'cpu'),
        };
      });

      return {
        ...DEFAULT_PROFILE_CONFIG,
        ...parsed,
        languages: {
          ...DEFAULT_PROFILE_CONFIG.languages,
          ...(parsed.languages || {}),
        },
        agentz_prompts: Array.isArray(parsed.agentz_prompts) && parsed.agentz_prompts.length > 0
          ? parsed.agentz_prompts
          : DEFAULT_PROFILE_CONFIG.agentz_prompts,
        specialization_decks: decks,
        chips: parsed.chips || DEFAULT_PROFILE_CONFIG.chips,
        cover_url: parsed.cover_url || DEFAULT_PROFILE_CONFIG.cover_url,
      };
    }
  } catch (err) {
    console.warn('Error reading local profile config:', err);
  }
  return DEFAULT_PROFILE_CONFIG;
}

export function saveLocalProfileConfig(config) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: config }));
    }
  } catch (err) {
    console.warn('Error saving local profile config:', err);
  }
}

export async function fetchFullProfile() {
  const localConfig = getLocalProfileConfig();

  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      return {
        ...localConfig,
        available_for_hire: data.available_for_hire ?? true,
        hero_description_en: data.hero_description_en || '',
        hero_description_id: data.hero_description_id || '',
        about_description_en: data.about_description_en || '',
        about_description_id: data.about_description_id || '',
        avatar_url: data.avatar_url || localConfig.avatar_url,
        cover_url: data.cover_url || localConfig.cover_url || DEFAULT_PROFILE_CONFIG.cover_url,
        full_name: data.full_name || localConfig.full_name,
        hero_role: data.hero_role || localConfig.hero_role,
        email: data.email || localConfig.email,
        chips: data.chips || localConfig.chips,
        languages: data.languages || localConfig.languages,
        core_architecture_en: data.core_architecture_en || localConfig.core_architecture_en || DEFAULT_PROFILE_CONFIG.core_architecture_en,
        core_architecture_id: data.core_architecture_id || localConfig.core_architecture_id || DEFAULT_PROFILE_CONFIG.core_architecture_id,
        production_standard_en: data.production_standard_en || localConfig.production_standard_en || DEFAULT_PROFILE_CONFIG.production_standard_en,
        production_standard_id: data.production_standard_id || localConfig.production_standard_id || DEFAULT_PROFILE_CONFIG.production_standard_id,
        agentz_prompts: Array.isArray(data.agentz_prompts) && data.agentz_prompts.length > 0
          ? data.agentz_prompts
          : localConfig.agentz_prompts,
        specialization_decks: data.specialization_decks || localConfig.specialization_decks,
      };
    }
  } catch (err) {
    console.warn('Supabase fetch full profile fallback active:', err);
  }

  return localConfig;
}

export const PROFILE_SQL_MIGRATION = `-- Tambahkan kolom konfigurasi Profile interaktif ke tabel public.profile di Supabase
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS hero_role TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS chips JSONB;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS languages JSONB;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS core_architecture_en TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS core_architecture_id TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS production_standard_en TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS production_standard_id TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS agentz_prompts JSONB;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS specialization_decks JSONB;
`;
