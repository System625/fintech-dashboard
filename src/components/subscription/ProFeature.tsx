import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useFeatureGate } from '@/hooks/useSubscription';
import { UpgradeModal } from './UpgradeModal';
import type { Feature } from '@/services/paystack';

interface ProFeatureProps {
  feature: Feature;
  label?: string;
  children: React.ReactNode;
  /** If true, show children with an overlay instead of replacing them entirely */
  overlay?: boolean;
}

/** Wraps a feature that requires Pro. Shows upgrade prompt if locked. */
export function ProFeature({ feature, label, children, overlay = false }: ProFeatureProps) {
  const { canUse } = useFeatureGate(feature);
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (canUse) return <>{children}</>;

  const featureLabel = label || feature;

  if (overlay) {
    return (
      <div className="relative">
        <div className="pointer-events-none opacity-40 blur-[1px] select-none">
          {children}
        </div>
        <button
          onClick={() => setShowUpgrade(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-background/70 transition-colors"
        >
          <Lock className="h-5 w-5 text-brand" />
          <span className="text-sm font-medium text-brand">Unlock {featureLabel}</span>
        </button>
        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} feature={featureLabel} />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowUpgrade(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-brand/30 bg-brand/5 hover:bg-brand/10 transition-colors cursor-pointer text-sm text-brand"
      >
        <Lock className="h-4 w-4" />
        <span>Upgrade to unlock {featureLabel}</span>
      </button>
      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} feature={featureLabel} />
    </>
  );
}
