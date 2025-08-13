import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getChartGradients } from '@/lib/chartTheme';

interface CategoryData {
  name: string;
  value: number;
  change: number;
}

interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
}

// Define a label renderer type to avoid TypeScript errors
type LabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
};

export function FinancialInsights() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be separate API calls
        const categoryResponse = await fetch('/api/analytics/spending-categories');
        const insightsResponse = await fetch('/api/analytics/insights');
        
        if (!categoryResponse.ok || !insightsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const categories = await categoryResponse.json();
        const insightsData = await insightsResponse.json();
        
        setCategoryData(categories);
        setInsights(insightsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Fallback data
        setCategoryData([
          { name: 'Food & Dining', value: 650, change: 5.2 },
          { name: 'Transportation', value: 420, change: -3.8 },
          { name: 'Entertainment', value: 280, change: 12.5 },
          { name: 'Shopping', value: 350, change: -8.1 },
          { name: 'Utilities', value: 220, change: 0.5 },
        ]);
        
        setInsights([
          {
            title: 'Spending Reduction',
            description: 'Your shopping expenses decreased by 8.1% compared to last month.',
            type: 'positive'
          },
          {
            title: 'Unusual Activity',
            description: 'Entertainment spending is up 12.5% this month.',
            type: 'neutral'
          },
          {
            title: 'Budget Alert',
            description: "You've spent 85% of your food budget, and it's only halfway through the month.",
            type: 'negative'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get gradient effects for pie chart
  const pieGradients = getChartGradients.pie();

  // Custom label renderer function
  const renderCustomizedLabel = (props: LabelProps) => {
    const { name, percent } = props;
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-l-green-500';
      case 'negative':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {pieGradients.map((gradient, index) => (
                <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradient.baseColor} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={gradient.baseColor} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {categoryData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#pieGradient${index % pieGradients.length})`}
                  stroke={pieGradients[index % pieGradients.length].baseColor}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getInsightIcon(insight.type)}</div>
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 