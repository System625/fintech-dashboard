import React from 'react';
import { cn } from '@/lib/utils';

interface CyberDataProps {
  value: string | number;
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  labelClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
  terminalCursor?: boolean;
}

export const CyberData: React.FC<CyberDataProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  className,
  labelClassName,
  size = 'md',
  pulse = false,
  terminalCursor = false
}) => {
  const sizeClasses = {
    sm: 'text-lg font-medium',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
    xl: 'text-4xl font-bold'
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className={cn('cyber-label text-muted-foreground', labelClassName)}>
          {label}
        </div>
      )}
      <div 
        className={cn(
          'text-data font-mono tracking-tight',
          sizeClasses[size],
          pulse && 'cyber-pulse',
          terminalCursor && 'terminal-cursor'
        )}
      >
        {prefix}{formatValue(value)}{suffix}
      </div>
    </div>
  );
};

export default CyberData;