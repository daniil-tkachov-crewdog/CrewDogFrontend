// src/services/bullhorn.ts
// Frontend service for the per-user Bullhorn integration. Talks to the Supabase
// edge functions via supabase.functions.invoke(), which automatically attaches
// the logged-in user's JWT. Connection status is read directly from the
// RLS-scoped bullhorn_connections row (token columns are never selected).
import { supabase } from "@/lib/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";

/** Pull the JSON `error` field out of a non-2xx edge function response. */
async function invokeErrorMessage(error: unknown, fallback: string): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (body?.error) return body.error as string;
    } catch {
      /* ignore parse failures */
    }
  }
  return (error as { message?: string })?.message || fallback;
}

export type BullhornStatus = {
  connected: boolean;
  restUrl?: string;
};

export type BullhornContact = {
  name: string;
  role?: string;
  linkedIn?: string;
};

export type PushResult = {
  candidateId?: number;
  duplicate?: boolean;
};

/** Whether the current user has a Bullhorn connection. Reads non-secret columns only. */
export async function getBullhornStatus(): Promise<BullhornStatus> {
  const { data, error } = await supabase
    .from("bullhorn_connections")
    .select("user_id, rest_url, expires_at")
    .maybeSingle();

  if (error) {
    // Treat read errors (incl. no row) as "not connected" — never throw to the UI.
    return { connected: false };
  }
  return { connected: !!data, restUrl: data?.rest_url ?? undefined };
}

/** Ask the backend for the Bullhorn authorize URL to redirect the browser to. */
export async function startBullhornOAuth(): Promise<{ authUrl: string }> {
  const { data, error } = await supabase.functions.invoke<{ authUrl: string }>(
    "bullhorn-oauth-start",
    { method: "GET" },
  );
  if (error) {
    throw new Error(
      await invokeErrorMessage(error, "Could not start Bullhorn connection."),
    );
  }
  if (!data?.authUrl) throw new Error("No authorize URL returned.");
  return { authUrl: data.authUrl };
}

/** Exchange the OAuth code (from the callback redirect) for stored tokens. */
export async function completeBullhornOAuth(
  code: string,
  state: string,
): Promise<{ ok: boolean }> {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean }>(
    "bullhorn-oauth-callback",
    { body: { code, state } },
  );
  if (error) {
    throw new Error(
      await invokeErrorMessage(error, "Could not complete Bullhorn connection."),
    );
  }
  return { ok: !!data?.ok };
}

/** Push a single contact into the user's Bullhorn. */
export async function pushContactToBullhorn(
  contact: BullhornContact,
): Promise<PushResult> {
  const { data, error } = await supabase.functions.invoke<PushResult>(
    "bullhorn-push",
    { body: contact },
  );
  if (error) {
    throw new Error(await invokeErrorMessage(error, "Could not push to Bullhorn."));
  }
  return data ?? {};
}

/** Disconnect Bullhorn by deleting the connection row (owner-scoped via RLS). */
export async function disconnectBullhorn(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) throw new Error("Not signed in.");
  const { error } = await supabase
    .from("bullhorn_connections")
    .delete()
    .eq("user_id", uid);
  if (error) throw new Error(error.message || "Could not disconnect Bullhorn.");
}
