const now = new Date();

const daysAgo = (n: number, time: string): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10) + time;
};

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  accountId: string;
}

export const transactions: Transaction[] = [
  {
    id: "tx-001",
    date: daysAgo(0, 'T10:23:00Z'),
    description: "Salary deposit",
    amount: 3500,
    type: "income",
    category: "Income",
    accountId: "acc-1"
  },
  {
    id: "tx-002",
    date: daysAgo(1, 'T15:45:00Z'),
    description: "Grocery shopping",
    amount: 125.75,
    type: "expense",
    category: "Food",
    accountId: "acc-1"
  },
  {
    id: "tx-003",
    date: daysAgo(2, 'T09:30:00Z'),
    description: "Coffee shop",
    amount: 8.50,
    type: "expense",
    category: "Dining",
    accountId: "acc-1"
  },
  {
    id: "tx-004",
    date: daysAgo(3, 'T14:22:00Z'),
    description: "Electricity bill",
    amount: 95.20,
    type: "expense",
    category: "Utilities",
    accountId: "acc-1"
  },
  {
    id: "tx-005",
    date: daysAgo(5, 'T09:00:00Z'),
    description: "Rent payment",
    amount: 1200,
    type: "expense",
    category: "Housing",
    accountId: "acc-1"
  },
  {
    id: "tx-006",
    date: daysAgo(7, 'T13:15:00Z'),
    description: "Investment withdrawal",
    amount: 500,
    type: "income",
    category: "Investments",
    accountId: "acc-1"
  },
  {
    id: "tx-007",
    date: daysAgo(10, 'T20:30:00Z'),
    description: "Online purchase",
    amount: 65.99,
    type: "expense",
    category: "Shopping",
    accountId: "acc-1"
  },
  {
    id: "tx-008",
    date: daysAgo(14, 'T10:00:00Z'),
    description: "Transfer to savings",
    amount: 500,
    type: "expense",
    category: "Savings",
    accountId: "acc-1"
  },
  {
    id: "tx-009",
    date: daysAgo(17, 'T16:45:00Z'),
    description: "Freelance payment",
    amount: 750,
    type: "income",
    category: "Income",
    accountId: "acc-1"
  },
  {
    id: "tx-010",
    date: daysAgo(20, 'T12:30:00Z'),
    description: "Phone bill",
    amount: 45.99,
    type: "expense",
    category: "Utilities",
    accountId: "acc-1"
  },
  {
    id: "tx-011",
    date: daysAgo(23, 'T19:15:00Z'),
    description: "Restaurant dinner",
    amount: 82.40,
    type: "expense",
    category: "Dining",
    accountId: "acc-1"
  },
  {
    id: "tx-012",
    date: daysAgo(25, 'T14:00:00Z'),
    description: "Gas station",
    amount: 45.50,
    type: "expense",
    category: "Transportation",
    accountId: "acc-1"
  },
  {
    id: "tx-013",
    date: daysAgo(30, 'T09:30:00Z'),
    description: "Salary deposit",
    amount: 3500,
    type: "income",
    category: "Income",
    accountId: "acc-1"
  },
  {
    id: "tx-014",
    date: daysAgo(31, 'T11:20:00Z'),
    description: "Gym membership",
    amount: 55.00,
    type: "expense",
    category: "Health",
    accountId: "acc-1"
  },
  {
    id: "tx-015",
    date: daysAgo(35, 'T16:40:00Z'),
    description: "Internet bill",
    amount: 75.00,
    type: "expense",
    category: "Utilities",
    accountId: "acc-1"
  }
];

// Transaction categories for charts
export interface CategoryExpense {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export const categoryExpenses: CategoryExpense[] = [
  { name: 'Housing', amount: 1200, percentage: 40, color: 'bg-chart-1' },
  { name: 'Food', amount: 450, percentage: 15, color: 'bg-chart-2' },
  { name: 'Utilities', amount: 300, percentage: 10, color: 'bg-chart-3' },
  { name: 'Shopping', amount: 270, percentage: 9, color: 'bg-chart-4' },
  { name: 'Transportation', amount: 180, percentage: 6, color: 'bg-chart-5' },
  { name: 'Health', amount: 150, percentage: 5, color: 'bg-teal-500' },
  { name: 'Entertainment', amount: 120, percentage: 4, color: 'bg-blue-500' },
  { name: 'Dining', amount: 180, percentage: 6, color: 'bg-pink-500' },
  { name: 'Other', amount: 150, percentage: 5, color: 'bg-gray-500' }
];

// Monthly expense data for bar charts
export interface MonthlyExpense {
  month: string;
  amount: number;
}

export const monthlyExpenses: MonthlyExpense[] = [
  { month: 'Jan', amount: 2800 },
  { month: 'Feb', amount: 2600 },
  { month: 'Mar', amount: 2750 },
  { month: 'Apr', amount: 3000 },
  { month: 'May', amount: 2900 },
  { month: 'Jun', amount: 2700 },
  { month: 'Jul', amount: 2800 },
  { month: 'Aug', amount: 3100 },
  { month: 'Sep', amount: 3000 },
  { month: 'Oct', amount: 2800 }
];
