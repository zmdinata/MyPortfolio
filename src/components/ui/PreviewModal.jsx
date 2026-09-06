import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import PdfPreview from './PdfPreview';

export default function PreviewModal({ isOpen, onClose, src, type }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.requestAnimationFrame(() => {
        bodyRef.current?.scrollTo({ top: 0, left: 0 });
      });
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="preview-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="preview-modal-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: 'transform, opacity' }}
          >
            <button className="preview-modal-close" onClick={onClose} aria-label="Close preview">
              <IoClose />
            </button>
            <div className="preview-modal-body" ref={bodyRef}>
              {type === 'image' && (
                <div className="preview-image-wrapper">
                  <img src={src} alt="Preview" loading="lazy" />
                </div>
              )}
              {type === 'pdf' && <PdfPreview src={src} />}
              {type === 'iframe' && (
                <iframe src={src} title="Preview" loading="lazy" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
