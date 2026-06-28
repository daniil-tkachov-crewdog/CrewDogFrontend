// POST bullhorn-push  { name, role?, linkedIn? }
// Pushes a CrewDog contact into the caller's Bullhorn as a Candidate (configurable),
// de-duplicating by name first.
import { getUserFromRequest } from "../_shared/auth.ts";
import { handleOptions, json } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { bhFetch, type BullhornConnection } from "../_shared/bullhorn.ts";

// Entity the push targets. Switch to "ClientContact" to model hiring-side people
// instead of candidates (would also need a parent ClientCorporation).
const BULLHORN_PUSH_ENTITY = "Candidate";

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);

  try {
    const user = await getUserFromRequest(req);
    if (!user) return json(req, { error: "Unauthorized" }, 401);

    const { name, role, linkedIn } = await req.json().catch(() => ({}));
    if (!name || typeof name !== "string") {
      return json(req, { error: "Missing contact name" }, 400);
    }

    const admin = supabaseAdmin();
    const { data: conn, error } = await admin
      .from("bullhorn_connections")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!conn) {
      return json(req, { error: "Bullhorn not connected" }, 409);
    }
    const connection = conn as BullhornConnection;

    // 1. Duplicate check by name.
    const searchPath =
      `search/${BULLHORN_PUSH_ENTITY}?query=${
        encodeURIComponent(`name:"${name}"`)
      }&fields=id,name&count=1`;
    const searchRes = await bhFetch(admin, connection, searchPath);
    if (searchRes.ok) {
      const found = await searchRes.json().catch(() => ({}));
      const existing = found?.data?.[0];
      if (existing?.id) {
        return json(req, { duplicate: true, candidateId: existing.id });
      }
    }

    // 2. Create the entity.
    const { firstName, lastName } = splitName(name);
    const description = [
      role ? `Role: ${role}` : null,
      linkedIn ? `LinkedIn: ${linkedIn}` : null,
      "Added via CrewDog",
    ]
      .filter(Boolean)
      .join(" · ");

    const body: Record<string, unknown> = {
      firstName,
      lastName,
      name,
      status: "New Lead",
      description,
    };

    const putRes = await bhFetch(
      admin,
      connection,
      `entity/${BULLHORN_PUSH_ENTITY}`,
      { method: "PUT", body: JSON.stringify(body) },
    );

    if (!putRes.ok) {
      const text = await putRes.text();
      return json(
        req,
        { error: `Bullhorn rejected the candidate: ${text}` },
        502,
      );
    }

    const created = await putRes.json().catch(() => ({}));
    const candidateId = created?.changedEntityId ?? created?.data?.id;
    return json(req, { candidateId });
  } catch (err) {
    console.error("bullhorn-push error:", err);
    return json(req, { error: (err as Error).message }, 500);
  }
});
