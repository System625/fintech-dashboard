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
    lastUpdated: "2023-10-02T12:30:00Z"
  },
  {
    id: "inv-2",
    name: "Microsoft Corp",
    ticker: "MSFT",
    shares: 5,
    buyPrice: 280.45,
    currentPrice: 312.8,
    category: "Stocks",
    lastUpdated: "2023-10-02T12:30:00Z"
  },
  {
    id: "inv-3",
    name: "Amazon.com Inc",
    ticker: "AMZN",
    shares: 8,
    buyPrice: 153.10,
    currentPrice: 145.2,
    category: "Stocks",
    lastUpdated: "2023-10-02T12:30:00Z"
  },
  {
    id: "inv-4",
    name: "NVIDIA Corp",
    ticker: "NVDA",
    shares: 3,
    buyPrice: 207.42,
    currentPrice: 425.6,
    category: "Stocks",
    lastUpdated: "2023-10-02T12:30:00Z"
  },
  {
    id: "inv-5",
    name: "Alphabet Inc",
    ticker: "GOOG",
    shares: 7,
    buyPrice: 131.40,
    currentPrice: 142.3,
    category: "Stocks",
    lastUpdated: "2023-10-02T12:30:00Z"
  }
];

// Mock data for investment performance history (for charts)
export interface InvestmentHistoryEntry {
  date: string;
  value: number;
}

export const investmentHistory: Record<string, InvestmentHistoryEntry[]> = {
  "1D": [
    { date: "2023-10-02T09:30:00Z", value: 5700 },
    { date: "2023-10-02T10:30:00Z", value: 5690 },
    { date: "2023-10-02T11:30:00Z", value: 5720 },
    { date: "2023-10-02T12:30:00Z", value: 5740 },
    { date: "2023-10-02T13:30:00Z", value: 5760 },
    { date: "2023-10-02T14:30:00Z", value: 5750 },
    { date: "2023-10-02T15:30:00Z", value: 5790 },
    { date: "2023-10-02T16:00:00Z", value: 5820 }
  ],
  "1W": [
    { date: "2023-09-25", value: 5600 },
    { date: "2023-09-26", value: 5650 },
    { date: "2023-09-27", value: 5630 },
    { date: "2023-09-28", value: 5660 },
    { date: "2023-09-29", value: 5700 },
    { date: "2023-10-02", value: 5820 }
  ],
  "1M": [
    { date: "2023-09-04", value: 5400 },
    { date: "2023-09-11", value: 5450 },
    { date: "2023-09-18", value: 5520 },
    { date: "2023-09-25", value: 5600 },
    { date: "2023-10-02", value: 5820 }
  ],
  "1Y": [
    { date: "2022-10", value: 4800 },
    { date: "2022-11", value: 4900 },
    { date: "2022-12", value: 4850 },
    { date: "2023-01", value: 5000 },
    { date: "2023-02", value: 5100 },
    { date: "2023-03", value: 5050 },
    { date: "2023-04", value: 5200 },
    { date: "2023-05", value: 5300 },
    { date: "2023-06", value: 5350 },
    { date: "2023-07", value: 5450 },
    { date: "2023-08", value: 5550 },
    { date: "2023-09", value: 5700 },
    { date: "2023-10", value: 5820 }
  ],
  "All": [
    { date: "2021-10", value: 3200 },
    { date: "2022-01", value: 3500 },
    { date: "2022-04", value: 3800 },
    { date: "2022-07", value: 4200 },
    { date: "2022-10", value: 4800 },
    { date: "2023-01", value: 5000 },
    { date: "2023-04", value: 5200 },
    { date: "2023-07", value: 5450 },
    { date: "2023-10", value: 5820 }
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