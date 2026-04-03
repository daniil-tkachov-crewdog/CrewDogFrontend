// src/services/history.ts
import { API_BASE } from "@/lib/config";
import { getIdentity, supabase } from "@/lib/supabase";
import type {
  SearchRow,
  HistoryResp,
  SearchContact,
  ContactStatus,
} from "@/types/account";

export type HistoryItem = SearchRow; // keep existing imports stable

const CONTACT_STATUSES: ContactStatus[] = [
  "none",
  "requested",
  "accepted",
  "messaged",
];

function toContact(item: any): SearchContact | null {
  if (!item || typeof item !== "object") return null;
  const name = String(item?.name || item?.title || "").trim();
  const profileUrl = String(
    item?.profileUrl || item?.profile_url || item?.linkedIn || item?.link || ""
  ).trim();
  const title = String(item?.role || item?.title || "").trim();
  const statusRaw = String(item?.status || "none").toLowerCase() as ContactStatus;
  const status = CONTACT_STATUSES.includes(statusRaw) ? statusRaw : "none";
  if (!name && !profileUrl) return null;
  return { name: name || undefined, profileUrl: profileUrl || undefined, title: title || undefined, status };
}

function toContacts(value: any): SearchContact[] {
  if (!Array.isArray(value)) return [];
  return value.map(toContact).filter(Boolean) as SearchContact[];
}

function normalizeHistoryItem(raw: any): HistoryItem {
  return {
    id: String(raw?.id || ""),
    jobTitle: raw?.jobTitle ?? raw?.job_title ?? null,
    companyName: raw?.companyName ?? raw?.company_name ?? null,
    companyUrl: raw?.companyUrl ?? raw?.company_url ?? null,
    jdExcerpt: raw?.jdExcerpt ?? raw?.jd_excerpt ?? null,
    jdRaw: raw?.jdRaw ?? raw?.jd_raw ?? null,
    createdAt: raw?.createdAt ?? raw?.created_at ?? null,
    sourceType: raw?.sourceType ?? raw?.source_type ?? null,
    sourceUrl: raw?.sourceUrl ?? raw?.source_url ?? null,
    whyCompany: raw?.whyCompany ?? raw?.why_company ?? null,
    location: raw?.location ?? null,
    isImportant: Boolean(raw?.isImportant ?? raw?.is_important ?? false),
    contactStatuses: raw?.contactStatuses ?? raw?.contact_statuses ?? {},
    hrContacts: toContacts(raw?.hrContacts ?? raw?.hr_contacts),
    potentialLeads: toContacts(
      raw?.potentialLeads ??
        raw?.potential_leads ??
        raw?.leads ??
        raw?.potentialLeadsFound
    ),
  };
}

async function hydrateFromSupabase(items: HistoryItem[], userId: string) {
  if (!items.length) return items;
  const ids = items.map((x) => x.id).filter(Boolean);
  const { data, error } = await supabase
    .from("app_searches")
    .select(
      "id, jd_raw, jd_excerpt, source_url, hr_contacts, potential_leads, is_important, contact_statuses"
    )
    .eq("user_id", userId)
    .in("id", ids);
  if (error || !data) return items;

  const byId = new Map<string, any>(data.map((r: any) => [String(r.id), r]));
  return items.map((it) => {
    const row = byId.get(it.id);
    if (!row) return it;
    return {
      ...it,
      jdRaw: it.jdRaw || row.jd_raw || "",
      jdExcerpt: it.jdExcerpt || row.jd_excerpt || "",
      sourceUrl: it.sourceUrl || row.source_url || "",
      isImportant:
        typeof row.is_important === "boolean" ? row.is_important : it.isImportant,
      contactStatuses: row.contact_statuses || it.contactStatuses || {},
      hrContacts: it.hrContacts?.length ? it.hrContacts : toContacts(row.hr_contacts),
      potentialLeads: it.potentialLeads?.length
        ? it.potentialLeads
        : toContacts(row.potential_leads),
    };
  });
}

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
  const json = (await res.json()) as HistoryResp & { items?: any[] };
  const result: HistoryResp = {
    ...json,
    items: Array.isArray(json.items)
      ? json.items.map(normalizeHistoryItem).filter((x) => x.id)
      : [],
  };
  result.items = await hydrateFromSupabase(result.items, userId);
  return result;
}

/** Mirror old-site semantics for saving a run item */
export async function logHistory(args: {
  userId?: string;
  summary: {
    company?: string;
    website?: string;
    careerPage?: string;
    contacts?: Array<{ name?: string; role?: string; linkedIn?: string }>;
    leads?: Array<{ name?: string; url?: string; title?: string }>;
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
        title: c.role,
        profileUrl: c.linkedIn,
      })),
      potentialLeads: (summary.leads || []).map((l) => ({
        name: l.name || l.title,
        profileUrl: l.url,
        title: l.title,
      })),
    }),
  });
}

export async function setImportantSearch(id: string, isImportant: boolean) {
  const { error } = await supabase
    .from("app_searches")
    .update({ is_important: isImportant })
    .eq("id", id);
  if (error) throw error;
}

export async function setContactStatuses(
  id: string,
  contactStatuses: Record<string, ContactStatus>
) {
  const { error } = await supabase
    .from("app_searches")
    .update({ contact_statuses: contactStatuses })
    .eq("id", id);
  if (error) throw error;
}
