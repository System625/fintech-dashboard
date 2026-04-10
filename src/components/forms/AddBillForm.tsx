import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { GlitchText } from '@/components/ui/GlitchText';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddBill } from '@/hooks/useApi';

const BILL_CATEGORIES = [
  'Housing', 'Utilities', 'Transport', 'Subscriptions',
  'Insurance', 'Health', 'Education', 'Food', 'Entertainment', 'Other',
];

const formSchema = z.object({
  name: z.string().min(1, { message: 'Bill name is required.' }),
  amount: z.coerce.number().min(0.01, { message: 'Amount must be greater than 0.' }),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  frequency: z.enum(['monthly', 'weekly', 'yearly', 'once']),
  category: z.string().min(1, { message: 'Category is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormValues = {
  name: '',
  amount: 0,
  dueDate: new Date(),
  frequency: 'monthly',
  category: '',
};

interface AddBillFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddBillForm({ onSuccess, trigger }: AddBillFormProps) {
  const [open, setOpen] = useState(false);
  const addBill = useAddBill();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleClose = () => {
    setOpen(false);
    form.reset(DEFAULT_VALUES);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await addBill.mutateAsync({
        name: data.name,
        amount: data.amount,
        dueDate: data.dueDate.toISOString(),
        frequency: data.frequency,
        category: data.category,
        isPaid: false,
      });
      toast.success('Bill added', { description: `${data.name} has been added.` });
      handleClose();
      onSuccess?.();
    } catch {
      toast.error('Failed to add bill. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="cyber-glow-blue cyber-border text-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            <GlitchText intensity="low" trigger="hover">Add Bill</GlitchText>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add Bill</DialogTitle>
          <DialogDescription>Set up a recurring or one-time bill.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Electricity Bill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" step="0.01" min="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full pl-3 text-left font-normal">
                            {field.value ? format(field.value, 'MMM d, yyyy') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BILL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={addBill.isPending} className="cyber-glow-blue">
                <GlitchText intensity="low" trigger="hover">
                  {addBill.isPending ? 'Saving...' : 'Add Bill'}
                </GlitchText>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
