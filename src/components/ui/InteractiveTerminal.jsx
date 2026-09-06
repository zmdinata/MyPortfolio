import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { FiTerminal, FiCornerDownLeft, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

export default function InteractiveTerminal() {
  const { lang } = useLang();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
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

  // Auto scroll terminal container only, NEVER the window
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
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
                'Available commands:',
                '  neofetch     - Display ThinkPad T440 Linux Homelab system info',
                '  telemetry    - Live health & agent status for Agent-Z stack',
                '  whoami       - About Zacky Muhammad Dinata & AI focus',
                '  skills       - LLM automation, data science & tooling stack',
                '  projects     - Homelab agent orchestrator, LestariRimba & ML research',
                '  education    - STMIK IKMI Cirebon (GPA 3.55) & awards',
                '  experience   - Pijak x IBM SkillsBuild & illustration journey',
                '  cert         - Professional certifications & credentials',
                '  contact      - Email, website, GitHub, LinkedIn & Dicoding',
                '  agent-z      - Open the floating AI assistant',
                '  clear        - Clear terminal output',
              ].join('\n')
            : [
                'Perintah yang tersedia:',
                '  neofetch     - Tampilkan info sistem Linux Homelab ThinkPad T440',
                '  telemetry    - Status kesehatan & agen aktif stack Agent-Z',
                '  whoami       - Profil Zacky Muhammad Dinata & fokus AI',
                '  skills       - Otomasi LLM, data science & stack teknologi',
                '  projects     - Homelab agent orchestrator, LestariRimba & riset ML',
                '  education    - STMIK IKMI Cirebon (IPK 3.55) & prestasi',
                '  experience   - Pijak x IBM SkillsBuild & riwayat ilustrasi',
                '  cert         - Sertifikasi profesional terverifikasi',
                '  contact      - Email, website, GitHub, LinkedIn & Dicoding',
                '  agent-z      - Buka asisten AI Agent-Z',
                '  clear        - Bersihkan layar terminal',
              ].join('\n'),
        });
        break;

      case 'neofetch':
      case 'sysinfo':
      case 'system':
        newLog.push({
          type: 'output',
          text: [
            '    ███████╗███╗   ███╗██████╗  zmdinata@homelab-t440',
            '    ╚══███╔╝████╗ ████║██╔══██╗ ---------------------',
            '      ███╔╝ ██╔████╔██║██║  ██║ OS: Linux Homelab (ThinkPad T440)',
            '     ███╔╝  ██║╚██╔╝██║██║  ██║ Host: Lenovo ThinkPad T440 Core i5',
            '    ███████╗██║ ╚═╝ ██║██████╔╝ Kernel: Linux 6.1.0-agentz-ai',
            '    ╚══════╝╚═╝     ╚═╝╚═════╝  Uptime: 42 days, 13 hours',
            '                                Shell: zsh 5.9 / agent-z runtime',
            '                                Stack: Nous Hermes • OpenClaw • n8n',
            '                                LLM Engine: Gemini API + 9Router',
            '                                Status: Online & Telemetry Active',
          ].join('\n'),
        });
        break;

      case 'telemetry':
      case 'status':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '⚡ AGENT-Z AI HOMELAB TELEMETRY:',
                '• Orchestrator Node: ThinkPad T440 (Linux Always-On Server)',
                '• Active Agents    : 3 Sub-Agents (Hermes, OpenClaw, RimbaPulse)',
                '• Gateway Router   : 9Router Multi-Agent Gateway (Latency: ~240ms)',
                '• Workflow Engine  : n8n Automated Webhook Pipelines (Active)',
                '• Cloud Sync       : Google Cloud Run (LestariRimba API)',
                '• Telemetry Status : HEALTHY / OPERATIONAL (100% Uptime)',
              ].join('\n')
            : [
                '⚡ TELEMETRI AI HOMELAB AGENT-Z:',
                '• Server Mandiri   : ThinkPad T440 (Linux Server Always-On)',
                '• Agen Aktif       : 3 Sub-Agen (Hermes, OpenClaw, RimbaPulse)',
                '• Router Fallback  : 9Router Multi-Agent Gateway (Latensi: ~240ms)',
                '• Mesin Otomasi    : Pipeline Webhook n8n (Aktif)',
                '• Sinkronisasi     : Google Cloud Run (LestariRimba API)',
                '• Status Telemetri : SEHAT / BERJALAN NORMAL (Uptime 100%)',
              ].join('\n'),
        });
        break;

      case 'whoami':
      case 'about':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? '🤖 Zacky Muhammad Dinata\n📍 Cirebon, West Java, Indonesia | https://zmdinata.web.id\n💼 Role: AI Engineer & LLM Automation Specialist\n\n📌 Summary:\nResults-driven AI Engineer focused on building automated systems powered by Large Language Models. Backed by a strong technical foundation from PIJAK in collaboration with the IBM SkillsBuild AI Intensive Program. Actively using OpenClaw, Hermes Agent, and n8n to integrate state-of-the-art LLMs (such as Gemini) into seamless, automated workflows.'
            : '🤖 Zacky Muhammad Dinata\n📍 Cirebon, Jawa Barat, Indonesia | https://zmdinata.web.id\n💼 Peran: AI Engineer & Spesialis Otomasi LLM\n\n📌 Ringkasan:\nAI Engineer yang berfokus pada pembangunan sistem otomasi bertenaga Large Language Models (LLM). Didukung fondasi teknis dari program intensif PIJAK x IBM SkillsBuild. Menggunakan OpenClaw, Hermes Agent, dan n8n untuk mengintegrasikan model AI terkini (seperti Gemini) ke dalam alur kerja otomatis yang efisien.',
        });
        break;

      case 'skills':
      case 'stack':
        newLog.push({
          type: 'output',
          text: [
            '🧠 AI & LLM Automation: OpenClaw, Hermes Agent (Nous Research), n8n, Gemini API, 9Router Fallback, PyTorch',
            '📊 Data & Analytics: Python (pandas, modeling), Statistics (Regression, EDA), SQL (MySQL, MS SQL), Tableau, R, Excel',
            '💻 Homelab & DevOps: Linux Homelab (ThinkPad T440), PM2, systemd, Docker, Git/GitHub, Cloud Run, Supabase',
            '🌐 Web & Frontend: React 19, Vite, Tailwind CSS, Framer Motion, Recharts',
          ].join('\n'),
        });
        break;

      case 'projects':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '🚀 Key Projects:',
                '1. Agent-Z Homelab: AI Agent Orchestrator (Jan 2026 - Present)',
                '   • Self-hosted Linux on ThinkPad T440 running Hermes Agent + OpenClaw.',
                '   • Coordinates sub-agents, automated n8n & Telegram flows, 9Router LLM fallback.',
                '',
                '2. LestariRimba: AI-Powered Sustainability Prototype (May 2026)',
                '   • #JuaraVibeCoding prototype featuring RimbaPulse AI & Gemini Deep Research.',
                '   • Deployed on Cloud Run: https://lestari-rimba-661373468998.asia-southeast2.run.app/',
                '',
                '3. Flight Ticket Price Prediction with MLR (Oct - Nov 2025)',
                '   • Peer-reviewed paper in SISFOTEK national seminar on 116K+ flight records.',
                '   • Paper: https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
                '',
                '4. Herbelice: Es Krim Jamu (Business Plan, Bronze Medal UNY 2025)',
              ].join('\n')
            : [
                '🚀 Proyek Utama:',
                '1. Agent-Z Homelab: AI Agent Orchestrator (Jan 2026 - Sekarang)',
                '   • Server Linux mandiri di ThinkPad T440 dengan Hermes Agent + OpenClaw.',
                '   • Orkestrasi tim sub-agent, alur n8n & Telegram, fallback API 9Router.',
                '',
                '2. LestariRimba: Prototype Web AI Berkelanjutan (Mei 2026)',
                '   • Karya #JuaraVibeCoding dengan fitur RimbaPulse AI & Gemini Deep Research.',
                '   • Live URL: https://lestari-rimba-661373468998.asia-southeast2.run.app/',
                '',
                '3. Prediksi Harga Tiket Penerbangan (Multiple Linear Regression)',
                '   • Dipublikasikan di Seminar Nasional SISFOTEK (dataset 116K+ record).',
                '   • Paper: https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
                '',
                '4. Herbelice: Es Krim Jamu (Peraih Medali Perunggu UNY 2025)',
              ].join('\n'),
        });
        break;

      case 'education':
      case 'edu':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '🎓 STMIK IKMI Cirebon (Oct 2024 - 2028)',
                '• Degree: Pursuing Bachelor\'s degree in Information Systems',
                '• Current GPA: 3.55 / 4.00',
                '• Achievement: Bronze Medal, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025), Universitas Negeri Yogyakarta (Idea: "Es Krim Jamu")',
                '• Coursework: Data Science, Statistics, Machine Learning, AI Engineer',
              ].join('\n')
            : [
                '🎓 STMIK IKMI Cirebon (Okt 2024 - 2028)',
                '• Program: Sarjana Sistem Informasi',
                '• IPK Terkini: 3.55 / 4.00',
                '• Prestasi: Medali Perunggu, National Business Plan Competition "Cipta Nusantara Fest Vol. 2" (2025) di Universitas Negeri Yogyakarta (ide: "Es Krim Jamu")',
                '• Mata Kuliah Utama: Data Science, Statistika, Machine Learning, AI Engineer',
              ].join('\n'),
        });
        break;

      case 'experience':
      case 'exp':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '💼 Professional Experience:',
                '1. Pijak in collaboration with IBM SkillsBuild (Feb 2026 - Jul 2026)',
                '   • Role: AI Engineer Intensive Program Scholar',
                '   • Awarded full scholarship through competitive selection.',
                '   • Completed end-to-end ML & AI curriculum + 7 ILT soft skill sessions.',
                '',
                '2. Freelance NFT & Digital Illustration Artist (Dec 2020 - Oct 2024)',
                '   • Completed 60+ custom illustrations for FlokyApe NFT collection.',
                '   • Designed 30+ layered traits inspired by Azuki-style art.',
              ].join('\n')
            : [
                '💼 Pengalaman Profesional:',
                '1. Pijak x IBM SkillsBuild (Feb 2026 - Jul 2026)',
                '   • Peran: AI Engineer Intensive Program Scholar',
                '   • Penerima beasiswa penuh melalui seleksi kompetitif nasional.',
                '   • Menyelesaikan kurikulum AI, Deep Learning, ML Systems & 7 sesi ILT soft skills.',
                '',
                '2. Seniman Ilustrasi Digital & NFT Lepas (Des 2020 - Okt 2024)',
                '   • Menyelesaikan 60+ karya NFT untuk koleksi FlokyApe.',
                '   • Mendesain 30+ trait berlayer bergaya Azuki.',
              ].join('\n'),
        });
        break;

      case 'cert':
      case 'certifications':
        newLog.push({
          type: 'output',
          text: [
            '📜 Key Certifications:',
            '• AI Engineer Intensive Program Scholar (Pijak x IBM SkillsBuild)',
            '• Data Science with Python: from A to Z (Fastcampus IDN)',
            '• Python Essentials 1 (Cisco Networking Academy)',
            '• Fundamental Database MySQL (Coding Studio)',
            '• Fundamental Excel (Coding Studio)',
            '• Introduction to Artificial Intelligence (IBM SkillsBuild)',
          ].join('\n'),
        });
        break;

      case 'contact':
        newLog.push({
          type: 'output',
          text: [
            '📧 Email: zmdinata@gmail.com',
            '🌐 Website: https://zmdinata.web.id',
            '💼 LinkedIn: https://www.linkedin.com/in/zacky-muhammad-dinata-463995280',
            '🐙 GitHub: https://github.com/zmdinata',
            '🎓 Dicoding Profile: https://pijak-career-fair.dicoding.com/u/dc_4435233',
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

        {/* Input Prompt Row */}
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
            spellCheck={false}
          />
          <button 
            type="button" 
            className="terminal-send-btn" 
            onClick={() => executeCommand(input)}
            aria-label="Send Command"
          >
            <FiCornerDownLeft />
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="terminal-quick-chips">
        <span className="quick-label">
          {lang === 'en' ? 'Quick runs:' : 'Aksi cepat:'}
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            className="terminal-chip"
            onClick={() => executeCommand(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
