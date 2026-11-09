import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type RevealDirection = 'left' | 'right' | 'up' | 'down' | 'alternate';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  index?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  index = 0,
  delay = 0,
  duration = 0.45,
  distance = 36,
  className = '',
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, disable horizontal or vertical translations
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, margin: '-20px' }}
        transition={{ duration: 0.3, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Determine effective direction
  let effectiveDirection = direction;
  if (direction === 'alternate') {
    effectiveDirection = index % 2 === 0 ? 'left' : 'right';
  }

  let initialX = 0;
  let initialY = 0;

  if (effectiveDirection === 'left') {
    initialX = -distance;
  } else if (effectiveDirection === 'right') {
    initialX = distance;
  } else if (effectiveDirection === 'up') {
    initialY = distance;
  } else if (effectiveDirection === 'down') {
    initialY = -distance;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, y: initialY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-35px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
