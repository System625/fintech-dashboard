export interface SavingsAccount {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  interestRate: number;
  createdAt: string;
  lastUpdated: string;
}

export const savingsAccounts: SavingsAccount[] = [
  {
    id: "sav-1",
    name: "Emergency Fund",
    currentAmount: 5000,
    targetAmount: 10000,
    interestRate: 2.5,
    createdAt: "2023-01-15T00:00:00Z",
    lastUpdated: "2023-10-01T00:00:00Z"
  },
  {
    id: "sav-2",
    name: "Vacation",
    currentAmount: 2500,
    targetAmount: 4000,
    interestRate: 1.8,
    createdAt: "2023-03-10T00:00:00Z",
    lastUpdated: "2023-09-15T00:00:00Z"
  },
  {
    id: "sav-3",
    name: "New Car",
    currentAmount: 3500,
    targetAmount: 8000,
    interestRate: 2.1,
    createdAt: "2022-11-20T00:00:00Z",
    lastUpdated: "2023-09-28T00:00:00Z"
  }
];

// Mock data for savings growth history (for charts)
export interface SavingsHistoryEntry {
  date: string;
  amount: number;
}

export const savingsHistory: Record<string, SavingsHistoryEntry[]> = {
  "sav-1": [
    { date: "2023-04-01", amount: 2000 },
    { date: "2023-05-01", amount: 2500 },
    { date: "2023-06-01", amount: 3000 },
    { date: "2023-07-01", amount: 3500 },
    { date: "2023-08-01", amount: 4000 },
    { date: "2023-09-01", amount: 4500 },
    { date: "2023-10-01", amount: 5000 }
  ],
  "sav-2": [
    { date: "2023-04-01", amount: 1000 },
    { date: "2023-05-01", amount: 1400 },
    { date: "2023-06-01", amount: 1600 },
    { date: "2023-07-01", amount: 1900 },
    { date: "2023-08-01", amount: 2200 },
    { date: "2023-09-01", amount: 2500 }
  ],
  "sav-3": [
    { date: "2023-01-01", amount: 500 },
    { date: "2023-02-01", amount: 1000 },
    { date: "2023-03-01", amount: 1500 },
    { date: "2023-04-01", amount: 2000 },
    { date: "2023-05-01", amount: 2300 },
    { date: "2023-06-01", amount: 2600 },
    { date: "2023-07-01", amount: 2900 },
    { date: "2023-08-01", amount: 3200 },
    { date: "2023-09-01", amount: 3500 }
  ]
}; 