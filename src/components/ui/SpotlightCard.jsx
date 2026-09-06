import React, { useRef, useState } from 'react';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(124, 111, 255, 0.16)',
  borderBeam = false,
  borderBeamColor = 'var(--accent-primary)',
  onClick,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${isHovered ? 'is-hovered' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
    </div>
  );
}
