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