const now = new Date();

const daysAgo = (n: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const hoursAgoToday = (h: number): string => {
  const d = new Date(now);
  d.setHours(d.getHours() - h, 0, 0, 0);
  return d.toISOString();
};

const monthsAgoLabel = (n: number): string => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const nowIso = now.toISOString();

export interface Investment {
  id: string;
  name: string;
  ticker: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  category: string;
  lastUpdated: string;
}

export const investments: Investment[] = [
  {
    id: "inv-1",
    name: "Apple Inc.",
    ticker: "AAPL",
    shares: 10,
    buyPrice: 150.25,
    currentPrice: 172.5,
    category: "Stocks",
    lastUpdated: nowIso
  },
  {
    id: "inv-2",
    name: "Microsoft Corp",
    ticker: "MSFT",
    shares: 5,
    buyPrice: 280.45,
    currentPrice: 312.8,
    category: "Stocks",
    lastUpdated: nowIso
  },
  {
    id: "inv-3",
    name: "Amazon.com Inc",
    ticker: "AMZN",
    shares: 8,
    buyPrice: 153.10,
    currentPrice: 145.2,
    category: "Stocks",
    lastUpdated: nowIso
  },
  {
    id: "inv-4",
    name: "NVIDIA Corp",
    ticker: "NVDA",
    shares: 3,
    buyPrice: 207.42,
    currentPrice: 425.6,
    category: "Stocks",
    lastUpdated: nowIso
  },
  {
    id: "inv-5",
    name: "Alphabet Inc",
    ticker: "GOOG",
    shares: 7,
    buyPrice: 131.40,
    currentPrice: 142.3,
    category: "Stocks",
    lastUpdated: nowIso
  }
];

// Mock data for investment performance history (for charts)
export interface InvestmentHistoryEntry {
  date: string;
  value: number;
}

export const investmentHistory: Record<string, InvestmentHistoryEntry[]> = {
  "1D": [
    { date: hoursAgoToday(7), value: 5700 },
    { date: hoursAgoToday(6), value: 5690 },
    { date: hoursAgoToday(5), value: 5720 },
    { date: hoursAgoToday(4), value: 5740 },
    { date: hoursAgoToday(3), value: 5760 },
    { date: hoursAgoToday(2), value: 5750 },
    { date: hoursAgoToday(1), value: 5790 },
    { date: nowIso,           value: 5820 }
  ],
  "1W": [
    { date: daysAgo(6), value: 5600 },
    { date: daysAgo(5), value: 5650 },
    { date: daysAgo(4), value: 5630 },
    { date: daysAgo(3), value: 5660 },
    { date: daysAgo(2), value: 5700 },
    { date: daysAgo(0), value: 5820 }
  ],
  "1M": [
    { date: daysAgo(28), value: 5400 },
    { date: daysAgo(21), value: 5450 },
    { date: daysAgo(14), value: 5520 },
    { date: daysAgo(7),  value: 5600 },
    { date: daysAgo(0),  value: 5820 }
  ],
  "1Y": [
    { date: monthsAgoLabel(12), value: 4800 },
    { date: monthsAgoLabel(11), value: 4900 },
    { date: monthsAgoLabel(10), value: 4850 },
    { date: monthsAgoLabel(9),  value: 5000 },
    { date: monthsAgoLabel(8),  value: 5100 },
    { date: monthsAgoLabel(7),  value: 5050 },
    { date: monthsAgoLabel(6),  value: 5200 },
    { date: monthsAgoLabel(5),  value: 5300 },
    { date: monthsAgoLabel(4),  value: 5350 },
    { date: monthsAgoLabel(3),  value: 5450 },
    { date: monthsAgoLabel(2),  value: 5550 },
    { date: monthsAgoLabel(1),  value: 5700 },
    { date: monthsAgoLabel(0),  value: 5820 }
  ],
  "All": [
    { date: monthsAgoLabel(30), value: 3200 },
    { date: monthsAgoLabel(27), value: 3500 },
    { date: monthsAgoLabel(24), value: 3800 },
    { date: monthsAgoLabel(21), value: 4200 },
    { date: monthsAgoLabel(18), value: 4800 },
    { date: monthsAgoLabel(15), value: 5000 },
    { date: monthsAgoLabel(12), value: 5200 },
    { date: monthsAgoLabel(9),  value: 5450 },
    { date: monthsAgoLabel(0),  value: 5820 }
  ]
};

// Asset allocation data
export interface AssetAllocation {
  name: string;
  percentage: number;
  value: number;
  color: string;
}

export const assetAllocation: AssetAllocation[] = [
  { name: 'Stocks', percentage: 45, value: 2619, color: 'bg-chart-1' },
  { name: 'Bonds', percentage: 25, value: 1455, color: 'bg-chart-2' },
  { name: 'Real Estate', percentage: 15, value: 873, color: 'bg-chart-3' },
  { name: 'Crypto', percentage: 10, value: 582, color: 'bg-chart-4' },
  { name: 'Cash', percentage: 5, value: 291, color: 'bg-chart-5' }
];

// Recommended investments
export interface RecommendedInvestment {
  id: string;
  name: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
  potentialReturn: string;
}

export const recommendedInvestments: RecommendedInvestment[] = [
  {
    id: "rec-1",
    name: "Tech Growth ETF",
    description: "High-growth technology sector fund",
    risk: "High",
    potentialReturn: "15-20%"
  },
  {
    id: "rec-2",
    name: "Sustainable Energy Fund",
    description: "Renewable energy companies",
    risk: "Medium",
    potentialReturn: "10-15%"
  },
  {
    id: "rec-3",
    name: "Dividend Aristocrats",
    description: "Companies with consistent dividend growth",
    risk: "Low",
    potentialReturn: "5-8%"
  }
];
