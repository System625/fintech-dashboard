export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  dateFormat: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  transactions: boolean;
  marketing: boolean;
}

export const userProfile: UserProfile = {
  id: "usr-1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1 (555) 123-4567",
  createdAt: "2023-01-01T00:00:00Z",
  preferences: {
    currency: "USD",
    language: "English",
    dateFormat: "MM/DD/YYYY",
    notifications: {
      email: true,
      transactions: true,
      marketing: false
    }
  }
};

// Account summary data
export interface AccountSummary {
  totalBalance: number;
  savingsTotal: number;
  investmentsTotal: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  netWorth: number;
}

export const accountSummary: AccountSummary = {
  totalBalance: 24540,
  savingsTotal: 12350,
  investmentsTotal: 8120,
  monthlyExpenses: 4070,
  monthlyIncome: 5200,
  netWorth: 37500
};

// Payment methods
export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "VISA",
    name: "Personal Visa",
    lastFour: "4242",
    expiryDate: "04/2025",
    isDefault: true
  },
  {
    id: "pm-2",
    type: "MASTERCARD",
    name: "Business Mastercard",
    lastFour: "8888",
    expiryDate: "09/2024",
    isDefault: false
  }
]; 