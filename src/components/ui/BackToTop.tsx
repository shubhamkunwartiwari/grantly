import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top of page"
          title="Back to top"
          className="fixed bottom-20 md:bottom-8 right-5 md:right-8 z-40 p-2.5 rounded-full bg-surface-card border border-border-hairline text-ink-primary shadow-lg hover:border-brand-primary/50 hover:bg-surface-raised hover:text-brand-primary hover:-translate-y-1 active:scale-90 transition-all duration-200 cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
