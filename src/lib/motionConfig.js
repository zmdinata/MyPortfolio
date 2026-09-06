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
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: smoothEase },
  }),
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, delay: i * 0.05, ease: smoothEase },
  }),
};

export const fadeRight = {
  hidden: { opacity: 0, x: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, delay: i * 0.05, ease: smoothEase },
  }),
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...smoothSpring, delay: i * 0.035 },
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
