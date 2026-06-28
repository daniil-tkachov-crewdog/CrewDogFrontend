// Bullhorn OAuth + REST helpers shared across edge functions.
//
// Bullhorn flow:
//   1. authorize  -> auth code (browser)
//   2. token      -> { access_token, refresh_token, expires_in }
//   3. rest login -> { BhRestToken, restUrl }   (restUrl is the per-user cluster)
//   4. REST calls use ?BhRestToken=... against restUrl
//
// access_token is short-lived (~10 min); refresh_token is long-lived. The
// BhRestToken is what REST calls actually need, so on a 401 we refresh the
// access token, re-run rest login, persist the new tokens, and retry once.

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

function env(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

const AUTH_URL = () =>
  Deno.env.get("BULLHORN_AUTH_URL") ??
    "https://auth.bullhornstaffing.com/oauth/authorize";
const TOKEN_URL = () =>
  Deno.env.get("BULLHORN_TOKEN_URL") ??
    "https://auth.bullhornstaffing.com/oauth/token";
const LOGIN_URL = () =>
  Deno.env.get("BULLHORN_LOGIN_URL") ??
    "https://rest.bullhornstaffing.com/rest-services/login";

export interface BullhornConnection {
  user_id: string;
  access_token: string;
  refresh_token: string;
  bh_rest_token: string | null;
  rest_url: string | null;
  expires_at: string | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RestLogin {
  bhRestToken: string;
  restUrl: string; // always ends with a trailing slash
}

export function buildAuthorizeUrl(state: string): string {
  const u = new URL(AUTH_URL());
  u.searchParams.set("client_id", env("BULLHORN_CLIENT_ID"));
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", env("APP_REDIRECT_URI"));
  u.searchParams.set("state", state);
  // action=Login nudges Bullhorn straight to the login form.
  u.searchParams.set("action", "Login");
  return u.toString();
}

async function postToken(params: Record<string, string>): Promise<TokenResponse> {
  const u = new URL(TOKEN_URL());
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = await fetch(u.toString(), { method: "POST" });
  if (!res.ok) {
    throw new Error(`Bullhorn token endpoint ${res.status}: ${await res.text()}`);
  }
  return await res.json() as TokenResponse;
}

export function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  return postToken({
    grant_type: "authorization_code",
    code,
    client_id: env("BULLHORN_CLIENT_ID"),
    client_secret: env("BULLHORN_CLIENT_SECRET"),
    redirect_uri: env("APP_REDIRECT_URI"),
  });
}

export function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  return postToken({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: env("BULLHORN_CLIENT_ID"),
    client_secret: env("BULLHORN_CLIENT_SECRET"),
  });
}

export async function restLogin(accessToken: string): Promise<RestLogin> {
  const u = new URL(LOGIN_URL());
  u.searchParams.set("version", "*");
  u.searchParams.set("access_token", accessToken);
  const res = await fetch(u.toString(), { method: "POST" });
  if (!res.ok) {
    throw new Error(`Bullhorn REST login ${res.status}: ${await res.text()}`);
  }
  const data = await res.json() as { BhRestToken: string; restUrl: string };
  const restUrl = data.restUrl.endsWith("/") ? data.restUrl : `${data.restUrl}/`;
  return { bhRestToken: data.BhRestToken, restUrl };
}

/** Persist tokens for a user (service-role client). */
async function persist(
  admin: SupabaseClient,
  userId: string,
  fields: Partial<BullhornConnection>,
): Promise<void> {
  const { error } = await admin
    .from("bullhorn_connections")
    .update(fields)
    .eq("user_id", userId);
  if (error) throw new Error(`Failed to persist Bullhorn tokens: ${error.message}`);
}

/**
 * Refresh the access token, re-run REST login, and persist the new tokens.
 * Returns a fresh { bhRestToken, restUrl }.
 */
async function reauth(
  admin: SupabaseClient,
  conn: BullhornConnection,
): Promise<RestLogin> {
  const tokens = await refreshAccessToken(conn.refresh_token);
  const login = await restLogin(tokens.access_token);
  await persist(admin, conn.user_id, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    bh_rest_token: login.bhRestToken,
    rest_url: login.restUrl,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  });
  return login;
}

/**
 * Make an authenticated Bullhorn REST call. `path` is relative to restUrl, e.g.
 * "entity/Candidate" or 'search/Candidate?query=...'. On 401 (or if no
 * BhRestToken is stored yet) this refreshes the session once and retries.
 */
export async function bhFetch(
  admin: SupabaseClient,
  conn: BullhornConnection,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  let session: RestLogin;
  if (conn.bh_rest_token && conn.rest_url) {
    session = { bhRestToken: conn.bh_rest_token, restUrl: conn.rest_url };
  } else {
    session = await reauth(admin, conn);
  }

  const call = (s: RestLogin) => {
    const sep = path.includes("?") ? "&" : "?";
    const url = `${s.restUrl}${path}${sep}BhRestToken=${encodeURIComponent(s.bhRestToken)}`;
    return fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  };

  let res = await call(session);
  if (res.status === 401) {
    session = await reauth(admin, conn);
    res = await call(session);
  }
  return res;
}
