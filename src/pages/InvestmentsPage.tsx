import { useState, useEffect } from "react";
import { NewInvestmentForm } from "@/components/forms/NewInvestmentForm";
import { AssetAllocationChart, PortfolioPerformanceChart } from '@/components/charts';
import { Toaster } from "sonner";
import { PageTitle } from '@/components/PageTitle';
import { DataCard } from '@/components/DataCard';
import { GlitchText } from '@/components/ui/GlitchText';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';

interface Investment {
  id: string;
  name: string;
  ticker: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  category: string;
  lastUpdated: string;
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/investments');
      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }
      const data = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
      // Sample data in case of error
      setInvestments([
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
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Handle successful investment creation
  const handleInvestmentAdded = () => {
    fetchInvestments();
  };

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = () => {
    if (investments.length === 0) return { totalValue: 0, totalGain: 0, totalReturn: 0 };

    const totalValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
    const totalCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.buyPrice), 0);
    const totalGain = totalValue - totalCost;
    const totalReturn = (totalGain / totalCost) * 100;

    return {
      totalValue: totalValue.toFixed(2),
      totalGain: totalGain.toFixed(2),
      totalReturn: totalReturn.toFixed(2)
    };
  };

  const metrics = calculatePortfolioMetrics();

  return (
    <>
      <ContentAreaLoader visible={isLoading} message="Loading investments" />
      {!isLoading && (
        <div className="space-y-6">
        <PageTitle title={<GlitchText intensity="low" trigger="hover">Investments</GlitchText>} />
        <Toaster position="top-right" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <DataCard 
          title="Total Value" 
          value={`$${Number(metrics.totalValue).toLocaleString()}`} 
          icon={<DollarSign />} 
          trend={Number(metrics.totalReturn)} 
        />
        <DataCard 
          title="Total Gain/Loss" 
          value={`$${Number(metrics.totalGain).toLocaleString()}`} 
          icon={<TrendingUp />} 
          trend={Number(metrics.totalReturn)}
        />
        <DataCard 
          title="Total Return" 
          value={`${Number(metrics.totalReturn).toLocaleString()}%`} 
          icon={<BarChart3 />} 
          trend={Number(metrics.totalReturn)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioPerformanceChart />
        <AssetAllocationChart />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-xl font-semibold">Your Investments</h2>
            <p className="text-sm text-muted-foreground">Manage your investment portfolio</p>
          </div>
          <NewInvestmentForm onSuccess={handleInvestmentAdded} />
        </div>

        {investments.length === 0 ? (
          <div className="p-6">
            <p className="text-center text-muted-foreground">No investments found. Add your first investment!</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="rounded-md border">
              <div className="scrollable-table-container">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="py-3 pl-2 sm:pl-4 text-left text-xs sm:text-sm">Name</th>
                      <th className="py-3 text-left text-xs sm:text-sm">Symbol</th>
                      <th className="py-3 text-left text-xs sm:text-sm">Shares</th>
                      <th className="py-3 text-right text-xs sm:text-sm">Price</th>
                      <th className="py-3 text-right text-xs sm:text-sm">Value</th>
                      <th className="py-3 text-right pr-2 sm:pr-4 text-xs sm:text-sm">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => {
                      const currentValue = investment.shares * investment.currentPrice;
                      const costBasis = investment.shares * investment.buyPrice;
                      const returnValue = ((currentValue - costBasis) / costBasis) * 100;
                      
                      return (
                        <tr key={investment.id} className="border-b">
                          <td className="py-2 sm:py-3 pl-2 sm:pl-4 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{investment.name}</td>
                          <td className="py-2 sm:py-3 text-xs sm:text-sm">{investment.ticker}</td>
                          <td className="py-2 sm:py-3 text-xs sm:text-sm">{investment.shares}</td>
                          <td className="py-2 sm:py-3 text-right text-xs sm:text-sm">${investment.currentPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}</td>
                          <td className="py-2 sm:py-3 text-right text-xs sm:text-sm">${currentValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}</td>
                          <td className={`py-2 sm:py-3 text-right pr-2 sm:pr-4 text-xs sm:text-sm ${returnValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {returnValue >= 0 ? '+' : ''}{returnValue.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-muted-foreground text-center py-2 md:hidden">
                Swipe to view more →
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    )}
  </>
);
} 