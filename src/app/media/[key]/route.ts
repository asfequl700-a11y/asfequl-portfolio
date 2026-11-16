import { getCloudflareContext } from "@opennextjs/cloudflare";

// Serves blog images from R2. Names are random, so a file never changes: cache it for a year.
export async function GET(_req: Request, ctx: RouteContext<"/media/[key]">) {
  const { key } = await ctx.params;
  if (!/^[0-9a-f-]{36}\.webp$/.test(key)) return new Response("Not found", { status: 404 });
  const obj = await getCloudflareContext().env.BLOG_IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  return new Response(obj.body, {
    headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
