import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getChartColors } from '@/lib/chartTheme';

// Define the AssetAllocation type
interface AssetAllocation {
  name: string;
  value: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm text-muted-foreground">Category</div>
          <div className="text-right font-medium">
            {payload[0].name}
          </div>
          <div className="text-sm text-muted-foreground">Value</div>
          <div className="text-right font-medium">
            ${Number(payload[0].value).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Percentage</div>
          <div className="text-right font-medium">
            {payload[0].payload.percentage}%
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function AssetAllocationChart() {
  const [data, setData] = useState<Array<AssetAllocation & { percentage: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/investments/allocation');
        if (!response.ok) {
          throw new Error('Failed to fetch asset allocation data');
        }
        const allocations = await response.json();
        
        // Calculate total value
        const total = allocations.reduce((sum: number, item: AssetAllocation) => sum + item.value, 0);
        
        // Add percentage to each item
        const dataWithPercentage = allocations.map((item: AssetAllocation) => ({
          ...item,
          percentage: ((item.value / total) * 100).toFixed(1)
        }));
        
        setData(dataWithPercentage);
      } catch (error) {
        console.error('Error fetching asset allocation:', error);
        // Fallback data
        const fallbackData = [
          { name: 'Technology', value: 4500, percentage: '45.0' },
          { name: 'Financial Services', value: 1500, percentage: '15.0' },
          { name: 'Healthcare', value: 1200, percentage: '12.0' },
          { name: 'Consumer Defensive', value: 1000, percentage: '10.0' },
          { name: 'Communication Services', value: 800, percentage: '8.0' },
          { name: 'Other', value: 1000, percentage: '10.0' },
        ];
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
          <CardDescription>Loading your asset allocation...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-[300px] w-[300px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  // Get theme colors for pie chart
  const COLORS = getChartColors.pie();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Distribution of your investment portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 