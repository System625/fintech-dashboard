import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PricingCard } from '@/components/ui/pricing-card';

interface PricingSectionProps {
  onGetStarted: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => {
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
            title="Budgetpunk Pro"
            description="Everything you need to transform your financial future."
            price={12}
            originalPrice={24}
            features={[
              {
                title: "Core Features",
                items: [
                  "AI-Powered Budget Tracking",
                  "Smart Investment Recommendations",
                  "Advanced Analytics Dashboard",
                  "Goal Setting & Progress Tracking",
                  "Bill Reminders & Auto-Pay",
                  "Credit Score Monitoring",
                  "Tax Optimization Tools",
                  "Multi-Account Management"
                ],
              },
              {
                title: "Premium Benefits",
                items: [
                  "24/7 Priority Support",
                  "Personal Finance Consultation",
                  "Exclusive Investment Insights",
                  "Early Feature Access",
                  "Mobile & Web App Access",
                  "Bank-Level Security",
                  "FDIC Insured Accounts",
                  "No Hidden Fees"
                ],
              },
            ]}
            buttonText="Start Your Financial Journey"
            onButtonClick={onGetStarted}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;