import { useState } from 'react';
import { AlertTriangle, Ban, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from './UpgradeModal';
import type { LimitedResource } from '@/services/paystack';

const RESOURCE_LABELS: Record<LimitedResource, string> = {
  accounts: 'accounts',
  transactionsPerMonth: 'transactions this month',
  savingsGoals: 'savings goals',
  bills: 'bills',
};

interface UsageLimitWarningProps {
  resource: LimitedResource;
  used: number;
  limit: number;
}

/** Shows a warning when nearing or at a resource limit. */
export function UsageLimitWarning({ resource, used, limit }: UsageLimitWarningProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (limit === Infinity) return null;

  const percentage = Math.round((used / limit) * 100);
  const label = RESOURCE_LABELS[resource];
  const atLimit = used >= limit;
  const nearLimit = percentage >= 90;

  if (!nearLimit && !atLimit) return null;

  return (
    <>
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
          atLimit
            ? 'bg-destructive/10 border border-destructive/20 text-destructive'
            : 'bg-warning/10 border border-warning/20 text-warning'
        }`}
      >
        {atLimit ? <Ban className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
        <span className="flex-1">
          {atLimit
            ? `You've reached your limit of ${limit} ${label}. Upgrade for unlimited.`
            : `You've used ${used}/${limit} ${label}.`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowUpgrade(true)}
          className="shrink-0 gap-1 text-brand hover:text-brand"
        >
          <Zap className="h-3 w-3" />
          Upgrade
        </Button>
      </div>
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        feature={`unlimited ${label}`}
      />
    </>
  );
}
