import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { CategoryIcon } from '../../lib/categoryIcons';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { getLocalProfileConfig, fetchFullProfile, DEFAULT_PROFILE_CONFIG } from '../../lib/profileConfig';

export default function ProfileInteractiveDeck({ name, role }) {
  const { lang } = useLang();
  const { theme } = useTheme();
  const [profileConfig, setProfileConfig] = useState(getLocalProfileConfig());
  const [activeTab, setActiveTab] = useState('llm');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const getDeckAccent = (color) => {
    if (theme === 'light') {
      if (!color || color === '#00d2ff' || color === '#00ddb3') return 'var(--accent-primary)';
      return color;
    }
    return color || 'var(--accent-secondary)';
  };

  useEffect(() => {
    let isMounted = true;

    // Load initial profile config
    fetchFullProfile().then((cfg) => {
      if (isMounted && cfg) {
        setProfileConfig(cfg);
      }
    });

    const handleProfileUpdate = (e) => {
      if (isMounted && e.detail) {
        setProfileConfig((prev) => ({
          ...prev,
          ...e.detail,
        }));
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  const decks = profileConfig.specialization_decks || DEFAULT_PROFILE_CONFIG.specialization_decks;
  const currentDeck = decks.find((d) => d.id === activeTab) || decks[0] || DEFAULT_PROFILE_CONFIG.specialization_decks[0];
  const chips = profileConfig.chips || DEFAULT_PROFILE_CONFIG.chips;
  const emailToCopy = profileConfig.email || 'zmdinata@gmail.com';
  const avatarSrc = profileConfig.avatar_url || '/assets/images/photo.png';
  const displayName = profileConfig.full_name || name || 'Zacky Muhammad Dinata';
  const displayRole = profileConfig.hero_role || role || 'AI Engineer & Multi-Agent Architect';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleAskAgentZ = () => {
    window.dispatchEvent(
      new CustomEvent('open-chatbot', {
        detail: {
          message: lang === 'en'
            ? `Can you explain ${displayName}'s AI expertise and projects?`
            : `Bisa jelaskan keahlian AI dan proyek ${displayName}?`,
        },
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
            src={avatarSrc}
            alt={displayName}
            className="bento-profile-img"
            onError={(e) => {
              if (e.currentTarget.src !== new URL('/assets/images/photo.png', window.location.origin).href) {
                e.currentTarget.src = '/assets/images/photo.png';
              }
            }}
          />
          <span
            className="profile-deck-live-dot"
            title={lang === 'en' ? 'Homelab Telemetry Active' : 'Telemetri Homelab Aktif'}
          />
        </div>

        <div className="bento-profile-meta">
          <h3>{displayName}</h3>
          <p className="bento-profile-role">{displayRole}</p>
          <div className="bento-profile-chips">
            {chips.map((chip) => (
              <span key={chip} className="bento-profile-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Specialization Mini-Deck */}
      <div className="deck-showcase-box">
        {/* Tab Navigation */}
        <div className="deck-tabs-row" role="tablist" aria-label={lang === 'en' ? 'Specialization Areas' : 'Bidang Spesialisasi'}>
          {decks.map((deck) => {
            const iconName = deck.icon || (deck.id === 'workflow' ? 'zap' : deck.id === 'ml' ? 'activity' : 'cpu');
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
                style={{ '--deck-accent': getDeckAccent(deck.color) }}
              >
                <CategoryIcon name={iconName} className="deck-tab-icon" size={16} />
                <span>{deck.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Card */}
        <div
          className="deck-content-card"
          style={{ '--deck-accent': getDeckAccent(currentDeck.color) }}
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
                {currentDeck.link && (
                  <a
                    href={currentDeck.link}
                    target="_blank"
                    rel="noreferrer"
                    className="deck-link-btn"
                    title={lang === 'en' ? 'View Project Details' : 'Lihat Detail Proyek'}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <h4 className="deck-headline">{currentDeck.title}</h4>
              <p className="deck-metric-line">{currentDeck.metric}</p>
              <p className="deck-desc-text">
                {lang === 'en' ? (currentDeck.descEn || currentDeck.desc) : currentDeck.desc}
              </p>

              <div className="deck-stack-tags">
                {(currentDeck.stack || []).map((tech) => (
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
          <Send size={15} /> <span>{lang === 'en' ? `Contact ${displayName.split(' ')[0]}` : `Hubungi ${displayName.split(' ')[0]}`}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyEmail}
          className={`deck-btn-action ${copiedEmail ? 'copied' : ''}`}
          title={lang === 'en' ? 'Copy email address' : 'Salin alamat email'}
        >
          {copiedEmail ? <Check size={15} className="text-green" /> : <Copy size={15} />}
          <span>{copiedEmail ? (lang === 'en' ? 'Copied!' : 'Tersalin!') : 'Email'}</span>
        </button>

        <button
          type="button"
          onClick={handleAskAgentZ}
          className="deck-btn-action"
          title={lang === 'en' ? 'Ask AI Assistant Agent-Z' : 'Tanya AI Assistant Agent-Z'}
        >
          <MessageSquare size={15} />
          <span>Agent-Z</span>
        </button>
      </div>
    </div>
  );
}
