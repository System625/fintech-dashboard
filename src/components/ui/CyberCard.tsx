import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';

interface CyberCardProps extends React.ComponentProps<"div"> {
  glow?: 'blue' | 'green' | 'pink' | 'none';
  scanLines?: boolean;
  animatedBorder?: boolean;
  dataStream?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  className,
  glow = 'none',
  scanLines = false,
  animatedBorder = false,
  dataStream = false,
  intensity = 'medium',
  ...props
}) => {
  const glowClasses = {
    blue: 'cyber-glow-blue',
    green: 'cyber-glow-green',
    pink: 'cyber-glow-pink',
    none: ''
  };

  return (
    <Card
      className={cn(
        // Base cyberpunk styling
        'relative transition-all duration-300',
        // Glow effects
        glow !== 'none' && glowClasses[glow],
        // Scan lines
        scanLines && 'scan-lines',
        // Animated border
        animatedBorder && 'cyber-border-animated',
        // Data stream
        dataStream && 'data-stream',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CyberCard;