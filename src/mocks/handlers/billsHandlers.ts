import { http, HttpResponse } from 'msw';

// Sample bills data
const upcomingBills = [
  {
    id: '1',
    name: 'Electricity Bill',
    amount: 85.20,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    isRecurring: true,
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Internet Service',
    amount: 65.00,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    isRecurring: true,
    status: 'upcoming'
  },
  {
    id: '3',
    name: 'Water Bill',
    amount: 42.75,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRecurring: true,
    status: 'overdue'
  },
  {
    id: '4',
    name: 'Phone Bill',
    amount: 55.00,
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    isRecurring: true,
    status: 'upcoming'
  },
  {
    id: '5',
    name: 'Credit Card Payment',
    amount: 150.00,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRecurring: false,
    status: 'paid'
  }
];

export const billsHandlers = [
  // Get upcoming bills
  http.get('/api/bills/upcoming', () => {
    console.log('Upcoming bills endpoint hit');
    return HttpResponse.json(upcomingBills, { status: 200 });
  }),

  // Get bill by ID
  http.get('/api/bills/:id', ({ params }) => {
    const { id } = params;
    const bill = upcomingBills.find(b => b.id === id);
    
    if (!bill) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(bill, { status: 200 });
  }),

  // Create new bill
  http.post('/api/bills', async ({ request }) => {
    try {
      const data = await request.json() as {
        name?: string;
        amount?: number;
        dueDate?: string;
        isRecurring?: boolean;
      };
      
      const newBill = {
        id: `bill-${Date.now()}`,
        name: data.name || 'New Bill',
        amount: data.amount || 0,
        dueDate: data.dueDate || new Date().toISOString(),
        isRecurring: data.isRecurring || false,
        status: 'upcoming'
      };
      
      upcomingBills.push(newBill);
      
      return HttpResponse.json(newBill, { status: 201 });
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid bill data' }),
        { status: 400 }
      );
    }
  }),

  // Update bill
  http.put('/api/bills/:id', async ({ params, request }) => {
    try {
      const { id } = params;
      const updates = await request.json() as {
        name?: string;
        amount?: number;
        dueDate?: string;
        isRecurring?: boolean;
        status?: 'upcoming' | 'overdue' | 'paid';
      };
      
      const billIndex = upcomingBills.findIndex(b => b.id === id);
      
      if (billIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }
      
      const updatedBill = {
        ...upcomingBills[billIndex],
        ...updates
      };
      
      upcomingBills[billIndex] = updatedBill;
      
      return HttpResponse.json(updatedBill, { status: 200 });
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ error: 'Invalid bill data' }),
        { status: 400 }
      );
    }
  }),

  // Delete bill
  http.delete('/api/bills/:id', ({ params }) => {
    const { id } = params;
    const billIndex = upcomingBills.findIndex(b => b.id === id);
    
    if (billIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    upcomingBills.splice(billIndex, 1);
    
    return HttpResponse.json({ success: true }, { status: 200 });
  })
]; 