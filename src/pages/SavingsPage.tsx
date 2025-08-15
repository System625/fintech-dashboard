import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SavingsGrowthChart } from "@/components/charts";
import { NewSavingsGoalForm } from "@/components/forms/NewSavingsGoalForm";
import { PlusCircle, Percent, TrendingUp, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GlitchText } from "@/components/ui/GlitchText";
import { Toaster } from "sonner";

interface SavingsGoal {
  id: string;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  targetDate?: string;
  interestRate?: number;
}

interface InterestStats {
  totalInterestEarned: number;
  projectedAnnualInterest: number;
  averageInterestRate: number;
}

const SavingsPage = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openNewGoalDialog, setOpenNewGoalDialog] = useState(false);
  const [interestStats, setInterestStats] = useState<InterestStats>({
    totalInterestEarned: 0,
    projectedAnnualInterest: 0,
    averageInterestRate: 0
  });

  useEffect(() => {
    fetchSavingsGoals();
  }, []);

  const fetchSavingsGoals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/savings');
      if (!response.ok) {
        throw new Error('Failed to fetch savings goals');
      }
      const data = await response.json();
      setSavingsGoals(data);
      
      // Calculate interest statistics
      calculateInterestStats(data);
    } catch (error) {
      console.error('Error fetching savings goals:', error);
      // Fallback data if API fails
      const fallbackData = [
        {
          id: '1',
          title: 'Emergency Fund',
          description: 'For unexpected expenses',
          currentAmount: 5000,
          targetAmount: 10000,
          interestRate: 2.5,
          targetDate: new Date(2024, 11, 31).toISOString()
        },
        {
          id: '2',
          title: 'Vacation',
          description: 'Summer trip to Europe',
          currentAmount: 2500,
          targetAmount: 4000,
          interestRate: 1.8,
          targetDate: new Date(2024, 5, 15).toISOString()
        },
        {
          id: '3',
          title: 'New Car',
          description: 'Saving for a down payment',
          currentAmount: 3500,
          targetAmount: 8000,
          interestRate: 2.1,
          targetDate: new Date(2025, 2, 1).toISOString()
        }
      ];
      setSavingsGoals(fallbackData);
      calculateInterestStats(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateInterestStats = (goals: SavingsGoal[]) => {
    if (!goals.length) {
      setInterestStats({
        totalInterestEarned: 0,
        projectedAnnualInterest: 0,
        averageInterestRate: 0
      });
      return;
    }
    
    let totalAmount = 0;
    let weightedInterestRate = 0;
    let totalInterestEarned = 0;
    
    goals.forEach(goal => {
      totalAmount += goal.currentAmount;
      
      if (goal.interestRate) {
        weightedInterestRate += (goal.currentAmount * (goal.interestRate || 0));
        // Simplified calculation: assume interest earned over 1 year at current amount
        totalInterestEarned += goal.currentAmount * (goal.interestRate / 100) / 12; // Monthly interest
      }
    });
    
    const avgInterestRate = totalAmount > 0 ? weightedInterestRate / totalAmount : 0;
    
    // Projected annual interest based on current amounts and rates
    const projectedAnnual = totalAmount * (avgInterestRate / 100);
    
    setInterestStats({
      totalInterestEarned: totalInterestEarned,
      projectedAnnualInterest: projectedAnnual,
      averageInterestRate: avgInterestRate
    });
  };

  const handleSavingsGoalCreated = async () => {
    setOpenNewGoalDialog(false);
    await fetchSavingsGoals();
  };

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function formatDate(dateString?: string) {
    if (!dateString) return 'No target date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  }

  function calculateProgress(current: number, target: number) {
    return Math.min(Math.round((current / target) * 100), 100);
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <GlitchText intensity="low" trigger="hover">Savings Goals</GlitchText>
          </h1>
          <p className="text-muted-foreground">Track and manage your savings targets</p>
        </div>
        <Dialog open={openNewGoalDialog} onOpenChange={setOpenNewGoalDialog}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 cyber-glow-blue cyber-border text-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              <GlitchText intensity="low" trigger="hover">New Savings Goal</GlitchText>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
              <DialogDescription>
                Set up a new savings goal with target amount and date
              </DialogDescription>
            </DialogHeader>
            <NewSavingsGoalForm onSuccess={handleSavingsGoalCreated} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Interest Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(interestStats.totalInterestEarned)}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>Based on current savings and rates</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Annual Interest</CardTitle>
            <CardDescription>At current rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(interestStats.projectedAnnualInterest)}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Over the next 12 months</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Interest Rate</CardTitle>
            <CardDescription>Across all goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interestStats.averageInterestRate.toFixed(2)}%</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Percent className="mr-1 h-3 w-3" />
              <span>Weighted by goal amount</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted/30 h-24"></CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted/30 rounded"></div>
                  <div className="h-4 bg-muted/30 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : savingsGoals.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-2">No savings goals found</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first savings goal to start tracking your progress</p>
            <Button onClick={() => setOpenNewGoalDialog(true)} className="cyber-glow-green cyber-border">
              <PlusCircle className="mr-2 h-4 w-4" />
              <GlitchText intensity="low" trigger="hover">Create a Savings Goal</GlitchText>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle>{goal.title}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current</p>
                      <p className="text-2xl font-bold">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Target</p>
                      <p className="text-2xl font-bold">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex w-full justify-between text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{formatDate(goal.targetDate)}</span>
                    </div>
                    {goal.interestRate && (
                      <div className="flex items-center">
                        <Percent className="mr-1 h-4 w-4" />
                        <span>{goal.interestRate}%</span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Savings Growth</CardTitle>
          <CardDescription>Historical view of your savings</CardDescription>
        </CardHeader>
        <CardContent>
          <SavingsGrowthChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsPage; 