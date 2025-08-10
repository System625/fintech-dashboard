import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { createEChartsTheme, getBaseChartOptions, chartColors } from '@/lib/chartTheme';
import { cn } from '@/lib/utils';

interface DonutDataItem {
  name: string;
  value: number;
  color?: keyof typeof chartColors;
}

interface ModernDonutChartProps {
  data: DonutDataItem[];
  title?: string;
  height?: number;
  className?: string;
  innerRadius?: string;
  showLabels?: boolean;
  centerText?: {
    title: string;
    value: string;
  };
}

const ModernDonutChart: React.FC<ModernDonutChartProps> = ({
  data,
  title,
  height = 300,
  className,
  innerRadius = '60%',
  showLabels = true,
  centerText,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, createEChartsTheme());
    }

    // Calculate total for center text
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const option = {
      ...getBaseChartOptions(),
      title: title ? {
        text: title,
        textStyle: {
          color: 'var(--foreground)',
          fontFamily: 'Geist, system-ui, sans-serif',
          fontSize: 16,
          fontWeight: 600,
        },
        left: 'center',
        top: 20,
      } : undefined,
      legend: {
        show: true,
        type: 'scroll',
        orient: 'horizontal',
        bottom: 20,
        left: 'center',
        textStyle: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
        itemWidth: 12,
        itemHeight: 8,
        itemGap: 16,
      },
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: [innerRadius, '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: 'var(--background)',
            borderWidth: 2,
          },
          label: {
            show: showLabels,
            position: 'outside',
            color: 'var(--muted-foreground)',
            fontSize: 11,
            formatter: (params: any) => {
              const percentage = ((params.value / total) * 100).toFixed(1);
              return `${params.name}\n${percentage}%`;
            },
          },
          labelLine: {
            show: showLabels,
            length: 15,
            length2: 10,
            lineStyle: {
              color: 'var(--muted-foreground)',
              width: 1,
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
            scaleSize: 5,
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: (item.color ? chartColors[item.color] : `var(--chart-${index + 1})`) + 'FF'
                  },
                  {
                    offset: 1,
                    color: (item.color ? chartColors[item.color] : `var(--chart-${index + 1})`) + 'CC'
                  }
                ],
              },
            },
          })),
        },
        // Center text series (if provided)
        ...(centerText ? [{
          name: 'Center',
          type: 'pie',
          radius: [0, innerRadius === '60%' ? '45%' : '40%'],
          center: ['50%', '50%'],
          silent: true,
          label: {
            show: true,
            position: 'center',
            color: 'var(--foreground)',
            fontSize: 14,
            fontWeight: 600,
            formatter: () => `{title|${centerText.title}}\n{value|${centerText.value}}`,
            rich: {
              title: {
                fontSize: 11,
                color: 'var(--muted-foreground)',
                fontWeight: 400,
                lineHeight: 20,
              },
              value: {
                fontSize: 18,
                color: 'var(--foreground)',
                fontWeight: 700,
                lineHeight: 28,
              },
            },
          },
          data: [{ value: 1, itemStyle: { color: 'transparent' } }],
        }] : []),
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'var(--popover)',
        borderColor: 'var(--border)',
        textStyle: {
          color: 'var(--popover-foreground)',
          fontSize: 12,
        },
        extraCssText: `
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
        `,
        formatter: (params: any) => {
          const percentage = ((params.value / total) * 100).toFixed(1);
          const value = typeof params.value === 'number' ? 
            params.value.toLocaleString() : params.value;
          return `
            <div style="margin-bottom: 4px; font-weight: 600;">${params.name}</div>
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${params.color}; margin-right: 8px;"></span>
              <span style="margin-right: 8px;">Value:</span>
              <span style="font-weight: 600;">${value} (${percentage}%)</span>
            </div>
          `;
        },
      },
    };

    chartInstance.current.setOption(option, true);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data, title, innerRadius, showLabels, centerText]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={chartRef}
      className={cn('w-full', className)}
      style={{ height: `${height}px` }}
    />
  );
};

export default ModernDonutChart;