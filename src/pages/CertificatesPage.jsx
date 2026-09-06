import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { certificateCategoryFallbacks, certificateItemFallbacks } from '../lib/portfolioFallbacks';
import { CategoryIcon } from '../lib/categoryIcons';
import { getDisplayType, getFileForItem, getPreviewForItem, isLinkType } from '../lib/portfolioMedia';
import PreviewModal from '../components/ui/PreviewModal';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { fadeLeft, fadeUp, scaleUp, staggerFast } from '../lib/motionConfig';
import { getCachedCertificates } from '../lib/portfolioCache';

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
    let isMounted = true;
    getCachedCertificates().then(({ certificates: nextCerts, categories: nextCats }) => {
      if (isMounted) {
        setCategories(nextCats);
        setCertificates(nextCerts);
      }
    });
    return () => {
      isMounted = false;
    };
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
          viewport={{ once: true, margin: '-20px' }}
          variants={fadeUp}
          custom={catIdx * 0.15}
        >
          <h3>
            <span className="category-icon"><CategoryIcon name={category.icon_name} /></span>
            {getCategoryName(category, lang)}
          </h3>
          <motion.div
            className="certificate-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-20px' }}
            variants={staggerFast}
          >
            {items.map((cert, idx) => {
              const type = getDisplayType(cert.type);
              return (
                <motion.div
                  key={cert.id}
                  className="certificate-card"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  variants={scaleUp}
                  custom={idx}
                  onClick={() => handleClick(cert)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'transform, opacity' }}
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
