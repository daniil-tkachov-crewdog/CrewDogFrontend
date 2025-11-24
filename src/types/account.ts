// src/types/account.ts

export type Price = {
  amount?: number;
  currency?: string;
  interval?: "month" | "year";
};

export type SummaryRaw = {
  status?: string;
  renewalDate?: string | null;
  creditsRemaining?: number | null;
  remainingCredits?: number | null;
  searchCap?: number;
  cap?: number;
  searches?: { cap?: number; used?: number; remaining?: number };
  quota?: { cap?: number; used?: number; remaining?: number };
  used?: number;
  price?: Price;
  cancelAtPeriodEnd?: boolean;
  unlimited?: boolean;
  isAdmin?: boolean;
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
  status?: string;

  planCode?: string; // 'platinum' | 'silver' | 'gold' | 'business' | 'retention' | 'legacy_pro' | ...
  planLabel?: string; // 'Platinum' | 'Silver' | 'Gold' | 'Business' | 'Retention' | 'Free' | 'Admin' | 'Pro'
};

export type SearchRow = {
  id: string;
  jobTitle?: string;
  companyName?: string;
  jdExcerpt?: string;
  createdAt?: string;
  hrContacts?: { name?: string; profileUrl?: string }[];
};

export type HistoryResp = {
  ok: boolean;
  items: SearchRow[];
  nextCursor?: string | null;
};

export type AccountUser = {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Admin" | string;
  renewalDate?: string | null;
  quota: {
    used: number;
    total: number;
  };
};