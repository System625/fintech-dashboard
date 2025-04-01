import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Define the PerformanceEntry type
interface PerformanceEntry {
  date: string;
  value: number;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm text-muted-foreground">Date</div>
          <div className="text-right font-medium">
            {new Date(label).toLocaleDateString()}
          </div>
          <div className="text-sm text-muted-foreground">Value</div>
          <div className="text-right font-medium">
            ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Fallback data for demonstration
/* const fallbackData: PerformanceEntry[] = [
  { date: '2023-04-01', value: 10000 },
  { date: '2023-05-01', value: 11200 },
  { date: '2023-06-01', value: 10800 },
  { date: '2023-07-01', value: 12400 },
  { date: '2023-08-01', value: 13100 },
  { date: '2023-09-01', value: 13900 },
  { date: '2023-10-01', value: 14500 }
]; */

export function PortfolioPerformanceChart() {
  const [data, setData] = useState<PerformanceEntry[]>([]);
  const [allData, setAllData] = useState<PerformanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [percentChange, setPercentChange] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      filterDataByTimeRange(timeRange);
    }
  }, [timeRange, allData]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/investments/performance');
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio performance data');
      }
      const fetchedData = await response.json();
      setAllData(fetchedData);
      filterDataByTimeRange(timeRange);
    } catch (error) {
      console.error('Error fetching portfolio performance data:', error);
      // Fallback data
      const fallbackData = generateFallbackData();
      setAllData(fallbackData);
      filterDataByTimeRange(timeRange, fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataByTimeRange = (range: TimeRange, dataToFilter = allData) => {
    if (!dataToFilter || dataToFilter.length === 0) return;
    
    const now = new Date();
    let filteredData: PerformanceEntry[] = [];
    let startDate: Date;
    
    switch (range) {
      case '1D':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1Y':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
      default:
        filteredData = [...dataToFilter];
        startDate = new Date(0); // Beginning of time
        break;
    }
    
    if (range !== 'ALL') {
      filteredData = dataToFilter.filter(entry => new Date(entry.date) >= startDate);
    }
    
    // Calculate percent change
    if (filteredData.length >= 2) {
      const firstValue = filteredData[0].value;
      const lastValue = filteredData[filteredData.length - 1].value;
      const change = ((lastValue - firstValue) / firstValue) * 100;
      setPercentChange(change);
    } else {
      setPercentChange(null);
    }
    
    setData(filteredData);
  };

  const generateFallbackData = (): PerformanceEntry[] => {
    const data: PerformanceEntry[] = [];
    const now = new Date();
    
    // Generate data for past 3 years
    for (let i = 365 * 3; i >= 0; i -= 7) { // Weekly data points
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      // Generate a somewhat realistic portfolio growth with some volatility
      const baseValue = 10000; // Starting with $10,000
      const yearlyGrowthRate = 0.08; // 8% annual growth
      const years = i / 365;
      const volatility = Math.random() * 0.1 - 0.05; // -5% to +5% random variation
      
      const value = baseValue * Math.pow(1 + yearlyGrowthRate, 3 - years) * (1 + volatility);
      
      data.push({
        date: date.toISOString(),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return data;
  };

  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    
    if (timeRange === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '1W' || timeRange === '1M') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
    }
  };

  const getChangeColor = () => {
    if (percentChange === null) return 'text-muted-foreground';
    return percentChange >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Loading your investment performance...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Your investment performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center flex-col">
            <p className="text-muted-foreground mb-2">No performance data available</p>
            <p className="text-sm text-muted-foreground">Add investments to see your portfolio performance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Your investment performance over time</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${getChangeColor()}`}>
              {percentChange !== null ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%` : '--'}
            </div>
            <CardDescription>{timeRange} change</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={formatDateForDisplay}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>Past performance is not indicative of future results</span>
        </div>
      </CardContent>
    </Card>
  );
} 