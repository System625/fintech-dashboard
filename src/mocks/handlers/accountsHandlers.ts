import { http, HttpResponse } from 'msw';

// Sample accounts data
const accounts = [
  { id: '1', name: 'Checking Account', balance: 2540.32, type: 'checking' },
  { id: '2', name: 'Savings Account', balance: 12750.89, type: 'savings' },
  { id: '3', name: 'Investment Account', balance: 8427.15, type: 'investment' }
];

interface AccountData {
  name?: string;
  balance?: number;
  type?: string;
}

interface BalanceUpdate {
  amount: number;
}

export const accountsHandlers = [
  // Get all accounts
  http.get('/api/accounts', () => {
    console.log('Accounts endpoint hit');
    return HttpResponse.json(accounts, { status: 200 });
  }),

  // Get account by ID
  http.get('/api/accounts/:id', ({ params }) => {
    const { id } = params;
    const account = accounts.find(acc => acc.id === id);
    
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(account, { status: 200 });
  }),

  // Create new account
  http.post('/api/accounts', async ({ request }) => {
    try {
      const data = await request.json() as AccountData;
      
      const newAccount = {
        id: String(accounts.length + 1),
        name: data.name || 'New Account',
        balance: data.balance || 0,
        type: data.type || 'checking'
      };
      
      accounts.push(newAccount);
      
      return HttpResponse.json(newAccount, { status: 201 });
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid account data' }),
        { status: 400 }
      );
    }
  }),

  // Update account balance (for transfers, deposits, withdrawals)
  http.patch('/api/accounts/:id/balance', async ({ params, request }) => {
    try {
      const { id } = params;
      const data = await request.json() as BalanceUpdate;
      
      const account = accounts.find(acc => acc.id === id);
      
      if (!account) {
        return new HttpResponse(null, { status: 404 });
      }
      
      if (typeof data.amount !== 'number') {
        return new HttpResponse(
          JSON.stringify({ error: 'Amount must be a number' }),
          { status: 400 }
        );
      }
      
      account.balance = data.amount;
      
      return HttpResponse.json(account, { status: 200 });
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid balance update data' }),
        { status: 400 }
      );
    }
  })
]; 