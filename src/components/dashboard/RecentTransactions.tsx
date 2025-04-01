import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income' | 'transfer';
  category: string;
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions/recent');
        if (!response.ok) {
          throw new Error('Failed to fetch recent transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
        // Fallback data
        setTransactions([
          {
            id: '1',
            description: 'Grocery Shopping',
            amount: 85.23,
            date: '2023-05-01T10:30:00Z',
            type: 'expense',
            category: 'Food'
          },
          {
            id: '2',
            description: 'Salary Deposit',
            amount: 2750.00,
            date: '2023-04-29T09:15:00Z',
            type: 'income',
            category: 'Salary'
          },
          {
            id: '3',
            description: 'Coffee Shop',
            amount: 4.50,
            date: '2023-04-28T13:45:00Z',
            type: 'expense',
            category: 'Food & Drink'
          },
          {
            id: '4',
            description: 'Transfer to Savings',
            amount: 500.00,
            date: '2023-04-27T16:20:00Z',
            type: 'transfer',
            category: 'Transfer'
          },
          {
            id: '5',
            description: 'Electricity Bill',
            amount: 72.45,
            date: '2023-04-26T11:05:00Z',
            type: 'expense',
            category: 'Utilities'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  if (isLoading) {
    return <div className="py-6 text-center">Loading recent transactions...</div>;
  }

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
      {transactions.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No recent transactions found</div>
      ) : (
        transactions.map((transaction) => (
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
        ))
      )}
    </div>
  );
} 