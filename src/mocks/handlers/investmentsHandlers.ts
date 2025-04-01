import { http, HttpResponse } from 'msw';
import { Investment } from '../data/investmentsData';

// Sample recommended investments
export const recommendedInvestments = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    price: 450.25,
    growth: '+15.3%'
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale Corp.',
    sector: 'Retail',
    price: 570.75,
    growth: '+8.2%'
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    price: 165.30,
    growth: '+3.5%'
  }
];

// Sample asset allocation data
export const assetAllocation = [
  { name: 'Stocks', value: 6500, percentage: 65, color: 'chart-1' },
  { name: 'Bonds', value: 2000, percentage: 20, color: 'chart-2' },
  { name: 'Cash', value: 1000, percentage: 10, color: 'chart-3' },
  { name: 'Real Estate', value: 500, percentage: 5, color: 'chart-4' }
];

// Sample investment history data
export const investmentHistory = {
  '1w': [
    { date: '2023-10-25', value: 14200 },
    { date: '2023-10-26', value: 14150 },
    { date: '2023-10-27', value: 14300 },
    { date: '2023-10-28', value: 14350 },
    { date: '2023-10-29', value: 14400 },
    { date: '2023-10-30', value: 14450 },
    { date: '2023-10-31', value: 14500 }
  ],
  '1m': [
    { date: '2023-10-01', value: 13900 },
    { date: '2023-10-08', value: 14000 },
    { date: '2023-10-15', value: 14200 },
    { date: '2023-10-22', value: 14300 },
    { date: '2023-10-31', value: 14500 }
  ],
  '3m': [
    { date: '2023-08-01', value: 13100 },
    { date: '2023-09-01', value: 13900 },
    { date: '2023-10-01', value: 14200 },
    { date: '2023-10-31', value: 14500 }
  ],
  '6m': [
    { date: '2023-05-01', value: 11200 },
    { date: '2023-06-01', value: 10800 },
    { date: '2023-07-01', value: 12400 },
    { date: '2023-08-01', value: 13100 },
    { date: '2023-09-01', value: 13900 },
    { date: '2023-10-01', value: 14200 },
    { date: '2023-10-31', value: 14500 }
  ]
};

// Portfolio performance data by timeframe
interface PerformanceData {
  date: string;
  value: number;
}

interface PortfolioPerformanceMap {
  [key: string]: PerformanceData[];
}

export const portfolioPerformance: PortfolioPerformanceMap = {
  '1w': [
    { date: '2023-10-25', value: 14200 },
    { date: '2023-10-26', value: 14150 },
    { date: '2023-10-27', value: 14300 },
    { date: '2023-10-28', value: 14350 },
    { date: '2023-10-29', value: 14400 },
    { date: '2023-10-30', value: 14450 },
    { date: '2023-10-31', value: 14500 }
  ],
  '1m': [
    { date: '2023-10-01', value: 13900 },
    { date: '2023-10-08', value: 14000 },
    { date: '2023-10-15', value: 14200 },
    { date: '2023-10-22', value: 14300 },
    { date: '2023-10-31', value: 14500 }
  ],
  '3m': [
    { date: '2023-08-01', value: 13100 },
    { date: '2023-09-01', value: 13900 },
    { date: '2023-10-01', value: 14200 },
    { date: '2023-10-31', value: 14500 }
  ],
  '6m': [
    { date: '2023-05-01', value: 11200 },
    { date: '2023-06-01', value: 10800 },
    { date: '2023-07-01', value: 12400 },
    { date: '2023-08-01', value: 13100 },
    { date: '2023-09-01', value: 13900 },
    { date: '2023-10-01', value: 14200 },
    { date: '2023-10-31', value: 14500 }
  ],
  '1y': [
    { date: '2022-11-01', value: 9000 },
    { date: '2023-01-01', value: 9500 },
    { date: '2023-03-01', value: 10800 },
    { date: '2023-05-01', value: 11200 },
    { date: '2023-07-01', value: 12400 },
    { date: '2023-09-01', value: 13900 },
    { date: '2023-10-31', value: 14500 }
  ],
  'all': [
    { date: '2022-01-01', value: 5000 },
    { date: '2022-04-01', value: 6500 },
    { date: '2022-07-01', value: 7800 },
    { date: '2022-10-01', value: 8500 },
    { date: '2023-01-01', value: 9500 },
    { date: '2023-04-01', value: 10000 },
    { date: '2023-07-01', value: 12400 },
    { date: '2023-10-31', value: 14500 }
  ]
};

// Generate portfolio performance data for last 3 years with realistic growth pattern
function generatePortfolioPerformanceData() {
  const data = [];
  const now = new Date();
  const startValue = 10000; // Starting with $10,000
  const annualGrowthRate = 0.085; // 8.5% annual growth on average
  
  // Generate daily data points for the past 3 years
  for (let i = 365 * 3; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Base growth calculation
    const years = i / 365;
    const daysFromStart = 365 * 3 - i;
    
    // Add some market volatility
    // More volatility for recent data (last month)
    let volatility = 0;
    if (i < 30) {
      volatility = (Math.random() * 0.06) - 0.03; // -3% to +3% daily volatility for recent data
    } else {
      volatility = (Math.random() * 0.02) - 0.01; // -1% to +1% for older data
    }
    
    // More dramatic market events every ~6 months
    if (daysFromStart % 180 < 10) {
      const eventMagnitude = (Math.random() * 0.16) - 0.08; // -8% to +8% market events
      volatility += eventMagnitude;
    }
    
    // Calculate day's value with compounding growth and volatility
    const smoothGrowthValue = startValue * Math.pow(1 + annualGrowthRate, 3 - years);
    const value = smoothGrowthValue * (1 + volatility);
    
    // Format to 2 decimal places
    const formattedValue = parseFloat(value.toFixed(2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: formattedValue
    });
  }
  
  // Ensure the data is sorted by date
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Pre-generate the performance data
const portfolioPerformanceData = generatePortfolioPerformanceData();

// Sample investments data
const investments: Investment[] = [
  { 
    id: '1', 
    name: 'Apple Inc.', 
    ticker: 'AAPL', 
    shares: 10, 
    buyPrice: 150.75, 
    currentPrice: 175.50, 
    category: 'Technology', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Microsoft Corporation', 
    ticker: 'MSFT', 
    shares: 5, 
    buyPrice: 290.20, 
    currentPrice: 315.75, 
    category: 'Technology', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Amazon.com Inc.', 
    ticker: 'AMZN', 
    shares: 3, 
    buyPrice: 135.50, 
    currentPrice: 142.80, 
    category: 'Consumer Cyclical', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '4', 
    name: 'Alphabet Inc.', 
    ticker: 'GOOGL', 
    shares: 4, 
    buyPrice: 125.30, 
    currentPrice: 138.20, 
    category: 'Communication Services', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '5', 
    name: 'Tesla, Inc.', 
    ticker: 'TSLA', 
    shares: 8, 
    buyPrice: 200.10, 
    currentPrice: 185.40, 
    category: 'Automotive', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '6', 
    name: 'Meta Platforms Inc.', 
    ticker: 'META', 
    shares: 6, 
    buyPrice: 330.25, 
    currentPrice: 385.70, 
    category: 'Technology', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '7', 
    name: 'Visa Inc.', 
    ticker: 'V', 
    shares: 12, 
    buyPrice: 220.50, 
    currentPrice: 235.80, 
    category: 'Financial Services', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '8', 
    name: 'Johnson & Johnson', 
    ticker: 'JNJ', 
    shares: 7, 
    buyPrice: 160.30, 
    currentPrice: 155.90, 
    category: 'Healthcare', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '9', 
    name: 'Walmart Inc.', 
    ticker: 'WMT', 
    shares: 15, 
    buyPrice: 140.20, 
    currentPrice: 151.40, 
    category: 'Consumer Defensive', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '10', 
    name: 'Procter & Gamble', 
    ticker: 'PG', 
    shares: 9, 
    buyPrice: 145.60, 
    currentPrice: 152.30, 
    category: 'Consumer Defensive', 
    lastUpdated: new Date().toISOString() 
  },
];

export const investmentsHandlers = [
  // Get asset allocation
  http.get('/api/investments/asset-allocation', () => {
    console.log('Asset allocation endpoint hit', assetAllocation);
    return HttpResponse.json(assetAllocation, { status: 200 });
  }),
  
  // Get all investments
  http.get('/api/investments', () => {
    return HttpResponse.json(investments, { status: 200 });
  }),
  
  // Get specific investment
  http.get('/api/investments/:id', ({ params }) => {
    const { id } = params;
    const investment = investments.find(inv => inv.id === id);
    
    if (!investment) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(investment, { status: 200 });
  }),
  
  // Get investment history data by timeframe
  http.get('/api/investments/history/:timeframe', ({ params }) => {
    const { timeframe } = params;
    const timeframeData = timeframe && investmentHistory[timeframe as keyof typeof investmentHistory];
    
    if (!timeframeData) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(timeframeData, { status: 200 });
  }),
  
  // Buy investment
  http.post('/api/investments/buy', async ({ request }) => {
    const { ticker, shares, price } = await request.json() as { 
      ticker: string;
      shares: number;
      price: number;
    };
    
    // Find if we already have this investment
    const existingInvestment = investments.find(inv => inv.ticker === ticker);
    
    if (existingInvestment) {
      // In a real API we would update the investment in the database
      const updatedInvestment = {
        ...existingInvestment,
        shares: existingInvestment.shares + shares,
        lastUpdated: new Date().toISOString()
      };
      
      return HttpResponse.json(updatedInvestment, { status: 200 });
    } else {
      // Create new investment entry
      const newInvestment = {
        id: `inv-${Date.now()}`,
        name: `New Investment: ${ticker}`,
        ticker,
        shares,
        buyPrice: price,
        currentPrice: price,
        category: 'Stocks',
        lastUpdated: new Date().toISOString()
      };
      
      return HttpResponse.json(newInvestment, { status: 201 });
    }
  }),
  
  // Sell investment
  http.post('/api/investments/sell', async ({ request }) => {
    const { id, shares } = await request.json() as {
      id: string;
      shares: number;
    };
    
    const investment = investments.find(inv => inv.id === id);
    
    if (!investment) {
      return HttpResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }
    
    if (investment.shares < shares) {
      return HttpResponse.json(
        { error: 'Insufficient shares' },
        { status: 400 }
      );
    }
    
    // In a real API we would update or delete the investment in the database
    if (investment.shares === shares) {
      // Completely sold, would remove from database
      return HttpResponse.json({ 
        success: true, 
        message: 'Investment fully sold' 
      }, { status: 200 });
    } else {
      // Partially sold
      const updatedInvestment = {
        ...investment,
        shares: investment.shares - shares,
        lastUpdated: new Date().toISOString()
      };
      
      return HttpResponse.json(updatedInvestment, { status: 200 });
    }
  }),
  
  // Get recommended investments
  http.get('/api/investments/recommendations', () => {
    return HttpResponse.json(recommendedInvestments, { status: 200 });
  }),

  // Get portfolio performance data
  http.get('/api/investments/performance', () => {
    console.log('Fetching portfolio performance data');
    return HttpResponse.json(portfolioPerformanceData);
  }),

  // Get asset allocation data
  http.get('/api/investments/allocation', () => {
    console.log('Fetching asset allocation data');
    return HttpResponse.json(assetAllocation);
  }),

  // Buy new investment
  http.post('/api/investments/buy', async ({ request }) => {
    const data = await request.json() as {
      symbol: string;
      name?: string;
      shares: number;
      price: number;
      category?: string;
    };
    console.log('Buying new investment:', data);
    
    // Create a new investment with the provided data
    const newInvestment: Investment = {
      id: (investments.length + 1).toString(),
      name: data.name || `${data.symbol.toUpperCase()} Stock`,
      ticker: data.symbol.toUpperCase(),
      shares: Number(data.shares),
      buyPrice: Number(data.price),
      currentPrice: Number(data.price), // Initially the same as purchase price
      category: data.category || 'Uncategorized',
      lastUpdated: new Date().toISOString()
    };
    
    // Add to our investments array (in a real app, this would be a database operation)
    investments.push(newInvestment);
    
    return HttpResponse.json(newInvestment, { status: 201 });
  }),

  // Get stock info by symbol
  http.get('/api/stocks/:symbol', ({ params }) => {
    const { symbol } = params;
    console.log(`Fetching stock info for ${symbol}`);
    
    // Mock stock info lookup
    const stockInfo = {
      symbol: symbol,
      name: `${symbol} Corporation`,
      price: (Math.random() * 500 + 50).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      percentChange: (Math.random() * 5 - 2.5).toFixed(2)
    };
    
    return HttpResponse.json(stockInfo);
  })
]; 