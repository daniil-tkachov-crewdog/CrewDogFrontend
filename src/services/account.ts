// src/services/account.ts
import { API_BASE } from "@/lib/config";
import { getIdentity } from "@/lib/supabase";

export type RawSummary = {
  status?: string;
  unlimited?: boolean;
  isAdmin?: boolean;
  creditsRemaining?: number | null;
  remainingCredits?: number | null;
  searchCap?: number;
  cap?: number;
  searches?: { cap?: number; used?: number; remaining?: number | null };
  quota?: { cap?: number; used?: number; remaining?: number | null };
  used?: number;
  renewalDate?: string | null;
  cancelAtPeriodEnd?: boolean;
  price?: { amount: number; currency: string; interval: "month" | "year" };
  /** backend sometimes sends either of these */
  freeTryUsed?: boolean;
  has_claimed_free_try?: boolean;
};

export type NormalizedSummary = {
  pro: boolean;
  unlimited: boolean;
  isAdmin: boolean;
  cap: number;
  used: number;
  remaining: number | null;
  renewalDate: string | null;
  cancelAtPeriodEnd: boolean;
  price?:
    | { amount: number; currency: string; interval: "month" | "year" }
    | undefined;
  /** optional: handy for debugging/labels */
  status?: string;
};

const FREE_CAP = 3;
const PRO_CAP = 25;
const num = (v: any, d = NaN) => (Number.isFinite(Number(v)) ? Number(v) : d);

export function normalizeSummary(s?: RawSummary): NormalizedSummary {
  const isAdmin = s?.isAdmin === true;
  const unlimited =
    isAdmin || s?.unlimited === true || s?.creditsRemaining === null;

  const status = String(s?.status || "none").toLowerCase();
  const pro = ["active", "trialing", "past_due", "unpaid"].includes(status);

  const capCandidates = [
    s?.searchCap,
    s?.cap,
    s?.searches?.cap,
    s?.quota?.cap,
    pro ? PRO_CAP : FREE_CAP,
  ];
  const cap =
    capCandidates.map((v) => num(v)).find(Number.isFinite) ??
    (pro ? PRO_CAP : FREE_CAP);

  let remaining = [
    s?.creditsRemaining,
    s?.remainingCredits,
    s?.searches?.remaining,
    s?.quota?.remaining,
  ]
    .map((v) => num(v))
    .find(Number.isFinite);

  let used = [s?.used, s?.searches?.used, s?.quota?.used]
    .map((v) => num(v))
    .find(Number.isFinite);

  // derive the missing side if only one is present
  if (
    !Number.isFinite(used) &&
    Number.isFinite(cap) &&
    Number.isFinite(remaining!)
  ) {
    used = Math.max(0, cap - (remaining as number));
  }
  if (
    !Number.isFinite(remaining) &&
    Number.isFinite(cap) &&
    Number.isFinite(used!)
  ) {
    remaining = Math.max(0, cap - (used as number));
  }

  // 🔓 Free-plan “first run” override (parity with old site):
  // if user is NOT pro, NOT unlimited, and backend says freeTryUsed === false,
  // force the UI to 0/3 so brand-new users never start at 3/3.
  const freeTryUsed = s?.freeTryUsed ?? s?.has_claimed_free_try;
  if (!unlimited && !pro && freeTryUsed === false) {
    used = 0;
    remaining = FREE_CAP;
  }

  return {
    pro,
    unlimited,
    isAdmin,
    cap,
    used: Math.max(0, Number.isFinite(used) ? (used as number) : 0),
    remaining: unlimited
      ? null
      : Math.max(0, Number.isFinite(remaining) ? (remaining as number) : cap),
    renewalDate: s?.renewalDate || null,
    cancelAtPeriodEnd: !!s?.cancelAtPeriodEnd,
    price: s?.price,
    status: s?.status,
  };
}

export async function fetchAccountSummary(): Promise<NormalizedSummary> {
  const { userId } = await getIdentity();
  if (!userId) return normalizeSummary({ status: "none", creditsRemaining: 3 });

  const res = await fetch(
    `${API_BASE.replace(/\/$/, "")}/account/summary/${userId}`,
    { credentials: "include" }
  );
  if (!res.ok) return normalizeSummary({ status: "none", creditsRemaining: 3 });
  return normalizeSummary(await res.json());
}

/** =========================
 * NEW: consumeOneCredit
 * ========================= */
export async function consumeOneCredit(userId?: string) {
  if (!userId) return;
  await fetch(`${API_BASE.replace(/\/$/, "")}/account/consume`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId}),
  });
}
