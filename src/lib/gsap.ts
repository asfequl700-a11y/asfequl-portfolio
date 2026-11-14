"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
// cacheComponents keeps visited pages in the DOM, hidden. Never grab (or pin) an element of a hidden page:
// React later removes that page and crashes if GSAP moved its nodes. Returns the first visible match.
export const vis = <T extends Element = HTMLElement>(sel: string) =>
  [...document.querySelectorAll<T>(sel)].find((e) => e.checkVisibility()) ?? null;
export const isMobile = () => matchMedia("(max-width:900px)").matches;

// One smooth scroller for the whole site (Lenis: native scroll, eased, so pinned sections and fixed
// elements behave normally). Lenis is driven by the GSAP ticker so ScrollTrigger reads the same frame.
let lenis: Lenis | null = null;
export function ensureSmoother() {
  if (reducedMotion()) return null;
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, touchMultiplier: 1, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  startSnap(lenis);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

// Re-measure all scroll triggers once on the next frame. Several callers in the same moment
// (SiteFx, HomeFx, fonts, load) share one refresh: each full refresh costs ~0.3s on the home page.
let refreshId = 0;
export function refreshSoon() {
  cancelAnimationFrame(refreshId);
  refreshId = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
}

// Scrubbed sections settle on a finished step when scrolling stops. ScrollTrigger's own snap fights Lenis
// (two things moving the page), so the snap lives here: after the wheel is idle, Lenis glides to the next
// finished step in the direction you were travelling. points = timeline progress (0..1) of each finished step.
export const snapPts = (points: number[] = []) => ({ snapPoints: [0, ...points, 1] });

type SnapST = ScrollTrigger & { vars: { snapPoints?: number[] } };
// Where to settle: inside the tightest scroll range around y, between the finished step behind and the one ahead.
// Past 15% of the way toward the next step -> finish it (so a small flick is enough); less -> fall back (no accidental jumps).
function targetFor(y: number, dir: number) {
  let best: { prev: number; next: number } | null = null;
  for (const st of ScrollTrigger.getAll() as SnapST[]) {
    const pts = st.vars.snapPoints;
    if (!pts || y < st.start - 2 || y > st.end + 2) continue;
    const xs = pts.map((p) => st.start + p * (st.end - st.start)).sort((m, n) => m - n);
    const prev = [...xs].reverse().find((x) => x <= y + 2), next = xs.find((x) => x >= y - 2);
    if (prev === undefined || next === undefined || next - prev < 4) continue;
    if (!best || next - prev < best.next - best.prev) best = { prev, next };
  }
  if (!best) return null;
  const f = (y - best.prev) / (best.next - best.prev);
  return (dir >= 0 ? f > 0.15 : f > 0.85) ? best.next : best.prev;
}
// Fires 110ms after the LAST wheel tick and aims from where Lenis was heading (targetScroll), not from where the
// glide's slow tail currently is: waiting for the tail made every stop feel late. Touch and keys scroll natively, left alone.
function startSnap(l: Lenis) {
  let id = 0, dir = 1;
  window.addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.deltaX !== 0) return;
    dir = Math.sign(e.deltaY) || dir;
    clearTimeout(id);
    id = window.setTimeout(() => {
      const x = targetFor(l.targetScroll, dir);
      if (x !== null && Math.abs(x - l.targetScroll) > 3) l.scrollTo(x, { duration: Math.min(0.75, Math.max(0.3, Math.abs(x - l.scroll) / 1500)), easing: (v) => 1 - Math.pow(1 - v, 4), lock: false });
    }, 110);
  }, { passive: true });
}
