import { Calendar, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingBills } from '@/hooks/useApi';
import { useContentLoading } from '@/hooks/useContentLoading';

export function UpcomingBills() {
  const upcomingBillsQuery = useUpcomingBills();
  const { data: bills = [], isLoading, error } = upcomingBillsQuery;
  
  // Use content-area loading for this component
  useContentLoading(upcomingBillsQuery, { message: 'Loading upcoming bills' });

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

  // Use actual data or fallback for demo
  const displayBills = bills.length > 0 ? bills : [
          {
            id: '1',
            name: 'Electricity Bill',
            amount: 85.20,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            isRecurring: true,
            status: 'upcoming'
          },
          {
            id: '2',
            name: 'Internet Service',
            amount: 65.00,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
            isRecurring: true,
            status: 'upcoming'
          },
          {
            id: '3',
            name: 'Water Bill',
            amount: 42.75,
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            isRecurring: true,
            status: 'overdue'
          },
          {
            id: '4',
            name: 'Phone Bill',
            amount: 55.00,
            dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
            isRecurring: true,
            status: 'upcoming'
          },
          {
            id: '5',
            name: 'Credit Card Payment',
            amount: 150.00,
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            isRecurring: false,
            status: 'paid'
        }
  ];

  const getBillStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-amber-500" />;
    }
  };

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-4">
      {displayBills
        .filter(bill => (bill.status || 'upcoming') !== 'paid')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .map((bill) => {
          const dueDate = new Date(bill.dueDate);
          const formattedDate = format(dueDate, 'MMM d, yyyy');
          const timeRemaining = formatDistanceToNow(dueDate, { addSuffix: true });
          
          return (
            <div key={bill.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    {(bill.isRecurring || false) ? <CalendarClock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">{formattedDate} • {timeRemaining}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">${bill.amount.toFixed(2)}</p>
                  <Badge variant="outline" className={`text-xs ${getBillStatusColor(bill.status || 'upcoming')}`}>
                    <span className="mr-1">{getBillStatusIcon(bill.status || 'upcoming')}</span>
                    {(bill.status || 'upcoming').charAt(0).toUpperCase() + (bill.status || 'upcoming').slice(1)}
                  </Badge>
                </div>
              </div>
            );
        })}
    </div>
  );
} 