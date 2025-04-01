import { http, HttpResponse } from 'msw';
import { savingsAccounts, savingsHistory, SavingsAccount } from '../data';

// Sample savings goals
export const savingsGoals = [
  {
    id: 'sav-1',
    title: 'Emergency Fund',
    description: 'For unexpected expenses',
    currentAmount: 5000,
    targetAmount: 10000,
    targetDate: '2023-12-31',
  },
  {
    id: 'sav-2',
    title: 'Vacation',
    description: 'Summer trip to Europe',
    currentAmount: 2500,
    targetAmount: 5000,
    targetDate: '2023-06-30',
  },
  {
    id: 'sav-3',
    title: 'New Car',
    description: 'Down payment for a new car',
    currentAmount: 8000,
    targetAmount: 20000,
    targetDate: '2024-03-15',
  },
];

// Sample savings history data
export const savingsHistoryData = [
  { date: '2023-04-01', amount: 2000 },
  { date: '2023-05-01', amount: 2500 },
  { date: '2023-06-01', amount: 3000 },
  { date: '2023-07-01', amount: 3500 },
  { date: '2023-08-01', amount: 4000 },
  { date: '2023-09-01', amount: 4500 },
  { date: '2023-10-01', amount: 5000 }
];

export const savingsHandlers = [
  // Get all savings accounts
  http.get('/api/savings', () => {
    return HttpResponse.json(savingsAccounts, { status: 200 });
  }),
  
  // Get specific savings account
  http.get('/api/savings/:id', ({ params }) => {
    const { id } = params;
    const account = savingsAccounts.find(acc => acc.id === id);
    
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(account, { status: 200 });
  }),
  
  // Create new savings account
  http.post('/api/savings', async ({ request }) => {
    const newAccount = await request.json() as Partial<SavingsAccount>;
    // In a real API we would generate an ID and persist this data
    const account = {
      id: `savings-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      currentAmount: 0,
      ...newAccount
    };
    
    return HttpResponse.json(account, { status: 201 });
  }),
  
  // Update savings account
  http.put('/api/savings/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<SavingsAccount>;
    
    const account = savingsAccounts.find(acc => acc.id === id);
    
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would update the account in the database
    const updatedAccount = { 
      ...account, 
      ...updates, 
      lastUpdated: new Date().toISOString() 
    };
    
    return HttpResponse.json(updatedAccount, { status: 200 });
  }),
  
  // Delete savings account
  http.delete('/api/savings/:id', ({ params }) => {
    const { id } = params;
    
    const account = savingsAccounts.find(acc => acc.id === id);
    
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would delete the account from the database
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  
  // Get savings account history
  http.get('/api/savings/:id/history', ({ params }) => {
    const { id } = params;
    
    const accountHistory = id && savingsHistory[id as keyof typeof savingsHistory];
    
    if (!accountHistory) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(accountHistory, { status: 200 });
  }),
  
  // Add money to savings account
  http.post('/api/savings/:id/deposit', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json() as { amount: number };
    const { amount } = data;
    
    const account = savingsAccounts.find(acc => acc.id === id);
    
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would update the account in the database
    const updatedAccount = {
      ...account,
      currentAmount: account.currentAmount + amount,
      lastUpdated: new Date().toISOString()
    };
    
    return HttpResponse.json(updatedAccount, { status: 200 });
  }),
  
  // Withdraw money from savings account
  http.post('/api/savings/:id/withdraw', async ({ params, request }) => {
    const { id } = params;
    const data = await request.json() as { amount: number };
    const { amount } = data;
    
    const account = savingsAccounts.find(acc => acc.id === id);
    
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    
    if (account.currentAmount < amount) {
      return HttpResponse.json(
        { error: 'Insufficient funds' },
        { status: 400 }
      );
    }
    
    // In a real API we would update the account in the database
    const updatedAccount = {
      ...account,
      currentAmount: account.currentAmount - amount,
      lastUpdated: new Date().toISOString()
    };
    
    return HttpResponse.json(updatedAccount, { status: 200 });
  }),
  
  // Get all savings goals
  http.get('/api/savings', () => {
    return HttpResponse.json(savingsGoals);
  }),

  // Get a specific savings goal
  http.get('/api/savings/:id', ({ params }) => {
    const { id } = params;
    const goal = savingsGoals.find(g => g.id === id);
    
    if (!goal) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(goal);
  }),

  // Get savings history for a specific account
  http.get('/api/savings/:id/history', ({ params }) => {
    console.log('Savings history endpoint hit for account:', params.id);
    return HttpResponse.json(savingsHistoryData);
  }),

  // Create a new savings goal
  http.post('/api/savings', async ({ request }) => {
    try {
      const data = await request.json() as {
        name?: string;
        description?: string;
        currentAmount?: number;
        targetAmount?: number;
        targetDate?: string;
        interestRate?: number;
      };
      
      // Generate a new ID for the savings goal
      const newGoalId = `sav-${Date.now()}`;
      
      // Create new goal object with default values for any missing fields
      const newGoal = {
        id: newGoalId,
        title: data.name || 'New Goal',
        description: data.description || '',
        currentAmount: data.currentAmount || 0,
        targetAmount: data.targetAmount || 1000,
        targetDate: data.targetDate || new Date().toISOString(),
        interestRate: data.interestRate || 1.5,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // In a real API, we would save this to a database
      console.log('Created new savings goal:', newGoal);
      
      // Add to our sample data in memory (this won't persist between server restarts)
      savingsGoals.push(newGoal);
      
      return HttpResponse.json(newGoal, { status: 201 });
    } catch (error) {
      console.error('Error creating savings goal:', error);
      return new HttpResponse(null, { status: 500 });
    }
  }),
]; 