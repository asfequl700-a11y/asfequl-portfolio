import type { Block } from "@/lib/blog";

// Draws each block. A new block type = one new case here (+ the Block type in lib/blog.ts).
export default function BlogBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="blog-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return <h2 key={i}>{b.text}</h2>;
          case "paragraph":
            return <p key={i}>{b.text}</p>;
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
