import { create } from 'zustand';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { type SubscriptionData, DEFAULT_SUBSCRIPTION } from '@/services/paystack';

interface SubscriptionStore {
  subscription: SubscriptionData;
  isLoading: boolean;
  _activeUid: string | null;
  _cleanup: (() => void) | null;
  /** Start listening to the user's subscription field in Firestore (singleton per uid) */
  listen: (uid: string) => () => void;
  /** Reset to default when user logs out */
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscription: DEFAULT_SUBSCRIPTION,
  isLoading: true,
  _activeUid: null,
  _cleanup: null,

  listen: (uid: string) => {
    // Already listening for this uid — no-op
    if (get()._activeUid === uid) {
      return () => {};
    }

    // Clean up any previous listener
    get()._cleanup?.();

    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        set({
          subscription: {
            tier: data.subscription?.tier ?? 'free',
            paystackCustomerCode: data.subscription?.paystackCustomerCode,
            paystackSubscriptionCode: data.subscription?.paystackSubscriptionCode,
            status: data.subscription?.status ?? 'none',
            currentPeriodEnd: data.subscription?.currentPeriodEnd,
          },
          isLoading: false,
        });
      } else {
        set({ subscription: DEFAULT_SUBSCRIPTION, isLoading: false });
      }
    });

    set({ _activeUid: uid, _cleanup: unsubscribe });

    // Caller doesn't own the lifecycle — listener persists until reset()
    return () => {};
  },

  reset: () => {
    get()._cleanup?.();
    set({ subscription: DEFAULT_SUBSCRIPTION, isLoading: true, _activeUid: null, _cleanup: null });
  },
}));
