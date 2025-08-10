import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load chart components to reduce initial bundle size
const Sparkline = lazy(() => import('./Sparkline'));
const ModernLineChart = lazy(() => import('./ModernLineChart'));
const ModernBarChart = lazy(() => import('./ModernBarChart'));
const ModernDonutChart = lazy(() => import('./ModernDonutChart'));

// Loading fallback component
const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="w-full" style={{ height: `${height}px` }}>
    <Skeleton className="w-full h-full rounded-lg" />
  </div>
);

// Sparkline loading fallback - smaller skeleton
const SparklineSkeleton: React.FC<{ height?: number }> = ({ height = 40 }) => (
  <div className="w-full" style={{ height: `${height}px` }}>
    <Skeleton className="w-full h-full rounded" />
  </div>
);

// Lazy-wrapped components with proper fallbacks
export const LazySparkline: React.FC<React.ComponentProps<typeof Sparkline>> = (props) => (
  <Suspense fallback={<SparklineSkeleton height={props.height} />}>
    <Sparkline {...props} />
  </Suspense>
);

export const LazyModernLineChart: React.FC<React.ComponentProps<typeof ModernLineChart>> = (props) => (
  <Suspense fallback={<ChartSkeleton height={props.height} />}>
    <ModernLineChart {...props} />
  </Suspense>
);

export const LazyModernBarChart: React.FC<React.ComponentProps<typeof ModernBarChart>> = (props) => (
  <Suspense fallback={<ChartSkeleton height={props.height} />}>
    <ModernBarChart {...props} />
  </Suspense>
);

export const LazyModernDonutChart: React.FC<React.ComponentProps<typeof ModernDonutChart>> = (props) => (
  <Suspense fallback={<ChartSkeleton height={props.height} />}>
    <ModernDonutChart {...props} />
  </Suspense>
);

// Export all lazy components as default exports for cleaner imports
export {
  LazySparkline as Sparkline,
  LazyModernLineChart as ModernLineChart,
  LazyModernBarChart as ModernBarChart,
  LazyModernDonutChart as ModernDonutChart,
};