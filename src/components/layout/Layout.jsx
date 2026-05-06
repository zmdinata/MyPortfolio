import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';
import { exitTransition, pageTransition } from '../../lib/motionConfig';

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: pageTransition },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: exitTransition },
};

export default function Layout() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  return (
    <div className="app-container">
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="scroll-progress-bar"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating background orbs */}
      <div className="floating-orbs" aria-hidden="true">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      <Navbar />

      <main className="page-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
