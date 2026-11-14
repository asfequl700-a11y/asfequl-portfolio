"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ensureSmoother, gsap, refreshSoon, isMobile, reducedMotion, ScrollTrigger, snapPts } from "../lib/gsap";

// Shared animations from the mockups (ran on every page): smooth scroll, pinned service cards,
// count-up numbers, chart lines drawing, section headings rising in. Re-runs on every route change.
export default function SiteFx() {
  const path = usePathname();
  useEffect(() => {
    const reduce = reducedMotion();
    const smoother = ensureSmoother();
    smoother?.scrollTo(0, { immediate: true, force: true });
    const ac = new AbortController();
    // Demo scenes (website builds, AI answers a call, workflow runs): their CSS loops are 10s and run from page load,
    // so you often landed mid-loop or on a blank start. Play them 2x faster and restart each one from the top
    // when it comes into view or its service card opens.
    const scenes = [...document.querySelectorAll<HTMLElement>(".scene")];
    const loops = (sc: HTMLElement) => sc.getAnimations({ subtree: true })
      .filter((a) => a instanceof CSSAnimation && Number(a.effect?.getTiming().duration ?? 0) >= 6000);
    // speed is set here, not once at load: the loops don't exist yet while the loader hides the page
    const restart = (sc: HTMLElement) => loops(sc).forEach((a) => { a.playbackRate = 2; a.currentTime = 0; a.play(); });
    if (!reduce) {
      const seen = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) restart(e.target as HTMLElement); }), { threshold: 0.4 });
      scenes.forEach((sc) => seen.observe(sc));
      const opened = new MutationObserver((ms) => ms.forEach((m) => {
        const c = m.target as HTMLElement;
        if (c.classList.contains("on") && !(m.oldValue ?? "").split(" ").includes("on")) c.querySelectorAll<HTMLElement>(".scene").forEach(restart);
      }));
      document.querySelectorAll(".xc").forEach((c) => {
        opened.observe(c, { attributes: true, attributeFilter: ["class"], attributeOldValue: true });
        c.addEventListener("mouseenter", () => c.querySelectorAll<HTMLElement>(".scene").forEach(restart), { signal: ac.signal });
      });
      ac.signal.addEventListener("abort", () => { seen.disconnect(); opened.disconnect(); });
    }
    const ctx = gsap.context(() => {
      const row = document.querySelector(".xpanels");
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
        // Home "Three ways I help": one full panel per service on a pinned stage, swapped one scroll step at a time
        // (same idea as "Where I've worked"). Step k is fully shown at progress k/(n-1).
        const cards = gsap.utils.toArray<HTMLElement>(".xc", row);
        const sec = document.getElementById("svc")!;
        const btns = gsap.utils.toArray<HTMLButtonElement>(".svc-prog button", sec);
        const n = cards.length;
        const parts = (c: HTMLElement) => c.querySelectorAll(".xc-open > *");
        let cur = 0;
        cards.forEach((c, j) => c.classList.toggle("on", j === 0));
        const show = (k: number) => {
          if (k === cur) return;
          const old = cards[cur];
          cur = k;
          btns.forEach((b, j) => b.classList.toggle("on", j === k));
          gsap.to(parts(old), { opacity: 0, y: -24, duration: 0.25, stagger: 0.02, overwrite: true, onComplete: () => { if (old !== cards[cur]) old.classList.remove("on"); } });
          cards[k].classList.add("on");
          // the scene loops on its own clock: restart it so the story always begins at its first frame
          cards[k].querySelectorAll<HTMLElement>(".scene *").forEach((e) => { e.style.animation = "none"; void e.offsetWidth; e.style.animation = ""; });
          gsap.fromTo(parts(cards[k]), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.2, overwrite: true });
        };
        const st = ScrollTrigger.create({
          trigger: sec, start: "top top", end: "+=" + (n - 1) * window.innerHeight, pin: true, ...snapPts([0.5]),
          onUpdate: (s) => {
            show(Math.round(s.progress * (n - 1)));
            btns.forEach((b, j) => { (b.querySelector("em") as HTMLElement).style.width = Math.max(0, Math.min(1, s.progress * (n - 1) - (j - 1))) * 100 + "%"; });
          },
        });
        btns.forEach((b, j) => b.addEventListener("click", () => {
          const y = st.start + (j / (n - 1)) * (st.end - st.start);
          const sm = ensureSmoother();
          if (sm) sm.scrollTo(y, { duration: 0.9 }); else scrollTo({ top: y, behavior: "smooth" });
        }, { signal: ac.signal }));
        ac.signal.addEventListener("abort", () => cards.forEach((c, j) => c.classList.toggle("on", j === 0)));
      }
      gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
        // keep the real value: a re-run would otherwise read the "0" a cut-off earlier run left behind
        const t = (el.dataset.v ??= el.textContent ?? "");
        const m = t.match(/[\d.]+/);
        if (!m || reduce) return;
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
