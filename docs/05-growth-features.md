# Phase 5: Growth & Retention Features

> **Roadmap ref**: Phase 5 in [`IMPLEMENTATION_ROADMAP.md`](../IMPLEMENTATION_ROADMAP.md)
> **Prereq**: Phase 4 (monetization live, revenue flowing)
> **Goal**: Features that improve retention and organic growth.
> **Estimated scope**: 2-3 sessions

---

## Context

At this point the app has real data, working features, and paying users. These features increase stickiness and reduce churn.

## Session 1: PWA & Offline Support

### Progressive Web App
- [ ] Add `manifest.json` with Budgetpunk branding (name, icons, theme color, display: standalone)
- [ ] Register service worker using Workbox (via `vite-plugin-pwa` — free)
- [ ] Cache static assets (HTML, CSS, JS, fonts) for offline shell
- [ ] Cache last-fetched Firestore data in IndexedDB for offline viewing
- [ ] "Add to Home Screen" prompt after 3rd visit
- [ ] Offline indicator banner when network is unavailable

### Install: `vite-plugin-pwa`
```bash
npm install -D vite-plugin-pwa
```

Config in `vite.config.ts`:
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Budgetpunk',
        short_name: 'Budgetpunk',
        theme_color: '#00F0FF',
        background_color: '#0A0A0A',
        display: 'standalone',
        icons: [/* ... */]
      }
    })
  ]
});
```

**Cost**: Free. Workbox and vite-plugin-pwa are open source.

## Session 2: Notifications & Reminders

### Firebase Cloud Messaging (FCM)
- [ ] Set up FCM in Firebase Console (free, unlimited messages)
- [ ] Request notification permission from user (after onboarding, not on first visit)
- [ ] Store FCM token in Firestore `users/{uid}.fcmTokens[]`

### Notification Types
- [ ] **Bill reminders**: 1 day before due date, day of due date
- [ ] **Savings milestones**: 25%, 50%, 75%, 100% of goal reached
- [ ] **Weekly summary**: Total spent, total saved, net change (sent Monday morning)
- [ ] **Overspending alert**: When spending in a category exceeds monthly average by 50%

### Implementation
Notifications triggered by Firebase Cloud Functions (scheduled + Firestore triggers):
- **Scheduled function** (daily): Check all users' bills, send reminders for tomorrow's due dates
- **Firestore trigger**: On savings goal update, check if milestone crossed -> send notification
- **Scheduled function** (weekly): Aggregate transactions and send summary

**Cost**: Free. FCM is free for unlimited messages. Cloud Functions free tier: 2M invocations/month.

## Session 3: Analytics & Insights

### Spending Analytics (Pro Feature)
- [ ] **Monthly breakdown**: Pie chart of spending by category
- [ ] **Trend lines**: Monthly spending over last 6-12 months per category
- [ ] **Comparison**: "You spent 23% more on Food this month vs. last month"
- [ ] **Top expenses**: Largest individual transactions this month
- [ ] **Income vs. Expense**: Monthly bar chart comparison

### Savings Analytics
- [ ] **Savings rate trend**: Line chart over months
- [ ] **Goal pace indicator**: "At this rate, you'll reach [goal] by [date]"
- [ ] **Net worth over time**: Sum of all accounts, plotted monthly

### Implementation Notes
- All analytics computed client-side from Firestore transaction data
- Use React Query to cache aggregated results
- Heavy computations in a Web Worker if needed (unlikely for <10K transactions)
- These are Pro-tier features (gated in Phase 4)

## Data Import (Bonus)

### CSV Import for Transactions
- [ ] "Import Transactions" button on transactions page (Pro feature)
- [ ] Accept CSV file upload
- [ ] Parse common formats: Date, Description, Amount, Category
- [ ] Preview parsed data before confirming import
- [ ] Duplicate detection: skip transactions with same date + amount + description
- [ ] Batch write to Firestore (max 500 per batch)

### Supported CSV Formats
Start with generic format, expand later:
```csv
Date,Description,Amount,Category,Type
2026-03-15,Grocery Store,-45.50,Food,expense
2026-03-14,Salary,3500.00,Salary,income
```

Use `papaparse` (free, 3KB gzipped) for CSV parsing:
```bash
npm install papaparse
npm install -D @types/papaparse
```

## Tools Summary

| Tool | Purpose | Cost |
|---|---|---|
| vite-plugin-pwa | PWA support | Free |
| Workbox | Service worker | Free |
| Firebase Cloud Messaging | Push notifications | Free |
| Firebase Cloud Functions | Scheduled notifications | Free tier |
| papaparse | CSV parsing | Free |

All free. Zero incremental cost.
