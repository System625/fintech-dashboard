import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { openPaystackCheckout, PRO_PLAN } from '@/services/paystack';
import { toast } from 'sonner';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const COMPARISON_ROWS = [
  { label: 'Accounts',         free: '1',          pro: 'Unlimited' },
  { label: 'Transactions',     free: '50 / month', pro: 'Unlimited' },
  { label: 'Savings goals',    free: '2',          pro: 'Unlimited' },
  { label: 'Bills',            free: '3',          pro: 'Unlimited' },
  { label: 'Charts',           free: 'Basic only', pro: 'All charts' },
  { label: 'CSV export',       free: null,         pro: true },
  { label: 'Analytics',        free: null,         pro: true },
];

export function UpgradeModal({ open, onOpenChange, feature }: UpgradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const email = useAuthStore((s) => s.currentUser?.email);
  const uid   = useAuthStore((s) => s.currentUser?.uid);

  const handleUpgrade = () => {
    if (!email || !uid) return;
    setIsProcessing(true);

    openPaystackCheckout({
      email,
      plan: PRO_PLAN.planCode,
      metadata: { uid },
      onSuccess: (reference) => {
        setIsProcessing(false);
        onOpenChange(false);
        toast.success('Payment received', {
          description: `Ref: ${reference} — Pro features activate shortly.`,
        });
      },
      onClose: () => setIsProcessing(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 overflow-hidden max-w-md w-full"
        style={{ background: 'transparent' }}
      >
        {/* Dark shell — ignores app theme */}
        <div
          className="relative bg-zinc-950 text-zinc-100 rounded-xl overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px hsl(220 85% 52% / 0.35), 0 0 40px hsl(220 85% 52% / 0.12), 0 24px 64px rgba(0,0,0,0.7)',
          }}
        >
          {/* Dot-grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(220 85% 52%) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

          {/* Top neon bar */}
          <div
            aria-hidden
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(220 85% 52%), hsl(280 70% 60%), transparent)' }}
          />

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-10 text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 px-6 pt-6 pb-7 space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[hsl(220,85%,65%)]" fill="currentColor" />
                <span
                  className="text-xs font-bold tracking-[0.25em] uppercase"
                  style={{ color: 'hsl(220,85%,65%)' }}
                >
                  Punk Pro
                </span>
              </div>
              <p className="text-lg font-semibold text-zinc-100 leading-tight">
                {feature
                  ? <><span className="text-zinc-400">"{feature}"</span> is a Pro feature</>
                  : 'Unlock the full Budgetpunk experience'
                }
              </p>
            </div>

            {/* Comparison table */}
            <div className="rounded-lg overflow-hidden border border-zinc-800">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_80px_80px] bg-zinc-900">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Feature
                </div>
                <div className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 text-center border-l border-zinc-800">
                  Free
                </div>
                <div
                  className="px-2 py-2 text-[11px] font-bold uppercase tracking-wider text-center border-l border-zinc-800"
                  style={{ color: 'hsl(220,85%,65%)', background: 'hsl(220 85% 52% / 0.08)' }}
                >
                  Pro
                </div>
              </div>

              {/* Rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1fr_80px_80px] border-t border-zinc-800/70 ${i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'}`}
                >
                  <div className="px-3 py-2 text-xs text-zinc-400">{row.label}</div>

                  {/* Free cell */}
                  <div className="px-2 py-2 text-center border-l border-zinc-800/70">
                    {row.free === null ? (
                      <span className="text-zinc-600 text-xs font-mono">—</span>
                    ) : (
                      <span className="text-xs text-zinc-500 tabular-nums">{row.free}</span>
                    )}
                  </div>

                  {/* Pro cell */}
                  <div
                    className="px-2 py-2 text-center border-l border-zinc-800/70"
                    style={{ background: 'hsl(220 85% 52% / 0.05)' }}
                  >
                    {row.pro === true ? (
                      <span className="text-emerald-400 text-xs font-bold">✓</span>
                    ) : (
                      <span className="text-xs font-semibold text-zinc-100 tabular-nums">{row.pro}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-zinc-100 font-mono">₦9,999</span>
              <span className="text-sm text-zinc-500">/ month</span>
            </div>

            {/* CTA */}
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing || !email}
              size="lg"
              className="w-full font-semibold"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Upgrade to Pro
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
