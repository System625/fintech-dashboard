import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Define the CategoryExpense type
interface CategoryExpense {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

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
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/transactions/categories');
        const data = await response.json();
        setCategoryData(data);
      } catch (err) {
        setError('Failed to load category expense data');
        console.error(err);
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
      fill: item.color.replace('bg-', 'var(--')
        .replace('-', ')')
        .replace(/\d+$/, '')
        .concat(')'),
    }));

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.amount, 0);

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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense by Category</CardTitle>
          <CardDescription>Breakdown of monthly expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-destructive">{error}</p>
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
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
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
                  style={{ backgroundColor: category.fill }}
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