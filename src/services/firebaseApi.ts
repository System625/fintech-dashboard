// Firebase Cloud Functions API - Secure server-side operations
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

// Initialize Cloud Functions
const functions = getFunctions(app);

// Firebase Cloud Functions API - Secure server-side operations

interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  userId: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
  accountId: string;
  userId: string;
}

interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  userId: string;
}

// Secure Firebase API using Cloud Functions
export class FirebaseSecureApi {
  // Account operations
  static async getAccounts(): Promise<Account[]> {
    const getAccountsFunction = httpsCallable<void, Account[]>(functions, 'getAccounts');
    const result = await getAccountsFunction();
    return result.data;
  }

  static async createAccount(accountData: Omit<Account, 'id' | 'userId'>): Promise<Account> {
    const createAccountFunction = httpsCallable<Omit<Account, 'id' | 'userId'>, Account>(
      functions, 
      'createAccount'
    );
    const result = await createAccountFunction(accountData);
    return result.data;
  }

  // Transaction operations  
  static async getTransactions(filters?: {
    accountId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Transaction[]> {
    const getTransactionsFunction = httpsCallable<typeof filters, Transaction[]>(
      functions, 
      'getTransactions'
    );
    const result = await getTransactionsFunction(filters);
    return result.data;
  }

  static async createTransaction(transactionData: {
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    accountId: string;
  }): Promise<Transaction> {
    const createTransactionFunction = httpsCallable<typeof transactionData, Transaction>(
      functions, 
      'createTransaction'
    );
    const result = await createTransactionFunction(transactionData);
    return result.data;
  }

  // Investment operations
  static async getInvestments(): Promise<Investment[]> {
    const getInvestmentsFunction = httpsCallable<void, Investment[]>(
      functions, 
      'getInvestments'
    );
    const result = await getInvestmentsFunction();
    return result.data;
  }

  static async buyInvestment(investmentData: {
    symbol: string;
    shares: number;
    accountId: string;
  }): Promise<Investment> {
    const buyInvestmentFunction = httpsCallable<typeof investmentData, Investment>(
      functions, 
      'buyInvestment'
    );
    const result = await buyInvestmentFunction(investmentData);
    return result.data;
  }

  // Financial insights
  static async getDashboardOverview(): Promise<{
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    netWorth: number;
  }> {
    const getDashboardFunction = httpsCallable<void, {
      totalBalance: number;
      monthlyIncome: number;
      monthlyExpenses: number;
      netWorth: number;
    }>(functions, 'getDashboardOverview');
    const result = await getDashboardFunction();
    return result.data;
  }

  // User profile operations
  static async getUserProfile(): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    preferences: any;
  }> {
    const getUserProfileFunction = httpsCallable<void, {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      preferences: any;
    }>(functions, 'getUserProfile');
    const result = await getUserProfileFunction();
    return result.data;
  }

  static async updateUserPreferences(preferences: any): Promise<void> {
    const updatePreferencesFunction = httpsCallable(functions, 'updateUserPreferences');
    await updatePreferencesFunction(preferences);
  }
}

// Error handling wrapper
export const handleFirebaseError = (error: any): string => {
  if (error.code === 'functions/unauthenticated') {
    return 'Please sign in to access this feature';
  }
  if (error.code === 'functions/permission-denied') {
    return 'You do not have permission to perform this action';
  }
  if (error.code === 'functions/not-found') {
    return 'The requested resource was not found';
  }
  if (error.code === 'functions/unavailable') {
    return 'Service is temporarily unavailable. Please try again.';
  }
  
  return error.message || 'An unexpected error occurred';
};

// Export the secure API instance
export default FirebaseSecureApi;