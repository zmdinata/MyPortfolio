export const smoothEase = [0.16, 1, 0.3, 1];
export const softEase = [0.22, 1, 0.36, 1];

export const pageTransition = {
  duration: 0.28,
  ease: smoothEase,
};

export const exitTransition = {
  duration: 0.15,
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
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, delay: i * 0.045, ease: smoothEase },
  }),
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(4px)',
    transition: { duration: 0.22, ease: smoothEase },
  },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, delay: i * 0.05, ease: smoothEase },
  }),
  exit: {
    opacity: 0,
    x: -15,
    filter: 'blur(3px)',
    transition: { duration: 0.2, ease: smoothEase },
  },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 20, filter: 'blur(4px)' },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, delay: i * 0.05, ease: smoothEase },
  }),
  exit: {
    opacity: 0,
    x: 15,
    filter: 'blur(3px)',
    transition: { duration: 0.2, ease: smoothEase },
  },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.94, y: 20, filter: 'blur(6px)' },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 190,
      damping: 24,
      mass: 0.8,
      delay: i * 0.035,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -14,
    filter: 'blur(4px)',
    transition: { duration: 0.24, ease: smoothEase },
  },
};

export const cardInOut = {
  hidden: { opacity: 0, scale: 0.93, y: 26, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 210,
      damping: 26,
      mass: 0.8,
      delay: i * 0.04,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -16,
    filter: 'blur(6px)',
    transition: { duration: 0.22, ease: smoothEase },
  },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};
