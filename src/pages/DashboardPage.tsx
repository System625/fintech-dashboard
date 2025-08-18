import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberData } from '@/components/ui/CyberData';
import { GlitchText } from '@/components/ui/GlitchText';
import { Overview } from '@/components/dashboard/Overview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { FinancialInsights } from '@/components/dashboard/FinancialInsights';
import { UpcomingBills } from '@/components/dashboard/UpcomingBills';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Toaster } from 'sonner';
import { useAccounts, useRefreshAccounts } from '@/hooks/useApi';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';

export default function DashboardPage() {
  const { data: accounts = [], isLoading, error } = useAccounts();
  const refreshAccounts = useRefreshAccounts();
  
  const metrics = {
    monthlySpend: 1250.88,
    savingsRate: 18.2,
    upcomingBills: 345.00,
    changeInSpend: -12,
    changeInSavings: 2.5
  };

  const handleTransactionComplete = () => {
    // Refresh accounts data when a transaction is completed
    refreshAccounts();
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <>
      <ContentAreaLoader visible={isLoading} message="Loading dashboard" />
      {error && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-destructive">Unable to load content</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
              <button 
                onClick={refreshAccounts}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      {!isLoading && !error && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Toaster />
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              <GlitchText intensity="low" trigger="hover">
                Dashboard
              </GlitchText>
            </h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">
                <GlitchText intensity="low" trigger="hover">Overview</GlitchText>
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <GlitchText intensity="low" trigger="hover">Analytics</GlitchText>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CyberCard glow="blue" scanLines>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium cyberpunk-title">
                      Total Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CyberData 
                      value={isLoading ? '...' : totalBalance.toFixed(2)}
                      prefix="$"
                      size="lg"
                      pulse={isLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </CyberCard>
                
                <CyberCard glow="green" dataStream>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium cyberpunk-title">
                      Monthly Spend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CyberData 
                      value={metrics.monthlySpend.toFixed(2)}
                      prefix="$"
                      size="lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {metrics.changeInSpend}% from last month
                    </p>
                  </CardContent>
                </CyberCard>
                
                <CyberCard glow="pink" animatedBorder>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium cyberpunk-title">
                      Savings Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CyberData 
                      value={metrics.savingsRate}
                      suffix="%"
                      size="lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      +{metrics.changeInSavings}% from last month
                    </p>
                  </CardContent>
                </CyberCard>
                
                <CyberCard glow="blue" scanLines dataStream>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium cyberpunk-title">
                      Upcoming Bills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CyberData 
                      value={metrics.upcomingBills.toFixed(2)}
                      prefix="$"
                      size="lg"
                      terminalCursor
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Due in the next 7 days
                    </p>
                  </CardContent>
                </CyberCard>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <CyberCard className="col-span-4" glow="blue" scanLines>
                  <CardHeader>
                    <CardTitle className="cyberpunk-title">
                      <GlitchText intensity="low">Financial Overview</GlitchText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </CyberCard>
                <CyberCard className="col-span-3" glow="green" animatedBorder>
                  <CardHeader>
                    <CardTitle className="cyberpunk-title">
                      <GlitchText intensity="low">Quick Actions</GlitchText>
                    </CardTitle>
                    <CardDescription>
                      Transfer money, pay bills, or deposit funds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QuickActions onActionComplete={handleTransactionComplete} />
                  </CardContent>
                </CyberCard>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <CyberCard className="col-span-4" glow="pink" dataStream>
                  <CardHeader>
                    <CardTitle className="cyberpunk-title">
                      <GlitchText intensity="low">Recent Transactions</GlitchText>
                    </CardTitle>
                    <CardDescription>
                      Your recent financial activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions />
                  </CardContent>
                </CyberCard>
                <CyberCard className="col-span-3" glow="blue" scanLines animatedBorder>
                  <CardHeader>
                    <CardTitle className="cyberpunk-title">
                      <GlitchText intensity="low">Account Summary</GlitchText>
                    </CardTitle>
                    <CardDescription>
                      Overview of your accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AccountSummary accounts={accounts} isLoading={isLoading} />
                  </CardContent>
                </CyberCard>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <CyberCard className="col-span-4" glow="green" scanLines dataStream>
                  <CardHeader>
                    <CardTitle className="cyberpunk-title">
                      <GlitchText intensity="medium">Financial Insights</GlitchText>
                    </CardTitle>
                    <CardDescription>
                      Analysis of your spending habits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FinancialInsights />
                  </CardContent>
                </CyberCard>
                <CyberCard className="col-span-3" glow="pink" animatedBorder>
                  <CardHeader>
                    <CardTitle className="cyberpunk-title">
                      <GlitchText intensity="medium">Upcoming Bills</GlitchText>
                    </CardTitle>
                    <CardDescription>
                      Bills due in the next 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingBills />
                  </CardContent>
                </CyberCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
} 