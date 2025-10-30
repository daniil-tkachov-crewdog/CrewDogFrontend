import { FREE_CAP, PRO_CAP } from "@/constants/account";
import type { SummaryRaw, NormalizedSummary } from "@/types/account";

export function num(v: any, d = 0) {
  const n = typeof v === "string" ? Number(v.trim()) : Number(v);
  return Number.isFinite(n) ? n : d;
}

export function normalizeSummary(s?: SummaryRaw): NormalizedSummary {
  const unlimited =
    s?.unlimited === true ||
    s?.isAdmin === true ||
    s?.creditsRemaining === null;

  const status = s?.status || "none";
  const pro = ["active", "trialing", "past_due"].includes(status);

  const cap = num(s?.searchCap, num(s?.cap, pro ? PRO_CAP : FREE_CAP));
  const used = num(s?.used, 0);
  const remaining = unlimited ? null : Math.max(0, cap - used);

  return {
    status,
    pro,
    cap,
    used,
    remaining,
    renewalDate: s?.renewalDate ?? null,
    unlimited,
    price: s?.price,
    cancelAtPeriodEnd: !!s?.cancelAtPeriodEnd,
  };
}
