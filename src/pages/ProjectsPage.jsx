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
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SkeletonGrid } from '../components/ui/SkeletonCard';

function getCategoryName(category, lang) {
  return lang === 'en'
    ? category.name_en || category.name_id || category.slug
    : category.name_id || category.name_en || category.slug;
}

export default function ProjectsPage() {
  const { t, lang } = useLang();
  useDocumentTitle(
    lang === 'en' ? 'Projects Portfolio' : 'Portofolio Proyek',
    lang === 'en'
      ? 'Explore flagship AI engineering projects, multi-agent systems, and quantitative models by Zacky Muhammad Dinata (zmdinata).'
      : 'Koleksi lengkap proyek rekayasa AI, orkestrasi multi-agent, dan sistem kuantitatif oleh Zacky Muhammad Dinata (zmdinata).'
  );

  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [projects, setProjects] = useState(projectItemFallbacks);
  const [categories, setCategories] = useState(projectCategoryFallbacks);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = () => {
      getCachedProjects().then(({ projects: nextProjects, categories: nextCategories }) => {
        if (isMounted) {
          setCategories(nextCategories);
          setProjects(nextProjects);
          setIsLoading(false);
        }
      });
    };

    loadProjects();

    const handleCacheInvalidated = () => {
      loadProjects();
    };

    window.addEventListener('portfolio-cache-invalidated', handleCacheInvalidated);

    return () => {
      isMounted = false;
      window.removeEventListener('portfolio-cache-invalidated', handleCacheInvalidated);
    };
  }, []);

  const categoryGroups = useMemo(() => {
    // Resolve project to exactly ONE category ID to prevent duplicate rendering across multiple groups
    const resolveCategoryId = (project) => {
      if (!project) return null;

      // 1. Primary: Exact match on category_id -> category.id (UUID)
      const byId = categories.find((c) => c.id === project.category_id);
      if (byId) return byId.id;

      // 2. Secondary: Match category_id to category.slug (used by static fallback projects)
      const bySlug = categories.find((c) => c.slug === project.category_id);
      if (bySlug) return bySlug.id;

      // 3. Fallback: Only check legacy text column project.category if category_id didn't match
      if (project.category) {
        const byLegacy = categories.find((c) => c.slug === project.category || c.id === project.category);
        if (byLegacy) return byLegacy.id;
      }

      return null;
    };

    const categorizedGroups = categories
      .map((category) => ({
        category,
        items: projects.filter((project) => resolveCategoryId(project) === category.id),
      }))
      .filter((group) => group.items.length > 0);

    const uncategorizedItems = projects.filter((project) => !resolveCategoryId(project));

    return uncategorizedItems.length > 0
      ? [
          ...categorizedGroups,
          {
            category: { id: 'uncategorized', name_en: 'Uncategorized', name_id: 'Tanpa Kategori', icon_name: 'folder' },
            items: uncategorizedItems,
          },
        ]
      : categorizedGroups;
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

      {isLoading ? (
        <div style={{ marginTop: '2rem' }}>
          <SkeletonGrid type="project" count={6} />
        </div>
      ) : (
        categoryGroups.map(({ category, items }, catIdx) => (
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
                  exit="exit"
                  viewport={{ once: true, margin: '-20px' }}
                  variants={scaleUp}
                  custom={idx}
                  style={{ willChange: 'transform, opacity, filter' }}
                >
                  <div className="project-card-link">
                    {isLinkType(type) && (
                      <span className="external-badge">
                        <HiOutlineExternalLink /> Link
                      </span>
                    )}
                    <img
                      src={getPreviewForItem(project, '/assets/images/preview.png')}
                      alt={lang === 'en' ? (project.title_en || project.title?.en) : (project.title_id || project.title?.id)}
                      className="project-image-preview"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/preview.png';
                      }}
                    />
                    <div className="project-card-title">
                      {lang === 'en' ? (project.title_en || project.title?.en) : (project.title_id || project.title?.id)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )))}

      <PreviewModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, src: '', type: '' })}
        src={modal.src}
        type={modal.type}
      />
    </div>
  );
}
