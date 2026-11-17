import { safeHref, type Block, type Run } from "./blog-shared";

// Markdown <-> editor blocks. Gaps: ![alt](image) = empty image block, :::cta / :::youtube = ready blocks.
const INLINE = /\*\*(.+?)\*\*|~~(.+?)~~|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function inlineRuns(s: string): Run[] {
  const runs: Run[] = [];
  let last = 0;
  for (const m of s.matchAll(INLINE)) {
    if (m.index > last) runs.push({ text: s.slice(last, m.index) });
    if (m[1]) runs.push({ text: m[1], bold: true });
    else if (m[2]) runs.push({ text: m[2], strike: true });
    else if (m[3]) runs.push({ text: m[3], italic: true });
    else runs.push(safeHref(m[5]) ? { text: m[4], href: m[5] } : { text: m[4] });
    last = m.index + m[0].length;
  }
  if (last < s.length) runs.push({ text: s.slice(last) });
  return runs;
}

// Returns the title (first "# " line, if any) and the blocks.
export function markdownToBlocks(md: string): { title: string; blocks: Block[] } {
  const lines = md.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let title = "";
  let para: string[] = [];
  const flush = () => { if (para.length) blocks.push({ type: "paragraph", runs: inlineRuns(para.join(" ")) }); para = []; };
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    let m: RegExpMatchArray | null;
    if (!t) { flush(); continue; }
    if ((m = t.match(/^:::(cta|youtube)$/i))) { // ::: block, closed by a ::: line
      flush();
      const body: string[] = [];
      while (++i < lines.length && lines[i].trim() !== ":::") body.push(lines[i].trim());
      const kind = m[1].toLowerCase();
      if (kind === "youtube") blocks.push({ type: "youtube", id: body.join("") });
      else { const [text = "", button = "Book a free call", href = "/contact"] = body.join(" ").split("|").map((x) => x.trim()); blocks.push({ type: "cta", text, button, href }); }
    } else if ((m = t.match(/^(#{1,3})\s+(.+)$/))) {
      flush();
      if (m[1].length === 1 && !title && !blocks.length) title = m[2];
      else blocks.push({ type: "heading", text: m[2], level: m[1].length as 1 | 2 | 3 });
    } else if ((m = t.match(/^!\[([^\]]*)\]\(([^)\s]*)\)$/))) { flush(); blocks.push({ type: "image", src: safeHref(m[2]) ? m[2] : "", alt: m[1] }); // "image" or empty = a gap to fill
    } else if (/^(-{3,}|\*{3,})$/.test(t)) { flush(); blocks.push({ type: "divider" });
    } else if (t.startsWith(">")) { flush(); blocks.push({ type: "quote", text: t.replace(/^>\s?/, "") });
    } else if ((m = t.match(/^([-*]|\d+\.)\s+(.+)$/))) {
      flush();
      const ordered = /\d/.test(m[1]);
      const last = blocks[blocks.length - 1];
      if (last?.type === "list" && !!last.ordered === ordered && lines[i - 1]?.trim()) last.items.push(m[2]);
      else blocks.push({ type: "list", items: [m[2]], ...(ordered ? { ordered: true } : {}) });
    } else para.push(t);
  }
  flush();
  return { title, blocks };
}

const runMd = (r: Run) => {
  let t = r.text;
  if (r.bold) t = `**${t}**`;
  if (r.italic) t = `*${t}*`;
  if (r.strike) t = `~~${t}~~`;
  return r.href ? `[${t}](${r.href})` : t;
};

export function blocksToMarkdown(title: string, blocks: Block[]): string {
  const out = title ? [`# ${title}`] : [];
  for (const b of blocks) {
    if (b.type === "paragraph") out.push(b.runs.map(runMd).join(""));
    else if (b.type === "heading") out.push(`${"#".repeat(b.level ?? 2)} ${b.text}`);
    else if (b.type === "list") out.push(b.items.map((x, i) => (b.ordered ? `${i + 1}. ` : "- ") + x).join("\n"));
    else if (b.type === "quote") out.push(`> ${b.text}`);
    else if (b.type === "divider") out.push("---");
    else if (b.type === "image") out.push(`![${b.alt}](${b.src || "image"})`);
    else if (b.type === "cta") out.push(`:::cta\n${b.text} | ${b.button} | ${b.href}\n:::`);
    else out.push(`:::youtube\nhttps://youtu.be/${b.id}\n:::`);
  }
  return out.join("\n\n") + "\n";
}
