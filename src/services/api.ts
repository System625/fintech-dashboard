// API Base Configuration and Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export class ApiException extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Base API function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // For demo purposes, throw a simulated network error to trigger fallback data
      throw new ApiException(
        `API endpoint not available (${response.status})`,
        response.status
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // API returned HTML instead of JSON, likely a 404 - trigger fallback
      throw new ApiException(
        'API endpoint not configured - using demo data',
        404
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// Account Types and API
export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment' | 'credit';
}

export const accountsApi = {
  getAll: (): Promise<Account[]> => apiRequest('/accounts'),
};

// Transaction Types and API
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
  accountId: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  color: string;
}

export interface MonthlyTransactionData {
  month: string;
  income: number;
  expenses: number;
}

export const transactionsApi = {
  getAll: (): Promise<Transaction[]> => apiRequest('/transactions'),
  getRecent: (): Promise<Transaction[]> => apiRequest('/transactions/recent'),
  getCategories: (): Promise<TransactionCategory[]> => apiRequest('/transactions/categories'),
  getMonthly: (): Promise<MonthlyTransactionData[]> => apiRequest('/transactions/monthly'),
};

// Savings Types and API
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
}

export interface SavingsHistory {
  date: string;
  amount: number;
}

export const savingsApi = {
  getAll: (): Promise<SavingsGoal[]> => apiRequest('/savings'),
  getHistory: (accountId: string): Promise<SavingsHistory[]> => 
    apiRequest(`/savings/${accountId}/history`),
  create: (goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> =>
    apiRequest('/savings', {
      method: 'POST',
      body: JSON.stringify(goal),
    }),
};

// Investments Types and API
export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface InvestmentAllocation {
  category: string;
  value: number;
  percentage: number;
}

export interface InvestmentPerformance {
  date: string;
  value: number;
}

export const investmentsApi = {
  getAll: (): Promise<Investment[]> => apiRequest('/investments'),
  getAllocation: (): Promise<InvestmentAllocation[]> => apiRequest('/investments/allocation'),
  getPerformance: (): Promise<InvestmentPerformance[]> => apiRequest('/investments/performance'),
  buy: (data: { symbol: string; shares: number; accountId: string }): Promise<Investment> =>
    apiRequest('/investments/buy', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Bills Types and API
export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category?: string;
  isPaid?: boolean;
  isRecurring?: boolean;
  status?: 'upcoming' | 'overdue' | 'paid';
}

export const billsApi = {
  getUpcoming: (): Promise<UpcomingBill[]> => apiRequest('/bills/upcoming'),
};

// Dashboard Types and API
export interface DashboardOverview {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netWorth: number;
  chartData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export const dashboardApi = {
  getOverview: (): Promise<DashboardOverview> => apiRequest('/dashboard/overview'),
};

// Analytics Types and API
export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface FinancialInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement';
  title: string;
  description: string;
  icon: string;
}

export const analyticsApi = {
  getSpendingCategories: (): Promise<SpendingCategory[]> => apiRequest('/analytics/spending-categories'),
  getInsights: (): Promise<FinancialInsight[]> => apiRequest('/analytics/insights'),
};