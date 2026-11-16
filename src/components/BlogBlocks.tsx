import type { Block, Run } from "@/lib/blog";
import { safeHref } from "@/lib/blog";

// One piece of a paragraph: plain, bold, italic and/or a link (React escapes all text, so no raw HTML).
function RunView({ r }: { r: Run }) {
  let node: React.ReactNode = r.text;
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
            return <h2 key={i}>{b.text}</h2>;
          case "paragraph":
            return <p key={i}>{b.runs.map((r, j) => <RunView key={j} r={r} />)}</p>;
          case "list":
            return <ul key={i}>{b.items.map((t, j) => <li key={j}>{t}</li>)}</ul>;
          case "image":
            // eslint-disable-next-line @next/next/no-img-element
            return <img key={i} src={b.src} alt={b.alt} loading="lazy" />;
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
