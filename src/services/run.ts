// src/services/run.ts
import { API_BASE } from "@/lib/config";

/** Payload we send to n8n */
export type RunPayload = {
  JD?: string; // full job description text (optional)
  JD_link?: string; // job URL (optional)
  includeLeads?: boolean; // extra contacts toggle
};

/** n8n (and other) shapes we can receive back */
export type RunResponse = {
  // common fields
  company?: string;
  website?: string;
  careerPage?: string;
  contacts?: Array<{ name: string; role?: string; linkedIn?: string }>;

  // n8n-specific fields you showed
  company_website?: string;
  sniff_out_clues?: string;
  hr?: Array<{ title: string; link: string }>;

  // allow unknown keys so we don't break on additions
  [k: string]: any;
};

/** Prefer the legacy direct webhook if provided (fixes JD_link 500s) */
const DIRECT_GATECRASHER =
  (window as any).__N8N_GATECRASHER_URL ||
  (import.meta as any).env?.VITE_N8N_GATECRASHER_URL ||
  "";

/** Call your backend → n8n webhook (no backend changes needed) */
export async function runSearch(payload: RunPayload): Promise<RunResponse> {
  const base = (API_BASE || "").replace(/\/$/, "");
  const url =
    (DIRECT_GATECRASHER && String(DIRECT_GATECRASHER).replace(/\/$/, "")) ||
    `${base}/n8n/gatecrasher`;

  // Small guard: ensure JD_link is a proper absolute URL if present
  if (payload.JD_link && !/^https?:\/\//i.test(payload.JD_link)) {
    throw new Error("Please include http(s):// in the Job URL");
  }

  const body = JSON.stringify({
    JD: (payload.JD || "").trim(),
    JD_link: (payload.JD_link || "").trim(),
    JH_tickbox: payload.includeLeads ? "yes" : "no",
    // mirror old form’s saver flag (kept as "No")
    "Save to the doc file and the spreadsheet? (+10 sec)": "No",
  });

  // If we're hitting our own API (same origin / proxied), include cookies.
  // For direct n8n webhook (legacy behavior), avoid sending cookies.
  const sameOrigin =
    url.startsWith(window.location.origin) || url.startsWith("/");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(sameOrigin ? { credentials: "include" } : {}),
    body,
  });

  // Try to parse JSON; if text, attempt JSON; else return as-is
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    const data = (await res.json()) as any;
    return Array.isArray(data) ? data[0] || {} : data;
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text } as any;
  }
}

/** Infer a friendly company name if only a website is available */
export function inferCompanyName(opts: { website?: string }) {
  try {
    const u = new URL(String(opts.website || ""));
    const host = u.hostname.replace(/^www\./i, "");
    const base = host.split(".")[0];
    if (!base) return undefined;
    return base.charAt(0).toUpperCase() + base.slice(1);
  } catch {
    return undefined;
  }
}

/** Split "Name - Title | Other" into clean name + role */
export function nameAndRoleFromTitle(title: string) {
  const [namePart, ...rest] = (title || "").split(" - ");
  const name = (namePart || "").trim();
  const role =
    rest
      .join(" - ")
      .replace(/\s*\|\s*/g, " · ")
      .trim() || undefined;
  return { name: name || "Unknown", role };
}

/** Map n8n’s payload into a UI-friendly shape */
export function mapN8nToResults(data: any) {
  const website = data.website || data.company_website || "";
  const contactsFromHr = Array.isArray(data.hr)
    ? data.hr.map((h: any) => {
        const { name, role } = nameAndRoleFromTitle(h.title || "");
        return { name, role, linkedIn: h.link || "" };
      })
    : null;

  const contactsFromContacts = Array.isArray(data.contacts)
    ? data.contacts.map((c: any) => ({
        name: c.name || c.fullName || "Unknown",
        role: c.role || c.title || "",
        linkedIn: c.linkedIn || c.linkedin || c.profileUrl || "",
      }))
    : null;

  return {
    company: data.company || inferCompanyName({ website }) || "Company",
    website,
    careerPage: data.careerPage || "",
    contacts: contactsFromHr || contactsFromContacts || [],
    sniff_out_clues: data.sniff_out_clues || undefined,
  };
}

export type NormalizedResults = ReturnType<typeof mapN8nToResults>;
