/**
 * ECharts Theme Bridge - Maps CSS variables to ECharts theme configuration
 * Automatically syncs with the design system tokens for consistent theming
 */

// Read CSS variables and convert to ECharts theme
export const createEChartsTheme = () => {
  const css = getComputedStyle(document.documentElement);
  
  // Helper to get CSS variable value and clean it
  const getCSSVar = (variable: string) => css.getPropertyValue(variable).trim();
  
  return {
    color: [
      getCSSVar('--chart-1'), // Brand primary
      getCSSVar('--chart-2'), // Success green  
      getCSSVar('--chart-3'), // Warning amber
      getCSSVar('--chart-4'), // Destructive red
      getCSSVar('--chart-5'), // Secondary accent
    ].filter(Boolean), // Remove empty values
    
    backgroundColor: getCSSVar('--background'),
    
    textStyle: {
      color: getCSSVar('--foreground'),
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: 12,
    },
    
    title: {
      textStyle: {
        color: getCSSVar('--foreground'),
        fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    
    legend: {
      textStyle: {
        color: getCSSVar('--muted-foreground'),
        fontSize: 12,
      },
      pageTextStyle: {
        color: getCSSVar('--muted-foreground'),
      },
    },
    
    tooltip: {
      backgroundColor: getCSSVar('--popover'),
      borderColor: getCSSVar('--border'),
      borderWidth: 1,
      textStyle: {
        color: getCSSVar('--popover-foreground'),
        fontSize: 12,
      },
      extraCssText: `
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(8px);
      `,
    },
    
    grid: {
      borderColor: getCSSVar('--border'),
    },
    
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: getCSSVar('--border'),
        },
      },
      axisTick: {
        lineStyle: {
          color: getCSSVar('--border'),
        },
      },
      axisLabel: {
        color: getCSSVar('--muted-foreground'),
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: getCSSVar('--border'),
          opacity: 0.3,
        },
      },
    },
    
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: getCSSVar('--border'),
        },
      },
      axisTick: {
        lineStyle: {
          color: getCSSVar('--border'),
        },
      },
      axisLabel: {
        color: getCSSVar('--muted-foreground'),
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: getCSSVar('--border'),
          opacity: 0.3,
        },
      },
    },
    
    line: {
      smooth: true,
      symbolSize: 6,
      itemStyle: {
        borderWidth: 2,
      },
      lineStyle: {
        width: 2,
      },
      areaStyle: {
        opacity: 0.1,
      },
    },
    
    bar: {
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
    
    pie: {
      itemStyle: {
        borderWidth: 0,
      },
      label: {
        color: getCSSVar('--muted-foreground'),
        fontSize: 11,
      },
      labelLine: {
        lineStyle: {
          color: getCSSVar('--muted-foreground'),
        },
      },
    },
    
    scatter: {
      symbolSize: 6,
      itemStyle: {
        opacity: 0.8,
      },
    },
  };
};

// Chart color palette mapped to our design tokens
export const chartColors = {
  brand: 'var(--chart-1)',
  success: 'var(--chart-2)', 
  warning: 'var(--chart-3)',
  destructive: 'var(--chart-4)',
  secondary: 'var(--chart-5)',
} as const;

// Gradient definitions for enhanced visual appeal
export const chartGradients = {
  brandGradient: {
    type: 'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: 'var(--chart-1)' },
      { offset: 1, color: 'transparent' }
    ],
  },
  successGradient: {
    type: 'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: 'var(--chart-2)' },
      { offset: 1, color: 'transparent' }
    ],
  },
} as const;

// Motion configuration for chart animations
export const chartMotion = {
  animationDuration: 800,
  animationEasing: 'cubicOut' as const,
  animationDelay: 0,
  animationDurationUpdate: 400,
  animationEasingUpdate: 'cubicOut' as const,
} as const;

// Responsive breakpoints for chart sizing
export const chartBreakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

// Common chart options that integrate with our design system
export const getBaseChartOptions = () => ({
  ...chartMotion,
  textStyle: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  tooltip: {
    backgroundColor: 'var(--popover)',
    borderColor: 'var(--border)',
    textStyle: {
      color: 'var(--popover-foreground)',
    },
    extraCssText: `
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(8px);
    `,
  },
  grid: {
    left: 20,
    right: 20,
    top: 40,
    bottom: 20,
    containLabel: true,
  },
});

/**
 * Recharts Theme Utilities
 * Provides theme-aware colors for Recharts components
 */

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