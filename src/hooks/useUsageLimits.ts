import { useMemo } from 'react';
import { useAccounts, useTransactions, useSavings, useBills } from '@/hooks/useApi';
import { useSubscription } from '@/hooks/useSubscription';

/** Aggregates current usage counts and compares against tier limits. */
export function useUsageLimits() {
  const { limits, isProUser } = useSubscription();
  const { data: accounts } = useAccounts();
  const { data: transactions } = useTransactions();
  const { data: savings } = useSavings();
  const { data: bills } = useBills();

  return useMemo(() => {
    const now = new Date();

    // Count transactions this month
    const monthlyTransactions = (transactions ?? []).filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const usage = {
      accounts: {
        used: accounts?.length ?? 0,
        limit: limits.accounts,
        atLimit: (accounts?.length ?? 0) >= limits.accounts,
      },
      transactionsPerMonth: {
        used: monthlyTransactions,
        limit: limits.transactionsPerMonth,
        atLimit: monthlyTransactions >= limits.transactionsPerMonth,
      },
      savingsGoals: {
        used: savings?.length ?? 0,
        limit: limits.savingsGoals,
        atLimit: (savings?.length ?? 0) >= limits.savingsGoals,
      },
      bills: {
        used: bills?.length ?? 0,
        limit: limits.bills,
        atLimit: (bills?.length ?? 0) >= limits.bills,
      },
    };

    return { usage, isProUser };
  }, [accounts, transactions, savings, bills, limits, isProUser]);
}
