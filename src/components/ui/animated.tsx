import { lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'

// Lazy load Motion components to optimize bundle size
const MotionDiv = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.motion.div }))
)

const MotionSection = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.motion.section }))
)

const MotionArticle = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.motion.article }))
)

const MotionSpan = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.motion.span }))
)

const MotionButton = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.motion.button }))
)

const MotionMain = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.motion.main }))
)

const AnimatePresence = lazy(() => 
  import('motion/react').then((mod) => ({ default: mod.AnimatePresence }))
)

// Fallback component that provides the same API without animation
const StaticFallback = ({ 
  children, 
  className, 
  ...props 
}: { 
  children: React.ReactNode
  className?: string 
  [key: string]: any
}) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
)

// Wrapper components with lazy loading
interface AnimatedProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function AnimatedDiv({ children, className, ...motionProps }: AnimatedProps) {
  return (
    <Suspense fallback={<StaticFallback className={className}>{children}</StaticFallback>}>
      <MotionDiv className={className} {...motionProps}>
        {children}
      </MotionDiv>
    </Suspense>
  )
}

export function AnimatedSection({ children, className, ...motionProps }: AnimatedProps) {
  return (
    <Suspense fallback={<StaticFallback className={className}>{children}</StaticFallback>}>
      <MotionSection className={className} {...motionProps}>
        {children}
      </MotionSection>
    </Suspense>
  )
}

export function AnimatedArticle({ children, className, ...motionProps }: AnimatedProps) {
  return (
    <Suspense fallback={<StaticFallback className={className}>{children}</StaticFallback>}>
      <MotionArticle className={className} {...motionProps}>
        {children}
      </MotionArticle>
    </Suspense>
  )
}

export function AnimatedSpan({ children, className, ...motionProps }: AnimatedProps) {
  return (
    <Suspense fallback={<span className={className}>{children}</span>}>
      <MotionSpan className={className} {...motionProps}>
        {children}
      </MotionSpan>
    </Suspense>
  )
}

export function AnimatedButton({ children, className, ...motionProps }: AnimatedProps) {
  return (
    <Suspense fallback={<button className={className}>{children}</button>}>
      <MotionButton className={className} {...motionProps}>
        {children}
      </MotionButton>
    </Suspense>
  )
}

export function AnimatedMain({ children, className, ...motionProps }: AnimatedProps) {
  return (
    <Suspense fallback={<main className={className}>{children}</main>}>
      <MotionMain className={className} {...motionProps}>
        {children}
      </MotionMain>
    </Suspense>
  )
}

export function AnimatedPresence({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnimatePresence {...props}>
        {children}
      </AnimatePresence>
    </Suspense>
  )
}

// Hook to dynamically import motion when needed (optional utility)
export const importMotion = () => import('motion/react')