import type { SummaryRaw } from "@/types/account";

const API = import.meta.env.VITE_API_URL || "/api";

export async function fetchAccountSummary(userId: string): Promise<SummaryRaw> {
  const res = await fetch(`${API}/account/summary/${userId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed summary fetch");
  return res.json();
}

export async function fetchSearchHistory(userId: string, cursor?: string) {
  const url = new URL(`${API}/searches`, window.location.origin);
  url.searchParams.set("userId", userId);
  if (cursor) url.searchParams.set("cursor", cursor);
  const res = await fetch(url.toString(), { credentials: "include" });
  return res.json();
}
