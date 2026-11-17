"use client";
import { useEffect, useRef, useState } from "react";

export type TocItem = { id: string; text: string };

// "This article covers": a sticky list beside the post on wide screens, a fold-out box on phones.
// The section being read is highlighted. Built from the post's H2 headings, so it updates itself.
// side = sticky list beside the post (wide screens); fold = box under the author row (phones)
export default function PostToc({ items, mode }: { items: TocItem[]; mode: "side" | "fold" }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((t) => document.getElementById(t.id)).filter((e): e is HTMLElement => !!e);
    const onScroll = () => {
      // the last heading above the top third of the screen is the section being read
      let cur = els[0]?.id ?? "";
      for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight * 0.3) cur = el.id;
      setActive(cur);
    };
    onScroll();
    // capture: also fires when an inner box scrolls (the editor preview)
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, [items]);

  // side list starts level with the author row (the title above it can be 1 or 3 lines long)
  const sideRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = sideRef.current;
    const art = nav?.parentElement;
    const meta = art?.querySelector<HTMLElement>(".post-meta");
    if (!nav || !art || !meta) return;
    const place = () => nav.style.setProperty("--toc-top", `${meta.getBoundingClientRect().top - art.getBoundingClientRect().top}px`);
    place();
    const ro = new ResizeObserver(place);
    ro.observe(art);
    return () => ro.disconnect();
  }, [mode]);

  const list = (
    <ol className="toc-list">
      {items.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className={active === t.id ? "on" : undefined} aria-current={active === t.id ? "location" : undefined}>{t.text}</a>
        </li>
      ))}
    </ol>
  );
  if (mode === "side")
    return (
      <nav ref={sideRef} className="toc toc-side" aria-label="This article covers">
        <p className="toc-title">This article covers</p>
        {list}
      </nav>
    );
  return (
    <details className="toc toc-fold">
      <summary className="toc-title">This article covers</summary>
      {list}
    </details>
  );
}
