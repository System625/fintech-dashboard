# Phase 2: Core Features — End to End ✅ COMPLETED (2026-04-03)

> **Roadmap ref**: Phase 2 in [`IMPLEMENTATION_ROADMAP.md`](../IMPLEMENTATION_ROADMAP.md)
> **Prereq**: Phase 1 (Firestore integration) complete
> **Goal**: Make every feature work with real user data.
> **Estimated scope**: 3-4 sessions

---

## Context

After Phase 1, Firestore is connected and CRUD operations work. But the page components still need updating to support real user workflows — creating, editing, deleting, filtering, and exporting data.

## Session 1: Accounts & Transactions

### Accounts
- [ ] "Add Account" form — name, type (checking/savings/investment/credit), initial balance
- [ ] Account cards show real balances from Firestore
- [ ] Edit account name/type
- [ ] Delete account (with confirmation — warn if it has transactions)

### Transaction Entry
- [ ] "Add Transaction" modal/form accessible from dashboard + transactions page
- [ ] Fields: amount, description, category (dropdown with common categories + custom), date, type (income/expense), account
- [ ] On submit: write to Firestore, update account balance atomically (Firestore batch write)
- [ ] Success toast with undo option (soft delete within 5 seconds)

### Transaction List
- [ ] Paginated list (20 per page) with cursor-based pagination from Firestore
- [ ] Filter by: date range, category, type (income/expense), account
- [ ] Sort by: date (default newest first), amount
- [ ] Search by description text (client-side filter on loaded page)
- [ ] Edit transaction inline or via modal
- [ ] Delete transaction (updates account balance)

### CSV Export
- [ ] "Export" button on transactions page
- [ ] Generate CSV with columns: Date, Description, Category, Type, Amount, Account
- [ ] Use `Blob` + `URL.createObjectURL` for client-side download (no backend needed)
- [ ] Pro feature gate in Phase 4

## Session 2: Savings Goals

### Goal Management
- [ ] "New Goal" form: name, target amount, deadline, optional initial contribution
- [ ] Goal cards showing: name, progress bar, current/target amounts, days remaining
- [ ] "Contribute" button on each goal — enter amount, deducts from chosen account
- [ ] Contribution is recorded as a transaction (type: "transfer", category: "Savings")
- [ ] Edit goal (name, target, deadline)
- [ ] Delete goal (with confirmation)

### Goal Progress
- [ ] Progress percentage = (currentAmount / targetAmount) * 100
- [ ] Color-coded progress: red (<25%), yellow (25-50%), blue (50-75%), green (75%+)
- [ ] "On track" indicator — based on current pace vs. deadline
- [ ] Goal completion: celebratory animation + mark as complete

### Savings Charts
- [ ] Total savings over time (aggregate all goals)
- [ ] Individual goal growth chart
- [ ] Data sourced from transaction history filtered to savings category

## Session 3: Bills & Recurring

### Bill Management
- [ ] "Add Bill" form: name, amount, due date, frequency (monthly/weekly/yearly/once), category
- [ ] Bill list sorted by next due date
- [ ] "Mark as Paid" — records a transaction and advances due date to next occurrence
- [ ] Edit and delete bills

### Dashboard Widget
- [ ] "Upcoming Bills" card showing next 5 bills by due date
- [ ] Overdue bills highlighted in red
- [ ] Total upcoming bills amount for the month

## Session 4: Dashboard Overview (Real Data)

### Metrics Cards
- [ ] **Total Balance**: Sum of all account balances (real-time from Firestore)
- [ ] **Monthly Spend**: Sum of expense transactions this calendar month
- [ ] **Savings Rate**: (Income - Expenses) / Income * 100 for current month
- [ ] **Upcoming Bills**: Total amount of unpaid bills due this month

### Financial Overview Chart
- [ ] Line chart: income vs. expenses over last 6 months
- [ ] Data aggregated from transaction collection grouped by month
- [ ] Toggleable between income, expenses, and net

### Quick Actions
- [ ] "Add Transaction" — opens transaction form
- [ ] "Transfer" — move money between accounts (creates 2 transactions atomically)
- [ ] "New Goal" — opens savings goal form

### Recent Transactions
- [ ] Last 5 transactions from Firestore, ordered by date desc
- [ ] "View All" links to transactions page

## Architecture Notes

### Atomic Operations
Account balance updates MUST use Firestore transactions (the database kind) to prevent race conditions:

```typescript
// When adding a transaction:
await runTransaction(db, async (transaction) => {
  const accountRef = doc(db, `users/${uid}/accounts/${accountId}`);
  const accountSnap = await transaction.get(accountRef);
  const currentBalance = accountSnap.data().balance;
  const newBalance = currentBalance + amount; // negative for expenses

  transaction.update(accountRef, { balance: newBalance });
  transaction.set(newTxRef, transactionData);
});
```

### Category System
Start with a fixed list of categories (no custom category CRUD needed yet):
```
Income: Salary, Freelance, Investment, Gift, Other Income
Expense: Food, Transport, Housing, Utilities, Entertainment,
         Shopping, Health, Education, Subscriptions, Other
Transfer: Savings, Investment
```

### Performance
- Use React Query's `staleTime: 5 * 60 * 1000` (5 min) to avoid excessive Firestore reads
- Paginate all lists (20 items per page)
- Use Firestore's `onSnapshot` only for the dashboard overview (real-time), not for list pages
