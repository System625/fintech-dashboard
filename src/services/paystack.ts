// ─── Paystack Client-Side Integration ─────────────────────────────────────────
// Paystack Inline JS handles checkout via a popup — no redirect needed.
// Webhook (server-side) writes subscription status to Firestore.
// Client only reads from Firestore — never trusts client-side payment state.

export interface PaystackPlan {
  name: string;
  planCode: string;
  amount: number; // in kobo (NGN * 100)
  interval: 'monthly' | 'annually';
  currency: 'NGN';
}

export interface SubscriptionData {
  tier: 'free' | 'pro';
  paystackCustomerCode?: string;
  paystackSubscriptionCode?: string;
  status: 'active' | 'past_due' | 'cancelled' | 'none';
  currentPeriodEnd?: string;
}

// Tier limits
export const TIER_LIMITS = {
  free: {
    accounts: 1,
    transactionsPerMonth: 50,
    savingsGoals: 2,
    bills: 3,
    advancedCharts: false,
    csvExport: false,
    analytics: false,
  },
  pro: {
    accounts: Infinity,
    transactionsPerMonth: Infinity,
    savingsGoals: Infinity,
    bills: Infinity,
    advancedCharts: true,
    csvExport: true,
    analytics: true,
  },
} as const;

export type Tier = keyof typeof TIER_LIMITS;
export type TierLimits = (typeof TIER_LIMITS)[Tier];

export type Feature = 'advancedCharts' | 'csvExport' | 'analytics';
export type LimitedResource = 'accounts' | 'transactionsPerMonth' | 'savingsGoals' | 'bills';

// Pro plan config — update planCode after creating it in Paystack dashboard
export const PRO_PLAN: PaystackPlan = {
  name: 'Punk Pro',
  planCode: import.meta.env.VITE_PAYSTACK_PLAN_CODE || 'PLN_xxxxx',
  amount: 999900, // ₦9,999/month in kobo
  interval: 'monthly',
  currency: 'NGN',
};

// ─── Paystack Inline Checkout ─────────────────────────────────────────────────

interface PaystackInlineOptions {
  email: string;
  plan: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

/**
 * Opens Paystack inline checkout popup for subscription.
 * Requires the Paystack inline script to be loaded in index.html.
 */
export function openPaystackCheckout({ email, plan, metadata, onSuccess, onClose }: PaystackInlineOptions) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    console.error('VITE_PAYSTACK_PUBLIC_KEY is not set');
    return;
  }

  // @ts-expect-error — PaystackPop is loaded via script tag
  const handler = PaystackPop.setup({
    key: publicKey,
    email,
    plan,
    metadata: {
      custom_fields: [],
      ...metadata,
    },
    callback: (response: { reference: string }) => {
      onSuccess(response.reference);
    },
    onClose,
  });

  handler.openIframe();
}

// Default subscription state for new/free users
export const DEFAULT_SUBSCRIPTION: SubscriptionData = {
  tier: 'free',
  status: 'none',
};
