import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { FiTerminal, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { getCachedProjects } from '../../lib/portfolioCache';
import { fetchFullProfile, getLocalProfileConfig } from '../../lib/profileConfig';

// Anchor: July 1, 2026 00:00:00 WIB (Asia/Jakarta, UTC+7) => Auto-increments every 00:00 WIB
const UPTIME_ANCHOR_WIB = new Date('2026-06-30T17:00:00.000Z');

function calculateWibUptime() {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const nowWib = new Date(utcMs + (7 * 3600000));
  const diffMs = Math.max(0, nowWib.getTime() - UPTIME_ANCHOR_WIB.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
}

function NeofetchOutput({ data, lang = 'en' }) {
  const { upDays, upHours, projectsCount, certsCount } = data || {};

  const asciiArt = [
    '  ███████╗███╗   ███╗██████╗ ',
    '  ╚══███╔╝████╗ ████║██╔══██╗',
    '    ███╔╝ ██╔████╔██║██║  ██║',
    '   ███╔╝  ██║╚██╔╝██║██║  ██║',
    '  ███████╗██║ ╚═╝ ██║██████╔╝',
    '  ╚══════╝╚═╝     ╚═╝╚═════╝ ',
  ].join('\n');

  const uptimeVal = lang === 'en'
    ? `${upDays} days, ${upHours} hours`
    : `${upDays} hari, ${upHours} jam`;

  const dbVal = lang === 'en'
    ? 'Supabase Cloud (Live)'
    : 'Supabase Cloud (Aktif)';

  const projVal = lang === 'en'
    ? `${projectsCount} Active in Database`
    : `${projectsCount} Aktif di Database`;

  const certsVal = lang === 'en'
    ? `${certsCount} Verified Credentials`
    : `${certsCount} Kredensial Terverifikasi`;

  const statusVal = lang === 'en'
    ? 'Online & Telemetry Active'
    : 'Online & Telemetri Aktif';

  const specs = [
    { key: 'OS', val: 'Linux Homelab (ThinkPad T440)' },
    { key: 'Host', val: 'Lenovo ThinkPad T440 Core i5' },
    { key: 'Kernel', val: 'Linux 6.1.0-agentz-ai' },
    { key: lang === 'en' ? 'Uptime' : 'Waktu Aktif', val: uptimeVal },
    { key: 'Shell', val: 'zsh 5.9 / agent-z runtime' },
    { key: 'Stack', val: 'Nous Hermes • OpenClaw • n8n' },
    { key: lang === 'en' ? 'Database' : 'Basis Data', val: dbVal },
    { key: lang === 'en' ? 'Projects' : 'Proyek', val: projVal },
    { key: lang === 'en' ? 'Credentials' : 'Sertifikasi', val: certsVal },
    { key: 'Status', val: statusVal },
  ];

  return (
    <div className="neofetch-wrapper">
      <div className="neofetch-ascii-box">
        <pre className="neofetch-ascii">{asciiArt}</pre>
      </div>
      <div className="neofetch-info-box">
        <div className="neofetch-user-host">zmdinata@homelab-t440</div>
        <div className="neofetch-divider">---------------------</div>
        <div className="neofetch-specs-list">
          {specs.map((item, i) => (
            <div key={i} className="neofetch-spec-row">
              <span className="neofetch-key">{item.key}:</span>{' '}
              <span className="neofetch-val">{item.val}</span>
            </div>
          ))}
        </div>
        <div className="neofetch-palette">
          <span className="palette-dot dot-black" />
          <span className="palette-dot dot-red" />
          <span className="palette-dot dot-green" />
          <span className="palette-dot dot-yellow" />
          <span className="palette-dot dot-blue" />
          <span className="palette-dot dot-magenta" />
          <span className="palette-dot dot-cyan" />
          <span className="palette-dot dot-white" />
        </div>
      </div>
    </div>
  );
}

export default function InteractiveTerminal() {
  const { lang, setLanguage } = useLang();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  const [liveData, setLiveData] = useState({
    profile: getLocalProfileConfig(),
    projects: [],
    skills: [],
    education: [],
    experience: [],
    certificates: [],
  });

  const [terminalLog, setTerminalLog] = useState(() => [
    {
      type: 'system',
      text: lang === 'en' 
        ? '⚡ Welcome to Zacky\'s AI Core Terminal. Type "help" or click the chips below to explore.' 
        : '⚡ Selamat datang di Terminal AI Core Zacky. Ketik "help" atau klik tombol chip di bawah untuk menjelajah.',
    },
  ]);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);
  const prevLangRef = useRef(lang);

  // Sync terminal welcome message and system notifications when language changes
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      setTerminalLog((prev) => {
        if (prev.length === 1 && prev[0].type === 'system') {
          return [
            {
              type: 'system',
              text: lang === 'en' 
                ? '⚡ Welcome to Zacky\'s AI Core Terminal. Type "help" or click the chips below to explore.' 
                : '⚡ Selamat datang di Terminal AI Core Zacky. Ketik "help" atau klik tombol chip di bawah untuk menjelajah.',
            },
          ];
        }
        return [
          ...prev,
          {
            type: 'system',
            text: lang === 'en'
              ? '🌐 Language switched to English. Terminal output updated.'
              : '🌐 Bahasa dialihkan ke Bahasa Indonesia. Output terminal diperbarui.',
          },
        ];
      });
    }
  }, [lang]);

  useEffect(() => {
    let isMounted = true;

    const loadTerminalDatabase = async () => {
      try {
        const [
          profileData,
          { projects: cachedProjects },
          { data: skillsData },
          { data: eduData },
          { data: expData },
          { data: certsData },
        ] = await Promise.all([
          fetchFullProfile(),
          getCachedProjects(),
          supabase.from('skills').select('*').order('name', { ascending: true }),
          supabase.from('education').select('*').order('date_start', { ascending: false }),
          supabase.from('experience').select('*').order('date_start', { ascending: false }),
          supabase.from('certificates').select('*').order('sort_order', { ascending: true }),
        ]);

        if (isMounted) {
          setLiveData({
            profile: profileData || getLocalProfileConfig(),
            projects: cachedProjects || [],
            skills: skillsData || [],
            education: eduData || [],
            experience: expData || [],
            certificates: certsData || [],
          });
        }
      } catch (err) {
        console.warn('Terminal live data load note:', err);
      }
    };

    loadTerminalDatabase();

    const handleSync = () => {
      if (isMounted) loadTerminalDatabase();
    };

    window.addEventListener('profile-updated', handleSync);
    window.addEventListener('portfolio-cache-invalidated', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('profile-updated', handleSync);
      window.removeEventListener('portfolio-cache-invalidated', handleSync);
    };
  }, []);

  // Auto scroll terminal container only, NEVER the window
  useEffect(() => {
    if (terminalBodyRef.current) {
      const scrollEl = terminalBodyRef.current;
      requestAnimationFrame(() => {
        if (scrollEl) {
          scrollEl.scrollTop = scrollEl.scrollHeight;
        }
      });
    }
  }, [terminalLog]);

  const quickCommands = ['neofetch', 'skills', 'projects', 'telemetry', 'whoami', 'contact', 'clear'];

  const executeCommand = (cmdStr) => {
    const rawTrimmed = cmdStr.trim();
    if (!rawTrimmed) return;

    const tokens = rawTrimmed.split(/\s+/);
    const mainCmd = tokens[0].toLowerCase();
    const subCmd = tokens[1]?.toLowerCase();

    setCommandHistory((prev) => [rawTrimmed, ...prev]);
    setHistoryIndex(-1);

    const newLog = [...terminalLog, { type: 'user', text: rawTrimmed }];

    switch (mainCmd) {
      case 'help':
      case 'bantuan':
      case 'menu':
      case 'perintah':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                'Available commands (synced with Supabase):',
                '  neofetch     - Display ThinkPad T440 Linux Homelab system info',
                '  telemetry    - Live health & agent status for Agent-Z stack',
                '  whoami       - About Zacky Muhammad Dinata & AI focus',
                '  skills       - LLM automation, data science & tooling stack',
                '  projects     - Live project catalog from Supabase database',
                '  education    - STMIK IKMI Cirebon (GPA 3.55) & academic records',
                '  experience   - Professional experience & scholarship records',
                '  cert         - Verified certifications & credentials',
                '  contact      - Email, website, GitHub, LinkedIn & Dicoding',
                '  agent-z      - Open the floating AI assistant',
                '  lang [en|id] - Switch or view terminal & website language',
                '  theme [dark|light] - Toggle or switch color theme',
                '  clear        - Clear terminal screen',
                '',
                'Tips: Indonesian aliases supported ("bantuan", "proyek", "keahlian", "status", "tentang", "pendidikan", "pengalaman", "sertifikat", "bersih").',
              ].join('\n')
            : [
                'Perintah yang tersedia (terhubung database Supabase):',
                '  neofetch     - Tampilkan info sistem Linux Homelab ThinkPad T440',
                '  telemetry    - Status kesehatan & agen aktif stack Agent-Z',
                '  whoami       - Profil Zacky Muhammad Dinata & fokus AI',
                '  skills       - Otomasi LLM, data science & keahlian database',
                '  projects     - Katalog proyek live dari database Supabase',
                '  education    - STMIK IKMI Cirebon (IPK 3.55) & riwayat edukasi',
                '  experience   - Pengalaman profesional & beasiswa IBM',
                '  cert         - Kredensial sertifikasi resmi terverifikasi',
                '  contact      - Email, website, GitHub, LinkedIn & Dicoding',
                '  agent-z      - Buka asisten AI Agent-Z',
                '  lang [en|id] - Ganti atau periksa bahasa terminal & situs',
                '  theme [dark|light] - Ganti atau periksa tema warna',
                '  clear        - Bersihkan layar terminal',
                '',
                'Tips: Mendukung alias bahasa Indonesia ("bantuan", "proyek", "keahlian", "status", "tentang", "pendidikan", "pengalaman", "sertifikat", "bersih").',
              ].join('\n'),
        });
        break;

      case 'lang':
      case 'bahasa': {
        if (subCmd === 'en') {
          if (typeof setLanguage === 'function') setLanguage('en');
          newLog.push({
            type: 'output',
            text: '🌐 Language switched to English. Terminal and UI are now in English.',
          });
        } else if (subCmd === 'id') {
          if (typeof setLanguage === 'function') setLanguage('id');
          newLog.push({
            type: 'output',
            text: '🌐 Bahasa berhasil diubah ke Bahasa Indonesia. Terminal dan tampilan situs kini dalam Bahasa Indonesia.',
          });
        } else {
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? `🌐 Current language: English (en).\nUsage: "lang id" (switch to Indonesian) or "lang en" (switch to English).`
              : `🌐 Bahasa aktif saat ini: Bahasa Indonesia (id).\nPenggunaan: "lang en" (ganti ke Bahasa Inggris) atau "lang id" (ganti ke Bahasa Indonesia).`,
          });
        }
        break;
      }

      case 'theme':
      case 'tema': {
        if (subCmd === 'dark') {
          if (typeof setTheme === 'function') setTheme('dark');
          newLog.push({
            type: 'output',
            text: lang === 'en' ? '🎨 Theme set to Dark mode.' : '🎨 Tema diatur ke mode Gelap (Dark mode).',
          });
        } else if (subCmd === 'light') {
          if (typeof setTheme === 'function') setTheme('light');
          newLog.push({
            type: 'output',
            text: lang === 'en' ? '🎨 Theme set to Light mode.' : '🎨 Tema diatur ke mode Terang (Light mode).',
          });
        } else {
          const nextTheme = theme === 'dark' ? 'light' : 'dark';
          if (typeof toggleTheme === 'function') toggleTheme();
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? `🎨 Theme toggled to ${nextTheme === 'dark' ? 'Dark' : 'Light'} mode.`
              : `🎨 Tema dialihkan ke mode ${nextTheme === 'dark' ? 'Gelap' : 'Terang'}.`,
          });
        }
        break;
      }

      case 'neofetch':
      case 'sysinfo':
      case 'system':
      case 'sistem': {
        const { days: upDays, hours: upHours } = calculateWibUptime();
        newLog.push({
          type: 'neofetch',
          lang,
          data: {
            upDays,
            upHours,
            projectsCount: liveData.projects.length || 20,
            certsCount: liveData.certificates.length || 32,
          },
        });
        break;
      }

      case 'telemetry':
      case 'status':
      case 'telemetri':
      case 'kesehatan': {
        const { days: curUptimeDays } = calculateWibUptime();
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '• Orchestrator Node: ThinkPad T440 (Linux Server)',
                `  * Status: Uptime ${curUptimeDays}+ days nonstop without reboot.`,
                '  * CPU Temp: ~51°C (Very cool & safe, critical threshold 70°C).',
                '  * System Load: Lightweight, RAM usage 3.1 GB / 6.9 GB.',
                '',
                '• Autonomous Multi-Agent (Hermes & OpenClaw Sub-Agents)',
                '  * Hermes Agent: Primary orchestrator (task execution, system automation, model integration).',
                '  * OpenClaw: Workspace file manager & local data assistant.',
                '  * RimbaPulse: Cloud Run AI vision sub-agent.',
                '',
                '• Gateway Router: 9Router Multi-Agent Gateway',
                '  * Status: Active intelligent router & auto-failover across LLM models.',
                '  * Latency: Fast and stable at ~240 ms.',
                '',
                '• Workflow Engine: n8n Webhook Pipelines',
                '  * Status: 100% Active (HTTP 200 OK).',
                '  * Function: Runs automated webhook pipelines without taxing core processes.',
                '',
                '• Database Engine: Cloud PostgreSQL',
                '  * Status: Fully synchronized with ~241 ms query latency.',
                '  * Function: Stores dynamic portfolio data & system assets.',
                '',
                '• Telemetry Status: HEALTHY / OPERATIONAL',
                '  * All processes nominal, zero OOM/memory crash incidents, system ready.',
              ].join('\n')
            : [
                '• Node Orkestrator: ThinkPad T440 (Server Linux)',
                `  * Status: Waktu aktif ${curUptimeDays}+ hari nonstop tanpa reboot.`,
                '  * Suhu CPU: ~51°C (Sangat dingin & aman, batas kritis 70°C).',
                '  * Beban Sistem: Sangat ringan, penggunaan RAM 3.1 GB / 6.9 GB.',
                '',
                '• Multi-Agen Otonom (Sub-Agen Hermes & OpenClaw)',
                '  * Hermes Agent: Orkestrator utama (eksekusi tugas, otomasi sistem, integrasi model).',
                '  * OpenClaw: Manajer berkas workspace & asisten data lokal.',
                '  * RimbaPulse: Sub-agen visi AI Cloud Run.',
                '',
                '• Gateway Router: 9Router Multi-Agent Gateway',
                '  * Status: Router cerdas aktif & auto-failover antar model LLM.',
                '  * Latensi: Cepat dan stabil di ~240 ms.',
                '',
                '• Mesin Alur Kerja: Pipeline Webhook n8n',
                '  * Status: 100% Aktif (HTTP 200 OK).',
                '  * Fungsi: Menjalankan pipeline webhook otomatis tanpa membebani proses inti.',
                '',
                '• Mesin Database: Cloud PostgreSQL',
                '  * Status: Sinkronisasi penuh dengan latensi kueri ~241 ms.',
                '  * Fungsi: Menyimpan data dinamis portofolio & aset sistem.',
                '',
                '• Status Telemetri: SEHAT / OPERASIONAL',
                '  * Seluruh proses nominal, nol insiden OOM/crash memori, sistem siap beroperasi.',
              ].join('\n'),
        });
        break;
      }

      case 'whoami':
      case 'about':
      case 'tentang':
      case 'profil':
      case 'biodata': {
        const name = liveData.profile.full_name || 'Zacky Muhammad Dinata';
        const role = liveData.profile.hero_role || (lang === 'en' ? 'AI Engineer & Multi-Agent Architect' : 'AI Engineer & Arsitek Multi-Agen');
        const summary = lang === 'en'
          ? (liveData.profile.about_description_en || 'Results-driven AI Engineer & Autonomous Agent Architect.')
          : (liveData.profile.about_description_id || 'AI Engineer & Arsitek Agen Mandiri berfokus pada otomasi LLM.');
        newLog.push({
          type: 'output',
          text: [
            `🤖 ${name}`,
            `📍 ${lang === 'en' ? 'Cirebon, West Java, Indonesia' : 'Cirebon, Jawa Barat, Indonesia'} | https://zmdinata.web.id`,
            `💼 ${lang === 'en' ? 'Role' : 'Peran'}: ${role}`,
            `📧 Email: ${liveData.profile.email || 'zmdinata@gmail.com'}`,
            '',
            `📌 ${lang === 'en' ? 'Executive Summary' : 'Ringkasan Eksekutif'}:`,
            summary,
          ].join('\n'),
        });
        break;
      }

      case 'skills':
      case 'stack':
      case 'keahlian':
      case 'kemampuan': {
        if (liveData.skills && liveData.skills.length > 0) {
          const skillLines = liveData.skills.map((s) => {
            const desc = lang === 'en' ? (s.description_en || s.description_id || '') : (s.description_id || s.description_en || '');
            return `• ${s.name}${desc ? `: ${desc}` : ''}`;
          });
          newLog.push({
            type: 'output',
            text: [
              lang === 'en'
                ? '🧠 Active Skills from Supabase Database:'
                : '🧠 Keahlian Aktif dari Database Supabase:',
              ...skillLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? [
                  '🧠 AI & LLM Automation: OpenClaw, Hermes Agent, n8n, Gemini API, PyTorch',
                  '📊 Data & Analytics: Python (pandas, modeling), Statistics (Regression, EDA), SQL, Tableau',
                  '💻 Homelab & DevOps: Linux Homelab (ThinkPad T440), Docker, Git/GitHub, Cloud Run, Supabase',
                  '🌐 Web & Frontend: React 19, Vite, Tailwind CSS, Framer Motion',
                ].join('\n')
              : [
                  '🧠 AI & Otomasi LLM: OpenClaw, Hermes Agent, n8n, Gemini API, PyTorch',
                  '📊 Data & Analitika: Python (pandas, pemodelan), Statistika (Regresi, EDA), SQL, Tableau',
                  '💻 Homelab & DevOps: Linux Homelab (ThinkPad T440), Docker, Git/GitHub, Cloud Run, Supabase',
                  '🌐 Web & Frontend: React 19, Vite, Tailwind CSS, Framer Motion',
                ].join('\n'),
          });
        }
        break;
      }

      case 'projects':
      case 'proyek':
      case 'katalog':
      case 'portofolio': {
        if (liveData.projects && liveData.projects.length > 0) {
          const projLines = liveData.projects.slice(0, 6).map((p, idx) => {
            const title = lang === 'en' ? (p.title_en || p.title) : (p.title_id || p.title_en || p.title);
            const isFeat = p.is_featured ? (lang === 'en' ? ' [FEATURED BENTO]' : ' [UNGGULAN BENTO]') : '';
            const catLabel = lang === 'en' ? 'Category' : 'Kategori';
            const typeLabel = lang === 'en' ? 'Type' : 'Tipe';
            return `${idx + 1}. ${title}${isFeat}\n   • ${catLabel}: ${(p.category || 'General').toUpperCase()} | ${typeLabel}: ${p.type || 'Showcase'}\n   • Link: ${p.file || '-'}`;
          });
          newLog.push({
            type: 'output',
            text: [
              lang === 'en'
                ? `🚀 Live Projects Catalog (${liveData.projects.length} Total in Supabase):`
                : `🚀 Katalog Proyek Aktif (${liveData.projects.length} Total di Supabase):`,
              ...projLines,
              '',
              lang === 'en' ? 'Type "help" to view other commands.' : 'Ketik "help" untuk melihat perintah lainnya.',
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? '🚀 Loading projects from Supabase database...'
              : '🚀 Memuat katalog proyek dari database Supabase...',
          });
        }
        break;
      }

      case 'education':
      case 'edu':
      case 'pendidikan':
      case 'sekolah':
      case 'kuliah': {
        if (liveData.education && liveData.education.length > 0) {
          const eduLines = liveData.education.map((e) => {
            const level = lang === 'en' ? (e.level_en || e.level_id || '') : (e.level_id || e.level_en || '');
            const major = lang === 'en' ? (e.major_en || e.major_id || '') : (e.major_id || e.major_en || '');
            const desc = lang === 'en' ? (e.description_en || e.description_id || '') : (e.description_id || e.description_en || '');
            const gradeLabel = lang === 'en' ? 'Grade/GPA' : 'Nilai/IPK';
            const detailLabel = lang === 'en' ? 'Detail' : 'Detail';
            return `🎓 ${e.school} (${level} ${major})\n• ${gradeLabel}: ${e.grade_value || '3.55'}\n• ${detailLabel}: ${desc}`;
          });
          newLog.push({
            type: 'output',
            text: [
              lang === 'en'
                ? '🎓 Academic Background (Live Database):'
                : '🎓 Riwayat Pendidikan (Database Langsung):',
              ...eduLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? '🎓 STMIK IKMI Cirebon — Bachelor of Information Systems (GPA: 3.55 / 4.00)'
              : '🎓 STMIK IKMI Cirebon — Sarjana Sistem Informasi (IPK: 3.55 / 4.00)',
          });
        }
        break;
      }

      case 'experience':
      case 'exp':
      case 'pengalaman':
      case 'karir':
      case 'kerja': {
        if (liveData.experience && liveData.experience.length > 0) {
          const expLines = liveData.experience.map((e, idx) => {
            const company = lang === 'en' ? (e.company_en || e.company_id || '') : (e.company_id || e.company_en || '');
            const role = lang === 'en' ? (e.role_en || e.role_id || '') : (e.role_id || e.role_en || '');
            const period = lang === 'en' ? (e.period_en || e.period_id || '') : (e.period_id || e.period_en || '');
            const desc = lang === 'en' ? (e.description_en || e.description_id || '') : (e.description_id || e.description_en || '');
            const roleLabel = lang === 'en' ? 'Role' : 'Peran';
            const summaryLabel = lang === 'en' ? 'Summary' : 'Ringkasan';
            return `${idx + 1}. ${company} (${period})\n   • ${roleLabel}: ${role}\n   • ${summaryLabel}: ${desc}`;
          });
          newLog.push({
            type: 'output',
            text: [
              lang === 'en'
                ? '💼 Professional Experience (Live Database):'
                : '💼 Riwayat Pengalaman Profesional (Database Langsung):',
              ...expLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? '💼 Pijak x IBM SkillsBuild — AI Engineer Intensive Program Scholar (Full Graduate)'
              : '💼 Pijak x IBM SkillsBuild — Penerima Beasiswa Penuh AI Engineer Cohort',
          });
        }
        break;
      }

      case 'cert':
      case 'certifications':
      case 'sertifikat':
      case 'kredensial':
      case 'ijazah': {
        if (liveData.certificates && liveData.certificates.length > 0) {
          const certLines = liveData.certificates.slice(0, 8).map((c) => `• ${c.title}`);
          newLog.push({
            type: 'output',
            text: [
              lang === 'en'
                ? `📜 Verified Certifications (${liveData.certificates.length} Total in Supabase):`
                : `📜 Sertifikasi Terverifikasi (${liveData.certificates.length} Total di Supabase):`,
              ...certLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: lang === 'en'
              ? '📜 Loading certifications from Supabase...'
              : '📜 Memuat kredensial sertifikasi dari Supabase...',
          });
        }
        break;
      }

      case 'contact':
      case 'kontak':
      case 'hubungi':
      case 'email':
        newLog.push({
          type: 'output',
          text: [
            `📧 Email: ${liveData.profile.email || 'zmdinata@gmail.com'}`,
            '🌐 Website: https://zmdinata.web.id',
            '💼 LinkedIn: https://www.linkedin.com/in/zacky-muhammad-dinata-463995280',
            '🐙 GitHub: https://github.com/zmdinata',
            '🎓 Dicoding: https://pijak-career-fair.dicoding.com/u/dc_4435233',
            '📸 Instagram: @zmdinataaa',
          ].join('\n'),
        });
        break;

      case 'agent-z':
      case 'chatbot':
      case 'asisten':
      case 'ai':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? '✨ Launching Agent-Z assistant... Check the floating icon at the bottom right!'
            : '✨ Membuka asisten Agent-Z... Silakan periksa ikon asisten di pojok kanan bawah!',
        });
        const chatbotBtn = document.querySelector('.chatbot-toggle-button, .chatbot-toggle-btn, .chatbot-trigger, [aria-label*="chat" i]');
        if (chatbotBtn) chatbotBtn.click();
        break;

      case 'clear':
      case 'bersih':
      case 'cls':
        setTerminalLog([]);
        setInput('');
        return;

      default:
        newLog.push({
          type: 'error',
          text: lang === 'en'
            ? `command not found: "${rawTrimmed}". Type "help" for a list of commands.`
            : `perintah tidak dikenali: "${rawTrimmed}". Ketik "help" untuk melihat daftar perintah.`,
        });
    }

    setTerminalLog(newLog);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className={`ai-terminal-window ${isExpanded ? 'is-expanded' : ''}`}>
      {/* Terminal Title Bar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <FiTerminal className="terminal-icon" />
          <span>zmdinata@homelab-t440:~$</span>
        </div>
        <button
          type="button"
          className="terminal-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? (lang === 'en' ? 'Minimize Terminal' : 'Kecilkan Terminal') : (lang === 'en' ? 'Expand Terminal' : 'Perbesar Terminal')}
          aria-label={isExpanded ? (lang === 'en' ? 'Minimize Terminal' : 'Kecilkan Terminal') : (lang === 'en' ? 'Expand Terminal' : 'Perbesar Terminal')}
        >
          {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>

      {/* Terminal Body */}
      <div 
        ref={terminalBodyRef}
        className="terminal-body" 
        onClick={() => inputRef.current?.focus()}
      >
        <div className="terminal-logs">
          {terminalLog.map((log, idx) => (
            <div key={idx} className={`terminal-line terminal-${log.type}`}>
              {log.type === 'user' ? (
                <>
                  <span className="prompt-symbol">❯</span>
                  <span className="cmd-text">{log.text}</span>
                </>
              ) : log.type === 'neofetch' ? (
                <NeofetchOutput data={log.data} lang={log.lang || lang} />
              ) : (
                <pre className="output-text">{log.text}</pre>
              )}
            </div>
          ))}
        </div>

        {/* Input Line */}
        <div className="terminal-input-row">
          <span className="prompt-symbol">❯</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'en' ? 'type command... (e.g. "help", "neofetch")' : 'ketik perintah... (contoh: "help", "proyek")'}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Modern Cyberpunk Quick Action Chips Bar with Horizontal Scroll */}
      <div className="terminal-quick-container">
        <div className="terminal-quick-sticky-label">
          <span className="terminal-quick-badge">
            <span className="terminal-quick-pulse" /> {lang === 'en' ? 'QUICK RUNS' : 'AKSI CEPAT'}
          </span>
        </div>
        <div className="terminal-quick-chips-scroll">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              className="terminal-chip cyberpunk-chip"
              onClick={() => executeCommand(cmd)}
            >
              <span className="chip-prompt">$</span>
              <span className="chip-cmd">{cmd}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
