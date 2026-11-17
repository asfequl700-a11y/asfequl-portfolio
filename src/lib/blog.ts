import { getCloudflareContext } from "@opennextjs/cloudflare";

import type { Block, Run } from "./blog-shared";
import { safeHref, SLUG_RE, cleanTopic, cleanAuthor } from "./blog-shared";
export type { Block, Run };
export { safeHref, SLUG_RE };

export type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string | null;
  body: Block[];
  published_at: string | null;
  topic: string;
  featured: number;
  author_name: string;
  author_photo: string | null;
};

export type AdminPost = Post & { status: "draft" | "published"; updated_at: string };

type Row = Omit<AdminPost, "body"> & { body: string };

const db = () => getCloudflareContext().env.DB;
const COLS = "slug,title,description,cover,body,status,published_at,updated_at,topic,featured,author_name,author_photo";


const str = (x: unknown, max: number, min = 0): x is string => typeof x === "string" && x.length >= min && x.length <= max;
const mediaOrHttp = (s: unknown): s is string => str(s, 500, 1) && /^(https:\/\/|\/media\/)/.test(s);

// Checks data coming from the editor (trust boundary). Returns clean blocks, or null if anything is wrong.
export function parseBlocks(input: unknown): Block[] | null {
  if (!Array.isArray(input) || input.length > 500) return null;
  const out: Block[] = [];
  for (const b of input as Record<string, unknown>[]) {
    if (!b || typeof b !== "object") return null;
    switch (b.type) {
      case "heading":
        if (!str(b.text, 300, 1)) return null;
        if (b.level !== undefined && b.level !== 1 && b.level !== 2 && b.level !== 3) return null;
        out.push({ type: "heading", text: b.text, ...(b.level && b.level !== 2 ? { level: b.level as 1 | 3 } : {}) });
        break;
      case "quote":
        if (!str(b.text, 2000, 1)) return null;
        out.push({ type: "quote", text: b.text });
        break;
      case "divider":
        out.push({ type: "divider" });
        break;
      case "paragraph": {
        if (!Array.isArray(b.runs) || b.runs.length > 200) return null;
        const runs: Run[] = [];
        for (const r of b.runs as Record<string, unknown>[]) {
          if (!r || !str(r.text, 5000, 1)) return null;
          if (r.href !== undefined && !safeHref(r.href)) return null;
          runs.push({ text: r.text, ...(r.bold ? { bold: true } : {}), ...(r.italic ? { italic: true } : {}), ...(r.underline ? { underline: true } : {}), ...(r.strike ? { strike: true } : {}), ...(r.href ? { href: r.href as string } : {}) });
        }
        out.push({ type: "paragraph", runs });
        break;
      }
      case "list":
        if (!Array.isArray(b.items) || b.items.length > 100 || !b.items.every((t) => str(t, 1000, 1))) return null;
        out.push({ type: "list", items: b.items as string[], ...(b.ordered ? { ordered: true } : {}) });
        break;
      case "image":
        if (!mediaOrHttp(b.src) || !str(b.alt, 300)) return null;
        out.push({ type: "image", src: b.src, alt: b.alt });
        break;
      case "cta":
        if (!str(b.text, 500, 1) || !str(b.button, 60, 1) || !safeHref(b.href)) return null;
        out.push({ type: "cta", text: b.text, button: b.button, href: b.href });
        break;
      case "youtube":
        if (!str(b.id, 20, 5) || !/^[\w-]+$/.test(b.id)) return null;
        out.push({ type: "youtube", id: b.id });
        break;
      default:
        return null;
    }
  }
  return out;
}

function parse(r: Row): AdminPost {
  let body: Block[] = [];
  try { body = parseBlocks(JSON.parse(r.body)) ?? []; } catch { /* bad JSON: show an empty post, not a crash */ }
  return { ...r, body };
}

// ---- public (only published posts) ----
export async function listPosts(): Promise<Post[]> {
  const { results } = await db().prepare(`SELECT ${COLS} FROM posts WHERE status='published' ORDER BY published_at DESC`).all<Row>();
  return results.map(parse);
}

export async function getPost(slug: string): Promise<Post | null> {
  const r = await db().prepare(`SELECT ${COLS} FROM posts WHERE slug=? AND status='published'`).bind(slug).first<Row>();
  return r ? parse(r) : null;
}

// ---- admin (drafts too) ----
export async function adminList(): Promise<AdminPost[]> {
  const { results } = await db().prepare(`SELECT ${COLS} FROM posts ORDER BY updated_at DESC`).all<Row>();
  return results.map(parse);
}

export async function adminGet(slug: string): Promise<AdminPost | null> {
  const r = await db().prepare(`SELECT ${COLS} FROM posts WHERE slug=?`).bind(slug).first<Row>();
  return r ? parse(r) : null;
}

export type SaveInput = { slug: string; title: string; description: string; cover: string | null; body: Block[]; status: "draft" | "published"; topic: string; featured: number; author_name: string; author_photo: string | null };

// Insert or update by slug. published_at is set the first time a post is published and then kept.
// A spot at the top belongs to one post only: taking it frees it from the post that had it (returned so the editor can say so).
export async function adminSave(p: SaveInput): Promise<{ unpinned: string | null }> {
  let unpinned: string | null = null;
  if (p.featured) {
    const old = await db().prepare("SELECT slug FROM posts WHERE featured=? AND slug<>?").bind(p.featured, p.slug).first<{ slug: string }>();
    unpinned = old?.slug ?? null;
  }
  await db().batch([
    db().prepare("UPDATE posts SET featured=0 WHERE featured=? AND featured<>0 AND slug<>?").bind(p.featured, p.slug),
    db()
      .prepare(
        `INSERT INTO posts (slug,title,description,cover,body,status,published_at,topic,featured,author_name,author_photo)
         VALUES (?1,?2,?3,?4,?5,?6, CASE WHEN ?6='published' THEN datetime('now') END, ?7, ?8, ?9, ?10)
         ON CONFLICT(slug) DO UPDATE SET
           title=excluded.title, description=excluded.description, cover=excluded.cover, body=excluded.body, status=excluded.status,
           topic=excluded.topic, featured=excluded.featured, author_name=excluded.author_name, author_photo=excluded.author_photo,
           published_at=CASE WHEN excluded.status='published' AND posts.published_at IS NULL THEN datetime('now') ELSE posts.published_at END,
           updated_at=datetime('now')`,
      )
      .bind(p.slug, p.title, p.description, p.cover, JSON.stringify(p.body), p.status, p.topic, p.featured, p.author_name, p.author_photo),
  ]);
  return { unpinned };
}

export async function adminDelete(slug: string) {
  await db().prepare("DELETE FROM posts WHERE slug=?").bind(slug).run();
}

export const validSaveInput = (x: Record<string, unknown>): SaveInput | null => {
  const body = parseBlocks(x.body);
  if (!body || !str(x.slug, 80, 1) || !SLUG_RE.test(x.slug) || !str(x.title, 200, 1) || !str(x.description, 400)) return null;
  if (x.cover != null && !mediaOrHttp(x.cover)) return null;
  if (x.status !== "draft" && x.status !== "published") return null;
  const topic = cleanTopic(x.topic ?? "");
  if (topic === null) return null;
  const featured = x.featured ?? 0;
  if (featured !== 0 && featured !== 1 && featured !== 2 && featured !== 3) return null;
  const author_name = cleanAuthor(x.author_name ?? "");
  if (author_name === null) return null;
  if (x.author_photo != null && !mediaOrHttp(x.author_photo)) return null;
  const author_photo = author_name ? ((x.author_photo as string | null) ?? null) : null; // the default author always uses the profile photo
  return { slug: x.slug, title: x.title, description: x.description, cover: (x.cover as string | null) ?? null, body, status: x.status, topic, featured, author_name, author_photo };
};
