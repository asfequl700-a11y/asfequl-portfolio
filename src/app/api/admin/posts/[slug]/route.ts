import { requireAdmin } from "@/lib/admin";
import { adminDelete, adminGet, SLUG_RE } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: RouteContext<"/api/admin/posts/[slug]">) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { slug } = await ctx.params;
  const post = SLUG_RE.test(slug) ? await adminGet(slug) : null;
  return post ? Response.json(post) : Response.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: Request, ctx: RouteContext<"/api/admin/posts/[slug]">) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { slug } = await ctx.params;
  if (!SLUG_RE.test(slug)) return Response.json({ error: "Bad slug" }, { status: 400 });
  await adminDelete(slug);
  return Response.json({ ok: true });
}
