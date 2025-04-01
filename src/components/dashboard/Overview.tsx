import { useEffect, useState } from 'react';
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

export function Overview() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/overview');
        if (!response.ok) {
          throw new Error('Failed to fetch overview data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching overview data:', error);
        // Fallback data
        setData([
          {
            name: 'Jan',
            income: 2400,
            expenses: 1400,
            savings: 1000
          },
          {
            name: 'Feb',
            income: 2210,
            expenses: 1380,
            savings: 830
          },
          {
            name: 'Mar',
            income: 2500,
            expenses: 1500,
            savings: 1000
          },
          {
            name: 'Apr',
            income: 2780,
            expenses: 1890,
            savings: 890
          },
          {
            name: 'May',
            income: 2890,
            expenses: 1700,
            savings: 1190
          },
          {
            name: 'Jun',
            income: 3090,
            expenses: 1850,
            savings: 1240
          },
          {
            name: 'Jul',
            income: 3490,
            expenses: 2100,
            savings: 1390
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading financial overview...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
        <Area type="monotone" dataKey="income" stackId="1" stroke="#8884d8" fill="#8884d8" name="Income" />
        <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Expenses" />
        <Area type="monotone" dataKey="savings" stackId="3" stroke="#ffc658" fill="#ffc658" name="Savings" />
      </AreaChart>
    </ResponsiveContainer>
  );
} 