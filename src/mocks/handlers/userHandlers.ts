import { http, HttpResponse } from 'msw';
import { userProfile, accountSummary, paymentMethods } from '../data';

export const userHandlers = [
  // Get user profile
  http.get('/api/user/profile', () => {
    return HttpResponse.json(userProfile, { status: 200 });
  }),
  
  // Update user profile
  http.put('/api/user/profile', async ({ request }) => {
    const updatedProfile = await request.json() as Record<string, unknown>;
    // In a real API we would persist this data
    return HttpResponse.json({ ...userProfile, ...updatedProfile }, { status: 200 });
  }),
  
  // Get account summary
  http.get('/api/user/account-summary', () => {
    return HttpResponse.json(accountSummary, { status: 200 });
  }),
  
  // Get payment methods
  http.get('/api/user/payment-methods', () => {
    return HttpResponse.json(paymentMethods, { status: 200 });
  }),
  
  // Add payment method
  http.post('/api/user/payment-methods', async ({ request }) => {
    const newPaymentMethod = await request.json() as Record<string, unknown>;
    // In a real API we would generate an ID and persist this data
    const paymentMethod = {
      id: `pm-${Date.now()}`,
      isDefault: false,
      ...newPaymentMethod
    };
    return HttpResponse.json(paymentMethod, { status: 201 });
  }),
  
  // Update payment method
  http.put('/api/user/payment-methods/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Record<string, unknown>;
    
    // Find the payment method
    const paymentMethod = paymentMethods.find(pm => pm.id === id);
    
    if (!paymentMethod) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would update the payment method in the database
    return HttpResponse.json({ ...paymentMethod, ...updates }, { status: 200 });
  }),
  
  // Set default payment method
  http.post('/api/user/payment-methods/:id/set-default', ({ params }) => {
    const { id } = params;
    
    // Find the payment method
    const paymentMethod = paymentMethods.find(pm => pm.id === id);
    
    if (!paymentMethod) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would update all payment methods in the database
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
  
  // Delete payment method
  http.delete('/api/user/payment-methods/:id', ({ params }) => {
    const { id } = params;
    
    // Find the payment method
    const paymentMethod = paymentMethods.find(pm => pm.id === id);
    
    if (!paymentMethod) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // In a real API we would delete the payment method from the database
    return HttpResponse.json({ success: true }, { status: 200 });
  })
]; 