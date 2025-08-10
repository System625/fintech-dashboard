import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { createEChartsTheme, getBaseChartOptions, chartColors } from '@/lib/chartTheme';
import { cn } from '@/lib/utils';

interface ModernLineChartProps {
  data: Array<{
    name: string;
    values: number[];
    color?: keyof typeof chartColors;
  }>;
  xAxisData: string[];
  title?: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
  smooth?: boolean;
}

const ModernLineChart: React.FC<ModernLineChartProps> = ({
  data,
  xAxisData,
  title,
  height = 300,
  className,
  showGrid = true,
  smooth = true,
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
        show: showGrid,
        borderColor: 'var(--border)',
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
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
          margin: 12,
        },
        splitLine: {
          show: showGrid,
          lineStyle: {
            color: 'var(--border)',
            opacity: 0.3,
            type: 'dashed',
          },
        },
      },
      yAxis: {
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
          margin: 12,
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          },
        },
        splitLine: {
          show: showGrid,
          lineStyle: {
            color: 'var(--border)',
            opacity: 0.3,
            type: 'dashed',
          },
        },
      },
      series: data.map((series, index) => ({
        name: series.name,
        type: 'line',
        data: series.values,
        smooth: smooth ? 0.3 : false,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: series.color ? chartColors[series.color] : `var(--chart-${index + 1})`,
          borderWidth: 0,
        },
        lineStyle: {
          width: 3,
          color: series.color ? chartColors[series.color] : `var(--chart-${index + 1})`,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              {
                offset: 0,
                color: (series.color ? chartColors[series.color] : `var(--chart-${index + 1})`) + '20'
              },
              {
                offset: 1,
                color: 'transparent'
              }
            ],
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: series.color ? chartColors[series.color] : `var(--chart-${index + 1})`,
          },
        },
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
          let result = `<div style="margin-bottom: 4px; font-weight: 600;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = typeof param.value === 'number' ? 
              param.value.toLocaleString() : param.value;
            result += `
              <div style="display: flex; align-items: center; margin: 2px 0;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 8px;"></span>
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
  }, [data, xAxisData, title, showGrid, smooth]);

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

export default ModernLineChart;