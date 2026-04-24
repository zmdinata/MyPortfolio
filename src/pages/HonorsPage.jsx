import { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../context/LangContext';
import { supabase } from '../lib/supabase';
import PreviewModal from '../components/ui/PreviewModal';

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HonorsPage() {
  const { t, tObj } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [dbHonors, setDbHonors] = useState([]);

  useEffect(() => {
    const fetchHonors = async () => {
      const { data } = await supabase.from('honors').select('*').order('created_at', { ascending: false });
      if (data) setDbHonors(data);
    };
    fetchHonors();
  }, []);

  const handleClick = (honor) => {
    setModal({ open: true, src: honor.image_path, type: honor.type });
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

      <motion.div
        className="honor-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={stagger}
      >
        {dbHonors.map((honor, idx) => (
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
              variants={scaleUp}
              custom={idx}
              onClick={() => handleClick(honor)}
            >
              <img
                src={honor.image_path}
                alt={lang === 'en' ? honor.title_en : honor.title_id}
                className="honor-card-image"
                loading="lazy"
              />
              <div className="honor-card-body">
                <h4>{lang === 'en' ? honor.title_en : honor.title_id}</h4>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </motion.div>

      <PreviewModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, src: '', type: '' })}
        src={modal.src}
        type={modal.type}
      />
    </div>
  );
}
