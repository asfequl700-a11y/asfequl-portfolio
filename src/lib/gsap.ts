"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export { gsap, ScrollTrigger, ScrollSmoother };

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isMobile = () => matchMedia("(max-width:900px)").matches;

// One smoother for the whole site (wrapper lives in layout.tsx). Must exist before any pinned ScrollTrigger.
export function ensureSmoother() {
  if (reducedMotion() || !document.getElementById("smooth-wrapper")) return null;
  const existing = ScrollSmoother.get();
  if (existing) return existing;
  slowWheel();
  return ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 0.6, effects: true });
}

// One mouse-wheel notch moves only WHEEL_STEP of the browser's default distance,
// so people don't skip past the scroll animations. Trackpads and pinch-zoom are left alone.
const WHEEL_STEP = 0.55;
function slowWheel() {
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.deltaX !== 0) return; // zoom, or sideways trackpad
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // Firefox reports lines
      if (Math.abs(px) < 50) return; // small deltas = trackpad, already fine
      const t = e.target as HTMLElement | null;
      if (t?.closest("textarea, select, [data-native-scroll]")) return;
      e.preventDefault();
      window.scrollBy(0, px * WHEEL_STEP);
    },
    { passive: false },
  );
}

// Re-measure all scroll triggers once on the next frame. Several callers in the same moment
// (SiteFx, HomeFx, fonts, load) share one refresh: each full refresh costs ~0.3s on the home page.
let refreshId = 0;
export function refreshSoon() {
  cancelAnimationFrame(refreshId);
  refreshId = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
}
