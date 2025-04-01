import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define schema for form validation
const formSchema = z.object({
  symbol: z.string().min(1, {
    message: "Symbol is required.",
  }).max(5, {
    message: "Symbol should be 5 characters or less.",
  }),
  shares: z.coerce
    .number()
    .min(0.01, { message: "Shares must be greater than 0." }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be greater than 0." }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewInvestmentFormProps {
  onSuccess?: () => void;
}

export function NewInvestmentForm({ onSuccess }: NewInvestmentFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      shares: 1,
      price: 0,
      category: "Stocks",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call API to create a new investment
      const response = await fetch('/api/investments/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: data.symbol.toUpperCase(),
          shares: data.shares,
          price: data.price,
          category: data.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to purchase investment');
      }

      // No need to store the result if it's not used
      await response.json();
      
      // Show success toast using Sonner
      toast.success('Investment Added', {
        description: `Successfully added ${data.shares} shares of ${data.symbol.toUpperCase()} at $${data.price}.`,
      });
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error adding investment:', error);
      toast.error('Error', {
        description: "Failed to add investment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Investment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
          <DialogDescription>
            Enter the details of your investment purchase.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="AAPL" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    The stock symbol/ticker.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shares</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Share ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="150.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="Stocks">Stocks</SelectItem>
                        <SelectItem value="ETFs">ETFs</SelectItem>
                        <SelectItem value="Crypto">Crypto</SelectItem>
                        <SelectItem value="Bonds">Bonds</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of investment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Buy Investment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 