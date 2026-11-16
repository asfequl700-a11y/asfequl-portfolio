"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { safeHref, SLUG_RE, type Block, type Run } from "@/lib/blog-shared";

type EBlock = Block & { k: string }; // k = key for React (YouTube blocks already use "id" for the video)
type Fmt = { bold?: boolean; italic?: boolean; href?: string };

const newId = () => crypto.randomUUID();
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const ytId = (s: string) => (/^[\w-]{11}$/.test(s.trim()) ? s.trim() : s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? "");

// ---- paragraph text <-> runs (bold / italic / link) ----
const runsToHtml = (runs: Run[]) =>
  runs.map((r) => {
    let h = esc(r.text);
    if (r.bold) h = `<strong>${h}</strong>`;
    if (r.italic) h = `<em>${h}</em>`;
    if (r.href) h = `<a href="${esc(r.href)}">${h}</a>`;
    return h;
  }).join("");

function htmlToRuns(root: HTMLElement): Run[] {
  const out: Run[] = [];
  const push = (text: string, f: Fmt) => {
    const last = out[out.length - 1];
    if (last && !!last.bold === !!f.bold && !!last.italic === !!f.italic && last.href === f.href) last.text += text;
    else out.push({ text, ...(f.bold ? { bold: true } : {}), ...(f.italic ? { italic: true } : {}), ...(f.href ? { href: f.href } : {}) });
  };
  const walk = (n: Node, f: Fmt) => {
    if (n.nodeType === 3) {
      const t = (n.textContent ?? "").replace(/\s*\n\s*/g, " ").replace(/ /g, " ");
      if (t) push(t, f);
      return;
    }
    if (n.nodeType !== 1) return;
    const el = n as HTMLElement;
    const nf = { ...f };
    const w = el.style.fontWeight;
    if (el.tagName === "B" || el.tagName === "STRONG" || w === "bold" || +w >= 600) nf.bold = true;
    if (el.tagName === "I" || el.tagName === "EM" || el.style.fontStyle === "italic") nf.italic = true;
    if (el.tagName === "A") {
      const h = el.getAttribute("href") ?? "";
      if (safeHref(h)) nf.href = h;
    }
    el.childNodes.forEach((c) => walk(c, nf));
  };
  root.childNodes.forEach((c) => walk(c, {}));
  return out;
}

function RichText({ runs, onChange, onEnter, autoFocus }: { runs: Run[]; onChange: (r: Run[]) => void; onEnter: () => void; autoFocus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // filled once: the box then owns its text (re-rendering it on every key would jump the cursor)
    if (ref.current) ref.current.innerHTML = runsToHtml(runs);
    if (autoFocus) ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sync = () => ref.current && onChange(htmlToRuns(ref.current));
  const cmd = (c: string, v?: string) => { document.execCommand(c, false, v); sync(); };
  const link = () => {
    let u = prompt("Link address (for example https://example.com or /contact)?");
    if (!u) return;
    u = u.trim();
    if (!/^(https?:\/\/|\/|mailto:|#)/.test(u)) u = "https://" + u;
    cmd("createLink", u);
  };
  const btn = "rounded border border-[#DAD5CB] bg-white px-2.5 py-1 text-sm hover:bg-[#F1ECE0]";
  return (
    <div>
      <div className="mb-1 flex gap-1.5">
        <button type="button" className={`${btn} font-bold`} onMouseDown={(e) => { e.preventDefault(); cmd("bold"); }}>B</button>
        <button type="button" className={`${btn} italic`} onMouseDown={(e) => { e.preventDefault(); cmd("italic"); }}>I</button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); link(); }}>Link</button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); cmd("unlink"); }}>Remove link</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } }}
        onPaste={(e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); }} // plain text only
        className="min-h-[3.5rem] rounded-lg border border-[#DAD5CB] bg-white px-3 py-2 text-lg leading-relaxed outline-none focus:border-[#FF6B1A] [&_a]:text-[#FF6B1A] [&_a]:underline"
      />
    </div>
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

function ImagePicker({ src, onPick, label }: { src: string | null; onPick: (s: string | null) => void; label: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(f: File | undefined) {
    if (!f) return;
    setBusy(true); setErr("");
    try { onPick(await uploadImage(f)); } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  return (
    <div className="flex flex-col gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" className="max-h-48 w-auto rounded-lg" />}
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-full border border-[#0E1530] px-4 py-1.5 text-sm font-semibold">
          {busy ? "Uploading…" : src ? `Change ${label}` : `Add ${label}`}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        {src && <button type="button" onClick={() => onPick(null)} className="text-sm text-red-600 underline">Remove</button>}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </div>
  );
}

const field = "box-border w-full rounded-lg border border-[#DAD5CB] bg-white px-3 py-2 outline-none focus:border-[#FF6B1A]";
const small = "rounded border border-[#DAD5CB] bg-white px-2 py-1 text-xs disabled:opacity-30";

export default function PostEditor({ slug: editSlug }: { slug?: string }) {
  const router = useRouter();
  const isNew = !editSlug;
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(editSlug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [blocks, setBlocks] = useState<EBlock[]>(isNew ? [{ k: newId(), type: "paragraph", runs: [] }] : []);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (!editSlug) return;
    fetch(`/api/admin/posts/${editSlug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => {
        setTitle(p.title); setDescription(p.description); setCover(p.cover); setStatus(p.status);
        setBlocks((p.body as Block[]).map((b) => ({ ...b, k: newId() })));
        setLoaded(true);
      })
      .catch(() => setMsg({ ok: false, text: "Could not load this post." }));
  }, [editSlug]);

  const upd = (i: number, patch: Partial<Block>) => setBlocks((bs) => bs.map((b, j) => (j === i ? ({ ...b, ...patch } as EBlock) : b)));
  const move = (i: number, d: number) => setBlocks((bs) => { const a = [...bs]; [a[i], a[i + d]] = [a[i + d], a[i]]; return a; });
  const remove = (i: number) => setBlocks((bs) => bs.filter((_, j) => j !== i));
  const insertAfter = (i: number, b: Block) => { const k = newId(); setBlocks((bs) => [...bs.slice(0, i + 1), { ...b, k }, ...bs.slice(i + 1)]); setFocusId(k); };
  const add = (b: Block) => insertAfter(blocks.length - 1, b);

  async function save(to: "draft" | "published") {
    setMsg(null);
    if (!title.trim()) return setMsg({ ok: false, text: "Add a title first." });
    if (!SLUG_RE.test(slug)) return setMsg({ ok: false, text: "The web address (slug) can only have small letters, numbers and dashes." });
    const body: Block[] = [];
    for (const { k: _k, ...b } of blocks) { // eslint-disable-line @typescript-eslint/no-unused-vars
      if (b.type === "paragraph") { if (b.runs.length) body.push(b); }
      else if (b.type === "heading") { if (b.text.trim()) body.push({ ...b, text: b.text.trim() }); }
      else if (b.type === "list") { const items = b.items.map((t) => t.trim()).filter(Boolean); if (items.length) body.push({ type: "list", items }); }
      else if (b.type === "image") { if (b.src) body.push(b); }
      else if (b.type === "cta") {
        if (!b.text.trim() && !b.button.trim() && !b.href.trim()) continue;
        if (!b.text.trim() || !b.button.trim() || !safeHref(b.href.trim())) return setMsg({ ok: false, text: "A button block needs text, a button label and a link that starts with https:// or /" });
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
      body: JSON.stringify({ slug, title: title.trim(), description: description.trim(), cover, body, status: to }),
    });
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: "Could not save. Check the title, links and images." });
    setStatus(to);
    setMsg({ ok: true, text: to === "published" ? "Published. It is live now." : "Saved as draft." });
    if (isNew) router.replace(`/admin/edit/${slug}`);
  }

  if (!loaded) return <p>{msg?.text ?? "Loading…"}</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="text-sm underline">← All posts</Link>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{status}</span>
      </div>

      <input className={`${field} !border-0 !bg-transparent !px-0 text-4xl font-bold`} placeholder="Post title" value={title}
        onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold">Web address
          <div className="flex items-center gap-1 font-normal"><span className="text-[#5A6380]">/blog/</span>
            <input className={field} value={slug} disabled={!isNew} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value.toLowerCase()); }} /></div>
          {!isNew && <span className="text-xs font-normal text-[#5A6380]">Fixed after the first save, so old links never break.</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Short description for Google ({description.length}/155)
          <textarea className={`${field} font-normal`} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>

      <div><p className="mb-2 text-sm font-semibold">Cover image (shown when the post is shared)</p><ImagePicker src={cover} onPick={setCover} label="cover" /></div>

      <div className="flex flex-col gap-4">
        {blocks.map((b, i) => (
          <div key={b.k} className="rounded-xl border border-[#DAD5CB] bg-[#FBF9F3] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#5A6380]">{{ paragraph: "Text", heading: "Heading", list: "List", image: "Image", cta: "Button box", youtube: "YouTube video" }[b.type]}</span>
              <span className="flex gap-1">
                <button type="button" className={small} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                <button type="button" className={small} disabled={i === blocks.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button type="button" className={`${small} text-red-600`} onClick={() => remove(i)}>Delete</button>
              </span>
            </div>
            {b.type === "paragraph" && <RichText runs={b.runs} autoFocus={focusId === b.k} onChange={(runs) => upd(i, { runs })} onEnter={() => insertAfter(i, { type: "paragraph", runs: [] })} />}
            {b.type === "heading" && <input className={`${field} text-2xl font-bold`} placeholder="Heading" value={b.text} onChange={(e) => upd(i, { text: e.target.value })} />}
            {b.type === "list" && <textarea className={field} rows={4} placeholder="One point per line" value={b.items.join("\n")} onChange={(e) => upd(i, { items: e.target.value.split("\n") })} />}
            {b.type === "image" && (
              <div className="flex flex-col gap-2">
                <ImagePicker src={b.src || null} onPick={(s) => upd(i, { src: s ?? "" })} label="image" />
                <input className={field} placeholder="Describe the image (helps Google and blind readers)" value={b.alt} onChange={(e) => upd(i, { alt: e.target.value })} />
              </div>
            )}
            {b.type === "cta" && (
              <div className="grid gap-2">
                <input className={field} placeholder="Message, e.g. Want help with this on your site?" value={b.text} onChange={(e) => upd(i, { text: e.target.value })} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={field} placeholder="Button text, e.g. Book a free call" value={b.button} onChange={(e) => upd(i, { button: e.target.value })} />
                  <input className={field} placeholder="Link, e.g. /contact" value={b.href} onChange={(e) => upd(i, { href: e.target.value })} />
                </div>
              </div>
            )}
            {b.type === "youtube" && <input className={field} placeholder="Paste the YouTube link" value={b.id} onChange={(e) => upd(i, { id: e.target.value })} />}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="self-center text-sm font-semibold">Add:</span>
        {([
          ["Text", { type: "paragraph", runs: [] }], ["Heading", { type: "heading", text: "" }], ["List", { type: "list", items: [""] }],
          ["Image", { type: "image", src: "", alt: "" }], ["Button box", { type: "cta", text: "", button: "Book a free call", href: "/contact" }], ["YouTube", { type: "youtube", id: "" }],
        ] as [string, Block][]).map(([name, blk]) => (
          <button key={name} type="button" className="rounded-full border border-[#0E1530] px-4 py-1.5 text-sm font-semibold hover:bg-white" onClick={() => add(blk)}>+ {name}</button>
        ))}
      </div>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#DAD5CB] bg-white/95 p-3 shadow-lg backdrop-blur">
        <button type="button" disabled={busy} onClick={() => save("published")} className="rounded-full bg-[#FF6B1A] px-6 py-2.5 font-semibold text-white disabled:opacity-50">{status === "published" ? "Update" : "Publish"}</button>
        <button type="button" disabled={busy} onClick={() => save("draft")} className="rounded-full border border-[#0E1530] px-5 py-2.5 font-semibold disabled:opacity-50">{status === "published" ? "Unpublish (save as draft)" : "Save draft"}</button>
        {status === "published" && <a href={`/blog/${slug}`} target="_blank" className="text-sm underline">View live post</a>}
        {msg && <span className={`text-sm font-semibold ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}
