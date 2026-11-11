"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ensureSmoother, gsap, refreshSoon, isMobile, reducedMotion, ScrollTrigger } from "../lib/gsap";

// Shared animations from the mockups (ran on every page): smooth scroll, pinned service cards,
// count-up numbers, chart lines drawing, section headings rising in. Re-runs on every route change.
export default function SiteFx() {
  const path = usePathname();
  useEffect(() => {
    const reduce = reducedMotion();
    const smoother = ensureSmoother();
    smoother?.scrollTop(0);
    const ac = new AbortController();
    const ctx = gsap.context(() => {
      const row = document.querySelector(".xrow");
      // shortcut: mobile check happens once per page load; resizing across 900px needs a reload
      if (row && !isMobile()) {
        // Card scenes are drawn at 600x300 and scaled to fit the room left in each card.
        const fit = new ResizeObserver((entries) => entries.forEach(({ target, contentRect: { width: w, height: h } }) => {
          const k = Math.min(w / 600, h / 300);
          const el = target as HTMLElement;
          el.style.setProperty("--k", String(k));
          el.style.setProperty("--x", (w - 600 * k) / 2 + "px");
          el.style.setProperty("--y", (h - 300 * k) / 2 + "px");
        }));
        row.querySelectorAll(".xc-scene").forEach((s) => fit.observe(s));
        ac.signal.addEventListener("abort", () => fit.disconnect());
      }
      if (row && !reduce && !isMobile()) {
        // Pinned cards: the open card is driven by scroll position (scrub), so fast scrolling
        // always lands in the right state. Card 1 open -> card 2 open -> card 3 open.
        const cards = gsap.utils.toArray<HTMLElement>(".xc", row);
        const q = (c: HTMLElement, s: string) => c.querySelector(s);
        const open = { flexGrow: 4.2, backgroundColor: "#FFFFFF", color: "#141821" };
        const shut = { flexGrow: 1, backgroundColor: "#101935", color: "#EEF1F8" };
        row.classList.add("scrub");
        cards.forEach((c, j) => {
          gsap.set(c, j ? shut : open);
          gsap.set(q(c, ".xc-open"), j ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 });
          gsap.set(q(c, ".xc-closed"), { opacity: j ? 1 : 0 });
        });
        const at: number[] = [0.25]; // timeline time where each card is fully open
        const tl = gsap.timeline({ defaults: { ease: "none" } }).to({}, { duration: 0.5 });
        for (let j = 1; j < cards.length; j++) {
          const a = cards[j - 1], b = cards[j], t = tl.duration();
          tl.to(a, { ...shut, duration: 1 }, t)
            .to(b, { ...open, duration: 1 }, t)
            .to(q(a, ".xc-open"), { opacity: 0, y: 16, duration: 0.35 }, t)
            .to(q(a, ".xc-closed"), { opacity: 1, duration: 0.4 }, t + 0.5)
            .to(q(b, ".xc-closed"), { opacity: 0, duration: 0.3 }, t)
            .to(q(b, ".xc-open"), { opacity: 1, y: 0, duration: 0.5 }, t + 0.5)
            .to({}, { duration: j < cards.length - 1 ? 1 : 0.5 });
          at.push(t + 1 + (j < cards.length - 1 ? 0.5 : 0.25));
        }
        const mark = () => {
          const t = tl.time();
          const k = at.reduce((best, v, i) => (Math.abs(v - t) < Math.abs(at[best] - t) ? i : best), 0);
          cards.forEach((c, j) => c.classList.toggle("on", j === k));
        };
        tl.eventCallback("onUpdate", mark);
        // Hover/focus previews a card by moving the timeline; the next scroll takes over again.
        // The cards resize under a resting cursor while scrolling, which fires mouseenter: ignore hover right after a scroll.
        let preview: gsap.core.Tween | null = null;
        let lastScroll = 0;
        const calm = () => performance.now() - lastScroll > 400;
        const st = ScrollTrigger.create({
          trigger: "#svc", start: "top top", end: () => "+=" + 3 * window.innerHeight, pin: true, scrub: 0.4, animation: tl,
          onUpdate: () => { lastScroll = performance.now(); preview?.kill(); preview = null; },
        });
        const show = (j: number) => { if (calm()) preview = gsap.to(tl, { time: at[j], duration: 0.6, ease: "power2.out", overwrite: true }); };
        cards.forEach((c, j) => {
          c.addEventListener("mouseenter", () => show(j), { signal: ac.signal });
          c.addEventListener("focus", () => show(j), { signal: ac.signal });
        });
        row.addEventListener("mouseleave", () => { if (calm()) preview = gsap.to(tl, { progress: st.progress, duration: 0.6, ease: "power2.out", overwrite: true }); }, { signal: ac.signal });
        ac.signal.addEventListener("abort", () => row.classList.remove("scrub"));
      }
      gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
        const t = el.textContent ?? "";
        const m = t.match(/[\d.]+/);
        if (!m) return;
        const end = parseFloat(m[0]);
        const o = { v: 0 };
        gsap.to(o, {
          v: end, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => { el.textContent = t.replace(m[0], String(end % 1 ? o.v.toFixed(1) : Math.round(o.v))); },
          onComplete: () => { el.textContent = t; },
        });
      });
      gsap.utils.toArray<SVGPathElement>(".wspark .line").forEach((p) => {
        p.style.animation = "none";
        gsap.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", scrollTrigger: { trigger: p, start: "top 85%" } });
      });
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>(".sec h2").forEach((h) => {
          gsap.from(h, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 88%" } });
        });
      }
    });
    refreshSoon();
    // Late fonts and images shift the layout; measure the pins again once they are in.
    const again = () => { if (!ac.signal.aborted) refreshSoon(); };
    if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(again);
    if (document.readyState !== "complete") window.addEventListener("load", again, { once: true, signal: ac.signal });
    return () => { ac.abort(); ctx.revert(); };
  }, [path]);
  return null;
}
