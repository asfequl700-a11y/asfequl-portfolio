import type { Block, Run } from "@/lib/blog-shared";
import { safeHref } from "@/lib/blog-shared";

// One piece of a paragraph: plain, bold, italic and/or a link (React escapes all text, so no raw HTML).
function RunView({ r }: { r: Run }) {
  let node: React.ReactNode = r.text;
  if (r.underline) node = <u>{node}</u>;
  if (r.strike) node = <s>{node}</s>;
  if (r.bold) node = <strong>{node}</strong>;
  if (r.italic) node = <em>{node}</em>;
  if (r.href && safeHref(r.href)) node = <a href={r.href} {...(r.href.startsWith("http") ? { rel: "noopener" } : {})}>{node}</a>;
  return <>{node}</>;
}

// Draws each block. A new block type = one new case here (+ the Block type in lib/blog.ts).
export default function BlogBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="blog-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            // The post title is the page's only H1, so a "big heading" is an h2 that looks bigger (better for Google).
            if (b.level === 3) return <h3 key={i}>{b.text}</h3>;
            return <h2 key={i} className={b.level === 1 ? "blog-h1" : undefined}>{b.text}</h2>;
          case "quote":
            return <blockquote key={i}>{b.text}</blockquote>;
          case "divider":
            return <hr key={i} />;
          case "paragraph":
            return <p key={i}>{b.runs.map((r, j) => <RunView key={j} r={r} />)}</p>;
          case "list":
            return b.ordered
              ? <ol key={i}>{b.items.map((t, j) => <li key={j}>{t}</li>)}</ol>
              : <ul key={i}>{b.items.map((t, j) => <li key={j}>{t}</li>)}</ul>;
          case "image":
            return (
              <figure key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" />
                {b.alt && <figcaption aria-hidden="true">{b.alt}</figcaption>}
              </figure>
            );
          case "cta":
            return (
              <div key={i} className="blog-cta">
                <p>{b.text}</p>
                <a className="btn" href={b.href}>{b.button}</a>
              </div>
            );
          case "youtube":
            return (
              <div key={i} className="blog-video">
                <iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.id)}`} title="YouTube video" loading="lazy" allowFullScreen />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
