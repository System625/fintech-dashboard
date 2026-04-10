import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
  Timestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Helpers ────────────────────────────────────────────────────────────────

function userCol(uid: string, col: string) {
  return collection(db, 'users', uid, col);
}

function userDoc(uid: string, col: string, id: string) {
  return doc(db, 'users', uid, col, id);
}

function toDate(ts: Timestamp | string | undefined): string {
  if (!ts) return new Date().toISOString();
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  return ts;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  email: string;
  displayName: string;
  createdAt: string;
  subscription: {
    tier: 'free' | 'pro';
    paystackCustomerCode?: string;
    paystackSubscriptionCode?: string;
    status: 'active' | 'past_due' | 'cancelled' | 'none';
    currentPeriodEnd?: string;
  };
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'once';
  isPaid: boolean;
  category: string;
  createdAt: string;
}

// Input types (omit server-managed fields)
export type CreateAccountInput = Omit<Account, 'id' | 'createdAt'>;
export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
export type CreateSavingsGoalInput = Omit<SavingsGoal, 'id' | 'createdAt'>;
export type CreateBillInput = Omit<Bill, 'id' | 'createdAt'>;

// ─── User Service ─────────────────────────────────────────────────────────────

export const userService = {
  async get(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return { ...d, createdAt: toDate(d.createdAt) } as UserProfile;
  },

  async create(uid: string, data: { email: string; displayName: string }): Promise<void> {
    const defaultSub = { tier: 'free' as const, status: 'none' as const };
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      createdAt: serverTimestamp(),
      subscription: defaultSub,
    }).catch(async () => {
      const { setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', uid), {
        ...data,
        createdAt: serverTimestamp(),
        subscription: defaultSub,
      });
    });
  },

  async updateSubscription(uid: string, subscription: UserProfile['subscription']): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { subscription });
  },
};

// ─── Accounts Service ─────────────────────────────────────────────────────────

export const accountsService = {
  async getAll(uid: string): Promise<Account[]> {
    const snap = await getDocs(userCol(uid, 'accounts'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as Account));
  },

  async getById(uid: string, accountId: string): Promise<Account | null> {
    const snap = await getDoc(userDoc(uid, 'accounts', accountId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data(), createdAt: toDate(snap.data().createdAt) } as Account;
  },

  async create(uid: string, data: CreateAccountInput): Promise<Account> {
    const ref = await addDoc(userCol(uid, 'accounts'), { ...data, createdAt: serverTimestamp() });
    return { id: ref.id, ...data, createdAt: new Date().toISOString() };
  },

  async update(uid: string, accountId: string, data: Partial<Omit<Account, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(userDoc(uid, 'accounts', accountId), data);
  },

  async delete(uid: string, accountId: string): Promise<void> {
    await deleteDoc(userDoc(uid, 'accounts', accountId));
  },
};

// ─── Transactions Service ─────────────────────────────────────────────────────

export interface TransactionFilters {
  accountId?: string;
  category?: string;
  type?: 'income' | 'expense';
  limitCount?: number;
}

export const transactionsService = {
  async getAll(uid: string, filters?: TransactionFilters): Promise<Transaction[]> {
    const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
    if (filters?.accountId) constraints.push(where('accountId', '==', filters.accountId));
    if (filters?.category) constraints.push(where('category', '==', filters.category));
    if (filters?.type) constraints.push(where('type', '==', filters.type));
    if (filters?.limitCount) constraints.push(limit(filters.limitCount));

    const snap = await getDocs(query(userCol(uid, 'transactions'), ...constraints));
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      date: toDate(d.data().date),
      createdAt: toDate(d.data().createdAt),
    } as Transaction));
  },

  async getRecent(uid: string, count = 10): Promise<Transaction[]> {
    return transactionsService.getAll(uid, { limitCount: count });
  },

  async create(uid: string, data: CreateTransactionInput): Promise<Transaction> {
    // Update account balance atomically
    const accountRef = userDoc(uid, 'accounts', data.accountId);
    const txRef = doc(userCol(uid, 'transactions'));

    await runTransaction(db, async (tx) => {
      const accountSnap = await tx.get(accountRef);
      if (!accountSnap.exists()) throw new Error('Account not found');
      const currentBalance: number = accountSnap.data().balance ?? 0;
      const delta = data.type === 'income' ? data.amount : -data.amount;
      tx.update(accountRef, { balance: currentBalance + delta });
      tx.set(txRef, { ...data, date: Timestamp.fromDate(new Date(data.date)), createdAt: serverTimestamp() });
    });

    return { id: txRef.id, ...data, createdAt: new Date().toISOString() };
  },

  async update(uid: string, txId: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(userDoc(uid, 'transactions', txId), data);
  },

  async delete(uid: string, txId: string): Promise<void> {
    await deleteDoc(userDoc(uid, 'transactions', txId));
  },

  async transfer(uid: string, fromAccountId: string, toAccountId: string, amount: number): Promise<void> {
    const fromRef = userDoc(uid, 'accounts', fromAccountId);
    const toRef = userDoc(uid, 'accounts', toAccountId);

    await runTransaction(db, async (tx) => {
      const [fromSnap, toSnap] = await Promise.all([tx.get(fromRef), tx.get(toRef)]);
      if (!fromSnap.exists()) throw new Error('Source account not found');
      if (!toSnap.exists()) throw new Error('Destination account not found');

      const fromBalance: number = fromSnap.data().balance ?? 0;
      const toBalance: number = toSnap.data().balance ?? 0;
      const now = Timestamp.now();

      tx.update(fromRef, { balance: fromBalance - amount });
      tx.update(toRef, { balance: toBalance + amount });

      tx.set(doc(userCol(uid, 'transactions')), {
        accountId: fromAccountId, amount, description: 'Transfer Out',
        category: 'Transfer', type: 'expense', date: now, createdAt: serverTimestamp(),
      });
      tx.set(doc(userCol(uid, 'transactions')), {
        accountId: toAccountId, amount, description: 'Transfer In',
        category: 'Transfer', type: 'income', date: now, createdAt: serverTimestamp(),
      });
    });
  },
};

// ─── Savings Service ─────────────────────────────────────────────────────────

export const savingsService = {
  async getAll(uid: string): Promise<SavingsGoal[]> {
    const snap = await getDocs(userCol(uid, 'savingsGoals'));
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      deadline: toDate(d.data().deadline),
      createdAt: toDate(d.data().createdAt),
    } as SavingsGoal));
  },

  async create(uid: string, data: CreateSavingsGoalInput): Promise<SavingsGoal> {
    const ref = await addDoc(userCol(uid, 'savingsGoals'), {
      ...data,
      deadline: Timestamp.fromDate(new Date(data.deadline)),
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, ...data, createdAt: new Date().toISOString() };
  },

  async update(uid: string, goalId: string, data: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(userDoc(uid, 'savingsGoals', goalId), data);
  },

  async contribute(uid: string, goalId: string, amount: number): Promise<void> {
    const ref = userDoc(uid, 'savingsGoals', goalId);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error('Savings goal not found');
      const current: number = snap.data().currentAmount ?? 0;
      tx.update(ref, { currentAmount: current + amount });
    });
  },

  async delete(uid: string, goalId: string): Promise<void> {
    await deleteDoc(userDoc(uid, 'savingsGoals', goalId));
  },
};

// ─── Bills Service ────────────────────────────────────────────────────────────

export const billsService = {
  async getAll(uid: string): Promise<Bill[]> {
    const snap = await getDocs(
      query(userCol(uid, 'bills'), orderBy('dueDate', 'asc'))
    );
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      dueDate: toDate(d.data().dueDate),
      createdAt: toDate(d.data().createdAt),
    } as Bill));
  },

  async getUpcoming(uid: string): Promise<Bill[]> {
    const snap = await getDocs(
      query(userCol(uid, 'bills'), where('isPaid', '==', false), orderBy('dueDate', 'asc'))
    );
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      dueDate: toDate(d.data().dueDate),
      createdAt: toDate(d.data().createdAt),
    } as Bill));
  },

  async create(uid: string, data: CreateBillInput): Promise<Bill> {
    const ref = await addDoc(userCol(uid, 'bills'), {
      ...data,
      dueDate: Timestamp.fromDate(new Date(data.dueDate)),
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, ...data, createdAt: new Date().toISOString() };
  },

  async update(uid: string, billId: string, data: Partial<Omit<Bill, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(userDoc(uid, 'bills', billId), data);
  },

  async markPaid(uid: string, billId: string): Promise<void> {
    const snap = await getDoc(userDoc(uid, 'bills', billId));
    if (!snap.exists()) throw new Error('Bill not found');
    const bill = snap.data();
    const frequency = bill.frequency as Bill['frequency'];

    if (frequency === 'once') {
      await updateDoc(userDoc(uid, 'bills', billId), { isPaid: true });
    } else {
      const currentDue = bill.dueDate instanceof Timestamp
        ? bill.dueDate.toDate()
        : new Date(bill.dueDate);
      const next = new Date(currentDue);
      if (frequency === 'weekly') next.setDate(next.getDate() + 7);
      else if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
      else if (frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

      await updateDoc(userDoc(uid, 'bills', billId), {
        isPaid: false,
        dueDate: Timestamp.fromDate(next),
      });
    }
  },

  async delete(uid: string, billId: string): Promise<void> {
    await deleteDoc(userDoc(uid, 'bills', billId));
  },
};
