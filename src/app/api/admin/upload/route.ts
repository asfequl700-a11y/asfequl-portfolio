import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const MAX = 2 * 1024 * 1024; // the editor shrinks images to WebP first, so 2 MB is plenty

// Receives ONE WebP image (the browser already converted + resized it), stores it in R2, returns its address.
export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (req.headers.get("content-type") !== "image/webp") return Response.json({ error: "Only WebP images" }, { status: 415 });
  const data = await req.arrayBuffer();
  if (data.byteLength === 0 || data.byteLength > MAX) return Response.json({ error: "Image is empty or over 2 MB" }, { status: 413 });
  // WebP files start with "RIFF....WEBP"; don't trust the header alone
  const head = new TextDecoder().decode(new Uint8Array(data, 0, 12));
  if (!head.startsWith("RIFF") || !head.endsWith("WEBP")) return Response.json({ error: "Not a WebP file" }, { status: 415 });
  const key = `${crypto.randomUUID()}.webp`;
  await getCloudflareContext().env.BLOG_IMAGES.put(key, data, { httpMetadata: { contentType: "image/webp" } });
  return Response.json({ ok: true, src: `/media/${key}` });
}
