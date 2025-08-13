import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useRecentTransactions } from '@/hooks/useApi';

export function RecentTransactions() {
  const { data: transactions = [], isLoading, error } = useRecentTransactions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load recent transactions</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent transactions found</p>
      </div>
    );
  }

  // Use actual data or fallback for demo
  const displayTransactions = transactions.length > 0 ? transactions : [
    {
      id: '1',
      description: 'Grocery Shopping',
      amount: 85.23,
      date: '2023-05-01T10:30:00Z',
      type: 'expense' as const,
      category: 'Food',
      accountId: '1'
    },
    {
      id: '2',
      description: 'Salary Deposit',
      amount: 2750.00,
      date: '2023-04-29T09:15:00Z',
      type: 'income' as const,
      category: 'Salary',
      accountId: '1'
    },
    {
      id: '3',
      description: 'Coffee Shop',
      amount: 4.50,
      date: '2023-04-28T13:45:00Z',
      type: 'expense' as const,
      category: 'Food & Drink',
      accountId: '1'
    }
  ];

  const getIconForCategory = (category: string) => {
    const firstChar = category.charAt(0).toUpperCase();
    return firstChar;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return 'text-red-500';
      case 'income':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return <ArrowUpIcon className="h-3 w-3 rotate-45 text-red-500" />;
      case 'income':
        return <ArrowDownIcon className="h-3 w-3 -rotate-45 text-green-500" />;
      default:
        return <ArrowDownIcon className="h-3 w-3 rotate-90 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {displayTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getIconForCategory(transaction.category)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="hidden md:flex items-center">
                <p className="text-sm font-medium mr-2">{transaction.description}</p>
                <Badge variant="outline" className="text-xs">
                  {transaction.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
              {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}$
              {transaction.amount.toFixed(2)}
            </span>
            <span className="ml-2">{getTypeIcon(transaction.type)}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 