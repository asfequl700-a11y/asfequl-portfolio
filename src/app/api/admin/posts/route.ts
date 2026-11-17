import { requireAdmin } from "@/lib/admin";
import { adminList, adminSave, validSaveInput } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const posts = await adminList();
  return Response.json(posts.map(({ slug, title, status, updated_at, published_at, topic, author_name, author_photo }) => ({ slug, title, status, updated_at, published_at, topic, author_name, author_photo })));
}

// Create or update a post (draft or published).
export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const json = await req.json().catch(() => null);
  const input = json && typeof json === "object" ? validSaveInput(json as Record<string, unknown>) : null;
  if (!input) return Response.json({ error: "Post data is not valid" }, { status: 400 });
  const { unpinned } = await adminSave(input);
  return Response.json({ ok: true, slug: input.slug, unpinned });
}
