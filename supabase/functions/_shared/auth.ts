// Resolve the calling CrewDog user from the Supabase JWT in the Authorization
// header. The frontend sends this automatically via supabase.functions.invoke().
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function getUserFromRequest(
  req: Request,
): Promise<{ id: string; email?: string } | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_ANON_KEY");
  }

  // A request-scoped client validates the JWT against Supabase Auth.
  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) return null;
  return { id: data.user.id, email: data.user.email ?? undefined };
}
