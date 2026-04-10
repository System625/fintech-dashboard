import { Calendar, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useUpcomingBills, useMarkBillPaid } from '@/hooks/useApi';
import type { Bill } from '@/services/firestore';

export function UpcomingBills() {
  const { data: bills = [], isLoading, error } = useUpcomingBills();
  const markPaid = useMarkBillPaid();

  const handleMarkPaid = async (bill: Bill) => {
    try {
      await markPaid.mutateAsync(bill.id);
      toast.success(bill.frequency === 'once' ? `${bill.name} marked as paid` : `${bill.name} paid — next date advanced`);
    } catch {
      toast.error('Failed to mark bill as paid.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load upcoming bills</p>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No upcoming bills</p>
      </div>
    );
  }

  const displayed = bills.slice(0, 5);

  return (
    <div className="space-y-4">
      {displayed.map((bill) => {
        const dueDate = new Date(bill.dueDate);
        const overdue = dueDate < new Date();
        const timeRemaining = formatDistanceToNow(dueDate, { addSuffix: true });

        return (
          <div
            key={bill.id}
            className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 ${overdue ? 'text-red-500' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${overdue ? 'bg-red-500/10' : 'bg-primary/10'}`}>
                {overdue
                  ? <AlertTriangle className="h-5 w-5 text-red-500" />
                  : bill.frequency !== 'once'
                  ? <CalendarClock className="h-5 w-5" />
                  : <Calendar className="h-5 w-5" />
                }
              </div>
              <div>
                <p className="text-sm font-medium">{bill.name}</p>
                <p className={`text-xs ${overdue ? 'text-red-400' : 'text-muted-foreground'}`}>
                  {format(dueDate, 'MMM d, yyyy')} • {timeRemaining}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">${bill.amount.toFixed(2)}</p>
              {overdue ? (
                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300">
                  Overdue
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2"
                  onClick={() => handleMarkPaid(bill)}
                  disabled={markPaid.isPending}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
