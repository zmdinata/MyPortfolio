import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../context/LangContext';
import { skills } from '../data/skills';
import {
  FaInstagram, FaLinkedinIn, FaGithub,
  FaChartBar, FaPaintBrush, FaCubes, FaBrain
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { FiArrowRight } from 'react-icons/fi';

/* ===== Animation Variants ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const skillIcons = {
  data: <FaChartBar />,
  design: <FaPaintBrush />,
  web3: <FaCubes />,
  ml: <FaBrain />,
};

export default function HomePage() {
  const { t, tObj } = useLang();
  
  // Parallax effects
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 800], [0, 100]);
  const heroImageY = useTransform(scrollY, [0, 800], [0, -40]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0.1]);

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="hero-section" id="home">
        {/* Particle dots */}
        <div className="hero-particles" aria-hidden="true">
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
          <div className="hero-particle"></div>
        </div>

        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={stagger}
            style={{ y: heroTextY, opacity: heroOpacity }}
          >
            <motion.div className="hero-status" variants={fadeLeft}>
              <div className="hire-status-badge">
                <span className="pulse-dot"></span>
                {t('hero.available')}
              </div>
            </motion.div>
            <motion.p className="hero-kicker" variants={fadeLeft}>
              {t('hero.kicker')}
            </motion.p>
            <motion.h1 className="hero-name gradient-text" variants={fadeUp} custom={1}>
              {t('hero.name')}
            </motion.h1>
            <motion.p className="hero-job" variants={fadeUp} custom={2}>
              {t('hero.job')}
            </motion.p>
            <motion.div className="hero-meta" variants={staggerFast} initial="hidden" animate="visible">
              <motion.span className="hero-pill" variants={scaleUp}>{t('hero.langId')}</motion.span>
              <motion.span className="hero-pill" variants={scaleUp}>{t('hero.langEn')}</motion.span>
            </motion.div>
            <motion.div className="hero-cta" variants={fadeUp} custom={4}>
              <div className="hero-cta-main">
                <Link to="/projects" className="btn-primary">
                  {t('hero.viewProjects')} <FiArrowRight />
                </Link>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="btn-secondary"
                >
                  {t('hero.contactMe')}
                </button>
              </div>
              <div className="hero-cta-sub">
                <Link to="/certificates" className="btn-outline">
                  {t('hero.viewCertificates')}
                </Link>
                <Link to="/honors" className="btn-outline">
                  {t('hero.viewHonors')}
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: heroImageY, opacity: heroOpacity }}
          >
            <div className="hero-image-ring" aria-hidden="true"></div>
            <div className="hero-image-glow" aria-hidden="true"></div>
            <div className="hero-image-container">
              <img
                src="/assets/images/photo.png"
                alt="Zacky Muhammad Dinata"
                className="hero-image"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          aria-hidden="true"
        >
          <div className="scroll-indicator-dot"></div>
          <div className="scroll-indicator-line"></div>
        </motion.div>
      </section>

      {/* ===== About Section ===== */}
      <section className="section" id="about">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeLeft}
          >
            <h2>{t('about.title')}</h2>
          </motion.div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            custom={1}
            style={{ maxWidth: '750px' }}
          >
            {t('about.content')}
          </motion.p>
        </div>
      </section>

      {/* ===== Experience Section ===== */}
      <section className="section" id="experience">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeLeft}
          >
            <h2>{t('experience.title')}</h2>
          </motion.div>
          <div className="timeline">
            {t('experience.items').map((item, idx) => (
              <motion.div
                key={idx}
                className="timeline-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeRight}
                custom={idx * 0.5}
              >
                <h3>{item.role}</h3>
                <p className="timeline-sub">{item.period}</p>
                {item.description && <p>{item.description}</p>}
                {item.responsibilities?.length > 0 && (
                  <>
                    <p style={{ fontWeight: 600, marginTop: '0.75rem', color: 'var(--text-primary)' }}>
                      {t('experience.title') === 'Pengalaman' ? 'Tanggung Jawab Utama:' : 'Key Responsibilities:'}
                    </p>
                    <ul>
                      {item.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </>
                )}
                {item.achievements?.length > 0 && (
                  <>
                    <p style={{ fontWeight: 600, marginTop: '0.75rem', color: 'var(--text-primary)' }}>
                      {t('experience.title') === 'Pengalaman' ? 'Pencapaian Utama:' : 'Key Achievements:'}
                    </p>
                    <ul>
                      {item.achievements.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Education Section ===== */}
      <section className="section" id="education">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeLeft}
          >
            <h2>{t('education.title')}</h2>
          </motion.div>
          <div className="timeline">
            {t('education.items').map((item, idx) => (
              <motion.div
                key={idx}
                className="timeline-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeRight}
              >
                <h3>{item.school}</h3>
                <p className="timeline-sub">{item.degree}</p>
                <p>{item.grade}</p>
                <p style={{ marginTop: '0.5rem' }}>{item.activities}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Skills Section ===== */}
      <section className="section" id="skills">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeLeft}
          >
            <h2>{t('skills.title')}</h2>
          </motion.div>
          <motion.div
            className="skills-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {skills.map((skill, idx) => (
              <Tilt
                key={skill.id}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                scale={1.05}
                transitionSpeed={2500}
                className="tilt-wrapper"
              >
                <motion.div
                  className="skill-card"
                  variants={scaleUp}
                  custom={idx}
                >
                  <div className="skill-card-icon">{skillIcons[skill.icon]}</div>
                  <h3>{tObj(skill.title)}</h3>
                  <p>{skill.description}</p>
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Contact Section ===== */}
      <section className="section" id="contact">
        <div className="container">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeLeft}
          >
            <h2>{t('contact.title')}</h2>
            <p>{t('contact.subtitle')}</p>
          </motion.div>
          <motion.div
            className="contact-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {[
              { href: 'https://www.instagram.com/zmdinataaa', icon: <FaInstagram />, label: 'Instagram', ext: true },
              { href: 'https://www.linkedin.com/in/zacky-muhammad-dinata-463995280', icon: <FaLinkedinIn />, label: 'LinkedIn', ext: true },
              { href: 'https://github.com/zmdinata', icon: <FaGithub />, label: 'GitHub', ext: true },
              { href: 'mailto:zmdinata@gmail.com', icon: <HiOutlineMail />, label: 'Email', ext: false },
            ].map((item, idx) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.ext ? '_blank' : undefined}
                rel={item.ext ? 'noopener noreferrer' : undefined}
                className="contact-btn"
                variants={scaleUp}
                custom={idx}
                whileHover={{
                  y: -5,
                  scale: 1.04,
                  transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] },
                }}
                whileTap={{ scale: 0.96 }}
              >
                {item.icon} {item.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
