import React, { useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';

const SpotlightCard = forwardRef(function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'var(--glow-color)',
  borderBeam = false,
  borderBeamColor = 'var(--accent-primary)',
  onClick,
  style = {},
  ...props
}, forwardedRef) {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={(node) => {
        cardRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{
        '--spotlight-color': spotlightColor,
        ...style,
      }}
      {...props}
    >
      {/* Background Spotlight Layer */}
      <div className="spotlight-layer" aria-hidden="true" />

      {/* Border-beam laser outline if enabled */}
      {borderBeam && (
        <div 
          className="border-beam-tracer" 
          aria-hidden="true" 
          style={{ '--beam-color': borderBeamColor }} 
        />
      )}

      {/* Card Content */}
      <div className="spotlight-content">{children}</div>
    </motion.div>
  );
});

export default SpotlightCard;
