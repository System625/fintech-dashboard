import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardOverview } from '@/hooks/useApi';
import { getChartGradients } from '@/lib/chartTheme';

export function Overview() {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <p className="text-muted-foreground">Unable to load chart data</p>
      </div>
    );
  }

  // Use actual data or fallback data for demo
  const chartData = data?.chartData || [
    {
      month: 'Jan',
      income: 2400,
      expenses: 1400,
    },
    {
      month: 'Feb',
      income: 2210,
      expenses: 1380,
    },
    {
      month: 'Mar',
      income: 2500,
      expenses: 1500,
    },
    {
      month: 'Apr',
      income: 2780,
      expenses: 1890,
    },
    {
      month: 'May',
      income: 2890,
      expenses: 1700,
    },
    {
      month: 'Jun',
      income: 3090,
      expenses: 1850,
    },
  ];

  // Get gradient effects for line chart
  const incomeGradient = getChartGradients.income();
  const expenseGradient = getChartGradients.expense();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
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
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="income" 
          stackId="1" 
          stroke={incomeGradient.baseColor} 
          fill="url(#incomeGradient)" 
          name="Income"
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          stackId="2" 
          stroke={expenseGradient.baseColor} 
          fill="url(#expenseGradient)" 
          name="Expenses"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 