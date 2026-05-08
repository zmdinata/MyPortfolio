import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../context/LangContext';
import { supabase } from '../lib/supabase';
import { honorCategoryFallbacks, honorItemFallbacks, mergePortfolioCategories, mergePortfolioItems } from '../lib/portfolioFallbacks';
import { CategoryIcon } from '../lib/categoryIcons';
import { getDisplayType, getFileForItem, getPreviewForItem, isLinkType } from '../lib/portfolioMedia';
import PreviewModal from '../components/ui/PreviewModal';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { fadeLeft, fadeUp, scaleUp, stagger } from '../lib/motionConfig';

function getCategoryName(category, lang) {
  return lang === 'en'
    ? category.name_en || category.name_id || category.slug
    : category.name_id || category.name_en || category.slug;
}

export default function HonorsPage() {
  const { t, lang } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [honors, setHonors] = useState(honorItemFallbacks);
  const [categories, setCategories] = useState(honorCategoryFallbacks);

  useEffect(() => {
    const fetchHonors = async () => {
      try {
        const [{ data: categoryData, error: categoryError }, { data: honorData, error: honorError }] =
          await Promise.all([
            supabase.from('honor_categories').select('*').order('sort_order', { ascending: true }),
            supabase.from('honors').select('*').order('sort_order', { ascending: true }),
          ]);

        const nextCategories = mergePortfolioCategories(
          !categoryError ? categoryData || [] : [],
          honorCategoryFallbacks
        );
        setCategories(nextCategories);
        setHonors(mergePortfolioItems(
          !honorError ? honorData || [] : [],
          honorItemFallbacks,
          nextCategories,
          'honors'
        ));
      } catch (err) {
        setCategories(honorCategoryFallbacks);
        setHonors(honorItemFallbacks);
      }
    };

    fetchHonors();
  }, []);

  const categoryGroups = useMemo(() => {
    const categoryMap = new Map(categories.map((category) => [category.id, category]));
    const uncategorized = honors.filter((honor) => !categoryMap.has(honor.category_id));

    return categories
      .map((category) => ({
        category,
        items: honors.filter((honor) => honor.category_id === category.id),
      }))
      .filter((group) => group.items.length > 0)
      .concat(
        uncategorized.length
          ? [{ category: { id: 'uncategorized', name_en: 'Uncategorized', name_id: 'Tanpa Kategori', icon_name: 'folder' }, items: uncategorized }]
          : []
      );
  }, [categories, honors]);

  const handleClick = (honor) => {
    const type = getDisplayType(honor.type);
    const file = getFileForItem(honor);

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
          {t('honors.title')}
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          {t('honors.subtitle')}
        </motion.p>
      </div>

      {categoryGroups.map(({ category, items }, catIdx) => (
        <motion.div
          key={category.id || category.slug}
          className="project-category honor-category-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          custom={catIdx * 0.3}
        >
          <h3>
            <span className="category-icon"><CategoryIcon name={category.icon_name} /></span>
            {getCategoryName(category, lang)}
          </h3>
          <motion.div
            className="honor-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
          >
            {items.map((honor, idx) => {
              const type = getDisplayType(honor.type);
              return (
                <Tilt
                  key={honor.id}
                  tiltMaxAngleX={12}
                  tiltMaxAngleY={12}
                  scale={1.03}
                  transitionSpeed={2500}
                  className="tilt-wrapper"
                >
                  <motion.div
                    className="honor-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-20px' }}
                    variants={scaleUp}
                    custom={idx}
                    onClick={() => handleClick(honor)}
                  >
                    {isLinkType(type) && (
                      <span className="external-badge">
                        <HiOutlineExternalLink /> Link
                      </span>
                    )}
                    <img
                      src={getPreviewForItem(honor, '/assets/images/preview.png')}
                      alt={lang === 'en' ? honor.title_en : honor.title_id}
                      className="honor-card-image"
                      loading="lazy"
                    />
                    <div className="honor-card-body">
                      <h4>{lang === 'en' ? honor.title_en : honor.title_id}</h4>
                    </div>
                  </motion.div>
                </Tilt>
              );
            })}
          </motion.div>
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
