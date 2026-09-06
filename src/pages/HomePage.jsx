import { motion } from 'framer-motion';
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
import { FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import PreviewModal from '../components/ui/PreviewModal';
import SpotlightCard from '../components/ui/SpotlightCard';
import InteractiveTerminal from '../components/ui/InteractiveTerminal';
import AiTelemetryCard from '../components/ui/AiTelemetryCard';
import ProfileInteractiveDeck from '../components/ui/ProfileInteractiveDeck';
import AmbientGridMesh from '../components/ui/AmbientGridMesh';
import { fadeLeft, fadeRight, fadeUp, scaleUp, smoothEase, stagger, staggerFast } from '../lib/motionConfig';
import { projectCategoryFallbacks, projectItemFallbacks, mergePortfolioItems } from '../lib/portfolioFallbacks';
import { getDisplayType, getFileForItem, getPreviewForItem, isLinkType } from '../lib/portfolioMedia';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const skillIcons = {
  data: <FaIcons.FaChartBar />,
  design: <FaIcons.FaPaintBrush />,
  web3: <FaIcons.FaCubes />,
  ml: <FaIcons.FaBrain />,
};

export default function HomePage() {
  const { t, tObj, lang } = useLang();

  useDocumentTitle(
    '',
    lang === 'en'
      ? 'Official portfolio of Zacky Muhammad Dinata (zmdinata) — AI Engineer & Autonomous Agent Architect. LLM Automation, Quantitative Risk, Homelab Telemetry.'
      : 'Portofolio resmi Zacky Muhammad Dinata (zmdinata) — AI Engineer & Arsitek Agen Mandiri. Otomasi LLM, Sistem Risiko Kuantitatif, dan Telemetri Homelab.'
  );

  const [profile, setProfile] = useState(null);
  const [dbExperiences, setDbExperiences] = useState([]);
  const [dbEducation, setDbEducation] = useState([]);
  const [dbSkills, setDbSkills] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState(projectItemFallbacks.filter((project) => project.is_featured).slice(0, 3));
  const [projectModal, setProjectModal] = useState({ open: false, src: '', type: '' });
  
  useEffect(() => {
    let isMounted = true;
    let featuredChannel = null;

    const loadFeaturedProjects = async () => {
      const { data: projectRows, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      const mergedProjects = mergePortfolioItems(
        !projectError ? projectRows || [] : [],
        projectItemFallbacks,
        projectCategoryFallbacks,
        'projects'
      );

      if (!isMounted) return;
      setFeaturedProjects(
        mergedProjects
          .filter((project) => project.is_featured)
          .sort((a, b) => (a.featured_order ?? 999) - (b.featured_order ?? 999))
          .slice(0, 3)
      );
    };

    const fetchData = async () => {
      const { data: prof } = await supabase.from('profile').select('*').eq('id', 1).single();
      if (prof && isMounted) setProfile(prof);

      const { data: exp } = await supabase.from('experience').select('*').order('year', { ascending: false });
      if (exp && isMounted) setDbExperiences(exp);

      const { data: edu } = await supabase.from('education').select('*').order('year_start', { ascending: false });
      if (edu && isMounted) setDbEducation(edu);

      const { data: skl } = await supabase.from('skills').select('*').order('name', { ascending: true });
      if (skl && isMounted) setDbSkills(skl);

      if (!isMounted) return;
      loadFeaturedProjects();
      featuredChannel = supabase
        .channel('home-featured-projects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, loadFeaturedProjects)
        .subscribe();
    };

    fetchData();

    return () => {
      isMounted = false;
      if (featuredChannel) supabase.removeChannel(featuredChannel);
    };
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
  
  const handleFeaturedProjectClick = (project) => {
    const type = getDisplayType(project.type);
    const file = getFileForItem(project);

    if (isLinkType(type)) {
      window.open(file, '_blank', 'noopener,noreferrer');
      return;
    }

    setProjectModal({ open: true, src: file, type });
  };

  const handleChatAgentZ = () => {
    window.dispatchEvent(
      new CustomEvent('open-chatbot', {
        detail: {
          message: lang === 'en'
            ? "Can you tell me more about Zacky's projects and skills?"
            : "Bisa ceritakan lebih banyak tentang proyek dan keahlian Zacky?",
        },
      })
    );
  };

  return (
    <>
      {/* ===== Bento Hero Section ===== */}
      <section className="bento-hero-section" id="home">
        <AmbientGridMesh />

        <motion.div
          className="bento-grid"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Card 1: Main Hero Identity Card */}
          <SpotlightCard className="bento-card-main" spotlightColor="rgba(124, 111, 255, 0.18)">
            <div>
              <div className="bento-hero-badge-row">
                {isAvailable && (
                  <div className="bento-avail-badge">
                    <span className="bento-avail-beacon"></span>
                    {t('hero.available')}
                  </div>
                )}
                <span className="bento-kicker">{t('bento.kicker')}</span>
              </div>
              <motion.h1 className="bento-hero-title gradient-text" variants={fadeUp}>
                {t('hero.name')}
              </motion.h1>
              <p className="bento-hero-bio">
                {heroJob}
              </p>
            </div>

            <div>
              <div className="hero-meta" style={{ marginBottom: '1.5rem' }}>
                <span className="hero-pill">{t('hero.langId')}</span>
                <span className="hero-pill">{t('hero.langEn')}</span>
              </div>

              <div className="bento-hero-actions">
                {/* Row 1: 100% Full-Width Primary CTA */}
                <Link to="/projects" className="btn-primary">
                  {t('hero.viewProjects')} <FiArrowRight />
                </Link>

                {/* Row 2: 50:50 Dynamic Action Pair */}
                <button 
                  type="button"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="btn-secondary"
                >
                  {t('hero.contactMe')}
                </button>
                <button
                  type="button"
                  onClick={handleChatAgentZ}
                  className="btn-secondary btn-hero-agentz"
                  title="Chat dengan AI Assistant Agent-Z"
                >
                  <FiMessageSquare /> <span>Chat Agent-Z</span>
                </button>

                {/* Row 3: 50:50 Credential Pair */}
                <Link to="/certificates" className="btn-outline">
                  {t('hero.viewCertificates')}
                </Link>
                <Link to="/honors" className="btn-outline">
                  {t('hero.viewHonors')}
                </Link>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Interactive Profile Showcase Deck */}
          <SpotlightCard className="bento-card-profile" borderBeam={true} spotlightColor="rgba(0, 221, 179, 0.18)">
            <ProfileInteractiveDeck name={t('hero.name')} role={t('bento.role')} />
          </SpotlightCard>

          {/* Card 3: Interactive Terminal Card */}
          <div className="bento-card-terminal">
            <InteractiveTerminal />
          </div>

          {/* Card 4: AI Telemetry & Stack Card */}
          <SpotlightCard className="bento-card-telemetry" spotlightColor="rgba(0, 221, 179, 0.16)">
            <AiTelemetryCard />
          </SpotlightCard>

          {/* Card 5: Metrics & Impact Overview */}
          <SpotlightCard className="bento-card-metrics" borderBeam={false} spotlightColor="rgba(124, 111, 255, 0.14)">
            <div className="bento-metrics-grid">
              <div className="bento-metric-col">
                <span className="bento-metric-num gradient-text">24+</span>
                <span className="bento-metric-label">{t('bento.metrics.projects')}</span>
              </div>
              <div className="bento-metric-col">
                <span className="bento-metric-num gradient-text">14+</span>
                <span className="bento-metric-label">{t('bento.metrics.models')}</span>
              </div>
              <div className="bento-metric-col">
                <span className="bento-metric-num gradient-text">18+</span>
                <span className="bento-metric-label">{t('bento.metrics.certifications')}</span>
              </div>
              <div className="bento-metric-col">
                <span className="bento-metric-num gradient-text">5+</span>
                <span className="bento-metric-label">{t('bento.metrics.honors')}</span>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

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
                    <motion.div variants={scaleUp} custom={idx} style={{ height: '100%' }}>
                      <SpotlightCard
                        className="project-card featured-project-card"
                        borderBeam={true}
                        spotlightColor="rgba(0, 221, 179, 0.18)"
                        onClick={() => handleFeaturedProjectClick(project)}
                      >
                        <div className="project-card-link">
                          {isLinkType(type) && <span className="external-badge">Link</span>}
                          <img
                            src={getPreviewForItem(project, getFileForItem(project) || '/assets/images/preview.png')}
                            alt={lang === 'en' ? (project.title_en || project.title?.en) : (project.title_id || project.title?.id)}
                            className="project-image-preview"
                            loading="lazy"
                            onError={(event) => {
                              const fallbackSrc = getFileForItem(project) || '/assets/images/preview.png';
                              if (event.currentTarget.src !== new URL(fallbackSrc, window.location.origin).href) {
                                event.currentTarget.src = fallbackSrc;
                              }
                            }}
                          />
                          <div className="project-card-title">
                            {lang === 'en' ? (project.title_en || project.title?.en) : (project.title_id || project.title?.id)}
                          </div>
                        </div>
                      </SpotlightCard>
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
