import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavingsGrowthChart } from "@/components/charts";
import { NewSavingsGoalForm } from "@/components/forms/NewSavingsGoalForm";
import {
  PlusCircle,
  Target,
  CheckCircle2,
  Calendar,
  Pencil,
  Trash2,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlitchText } from "@/components/ui/GlitchText";
import { Toaster, toast } from "sonner";
import ContentAreaLoader from "@/components/ui/ContentAreaLoader";
import {
  useSavings,
  useContributeToGoal,
  useUpdateSavingsGoal,
  useDeleteSavingsGoal,
} from "@/hooks/useApi";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UsageLimitWarning } from "@/components/subscription/UsageLimitWarning";
import type { SavingsGoal } from "@/services/firestore";

function getProgressColor(pct: number) {
  if (pct >= 75) return "text-green-500";
  if (pct >= 50) return "text-blue-500";
  if (pct >= 25) return "text-yellow-500";
  return "text-red-500";
}

function getDaysRemaining(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

const SavingsPage = () => {
  const { data: goals = [], isLoading } = useSavings();
  const contributeToGoal = useContributeToGoal();
  const updateGoal = useUpdateSavingsGoal();
  const deleteGoal = useDeleteSavingsGoal();
  const { usage } = useUsageLimits();

  // Contribute dialog state
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState("");

  // Edit inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Metrics
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const goalsComplete = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const startEdit = (goal: SavingsGoal) => {
    setEditingId(goal.id);
    setEditName(goal.name);
    setEditTarget(String(goal.targetAmount));
    setEditDeadline(goal.deadline.split("T")[0]);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateGoal.mutateAsync({
        goalId: editingId,
        data: {
          name: editName,
          targetAmount: parseFloat(editTarget),
          deadline: new Date(editDeadline).toISOString(),
        },
      });
      toast.success("Goal updated");
      setEditingId(null);
    } catch {
      toast.error("Failed to update goal.");
    }
  };

  const handleContribute = async () => {
    if (!contributeGoalId) return;
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    try {
      await contributeToGoal.mutateAsync({ goalId: contributeGoalId, amount });
      toast.success("Contribution added", { description: `+${formatCurrency(amount)} added to goal` });
      setContributeGoalId(null);
      setContributeAmount("");
    } catch {
      toast.error("Failed to contribute to goal.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGoal.mutateAsync(deleteId);
      toast.success("Goal deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete goal.");
    }
  };

  return (
    <>
      <ContentAreaLoader visible={isLoading} message="Loading savings goals" />
      {!isLoading && (
        <div className="space-y-6">
          <Toaster position="top-right" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                <GlitchText intensity="low" trigger="hover">Savings Goals</GlitchText>
              </h1>
              <p className="text-muted-foreground">Track and manage your savings targets</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <NewSavingsGoalForm
                trigger={
                  usage.savingsGoals.atLimit ? (
                    <Button disabled className="cyber-glow-green cyber-border opacity-50 cursor-not-allowed">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <GlitchText intensity="low" trigger="hover">New Savings Goal</GlitchText>
                    </Button>
                  ) : undefined
                }
              />
            </div>
          </div>

          <UsageLimitWarning
            resource="savingsGoals"
            used={usage.savingsGoals.used}
            limit={usage.savingsGoals.limit}
          />

          {/* Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                <CardDescription>Across all goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSaved)}</div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>of {formatCurrency(totalTarget)} total target</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <CardDescription>Combined completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
                </div>
                <Progress
                  value={totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0}
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Goals Complete</CardTitle>
                <CardDescription>Reached target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {goalsComplete} / {goals.length}
                </div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Target className="mr-1 h-3 w-3" />
                  <span>{goals.length - goalsComplete} in progress</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Cards */}
          {goals.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-2">No savings goals yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Create your first savings goal to start tracking your progress
                </p>
                <NewSavingsGoalForm
                  trigger={
                    <Button className="cyber-glow-green cyber-border">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <GlitchText intensity="low" trigger="hover">Create a Savings Goal</GlitchText>
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const pct = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                const isComplete = goal.currentAmount >= goal.targetAmount;
                const daysRemaining = getDaysRemaining(goal.deadline);
                const isEditing = editingId === goal.id;

                return (
                  <Card key={goal.id} className={isComplete ? "border-green-500/50" : ""}>
                    <CardHeader className="pb-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 text-sm font-semibold"
                            autoFocus
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Target ($)</Label>
                              <Input
                                type="number"
                                value={editTarget}
                                onChange={(e) => setEditTarget(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Deadline</Label>
                              <Input
                                type="date"
                                value={editDeadline}
                                onChange={(e) => setEditDeadline(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={saveEdit}
                              disabled={updateGoal.isPending}
                            >
                              <Check className="mr-1 h-3 w-3" /> Save
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={cancelEdit}>
                              <X className="mr-1 h-3 w-3" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {goal.name}
                              {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            </CardTitle>
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {isComplete
                                  ? "Goal reached!"
                                  : daysRemaining > 0
                                  ? `${daysRemaining} days remaining`
                                  : "Past deadline"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => startEdit(goal)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteId(goal.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className={`font-semibold ${getProgressColor(pct)}`}>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Saved</p>
                          <p className="text-xl font-bold">{formatCurrency(goal.currentAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Target</p>
                          <p className="text-xl font-bold">{formatCurrency(goal.targetAmount)}</p>
                        </div>
                      </div>
                      {!isComplete && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} remaining</span>
                          <span>by {formatDate(goal.deadline)}</span>
                        </div>
                      )}
                      {isComplete ? (
                        <Badge className="w-full justify-center bg-green-500/20 text-green-500 border-green-500/30">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Goal Complete!
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full cyber-glow-blue cyber-border text-foreground"
                          variant="outline"
                          onClick={() => { setContributeGoalId(goal.id); setContributeAmount(""); }}
                        >
                          <PlusCircle className="mr-2 h-3.5 w-3.5" />
                          Contribute
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Savings Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Savings Growth</CardTitle>
              <CardDescription>Historical view of your savings</CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsGrowthChart />
            </CardContent>
          </Card>

          {/* Contribute Dialog */}
          <Dialog open={!!contributeGoalId} onOpenChange={(o) => { if (!o) setContributeGoalId(null); }}>
            <DialogContent className="sm:max-w-[360px]">
              <DialogHeader>
                <DialogTitle>Contribute to Goal</DialogTitle>
                <DialogDescription>
                  {contributeGoalId
                    ? `Adding to: ${goals.find((g) => g.id === contributeGoalId)?.name ?? ""}`
                    : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="contribute-amount">Amount ($)</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="contribute-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    min="0.01"
                    step="0.01"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setContributeGoalId(null)}>Cancel</Button>
                <Button
                  onClick={handleContribute}
                  disabled={contributeToGoal.isPending}
                  className="cyber-glow-blue"
                >
                  <GlitchText intensity="low" trigger="hover">
                    {contributeToGoal.isPending ? "Saving..." : "Add Contribution"}
                  </GlitchText>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirm Dialog */}
          <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle>Delete Goal</DialogTitle>
                <DialogDescription>
                  This will permanently delete the savings goal and all contribution history.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleteGoal.isPending}
                >
                  <GlitchText intensity="low" trigger="hover">
                    {deleteGoal.isPending ? "Deleting..." : "Delete"}
                  </GlitchText>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default SavingsPage;
