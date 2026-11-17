import Link from "next/link";
import BlogBlocks from "./BlogBlocks";
import ShareBar from "./ShareBar";
import Avatar from "./Avatar";
import PostToc from "./PostToc";
import { headingIds } from "@/lib/blog-shared";
import type { Author, Block } from "@/lib/blog-shared";

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

function Meta({ author, date, mins, url, title, end }: { author: Author; date: string; mins: number; url: string; title: string; end?: boolean }) {
  return (
    <div className={`post-meta${end ? " end" : ""}`}>
      <Avatar name={author.name} photo={author.photo} size={32} decorative={end} />
      <span className="who">{author.name}</span>
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
export default function PostArticle({ title, description, blocks, publishedAt, url, author }: {
  title: string; description: string; blocks: Block[]; publishedAt: string | null; url: string; author: Author;
}) {
  const date = fmtDate(publishedAt);
  const mins = readMinutes(blocks);
  const ids = headingIds(blocks);
  const toc = [...ids].map(([i, id]) => ({ id, text: (blocks[i] as { text: string }).text }));
  return (
    <article className="post">
      {toc.length >= 3 && <PostToc items={toc} mode="side" />}
      <div className="post-col">
        <nav className="post-crumb" aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link><span aria-hidden="true">›</span><span>Article</span>
        </nav>
        <h1>{title}</h1>
        {description && <p className="post-dek">{description}</p>}
        <Meta author={author} date={date} mins={mins} url={url} title={title} />
        {toc.length >= 3 && <PostToc items={toc} mode="fold" />}
        <BlogBlocks blocks={blocks} />
        <Meta author={author} date={date} mins={mins} url={url} title={title} end />
      </div>
    </article>
  );
}
