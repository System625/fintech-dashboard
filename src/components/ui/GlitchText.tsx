import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: 'hover' | 'always' | 'none';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className,
  intensity = 'medium',
  trigger = 'hover'
}) => {
  const text = typeof children === 'string' ? children : '';
  
  const intensityClasses = {
    low: 'before:animation-duration-[1s] after:animation-duration-[1s]',
    medium: 'before:animation-duration-[0.5s] after:animation-duration-[0.5s]',
    high: 'before:animation-duration-[0.2s] after:animation-duration-[0.2s]'
  };

  const triggerClasses = {
    hover: 'glitch-text',
    always: 'glitch-text before:animate-infinite after:animate-infinite',
    none: ''
  };

  return (
    <span 
      className={cn(
        'relative inline-block',
        trigger !== 'none' && triggerClasses[trigger],
        intensityClasses[intensity],
        className
      )}
      data-text={text}
    >
      {children}
    </span>
  );
};

export default GlitchText;