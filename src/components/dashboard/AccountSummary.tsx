import { useState } from 'react';
import { Building, CreditCard, TrendingUp, Pencil, Trash2, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlitchText } from '@/components/ui/GlitchText';
import { toast } from 'sonner';
import { AddAccountForm } from '@/components/forms/AddAccountForm';
import { useUpdateAccount, useDeleteAccount } from '@/hooks/useApi';
import type { Account } from '@/services/firestore';

interface AccountSummaryProps {
  accounts: Account[];
  isLoading: boolean;
}

export function AccountSummary({ accounts, isLoading }: AccountSummaryProps) {
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<Account['type']>('checking');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditName(account.name);
    setEditType(account.type);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateAccount.mutateAsync({ accountId: editingId, data: { name: editName, type: editType } });
      toast.success('Account updated');
      setEditingId(null);
    } catch {
      toast.error('Failed to update account.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAccount.mutateAsync(deleteId);
      toast.success('Account deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete account.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        <div className="h-20 rounded-md bg-muted/30 animate-pulse" />
        <div className="h-20 rounded-md bg-muted/30 animate-pulse" />
        <div className="h-20 rounded-md bg-muted/30 animate-pulse" />
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'savings': return <Building className="h-5 w-5" />;
      case 'investment': return <TrendingUp className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddAccountForm />
      </div>

      {accounts.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          No accounts yet. Add one to get started.
        </div>
      ) : (
        accounts.map((account) => {
          const percentage = totalBalance > 0 ? (account.balance / totalBalance) * 100 : 0;
          const isEditing = editingId === account.id;

          return (
            <div key={account.id} className="space-y-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-sm flex-1"
                    autoFocus
                  />
                  <Select value={editType} onValueChange={(v) => setEditType(v as Account['type'])}>
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-500"
                    onClick={saveEdit}
                    disabled={updateAccount.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{account.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-right mr-2">
                      <div className="font-medium">${account.balance.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(account)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(account.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })
      )}

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete the account. Existing transactions linked to it will remain but the account balance will no longer be tracked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteAccount.isPending}
            >
              <GlitchText intensity="low" trigger="hover">
                {deleteAccount.isPending ? 'Deleting...' : 'Delete'}
              </GlitchText>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
