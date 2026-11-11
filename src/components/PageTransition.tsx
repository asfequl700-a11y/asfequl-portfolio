"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, reducedMotion } from "../lib/gsap";

// Smooth page changes: internal link click -> fade the page out (250ms) -> navigate -> fade/slide the new page in (400ms).
// Back/forward buttons skip the fade-out but still get the fade-in. No animation with reduced motion.
// The server HTML is always fully visible (nothing is hidden before JS runs), so prerendering is unaffected.
export default function PageTransition({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const router = useRouter();
  const first = useRef(true);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reducedMotion()) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return; // other site, or same page / #hash
      // Capture phase on window runs first. <Link> skips its own navigation when the click is
      // already defaultPrevented, but its onClick props (e.g. closing the mobile menu) still run.
      e.preventDefault();
      const el = box.current;
      const href = url.pathname + url.search + url.hash;
      const go = () => router.push(href);
      if (!el) return go();
      router.prefetch(href); // load the next page while this one fades out
      gsap.to(el, { opacity: 0, duration: 0.25, ease: "power1.in", overwrite: true, onComplete: go });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    const el = box.current;
    if (first.current) { first.current = false; return; } // first load: no fade, content shows at once
    if (!el) return;
    if (reducedMotion()) { gsap.set(el, { clearProps: "opacity,transform" }); return; }
    // The new page builds its scroll animations first (~0.3s of blocked frames). Fading in during
    // that would jump straight to visible, so stay hidden and start once it is done: our frame
    // callback is queued after refreshSoon()s, the next one runs after that work.
    gsap.set(el, { opacity: 0 });
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: true,
        onComplete: () => gsap.set(el, { clearProps: "opacity,transform" }),
      }));
    });
    return () => cancelAnimationFrame(id);
  }, [path]);

  return <div ref={box}>{children}</div>;
}
