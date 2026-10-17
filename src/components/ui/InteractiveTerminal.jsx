import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { FiTerminal, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { getCachedProjects } from '../../lib/portfolioCache';
import { fetchFullProfile, getLocalProfileConfig } from '../../lib/profileConfig';

// Anchor: July 1, 2026 00:00:00 WIB (Asia/Jakarta, UTC+7) => Exactly 108 days on Oct 17, 2026, auto-increments every 00:00 WIB
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

export default function InteractiveTerminal() {
  const { lang } = useLang();
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

  const [terminalLog, setTerminalLog] = useState([
    {
      type: 'system',
      text: lang === 'en' 
        ? '⚡ Welcome to Zacky\'s AI Core Terminal. Type "help" or click the chips below to explore.' 
        : '⚡ Selamat datang di Terminal AI Core Zacky. Ketik "help" atau klik tombol chip di bawah untuk menjelajah.',
    },
  ]);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

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
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);

    const newLog = [...terminalLog, { type: 'user', text: trimmed }];

    switch (trimmed) {
      case 'help':
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
                '  clear        - Clear terminal output',
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
                '  clear        - Bersihkan layar terminal',
              ].join('\n'),
        });
        break;

      case 'neofetch':
      case 'sysinfo':
      case 'system': {
        const { days: upDays, hours: upHours } = calculateWibUptime();
        newLog.push({
          type: 'output',
          text: [
            '    ███████╗███╗   ███╗██████╗  zmdinata@homelab-t440',
            '    ╚══███╔╝████╗ ████║██╔══██╗ ---------------------',
            '      ███╔╝ ██╔████╔██║██║  ██║ OS: Linux Homelab (ThinkPad T440)',
            '     ███╔╝  ██║╚██╔╝██║██║  ██║ Host: Lenovo ThinkPad T440 Core i5',
            '    ███████╗██║ ╚═╝ ██║██████╔╝ Kernel: Linux 6.1.0-agentz-ai',
            `    ╚══════╝╚═╝     ╚═╝╚═════╝  Uptime: ${upDays} days, ${upHours} hours`,
            '                                Shell: zsh 5.9 / agent-z runtime',
            '                                Stack: Nous Hermes • OpenClaw • n8n',
            '                                Database: Supabase Cloud (Live)',
            `                                Projects: ${liveData.projects.length} Active in Database`,
            `                                Credentials: ${liveData.certificates.length} Verified`,
            '                                Status: Online & Telemetry Active',
          ].join('\n'),
        });
        break;
      }

      case 'telemetry':
      case 'status': {
        const { days: curUptimeDays } = calculateWibUptime();
        newLog.push({
          type: 'output',
          text: [
            '• Orchestrator Node: ThinkPad T440 (Linux Server)',
            `  * Status: Uptime ${curUptimeDays}+ hari nonstop tanpa reboot.`,
            '  * Suhu CPU: ~51°C (Sangat dingin & aman, batas bahaya 70°C).',
            '  * Beban Sistem: Sangat ringan, RAM terpakai 3.1 GB / 6.9 GB.',
            '',
            '• Active Agents: 3 Sub-Agents',
            '  * Hermes Agent: Orkestrator utama (eksekusi tugas, otomasi sistem, integrasi model).',
            '  * OpenClaw: Pengelola file workspace & asisten data lokal.',
            '  * RimbaPulse: Sub-agen AI vision berbasis Cloud Run.',
            '',
            '• Gateway Router: 9Router Multi-Agent Gateway',
            '  * Status: Aktif sebagai router cerdas & auto-failover antar-model LLM.',
            '  * Latensi: Cepat dan stabil di kisaran ~240 ms.',
            '',
            '• Workflow Engine: n8n Webhook Pipelines',
            '  * Status: 100% Aktif (HTTP 200 OK).',
            '  * Fungsi: Menjalankan pipeline webhook otomatisasi tanpa membebani proses utama.',
            '',
            '• Database Engine: Cloud PostgreSQL',
            '  * Status: Tersinkronisasi penuh dengan latensi query ~241 ms.',
            '  * Fungsi: Menyimpan data dinamis web portofolio & aset sistem.',
            '',
            '• Telemetry Status: HEALTHY / OPERATIONAL',
            '  * Semua proses berjalan normal, nol insiden OOM/memory crash, sistem siap pakai.',
          ].join('\n'),
        });
        break;
      }

      case 'whoami':
      case 'about':
        const name = liveData.profile.full_name || 'Zacky Muhammad Dinata';
        const role = liveData.profile.hero_role || 'AI Engineer & Multi-Agent Architect';
        const summary = lang === 'en'
          ? (liveData.profile.about_description_en || 'Results-driven AI Engineer & Autonomous Agent Architect.')
          : (liveData.profile.about_description_id || 'AI Engineer & Arsitek Agen Mandiri berfokus pada otomasi LLM.');
        newLog.push({
          type: 'output',
          text: `🤖 ${name}\n📍 Cirebon, Jawa Barat, Indonesia | https://zmdinata.web.id\n💼 Role: ${role}\n📧 Email: ${liveData.profile.email || 'zmdinata@gmail.com'}\n\n📌 Summary:\n${summary}`,
        });
        break;

      case 'skills':
      case 'stack':
        if (liveData.skills && liveData.skills.length > 0) {
          const skillLines = liveData.skills.map((s, idx) => `• ${s.name}: ${lang === 'en' ? (s.description_en || '') : (s.description_id || s.description_en || '')}`);
          newLog.push({
            type: 'output',
            text: [
              '🧠 Active Skills from Supabase Database:',
              ...skillLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: [
              '🧠 AI & LLM Automation: OpenClaw, Hermes Agent, n8n, Gemini API, PyTorch',
              '📊 Data & Analytics: Python (pandas, modeling), Statistics (Regression, EDA), SQL, Tableau',
              '💻 Homelab & DevOps: Linux Homelab (ThinkPad T440), Docker, Git/GitHub, Cloud Run, Supabase',
              '🌐 Web & Frontend: React 19, Vite, Tailwind CSS, Framer Motion',
            ].join('\n'),
          });
        }
        break;

      case 'projects':
        if (liveData.projects && liveData.projects.length > 0) {
          const projLines = liveData.projects.slice(0, 6).map((p, idx) => {
            const title = lang === 'en' ? (p.title_en || p.title) : (p.title_id || p.title_en || p.title);
            const isFeat = p.is_featured ? ' [FEATURED BENTO]' : '';
            return `${idx + 1}. ${title}${isFeat}\n   • Kategori: ${(p.category || 'General').toUpperCase()} | Tipe: ${p.type}\n   • Link: ${p.file || '-'}`;
          });
          newLog.push({
            type: 'output',
            text: [
              `🚀 Live Projects Catalog (${liveData.projects.length} Total in Supabase):`,
              ...projLines,
              '',
              'Ketik "help" untuk melihat perintah lainnya.',
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: '🚀 Loading projects from Supabase database...',
          });
        }
        break;

      case 'education':
      case 'edu':
        if (liveData.education && liveData.education.length > 0) {
          const eduLines = liveData.education.map((e) => {
            const level = lang === 'en' ? (e.level_en || '') : (e.level_id || e.level_en || '');
            const major = lang === 'en' ? (e.major_en || '') : (e.major_id || e.major_en || '');
            const desc = lang === 'en' ? (e.description_en || '') : (e.description_id || e.description_en || '');
            return `🎓 ${e.school} (${level} ${major})\n• Nilai/IPK: ${e.grade_value || '3.55'}\n• Detail: ${desc}`;
          });
          newLog.push({
            type: 'output',
            text: [
              '🎓 Riwayat Pendidikan (Live Database):',
              ...eduLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: '🎓 STMIK IKMI Cirebon — Sarjana Sistem Informasi (IPK: 3.55 / 4.00)',
          });
        }
        break;

      case 'experience':
      case 'exp':
        if (liveData.experience && liveData.experience.length > 0) {
          const expLines = liveData.experience.map((e, idx) => {
            const company = lang === 'en' ? (e.company_en || '') : (e.company_id || e.company_en || '');
            const role = lang === 'en' ? (e.role_en || '') : (e.role_id || e.role_en || '');
            const period = lang === 'en' ? (e.period_en || '') : (e.period_id || e.period_en || '');
            const desc = lang === 'en' ? (e.description_en || '') : (e.description_id || e.description_en || '');
            return `${idx + 1}. ${company} (${period})\n   • Peran: ${role}\n   • Ringkasan: ${desc}`;
          });
          newLog.push({
            type: 'output',
            text: [
              '💼 Riwayat Pengalaman Profesional (Live Database):',
              ...expLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: '💼 Pijak x IBM SkillsBuild — AI Engineer Intensive Program Scholar',
          });
        }
        break;

      case 'cert':
      case 'certifications':
        if (liveData.certificates && liveData.certificates.length > 0) {
          const certLines = liveData.certificates.slice(0, 8).map((c, idx) => `• ${c.title}`);
          newLog.push({
            type: 'output',
            text: [
              `📜 Verified Certifications (${liveData.certificates.length} Total in Supabase):`,
              ...certLines,
            ].join('\n'),
          });
        } else {
          newLog.push({
            type: 'output',
            text: '📜 Loading certifications from Supabase...',
          });
        }
        break;

      case 'contact':
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
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? '✨ Launching Agent-Z assistant... Check the floating icon at the bottom right!'
            : '✨ Membuka Agent-Z... Silakan periksa ikon asisten di pojok kanan bawah!',
        });
        const chatbotBtn = document.querySelector('.chatbot-toggle-button, .chatbot-trigger, [aria-label*="chat" i]');
        if (chatbotBtn) chatbotBtn.click();
        break;

      case 'clear':
        setTerminalLog([]);
        setInput('');
        return;

      default:
        newLog.push({
          type: 'error',
          text: lang === 'en'
            ? `command not found: "${trimmed}". Type "help" for a list of commands.`
            : `perintah tidak dikenali: "${trimmed}". Ketik "help" untuk melihat daftar perintah.`,
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
          aria-label={isExpanded ? 'Minimize Terminal' : 'Expand Terminal'}
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
            placeholder={lang === 'en' ? 'type command...' : 'ketik perintah...'}
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
            <span className="terminal-quick-pulse" /> QUICK RUNS
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
