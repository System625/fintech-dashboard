import { CreditCard, Landmark, ArrowLeftRight } from 'lucide-react';
import { GlitchText } from '@/components/ui/GlitchText';
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
import { useAccounts, useAddTransaction, useTransferFunds } from '@/hooks/useApi';

type ActionType = 'deposit' | 'withdraw' | 'transfer';

interface QuickActionProps {
  onActionComplete?: () => void;
}

export function QuickActions({ onActionComplete }: QuickActionProps) {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');

  const { data: accounts = [] } = useAccounts();
  const addTransaction = useAddTransaction();
  const transferFunds = useTransferFunds();

  const isPending = addTransaction.isPending || transferFunds.isPending;

  const createHandleOpenChange = (action: ActionType) => (open: boolean) => {
    if (open) {
      setActiveAction(action);
    } else {
      setAmount('');
      setFromAccount('');
      setToAccount('');
      setActiveAction(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      if (activeAction === 'deposit') {
        if (!toAccount) { toast.error('Please select an account'); return; }
        await addTransaction.mutateAsync({
          accountId: toAccount,
          amount: parsedAmount,
          description: 'Deposit',
          category: 'Other Income',
          type: 'income',
          date: new Date().toISOString(),
        });
        const accountName = accounts.find((a) => a.id === toAccount)?.name ?? 'account';
        toast.success('Deposit complete', { description: `$${parsedAmount.toFixed(2)} deposited into ${accountName}` });
      } else if (activeAction === 'withdraw') {
        if (!fromAccount) { toast.error('Please select an account'); return; }
        await addTransaction.mutateAsync({
          accountId: fromAccount,
          amount: parsedAmount,
          description: 'Withdrawal',
          category: 'Other',
          type: 'expense',
          date: new Date().toISOString(),
        });
        const accountName = accounts.find((a) => a.id === fromAccount)?.name ?? 'account';
        toast.success('Withdrawal complete', { description: `$${parsedAmount.toFixed(2)} withdrawn from ${accountName}` });
      } else if (activeAction === 'transfer') {
        if (!fromAccount || !toAccount) { toast.error('Please select both accounts'); return; }
        if (fromAccount === toAccount) { toast.error('Source and destination must be different'); return; }
        await transferFunds.mutateAsync({ fromAccountId: fromAccount, toAccountId: toAccount, amount: parsedAmount });
        const fromName = accounts.find((a) => a.id === fromAccount)?.name ?? 'account';
        const toName = accounts.find((a) => a.id === toAccount)?.name ?? 'account';
        toast.success('Transfer complete', { description: `$${parsedAmount.toFixed(2)} transferred from ${fromName} to ${toName}` });
      }

      setActiveAction(null);
      onActionComplete?.();
    } catch (error) {
      toast.error('Transaction failed', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const getActionTitle = () => {
    switch (activeAction) {
      case 'deposit': return 'Deposit Funds';
      case 'withdraw': return 'Withdraw Funds';
      case 'transfer': return 'Transfer Funds';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Deposit */}
      <Dialog open={activeAction === 'deposit'} onOpenChange={createHandleOpenChange('deposit')}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center cyber-glow-blue cyber-border">
            <Landmark className="h-5 w-5" />
            <GlitchText intensity="low" trigger="hover">
              <span className="text-xs md:text-sm">Deposit</span>
            </GlitchText>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>Add funds to your account</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input id="deposit-amount" type="number" placeholder="0.00" className="pl-7" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit-to">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger id="deposit-to">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full cyber-glow-blue">
                <GlitchText intensity="low" trigger="hover">
                  {isPending ? 'Processing...' : 'Deposit Funds'}
                </GlitchText>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdraw */}
      <Dialog open={activeAction === 'withdraw'} onOpenChange={createHandleOpenChange('withdraw')}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center cyber-glow-green cyber-border">
            <CreditCard className="h-5 w-5" />
            <GlitchText intensity="low" trigger="hover">
              <span className="text-xs md:text-sm">Withdraw</span>
            </GlitchText>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>Withdraw funds from your account</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-from">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger id="withdraw-from">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input id="withdraw-amount" type="number" placeholder="0.00" className="pl-7" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full cyber-glow-green">
                <GlitchText intensity="low" trigger="hover">
                  {isPending ? 'Processing...' : 'Withdraw Funds'}
                </GlitchText>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer */}
      <Dialog open={activeAction === 'transfer'} onOpenChange={createHandleOpenChange('transfer')}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-24 flex flex-col gap-2 items-center justify-center cyber-glow-pink cyber-border">
            <ArrowLeftRight className="h-5 w-5" />
            <GlitchText intensity="low" trigger="hover">
              <span className="text-xs md:text-sm">Transfer</span>
            </GlitchText>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>Transfer money between your accounts</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-from">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger id="transfer-from">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-to">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger id="transfer-to">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Accounts</SelectLabel>
                    {accounts.filter((a) => a.id !== fromAccount).map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input id="transfer-amount" type="number" placeholder="0.00" className="pl-7" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full cyber-glow-pink">
                <GlitchText intensity="low" trigger="hover">
                  {isPending ? 'Processing...' : 'Transfer Funds'}
                </GlitchText>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
