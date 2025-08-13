import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  accountsApi,
  transactionsApi,
  savingsApi,
  investmentsApi,
  billsApi,
  dashboardApi,
  analyticsApi,
} from '@/services/api';

// Query Keys - centralized for better cache management
export const queryKeys = {
  accounts: ['accounts'] as const,
  transactions: {
    all: ['transactions'] as const,
    recent: ['transactions', 'recent'] as const,
    categories: ['transactions', 'categories'] as const,
    monthly: ['transactions', 'monthly'] as const,
  },
  savings: {
    all: ['savings'] as const,
    history: (accountId: string) => ['savings', accountId, 'history'] as const,
  },
  investments: {
    all: ['investments'] as const,
    allocation: ['investments', 'allocation'] as const,
    performance: ['investments', 'performance'] as const,
  },
  bills: {
    upcoming: ['bills', 'upcoming'] as const,
  },
  dashboard: {
    overview: ['dashboard', 'overview'] as const,
  },
  analytics: {
    spendingCategories: ['analytics', 'spending-categories'] as const,
    insights: ['analytics', 'insights'] as const,
  },
} as const;

// Default query options
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 1, // Only retry once for demo
  retryDelay: 1000, // 1 second delay
};

// ============== ACCOUNTS ==============
export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: async () => {
      try {
        return await accountsApi.getAll();
      } catch (error) {
        // Return fallback data for demo
        return [
          { id: '1', name: 'Checking Account', balance: 2540.32, type: 'checking' as const },
          { id: '2', name: 'Savings Account', balance: 12750.89, type: 'savings' as const },
          { id: '3', name: 'Investment Account', balance: 8427.15, type: 'investment' as const }
        ];
      }
    },
    ...defaultQueryOptions,
  });
}

// ============== TRANSACTIONS ==============
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: transactionsApi.getAll,
    ...defaultQueryOptions,
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.recent,
    queryFn: async () => {
      try {
        return await transactionsApi.getRecent();
      } catch (error) {
        // Return fallback data for demo
        return [
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
          }
        ];
      }
    },
    ...defaultQueryOptions,
  });
}

export function useTransactionCategories() {
  return useQuery({
    queryKey: queryKeys.transactions.categories,
    queryFn: transactionsApi.getCategories,
    ...defaultQueryOptions,
  });
}

export function useMonthlyTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.monthly,
    queryFn: transactionsApi.getMonthly,
    ...defaultQueryOptions,
  });
}

// ============== SAVINGS ==============
export function useSavings() {
  return useQuery({
    queryKey: queryKeys.savings.all,
    queryFn: savingsApi.getAll,
    ...defaultQueryOptions,
  });
}

export function useSavingsHistory(accountId: string) {
  return useQuery({
    queryKey: queryKeys.savings.history(accountId),
    queryFn: () => savingsApi.getHistory(accountId),
    enabled: !!accountId, // Only run if accountId is provided
    ...defaultQueryOptions,
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: savingsApi.create,
    onSuccess: () => {
      // Invalidate and refetch savings queries
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
    },
  });
}

// ============== INVESTMENTS ==============
export function useInvestments() {
  return useQuery({
    queryKey: queryKeys.investments.all,
    queryFn: investmentsApi.getAll,
    ...defaultQueryOptions,
  });
}

export function useInvestmentAllocation() {
  return useQuery({
    queryKey: queryKeys.investments.allocation,
    queryFn: investmentsApi.getAllocation,
    ...defaultQueryOptions,
  });
}

export function useInvestmentPerformance() {
  return useQuery({
    queryKey: queryKeys.investments.performance,
    queryFn: investmentsApi.getPerformance,
    ...defaultQueryOptions,
  });
}

export function useBuyInvestment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: investmentsApi.buy,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.investments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.investments.allocation });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

// ============== BILLS ==============
export function useUpcomingBills() {
  return useQuery({
    queryKey: queryKeys.bills.upcoming,
    queryFn: async () => {
      try {
        return await billsApi.getUpcoming();
      } catch (error) {
        // Return fallback data for demo
        return [
          {
            id: '1',
            name: 'Electricity Bill',
            amount: 85.20,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            isRecurring: true,
            status: 'upcoming' as const
          },
          {
            id: '2',
            name: 'Internet Service',
            amount: 65.00,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            isRecurring: true,
            status: 'upcoming' as const
          }
        ];
      }
    },
    ...defaultQueryOptions,
  });
}

// ============== DASHBOARD ==============
export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: async () => {
      try {
        return await dashboardApi.getOverview();
      } catch (error) {
        // Return fallback data for demo
        return {
          totalBalance: 23718.36,
          monthlyIncome: 3090,
          monthlyExpenses: 1850,
          netWorth: 45230.12,
          chartData: [
            { month: 'Jan', income: 2400, expenses: 1400 },
            { month: 'Feb', income: 2210, expenses: 1380 },
            { month: 'Mar', income: 2500, expenses: 1500 },
            { month: 'Apr', income: 2780, expenses: 1890 },
            { month: 'May', income: 2890, expenses: 1700 },
            { month: 'Jun', income: 3090, expenses: 1850 }
          ]
        };
      }
    },
    ...defaultQueryOptions,
  });
}

// ============== ANALYTICS ==============
export function useSpendingCategories() {
  return useQuery({
    queryKey: queryKeys.analytics.spendingCategories,
    queryFn: analyticsApi.getSpendingCategories,
    ...defaultQueryOptions,
  });
}

export function useFinancialInsights() {
  return useQuery({
    queryKey: queryKeys.analytics.insights,
    queryFn: analyticsApi.getInsights,
    ...defaultQueryOptions,
  });
}

// ============== UTILITY HOOKS ==============
export function useRefreshAll() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries();
  };
}

export function useRefreshAccounts() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
  };
}