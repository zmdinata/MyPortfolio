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
  hidden: {
    opacity: 0,
    y: 28,
    transition: { duration: 0.22, ease: smoothEase },
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: Math.min(i * 0.05, 0.25), ease: smoothEase },
  }),
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.2, ease: smoothEase },
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.22, ease: smoothEase },
  },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, delay: Math.min(i * 0.05, 0.25), ease: smoothEase },
  }),
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.2, ease: smoothEase },
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 24,
    transition: { duration: 0.22, ease: smoothEase },
  },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, delay: Math.min(i * 0.05, 0.25), ease: smoothEase },
  }),
  exit: {
    opacity: 0,
    x: 16,
    transition: { duration: 0.2, ease: smoothEase },
  },
};

export const scaleUp = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 28,
    transition: { duration: 0.22, ease: smoothEase },
  },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
      mass: 0.85,
      delay: Math.min(i * 0.045, 0.25),
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -16,
    transition: { duration: 0.2, ease: smoothEase },
  },
};

export const cardInOut = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: 20,
    transition: {
      duration: 0.22,
      ease: softEase,
    },
  },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: smoothEase,
      delay: Math.min(i * 0.06, 0.24),
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -16,
    transition: {
      duration: 0.2,
      ease: smoothEase,
    },
  },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.03 } },
};
