import { useState, useEffect, useCallback } from "react";
import { fetchAccountSummary } from "@/api/account.api";
import {
  startCheckout,
  openPortal,
  cancelSubscription,
  submitCancelFeedback,
} from "@/api/stripe.api";
import { normalizeSummary } from "@/utils/account";
import type { NormalizedSummary } from "@/types/account";

export function useAccountSummary(userId: string | null, email: string | null) {
  const [summary, setSummary] = useState<NormalizedSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const raw = await fetchAccountSummary(userId);
      setSummary(normalizeSummary(raw));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    summary,
    loading,
    reload: load,
    onUpgrade: () => startCheckout({ userId: userId!, email: email! }),
    onPortal: () => openPortal({ userId: userId!, email: email! }),
    onCancel: () => cancelSubscription({ userId: userId! }),
    onFeedback: (reason: string, other?: string) =>
      submitCancelFeedback({ userId, reason, other }),
  };
}
