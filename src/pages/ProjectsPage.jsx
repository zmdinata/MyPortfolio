import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { projectCategoryFallbacks, projectItemFallbacks } from '../lib/portfolioFallbacks';
import { CategoryIcon } from '../lib/categoryIcons';
import { getDisplayType, getFileForItem, getPreviewForItem, isLinkType } from '../lib/portfolioMedia';
import PreviewModal from '../components/ui/PreviewModal';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { fadeLeft, fadeUp, scaleUp } from '../lib/motionConfig';
import { getCachedProjects } from '../lib/portfolioCache';

function getCategoryName(category, lang) {
  return lang === 'en'
    ? category.name_en || category.name_id || category.slug
    : category.name_id || category.name_en || category.slug;
}

export default function ProjectsPage() {
  const { t, lang } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [projects, setProjects] = useState(projectItemFallbacks);
  const [categories, setCategories] = useState(projectCategoryFallbacks);

  useEffect(() => {
    let isMounted = true;
    getCachedProjects().then(({ projects: nextProjects, categories: nextCategories }) => {
      if (isMounted) {
        setCategories(nextCategories);
        setProjects(nextProjects);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categoryGroups = useMemo(() => {
    const categoryMap = new Map(categories.map((category) => [category.id, category]));

    return categories
      .map((category) => ({
        category,
        items: projects.filter((project) => project.category_id === category.id || project.category === category.slug),
      }))
      .filter((group) => group.items.length > 0)
      .concat(
        projects
          .filter((project) => !categoryMap.has(project.category_id) && !categories.some((category) => category.slug === project.category))
          .length
          ? [{
              category: { id: 'uncategorized', name_en: 'Uncategorized', name_id: 'Tanpa Kategori', icon_name: 'folder' },
              items: projects.filter((project) => !categoryMap.has(project.category_id) && !categories.some((category) => category.slug === project.category)),
            }]
          : []
      );
  }, [categories, projects]);

  const handleClick = (project) => {
    const type = getDisplayType(project.type);
    const file = getFileForItem(project);

    if (isLinkType(type)) {
      window.open(file, '_blank', 'noopener,noreferrer');
      return;
    }

    setModal({ open: true, src: file, type });
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

      {categoryGroups.map(({ category, items }, catIdx) => (
        <motion.div
          key={category.id || category.slug}
          className="project-category"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={fadeUp}
          custom={catIdx * 0.15}
        >
          <h3>
            <span className="category-icon"><CategoryIcon name={category.icon_name} /></span>
            {getCategoryName(category, lang)}
          </h3>
          <div className="horizontal-scroll">
            {items.map((project, idx) => {
              const type = getDisplayType(project.type);
              return (
                <motion.div
                  key={project.id}
                  className="project-card"
                  onClick={() => handleClick(project)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  variants={scaleUp}
                  custom={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="project-card-link">
                    {isLinkType(type) && (
                      <span className="external-badge">
                        <HiOutlineExternalLink /> Link
                      </span>
                    )}
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
              );
            })}
          </div>
        </motion.div>
      ))}

      <PreviewModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, src: '', type: '' })}
        src={modal.src}
        type={modal.type}
      />
    </div>
  );
}
