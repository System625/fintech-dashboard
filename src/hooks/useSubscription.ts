import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { TIER_LIMITS, type Tier, type Feature, type LimitedResource } from '@/services/paystack';

/** Starts the Firestore listener and returns subscription state. */
export function useSubscription() {
  const uid = useAuthStore((s) => s.currentUser?.uid);
  const { subscription, isLoading, listen, reset } = useSubscriptionStore();

  useEffect(() => {
    if (!uid) {
      reset();
      return;
    }
    const unsubscribe = listen(uid);
    return unsubscribe;
  }, [uid, listen, reset]);

  const tier: Tier = subscription.tier;
  const isProUser = tier === 'pro' && subscription.status === 'active';
  const limits = TIER_LIMITS[tier];

  return { subscription, tier, isProUser, limits, isLoading };
}

/** Check if a boolean feature (charts, csv, analytics) is available. */
export function useFeatureGate(feature: Feature) {
  const { isProUser, limits } = useSubscription();
  const canUse = limits[feature];
  return { canUse, needsUpgrade: !canUse, isProUser };
}

/** Check usage against limits for countable resources. */
export function useResourceLimit(resource: LimitedResource, currentCount: number) {
  const { limits, isProUser } = useSubscription();
  const limit = limits[resource];
  const remaining = limit === Infinity ? Infinity : limit - currentCount;
  const atLimit = remaining <= 0;
  const nearLimit = limit !== Infinity && currentCount >= limit * 0.9;

  return {
    used: currentCount,
    limit,
    remaining,
    atLimit,
    nearLimit,
    isProUser,
    percentUsed: limit === Infinity ? 0 : Math.round((currentCount / limit) * 100),
  };
}
