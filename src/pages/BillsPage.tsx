import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlitchText } from '@/components/ui/GlitchText';
import { Toaster, toast } from 'sonner';
import ContentAreaLoader from '@/components/ui/ContentAreaLoader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, AlertTriangle, Clock, Trash2, PlusCircle, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { AddBillForm } from '@/components/forms/AddBillForm';
import { useBills, useMarkBillPaid, useDeleteBill } from '@/hooks/useApi';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { UsageLimitWarning } from '@/components/subscription/UsageLimitWarning';
import type { Bill } from '@/services/firestore';

const FREQUENCY_LABELS: Record<Bill['frequency'], string> = {
  monthly: 'Monthly',
  weekly: 'Weekly',
  yearly: 'Yearly',
  once: 'One-time',
};

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date();
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const BillsPage = () => {
  const { data: bills = [], isLoading } = useBills();
  const markPaid = useMarkBillPaid();
  const deleteBill = useDeleteBill();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { usage } = useUsageLimits();

  const upcomingBills = bills.filter((b) => !b.isPaid);
  const paidBills = bills.filter((b) => b.isPaid);
  const overdueBills = upcomingBills.filter((b) => isOverdue(b.dueDate));
  const totalUpcomingThisMonth = upcomingBills
    .filter((b) => {
      const d = new Date(b.dueDate);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, b) => s + b.amount, 0);

  const handleMarkPaid = async (bill: Bill) => {
    try {
      await markPaid.mutateAsync(bill.id);
      if (bill.frequency === 'once') {
        toast.success(`${bill.name} marked as paid`);
      } else {
        toast.success(`${bill.name} marked as paid`, {
          description: `Next due date advanced for ${FREQUENCY_LABELS[bill.frequency].toLowerCase()} billing`,
        });
      }
    } catch {
      toast.error('Failed to mark bill as paid.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBill.mutateAsync(deleteId);
      toast.success('Bill deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete bill.');
    }
  };

  const BillRow = ({ bill }: { bill: Bill }) => {
    const overdue = isOverdue(bill.dueDate) && !bill.isPaid;
    return (
      <div className={`flex items-center justify-between py-3 px-4 rounded-lg border mb-2 ${overdue ? 'border-red-500/40 bg-red-500/5' : 'border-border'}`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${overdue ? 'bg-red-500/10' : 'bg-primary/10'}`}>
            {bill.isPaid
              ? <CheckCircle2 className="h-5 w-5 text-green-500" />
              : overdue
              ? <AlertTriangle className="h-5 w-5 text-red-500" />
              : <CalendarClock className="h-5 w-5 text-amber-500" />
            }
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{bill.name}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span>{overdue ? 'Was due' : bill.isPaid ? 'Paid •' : 'Due'} {format(new Date(bill.dueDate), 'MMM d, yyyy')}</span>
              <span>•</span>
              <span>{bill.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <span className="font-semibold">{formatCurrency(bill.amount)}</span>
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            {FREQUENCY_LABELS[bill.frequency]}
          </Badge>
          {!bill.isPaid && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => handleMarkPaid(bill)}
              disabled={markPaid.isPending}
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark Paid</span>
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteId(bill.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <ContentAreaLoader visible={isLoading} message="Loading bills" />
      {!isLoading && (
        <div className="space-y-6">
          <Toaster position="top-right" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                <GlitchText intensity="low" trigger="hover">Bills & Recurring</GlitchText>
              </h1>
              <p className="text-muted-foreground">Track your bills and recurring payments</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <AddBillForm
                trigger={
                  usage.bills.atLimit ? (
                    <Button disabled className="cyber-glow-blue cyber-border opacity-50 cursor-not-allowed">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <GlitchText intensity="low" trigger="hover">Add Bill</GlitchText>
                    </Button>
                  ) : undefined
                }
              />
            </div>
          </div>

          <UsageLimitWarning
            resource="bills"
            used={usage.bills.used}
            limit={usage.bills.limit}
          />

          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Due This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalUpcomingThisMonth)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {upcomingBills.filter((b) => {
                    const d = new Date(b.dueDate);
                    const n = new Date();
                    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
                  }).length} bills pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${overdueBills.length > 0 ? 'text-red-500' : ''}`}>
                  {overdueBills.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {overdueBills.length === 0 ? 'All caught up!' : `${formatCurrency(overdueBills.reduce((s, b) => s + b.amount, 0))} overdue`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Total Bills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bills.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {paidBills.length} paid · {upcomingBills.length} upcoming
                </p>
              </CardContent>
            </Card>
          </div>

          {bills.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-2">No bills yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Add your recurring bills to track and manage payments
                </p>
                <AddBillForm
                  trigger={
                    <Button className="cyber-glow-blue cyber-border">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <GlitchText intensity="low" trigger="hover">Add Your First Bill</GlitchText>
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {upcomingBills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bills</CardTitle>
                    <CardDescription>Sorted by due date — overdue bills highlighted in red</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingBills.map((bill) => (
                      <BillRow key={bill.id} bill={bill} />
                    ))}
                  </CardContent>
                </Card>
              )}

              {paidBills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-muted-foreground">Paid Bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paidBills.map((bill) => (
                      <BillRow key={bill.id} bill={bill} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle>Delete Bill</DialogTitle>
                <DialogDescription>
                  This will permanently delete the bill. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleteBill.isPending}
                >
                  <GlitchText intensity="low" trigger="hover">
                    {deleteBill.isPending ? 'Deleting...' : 'Delete'}
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

export default BillsPage;
