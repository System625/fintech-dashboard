import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpenseCategoriesChart, MonthlyExpenseChart } from '@/components/charts';
import { TransactionFilterForm } from '@/components/forms/TransactionFilterForm';
import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import { GlitchText } from '@/components/ui/GlitchText';
import { Toaster } from "sonner";
import { Download } from 'lucide-react';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';
import { useTransactions } from '@/hooks/useApi';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { UsageLimitWarning } from '@/components/subscription/UsageLimitWarning';
import { ProFeature } from '@/components/subscription/ProFeature';
import type { Transaction } from '@/services/firestore';

const TransactionsPage = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  const { usage } = useUsageLimits();
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateRange: 'all',
  });

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchTerm) ||
          tx.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter((tx) => tx.type === filters.type);
    }

    if (filters.category !== 'all') {
      result = result.filter((tx) => tx.category.toLowerCase() === filters.category);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter': {
          const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterMonth, 1);
          break;
        }
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }

      result = result.filter((tx) => new Date(tx.date) >= startDate);
    }

    return result;
  }, [filters, transactions]);

  const handleFilterChange = (newFilters: {
    search: string;
    type: string;
    category: string;
    dateRange: string;
  }) => {
    setFilters(newFilters);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const exportTransactions = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map((tx: Transaction) =>
        [
          formatDate(tx.date),
          `"${tx.description.replace(/"/g, '""')}"`,
          `"${tx.category}"`,
          tx.amount,
          tx.type,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ContentAreaLoader visible={isLoading} message="Loading transactions" />
      {!isLoading && (
        <div className="space-y-6">
          <Toaster position="top-right" />

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                <GlitchText intensity="low" trigger="hover">Transactions</GlitchText>
              </h1>
              <p className="text-muted-foreground">
                View and manage your financial transactions
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <AddTransactionForm disabled={usage.transactionsPerMonth.atLimit} />
              <ProFeature feature="csvExport" label="CSV Export">
                <Button
                  className="cyber-glow-blue cyber-border hover:shadow-lg text-foreground"
                  variant="outline"
                  onClick={exportTransactions}
                >
                  <Download className="mr-2 h-4 w-4" />
                  <GlitchText intensity="low" trigger="hover">Export</GlitchText>
                </Button>
              </ProFeature>
            </div>
          </div>

          <UsageLimitWarning
            resource="transactionsPerMonth"
            used={usage.transactionsPerMonth.used}
            limit={usage.transactionsPerMonth.limit}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <ExpenseCategoriesChart />
            <MonthlyExpenseChart />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and search your recent financial activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <TransactionFilterForm onFilter={handleFilterChange} />
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  {transactions.length === 0 ? (
                    <p className="text-muted-foreground">
                      No transactions yet. Add your first transaction to get started.
                    </p>
                  ) : (
                    <>
                      <p className="text-muted-foreground">No transactions match the current filters.</p>
                      <Button
                        variant="link"
                        onClick={() => setFilters({ search: '', type: 'all', category: 'all', dateRange: 'all' })}
                        className="cyber-glow-pink"
                      >
                        <GlitchText intensity="low" trigger="hover">Clear filters</GlitchText>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <div className="scrollable-table-container">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Date</th>
                          <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Description</th>
                          <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Category</th>
                          <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx: Transaction) => (
                          <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{formatDate(tx.date)}</td>
                            <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                              {tx.description}
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">
                              <span className="px-2 py-1 rounded-full text-xs bg-muted">{tx.category}</span>
                            </td>
                            <td className={`py-3 px-2 sm:px-4 text-xs sm:text-sm text-right font-medium ${
                              tx.type === 'income' ? 'text-green-600' : ''
                            }`}>
                              {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-xs text-muted-foreground text-center py-2 md:hidden">
                    Swipe to view more →
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TransactionsPage;
