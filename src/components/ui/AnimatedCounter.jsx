import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedCounter({
  target = 0,
  duration = 1.3,
  suffix = '+',
  className = '',
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numTarget = Math.max(0, parseInt(target, 10) || 0);

    const controls = animate(0, numTarget, {
      duration: Math.min(Math.max(duration, 0.4), 2.5),
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate(value) {
        setCount(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [target, duration]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
}
