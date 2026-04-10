# Budgetpunk — Implementation Roadmap

> Realistic, budget-conscious plan to turn a mock-data prototype into a monetizable fintech product.
> All tools/services chosen for **free tiers** unless noted otherwise.

---

## Current State (as of April 2026)

- **Landing page**: Polished, good conversion design (pricing, testimonials, ROI calculator)
- **Auth**: Firebase Auth working (email/password, password reset)
- **Inner app**: All financial data is **MSW mock data** — nothing persists, nothing is real
- **UI**: Inner dashboard is generic/flat compared to the landing page's energy
- **Firebase project**: `fintech-dashboard-6c0f1` (active, Firestore live in `nam5`)
- **Deployment**: Vercel-ready, SPA routing configured

### What Needs to Happen (in order)

1. Replace mock data with real Firestore persistence
2. Make core features actually work end-to-end
3. Revamp the inner UI to match the landing page quality
4. Add Stripe for payments + feature gating
5. Growth features (PWA, notifications, analytics)

---

## Phase 0: Codebase Cleanup ✅ COMPLETED (2026-04-02)

**Goal**: Remove dead code and confusion before building anything new.

**Scope**:
- [x] Delete unused `AuthContext.tsx` (Zustand store is the real auth layer)
- [x] Remove MSW from production builds — keep it for dev/testing only
- [x] Clean up console.log/console.error scattered in chart components
- [x] Remove stale mock dates (hardcoded 2023 timestamps)
- [x] Delete unused `secureApi.ts` and `firebaseApi.ts` (will be rebuilt properly)
- [x] Audit and remove unused dependencies from package.json
- [x] Fix any TypeScript errors / warnings

**Free tools**: Just your editor and `npm run build`.

**Doc**: [`docs/00-cleanup.md`](docs/00-cleanup.md)

---

## Phase 1: Firestore Backend Integration ✅ COMPLETED (2026-04-03)

**Goal**: Replace MSW mock data with real Firestore collections so user data persists.

**Scope**:
- [x] Create Firestore database in `fintech-dashboard-6c0f1` project
- [x] Design Firestore data model (collections: `users`, `accounts`, `transactions`, `savingsGoals`, `bills`)
- [x] Write Firestore security rules (users can only read/write their own data)
- [x] Create a `firestore.ts` service layer with typed CRUD functions
- [x] Seed initial data on first login (onboarding flow)
- [x] Update all React Query hooks in `useApi.ts` to call Firestore instead of MSW endpoints
- [x] Keep MSW as a dev-only fallback (behind `VITE_USE_MOCKS=true` flag)
- [x] Add Firestore indexes for common queries (transactions by date, by category)

**Data model sketch**:
```
users/{uid}
  ├── accounts/{accountId}        — checking, savings, investment accounts
  ├── transactions/{txId}         — income/expense records
  ├── savingsGoals/{goalId}       — savings targets with progress
  └── bills/{billId}              — recurring bills
```

**Free tools**: Firebase Firestore free tier (1 GiB storage, 50K reads/day, 20K writes/day).

**Doc**: [`docs/01-firestore-integration.md`](docs/01-firestore-integration.md)

---

## Phase 2: Core Features — End to End ✅ COMPLETED (2026-04-03)

**Goal**: Make every feature actually work with real user data.

### 2A: Accounts & Transactions
- [x] Manual transaction entry (income/expense) with category, amount, date, notes
- [x] Transaction list with real filtering (by date range, category, type)
- [x] Account balances computed from transaction history (derived, not hardcoded)
- [x] Transaction editing and deletion
- [x] CSV export of transactions

### 2B: Savings Goals
- [x] Create savings goals with name, target amount, deadline
- [x] Contribute to goals (moves money from account to goal)
- [x] Progress tracking with real percentages
- [x] Goal completion detection + celebration UI

### 2C: Bills & Recurring
- [x] Add recurring bills (name, amount, due date, frequency)
- [x] Mark bills as paid
- [x] Upcoming bills dashboard widget with real due dates
- [x] Overdue bill alerts

### 2D: Dashboard Overview
- [x] Real total balance aggregated from accounts
- [x] Real monthly spending from transaction data
- [x] Real savings rate calculation
- [x] Charts driven by actual Firestore data
- [x] Recent transactions pulled from real collection

**Free tools**: All Firestore. Recharts stays for visualization.

**Doc**: [`docs/02-core-features.md`](docs/02-core-features.md)

---

## Phase 3: Inner UI/UX Revamp ✅ COMPLETED (2026-04-03)

**Goal**: Bring the inner dashboard up to the landing page's quality level.

**Scope**:
- [x] Redesign dashboard cards with the cyberpunk aesthetic (neon accents, glow effects, animated borders)
- [x] Improve data density — current cards waste space with large numbers and little context
- [x] Add proper empty states (no transactions yet, no savings goals, etc.)
- [x] Add error boundaries with styled fallback UI
- [x] Improve mobile experience — sidebar behavior, touch targets, card stacking
- [x] Add skeleton loaders that match the cyberpunk theme
- [x] Improve form UX — better validation feedback, inline errors, success states
- [x] Add onboarding flow for new users (guided setup of first account + goal)
- [x] Polish transitions between pages (Framer Motion page transitions)

**Free tools**: Tailwind CSS, Framer Motion (already installed), Lucide icons.

**Doc**: [`docs/03-ui-revamp.md`](docs/03-ui-revamp.md)

---

## Phase 4: Monetization

**Goal**: Implement payment infrastructure and feature gating.

### 4A: Stripe Integration
- [ ] Set up Stripe account (free until you process payments)
- [ ] Implement Stripe Checkout for subscription signup
- [ ] Handle webhook events (subscription created, cancelled, payment failed)
- [ ] Store subscription status in Firestore `users/{uid}.subscription`

### 4B: Tier System
- [ ] **Free tier (Punk Starter)**:
  - 1 account
  - 50 transactions/month
  - 2 savings goals
  - Basic dashboard charts
- [ ] **Pro tier ($9.99/month — Punk Pro)**:
  - Unlimited accounts
  - Unlimited transactions
  - Unlimited savings goals
  - CSV export
  - Advanced analytics charts
  - Bill tracking & reminders
  - Priority support

### 4C: Feature Gating
- [ ] Create a `useSubscription()` hook that reads tier from Firestore
- [ ] Gate features with `<ProFeature>` wrapper component
- [ ] Show upgrade prompts when free users hit limits
- [ ] Implement usage counters (transactions this month, active goals, etc.)

### 4D: Backend for Payments
- [ ] Firebase Cloud Function (or Vercel serverless function) for Stripe webhook handler
- [ ] Secure subscription verification (server-side, not client-only)

**Free tools**: Stripe (no monthly fee, 2.9% + 30c per transaction). Firebase Cloud Functions free tier (2M invocations/month).

**Doc**: [`docs/04-monetization.md`](docs/04-monetization.md)

---

## Phase 5: Growth & Retention

**Goal**: Features that make users come back and tell others.

### 5A: PWA & Offline
- [ ] Service worker for offline dashboard access
- [ ] App install prompt (Add to Home Screen)
- [ ] Cache recent data for offline viewing
- [ ] Background sync when connection returns

### 5B: Notifications & Reminders
- [ ] Firebase Cloud Messaging for push notifications (free)
- [ ] Bill due reminders (1 day before, day of)
- [ ] Savings goal milestone notifications
- [ ] Weekly spending summary notification

### 5C: Analytics & Insights
- [ ] Monthly spending breakdown by category (pie chart)
- [ ] Spending trends over time (line chart)
- [ ] "You spent X% more on Y this month" insights
- [ ] Savings rate trends
- [ ] Net worth tracking over time

### 5D: Data Import
- [ ] CSV import for transactions (bulk onboarding from bank exports)
- [ ] Parse common bank CSV formats
- [ ] Duplicate detection on import

**Free tools**: Workbox (PWA), Firebase Cloud Messaging (free tier: unlimited notifications).

**Doc**: [`docs/05-growth-features.md`](docs/05-growth-features.md)

---

## Phase 6: Future Opportunities (Post-Monetization)

> Only pursue these after Phase 4 is generating revenue.

- [ ] **Bank connection via Plaid** — real transaction sync (Plaid has costs, only viable with revenue)
- [ ] **AI spending insights** — use Claude API or local models for personalized advice
- [ ] **Multi-currency support** — for international users
- [ ] **Shared budgets** — couples/family financial tracking
- [ ] **Investment tracking** — connect to real market data APIs (Alpha Vantage free tier)
- [ ] **Mobile app** — React Native or Capacitor wrapper

---

## Tech Stack (Final)

| Layer | Tool | Cost |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Free |
| UI | Tailwind CSS + Shadcn/Radix | Free |
| Auth | Firebase Authentication | Free (10K MAU) |
| Database | Cloud Firestore | Free tier |
| Hosting | Vercel | Free (hobby) |
| Payments | Stripe | Free until revenue |
| Notifications | Firebase Cloud Messaging | Free |
| PWA | Workbox | Free |
| Charts | Recharts | Free |
| Forms | React Hook Form + Zod | Free |
| State | Zustand + React Query | Free |

---

## Guiding Principles

1. **No feature without persistence** — if it can't save to Firestore, don't build the UI for it
2. **Free tier first** — every tool choice must have a viable free tier
3. **Ship incrementally** — each phase should produce a deployable improvement
4. **Monetize by Phase 4** — don't gold-plate before there's revenue
5. **Real > Pretty** — working features beat polished mock screens
