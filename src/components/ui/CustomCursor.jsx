import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cursorSpring } from '../../lib/motionConfig';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const checkDevice = () => {
      setIsDesktop(window.matchMedia('(pointer: fine)').matches);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.project-card') ||
        target.closest('.certificate-card') ||
        target.closest('.honor-card')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    if (isDesktop) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'none'; // hide default cursor
    }

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      backgroundColor: 'transparent',
      border: '2px solid var(--accent-primary)',
      height: 16,
      width: 16,
      transition: cursorSpring,
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      backgroundColor: 'rgba(0, 221, 179, 0.1)',
      border: '1px solid var(--accent-secondary)',
      height: 48,
      width: 48,
      transition: cursorSpring,
    },
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 3,
      y: mousePosition.y - 3,
      height: 6,
      width: 6,
      backgroundColor: 'var(--accent-primary)',
    },
    hover: {
      x: mousePosition.x - 3,
      y: mousePosition.y - 3,
      height: 6,
      width: 6,
      backgroundColor: 'var(--accent-secondary)',
    },
  };

  return (
    <>
      <motion.div
        className="custom-cursor-ring"
        variants={variants}
        animate={isHovering ? 'hover' : 'default'}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <motion.div
        className="custom-cursor-dot"
        variants={dotVariants}
        animate={isHovering ? 'hover' : 'default'}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}
