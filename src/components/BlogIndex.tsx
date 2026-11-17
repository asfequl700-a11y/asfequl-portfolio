"use client";
import Link from "next/link";
import { useState } from "react";
import Avatar from "./Avatar";
import { shortName, type Author } from "@/lib/blog-shared";

export type Card = { slug: string; title: string; description: string; cover: string | null; topic: string; date: string; mins: number; author: Author };

const GRID = 6; // cover cards under the top 3
const STEP = 10; // older posts shown per "Load more"

const monthOf = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
const short = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// A post without a cover gets a navy panel with its topic, so the grid never has holes.
function Pic({ p, className }: { p: Card; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (p.cover) return <img src={p.cover} alt="" loading="lazy" className={className} />;
  return <div className="bl-art"><span>{p.topic || "Blog"}</span></div>;
}

function Meta({ p, author }: { p: Card; author?: boolean }) {
  return (
    <div className="bl-meta">
      {author && <Avatar name={p.author.name} photo={p.author.photo} size={22} decorative />}
      {author ? `${shortName(p.author)} · ` : ""}{short(p.date)}
      <span className="bl-mins">{p.mins} min</span>
    </div>
  );
}

// top = the 3 posts at the top (big, small, small); rest = everything else, newest first. Each post appears once.
export default function BlogIndex({ top, rest, topics }: { top: Card[]; rest: Card[]; topics: string[] }) {
  const all = [...top, ...rest].sort((a, b) => b.date.localeCompare(a.date));
  const [topic, setTopic] = useState("All");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(STEP);

  const filtering = topic !== "All" || q.trim() !== "";
  const needle = q.trim().toLowerCase();
  // With a topic or search: every matching post (top 3 included). Otherwise: the normal layout.
  const list = filtering
    ? all.filter((p) => (topic === "All" || p.topic === topic) && (!needle || `${p.title} ${p.description}`.toLowerCase().includes(needle)))
    : rest;
  const cards = list.slice(0, GRID);
  const older = list.slice(GRID, GRID + shown);
  const months = older.reduce<[string, Card[]][]>((acc, p) => {
    const m = monthOf(p.date);
    const last = acc[acc.length - 1];
    if (last && last[0] === m) last[1].push(p);
    else acc.push([m, [p]]);
    return acc;
  }, []);
  const pick = (t: string) => { setTopic(t); setShown(STEP); };

  const [big, ...small] = top;
  return (
    <>
      {!filtering && big && (
        <section className={`bl-feat${small.length ? "" : " solo"}`} aria-label="Featured posts">
          <Link className="bl-big" href={`/blog/${big.slug}`}>
            <Pic p={big} />
            <div className="bl-big-in">
              <span className="bl-mono bl-label">{big.topic ? `Featured · ${big.topic}` : "Featured"}</span>
              <h2>{big.title}</h2>
              {big.description && <p>{big.description}</p>}
              <Meta p={big} author />
            </div>
          </Link>
          {small.length > 0 && (
            <div className="bl-side">
              {small.map((p) => (
                <Link key={p.slug} className="bl-small" href={`/blog/${p.slug}`}>
                  <div className="bl-pic"><Pic p={p} /></div>
                  <div className="bl-small-in">
                    {p.topic && <span className="bl-mono bl-topic">{p.topic}</span>}
                    <h3>{p.title}</h3>
                    <Meta p={p} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="bl-bar">
        <div className="bl-tabs" role="tablist" aria-label="Topics">
          {["All", ...topics].map((t) => (
            <button key={t} type="button" role="tab" aria-selected={topic === t} className="bl-tab" onClick={() => pick(t)}>
              {t}<sup>{t === "All" ? all.length : all.filter((p) => p.topic === t).length}</sup>
            </button>
          ))}
        </div>
        <label className="bl-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input id="bl-q" type="search" placeholder="Search posts" aria-label="Search posts" value={q} onChange={(e) => { setQ(e.target.value); setShown(STEP); }} />
        </label>
      </div>

      {filtering && list.length === 0 && <p className="bl-empty">No posts match. Try another topic or word.</p>}

      {cards.length > 0 && (
        <section className="bl-grid" aria-live="polite">
          {cards.map((p) => (
            <Link key={p.slug} className="bl-card" href={`/blog/${p.slug}`}>
              <div className="bl-thumb">
                {p.topic && <span className="bl-mono">{p.topic}</span>}
                <Pic p={p} />
              </div>
              <h3>{p.title}</h3>
              {p.description && <p>{p.description}</p>}
              <Meta p={p} author />
            </Link>
          ))}
        </section>
      )}

      {months.length > 0 && (
        <section className="bl-arch">
          <h2>Older posts</h2>
          {months.map(([m, ps]) => (
            <div key={m} className="bl-month">
              <span className="bl-mono">{m}</span>
              <div>
                {ps.map((p) => (
                  <Link key={p.slug} className="bl-row" href={`/blog/${p.slug}`}>
                    <time dateTime={p.date}>{day(p.date)}</time>
                    <span>{p.title}</span>
                    <em>{p.topic}</em>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
      {list.length > GRID + shown && (
        <div className="bl-more"><button type="button" onClick={() => setShown((n) => n + STEP)}>Load more</button></div>
      )}
    </>
  );
}
