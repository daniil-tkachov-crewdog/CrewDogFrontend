// Shared CORS handling for CrewDog Bullhorn edge functions.
//
// `FRONTEND_URL` (e.g. https://crewdog.app) is allowed by default. During local
// development the Vite dev origin (http://localhost:5173) is also allowed.

const ALLOWED_ORIGINS = new Set(
  [
    Deno.env.get("FRONTEND_URL"),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean) as string[],
);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : (Deno.env.get("FRONTEND_URL") ?? "*");
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Vary": "Origin",
  };
}

export function json(
  req: Request,
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

export function handleOptions(req: Request): Response {
  return new Response("ok", { headers: corsHeaders(req) });
}
