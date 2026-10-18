import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import { FiSun, FiMoon, FiUser, FiLayers, FiAward, FiStar } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { smoothSpring } from '../../lib/motionConfig';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const { data } = await supabase.from('profile').select('available_for_hire').eq('id', 1).single();
      if (data && isMounted) setIsAvailable(data.available_for_hire);
    };
    fetchStatus();

    const channel = supabase
      .channel('navbar-profile-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, fetchStatus)
      .subscribe();

    window.addEventListener('focus', fetchStatus);

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      window.removeEventListener('focus', fetchStatus);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { to: '/', label: t('nav.aboutMe'), icon: FiUser },
    { to: '/projects', label: t('nav.project'), icon: FiLayers },
    { to: '/certificates', label: t('nav.certification'), icon: FiAward },
    { to: '/honors', label: t('nav.honor'), icon: FiStar },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 1. Desktop Floating MacOS Dock (Visible on Desktop >= 1025px) */}
      <motion.nav
        className={`floating-dock-desktop${scrolled ? ' scrolled' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Desktop Navigation"
      >
        <div className="dock-logo-section">
          <Link to="/" className="dock-logo">ZMDINATA</Link>
          {isAvailable && (
            <div className="dock-hire-badge" title={t('hero.available')}>
              <span className="pulse-dot"></span>
              <span className="dock-hire-text">{t('hero.available')}</span>
            </div>
          )}
        </div>

        <div className="dock-divider" aria-hidden="true" />

        <ul className="dock-menu">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <li key={to} className="dock-item">
                <Link to={to} className={`dock-link${active ? ' active' : ''}`}>
                  {active && (
                    <motion.span
                      layoutId="desktopDockActivePill"
                      className="dock-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="dock-link-icon" />
                  <span className="dock-link-label">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="dock-divider" aria-hidden="true" />

        <div className="dock-actions">
          <motion.button
            className="dock-action-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            whileTap={{ scale: 0.88, rotate: 180 }}
            transition={smoothSpring}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </motion.button>
          <motion.button
            className="dock-action-btn dock-lang-btn"
            onClick={toggleLang}
            aria-label="Toggle language"
            whileTap={{ scale: 0.88 }}
          >
            {lang === 'en' ? 'ID' : 'EN'}
          </motion.button>
        </div>
      </motion.nav>

      {/* 2. Mobile Top Brand Bar (Minimalist Header on Mobile & Tablet <= 1024px) */}
      <header className="mobile-top-brand" aria-label="Brand Header">
        <Link to="/" className="mobile-brand-logo">ZMDINATA</Link>
        {isAvailable && (
          <div className="mobile-brand-badge">
            <span className="pulse-dot"></span>
            <span>{t('hero.available')}</span>
          </div>
        )}
      </header>

      {/* 3. Mobile Bottom Floating Capsule Dock (Thumb-friendly on Mobile & Tablet <= 1024px) */}
      <motion.nav
        className="mobile-bottom-dock"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Mobile Navigation Dock"
      >
        <div className="mobile-dock-inner">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`mobile-dock-tab${active ? ' active' : ''}`}
                aria-label={label}
              >
                {active && (
                  <motion.span
                    layoutId="mobileDockActiveBubble"
                    className="mobile-dock-active-bubble"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className="mobile-dock-icon" />
                {active && <span className="mobile-dock-label">{label}</span>}
              </Link>
            );
          })}

          <div className="mobile-dock-divider" aria-hidden="true" />

          {/* Quick Actions: Theme & Language */}
          <button
            className="mobile-dock-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <button
            className="mobile-dock-btn mobile-dock-lang"
            onClick={toggleLang}
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'ID' : 'EN'}
          </button>
        </div>
      </motion.nav>
    </>
  );
}
