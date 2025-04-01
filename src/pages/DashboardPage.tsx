import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/Overview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { FinancialInsights } from '@/components/dashboard/FinancialInsights';
import { UpcomingBills } from '@/components/dashboard/UpcomingBills';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Toaster } from 'sonner';

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const metrics = {
    monthlySpend: 1250.88,
    savingsRate: 18.2,
    upcomingBills: 345.00,
    changeInSpend: -12,
    changeInSavings: 2.5
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Fallback data if API fails
      setAccounts([
        { id: '1', name: 'Checking Account', balance: 2540.32, type: 'checking' },
        { id: '2', name: 'Savings Account', balance: 12750.89, type: 'savings' },
        { id: '3', name: 'Investment Account', balance: 8427.15, type: 'investment' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTransactionComplete = () => {
    // Refresh accounts data when a transaction is completed
    fetchAccounts();
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Toaster />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : `$${totalBalance.toFixed(2)}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.monthlySpend.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.changeInSpend}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Savings Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.savingsRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +{metrics.changeInSavings}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.upcomingBills.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Due in the next 7 days
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Transfer money, pay bills, or deposit funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActions onActionComplete={handleTransactionComplete} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent financial activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>
                  Overview of your accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountSummary accounts={accounts} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
                <CardDescription>
                  Analysis of your spending habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialInsights />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
                <CardDescription>
                  Bills due in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingBills />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 