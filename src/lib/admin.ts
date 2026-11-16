import { getCloudflareContext } from "@opennextjs/cloudflare";

// Admin check. In production the request must carry a valid Cloudflare Access login token
// (Access already blocks strangers at the edge; this is the second lock, in case the edge rule is ever wrong).
// Fails CLOSED: if Access is not configured yet, nobody gets in.

const b64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
let keys: { at: number; list: JsonWebKey[] & { kid?: string }[] } | null = null;

async function verify(token: string, team: string, aud: string): Promise<boolean> {
  try {
    const [h, p, s] = token.split(".");
    const header = JSON.parse(new TextDecoder().decode(b64(h)));
    if (header.alg !== "RS256") return false;
    if (!keys || Date.now() - keys.at > 3_600_000) {
      const r = await fetch(`https://${team}/cdn-cgi/access/certs`);
      if (!r.ok) return false;
      keys = { at: Date.now(), list: ((await r.json()) as { keys: JsonWebKey[] }).keys as never };
    }
    const jwk = keys.list.find((k) => (k as { kid?: string }).kid === header.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return false;
    const c = JSON.parse(new TextDecoder().decode(b64(p)));
    const auds: string[] = Array.isArray(c.aud) ? c.aud : [c.aud];
    return auds.includes(aud) && c.iss === `https://${team}` && c.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/** Returns null when allowed, or a 401 Response to send back. */
export async function requireAdmin(req: Request): Promise<Response | null> {
  if (process.env.NODE_ENV !== "production") return null; // local dev on my laptop
  const env = getCloudflareContext().env as unknown as Record<string, string | undefined>;
  const team = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  const token = req.headers.get("cf-access-jwt-assertion");
  if (team && aud && token && (await verify(token, team, aud))) return null;
  return Response.json({ error: "Not allowed" }, { status: 401 });
}
