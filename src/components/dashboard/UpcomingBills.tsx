import { useState, useEffect } from 'react';
import { Calendar, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  status: 'upcoming' | 'overdue' | 'paid';
}

export function UpcomingBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBills() {
      try {
        const response = await fetch('/api/bills/upcoming');
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming bills');
        }
        const data = await response.json();
        setBills(data);
      } catch (error) {
        console.error('Error fetching upcoming bills:', error);
        // Fallback data
        setBills([
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
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBills();
  }, []);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bills.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          No upcoming bills found.
        </div>
      ) : (
        bills
          .filter(bill => bill.status !== 'paid')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .map((bill) => {
            const dueDate = new Date(bill.dueDate);
            const formattedDate = format(dueDate, 'MMM d, yyyy');
            const timeRemaining = formatDistanceToNow(dueDate, { addSuffix: true });
            
            return (
              <div key={bill.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    {bill.isRecurring ? <CalendarClock className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">{formattedDate} • {timeRemaining}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">${bill.amount.toFixed(2)}</p>
                  <Badge variant="outline" className={`text-xs ${getBillStatusColor(bill.status)}`}>
                    <span className="mr-1">{getBillStatusIcon(bill.status)}</span>
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                  </Badge>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
} 