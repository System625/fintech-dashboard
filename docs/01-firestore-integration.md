# Phase 1: Firestore Backend Integration ✅ COMPLETED (2026-04-03)

> **Roadmap ref**: Phase 1 in [`IMPLEMENTATION_ROADMAP.md`](../IMPLEMENTATION_ROADMAP.md)
> **Prereq**: Phase 0 (cleanup) complete
> **Goal**: Replace MSW mock data with real Firestore persistence.
> **Estimated scope**: 2-3 sessions

---

## Context

Firebase project `fintech-dashboard-6c0f1` is active with Auth already working. No Firestore database exists yet. The Firebase MCP tools are available for creating the DB and managing collections.

Current data flow: React Query hooks -> `src/services/api.ts` -> MSW interceptor -> mock data files.

Target data flow: React Query hooks -> `src/services/firestore.ts` -> Cloud Firestore -> real user data.

## Session 1: Database Setup & Data Model

### 1. Create Firestore Database

Use Firebase MCP or Firebase Console:
- Database ID: `(default)`
- Location: Choose closest region (e.g., `us-central1` or `europe-west1`)
- Mode: Production (with security rules)

### 2. Data Model

```
users/{uid}
  - email: string
  - displayName: string
  - createdAt: timestamp
  - subscription: { tier: "free" | "pro", stripeCustomerId?: string }

users/{uid}/accounts/{accountId}
  - name: string              (e.g., "Main Checking")
  - type: "checking" | "savings" | "investment" | "credit"
  - balance: number           (derived from transactions, or manually set)
  - currency: "USD"           (default, future multi-currency)
  - createdAt: timestamp

users/{uid}/transactions/{txId}
  - accountId: string         (reference to account)
  - amount: number            (positive = income, negative = expense)
  - description: string
  - category: string          (e.g., "Food", "Salary", "Transport")
  - type: "income" | "expense"
  - date: timestamp
  - createdAt: timestamp

users/{uid}/savingsGoals/{goalId}
  - name: string
  - targetAmount: number
  - currentAmount: number
  - deadline: timestamp
  - createdAt: timestamp

users/{uid}/bills/{billId}
  - name: string
  - amount: number
  - dueDate: timestamp
  - frequency: "monthly" | "weekly" | "yearly" | "once"
  - isPaid: boolean
  - category: string
  - createdAt: timestamp
```

### 3. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Firestore Indexes

Create composite indexes for common queries:
- `transactions`: `accountId` ASC + `date` DESC
- `transactions`: `category` ASC + `date` DESC
- `transactions`: `type` ASC + `date` DESC
- `bills`: `isPaid` ASC + `dueDate` ASC

## Session 2: Service Layer

### 5. Create `src/services/firestore.ts`

Typed CRUD functions for each collection:

```typescript
// Pattern for each collection:
export const transactionsService = {
  getAll(uid: string, filters?: TransactionFilters): Promise<Transaction[]>,
  getById(uid: string, txId: string): Promise<Transaction>,
  create(uid: string, data: CreateTransactionInput): Promise<Transaction>,
  update(uid: string, txId: string, data: Partial<Transaction>): Promise<void>,
  delete(uid: string, txId: string): Promise<void>,
}
```

Repeat for: `accountsService`, `savingsService`, `billsService`, `userService`.

### 6. Update React Query Hooks

Modify `src/hooks/useApi.ts`:
- Replace `apiRequest()` calls with Firestore service calls
- Pass `currentUser.uid` from auth store
- Keep the same query keys so caching still works
- Update mutation hooks to write to Firestore + invalidate queries

### 7. Onboarding: Seed Initial Data

When a new user signs up:
- Create `users/{uid}` document with profile info
- Create a default checking account
- Optionally show an onboarding wizard (Phase 3 concern, but seed data here)

## Session 3: Testing & MSW Fallback

### 8. MSW Dev Fallback

- Keep MSW handler files intact for dev/testing
- Guard behind `VITE_USE_MOCKS=true` environment variable
- When flag is off, React Query hits Firestore directly

### 9. Integration Testing

- Sign up a new user -> verify Firestore documents created
- Add a transaction -> verify it appears in list
- Create a savings goal -> contribute to it -> verify progress
- Delete a transaction -> verify balance updates

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Subcollections vs. root collections | Subcollections under `users/{uid}` | Simpler security rules, natural data isolation per user |
| Balance storage | Stored on account doc, updated on transaction write | Avoids re-aggregating every read. Update via Firestore transaction for consistency |
| Timestamps | Firestore `serverTimestamp()` for createdAt | Consistent, timezone-agnostic |
| Pagination | Cursor-based with `startAfter()` | Required for transaction lists that could grow large |

## Cost Estimate (Free Tier)

| Resource | Free Limit | Expected Usage (100 users) |
|---|---|---|
| Firestore reads | 50,000/day | ~5,000/day |
| Firestore writes | 20,000/day | ~2,000/day |
| Firestore storage | 1 GiB | < 50 MB |
| Auth users | 10,000 MAU | < 100 |

Comfortable within free tier for early growth.
