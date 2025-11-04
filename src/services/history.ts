// src/services/history.ts
import { API_BASE } from "@/lib/config";
import { getIdentity } from "@/lib/supabase";
import type { SearchRow, HistoryResp } from "@/types/account";

export type HistoryItem = SearchRow; // keep existing imports stable

export async function fetchSearchHistory({
  limit = 5,
  cursor,
}: {
  limit?: number;
  cursor?: string | null;
}): Promise<HistoryResp> {
  const { userId } = await getIdentity();
  if (!userId) return { ok: true, items: [], nextCursor: null };

  const base = API_BASE.replace(/\/$/, "");
  const url = new URL(`${base}/searches`, window.location.origin);
  url.searchParams.set("userId", userId);
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("History fetch failed");
  return (await res.json()) as HistoryResp;
}

/** Mirror old-site semantics for saving a run item */
export async function logHistory(args: {
  userId?: string;
  summary: {
    company?: string;
    website?: string;
    careerPage?: string;
    contacts?: Array<{ name?: string; role?: string; linkedIn?: string }>;
    sniff_out_clues?: string;
  };
  jobUrl: string;
  jobDescription: string;
  includeLeads: boolean;
}) {
  const { userId, summary, jobUrl, jobDescription, includeLeads } = args;
  if (!userId) return;

  await fetch(`${API_BASE.replace(/\/$/, "")}/searches/log`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      sourceType: jobDescription ? "paste" : "url",
      sourceUrl: jobUrl || null,
      includeLeads,
      jdRaw: jobDescription || "",
      jobTitle: null,
      companyName: summary.company || null,
      companyUrl: summary.website || null,
      location: null,
      whyCompany: summary.sniff_out_clues || null,
      hrContacts: (summary.contacts || []).map((c) => ({
        name: c.name,
        profileUrl: c.linkedIn,
      })),
    }),
  });
}
