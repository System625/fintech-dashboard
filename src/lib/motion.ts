import { Variants } from 'motion/react'

// Standard motion durations
export const motionDurations = {
  micro: 'var(--motion-duration-micro)', // 150ms - buttons, chips, tabs
  container: 'var(--motion-duration-container)', // 220ms - drawers, modals  
  page: 'var(--motion-duration-page)', // 320ms - page transitions
} as const

// Standard easing curves
export const motionEasing = {
  out: 'var(--motion-ease-out)', // cubic-bezier(0.22, 1, 0.36, 1)
  inOut: 'var(--motion-ease-in-out)', // cubic-bezier(0.4, 0, 0.2, 1)
  spring: 'var(--motion-ease-spring)', // cubic-bezier(0.175, 0.885, 0.32, 1.275)
} as const

// Reduced motion detection
export const prefersReducedMotion = () => 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Standard animation variants
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0, 
    y: 8 
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay * 0.1,
      duration: prefersReducedMotion() ? 0 : 0.15,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: delay * 0.1,
      duration: prefersReducedMotion() ? 0 : 0.22,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: delay * 0.1,
      duration: prefersReducedMotion() ? 0 : 0.15,
      ease: [0.175, 0.885, 0.32, 1.275]
    }
  })
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : 0.08,
      delayChildren: 0.02
    }
  }
}

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: delay * 0.1,
      duration: prefersReducedMotion() ? 0 : 0.22,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: delay * 0.1,
      duration: prefersReducedMotion() ? 0 : 0.22,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

// Shared element transition for list-to-detail
export const sharedElement: Variants = {
  initial: { 
    scale: 1,
    opacity: 1 
  },
  exit: { 
    scale: 0.98,
    opacity: 0.8,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.22,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  enter: { 
    scale: 1,
    opacity: 1,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.32,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Page transition variants
export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 12 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.32,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: {
      duration: prefersReducedMotion() ? 0 : 0.22,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// Hover interactions
export const hoverScale = {
  whileHover: prefersReducedMotion() ? {} : { 
    scale: 1.02,
    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
  },
  whileTap: prefersReducedMotion() ? {} : { 
    scale: 0.98,
    transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] }
  }
}

export const hoverLift = {
  whileHover: prefersReducedMotion() ? {} : { 
    y: -2,
    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
  }
}

// Spring configs for Framer Motion
export const springConfigs = {
  gentle: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  },
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 20
  }
}