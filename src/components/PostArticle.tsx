import Link from "next/link";
import BlogBlocks from "./BlogBlocks";
import ShareBar from "./ShareBar";
import type { Block } from "@/lib/blog-shared";

const AUTHOR = "Asfequl Alam Fahim";

// About 220 words a minute, never less than 1.
export function readMinutes(blocks: Block[]) {
  const text = blocks
    .map((b) =>
      b.type === "paragraph" ? b.runs.map((r) => r.text).join("")
      : b.type === "heading" || b.type === "quote" ? b.text
      : b.type === "list" ? b.items.join(" ")
      : b.type === "cta" ? b.text
      : "")
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}

export const fmtDate = (iso: string | null, short = false) =>
  new Date(iso ?? Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: short ? "short" : "long", year: "numeric" });

function Meta({ date, mins, url, title, end }: { date: string; mins: number; url: string; title: string; end?: boolean }) {
  return (
    <div className={`post-meta${end ? " end" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/profile.jpg" alt={end ? "" : AUTHOR} width={32} height={32} />
      <span className="who">{AUTHOR}</span>
      <span className="dot" aria-hidden="true">•</span>
      <span className="date">{date}</span>
      <div className="post-meta-r">
        <span className="read">{mins} min read</span>
        <ShareBar url={url} title={title} />
      </div>
    </div>
  );
}

// The article itself (no header, footer or "read more"). Used by the live post page AND the editor preview,
// so the preview always matches what visitors see. The cover is NOT shown here: it is for the blog list and share previews.
export default function PostArticle({ title, description, blocks, publishedAt, url }: {
  title: string; description: string; blocks: Block[]; publishedAt: string | null; url: string;
}) {
  const date = fmtDate(publishedAt);
  const mins = readMinutes(blocks);
  return (
    <article className="post">
      <div className="post-col">
        <nav className="post-crumb" aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link><span aria-hidden="true">›</span><span>Article</span>
        </nav>
        <h1>{title}</h1>
        {description && <p className="post-dek">{description}</p>}
        <Meta date={date} mins={mins} url={url} title={title} />
        <BlogBlocks blocks={blocks} />
        <Meta date={date} mins={mins} url={url} title={title} end />
      </div>
    </article>
  );
}
