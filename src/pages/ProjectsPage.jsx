import { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../context/LangContext';
import { projects, projectCategories } from '../data/projects';
import PreviewModal from '../components/ui/PreviewModal';
import { HiOutlineExternalLink } from 'react-icons/hi';
import {
  FaChartBar, FaTrophy, FaGraduationCap, FaGlobe,
  FaPaintBrush, FaCubes,
} from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const categoryIcons = {
  data: <FaChartBar />,
  lomba: <FaTrophy />,
  tugas: <FaGraduationCap />,
  web: <FaGlobe />,
  desain: <FaPaintBrush />,
  web3: <FaCubes />,
};

export default function ProjectsPage() {
  const { t, tObj } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });

  const handleClick = (project) => {
    if (project.type === 'external') {
      window.open(project.file, '_blank', 'noopener,noreferrer');
      return;
    }
    setModal({ open: true, src: project.file, type: project.type });
  };

  return (
    <div className="container">
      <div className="page-header">
        <motion.h1
          className="gradient-text"
          initial="hidden"
          animate="visible"
          variants={fadeLeft}
        >
          {t('projects.title')}
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          {t('projects.subtitle')}
        </motion.p>
      </div>

      {projectCategories.map((cat, catIdx) => {
        const items = projects.filter((p) => p.category === cat);
        if (items.length === 0) return null;

        return (
          <motion.div
            key={cat}
            className="project-category"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={catIdx * 0.3}
          >
            <h3>
              <span className="category-icon">{categoryIcons[cat]}</span>
              {t(`projects.categories.${cat}`)}
            </h3>
            <div className="horizontal-scroll">
              {items.map((project, idx) => (
                <Tilt
                  key={project.id}
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  scale={1.03}
                  transitionSpeed={2500}
                  className="tilt-wrapper"
                >
                  <motion.div
                    className="project-card"
                    onClick={() => handleClick(project)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    variants={scaleUp}
                    custom={idx}
                  >
                    <div className="project-card-link">
                      {project.type === 'external' && (
                        <span className="external-badge">
                          <HiOutlineExternalLink /> External
                        </span>
                      )}
                      <img
                        src={project.preview}
                        alt={tObj(project.title)}
                        className="project-image-preview"
                        loading="lazy"
                      />
                      <div className="project-card-title">
                        {tObj(project.title)}
                      </div>
                    </div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </motion.div>
        );
      })}

      <PreviewModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, src: '', type: '' })}
        src={modal.src}
        type={modal.type}
      />
    </div>
  );
}
