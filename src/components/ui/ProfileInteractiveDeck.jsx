import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCpu,
  FiZap,
  FiActivity,
  FiMail,
  FiMessageSquare,
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiSend,
} from 'react-icons/fi';
import { useLang } from '../../context/LangContext';

const specializationDecks = [
  {
    id: 'llm',
    tabLabel: 'LLM & Agents',
    icon: FiCpu,
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
    icon: FiZap,
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
    icon: FiActivity,
    color: '#a55eea',
    badge: 'Makalah SISFOTEK 9',
    title: 'Flight Ticket Price Prediction (MLR)',
    metric: '116K+ Records • Multiple Linear Regression',
    desc: 'Penelitian forecasting harga tiket penerbangan berakurasi tinggi yang dipublikasikan di jurnal nasional terakreditasi.',
    descEn: 'High-accuracy flight ticket price prediction research published in accredited national academic journal.',
    stack: ['Multiple Linear Regression', 'Scikit-Learn', 'Pandas', 'SQL', 'Seaborn'],
    link: 'https://seminar.iaii.or.id/index.php/SISFOTEK/article/view/692',
  },
];

export default function ProfileInteractiveDeck({ name, role }) {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState('llm');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const currentDeck = specializationDecks.find((d) => d.id === activeTab) || specializationDecks[0];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('zmdinata@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleAskAgentZ = () => {
    window.dispatchEvent(
      new CustomEvent('open-chatbot', {
        detail: { message: 'Bisa jelaskan keahlian AI Zacky Muhammad Dinata?' },
      })
    );
  };

  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="profile-deck-container">
      {/* 1. Avatar & Identity Header */}
      <div className="profile-deck-top">
        <div className="bento-profile-avatar-box">
          <div className="bento-avatar-glow" aria-hidden="true" />
          <div className="bento-avatar-ring" aria-hidden="true" />
          <img
            src="/assets/images/photo.png"
            alt={name || 'Zacky Muhammad Dinata'}
            className="bento-profile-img"
          />
          <span className="profile-deck-live-dot" title="Homelab Telemetry Active" />
        </div>

        <div className="bento-profile-meta">
          <h3>{name || 'Zacky Muhammad Dinata'}</h3>
          <p className="bento-profile-role">{role || 'AI Engineer & LLM Automation Specialist'}</p>
          <div className="bento-profile-chips">
            <span className="bento-profile-chip">PyTorch</span>
            <span className="bento-profile-chip">LLMs & RAG</span>
            <span className="bento-profile-chip">Computer Vision</span>
            <span className="bento-profile-chip">Fullstack</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Specialization Mini-Deck */}
      <div className="deck-showcase-box">
        {/* Tab Navigation */}
        <div className="deck-tabs-row" role="tablist" aria-label="Bidang Spesialisasi">
          {specializationDecks.map((deck) => {
            const Icon = deck.icon;
            const isActive = activeTab === deck.id;
            return (
              <button
                key={deck.id}
                role="tab"
                id={`deck-tab-${deck.id}`}
                aria-controls={`deck-tabpanel-${deck.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(deck.id)}
                className={`deck-tab-btn ${isActive ? 'active' : ''}`}
                style={{ '--deck-accent': deck.color }}
              >
                <Icon className="deck-tab-icon" />
                <span>{deck.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Card */}
        <div
          className="deck-content-card"
          style={{ '--deck-accent': currentDeck.color }}
          role="tabpanel"
          id={`deck-tabpanel-${currentDeck.id}`}
          aria-labelledby={`deck-tab-${currentDeck.id}`}
          tabIndex={0}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDeck.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="deck-tab-body"
            >
              <div className="deck-body-top">
                <span className="deck-badge-pill">
                  {currentDeck.badge}
                </span>
                <a
                  href={currentDeck.link}
                  target="_blank"
                  rel="noreferrer"
                  className="deck-link-btn"
                  title="Lihat Detail Proyek"
                >
                  <FiExternalLink />
                </a>
              </div>

              <h4 className="deck-headline">{currentDeck.title}</h4>
              <p className="deck-metric-line">{currentDeck.metric}</p>
              <p className="deck-desc-text">
                {lang === 'en' ? currentDeck.descEn : currentDeck.desc}
              </p>

              <div className="deck-stack-tags">
                {currentDeck.stack.map((tech) => (
                  <span key={tech} className="deck-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Quick Action Buttons Bar */}
      <div className="deck-actions-bar">
        <button
          type="button"
          onClick={handleScrollToContact}
          className="deck-btn-cta"
        >
          <FiSend /> <span>{lang === 'en' ? 'Contact Zacky' : 'Hubungi Zacky'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyEmail}
          className={`deck-btn-action ${copiedEmail ? 'copied' : ''}`}
          title="Salin alamat email"
        >
          {copiedEmail ? <FiCheck className="text-green" /> : <FiCopy />}
          <span>{copiedEmail ? (lang === 'en' ? 'Copied!' : 'Tersalin!') : 'Email'}</span>
        </button>

        <button
          type="button"
          onClick={handleAskAgentZ}
          className="deck-btn-action"
          title="Tanya AI Assistant Agent-Z"
        >
          <FiMessageSquare />
          <span>Agent-Z</span>
        </button>
      </div>
    </div>
  );
}
