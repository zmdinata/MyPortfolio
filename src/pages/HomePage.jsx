import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLang } from '../context/LangContext';
import { skills } from '../data/skills';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as FiIcons from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { FiArrowRight } from 'react-icons/fi';
import HeroAnimation from '../components/ui/HeroAnimation';
import PreviewModal from '../components/ui/PreviewModal';
import { fadeLeft, fadeRight, fadeUp, scaleUp, smoothEase, stagger, staggerFast } from '../lib/motionConfig';
import { projectItemFallbacks } from '../lib/portfolioFallbacks';
import { getDisplayType, getFileForItem, getPreviewForItem, isLinkType } from '../lib/portfolioMedia';

const skillIcons = {
  data: <FaIcons.FaChartBar />,
  design: <FaIcons.FaPaintBrush />,
  web3: <FaIcons.FaCubes />,
  ml: <FaIcons.FaBrain />,
};

export default function HomePage() {
  const { t, tObj, lang } = useLang();
  const [profile, setProfile] = useState(null);
  const [dbExperiences, setDbExperiences] = useState([]);
  const [dbEducation, setDbEducation] = useState([]);
  const [dbSkills, setDbSkills] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState(projectItemFallbacks.filter((project) => project.is_featured).slice(0, 3));
  const [projectModal, setProjectModal] = useState({ open: false, src: '', type: '' });
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).single();
      if (prof) setProfile(prof);

      const { data: exp } = await supabase.from('experience').select('*').order('year', { ascending: false });
      if (exp) setDbExperiences(exp);

      const { data: edu } = await supabase.from('education').select('*').order('year_start', { ascending: false });
      if (edu) setDbEducation(edu);

      const { data: skl } = await supabase.from('skills').select('*').order('name', { ascending: true });
      if (skl) setDbSkills(skl);

      const { data: featured, error: featuredError } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('featured_order', { ascending: true });
      if (!featuredError && featured?.length) setFeaturedProjects(featured.slice(0, 3));
    };
    fetchData();
  }, []);

  // Helpers for icons
  const getSkillIcon = (iconName) => {
    const Icon = FaIcons[iconName] || SiIcons[iconName] || FiIcons[iconName];
    return Icon ? <Icon /> : <FaIcons.FaBrain />;
  };

  const formatPeriod = (start, end, loc_en, loc_id, type) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    const options = { month: 'short', year: 'numeric' };
    const startStr = startDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', options);
    const endStr = end ? new Date(end).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', options) : (lang === 'en' ? 'Present' : 'Saat ini');
    
    // Duration
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    months = Math.max(1, months);
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    let durStr = '';
    if (years > 0) durStr += `${years} yr${years > 1 ? 's' : ''} `;
    if (remMonths > 0 || years === 0) durStr += `${remMonths} mo${remMonths > 1 ? 's' : ''}`;

    const location = lang === 'en' ? loc_en : loc_id;
    
    return `${startStr} — ${endStr} · ${durStr.trim()} · ${location} · ${type}`;
  };

  // Fallback Logic
  const experiences = dbExperiences.length > 0 ? dbExperiences.map(e => ({
    role: lang === 'en' ? e.role_en : e.role_id,
    company: lang === 'en' ? e.company_en : e.company_id,
    period: formatPeriod(e.date_start, e.date_end, e.location_en, e.location_id, e.work_type),
    description: lang === 'en' ? e.description_en : e.description_id,
    responsibilities: e.responsibilities || [],
    achievements: e.achievements || []
  })) : t('experience.items');

  const education = dbEducation.length > 0 ? dbEducation.map(e => ({
    school: e.school,
    degree: lang === 'en' ? e.level_en : e.level_id,
    major: lang === 'en' ? e.major_en : e.major_id,
    period: formatPeriod(e.date_start, e.date_end, 'Global', 'Global', '').split('·')[0].trim(), // Reusing formatPeriod but ignoring location/type
    grade_type: e.grade_type,
    grade_value: e.grade_value,
    description: lang === 'en' ? e.description_en : e.description_id
  })) : t('education.items');

  const displaySkills = dbSkills.length > 0 ? dbSkills : [];

  // Data dynamic from Supabase (fallback to translations)
  const heroJob = profile ? (lang === 'en' ? profile.hero_description_en : profile.hero_description_id) : t('hero.job');
  const aboutContent = profile ? (lang === 'en' ? profile.about_description_en : profile.about_description_id) : t('about.content');
  const isAvailable = profile ? profile.available_for_hire : true;
  
  // Parallax effects
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 800], [0, 100]);
  const heroImageY = useTransform(scrollY, [0, 800], [0, -40]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0.1]);

  const handleFeaturedProjectClick = (project) => {
    const type = getDisplayType(project.type);
    const file = getFileForItem(project);

    if (isLinkType(type)) {
      window.open(file, '_blank', 'noopener,noreferrer');
      return;
    }

    setProjectModal({ open: true, src: file, type });
  };

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="hero-section" id="home">
        <HeroAnimation />
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
            {isAvailable && (
              <motion.div className="hero-status" variants={fadeLeft}>
                <div className="hire-status-badge">
                  <span className="pulse-dot"></span>
                  {t('hero.available')}
                </div>
              </motion.div>
            )}
            <motion.p className="hero-kicker" variants={fadeLeft}>
              {t('hero.kicker')}
            </motion.p>
            <motion.h1 className="hero-name gradient-text" variants={fadeUp} custom={1}>
              {t('hero.name')}
            </motion.h1>
            <motion.p className="hero-job" variants={fadeUp} custom={2}>
              {heroJob}
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
            transition={{ duration: 1, delay: 0.12, ease: smoothEase }}
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
          transition={{ delay: 1.15, duration: 0.7, ease: smoothEase }}
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
            {aboutContent}
          </motion.p>
        </div>
      </section>

      {/* ===== Featured Projects Section ===== */}
      {featuredProjects.length > 0 && (
        <section className="section featured-projects-section" id="featured-projects">
          <div className="container">
            <motion.div
              className="section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeLeft}
            >
              <h2>{t('featuredProjects.title')}</h2>
              <p>{t('featuredProjects.subtitle')}</p>
            </motion.div>
            <motion.div
              className="featured-projects-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              {featuredProjects.map((project, idx) => {
                const type = getDisplayType(project.type);
                return (
                  <Tilt
                    key={project.id}
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    scale={1.03}
                    transitionSpeed={2500}
                    className="tilt-wrapper"
                  >
                    <motion.div
                      className="project-card featured-project-card"
                      variants={scaleUp}
                      custom={idx}
                      onClick={() => handleFeaturedProjectClick(project)}
                    >
                      <div className="project-card-link">
                        {isLinkType(type) && <span className="external-badge">Link</span>}
                        <img
                          src={getPreviewForItem(project, '/assets/images/preview.png')}
                          alt={lang === 'en' ? project.title_en : project.title_id}
                          className="project-image-preview"
                          loading="lazy"
                        />
                        <div className="project-card-title">
                          {lang === 'en' ? project.title_en : project.title_id}
                        </div>
                      </div>
                    </motion.div>
                  </Tilt>
                );
              })}
            </motion.div>
            <motion.div
              className="featured-projects-cta"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
            >
              <Link to="/projects" className="btn-outline">
                {t('featuredProjects.viewAll')} <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

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
            {experiences.map((item, idx) => (
              <motion.div
                key={idx}
                className="timeline-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeRight}
                custom={idx * 0.5}
              >
                <h3 style={{ marginBottom: '0.2rem' }}>{item.role}</h3>
                {item.company && <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#00d2ff', marginBottom: '0.5rem' }}>{item.company}</div>}
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
            {education.map((item, idx) => (
              <motion.div
                key={idx}
                className="timeline-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeRight}
              >
                <h3>{item.school}</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#00d2ff' }}>{item.degree}</span>
                  {item.major && (
                    <>
                      <span style={{ opacity: 0.5 }}>•</span>
                      <span style={{ opacity: 0.8 }}>{item.major}</span>
                    </>
                  )}
                </div>
                <p className="timeline-sub">{item.period || item.years}</p>
                {item.grade_type && item.grade_type !== 'None' && (
                  <p style={{ fontWeight: 600, marginTop: '0.5rem', display: 'inline-block', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.grade_type}: {item.grade_value}
                  </p>
                )}
                {item.grade && !item.grade_type && (
                  <p style={{ fontWeight: 600, marginTop: '0.5rem', display: 'inline-block', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.grade}
                  </p>
                )}
                <p style={{ marginTop: '0.75rem' }}>{item.description || item.activities}</p>
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
            {displaySkills.length > 0 ? displaySkills.map((skill, idx) => (
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
                  <div className="skill-card-icon" style={{ color: 'var(--text-primary)' }}>{getSkillIcon(skill.icon)}</div>
                  <h3>{skill.name}</h3>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '10px' }}>{lang === 'en' ? skill.description_en : skill.description_id}</p>
                </motion.div>
              </Tilt>
            )) : skills.map((skill, idx) => (
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
              { href: 'https://www.instagram.com/zmdinataaa', icon: <FaIcons.FaInstagram />, label: 'Instagram', ext: true },
              { href: 'https://www.linkedin.com/in/zacky-muhammad-dinata-463995280', icon: <FaIcons.FaLinkedinIn />, label: 'LinkedIn', ext: true },
              { href: 'https://github.com/zmdinata', icon: <FaIcons.FaGithub />, label: 'GitHub', ext: true },
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
                  transition: { duration: 0.28, ease: smoothEase },
                }}
                whileTap={{ scale: 0.96 }}
              >
                {item.icon} {item.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <PreviewModal
        isOpen={projectModal.open}
        onClose={() => setProjectModal({ open: false, src: '', type: '' })}
        src={projectModal.src}
        type={projectModal.type}
      />
    </>
  );
}
