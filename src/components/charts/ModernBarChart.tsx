import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { createEChartsTheme, getBaseChartOptions, chartColors } from '@/lib/chartTheme';
import { cn } from '@/lib/utils';

interface ModernBarChartProps {
  data: Array<{
    name: string;
    values: number[];
    color?: keyof typeof chartColors;
  }>;
  categories: string[];
  title?: string;
  height?: number;
  className?: string;
  horizontal?: boolean;
  stacked?: boolean;
}

const ModernBarChart: React.FC<ModernBarChartProps> = ({
  data,
  categories,
  title,
  height = 300,
  className,
  horizontal = false,
  stacked = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, createEChartsTheme());
    }

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
        left: 0,
        top: 0,
      } : undefined,
      legend: {
        show: data.length > 1,
        type: 'scroll',
        bottom: 0,
        textStyle: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
      },
      grid: {
        ...getBaseChartOptions().grid,
        top: title ? 60 : 20,
        bottom: data.length > 1 ? 60 : 30,
        left: horizontal ? 80 : 40,
        right: 20,
      },
      xAxis: horizontal ? {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          },
        },
        splitLine: {
          lineStyle: {
            color: 'var(--border)',
            opacity: 0.3,
            type: 'dashed',
          },
        },
      } : {
        type: 'category',
        data: categories,
        axisLine: {
          lineStyle: {
            color: 'var(--border)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          fontSize: 11,
          interval: 0,
          rotate: categories.some(cat => cat.length > 8) ? 45 : 0,
        },
      },
      yAxis: horizontal ? {
        type: 'category',
        data: categories,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          fontSize: 11,
        },
      } : {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          },
        },
        splitLine: {
          lineStyle: {
            color: 'var(--border)',
            opacity: 0.3,
            type: 'dashed',
          },
        },
      },
      series: data.map((series, index) => ({
        name: series.name,
        type: 'bar',
        data: series.values,
        stack: stacked ? 'total' : undefined,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0,
            x2: horizontal ? 1 : 0,
            y2: horizontal ? 0 : 1,
            colorStops: [
              {
                offset: 0,
                color: series.color ? chartColors[series.color] : `var(--chart-${index + 1})`
              },
              {
                offset: 1,
                color: (series.color ? chartColors[series.color] : `var(--chart-${index + 1})`) + 'CC'
              }
            ],
          },
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: series.color ? chartColors[series.color] : `var(--chart-${index + 1})`,
          },
        },
        barMaxWidth: 40,
      })),
      tooltip: {
        trigger: 'axis',
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
          const data = Array.isArray(params) ? params : [params];
          let result = `<div style="margin-bottom: 4px; font-weight: 600;">${data[0].axisValue || data[0].name}</div>`;
          data.forEach((param: any) => {
            const value = typeof param.value === 'number' ? 
              param.value.toLocaleString() : param.value;
            result += `
              <div style="display: flex; align-items: center; margin: 2px 0;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 2px; background-color: ${param.color}; margin-right: 8px;"></span>
                <span style="margin-right: 8px;">${param.seriesName}:</span>
                <span style="font-weight: 600;">${value}</span>
              </div>
            `;
          });
          return result;
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
  }, [data, categories, title, horizontal, stacked]);

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

export default ModernBarChart;