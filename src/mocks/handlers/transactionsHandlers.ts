import { http, HttpResponse } from 'msw';
import { 
  transactions, 
  categoryExpenses, 
  monthlyExpenses,
  Transaction 
} from '../data/transactionsData';

export const transactionsHandlers = [
  // Get category expenses for charts
  http.get('/api/transactions/categories', () => {
    console.log('Categories endpoint hit', categoryExpenses);
    return HttpResponse.json(categoryExpenses, { status: 200 });
  }),
  
  // Get monthly expenses for charts
  http.get('/api/transactions/monthly', () => {
    console.log('Monthly expenses endpoint hit', monthlyExpenses);
    return HttpResponse.json(monthlyExpenses, { status: 200 });
  }),
  
  // Get recent transactions (for dashboard)
  http.get('/api/transactions/recent', () => {
    console.log('Recent transactions endpoint hit');
    
    // Sort by date, most recent first
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Return only the 5 most recent
    const recentTransactions = sortedTransactions.slice(0, 5);
    
    return HttpResponse.json(recentTransactions, { status: 200 });
  }),
  
  // Get all transactions
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url);
    // Handle pagination
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Handle filters
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    
    let filteredTransactions = [...transactions];
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === category);
    }
    
    // Sort by date, most recent first
    filteredTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const paginatedData = filteredTransactions.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      transactions: paginatedData,
      totalCount: filteredTransactions.length,
      page,
      totalPages: Math.ceil(filteredTransactions.length / limit)
    }, { status: 200 });
  }),
  
  // Get specific transaction
  http.get('/api/transactions/:id', ({ params }) => {
    const { id } = params;
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(transaction, { status: 200 });
  }),
  
  // Create new transaction
  http.post('/api/transactions', async ({ request }) => {
    const newTransaction = await request.json() as Partial<Transaction>;
    
    // In a real API we would generate an ID and persist this data
    const transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      ...newTransaction
    };
    
    return HttpResponse.json(transaction, { status: 201 });
  }),
  
  // Update transaction
  http.put('/api/transactions/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Transaction>;
    
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would update the transaction in the database
    const updatedTransaction = { ...transaction, ...updates };
    
    return HttpResponse.json(updatedTransaction, { status: 200 });
  }),
  
  // Delete transaction
  http.delete('/api/transactions/:id', ({ params }) => {
    const { id } = params;
    
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would delete the transaction from the database
    return HttpResponse.json({ success: true }, { status: 200 });
  })
]; 