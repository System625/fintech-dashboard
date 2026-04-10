const now = new Date();

const monthsAgo = (n: number): string => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  return d.toISOString().slice(0, 10) + 'T00:00:00Z';
};

const daysAgo = (n: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10) + 'T00:00:00Z';
};

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
    createdAt: monthsAgo(15),
    lastUpdated: daysAgo(1)
  },
  {
    id: "sav-2",
    name: "Vacation",
    currentAmount: 2500,
    targetAmount: 4000,
    interestRate: 1.8,
    createdAt: monthsAgo(13),
    lastUpdated: daysAgo(14)
  },
  {
    id: "sav-3",
    name: "New Car",
    currentAmount: 3500,
    targetAmount: 8000,
    interestRate: 2.1,
    createdAt: monthsAgo(17),
    lastUpdated: daysAgo(5)
  }
];

// Mock data for savings growth history (for charts)
export interface SavingsHistoryEntry {
  date: string;
  amount: number;
}

export const savingsHistory: Record<string, SavingsHistoryEntry[]> = {
  "sav-1": [
    { date: monthsAgo(6), amount: 2000 },
    { date: monthsAgo(5), amount: 2500 },
    { date: monthsAgo(4), amount: 3000 },
    { date: monthsAgo(3), amount: 3500 },
    { date: monthsAgo(2), amount: 4000 },
    { date: monthsAgo(1), amount: 4500 },
    { date: daysAgo(1),   amount: 5000 }
  ],
  "sav-2": [
    { date: monthsAgo(5), amount: 1000 },
    { date: monthsAgo(4), amount: 1400 },
    { date: monthsAgo(3), amount: 1600 },
    { date: monthsAgo(2), amount: 1900 },
    { date: monthsAgo(1), amount: 2200 },
    { date: daysAgo(1),   amount: 2500 }
  ],
  "sav-3": [
    { date: monthsAgo(8), amount: 500 },
    { date: monthsAgo(7), amount: 1000 },
    { date: monthsAgo(6), amount: 1500 },
    { date: monthsAgo(5), amount: 2000 },
    { date: monthsAgo(4), amount: 2300 },
    { date: monthsAgo(3), amount: 2600 },
    { date: monthsAgo(2), amount: 2900 },
    { date: monthsAgo(1), amount: 3200 },
    { date: daysAgo(1),   amount: 3500 }
  ]
};
