import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import {
  BarChart3,
  PiggyBank,
  Shield,
  Smartphone,
  CreditCard
} from 'lucide-react';

const featureItems: BentoItem[] = [
  {
    title: "Smart Analytics",
    meta: "AI-powered",
    description: "Get personalized recommendations, spending insights, and investment opportunities powered by advanced machine learning algorithms.",
    icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["AI", "Insights", "ML", "Reports"],
    colSpan: 2,
    hasPersistentHover: true,
    cta: "Explore Analytics →"
  },
  {
    title: "Goal Tracking",
    meta: "75% complete",
    description: "Set and achieve financial goals with visual progress tracking and milestone celebrations.",
    icon: <PiggyBank className="w-4 h-4 text-green-500" />,
    status: "Active",
    tags: ["Goals", "Progress", "Savings"],
    cta: "Set Goals →"
  },
  {
    title: "Bank Security",
    meta: "256-bit encryption",
    description: "Enterprise-grade security with biometric authentication and real-time fraud protection.",
    icon: <Shield className="w-4 h-4 text-blue-600" />,
    status: "Secure",
    tags: ["Security", "Encryption", "Biometric"],
    cta: "Learn More →"
  },
  {
    title: "Mobile First",
    meta: "iOS & Android",
    description: "Native apps with offline capability, push notifications, and seamless synchronization.",
    icon: <Smartphone className="w-4 h-4 text-purple-500" />,
    status: "Available",
    tags: ["Mobile", "Offline", "Native"],
    cta: "Download →"
  },
  {
    title: "Smart Cards",
    meta: "Contactless",
    description: "Real-time spending controls, rewards program, and instant transaction notifications.",
    icon: <CreditCard className="w-4 h-4 text-orange-500" />,
    status: "New",
    tags: ["Cards", "Rewards", "Controls"],
    cta: "Order Card →"
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 space-y-6">
        <Badge variant="secondary" className="mb-4">Features</Badge>
        
        <h3 className="text-2xl md:text-5xl font-bold mb-4">
          Everything you need to
          <span className="block text-brand">
            manage your money
          </span>
        </h3>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful tools designed to help you save, invest, and grow your wealth intelligently.
        </p>
      </div>

      <BentoGrid items={featureItems} />
    </section>
  );
};

export default FeaturesGrid;