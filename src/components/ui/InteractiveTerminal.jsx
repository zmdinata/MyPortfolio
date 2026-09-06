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
                '  whoami       - About Zacky Muhammad Dinata & AI engineering focus',
                '  skills       - Autonomous agents, quant modeling, data stack & homelab',
                '  projects     - AutoOverlay AI, Agent-Z Homelab, A2Z Agentz & SISFOTEK',
                '  education    - STMIK IKMI Cirebon (GPA 3.55) & academic milestones',
                '  experience   - Alpaca AI Hackathon, LifeOS, Pijak x IBM & NFT art history',
                '  cert         - Professional certifications (IBM, AMD, Cisco, SISFOTEK)',
                '  contact      - Email, website, GitHub, LinkedIn & portfolio badge',
                '  agent-z      - Open the floating AI assistant',
                '  clear        - Clear terminal output',
              ].join('\n')
            : [
                'Perintah yang tersedia:',
                '  neofetch     - Tampilkan info sistem Linux Homelab ThinkPad T440',
                '  telemetry    - Status kesehatan & agen aktif stack Agent-Z',
                '  whoami       - Profil Zacky Muhammad Dinata & fokus rekayasa AI',
                '  skills       - Agen mandiri, pemodelan kuantitatif, data stack & homelab',
                '  projects     - AutoOverlay AI, Agent-Z Homelab, A2Z Agentz & SISFOTEK',
                '  education    - STMIK IKMI Cirebon (IPK 3.55) & capaian akademis',
                '  experience   - Alpaca AI Hackathon, LifeOS, Pijak x IBM & riwayat seni NFT',
                '  cert         - Sertifikasi profesional resmi (IBM, AMD, Cisco, SISFOTEK)',
                '  contact      - Email, website, GitHub, LinkedIn & badge portfolio',
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
            ? '🤖 Zacky Muhammad Dinata\n📍 Cirebon, West Java, Indonesia | https://zmdinata.web.id\n💼 Role: AI Engineer & Autonomous Agent Architect\n\n📌 Summary:\nResults-driven AI Engineer & ML Researcher specializing in Autonomous Multi-Agent Orchestration (Hermes Agent, OpenClaw, n8n) and Quantitative Risk Management. Full Scholarship Graduate of PIJAK x IBM SkillsBuild AI Cohort. Actively architecting production-grade agentic systems and options risk engines.'
            : '🤖 Zacky Muhammad Dinata\n📍 Cirebon, Jawa Barat, Indonesia | https://zmdinata.web.id\n💼 Peran: AI Engineer & Arsitek Agen Mandiri\n\n📌 Ringkasan:\nAI Engineer & Peneliti ML yang berfokus pada Orkestrasi Multi-Agent Mandiri (Hermes Agent, OpenClaw, n8n) dan Manajemen Risiko Kuantitatif. Lulusan Beasiswa Penuh PIJAK x IBM SkillsBuild AI Cohort. Aktif merancang sistem agen cerdas tingkat produksi dan mesin mitigasi risiko opsi trading.',
        });
        break;

      case 'skills':
      case 'stack':
        newLog.push({
          type: 'output',
          text: [
            '🧠 AI & Agent Systems: Hermes Agent, OpenClaw, Sub-Agent Delegation, Multi-Persona Consensus, n8n, 9Router Fallback',
            '📈 Quantitative & ML: Monte Carlo Simulation (Merton Jump Diffusion), VaR 95%, Scikit-learn, Pandas, Regression',
            '💻 Homelab & DevOps: Linux Server (ThinkPad T440), PM2, Systemd, Docker, Cloud Run, Supabase, SQLite WAL',
            '🌐 Web & Frontend: React 19, Vite, Tailwind CSS, Framer Motion, REST APIs',
            '🎨 Creative & Design: Modular NFT Traits, Vector/Vexel Art, Adobe Photoshop, UI/UX Prototyping',
          ].join('\n'),
        });
        break;

      case 'projects':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '🚀 Featured Projects:',
                '1. AutoOverlay AI: Autonomous Options Alpha & Risk Engine (Aug - Sep 2026)',
                '   • Monte Carlo Merton Jump Diffusion VaR + 6-persona council for Alpaca AI Hackathon.',
                '   • Repo: https://github.com/zmdinata/autooverlay-ai',
                '',
                '2. Agent-Z Homelab: AI Agent Orchestrator (Jan 2026 - Present)',
                '   • Self-hosted Linux on ThinkPad T440 running Hermes Agent + OpenClaw with telemetry.',
                '   • Repo: https://github.com/zmdinata',
                '',
                '3. A2Z Agentz: Web3 Airdrop Intelligence (Jul 2026 - AMD Hackathon ACT II)',
                '   • Multi-agent platform on Base Network powered by AMD ROCm, Llama 3.1 & DeepSeek V3.',
                '',
                '4. LestariRimba: AI-Powered Sustainability Prototype (May 2026)',
                '   • Cloud Run platform featuring AI vision and conservation analysis (#JuaraVibeCoding).',
                '',
                '5. Flight Ticket Price Prediction with MLR (Oct - Nov 2025)',
                '   • Peer-reviewed research paper in SISFOTEK national journal on 116K+ flight records.',
                '   • Paper: https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
              ].join('\n')
            : [
                '🚀 Proyek Unggulan:',
                '1. AutoOverlay AI: Mesin Alpha & Manajemen Risiko Opsi Mandiri (Ags - Sep 2026)',
                '   • Simulasi Monte Carlo Merton Jump Diffusion VaR + konsensus 6 persona untuk Alpaca AI Hackathon.',
                '   • Repo: https://github.com/zmdinata/autooverlay-ai',
                '',
                '2. Agent-Z Homelab: Orkestrasi Agen AI Mandiri (Jan 2026 - Sekarang)',
                '   • Server Linux mandiri di ThinkPad T440 dengan Hermes Agent + OpenClaw dan telemetri.',
                '   • Repo: https://github.com/zmdinata',
                '',
                '3. A2Z Agentz: Intelijen Airdrop Web3 Mandiri (Jul 2026 - AMD Hackathon ACT II)',
                '   • Platform multi-agen di Base Network ditenagai AMD ROCm, Llama 3.1 & DeepSeek V3.',
                '',
                '4. LestariRimba: Prototipe Web AI Keberlanjutan (Mei 2026)',
                '   • Platform Cloud Run dengan analisis AI vision dan konservasi hutan (#JuaraVibeCoding).',
                '',
                '5. Prediksi Harga Tiket Penerbangan MLR (Okt - Nov 2025)',
                '   • Publikasi makalah ilmiah di seminar nasional SISFOTEK (116K+ data penerbangan).',
                '   • Makalah: https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
              ].join('\n'),
        });
        break;

      case 'education':
      case 'edu':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '🎓 Education & Academic Record:',
                '• Institution: STMIK IKMI Cirebon (Oct 2024 — 2028)',
                '• Major: Bachelor of Information Systems (GPA: 3.55 / 4.00)',
                '• Honors: Bronze Medal - National Business Plan Competition UNY 2025 ("Herbelice")',
                '• Focus: Machine Learning, Autonomous Multi-Agent Architecture, Systems Engineering',
              ].join('\n')
            : [
                '🎓 Pendidikan & Rekam Akademis:',
                '• Institusi: STMIK IKMI Cirebon (Okt 2024 — 2028)',
                '• Program Studi: S1 Sistem Informasi (IPK: 3.55 / 4.00)',
                '• Prestasi: Medali Perunggu - Lomba Business Plan Nasional UNY 2025 ("Herbelice")',
                '• Fokus: Machine Learning, Arsitektur Multi-Agent Otonom, Rekayasa Sistem',
              ].join('\n'),
        });
        break;

      case 'experience':
      case 'exp':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? [
                '💼 Experience & Journey:',
                '1. AI Engineer & Quant Lead — AutoOverlay AI (Aug - Sep 2026)',
                '   • Alpaca AI Trading Hackathon contributor (Monte Carlo VaR & 6-persona council)',
                '2. Project Manager & Agent Architect — LifeOS Agent (Aug - Oct 2026)',
                '   • AI HACKFEST 2026 (Hermes Agent + OpenClaw on CloudBaik VPS)',
                '3. AI Engineer Intensive Scholar — Pijak x IBM SkillsBuild (Feb - Jul 2026)',
                '   • Full scholarship graduate across end-to-end ML/DL & soft skills curriculum',
                '4. Freelance NFT & Digital Artist — Self-Employed (2020 - 2024)',
                '   • 60+ commercial NFT artworks & 30+ modular traits before pivoting to AI',
              ].join('\n')
            : [
                '💼 Pengalaman & Perjalanan Karier:',
                '1. AI Engineer & Quant Lead — AutoOverlay AI (Ags - Sep 2026)',
                '   • Kontributor Alpaca AI Trading Hackathon (Monte Carlo VaR & konsensus 6 persona)',
                '2. Project Manager & Arsitek Agen — LifeOS Agent (Ags - Okt 2026)',
                '   • AI HACKFEST 2026 (Hermes Agent + OpenClaw di CloudBaik VPS)',
                '3. Scholar Program Beasiswa AI Engineer — Pijak x IBM SkillsBuild (Feb - Jul 2026)',
                '   • Lulusan beasiswa penuh kurikulum end-to-end ML/DL & soft skills',
                '4. Artis NFT & Ilustrasi Digital Lepas — Mandiri (2020 - 2024)',
                '   • 60+ karya seni NFT komersial & 30+ trait modular sebelum beralih ke AI',
              ].join('\n'),
        });
        break;

      case 'cert':
      case 'certificates':
        newLog.push({
          type: 'output',
          text: [
            '📜 Key Verified Certifications:',
            '• Pijak x IBM SkillsBuild — AI Engineer Intensive Program (Full Graduate Certificate)',
            '• AMD & Lablab.ai — AMD Developer Hackathon ACT II Certificate (ROCm & Llama 3.1)',
            '• IAII SISFOTEK 9 — Research Presenter (Machine Learning Regression Paper)',
            '• IBM SkillsBuild — Artificial Intelligence Fundamentals & Generative AI',
            '• Cisco Networking Academy — Python Essentials 1',
            '• DQLab & Fastcampus — Python for Data Professional & SQL Series',
          ].join('\n'),
        });
        break;

      case 'contact':
        newLog.push({
          type: 'output',
          text: [
            '📬 Contact & Links:',
            '• Email: zmdinata@gmail.com',
            '• Website: https://zmdinata.web.id',
            '• GitHub: https://github.com/zmdinata',
            '• LinkedIn: https://www.linkedin.com/in/zacky-muhammad-dinata-463995280',
            '• Dicoding / Pijak Profile: https://pijak-career-fair.dicoding.com/u/dc_4435233',
          ].join('\n'),
        });
        break;

      case 'agent-z':
      case 'chatbot':
        newLog.push({
          type: 'output',
          text: lang === 'en'
            ? '✨ Launching Agent-Z assistant... Check the floating icon at the bottom right!'
            : '✨ Membuka Agent-Z... Silakan periksa ikon asisten di pojok kanan bawah!',
        });
        window.dispatchEvent(new CustomEvent('open-chatbot'));
        break;

      case 'clear':
        setTerminalLog([]);
        return;

      default:
        newLog.push({
          type: 'error',
          text: lang === 'en'
            ? `command not found: ${trimmed}. Type "help" to see available commands.`
            : `perintah tidak ditemukan: ${trimmed}. Ketik "help" untuk melihat daftar perintah.`,
        });
        break;
    }

    setTerminalLog(newLog);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(commandHistory[prevIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className={`terminal-card ${isExpanded ? 'is-expanded' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <FiTerminal className="terminal-icon" />
          <span>zmdinata@homelab-t440:~</span>
        </div>
        <button
          className="terminal-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Minimize terminal' : 'Maximize terminal'}
        >
          {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </div>

      <div className="terminal-body" ref={terminalBodyRef}>
        {terminalLog.map((log, index) => (
          <div key={index} className={`log-line log-${log.type}`}>
            {log.type === 'user' && <span className="prompt-symbol">❯ </span>}
            <pre className="log-text">{log.text}</pre>
          </div>
        ))}
      </div>

      <div className="terminal-footer">
        <div className="terminal-chips-wrapper">
          <div className="terminal-chips">
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                className="chip-btn"
                onClick={() => executeCommand(cmd)}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        <div className="terminal-input-row" onClick={() => inputRef.current?.focus()}>
          <span className="prompt-symbol">❯</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'en' ? 'type command here...' : 'ketik perintah di sini...'}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            className="terminal-submit-btn"
            onClick={() => {
              executeCommand(input);
              setInput('');
            }}
            aria-label="Execute command"
          >
            <FiCornerDownLeft />
          </button>
        </div>
      </div>
    </div>
  );
}
