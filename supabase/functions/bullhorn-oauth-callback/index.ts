// POST bullhorn-oauth-callback  { code, state }
// Exchanges the Bullhorn auth code for tokens, runs REST login to discover the
// user's cluster restUrl, and upserts the connection row.
import { getUserFromRequest } from "../_shared/auth.ts";
import { handleOptions, json } from "../_shared/cors.ts";
import { verifyState } from "../_shared/state.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { exchangeCodeForTokens, restLogin } from "../_shared/bullhorn.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);

  try {
    const user = await getUserFromRequest(req);
    if (!user) return json(req, { error: "Unauthorized" }, 401);

    const { code, state } = await req.json().catch(() => ({}));
    if (!code || !state) {
      return json(req, { error: "Missing code or state" }, 400);
    }

    // Verify the signed state and ensure it belongs to the caller (CSRF guard).
    const stateUid = await verifyState(state);
    if (stateUid !== user.id) {
      return json(req, { error: "State does not match user" }, 403);
    }

    const tokens = await exchangeCodeForTokens(code);
    const login = await restLogin(tokens.access_token);

    const admin = supabaseAdmin();
    const { error } = await admin.from("bullhorn_connections").upsert(
      {
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        bh_rest_token: login.bhRestToken,
        rest_url: login.restUrl,
        expires_at: new Date(
          Date.now() + tokens.expires_in * 1000,
        ).toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);

    return json(req, { ok: true });
  } catch (err) {
    console.error("bullhorn-oauth-callback error:", err);
    return json(req, { error: (err as Error).message }, 500);
  }
});
