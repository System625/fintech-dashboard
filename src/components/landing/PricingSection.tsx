import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { PricingCard } from '@/components/ui/pricing-card';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSubscription } from '@/hooks/useSubscription';
import { openPaystackCheckout, PRO_PLAN } from '@/services/paystack';
import { toast } from 'sonner';

interface PricingSectionProps {
  onGetStarted: () => void;
}

const PRO_FEATURES = [
  {
    title: 'Core Features',
    items: [
      'Unlimited accounts',
      'Unlimited transactions',
      'Unlimited savings goals',
      'Unlimited bills tracking',
      'All charts — monthly, categories, portfolio',
      'Advanced analytics & spending insights',
      'CSV export',
    ],
  },
  {
    title: 'Pro Benefits',
    items: [
      'Priority support',
      'Early access to new features',
      'Bank-level security',
      'Mobile & web access',
      'No hidden fees',
    ],
  },
];

const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuthStore();
  const { isProUser } = useSubscription();

  const handleProCTA = () => {
    if (!currentUser) {
      onGetStarted();
      return;
    }
    if (isProUser) return;

    const { email, uid } = currentUser;
    if (!email || !uid) return;

    setIsProcessing(true);
    openPaystackCheckout({
      email,
      plan: PRO_PLAN.planCode,
      metadata: { uid },
      onSuccess: (reference) => {
        setIsProcessing(false);
        toast.success('Payment received!', {
          description: `Ref: ${reference} — Pro features activate shortly.`,
        });
      },
      onClose: () => setIsProcessing(false),
    });
  };

  const buttonText = isProcessing
    ? 'Processing...'
    : isProUser
    ? 'Current Plan'
    : currentUser
    ? 'Upgrade to Punk Pro'
    : 'Get Started';

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h3 className="text-2xl md:text-5xl font-bold mb-4">
            Simple, transparent
            <span className="block text-brand">pricing for everyone</span>
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One comprehensive plan with everything you need to manage, save, and grow your wealth.
          </p>
        </div>

        <div className="flex justify-center">
          <PricingCard
            title="Punk Pro"
            description="Unlimited access to every Budgetpunk feature."
            price={9999}
            currencySymbol="₦"
            priceLabel="per month · cancel anytime"
            features={PRO_FEATURES}
            buttonText={buttonText}
            onButtonClick={handleProCTA}
            buttonDisabled={isProcessing || isProUser}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          ~₦9,849/month after Paystack fees (1.5% + ₦100, capped at ₦2,000)
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
