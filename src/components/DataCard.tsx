import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  trend?: number;
}

export function DataCard({ title, value, description, icon, trend }: DataCardProps) {
  // Determine trend direction and icon
  const isTrendPositive = trend !== undefined && trend >= 0;
  const trendIcon = isTrendPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  const trendText = trend !== undefined ? `${isTrendPositive ? '+' : ''}${trend.toFixed(2)}%` : null;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <div className="flex items-center text-xs">
            {trend !== undefined ? (
              <p className={`flex items-center gap-1 ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trendIcon}
                {trendText}
              </p>
            ) : (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 