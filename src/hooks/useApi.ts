import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  accountsService,
  transactionsService,
  savingsService,
  billsService,
} from '@/services/firestore';

// Query Keys
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
    all: ['bills', 'all'] as const,
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

const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
};

// ============== ACCOUNTS ==============
export function useAccounts() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => accountsService.getAll(uid!),
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

// ============== TRANSACTIONS ==============
export function useTransactions() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: () => transactionsService.getAll(uid!),
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

export function useRecentTransactions() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.transactions.recent,
    queryFn: () => transactionsService.getRecent(uid!, 10),
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (data: Parameters<typeof transactionsService.create>[1]) =>
      transactionsService.create(uid!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (txId: string) => transactionsService.delete(uid!, txId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: ({ txId, data }: { txId: string; data: Parameters<typeof transactionsService.update>[2] }) =>
      transactionsService.update(uid!, txId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

export function useTransferFunds() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: ({ fromAccountId, toAccountId, amount }: { fromAccountId: string; toAccountId: string; amount: number }) =>
      transactionsService.transfer(uid!, fromAccountId, toAccountId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.recent });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useAddAccount() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (data: Parameters<typeof accountsService.create>[1]) =>
      accountsService.create(uid!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: ({ accountId, data }: { accountId: string; data: Parameters<typeof accountsService.update>[2] }) =>
      accountsService.update(uid!, accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (accountId: string) => accountsService.delete(uid!, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    },
  });
}

// ============== SAVINGS ==============
export function useSavings() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.savings.all,
    queryFn: () => savingsService.getAll(uid!),
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (data: Parameters<typeof savingsService.create>[1]) =>
      savingsService.create(uid!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
    },
  });
}

export function useContributeToGoal() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string; amount: number }) =>
      savingsService.contribute(uid!, goalId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: Parameters<typeof savingsService.update>[2] }) =>
      savingsService.update(uid!, goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (goalId: string) => savingsService.delete(uid!, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savings.all });
    },
  });
}

// ============== BILLS ==============
export function useBills() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.bills.all,
    queryFn: () => billsService.getAll(uid!),
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

export function useAddBill() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (data: Parameters<typeof billsService.create>[1]) =>
      billsService.create(uid!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.upcoming });
    },
  });
}

export function useUpdateBill() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: ({ billId, data }: { billId: string; data: Parameters<typeof billsService.update>[2] }) =>
      billsService.update(uid!, billId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.upcoming });
    },
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (billId: string) => billsService.delete(uid!, billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.upcoming });
    },
  });
}

export function useUpcomingBills() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.bills.upcoming,
    queryFn: () => billsService.getUpcoming(uid!),
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

export function useMarkBillPaid() {
  const queryClient = useQueryClient();
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useMutation({
    mutationFn: (billId: string) => billsService.markPaid(uid!, billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bills.upcoming });
    },
  });
}

// ============== DASHBOARD ==============

/** Derives overview from accounts, transactions, and bills. */
export function useDashboardOverview() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: async () => {
      const [accounts, transactions, bills] = await Promise.all([
        accountsService.getAll(uid!),
        transactionsService.getAll(uid!),
        billsService.getUpcoming(uid!),
      ]);

      const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

      const now = new Date();
      const thisMonth = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      const monthlyIncome = thisMonth
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const monthlyExpenses = thisMonth
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const savingsRate = monthlyIncome > 0
        ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
        : 0;

      const upcomingBillsTotal = bills
        .filter((b) => {
          const d = new Date(b.dueDate);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, b) => sum + b.amount, 0);

      // Build last-6-months chart data
      const chartData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const month = d.toLocaleString('default', { month: 'short' });
        const txs = transactions.filter((t) => {
          const td = new Date(t.date);
          return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
        });
        const inc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { month, income: inc, expenses: exp, net: inc - exp };
      });

      return {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlySpend: monthlyExpenses,
        savingsRate,
        upcomingBillsTotal,
        netWorth: totalBalance,
        chartData,
      };
    },
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

// ============== ANALYTICS ==============

export function useSpendingCategories() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  return useQuery({
    queryKey: queryKeys.analytics.spendingCategories,
    queryFn: async () => {
      const transactions = await transactionsService.getAll(uid!, { type: 'expense' });
      const totals: Record<string, number> = {};
      for (const t of transactions) {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
      }
      const grand = Object.values(totals).reduce((s, v) => s + v, 0);
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
      return Object.entries(totals).map(([category, amount], i) => ({
        category,
        amount,
        percentage: grand > 0 ? Math.round((amount / grand) * 100) : 0,
        color: colors[i % colors.length],
      }));
    },
    enabled: !!uid,
    ...defaultQueryOptions,
  });
}

// ============== UTILITY ==============
export function useRefreshAll() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
}

export function useRefreshAccounts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
}
