// HMAC-signed OAuth `state` value. Encodes the CrewDog user id plus a nonce and
// timestamp, signed with BULLHORN_STATE_SECRET, to defend against CSRF and to
// let the callback recover (and cross-check) the initiating user.

const encoder = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = Deno.env.get("BULLHORN_STATE_SECRET");
  if (!secret) throw new Error("Missing BULLHORN_STATE_SECRET");
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signState(userId: string): Promise<string> {
  const payload = b64urlEncode(
    encoder.encode(
      JSON.stringify({
        uid: userId,
        n: crypto.randomUUID(),
        t: Date.now(),
      }),
    ),
  );
  const key = await hmacKey();
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
  return `${payload}.${b64urlEncode(sig)}`;
}

/**
 * Verify the state signature and freshness, returning the encoded user id.
 * Throws if the signature is invalid or the state is older than `maxAgeMs`.
 */
export async function verifyState(
  state: string,
  maxAgeMs = 10 * 60 * 1000,
): Promise<string> {
  const [payload, sig] = (state ?? "").split(".");
  if (!payload || !sig) throw new Error("Malformed state");

  const key = await hmacKey();
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    b64urlDecode(sig),
    encoder.encode(payload),
  );
  if (!ok) throw new Error("Invalid state signature");

  const decoded = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
  if (typeof decoded?.uid !== "string" || typeof decoded?.t !== "number") {
    throw new Error("Invalid state payload");
  }
  if (Date.now() - decoded.t > maxAgeMs) throw new Error("State expired");
  return decoded.uid;
}
