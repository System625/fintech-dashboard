import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpenseCategoriesChart, MonthlyExpenseChart } from '@/components/charts';
import { TransactionFilterForm } from '@/components/forms/TransactionFilterForm';
import { GlitchText } from '@/components/ui/GlitchText';
import { Toaster } from "sonner";
import { Download } from 'lucide-react';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateRange: 'all',
  });

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        const transactionsList = data.transactions || data;
        setTransactions(transactionsList);
        setFilteredTransactions(transactionsList);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Use sample data as fallback
        const sampleTransactions: Transaction[] = [
          { id: 'tx-001', date: '2024-03-25', description: 'Grocery Store', amount: 125.75, type: 'expense', category: 'Food' },
          { id: 'tx-002', date: '2024-03-21', description: 'Salary Deposit', amount: 3500.00, type: 'income', category: 'Income' },
          { id: 'tx-003', date: '2024-03-19', description: 'Coffee Shop', amount: 8.50, type: 'expense', category: 'Food' },
          { id: 'tx-004', date: '2024-03-15', description: 'Electricity Bill', amount: 87.40, type: 'expense', category: 'Utilities' },
          { id: 'tx-005', date: '2024-03-10', description: 'Internet Bill', amount: 75.00, type: 'expense', category: 'Utilities' },
          { id: 'tx-006', date: '2024-03-07', description: 'Clothing Store', amount: 124.99, type: 'expense', category: 'Shopping' },
          { id: 'tx-007', date: '2024-03-05', description: 'Ride Share', amount: 18.75, type: 'expense', category: 'Transportation' },
          { id: 'tx-008', date: '2024-03-01', description: 'Rent Payment', amount: 1500.00, type: 'expense', category: 'Housing' },
        ];
        setTransactions(sampleTransactions);
        setFilteredTransactions(sampleTransactions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (transactions.length === 0) return;

    let result = [...transactions];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        tx => 
          tx.description.toLowerCase().includes(searchTerm) ||
          tx.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by transaction type
    if (filters.type !== 'all') {
      result = result.filter(tx => tx.type === filters.type);
    }

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(tx => tx.category.toLowerCase() === filters.category);
    }

    // Filter by date range
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
          startDate = new Date(0); // Beginning of time
      }
      
      result = result.filter(tx => new Date(tx.date) >= startDate);
    }

    setFilteredTransactions(result);
  }, [filters, transactions]);

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    search: string;
    type: string;
    category: string;
    dateRange: string;
  }) => {
    setFilters(newFilters);
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const exportTransactions = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        formatDate(tx.date),
        `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes in CSV
        `"${tx.category}"`,
        tx.amount,
        tx.type
      ].join(','))
    ].join('\n');
    
    // Create and download file
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
          <Button 
            className="mt-4 sm:mt-0 cyber-glow-blue cyber-border hover:shadow-lg text-foreground" 
            variant="outline" 
            onClick={exportTransactions}
          >
            <Download className="mr-2 h-4 w-4" />
            <GlitchText intensity="low" trigger="hover">Export</GlitchText>
          </Button>
        </div>

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
              <p className="text-muted-foreground">No transactions found matching the current filters.</p>
              <Button 
                variant="link" 
                onClick={() => setFilters({ search: '', type: 'all', category: 'all', dateRange: 'all' })}
                className="cyber-glow-pink"
              >
                <GlitchText intensity="low" trigger="hover">Clear filters</GlitchText>
              </Button>
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
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{formatDate(tx.date)}</td>
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{tx.description}</td>
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-muted">
                            {tx.category}
                          </span>
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
          
          {filteredTransactions.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="cyber-glow-green cyber-border">
                <GlitchText intensity="low" trigger="hover">Load More</GlitchText>
              </Button>
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