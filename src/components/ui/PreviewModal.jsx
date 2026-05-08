import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { smoothEase, smoothSpring } from '../../lib/motionConfig';
import PdfPreview from './PdfPreview';

export default function PreviewModal({ isOpen, onClose, src, type }) {
  const bodyRef = useRef(null);
  const previousScrollRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      previousScrollRef.current = { x: window.scrollX, y: window.scrollY };
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
          transition={{ duration: 0.28, ease: smoothEase }}
          onClick={onClose}
        >
          <motion.div
            className="preview-modal-content"
            initial={{ opacity: 0, scale: 0.94, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, y: 12, filter: 'blur(6px)' }}
            transition={smoothSpring}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="preview-modal-close" onClick={onClose} aria-label="Close preview">
              <IoClose />
            </button>
            <div className="preview-modal-body" ref={bodyRef}>
              {type === 'image' && <img src={src} alt="Preview" />}
              {type === 'pdf' && <PdfPreview src={src} />}
              {type === 'iframe' && (
                <iframe src={src} title="Preview" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
