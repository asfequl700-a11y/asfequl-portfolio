import { getCloudflareContext } from "@opennextjs/cloudflare";

// One block = one piece of a post. The editor (step 2) will write these; the page just draws them.
export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "cta"; text: string; button: string; href: string }
  | { type: "youtube"; id: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string | null;
  body: Block[];
  published_at: string | null;
};

type Row = Omit<Post, "body"> & { body: string };

const db = () => getCloudflareContext().env.DB;

function parse(r: Row): Post {
  let body: Block[] = [];
  try { body = JSON.parse(r.body); } catch { /* bad JSON: show an empty post, not a crash */ }
  return { ...r, body };
}

export async function listPosts(): Promise<Post[]> {
  const { results } = await db()
    .prepare("SELECT slug,title,description,cover,body,published_at FROM posts WHERE status='published' ORDER BY published_at DESC")
    .all<Row>();
  return results.map(parse);
}

export async function getPost(slug: string): Promise<Post | null> {
  const r = await db()
    .prepare("SELECT slug,title,description,cover,body,published_at FROM posts WHERE slug=? AND status='published'")
    .bind(slug)
    .first<Row>();
  return r ? parse(r) : null;
}
