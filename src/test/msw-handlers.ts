import { http, HttpResponse } from 'msw'

// Mock data for testing
export const mockApiData = {
  accounts: [
    { id: '1', name: 'Checking Account', balance: 2540.32, type: 'checking' as const },
    { id: '2', name: 'Savings Account', balance: 12750.89, type: 'savings' as const },
    { id: '3', name: 'Investment Account', balance: 8427.15, type: 'investment' as const }
  ],
  
  transactions: [
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
    },
    {
      id: '3',
      description: 'Gas Station',
      amount: 45.67,
      date: '2023-04-28T15:45:00Z',
      type: 'expense' as const,
      category: 'Transportation',
      accountId: '1'
    }
  ],

  transactionCategories: [
    { id: '1', name: 'Food', color: '#ff6b6b' },
    { id: '2', name: 'Transportation', color: '#4ecdc4' },
    { id: '3', name: 'Salary', color: '#45b7d1' },
    { id: '4', name: 'Entertainment', color: '#96ceb4' },
    { id: '5', name: 'Utilities', color: '#feca57' }
  ],

  monthlyTransactions: [
    { month: 'Jan', income: 2400, expenses: 1400 },
    { month: 'Feb', income: 2210, expenses: 1380 },
    { month: 'Mar', income: 2500, expenses: 1500 },
    { month: 'Apr', income: 2780, expenses: 1890 },
    { month: 'May', income: 2890, expenses: 1700 },
    { month: 'Jun', income: 3090, expenses: 1850 }
  ],

  savingsGoals: [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 3500,
      deadline: '2024-12-31',
      description: 'Building emergency savings for unexpected expenses'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 1200,
      deadline: '2024-08-15',
      description: 'Summer vacation to Europe'
    }
  ],

  investments: [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      currentPrice: 150.25,
      totalValue: 1502.50,
      gainLoss: 125.50,
      gainLossPercent: 9.11
    },
    {
      id: '2',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 5,
      currentPrice: 2750.80,
      totalValue: 13754.00,
      gainLoss: -245.60,
      gainLossPercent: -1.75
    }
  ],

  investmentAllocation: [
    { category: 'Technology', value: 8500, percentage: 65.2 },
    { category: 'Healthcare', value: 2800, percentage: 21.5 },
    { category: 'Finance', value: 1200, percentage: 9.2 },
    { category: 'Energy', value: 540, percentage: 4.1 }
  ],

  investmentPerformance: [
    { date: '2023-01-01', value: 10000 },
    { date: '2023-02-01', value: 10250 },
    { date: '2023-03-01', value: 9800 },
    { date: '2023-04-01', value: 11200 },
    { date: '2023-05-01', value: 12100 },
    { date: '2023-06-01', value: 13040 }
  ],

  upcomingBills: [
    {
      id: '1',
      name: 'Electricity Bill',
      amount: 85.20,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Utilities',
      isRecurring: true,
      status: 'upcoming' as const
    },
    {
      id: '2',
      name: 'Internet Service',
      amount: 65.00,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Utilities',
      isRecurring: true,
      status: 'upcoming' as const
    },
    {
      id: '3',
      name: 'Credit Card Payment',
      amount: 234.56,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Finance',
      isRecurring: true,
      status: 'upcoming' as const
    }
  ],

  dashboardOverview: {
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
  },

  spendingCategories: [
    { category: 'Food & Dining', amount: 450.25, percentage: 24.3, color: '#ff6b6b' },
    { category: 'Transportation', amount: 320.80, percentage: 17.3, color: '#4ecdc4' },
    { category: 'Entertainment', amount: 180.50, percentage: 9.8, color: '#96ceb4' },
    { category: 'Utilities', amount: 285.75, percentage: 15.4, color: '#feca57' },
    { category: 'Shopping', amount: 620.40, percentage: 33.5, color: '#6c5ce7' }
  ],

  financialInsights: [
    {
      id: '1',
      type: 'tip' as const,
      title: 'Reduce Dining Out',
      description: 'You spent 15% more on dining out this month compared to last month. Consider cooking at home more often.',
      icon: 'restaurant'
    },
    {
      id: '2',
      type: 'achievement' as const,
      title: 'Savings Goal Progress',
      description: 'Great job! You\'re 35% towards your emergency fund goal. Keep it up!',
      icon: 'target'
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Upcoming Bill Alert',
      description: 'You have 3 bills totaling $384.76 due within the next 7 days.',
      icon: 'alert-circle'
    }
  ]
}

// Default MSW handlers for successful responses
export const successHandlers = [
  // Accounts
  http.get('/api/accounts', () => {
    return HttpResponse.json(mockApiData.accounts)
  }),

  // Transactions
  http.get('/api/transactions', () => {
    return HttpResponse.json(mockApiData.transactions)
  }),

  http.get('/api/transactions/recent', () => {
    return HttpResponse.json(mockApiData.transactions.slice(0, 2))
  }),

  http.get('/api/transactions/categories', () => {
    return HttpResponse.json(mockApiData.transactionCategories)
  }),

  http.get('/api/transactions/monthly', () => {
    return HttpResponse.json(mockApiData.monthlyTransactions)
  }),

  // Savings
  http.get('/api/savings', () => {
    return HttpResponse.json(mockApiData.savingsGoals)
  }),

  http.get('/api/savings/:accountId/history', () => {
    return HttpResponse.json([
      { date: '2023-01-01', amount: 500 },
      { date: '2023-02-01', amount: 600 },
      { date: '2023-03-01', amount: 750 },
      { date: '2023-04-01', amount: 800 }
    ])
  }),

  http.post('/api/savings', async ({ request }) => {
    const body = await request.json() as any
    const newGoal = {
      id: Date.now().toString(),
      ...body
    }
    return HttpResponse.json(newGoal)
  }),

  // Investments
  http.get('/api/investments', () => {
    return HttpResponse.json(mockApiData.investments)
  }),

  http.get('/api/investments/allocation', () => {
    return HttpResponse.json(mockApiData.investmentAllocation)
  }),

  http.get('/api/investments/performance', () => {
    return HttpResponse.json(mockApiData.investmentPerformance)
  }),

  http.post('/api/investments/buy', async ({ request }) => {
    const body = await request.json() as any
    const newInvestment = {
      id: Date.now().toString(),
      symbol: body.symbol,
      name: `${body.symbol} Investment`,
      shares: body.shares,
      currentPrice: 150.00,
      totalValue: body.shares * 150.00,
      gainLoss: 0,
      gainLossPercent: 0
    }
    return HttpResponse.json(newInvestment)
  }),

  // Bills
  http.get('/api/bills/upcoming', () => {
    return HttpResponse.json(mockApiData.upcomingBills)
  }),

  // Dashboard
  http.get('/api/dashboard/overview', () => {
    return HttpResponse.json(mockApiData.dashboardOverview)
  }),

  // Analytics
  http.get('/api/analytics/spending-categories', () => {
    return HttpResponse.json(mockApiData.spendingCategories)
  }),

  http.get('/api/analytics/insights', () => {
    return HttpResponse.json(mockApiData.financialInsights)
  })
]

// Error handlers for testing error scenarios
export const errorHandlers = [
  http.get('/api/accounts', () => {
    return new HttpResponse(null, { status: 500 })
  }),

  http.get('/api/transactions', () => {
    return HttpResponse.error()
  }),

  http.get('/api/savings', () => {
    return new HttpResponse('Not Found', { status: 404 })
  })
]

// Network delay handlers for testing loading states
export const delayedHandlers = successHandlers.map(() => {
  return http.get('*', async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return HttpResponse.json({ message: 'Delayed response' })
  })
})

export default successHandlers