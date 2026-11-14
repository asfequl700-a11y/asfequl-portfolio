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

// One smooth scroller for the whole site (Lenis: native scroll, eased, so fixed
// elements behave normally). Lenis is driven by the GSAP ticker so ScrollTrigger reads the same frame.
let lenis: Lenis | null = null;
export function ensureSmoother() {
  if (reducedMotion()) return null;
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, touchMultiplier: 1, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
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
