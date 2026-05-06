import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { supabase } from '../lib/supabase';
import { useLang } from '../context/LangContext';
import { projects as localProjects, projectCategories } from '../data/projects';
import PreviewModal from '../components/ui/PreviewModal';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { fadeLeft, fadeUp, scaleUp } from '../lib/motionConfig';
import {
  FaChartBar, FaTrophy, FaGraduationCap, FaGlobe,
  FaPaintBrush, FaCubes,
} from 'react-icons/fa';

const categoryIcons = {
  data: <FaChartBar />,
  lomba: <FaTrophy />,
  tugas: <FaGraduationCap />,
  web: <FaGlobe />,
  desain: <FaPaintBrush />,
  web3: <FaCubes />,
};

export default function ProjectsPage() {
  const { t, lang } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('projects').select('*');
        
        // Always prepare local data
        const formattedLocal = localProjects.map(p => ({
          id: p.id,
          category: p.category,
          title_en: p.title.en,
          title_id: p.title.id,
          file: p.file,
          preview: p.preview,
          type: p.type
        }));

        if (!error && data && data.length > 0) {
          setDbProjects([...data, ...formattedLocal]);
        } else {
          setDbProjects(formattedLocal);
        }
      } catch (err) {
        const formattedLocal = localProjects.map(p => ({
          id: p.id,
          category: p.category,
          title_en: p.title.en,
          title_id: p.title.id,
          file: p.file,
          preview: p.preview,
          type: p.type
        }));
        setDbProjects(formattedLocal);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

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
        const items = dbProjects.filter((p) => p.category === cat);
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
