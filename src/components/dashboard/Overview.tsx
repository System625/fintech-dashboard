import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDashboardOverview } from '@/hooks/useApi';
import { getChartGradients } from '@/lib/chartTheme';

type ViewMode = 'both' | 'income' | 'expenses' | 'net';

export function Overview() {
  const { data, isLoading, error } = useDashboardOverview();
  const [view, setView] = useState<ViewMode>('both');

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p className="text-muted-foreground">Unable to load chart data</p>
      </div>
    );
  }

  const incomeGradient = getChartGradients.income();
  const expenseGradient = getChartGradients.expense();

  const toggleBtn = (mode: ViewMode, label: string) => (
    <Button
      key={mode}
      size="sm"
      variant={view === mode ? 'default' : 'outline'}
      className="h-7 text-xs px-3"
      onClick={() => setView(mode)}
    >
      {label}
    </Button>
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        {toggleBtn('both', 'Both')}
        {toggleBtn('income', 'Income')}
        {toggleBtn('expenses', 'Expenses')}
        {toggleBtn('net', 'Net')}
      </div>
      <ResponsiveContainer width="100%" height={270}>
        <AreaChart
          data={data.chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={incomeGradient.baseColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={incomeGradient.baseColor} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={expenseGradient.baseColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={expenseGradient.baseColor} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          {(view === 'both' || view === 'income') && (
            <Area
              type="monotone"
              dataKey="income"
              stroke={incomeGradient.baseColor}
              fill="url(#incomeGradient)"
              name="Income"
              strokeWidth={2}
            />
          )}
          {(view === 'both' || view === 'expenses') && (
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={expenseGradient.baseColor}
              fill="url(#expenseGradient)"
              name="Expenses"
              strokeWidth={2}
            />
          )}
          {view === 'net' && (
            <Area
              type="monotone"
              dataKey="net"
              stroke="#8b5cf6"
              fill="url(#netGradient)"
              name="Net"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
