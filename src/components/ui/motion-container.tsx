import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type MotionVariant = 
  | 'blur-up'    // LandingFooter style: blur + translateY
  | 'slide-up'   // Simple slide from bottom
  | 'slide-down' // Slide from top
  | 'slide-left' // Slide from right
  | 'slide-right' // Slide from left
  | 'fade-scale' // Fade with scale
  | 'rotate-in'  // Rotate + fade
  | 'flip-in'    // 3D flip effect
  | 'bounce-in'; // Bounce + fade

type AnimationConfig = {
  delay?: number;
  duration?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
  variant?: MotionVariant;
  stagger?: boolean;
  staggerDelay?: number;
};

const getVariantProps = (variant: MotionVariant) => {
  switch (variant) {
    case 'blur-up':
      return {
        initial: { filter: 'blur(4px)', translateY: -8, opacity: 0 },
        animate: { filter: 'blur(0px)', translateY: 0, opacity: 1 }
      };
    case 'slide-up':
      return {
        initial: { translateY: 20, opacity: 0 },
        animate: { translateY: 0, opacity: 1 }
      };
    case 'slide-down':
      return {
        initial: { translateY: -20, opacity: 0 },
        animate: { translateY: 0, opacity: 1 }
      };
    case 'slide-left':
      return {
        initial: { translateX: 20, opacity: 0 },
        animate: { translateX: 0, opacity: 1 }
      };
    case 'slide-right':
      return {
        initial: { translateX: -20, opacity: 0 },
        animate: { translateX: 0, opacity: 1 }
      };
    case 'fade-scale':
      return {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 }
      };
    case 'rotate-in':
      return {
        initial: { rotate: -5, scale: 0.95, opacity: 0 },
        animate: { rotate: 0, scale: 1, opacity: 1 }
      };
    case 'flip-in':
      return {
        initial: { rotateY: -90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 }
      };
    case 'bounce-in':
      return {
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 }
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      };
  }
};

function MotionContainer({ 
  className, 
  delay = 0.1, 
  duration = 0.8,
  children, 
  variant = 'blur-up',
  stagger = false,
  staggerDelay = 0.1
}: AnimationConfig) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variantProps = getVariantProps(variant);

  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: delay,
            },
          },
        }}
        className={className}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: variantProps.initial,
              visible: {
                ...variantProps.animate,
                transition: { duration }
              }
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={variantProps.initial}
      whileInView={variantProps.animate}
      viewport={{ once: true }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Legacy compatibility wrapper
function AnimatedContainer({ className, delay = 0.1, children }: {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
}) {
  return (
    <MotionContainer 
      className={className}
      delay={delay}
      variant="blur-up"
    >
      {children}
    </MotionContainer>
  );
}

export { MotionContainer, AnimatedContainer };
export type { MotionVariant, AnimationConfig };