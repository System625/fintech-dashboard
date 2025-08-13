import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { getChartGradients } from '@/lib/chartTheme';

// Define the CategoryExpense type
interface CategoryExpense {
  name: string;
  amount: number;
  percentage: number;
}

// Fallback data for when API fails
const fallbackCategoryData: CategoryExpense[] = [
  { name: 'Housing', amount: 1200, percentage: 40 },
  { name: 'Food', amount: 450, percentage: 15 },
  { name: 'Utilities', amount: 300, percentage: 10 },
  { name: 'Shopping', amount: 270, percentage: 9 },
  { name: 'Transportation', amount: 180, percentage: 6 },
  { name: 'Health', amount: 150, percentage: 5 },
  { name: 'Entertainment', amount: 120, percentage: 4 },
  { name: 'Dining', amount: 180, percentage: 6 },
  { name: 'Other', amount: 150, percentage: 5 }
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-3 border rounded-md shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">${data.amount.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{data.percentage}% of total expenses</p>
      </div>
    );
  }
  return null;
};

export function ExpenseCategoriesChart() {
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>(fallbackCategoryData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/transactions/categories');
        
        if (!response.ok) {
          console.log("Using fallback data for category expenses chart");
          return; // Will use fallback data
        }
        
        const data = await response.json();
        setCategoryData(data);
      } catch (err) {
        console.warn('Using fallback data for category expenses', err);
        // Already using fallback data, so no need to update state
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert our data format to format expected by Recharts and sort by amount
  const chartData = [...categoryData]
    .sort((a, b) => b.amount - a.amount)
    .map((item) => ({
      name: item.name,
      amount: item.amount,
      percentage: item.percentage,
    }));

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.amount, 0);
  const barGradients = getChartGradients.bar();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense by Category</CardTitle>
          <CardDescription>Breakdown of monthly expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading expense category data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense by Category</CardTitle>
        <CardDescription>
          Breakdown of monthly expenses - Total: ${totalExpenses.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={chartData} 
                layout="vertical"
                margin={{ top: 0, right: 0, left: 60, bottom: 0 }}
              >
                <defs>
                  {barGradients.map((gradient, index) => (
                    <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={gradient.baseColor} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={gradient.baseColor} stopOpacity={0.9} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient${index % barGradients.length})`}
                      stroke={barGradients[index % barGradients.length].baseColor}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
                <Tooltip content={<CustomTooltip />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          {chartData.slice(0, 5).map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    background: `linear-gradient(135deg, ${barGradients[index % barGradients.length].baseColor} 0%, ${barGradients[index % barGradients.length].baseColor}80 100%)`
                  }}
                />
                <span className="text-sm">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">${category.amount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">({category.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

} 
