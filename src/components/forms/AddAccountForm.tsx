import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { GlitchText } from '@/components/ui/GlitchText';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddAccount } from '@/hooks/useApi';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Account name is required.' }),
  type: z.enum(['checking', 'savings', 'investment', 'credit']),
  balance: z.coerce.number().min(0, { message: 'Balance must be 0 or greater.' }),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormValues = { name: '', type: 'checking', balance: 0 };

interface AddAccountFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddAccountForm({ onSuccess, trigger }: AddAccountFormProps) {
  const [open, setOpen] = useState(false);
  const addAccount = useAddAccount();

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
      await addAccount.mutateAsync({ name: data.name, type: data.type, balance: data.balance, currency: 'USD' });
      toast.success('Account created', { description: `${data.name} has been added.` });
      handleClose();
      onSuccess?.();
    } catch {
      toast.error('Failed to create account. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="cyber-glow-blue cyber-border text-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            <GlitchText intensity="low" trigger="hover">Add Account</GlitchText>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>Create a new financial account.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Main Checking" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Balance ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={addAccount.isPending} className="cyber-glow-blue">
                <GlitchText intensity="low" trigger="hover">
                  {addAccount.isPending ? 'Creating...' : 'Create Account'}
                </GlitchText>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
