import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { createEChartsTheme, chartColors, chartMotion } from '@/lib/chartTheme';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  color?: keyof typeof chartColors;
  height?: number;
  className?: string;
  showGradient?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'brand',
  height = 40,
  className,
  showGradient = true,
  trend
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Initialize or get existing chart instance
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, createEChartsTheme());
    }

    // Determine trend if not provided
    const calculatedTrend = trend || (() => {
      const first = data[0];
      const last = data[data.length - 1];
      if (last > first) return 'up';
      if (last < first) return 'down';
      return 'neutral';
    })();

    // Color based on trend if not explicitly set
    const trendColor = trend ? {
      up: chartColors.success,
      down: chartColors.destructive,
      neutral: chartColors.brand
    }[calculatedTrend] : chartColors[color];

    const option = {
      ...chartMotion,
      animation: true,
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        show: false,
        data: data.map((_, index) => index),
      },
      yAxis: {
        type: 'value',
        show: false,
        scale: true,
      },
      series: [
        {
          type: 'line',
          data,
          smooth: 0.3,
          symbol: 'none',
          lineStyle: {
            color: trendColor,
            width: 2,
          },
          areaStyle: showGradient ? {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: trendColor + '40' }, // 25% opacity
                { offset: 1, color: 'transparent' }
              ],
            }
          } : undefined,
          emphasis: {
            disabled: true,
          },
        },
      ],
      tooltip: {
        show: false,
      },
    };

    chartInstance.current.setOption(option, true);

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data, color, showGradient, trend]);

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

export default Sparkline;