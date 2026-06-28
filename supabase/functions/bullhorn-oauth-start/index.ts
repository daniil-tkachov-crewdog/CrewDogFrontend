// GET bullhorn-oauth-start
// Returns the Bullhorn authorize URL the browser should navigate to.
import { getUserFromRequest } from "../_shared/auth.ts";
import { handleOptions, json } from "../_shared/cors.ts";
import { signState } from "../_shared/state.ts";
import { buildAuthorizeUrl } from "../_shared/bullhorn.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);

  try {
    const user = await getUserFromRequest(req);
    if (!user) return json(req, { error: "Unauthorized" }, 401);

    const state = await signState(user.id);
    const authUrl = buildAuthorizeUrl(state);
    return json(req, { authUrl });
  } catch (err) {
    console.error("bullhorn-oauth-start error:", err);
    return json(req, { error: (err as Error).message }, 500);
  }
});
