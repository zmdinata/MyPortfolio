import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Award,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { CategoryIcon } from '../../lib/categoryIcons';
import { useLang } from '../../context/LangContext';
import { useTheme } from '../../context/ThemeContext';
import { DEFAULT_PROFILE_CONFIG } from '../../lib/profileConfig';
import SpotlightCard from './SpotlightCard';

/**
 * UnifiedHeroProfileCard - Kartu Profil Eksekutif Terpadu (Span 12 Bento)
 * Menggabungkan Hero Identity Card & Profile Interactive Deck menjadi 1 kartu
 * berstandar LinkedIn profesional tanpa redundansi konten.
 * Mendukung foto sampul HD (16:5), tata letak avatar di kiri & teks di kanan
 * untuk semua perangkat (Desktop, Tablet, Mobile), 3 tab spesialisasi, dan deskripsi lengkap.
 */
export default function UnifiedHeroProfileCard({
  profile,
  profileConfig = DEFAULT_PROFILE_CONFIG,
  isAvailable = true,
  heroJob,
  aboutContent,
  ...props
}) {
  const { lang, t } = useLang();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('llm');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const getDeckAccent = (color) => {
    if (theme === 'light') {
      if (!color || color === '#00d2ff' || color === '#00ddb3') return 'var(--accent-primary)';
      return color;
    }
    return color || 'var(--accent-secondary)';
  };

  const decks = profileConfig.specialization_decks || DEFAULT_PROFILE_CONFIG.specialization_decks;
  const currentDeck = decks.find((d) => d.id === activeTab) || decks[0] || DEFAULT_PROFILE_CONFIG.specialization_decks[0];
  const chips = profileConfig.chips || DEFAULT_PROFILE_CONFIG.chips;
  const emailToCopy = profileConfig.email || 'zmdinata@gmail.com';
  const avatarSrc = profileConfig.avatar_url || '/assets/images/photo.png';
  const coverSrc = profileConfig.cover_url || '';
  const displayName = profileConfig.full_name || t('hero.name') || 'Zacky Muhammad Dinata';
  const displayRole = profileConfig.hero_role || t('bento.role') || 'AI Engineer & Autonomous Systems Architect';

  // Fallback hero subtitle bio
  const bioText = heroJob || (lang === 'en'
    ? 'AI Engineer & Autonomous Agent Architect | Quantitative Risk Systems & LLM Automation | Full Scholarship Graduate at Pijak x IBM SkillsBuild'
    : 'AI Engineer & Arsitek Agen Mandiri | Sistem Risiko Kuantitatif & Otomasi LLM | Lulusan Beasiswa Penuh di Pijak x IBM SkillsBuild');

  // Full about summary text
  const fullAboutText = aboutContent || (lang === 'en'
    ? (profile?.about_description_en || 'Specialized in developing resilient Multi-Agent Swarms, Sovereign RAG architectures, and deterministic LLM orchestration pipelines with self-hosted homelab telemetry.')
    : (profile?.about_description_id || 'Berfokus pada pengembangan Multi-Agent Swarms mandiri, arsitektur Sovereign RAG berlatensi rendah, serta orkestrasi LLM deterministik yang didukung telemetri homelab self-hosted.'));

  // Dynamic Executive Highlights text (Core Architecture & Production Standard)
  const coreArchText = lang === 'en'
    ? (profileConfig.core_architecture_en || profileConfig.core_architecture_id || DEFAULT_PROFILE_CONFIG.core_architecture_en)
    : (profileConfig.core_architecture_id || profileConfig.core_architecture_en || DEFAULT_PROFILE_CONFIG.core_architecture_id);

  const prodStandardText = lang === 'en'
    ? (profileConfig.production_standard_en || profileConfig.production_standard_id || DEFAULT_PROFILE_CONFIG.production_standard_en)
    : (profileConfig.production_standard_id || profileConfig.production_standard_en || DEFAULT_PROFILE_CONFIG.production_standard_id);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleChatAgentZ = () => {
    window.dispatchEvent(
      new CustomEvent('open-chatbot', {
        detail: {
          message: lang === 'en'
            ? `Can you tell me more about ${displayName}'s projects and AI architecture expertise?`
            : `Bisa ceritakan lebih banyak tentang proyek dan arsitektur AI dari ${displayName}?`,
        },
      })
    );
  };

  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SpotlightCard
      className="bento-card-unified-hero"
      spotlightColor="var(--glow-color)"
      borderBeam={true}
      {...props}
    >
      {/* 1. HD Cover Banner Header (Fixed Aspect Ratio 16:5) */}
      <div className="unified-cover-wrapper">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`${displayName} Cover Banner`}
            className="unified-cover-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.classList.add('unified-cover-fallback');
            }}
          />
        ) : (
          <div className="unified-cover-gradient" aria-hidden="true">
            <div className="unified-cover-mesh" />
            <div className="unified-cover-particles" />
          </div>
        )}
        <div className="unified-cover-vignette" aria-hidden="true" />
      </div>

      <div className="unified-content-body">
        {/* 2. Primary Identity Row: Avatar di KIRI, Teks & Identitas di KANAN (Desktop, Tablet, Mobile) */}
        <div className="unified-identity-header">
          {/* Sisi Kiri: Foto Profil Avatar dengan Ring Halo & Status Beacon */}
          <div className="unified-avatar-container">
            <div className="unified-avatar-ring">
              <img
                src={avatarSrc}
                alt={displayName}
                className="unified-avatar-img"
                onError={(e) => {
                  if (e.currentTarget.src !== new URL('/assets/images/photo.png', window.location.origin).href) {
                    e.currentTarget.src = '/assets/images/photo.png';
                  }
                }}
              />
              {isAvailable && (
                <span className="unified-beacon-dot" title={lang === 'en' ? 'Available for Hire' : 'Tersedia untuk Kerja'} />
              )}
            </div>
          </div>

          {/* Sisi Kanan Atas: Badge Status (Di Atas), Nama Utama, Headline */}
          <div className="unified-identity-details">
            {isAvailable && (
              <div className="unified-avail-badge">
                <span className="bento-avail-beacon" />
                <span>{t('hero.available')}</span>
              </div>
            )}

            <div className="unified-name-row">
              <div className="unified-name-group">
                <h1 className="unified-title gradient-text">{displayName}</h1>
                <span className="unified-verified-icon" title={lang === 'en' ? 'Verified Candidate' : 'Kandidat Terverifikasi'}>
                  <ShieldCheck size={18} />
                </span>
              </div>
            </div>

            <p className="unified-role-headline">{displayRole}</p>
          </div>

          {/* Sisi Bawah / Ekstensi Identitas: Bio, Bahasa, Chips, dan Tombol Aksi */}
          <div className="unified-identity-body">
            <p className="unified-bio-subtitle">{bioText}</p>

            {/* Meta row: Languages & Key Tech Chips */}
            <div className="unified-meta-row">
              <div className="unified-lang-badges">
                <span className="unified-pill-lang">{profileConfig.languages?.id || t('hero.langId') || 'Indonesian (Native)'}</span>
                <span className="unified-pill-lang">{profileConfig.languages?.en || t('hero.langEn') || 'English (Professional Working)'}</span>
              </div>

              <div className="unified-chips-wrap">
                {chips.slice(0, 6).map((chip) => (
                  <span key={chip} className="unified-chip-item">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Action Buttons Hierarchy (Tiered Hierarchy Tanpa Redundansi) */}
            <div className="unified-actions-tier">
              {/* Row 1: Primary Action Group */}
              <div className="unified-actions-row-primary">
                <Link to="/projects" className="unified-btn-primary">
                  <span>{t('hero.viewProjects')}</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  onClick={handleScrollToContact}
                  className="unified-btn-secondary"
                  title={lang === 'en' ? 'Contact directly via form' : 'Hubungi langsung melalui formulir kontak'}
                >
                  <Send size={15} />
                  <span>{lang === 'en' ? `Contact ${displayName.split(' ')[0]}` : `Hubungi ${displayName.split(' ')[0]}`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`unified-btn-action ${copiedEmail ? 'copied' : ''}`}
                  title={lang === 'en' ? 'Copy email address to clipboard' : 'Salin alamat email ke clipboard'}
                >
                  {copiedEmail ? <Check size={15} className="text-green" /> : <Copy size={15} />}
                  <span>{copiedEmail ? (lang === 'en' ? 'Copied!' : 'Tersalin!') : 'Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleChatAgentZ}
                  className="unified-btn-action unified-btn-agentz"
                  title={lang === 'en' ? 'Ask AI Assistant Agent-Z' : 'Tanya AI Assistant Agent-Z'}
                >
                  <MessageSquare size={15} />
                  <span>Agent-Z</span>
                </button>
              </div>

              {/* Row 2: Credential & Validation Links */}
              <div className="unified-actions-row-secondary">
                <Link to="/certificates" className="unified-btn-credential">
                  <Award size={14} />
                  <span>{t('hero.viewCertificates')}</span>
                </Link>

                <Link to="/honors" className="unified-btn-credential">
                  <Sparkles size={14} />
                  <span>{t('hero.viewHonors')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Lower Content Split: Ringkasan Eksekutif (Kiri) & 3 Tab Spesialisasi Interaktif (Kanan) */}
        <div className="unified-lower-split">
          {/* Kolom Kiri: Ringkasan Eksekutif (About Zacky) */}
          <div className="unified-col-about">
            <div className="unified-section-label">
              <User size={15} />
              <span>{lang === 'en' ? 'Executive Summary & Bio' : 'Ringkasan Eksekutif & Deskripsi Lengkap'}</span>
            </div>
            <div className="unified-about-box">
              <p className="unified-about-text">{fullAboutText}</p>
              
              <div className="unified-about-highlights">
                <div className="unified-highlight-item">
                  <span className="unified-hl-dot" />
                  <div>
                    <strong>{lang === 'en' ? 'Core Architecture:' : 'Arsitektur Utama:'}</strong>{' '}
                    <span>{coreArchText}</span>
                  </div>
                </div>
                <div className="unified-highlight-item">
                  <span className="unified-hl-dot" />
                  <div>
                    <strong>{lang === 'en' ? 'Production Standard:' : 'Standar Produksi:'}</strong>{' '}
                    <span>{prodStandardText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: 3 Tab Spesialisasi Interaktif (Specialization Decks) */}
          <div className="unified-col-decks">
            <div className="unified-section-label">
              <FileText size={15} />
              <span>{lang === 'en' ? 'Specialization & Featured Artifacts' : 'Spesialisasi & Proyek Unggulan'}</span>
            </div>

            <div className="unified-deck-card">
              {/* Tab Navigation */}
              <div className="unified-deck-tabs" role="tablist" aria-label={lang === 'en' ? 'Specialization Areas' : 'Bidang Spesialisasi'}>
                {decks.map((deck) => {
                  const iconName = deck.icon || (deck.id === 'workflow' ? 'zap' : deck.id === 'ml' ? 'activity' : 'cpu');
                  const isActive = activeTab === deck.id;
                  return (
                    <button
                      key={deck.id}
                      role="tab"
                      id={`unified-deck-tab-${deck.id}`}
                      aria-controls={`unified-deck-panel-${deck.id}`}
                      aria-selected={isActive}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveTab(deck.id)}
                      className={`unified-deck-tab-btn ${isActive ? 'active' : ''}`}
                      style={{ '--deck-accent': getDeckAccent(deck.color) }}
                    >
                      <CategoryIcon name={iconName} className="deck-tab-icon" size={15} />
                      <span>{deck.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <div
                className="unified-deck-tabpanel"
                style={{ '--deck-accent': getDeckAccent(currentDeck.color) }}
                role="tabpanel"
                id={`unified-deck-panel-${currentDeck.id}`}
                aria-labelledby={`unified-deck-tab-${currentDeck.id}`}
                tabIndex={0}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDeck.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="unified-deck-body"
                  >
                    <div className="unified-deck-header">
                      <span className="unified-deck-badge">{currentDeck.badge}</span>
                      {currentDeck.link && (
                        <a
                          href={currentDeck.link}
                          target="_blank"
                          rel="noreferrer"
                          className="unified-deck-link"
                          title={lang === 'en' ? 'Open Related Project' : 'Buka Proyek Terkait'}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    <h4 className="unified-deck-title">{currentDeck.title}</h4>
                    <p className="unified-deck-metric">{currentDeck.metric}</p>
                    <p className="unified-deck-desc">
                      {lang === 'en' ? (currentDeck.descEn || currentDeck.desc) : currentDeck.desc}
                    </p>

                    <div className="unified-deck-tags">
                      {(currentDeck.stack || []).map((tech) => (
                        <span key={tech} className="unified-tag-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
