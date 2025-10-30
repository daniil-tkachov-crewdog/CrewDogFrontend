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
  status: string;
  pro: boolean;
  cap: number;
  used: number;
  remaining: number | null;
  renewalDate: string | null;
  unlimited: boolean;
  price?: Price;
  cancelAtPeriodEnd: boolean;
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
