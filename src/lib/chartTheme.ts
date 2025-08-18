/**
 * Recharts Theme Utilities
 * Provides theme-aware colors for Recharts components
 */

// Chart color palette mapped to our design tokens
export const chartColors = {
  brand: 'var(--chart-1)',
  success: 'var(--chart-2)', 
  warning: 'var(--chart-3)',
  destructive: 'var(--chart-4)',
  secondary: 'var(--chart-5)',
} as const;

// Get theme colors for Recharts components
export const getRechartsThemeColors = () => {
  if (typeof window === 'undefined') {
    // Fallback colors for SSR
    return [
      '#8884d8', // chart-1 fallback
      '#82ca9d', // chart-2 fallback
      '#ffc658', // chart-3 fallback
      '#ff7300', // chart-4 fallback
      '#8dd1e1', // chart-5 fallback
    ];
  }

  const css = getComputedStyle(document.documentElement);
  
  const getCSSVar = (variable: string) => {
    const value = css.getPropertyValue(variable).trim();
    return value || undefined;
  };

  return [
    getCSSVar('--chart-1') || '#8884d8',
    getCSSVar('--chart-2') || '#82ca9d',
    getCSSVar('--chart-3') || '#ffc658',
    getCSSVar('--chart-4') || '#ff7300',
    getCSSVar('--chart-5') || '#8dd1e1',
  ].filter(Boolean);
};

// Get a specific theme color by index
export const getThemeColor = (index: number, fallback?: string) => {
  const colors = getRechartsThemeColors();
  return colors[index] || fallback || colors[0];
};

// Get theme colors for specific chart types
export const getChartColors = {
  // For pie/donut charts - uses all theme colors
  pie: () => getRechartsThemeColors(),
  
  // For line/area charts - uses primary colors
  line: () => [getThemeColor(0), getThemeColor(1)],
  
  // For bar charts - uses primary colors
  bar: () => [getThemeColor(0), getThemeColor(1), getThemeColor(2)],
  
  // For multi-series charts - uses all colors
  multi: () => getRechartsThemeColors(),
  
  // For specific data types
  income: () => getThemeColor(1), // Success green
  expense: () => getThemeColor(3), // Destructive red
  neutral: () => getThemeColor(0), // Brand color
};

/**
 * Chart Gradient Utilities
 * Creates beautiful gradient effects for charts similar to button gradients
 */

// Create gradient fill for chart elements
export const createChartGradient = (color: string, opacity: number = 0.8) => {
  return `linear-gradient(180deg, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${color}00 100%)`;
};

// Create gradient stroke for chart elements
export const createChartStrokeGradient = (color: string) => {
  return `linear-gradient(90deg, ${color} 0%, ${color}80 50%, ${color} 100%)`;
};

// Get gradient colors for different chart types
export const getChartGradients = {
  // Income/Positive data gradients
  income: () => {
    const baseColor = getThemeColor(1);
    return {
      fill: createChartGradient(baseColor, 0.3),
      stroke: createChartStrokeGradient(baseColor),
      baseColor
    };
  },
  
  // Expense/Negative data gradients
  expense: () => {
    const baseColor = getThemeColor(3);
    return {
      fill: createChartGradient(baseColor, 0.3),
      stroke: createChartStrokeGradient(baseColor),
      baseColor
    };
  },
  
  // Neutral/Brand data gradients
  neutral: () => {
    const baseColor = getThemeColor(0);
    return {
      fill: createChartGradient(baseColor, 0.3),
      stroke: createChartStrokeGradient(baseColor),
      baseColor
    };
  },
  
  // Multi-color gradients for pie charts
  pie: () => {
    const colors = getRechartsThemeColors();
    return colors.map((color, index) => ({
      fill: createChartGradient(color, 0.4 + (index * 0.1)),
      stroke: createChartStrokeGradient(color),
      baseColor: color
    }));
  },
  
  // Bar chart gradients
  bar: () => {
    const colors = getRechartsThemeColors();
    return colors.map((color, index) => ({
      fill: createChartGradient(color, 0.5 + (index * 0.05)),
      stroke: createChartStrokeGradient(color),
      baseColor: color
    }));
  },
  
  // Line chart gradients
  line: () => {
    const colors = [getThemeColor(0), getThemeColor(1)];
    return colors.map((color, index) => ({
      fill: createChartGradient(color, 0.2 + (index * 0.1)),
      stroke: createChartStrokeGradient(color),
      baseColor: color
    }));
  }
};

// Create CSS gradient string for background fills
export const createCSSGradient = (colors: string[], direction: 'vertical' | 'horizontal' | 'radial' = 'vertical') => {
  const stops = colors.map((color, index) => {
    const percentage = (index / (colors.length - 1)) * 100;
    return `${color} ${percentage}%`;
  }).join(', ');
  
  switch (direction) {
    case 'horizontal':
      return `linear-gradient(90deg, ${stops})`;
    case 'radial':
      return `radial-gradient(circle, ${stops})`;
    default:
      return `linear-gradient(180deg, ${stops})`;
  }
};