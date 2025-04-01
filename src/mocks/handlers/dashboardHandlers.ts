import { http, HttpResponse } from 'msw';

// Sample dashboard overview data
const overviewData = [
  {
    name: 'Jan',
    income: 2400,
    expenses: 1400,
    savings: 1000
  },
  {
    name: 'Feb',
    income: 2210,
    expenses: 1380,
    savings: 830
  },
  {
    name: 'Mar',
    income: 2500,
    expenses: 1500,
    savings: 1000
  },
  {
    name: 'Apr',
    income: 2780,
    expenses: 1890,
    savings: 890
  },
  {
    name: 'May',
    income: 2890,
    expenses: 1700,
    savings: 1190
  },
  {
    name: 'Jun',
    income: 3090,
    expenses: 1850,
    savings: 1240
  },
  {
    name: 'Jul',
    income: 3490,
    expenses: 2100,
    savings: 1390
  },
];

// Sample analytics data
const spendingCategories = [
  { name: 'Food & Dining', value: 650, change: 5.2 },
  { name: 'Transportation', value: 420, change: -3.8 },
  { name: 'Entertainment', value: 280, change: 12.5 },
  { name: 'Shopping', value: 350, change: -8.1 },
  { name: 'Utilities', value: 220, change: 0.5 },
];

const insights = [
  {
    title: 'Spending Reduction',
    description: 'Your shopping expenses decreased by 8.1% compared to last month.',
    type: 'positive'
  },
  {
    title: 'Unusual Activity',
    description: 'Entertainment spending is up 12.5% this month.',
    type: 'neutral'
  },
  {
    title: 'Budget Alert',
    description: "You've spent 85% of your food budget, and it's only halfway through the month.",
    type: 'negative'
  }
];

export const dashboardHandlers = [
  // Get dashboard overview data
  http.get('/api/dashboard/overview', () => {
    console.log('Dashboard overview endpoint hit');
    return HttpResponse.json(overviewData, { status: 200 });
  }),

  // Get spending categories
  http.get('/api/analytics/spending-categories', () => {
    console.log('Spending categories endpoint hit');
    return HttpResponse.json(spendingCategories, { status: 200 });
  }),

  // Get insights
  http.get('/api/analytics/insights', () => {
    console.log('Insights endpoint hit');
    return HttpResponse.json(insights, { status: 200 });
  })
]; 