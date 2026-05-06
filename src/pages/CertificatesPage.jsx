import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../context/LangContext';
import { supabase } from '../lib/supabase';
import { certificates as localCertificates } from '../data/certificates';
import PreviewModal from '../components/ui/PreviewModal';
import { fadeLeft, fadeUp, scaleUp, staggerFast } from '../lib/motionConfig';

export default function CertificatesPage() {
  const { t } = useLang();
  const [modal, setModal] = useState({ open: false, src: '', type: '' });
  const [dbCertificates, setDbCertificates] = useState([]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
        
        const formattedLocal = localCertificates.map(c => ({
          id: c.id,
          title: c.title,
          file_path: c.file,
          preview_path: c.preview,
          type: c.type
        }));

        if (!error && data && data.length > 0) {
          setDbCertificates([...data, ...formattedLocal]);
        } else {
          setDbCertificates(formattedLocal);
        }
      } catch (err) {
        const formattedLocal = localCertificates.map(c => ({
          id: c.id,
          title: c.title,
          file_path: c.file,
          preview_path: c.preview,
          type: c.type
        }));
        setDbCertificates(formattedLocal);
      }
    };
    fetchCerts();
  }, []);

  const handleClick = (cert) => {
    setModal({ open: true, src: cert.file_path, type: cert.type });
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

      <motion.div
        className="certificate-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={staggerFast}
      >
        {dbCertificates.map((cert, idx) => (
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
              <img src={cert.preview_path} alt={cert.title} loading="lazy" />
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
