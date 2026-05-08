import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../context/LangContext';
import { supabase } from '../lib/supabase';
import { certificateCategoryFallbacks, certificateItemFallbacks } from '../lib/portfolioFallbacks';
import { CategoryIcon } from '../lib/categoryIcons';
import { getDisplayType, getFileForItem, getPreviewForItem, isLinkType } from '../lib/portfolioMedia';
import PreviewModal from '../components/ui/PreviewModal';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { fadeLeft, fadeUp, scaleUp, staggerFast } from '../lib/motionConfig';

function getCategoryName(category, lang) {
  return lang === 'en'
    ? category.name_en || category.name_id || category.slug
    : category.name_id || category.name_en || category.slug;
}

export default function CertificatesPage() {
  const { t, lang } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [certificates, setCertificates] = useState(certificateItemFallbacks);
  const [categories, setCategories] = useState(certificateCategoryFallbacks);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const [{ data: categoryData, error: categoryError }, { data: certificateData, error: certificateError }] =
          await Promise.all([
            supabase.from('certificate_categories').select('*').order('sort_order', { ascending: true }),
            supabase.from('certificates').select('*').order('sort_order', { ascending: true }),
          ]);

        setCategories(!categoryError && categoryData?.length ? categoryData : certificateCategoryFallbacks);
        setCertificates(!certificateError && certificateData?.length ? certificateData : certificateItemFallbacks);
      } catch (err) {
        setCategories(certificateCategoryFallbacks);
        setCertificates(certificateItemFallbacks);
      }
    };

    fetchCerts();
  }, []);

  const categoryGroups = useMemo(() => {
    const categoryMap = new Map(categories.map((category) => [category.id, category]));
    const uncategorized = certificates.filter((cert) => !categoryMap.has(cert.category_id));

    return categories
      .map((category) => ({
        category,
        items: certificates.filter((cert) => cert.category_id === category.id),
      }))
      .filter((group) => group.items.length > 0)
      .concat(
        uncategorized.length
          ? [{ category: { id: 'uncategorized', name_en: 'Uncategorized', name_id: 'Tanpa Kategori', icon_name: 'folder' }, items: uncategorized }]
          : []
      );
  }, [categories, certificates]);

  const handleClick = (cert) => {
    const type = getDisplayType(cert.type);
    const file = getFileForItem(cert);

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
          {t('certificates.title')}
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          {t('certificates.subtitle')}
        </motion.p>
      </div>

      {categoryGroups.map(({ category, items }, catIdx) => (
        <motion.div
          key={category.id || category.slug}
          className="project-category certificate-category-section"
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
            className="certificate-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerFast}
          >
            {items.map((cert, idx) => {
              const type = getDisplayType(cert.type);
              return (
                <Tilt
                  key={cert.id}
                  tiltMaxAngleX={15}
                  tiltMaxAngleY={15}
                  scale={1.05}
                  transitionSpeed={2500}
                  className="tilt-wrapper"
                >
                  <motion.div
                    className="certificate-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-20px' }}
                    variants={scaleUp}
                    custom={idx}
                    onClick={() => handleClick(cert)}
                  >
                    {isLinkType(type) && (
                      <span className="external-badge">
                        <HiOutlineExternalLink /> Link
                      </span>
                    )}
                    <img
                      src={getPreviewForItem(cert, '/assets/images/preview.png')}
                      alt={cert.title}
                      loading="lazy"
                    />
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
