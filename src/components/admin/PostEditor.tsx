"use client";
import "./editor.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { safeHref, SLUG_RE, TOPICS, FEATURED_LABELS, cleanTopic, sortTopics, cleanAuthor, resolveAuthor, DEFAULT_AUTHOR, type Block, type Run } from "@/lib/blog-shared";
import PostArticle from "@/components/PostArticle";
import { FinalCta } from "@/components/ui";
import { markdownToBlocks, blocksToMarkdown } from "@/lib/markdown";

// Layout: the page you write on (left) + a sticky drawer with publish buttons, blocks and settings (right).
// Text blocks are contentEditable boxes that own their text after the first fill (re-filling on every key would jump the cursor).

type EBlock = Block & { k: string }; // k = key for React (YouTube blocks already use "id" for the video)
type Fmt = { bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean; href?: string };
type Kind = "p" | "h1" | "h2" | "h3" | "ul" | "ol" | "quote" | "image" | "youtube" | "cta" | "divider";
type Drag = { kind: "new"; t: Kind } | { kind: "move"; k: string } | null;

const newId = () => crypto.randomUUID();
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const ytId = (s: string) => (/^[\w-]{11}$/.test(s.trim()) ? s.trim() : s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? "");
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const PLACEHOLDER_MD = "# Title\n\n## Heading\n\nA paragraph with **bold**.\n\n![alt text](image)\n\n:::cta\nMessage | Button text | /contact\n:::";
const TEXT_KINDS: Kind[] = ["p", "h1", "h2", "h3", "ul", "ol", "quote"];

function make(kind: Kind, text = ""): Block {
  switch (kind) {
    case "p": return { type: "paragraph", runs: text ? [{ text }] : [] };
    case "h1": return { type: "heading", text, level: 1 };
    case "h2": return { type: "heading", text, level: 2 };
    case "h3": return { type: "heading", text, level: 3 };
    case "ul": return { type: "list", items: [text] };
    case "ol": return { type: "list", items: [text], ordered: true };
    case "quote": return { type: "quote", text };
    case "image": return { type: "image", src: "", alt: "" };
    case "youtube": return { type: "youtube", id: "" };
    case "cta": return { type: "cta", text: "", button: "Book a free call", href: "/contact" };
    default: return { type: "divider" };
  }
}
const kindOf = (b: Block): Kind =>
  b.type === "paragraph" ? "p" : b.type === "heading" ? (`h${b.level ?? 2}` as Kind) : b.type === "list" ? (b.ordered ? "ol" : "ul") : (b.type as Kind);
const plainText = (b: Block) =>
  b.type === "paragraph" ? b.runs.map((r) => r.text).join("") : b.type === "heading" || b.type === "quote" ? b.text : b.type === "list" ? b.items.filter(Boolean).join(" ") : "";

// ---- paragraph text <-> runs (bold / italic / underline / strike / link) ----
const runsToHtml = (runs: Run[]) =>
  runs.map((r) => {
    let h = esc(r.text);
    if (r.underline) h = `<u>${h}</u>`;
    if (r.strike) h = `<s>${h}</s>`;
    if (r.bold) h = `<strong>${h}</strong>`;
    if (r.italic) h = `<em>${h}</em>`;
    if (r.href) h = `<a href="${esc(r.href)}">${h}</a>`;
    return h;
  }).join("");

function htmlToRuns(root: HTMLElement): Run[] {
  const out: Run[] = [];
  const same = (a: Fmt, b: Fmt) => !!a.bold === !!b.bold && !!a.italic === !!b.italic && !!a.underline === !!b.underline && !!a.strike === !!b.strike && a.href === b.href;
  const push = (text: string, f: Fmt) => {
    const last = out[out.length - 1];
    if (last && same(last, f)) last.text += text;
    else out.push({ text, ...(f.bold ? { bold: true } : {}), ...(f.italic ? { italic: true } : {}), ...(f.underline ? { underline: true } : {}), ...(f.strike ? { strike: true } : {}), ...(f.href ? { href: f.href } : {}) });
  };
  const walk = (n: Node, f: Fmt) => {
    if (n.nodeType === 3) {
      const t = (n.textContent ?? "").replace(/\s*\n\s*/g, " ").replace(/\u00a0/g, " ");
      if (t) push(t, f);
      return;
    }
    if (n.nodeType !== 1) return;
    const el = n as HTMLElement;
    const nf = { ...f };
    const w = el.style.fontWeight;
    const deco = el.style.textDecoration + " " + el.style.textDecorationLine;
    if (el.tagName === "B" || el.tagName === "STRONG" || w === "bold" || +w >= 600) nf.bold = true;
    if (el.tagName === "I" || el.tagName === "EM" || el.style.fontStyle === "italic") nf.italic = true;
    if (el.tagName === "U" || deco.includes("underline")) nf.underline = true;
    if (el.tagName === "S" || el.tagName === "STRIKE" || el.tagName === "DEL" || deco.includes("line-through")) nf.strike = true;
    if (el.tagName === "A") {
      const h = el.getAttribute("href") ?? "";
      if (safeHref(h)) nf.href = h;
    }
    el.childNodes.forEach((c) => walk(c, nf));
  };
  root.childNodes.forEach((c) => walk(c, {}));
  return out;
}

function caretEnd(el: HTMLElement) {
  el.focus();
  const r = document.createRange();
  r.selectNodeContents(el);
  r.collapse(false);
  const s = window.getSelection();
  s?.removeAllRanges();
  s?.addRange(r);
}

// A contentEditable box. Filled once on mount; after that the browser owns the text and we read it back on every input.
function Editable({ k, tag, html, className, ph, kind, reg, onSync, onKeyDown }: {
  k: string; tag: "div" | "ul" | "ol"; html: string; className: string; ph: string; kind: Kind;
  reg: (k: string, el: HTMLElement | null) => void; onSync: (el: HTMLElement) => void; onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = html;
    reg(k, el);
    return () => reg(k, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isList = tag !== "div";
  const Tag = tag as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      role="textbox"
      aria-label={ph}
      data-ph={ph}
      data-kind={kind}
      className={className}
      onInput={(e) => {
        const el = e.currentTarget;
        if (isList && !el.querySelector("li")) { el.innerHTML = "<li><br></li>"; caretEnd(el.querySelector("li")!); }
        if (!isList && el.innerHTML === "<br>") el.innerHTML = "";
        onSync(el);
      }}
      onKeyDown={onKeyDown}
      onPaste={(e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); }} // plain text only
    />
  );
}

// ---- image: shrink + turn into WebP in the browser, then upload ----
async function uploadImage(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / bmp.width);
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise<Blob>((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error("Could not convert the image"))), "image/webp", 0.8));
  const r = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "image/webp" }, body: blob });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ?? "Upload failed");
  return j.src as string;
}

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
);

// Click to choose, or drop a photo on it. autoPick opens the file window right away (used when an Image block is added).
function ImageDrop({ src, onPick, autoPick, title, hint, cover, small }: { src: string | null; onPick: (s: string | null) => void; autoPick?: boolean; title: string; hint: string; cover?: boolean; small?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inp = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoPick) inp.current?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function pick(f: File | undefined) {
    if (!f) return;
    if (!/^image\//.test(f.type)) return setErr("That is not an image.");
    setBusy(true); setErr("");
    try { onPick(await uploadImage(f)); } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  const input = <input ref={inp} type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="ed-sr" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />;
  const onDragOver = (e: React.DragEvent) => { if (e.dataTransfer.types.includes("Files")) e.preventDefault(); };
  const onDrop = (e: React.DragEvent) => { if (!e.dataTransfer.files.length) return; e.preventDefault(); pick(e.dataTransfer.files[0]); };
  if (!src)
    return (
      <label className={`ed-drop ${cover ? "ed-cover" : ""} ${small ? "ed-drop-sm" : ""}`} onDragOver={onDragOver} onDrop={onDrop}>
        {input}
        <UploadIcon />
        <span className="font-semibold text-white">{busy ? "Uploading…" : title}</span>
        <span className="ed-hint">{hint}</span>
        {err && <span className="text-sm text-red-300">{err}</span>}
      </label>
    );
  return (
    <div className="flex flex-col gap-2.5" onDragOver={onDragOver} onDrop={onDrop}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className={cover ? "ed-cover-img" : small ? "ed-img-sm" : "ed-img"} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="ed-btn ed-btn-sm">{busy ? "Uploading…" : "Change"}{input}</label>
        <button type="button" className="ed-btn ed-btn-sm" onClick={() => onPick(null)}>Remove</button>
        <span className="ed-hint">Resized and turned into WebP automatically.</span>
        {err && <span className="text-sm text-red-300">{err}</span>}
      </div>
    </div>
  );
}

// ---- small icons (stroke, follow the text colour) ----
const I = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const ICON = {
  text: "M4 7h16M4 12h16M4 17h10",
  heading: "M6 4v16M18 4v16M6 12h12",
  list: "M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5",
  olist: "M10 6h10M10 12h10M10 18h10M4 4h1v4M3.5 14.5h2l-2 3h2",
  quote: "M6 7h4v4c0 3-2 5-4 6M14 7h4v4c0 3-2 5-4 6",
  image: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4M21 16l-5-5-9 9",
  youtube: "M6.5 5h11a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4zM10 9l5 3-5 3z",
  cta: "M8 7h8a5 5 0 0 1 0 10H8A5 5 0 0 1 8 7zM8 12h8",
  divider: "M3 12h18M8 6h8M8 18h8",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  unlink: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1M4 4l16 16",
  up: "M12 19V5M6 11l6-6 6 6",
  down: "M12 5v14M6 13l6 6 6-6",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
};

const PALETTE: { t: Kind; name: string; desc: string; icon: string }[] = [
  { t: "p", name: "Paragraph", desc: "Normal text", icon: ICON.text },
  { t: "h2", name: "Heading", desc: "Section title", icon: ICON.heading },
  { t: "ul", name: "List", desc: "Bullet points", icon: ICON.list },
  { t: "quote", name: "Quote", desc: "Stand-out line", icon: ICON.quote },
  { t: "image", name: "Image", desc: "Opens your files", icon: ICON.image },
  { t: "youtube", name: "YouTube", desc: "Paste a video link", icon: ICON.youtube },
  { t: "cta", name: "Button box", desc: "Message + button", icon: ICON.cta },
  { t: "divider", name: "Divider", desc: "A thin line", icon: ICON.divider },
];
const PH: Partial<Record<Kind, string>> = { p: "Write something…", h1: "Big heading", h2: "Heading", h3: "Small heading", ul: "List item", ol: "List item", quote: "A line worth quoting" };
const LABEL: Partial<Record<Kind, string>> = { image: "Image", youtube: "YouTube video", cta: "Button box", divider: "Divider" };

export default function PostEditor({ slug: editSlug }: { slug?: string }) {
  const router = useRouter();
  const isNew = !editSlug;
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(editSlug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [knownTopics, setKnownTopics] = useState<string[]>([...TOPICS]); // starter topics + any used on other posts
  const [newTopic, setNewTopic] = useState<string | null>(null); // typing a new topic name
  const [authorName, setAuthorName] = useState(""); // "" = the default author (Fahim)
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Record<string, string | null>>({}); // other authors used on other posts: name -> photo
  const [newAuthor, setNewAuthor] = useState<{ name: string; photo: string | null } | null>(null); // adding a new author
  const [featured, setFeatured] = useState(0);
  const [cover, setCover] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [blocks, setBlocks] = useState<EBlock[]>(isNew ? [{ k: newId(), type: "paragraph", runs: [] }] : []);
  const [cur, setCur] = useState<string | null>(null); // the block you are working in
  const [pickKey, setPickKey] = useState<string | null>(null); // new Image block: open the file window once
  const [tab, setTab] = useState<"blocks" | "settings">("blocks");
  const [mode, setMode] = useState<"edit" | "md" | "preview">("edit"); // the three views of the page
  const preview = mode === "preview";
  const [md, setMd] = useState(""); // the text in Markdown view
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState<number | null>(null);
  const [tip, setTip] = useState("");
  const [link, setLink] = useState<{ url: string } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(isNew);
  const [savedSnap, setSavedSnap] = useState<string | null>(null);

  const els = useRef(new Map<string, HTMLElement>());
  const focusReq = useRef<string | null>(null);
  const [drag, setDrag] = useState<Drag>(null);
  const savedRange = useRef<Range | null>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reg = useCallback((k: string, el: HTMLElement | null) => { if (el) els.current.set(k, el); else els.current.delete(k); }, []);

  // After each render: put the cursor in a block we asked for (new block, Enter, Backspace, type change)
  useEffect(() => {
    const k = focusReq.current;
    const el = k ? els.current.get(k) : null;
    if (el) { caretEnd(el); focusReq.current = null; }
  });

  // "has anything changed since the last save?" (warns before you leave, shows the status)
  const snap = JSON.stringify({ title, slug, description, cover, topic, featured, authorName, authorPhoto, blocks: blocks.map((b) => ({ ...b, k: "" })) }); // keys ignored: in dev the post loads twice with new keys
  const dirty = savedSnap !== null && snap !== savedSnap;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (loaded && savedSnap === null) setSavedSnap(snap); }, [loaded, savedSnap, snap]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => (r.ok ? r.json() : []))
      .then((ps: { topic?: string; author_name?: string; author_photo?: string | null }[]) => {
        setKnownTopics((k) => sortTopics([...k, ...ps.map((p) => p.topic ?? "")]));
        setAuthors((a) => {
          const m = { ...a };
          for (const p of ps) if (p.author_name && (m[p.author_name] == null)) m[p.author_name] = p.author_photo ?? null;
          return m;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!editSlug) return;
    fetch(`/api/admin/posts/${editSlug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => {
        setTitle(p.title); setDescription(p.description); setTopic(p.topic ?? ""); setFeatured(p.featured ?? 0); setAuthorName(p.author_name ?? ""); setAuthorPhoto(p.author_photo ?? null); setCover(p.cover); setStatus(p.status);
        setBlocks((p.body as Block[]).map((b) => ({ ...b, k: newId() })));
        setLoaded(true);
      })
      .catch(() => setMsg({ ok: false, text: "Could not load this post." }));
  }, [editSlug]);

  const showTip = (t: string) => {
    setTip(t);
    clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTip(""), 2600);
  };

  // "+ New topic…": checks the name, adds it to the list and picks it for this post
  function addTopic() {
    const t = cleanTopic(newTopic ?? "");
    if (!t) return showTip("A topic can use letters, numbers, spaces and & ' - . (up to 40 characters).");
    const same = knownTopics.find((k) => k.toLowerCase() === t.toLowerCase()); // "ai agents" = "AI agents"
    setKnownTopics((k) => sortTopics([...k, same ?? t]));
    setTopic(same ?? t);
    setNewTopic(null);
  }

  // "+ New author…": checks the name, remembers the photo and picks them for this post
  function addAuthor() {
    const n = cleanAuthor(newAuthor?.name ?? "");
    if (!n) return showTip("An author name can use letters, numbers, spaces and & ' - . (up to 60 characters).");
    if (n.toLowerCase() === DEFAULT_AUTHOR.name.toLowerCase()) { setAuthorName(""); setAuthorPhoto(null); setNewAuthor(null); return; } // that is the default author
    const same = Object.keys(authors).find((k) => k.toLowerCase() === n.toLowerCase());
    const name = same ?? n;
    const photo = newAuthor?.photo ?? (same ? authors[same] : null);
    setAuthors((a) => ({ ...a, [name]: photo }));
    setAuthorName(name);
    setAuthorPhoto(photo);
    setNewAuthor(null);
  }

  // Edit / Markdown / Preview. Leaving Markdown turns its text into blocks; entering it writes the blocks as markdown.
  function switchMode(next: "edit" | "md" | "preview") {
    if (next === mode) return;
    if (mode === "md") {
      const { title: t, blocks: bs } = markdownToBlocks(md);
      if (t) { setTitle(t); if (!slugTouched) setSlug(slugify(t)); }
      setBlocks(bs.length ? bs.map((b) => ({ ...b, k: newId() })) : [{ k: newId(), type: "paragraph", runs: [] }]);
    }
    if (next === "md") setMd(blocksToMarkdown(title.trim(), blocks.map(({ k: _k, ...b }) => b as Block))); // eslint-disable-line @typescript-eslint/no-unused-vars
    setMode(next);
  }

  // ---- block changes ----
  const updK = (k: string, patch: Partial<Block>) => setBlocks((bs) => bs.map((b) => (b.k === k ? ({ ...b, ...patch } as EBlock) : b)));
  const removeK = (k: string) => setBlocks((bs) => bs.filter((b) => b.k !== k));
  const swap = (i: number, d: number) => setBlocks((bs) => { const a = [...bs]; [a[i], a[i + d]] = [a[i + d], a[i]]; return a; });

  function insertAt(i: number, b: Block) {
    const k = newId();
    setBlocks((bs) => [...bs.slice(0, i), { ...b, k } as EBlock, ...bs.slice(i)]);
    setCur(k);
    if (TEXT_KINDS.includes(kindOf(b))) focusReq.current = k;
    if (b.type === "image") setPickKey(k);
  }
  function moveTo(k: string, i: number) {
    setBlocks((bs) => {
      const j = bs.findIndex((b) => b.k === k);
      if (j < 0) return bs;
      const a = [...bs];
      const [m] = a.splice(j, 1);
      a.splice(j < i ? i - 1 : i, 0, m);
      return a;
    });
  }
  function dropAt(i: number) {
    const d = drag;
    setDrag(null); setDragging(false); setOver(null);
    if (!d) return;
    if (d.kind === "new") insertAt(i, make(d.t));
    else moveTo(d.k, i);
  }
  const addBelowCurrent = (t: Kind) => {
    const j = blocks.findIndex((b) => b.k === cur);
    insertAt(j < 0 ? blocks.length : j + 1, make(t));
  };

  // Toolbar P / H1 / H2 / H3 / lists / quote: turn the current text block into that kind (keeps its words)
  function convert(kind: Kind) {
    const i = blocks.findIndex((b) => b.k === cur);
    const b = blocks[i];
    if (!b || !TEXT_KINDS.includes(kindOf(b))) return showTip("Click inside a text block first.");
    if (kindOf(b) === kind) return;
    const nb: Block = b.type === "list" && (kind === "ul" || kind === "ol") ? { ...b, ordered: kind === "ol" } : make(kind, plainText(b));
    const k = newId();
    setBlocks((bs) => bs.map((x) => (x.k === b.k ? ({ ...nb, k } as EBlock) : x)));
    setCur(k);
    focusReq.current = k;
  }

  // Bold / italic / underline / strike / links: only inside normal text (paragraphs)
  const inParagraph = () => !!(document.activeElement as HTMLElement | null)?.closest?.('[data-kind="p"]');
  function cmd(c: string) {
    if (!inParagraph()) return showTip("Select text in a paragraph first.");
    document.execCommand(c, false);
  }
  function openLink() {
    const s = window.getSelection();
    if (!inParagraph() || !s || !s.rangeCount || s.isCollapsed) return showTip("Select some text in a paragraph first, then click Link.");
    savedRange.current = s.getRangeAt(0).cloneRange();
    setLink({ url: "" });
  }
  function applyLink() {
    const r = savedRange.current;
    let u = (link?.url ?? "").trim();
    savedRange.current = null;
    setLink(null);
    if (!r || !u) return;
    if (!/^(https?:\/\/|\/|mailto:|#)/.test(u)) u = "https://" + u;
    const node = r.startContainer.nodeType === 1 ? (r.startContainer as HTMLElement) : r.startContainer.parentElement;
    const host = node?.closest<HTMLElement>('[data-kind="p"]');
    if (!host) return;
    host.focus();
    const s = window.getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
    document.execCommand("createLink", false, u); // fires "input", so the paragraph saves itself
  }

  // Keys inside text blocks: Enter = new paragraph, Backspace in an empty block = delete it, Ctrl+K = link
  function onTextKey(e: React.KeyboardEvent<HTMLElement>, b: EBlock, i: number) {
    const el = e.currentTarget;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openLink(); return; }
    if (b.type === "list") {
      if (e.key === "Enter" && !e.shiftKey) {
        const li = window.getSelection()?.anchorNode;
        const item = (li?.nodeType === 1 ? (li as HTMLElement) : li?.parentElement)?.closest("li");
        if (item && !item.textContent?.trim()) { // Enter on an empty point = leave the list
          e.preventDefault();
          item.remove();
          updK(b.k, { items: [...el.querySelectorAll("li")].map((x) => x.textContent ?? "") });
          insertAt(i + 1, make("p"));
        }
      } else if (e.key === "Backspace" && !el.textContent?.trim() && el.querySelectorAll("li").length <= 1 && blocks.length > 1) {
        e.preventDefault();
        deleteAndFocusPrev(b.k, i);
      }
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); if (!e.shiftKey || b.type !== "paragraph") insertAt(i + 1, make("p")); }
    else if (e.key === "Backspace" && !el.textContent?.trim() && blocks.length > 1) { e.preventDefault(); deleteAndFocusPrev(b.k, i); }
  }
  function deleteAndFocusPrev(k: string, i: number) {
    const prev = blocks[i - 1];
    removeK(k);
    if (prev) { setCur(prev.k); if (TEXT_KINDS.includes(kindOf(prev))) focusReq.current = prev.k; }
  }

  async function save(to: "draft" | "published") {
    setMsg(null);
    if (mode === "md") return setMsg({ ok: false, text: "Switch to Edit or Preview first, then save." });
    if (!title.trim()) return setMsg({ ok: false, text: "Add a title first." });
    if (!SLUG_RE.test(slug)) return setMsg({ ok: false, text: "The web address can only have small letters, numbers and dashes." });
    const body: Block[] = [];
    for (const { k: _k, ...b } of blocks) { // eslint-disable-line @typescript-eslint/no-unused-vars
      if (b.type === "paragraph") { const runs = b.runs.filter((r) => r.text); if (runs.some((r) => r.text.trim())) body.push({ type: "paragraph", runs }); }
      else if (b.type === "heading") { const text = b.text.trim(); if (text) body.push({ type: "heading", text, ...(b.level && b.level !== 2 ? { level: b.level } : {}) }); }
      else if (b.type === "quote") { const text = b.text.trim(); if (text) body.push({ type: "quote", text }); }
      else if (b.type === "divider") body.push(b);
      else if (b.type === "list") { const items = b.items.map((t) => t.trim()).filter(Boolean); if (items.length) body.push({ type: "list", items, ...(b.ordered ? { ordered: true } : {}) }); }
      else if (b.type === "image") { if (b.src) body.push(b); }
      else if (b.type === "cta") {
        if (!b.text.trim() && !b.button.trim() && !b.href.trim()) continue;
        if (!b.text.trim() || !b.button.trim() || !safeHref(b.href.trim())) return setMsg({ ok: false, text: "A button box needs a message, a button text and a link that starts with https:// or /" });
        body.push({ ...b, text: b.text.trim(), button: b.button.trim(), href: b.href.trim() });
      } else if (b.type === "youtube") {
        if (!b.id.trim()) continue;
        const id = ytId(b.id);
        if (!id) return setMsg({ ok: false, text: "That YouTube link is not valid." });
        body.push({ type: "youtube", id });
      }
    }
    setBusy(true);
    const r = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title: title.trim(), description: description.trim(), cover, body, status: to, topic, featured, author_name: authorName, author_photo: authorName ? authorPhoto : null }),
    });
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: "Could not save. Check the title, links and images." });
    setStatus(to);
    setSavedSnap(snap);
    const { unpinned } = await r.json().catch(() => ({ unpinned: null }));
    const done = to === "published" ? "Published. It is live now." : "Saved as draft.";
    setMsg({ ok: true, text: unpinned ? `${done} "${unpinned}" was moved off the ${FEATURED_LABELS[featured].toLowerCase()} spot.` : done });
    if (isNew) router.replace(`/admin/edit/${slug}`);
  }

  // Ctrl+S saves (keeps the current status: a draft stays a draft, a published post updates)
  const saveRef = useRef(save);
  const statusRef = useRef(status);
  useEffect(() => { saveRef.current = save; statusRef.current = status; }); // keep the shortcut pointing at the latest version
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); saveRef.current(statusRef.current); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!loaded) return <p className="px-7 py-10 text-white/70">{msg?.text ?? "Loading…"}</p>;

  const published = status === "published";
  const curBlock = blocks.find((b) => b.k === cur);
  const curKind = curBlock ? kindOf(curBlock) : null;
  const fb = (k: Kind) => `ed-fb ${curKind === k ? "ed-fb-on" : ""}`;
  const keep = (e: React.MouseEvent) => e.preventDefault(); // keeps the text selected while clicking a toolbar button

  // One set of drop handlers; each drop zone says where it is with data-i
  const zi = (e: React.DragEvent) => Number((e.currentTarget as HTMLElement).dataset.i);
  const onZoneOver = (e: React.DragEvent) => { if (!drag) return; e.preventDefault(); const i = zi(e); if (over !== i) setOver(i); };
  const onZoneLeave = (e: React.DragEvent) => { if (over === zi(e)) setOver(null); };
  const onZoneDrop = (e: React.DragEvent) => { e.preventDefault(); dropAt(zi(e)); };
  const startDrag = (e: React.DragEvent, d: Drag, image?: Element | null) => {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData("text/plain", d?.kind === "new" ? d.t : "move");
    if (image) e.dataTransfer.setDragImage(image, 24, 20);
    setTimeout(() => { setDrag(d); setDragging(true); }, 0); // after the drag has started, or Chrome cancels it
  };
  const endDrag = () => { setDrag(null); setDragging(false); setOver(null); };

  // What the live post would show right now (unfinished blocks are left out, like on save)
  const previewBlocks: Block[] = blocks.flatMap(({ k: _k, ...b }): Block[] => { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (b.type === "paragraph") return b.runs.some((r) => r.text.trim()) ? [b] : [];
    if (b.type === "heading" || b.type === "quote") return b.text.trim() ? [b] : [];
    if (b.type === "list") { const items = b.items.filter((t) => t.trim()); return items.length ? [{ ...b, items }] : []; }
    if (b.type === "image") return b.src ? [b] : [];
    if (b.type === "youtube") { const id = ytId(b.id); return id ? [{ type: "youtube", id }] : []; }
    if (b.type === "cta") return b.text.trim() && b.button.trim() && safeHref(b.href.trim()) ? [b] : [];
    return [b];
  });

  return (
    <div className={`ed ${preview ? "ed-previewing" : ""}`}>
      {/* ---------------- the text tools (thin bar, left) ---------------- */}
      {mode === "edit" && <nav className="ed-rail" role="toolbar" aria-orientation="vertical" aria-label="Text formatting">
        <button type="button" className={fb("p")} onMouseDown={keep} onClick={() => convert("p")} title="Normal text">P</button>
        <button type="button" className={fb("h1")} onMouseDown={keep} onClick={() => convert("h1")} title="Big heading">H1</button>
        <button type="button" className={fb("h2")} onMouseDown={keep} onClick={() => convert("h2")} title="Heading">H2</button>
        <button type="button" className={fb("h3")} onMouseDown={keep} onClick={() => convert("h3")} title="Small heading">H3</button>
        <span className="ed-fsep" aria-hidden="true" />
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={() => cmd("bold")} title="Bold (Ctrl+B)" aria-label="Bold"><b>B</b></button>
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={() => cmd("italic")} title="Italic (Ctrl+I)" aria-label="Italic"><i style={{ fontFamily: "Georgia, serif" }}>I</i></button>
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={() => cmd("underline")} title="Underline (Ctrl+U)" aria-label="Underline"><u>U</u></button>
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={() => cmd("strikeThrough")} title="Strike through" aria-label="Strike through"><s>S</s></button>
        <span className="ed-fsep" aria-hidden="true" />
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={openLink} title="Add link (Ctrl+K)" aria-label="Add link"><I d={ICON.link} /></button>
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={() => cmd("unlink")} title="Remove link" aria-label="Remove link"><I d={ICON.unlink} /></button>
        <span className="ed-fsep" aria-hidden="true" />
        <button type="button" className={fb("ul")} onMouseDown={keep} onClick={() => convert("ul")} title="Bullet list" aria-label="Bullet list"><I d={ICON.list} /></button>
        <button type="button" className={fb("ol")} onMouseDown={keep} onClick={() => convert("ol")} title="Numbered list" aria-label="Numbered list"><I d={ICON.olist} /></button>
        <button type="button" className={fb("quote")} onMouseDown={keep} onClick={() => convert("quote")} title="Quote" aria-label="Quote"><I d={ICON.quote} /></button>
        <span className="ed-fsep" aria-hidden="true" />
        <button type="button" className="ed-fb" onMouseDown={keep} onClick={() => cmd("removeFormat")} title="Clear formatting" aria-label="Clear formatting"><I d="M6 6h12M12 6l-3 12M4 20l16-16" /></button>
      </nav>}

      {/* ---------------- the page (middle) ---------------- */}
      {preview && (
        <main className="ed-main ed-prev" aria-label="Preview of the post">
          <div className="ed-prev-bar">Preview: this is how the post will look on hellofahim.com. Nothing here is saved or live.</div>
          <div className="page">
            <div className="post-page">
              <PostArticle title={title || "Post title"} description={description} blocks={previewBlocks}
                publishedAt={null} url={`https://hellofahim.com/blog/${slug || "your-post"}`} author={resolveAuthor(authorName, authorPhoto)} />
            </div>
            <FinalCta title={<>Want this for<br />your business?</>} />
          </div>
        </main>
      )}

      {mode === "md" && (
        <main className="ed-main ed-md" aria-label="Markdown view">
          <p className="ed-md-hint">Markdown view. Paste or write here. Switch to Edit and it turns into blocks: <b>#</b> title, <b>##</b> heading, <b>![alt](image)</b> empty image box, <b>:::cta</b> button box. Save from Edit or Preview.</p>
          <textarea className="ed-md-box" spellCheck={false} aria-label="Markdown" value={md} placeholder={PLACEHOLDER_MD} onChange={(e) => setMd(e.target.value)} />
        </main>
      )}

      {mode === "edit" && <main className="ed-main">
        {link && (
          <div className="ed-linkrow">
            <label className="ed-sr" htmlFor="ed-linkurl">Link address</label>
            <input id="ed-linkurl" autoFocus className="ed-inp" value={link.url} placeholder="https://… or /contact" onChange={(e) => setLink({ url: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } if (e.key === "Escape") { savedRange.current = null; setLink(null); } }} />
            <button type="button" className="ed-btn ed-btn-main" onClick={applyLink}>Add link</button>
            <button type="button" className="ed-btn" onClick={() => { savedRange.current = null; setLink(null); }}>Cancel</button>
          </div>
        )}
        {tip && <div className="ed-toast" role="status">{tip}</div>}

        <article className="ed-paper">
          <ImageDrop cover src={cover} onPick={setCover} title="Add a cover photo" hint="Click to choose, or drop a photo here. Shown at the top and when the post is shared." />

          <div className="mt-7">
            <textarea className="ed-title" rows={1} placeholder="Post title" aria-label="Post title" value={title}
              onChange={(e) => { const v = e.target.value.replace(/\n/g, " "); setTitle(v); if (!slugTouched) setSlug(slugify(v)); }} />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-sm text-[#9AA6CF]">
            <span>By Fahim</span><span aria-hidden="true">·</span><span>{published ? "Published" : "Draft"}</span>
          </div>
          <div className="mb-2.5 mt-5 h-px bg-white/10" />

          {blocks.map((b, i) => {
            const kind = kindOf(b);
            const isText = TEXT_KINDS.includes(kind);
            return (
              <div key={b.k}>
                <div className={`ed-zone ${dragging ? "show" : ""} ${dragging && over === i ? "on" : ""}`} data-i={i} onDragOver={onZoneOver} onDragLeave={onZoneLeave} onDrop={onZoneDrop} />
                <div className={`ed-blk ${cur === b.k ? "ed-blk-on" : ""}`} onFocus={() => cur !== b.k && setCur(b.k)} onMouseDown={() => cur !== b.k && setCur(b.k)}>
                  <button type="button" className="ed-grip" draggable aria-label="Drag to move this block" title="Drag to move"
                    onDragStart={(e) => startDrag(e, { kind: "move", k: b.k }, e.currentTarget.parentElement)} onDragEnd={endDrag}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor" aria-hidden="true"><circle cx="4" cy="4" r="1.6" /><circle cx="10" cy="4" r="1.6" /><circle cx="4" cy="10" r="1.6" /><circle cx="10" cy="10" r="1.6" /><circle cx="4" cy="16" r="1.6" /><circle cx="10" cy="16" r="1.6" /></svg>
                  </button>
                  <div className="ed-tools">
                    <button type="button" className="ed-tb" disabled={i === 0} onClick={() => swap(i, -1)} aria-label="Move up" title="Move up"><I d={ICON.up} size={16} /></button>
                    <button type="button" className="ed-tb" disabled={i === blocks.length - 1} onClick={() => swap(i, 1)} aria-label="Move down" title="Move down"><I d={ICON.down} size={16} /></button>
                    <button type="button" className="ed-tb ed-tb-del" onClick={() => removeK(b.k)} aria-label="Delete block" title="Delete"><I d={ICON.trash} size={16} /></button>
                  </div>

                  {isText && (
                    <Editable
                      k={b.k}
                      kind={kind}
                      tag={b.type === "list" ? (b.ordered ? "ol" : "ul") : "div"}
                      ph={PH[kind] ?? ""}
                      className={`ed-rich ${kind === "h1" || kind === "h2" || kind === "h3" || kind === "quote" ? `ed-${kind}` : ""}`}
                      html={
                        b.type === "paragraph" ? runsToHtml(b.runs)
                          : b.type === "list" ? (b.items.length ? b.items : [""]).map((t) => `<li>${esc(t) || "<br>"}</li>`).join("")
                            : esc(plainText(b))
                      }
                      reg={reg}
                      onKeyDown={(e) => onTextKey(e, b, i)}
                      onSync={(el) => {
                        if (b.type === "paragraph") updK(b.k, { runs: htmlToRuns(el) });
                        else if (b.type === "list") updK(b.k, { items: [...el.querySelectorAll("li")].map((x) => (x.textContent ?? "").replace(/\u00a0/g, " ")) });
                        else updK(b.k, { text: (el.textContent ?? "").replace(/\u00a0/g, " ") });
                      }}
                    />
                  )}

                  {!isText && <div className="ed-kindrow ed-kick">{LABEL[kind]}</div>}

                  {b.type === "image" && (
                    <div className="flex flex-col gap-2.5">
                      <ImageDrop src={b.src || null} autoPick={pickKey === b.k} onPick={(s) => updK(b.k, { src: s ?? "" })} title="Add an image" hint="Click to choose, or drop a photo here. It gets resized and turned into WebP." />
                      <label className="ed-label" htmlFor={`alt-${b.k}`}>Describe the image</label>
                      <input id={`alt-${b.k}`} className="ed-inp" value={b.alt} placeholder="What is in the photo? Helps Google and screen readers." onChange={(e) => updK(b.k, { alt: e.target.value })} />
                    </div>
                  )}

                  {b.type === "youtube" && (
                    <div className="flex flex-col gap-2.5">
                      <label className="ed-label" htmlFor={`yt-${b.k}`}>YouTube link</label>
                      <input id={`yt-${b.k}`} className="ed-inp" value={b.id} placeholder="https://www.youtube.com/watch?v=…" onChange={(e) => updK(b.k, { id: e.target.value })} />
                      {ytId(b.id) ? (
                        <div className="ed-yt" style={{ padding: 0, overflow: "hidden" }}>
                          <iframe src={`https://www.youtube-nocookie.com/embed/${ytId(b.id)}`} title="YouTube video preview" loading="lazy" allowFullScreen style={{ width: "100%", height: "100%", border: 0 }} />
                        </div>
                      ) : (
                        <div className="ed-yt"><I d={ICON.youtube} size={44} /><span>Paste a link above and the video shows here.</span></div>
                      )}
                    </div>
                  )}

                  {b.type === "cta" && (
                    <div className="flex flex-col gap-2.5">
                      <label className="ed-label" htmlFor={`m-${b.k}`}>Message</label>
                      <input id={`m-${b.k}`} className="ed-inp" value={b.text} placeholder="Want help with this on your site?" onChange={(e) => updK(b.k, { text: e.target.value })} />
                      <div className="ed-grid2">
                        <div className="flex flex-col gap-1.5">
                          <label className="ed-label" htmlFor={`bt-${b.k}`}>Button text</label>
                          <input id={`bt-${b.k}`} className="ed-inp" value={b.button} placeholder="Book a free call" onChange={(e) => updK(b.k, { button: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="ed-label" htmlFor={`bl-${b.k}`}>Button link</label>
                          <input id={`bl-${b.k}`} className="ed-inp" value={b.href} placeholder="/contact" onChange={(e) => updK(b.k, { href: e.target.value })} />
                          <span className="ed-hint">Pages on this site: /contact. Other sites: the full https:// address.</span>
                        </div>
                      </div>
                      <span className="ed-hint">Preview on the post:</span>
                      <div className="ed-cta-prev">
                        <span className="text-base font-semibold text-white">{b.text || "Your message"}</span>
                        <span className="ed-pill">{(b.button || "Button") + " →"}</span>
                      </div>
                    </div>
                  )}

                  {b.type === "divider" && <hr className="mb-2 mt-1.5 border-0 border-t border-white/20" />}
                </div>
              </div>
            );
          })}

          <div className={`ed-end ${dragging ? "show" : ""} ${dragging && over === blocks.length ? "on" : ""}`} data-i={blocks.length} onDragOver={onZoneOver} onDragLeave={onZoneLeave} onDrop={onZoneDrop}>
            <span>{dragging ? "Drop here to add it at the end" : "Drag a block here, or click one in the panel on the right"}</span>
          </div>
        </article>
      </main>}

      {/* ---------------- the drawer (right) ---------------- */}
      <aside className="ed-side" aria-label="Editor tools">
        <Link href="/admin" className="text-sm text-white/70 hover:text-white">← All posts</Link>

        <section className="ed-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="ed-kick">This post</span>
            <span className={`ed-chip ${published ? "ed-chip-live" : "ed-chip-draft"}`}>{published ? "Published" : "Draft"}</span>
          </div>
          <button type="button" className="ed-btn ed-btn-main" disabled={busy} onClick={() => save("published")}>{busy ? "Saving…" : published ? "Update" : "Publish"}</button>
          <button type="button" className="ed-btn" disabled={busy} onClick={() => save("draft")}>{published ? "Unpublish (save as draft)" : "Save draft"}</button>
          <div className="flex items-center justify-between gap-2">
            {published ? <a href={`/blog/${slug}`} target="_blank" className="text-sm text-[#FFB27A] underline hover:text-[#FFD2B0]">View live post</a> : <span />}
            <span className="text-right text-[13px]" aria-live="polite">
              {msg ? <span className={msg.ok ? "text-[#7BE0B0]" : "text-red-300"}>{msg.text}</span> : dirty ? <span className="text-[#FFC48A]">● Unsaved changes</span> : <span className="text-[#9AA6CF]">All saved</span>}
            </span>
          </div>
        </section>

        <div className="ed-tabs" role="tablist" aria-label="View">
          {(["edit", "md", "preview"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} className={`ed-tab ${mode === m ? "ed-tab-on" : ""}`} onClick={() => switchMode(m)}>
              {m === "edit" ? "Edit" : m === "md" ? "Markdown" : "Preview"}
            </button>
          ))}
        </div>

        <div className="ed-tabs" role="tablist" aria-label="Panel">
          <button type="button" role="tab" aria-selected={tab === "blocks"} className={`ed-tab ${tab === "blocks" ? "ed-tab-on" : ""}`} onClick={() => setTab("blocks")}>Blocks</button>
          <button type="button" role="tab" aria-selected={tab === "settings"} className={`ed-tab ${tab === "settings" ? "ed-tab-on" : ""}`} onClick={() => setTab("settings")}>Post settings</button>
        </div>

        {tab === "blocks" ? (
          <section className="flex flex-col gap-2.5">
            <p className="ed-hint" style={{ fontSize: 13 }}>Drag a block onto the page. Or click one to add it under the block you are on.</p>
            <div className="ed-pal">
              {PALETTE.map((p) => (
                <button key={p.t} type="button" className="ed-pal-item" draggable onDragStart={(e) => startDrag(e, { kind: "new", t: p.t })} onDragEnd={endDrag} onClick={() => addBelowCurrent(p.t)}>
                  <I d={p.icon} size={20} />
                  <span className="ed-pal-name">{p.name}</span>
                  <span className="ed-pal-desc">{p.desc}</span>
                </button>
              ))}
            </div>
            <div className="ed-card" style={{ padding: "12px 14px" }}>
              <p className="ed-hint">Enter: new paragraph. Backspace in an empty block deletes it. Drag the dots on the left of a block to move it. Ctrl+S saves.</p>
            </div>
          </section>
        ) : (
          <section className="ed-card flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="ed-label" htmlFor="ed-slug">Web address</label>
              <div className="ed-slug">
                <span className="ed-hint whitespace-nowrap pl-3">/blog/</span>
                <input id="ed-slug" className="ed-inp" value={slug} disabled={!isNew} placeholder="my-post" onChange={(e) => { setSlugTouched(true); setSlug(e.target.value.toLowerCase().replace(/\s/g, "-")); }} />
              </div>
              <span className="ed-hint">{isNew ? "Made from the title. You can change it before the first save." : "Fixed after the first save, so old links never break."}</span>
            </div>
            <div className="ed-grid2">
              <div className="flex flex-col gap-1.5">
                <label className="ed-label" htmlFor="ed-topic">Topic</label>
                {newTopic === null ? (
                  <select id="ed-topic" className="ed-inp" value={topic} onChange={(e) => (e.target.value === "__new__" ? setNewTopic("") : setTopic(e.target.value))}>
                    <option value="">No topic</option>
                    {sortTopics([...knownTopics, topic]).map((t) => <option key={t} value={t}>{t}</option>)}
                    <option value={"__new__"}>+ New topic…</option>
                  </select>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <input id="ed-topic" className="ed-inp" autoFocus maxLength={40} placeholder="e.g. AI agents" value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTopic(); } if (e.key === "Escape") setNewTopic(null); }} />
                    <div className="flex gap-2">
                      <button type="button" className="ed-btn ed-btn-sm ed-btn-main" onClick={addTopic}>Add</button>
                      <button type="button" className="ed-btn ed-btn-sm" onClick={() => setNewTopic(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="ed-label" htmlFor="ed-feat">Show at the top of the blog</label>
                <select id="ed-feat" className="ed-inp" value={featured} onChange={(e) => setFeatured(Number(e.target.value))}>
                  {FEATURED_LABELS.map((l, i) => <option key={l} value={i}>{l}</option>)}
                </select>
              </div>
            </div>
            <span className="ed-hint -mt-2">Topic = the tab it shows under on /blog. Top spot: each spot holds one post; empty spots show your newest posts.</span>
            <div className="flex flex-col gap-1.5">
              <label className="ed-label" htmlFor="ed-author">Author</label>
              {newAuthor === null ? (
                <select id="ed-author" className="ed-inp" value={authorName}
                  onChange={(e) => { const v = e.target.value; if (v === "__new__") setNewAuthor({ name: "", photo: null }); else { setAuthorName(v); setAuthorPhoto(v ? authors[v] ?? null : null); } }}>
                  <option value="">{DEFAULT_AUTHOR.name}</option>
                  {Object.keys({ ...authors, ...(authorName ? { [authorName]: 1 } : {}) }).sort((a, b) => a.localeCompare(b)).map((n) => <option key={n} value={n}>{n}</option>)}
                  <option value="__new__">+ New author…</option>
                </select>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <input id="ed-author" className="ed-inp" autoFocus maxLength={60} placeholder="Author name" value={newAuthor.name}
                    onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAuthor(); } if (e.key === "Escape") setNewAuthor(null); }} />
                  <ImageDrop small src={newAuthor.photo} onPick={(photo) => setNewAuthor({ ...newAuthor, photo })} title="Add a photo (optional)" hint="Without a photo, a badge with their initials shows." />
                  <div className="flex gap-2">
                    <button type="button" className="ed-btn ed-btn-sm ed-btn-main" onClick={addAuthor}>Add</button>
                    <button type="button" className="ed-btn ed-btn-sm" onClick={() => setNewAuthor(null)}>Cancel</button>
                  </div>
                </div>
              )}
              <span className="ed-hint">Shown on the post and on the blog list. Posts keep one author each.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="ed-label" htmlFor="ed-desc">Short description for Google</label>
              <textarea id="ed-desc" className="ed-inp" rows={4} value={description} placeholder="One or two sentences that make people want to click." onChange={(e) => setDescription(e.target.value)} />
              <span className={`ed-hint ${description.length > 155 ? "ed-warn" : ""}`}>{description.length} / 155 characters</span>
            </div>
            <div className="flex justify-between">
              <span className="ed-label">Title length</span>
              <span className={`ed-hint ${title.length > 60 ? "ed-warn" : ""}`}>{title.length} / 60</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="ed-label">How it looks on Google</span>
              <div className="ed-gprev">
                <span className="text-xs text-[#202124]">hellofahim.com › blog › {slug || "…"}</span>
                <span className="text-lg leading-snug text-[#1a0dab]">{cut(title || "Your post title", 60)}</span>
                <span className="text-[13px] leading-normal text-[#4d5156]">{cut(description || "Your short description appears here.", 155)}</span>
              </div>
            </div>
          </section>
        )}
      </aside>
    </div>
  );
}
