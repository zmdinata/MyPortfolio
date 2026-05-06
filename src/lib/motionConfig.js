export const smoothEase = [0.16, 1, 0.3, 1];
export const softEase = [0.22, 1, 0.36, 1];

export const pageTransition = {
  duration: 0.58,
  ease: smoothEase,
};

export const exitTransition = {
  duration: 0.26,
  ease: [0.4, 0, 1, 1],
};

export const smoothSpring = {
  type: 'spring',
  stiffness: 170,
  damping: 24,
  mass: 0.85,
};

export const cursorSpring = {
  type: 'spring',
  stiffness: 520,
  damping: 38,
  mass: 0.18,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, delay: i * 0.075, ease: smoothEase },
  }),
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -26, filter: 'blur(5px)' },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.68, delay: i * 0.075, ease: smoothEase },
  }),
};

export const fadeRight = {
  hidden: { opacity: 0, x: 26, filter: 'blur(5px)' },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.68, delay: i * 0.075, ease: smoothEase },
  }),
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.94, y: 16, filter: 'blur(5px)' },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...smoothSpring, delay: i * 0.045 },
  }),
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};
