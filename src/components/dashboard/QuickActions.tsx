import { CreditCard, Landmark, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type ActionType = 'deposit' | 'withdraw' | 'transfer';

interface QuickActionProps {
  onActionComplete?: () => void;
}

export function QuickActions({ onActionComplete }: QuickActionProps) {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createHandleOpenChange = (action: ActionType) => (open: boolean) => {
    if (open) {
      setActiveAction(action);
    } else {
      // Reset form when dialog is closed
      setAmount('');
      setFromAccount('');
      setToAccount('');
      setIsSubmitting(false);
      setActiveAction(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Different validations based on action type
      if (activeAction === 'transfer' && (!fromAccount || !toAccount)) {
        throw new Error('Please select both accounts');
      } else if (activeAction === 'withdraw' && !fromAccount) {
        throw new Error('Please select an account');
      } else if (activeAction === 'deposit' && !toAccount) {
        throw new Error('Please select an account');
      }

      // Success! Show appropriate message
      let successMessage = '';
      switch (activeAction) {
        case 'deposit':
          successMessage = `Deposited $${parsedAmount.toFixed(2)} into ${toAccount}`;
          break;
        case 'withdraw':
          successMessage = `Withdrew $${parsedAmount.toFixed(2)} from ${fromAccount}`;
          break;
        case 'transfer':
          successMessage = `Transferred $${parsedAmount.toFixed(2)} from ${fromAccount} to ${toAccount}`;
          break;
      }

      toast.success('Transaction Complete', {
        description: successMessage,
      });

      // Reset and close
      setActiveAction(null);
      
      // Call callback if provided
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (error) {
      toast.error('Transaction Failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionTitle = () => {
    switch (activeAction) {
      case 'deposit':
        return 'Deposit Funds';
      case 'withdraw':
        return 'Withdraw Funds';
      case 'transfer':
        return 'Transfer Funds';
      default:
        return '';
    }
  };

  const accounts = [
    { id: 'checking', name: 'Checking Account' },
    { id: 'savings', name: 'Savings Account' },
    { id: 'investment', name: 'Investment Account' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Dialog open={activeAction === 'deposit'} onOpenChange={createHandleOpenChange('deposit')}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center">
            <Landmark className="h-5 w-5" />
            <span className="text-xs md:text-sm">Deposit</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>
              Add funds to your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount} required>
                <SelectTrigger id="toAccount">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Processing...' : 'Deposit Funds'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeAction === 'withdraw'} onOpenChange={createHandleOpenChange('withdraw')}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs md:text-sm">Withdraw</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>
              Withdraw funds from your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount} required>
                <SelectTrigger id="fromAccount">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Processing...' : 'Withdraw Funds'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeAction === 'transfer'} onOpenChange={createHandleOpenChange('transfer')}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center">
            <ArrowLeftRight className="h-5 w-5" />
            <span className="text-xs md:text-sm">Transfer</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>
              Transfer money between your accounts
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount} required>
                <SelectTrigger id="fromAccount">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount} required>
                <SelectTrigger id="toAccount">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Processing...' : 'Transfer Funds'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 