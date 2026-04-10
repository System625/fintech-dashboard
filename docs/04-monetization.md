# Phase 4: Monetization

> **Roadmap ref**: Phase 4 in [`IMPLEMENTATION_ROADMAP.md`](../IMPLEMENTATION_ROADMAP.md)
> **Prereq**: Phase 2 (core features) + Phase 3 (UI revamp) ideally complete
> **Goal**: Implement Paystack subscriptions and feature gating.
> **Estimated scope**: 2-3 sessions

---

## Context

The app has real features working with Firestore. Users can track transactions, savings goals, and bills. Now we gate advanced features behind a paid tier to generate revenue.

**Payment processor: Paystack** — chosen for Nigerian market focus. Uses Inline JS popup (no redirect). Webhook (server-side) writes subscription status to Firestore; client only reads from Firestore.

## Tier Definitions

### Free — Punk Starter
| Feature | Limit |
|---|---|
| Accounts | 1 |
| Transactions/month | 50 |
| Savings goals | 2 |
| Bills tracking | 3 |
| Charts | Basic (monthly overview) |
| CSV export | No |
| Analytics | No |

### Pro — Punk Pro (₦9,999/month)
| Feature | Limit |
|---|---|
| Accounts | Unlimited |
| Transactions/month | Unlimited |
| Savings goals | Unlimited |
| Bills tracking | Unlimited |
| Charts | Advanced (all chart types) |
| CSV export | Yes |
| Analytics | Full spending insights |
| Priority support | Yes |

## Session 1: Paystack Setup

### 1. Paystack Account & Plans
- [ ] Create Paystack account (free)
- [ ] Create Plan: "Punk Pro" — ₦9,999/month recurring
- [ ] Note the Plan Code (e.g. `PLN_xxxxx`) for checkout integration
- [ ] Set `VITE_PAYSTACK_PUBLIC_KEY` and `VITE_PAYSTACK_PLAN_CODE` in `.env`

### 2. Paystack Inline Checkout (Client-Side)
- [x] `src/services/paystack.ts` — `openPaystackCheckout()` implemented
- [ ] Add Paystack Inline JS script to `index.html`: `https://js.paystack.co/v1/inline.js`
- [ ] Call `openPaystackCheckout` with user email + plan code on upgrade CTA
- [ ] `onSuccess(reference)` — show "verifying..." state; Firestore update comes via webhook

### 3. Webhook Handler (Server-Side)
This MUST be server-side. Recommended: **Firebase Cloud Function** (already in Firebase ecosystem, free tier: 2M invocations/month).

Paystack webhook events to handle:
```
charge.success          -> verify reference, activate subscription
subscription.create     -> record paystackSubscriptionCode
subscription.disable    -> downgrade to free
invoice.payment_failed  -> flag account, show warning
```

On each event, update Firestore:
```
users/{uid}.subscription = {
  tier: "pro",
  paystackCustomerCode: "CUS_xxx",
  paystackSubscriptionCode: "SUB_xxx",
  status: "active" | "past_due" | "cancelled" | "none",
  currentPeriodEnd: timestamp
}
```

### 4. Subscription Management
- [ ] Paystack Customer Portal or custom "Manage Subscription" page
- [ ] Link from Profile/Settings: "Manage Subscription"
- [ ] Cancel flow calls Paystack API server-side to disable subscription

## Session 2: Feature Gating

### 5. Subscription Hook
```typescript
// src/hooks/useSubscription.ts
export function useSubscription() {
  // Reads from useSubscriptionStore (Firestore listener)
  // Return: { tier, isProUser, limits, isLoading }
}
```

### 6. Usage Counters
```typescript
// src/hooks/useUsageLimits.ts
export function useUsageLimits() {
  // Count transactions this month
  // Count active accounts
  // Count active savings goals
  // Count active bills
  // Return: { transactions: { used, limit }, accounts: { used, limit }, ... }
}
```

### 7. Gating Components
```typescript
// Wrapper that shows upgrade prompt when feature is locked
<ProFeature feature="csvExport">
  <ExportButton />
</ProFeature>

// Hook for conditional logic
const { canUse, showUpgrade } = useFeatureGate("unlimitedTransactions");
```

### 8. Upgrade Prompts
- [ ] Soft limit warning: "You've used 45/50 transactions this month" (at 90%)
- [ ] Hard limit block: "Upgrade to Pro for unlimited transactions" with CTA
- [ ] Upgrade prompt on locked features (CSV export, advanced analytics)
- [ ] Style: cyberpunk-themed modal with neon CTA button

### 9. Landing Page Updates
- [ ] Update PricingSection with real Paystack Checkout integration
- [ ] Show current tier features accurately
- [ ] Add annual pricing option (discount) if desired

## Session 3: Testing & Polish

### 10. Paystack Test Mode
- [ ] All development uses Paystack test mode (no real charges)
- [ ] Test key: use `VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx`
- [ ] Test card: `4084 0840 8408 4081` (Paystack test card)
- [ ] Test the full flow: signup -> use free -> hit limit -> upgrade -> features unlock
- [ ] Test cancellation -> features lock back to free limits
- [ ] Test payment failure -> grace period handling

### 11. Edge Cases
- [ ] User downgrades but has more data than free tier allows -> read-only access to existing data, can't create new
- [ ] Webhook delivery failure -> Paystack retries, add manual "Restore Purchase" button
- [ ] User deletes account -> cancel Paystack subscription via webhook or cleanup function

## Cost

| Item | Cost |
|---|---|
| Paystack | Free to set up |
| Paystack per transaction | 1.5% + ₦100 (capped at ₦2,000) |
| Firebase Cloud Function | Free (2M invocations/month) |
| Revenue per sub | ~₦9,849/month after Paystack fees |

## Security Notes

- NEVER verify subscription status client-side only. Always read from Firestore (written by server-side webhook).
- Paystack webhook secret must be stored as environment variable, never in client code.
- Always verify `charge.success` webhook by re-fetching the transaction from Paystack API before activating.
