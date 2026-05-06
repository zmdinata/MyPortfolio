import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { smoothEase, smoothSpring } from '../../lib/motionConfig';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.34, ease: smoothEase, staggerChildren: 0.055 } },
  exit: { opacity: 0, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.48, ease: smoothEase } },
  exit: { opacity: 0, y: -8, filter: 'blur(3px)', transition: { duration: 0.18 } },
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase.from('profile').select('available_for_hire').eq('id', 1).single();
      if (data) setIsAvailable(data.available_for_hire);
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/', label: t('nav.aboutMe') },
    { to: '/projects', label: t('nav.project') },
    { to: '/certificates', label: t('nav.certification') },
    { to: '/honors', label: t('nav.honor') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="nav-logo-group">
            <Link to="/" className="nav-logo">ZMDINATA</Link>
            {isAvailable && (
              <div className="hire-status-badge hide-mobile">
                <span className="pulse-dot"></span>
                {t('hero.available')}
              </div>
            )}
          </div>

          <ul className="nav-menu">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link${isActive(to) ? ' active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <motion.button
              className="toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              whileTap={{ scale: 0.85, rotate: 180 }}
              transition={smoothSpring}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </motion.button>
            <motion.button
              className="toggle-btn lang-toggle"
              onClick={toggleLang}
              aria-label="Toggle language"
              whileTap={{ scale: 0.85 }}
            >
              {lang === 'en' ? 'ID' : 'EN'}
            </motion.button>
          </div>

          <button
            className={`nav-hamburger${mobileOpen ? ' active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-overlay active"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map(({ to, label }) => (
              <motion.div key={to} variants={linkVariants}>
                <Link
                  to={to}
                  className={`mobile-nav-link${isActive(to) ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div className="mobile-nav-actions" variants={linkVariants}>
              <motion.button
                className="toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                whileTap={{ scale: 0.85, rotate: 180 }}
                transition={smoothSpring}
              >
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
              </motion.button>
              <motion.button
                className="toggle-btn lang-toggle"
                onClick={toggleLang}
                aria-label="Toggle language"
                whileTap={{ scale: 0.85 }}
              >
                {lang === 'en' ? 'ID' : 'EN'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
