import { Building, CreditCard, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

interface AccountSummaryProps {
  accounts: Account[];
  isLoading: boolean;
}

export function AccountSummary({ accounts, isLoading }: AccountSummaryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        <div className="h-20 rounded-md bg-muted/30 animate-pulse" />
        <div className="h-20 rounded-md bg-muted/30 animate-pulse" />
        <div className="h-20 rounded-md bg-muted/30 animate-pulse" />
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No accounts found. Add an account to get started.
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="h-5 w-5" />;
      case 'savings':
        return <Building className="h-5 w-5" />;
      case 'investment':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {accounts.map((account) => {
        // Calculate what percentage of total balance this account represents
        const percentage = (account.balance / totalBalance) * 100;
        
        return (
          <div key={account.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{account.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${account.balance.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</div>
              </div>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}
    </div>
  );
} 