"use client";

import { useEffect, useRef } from "react";
import { ensureSmoother, gsap, refreshSoon, isMobile, reducedMotion, ScrollTrigger, snapPts } from "../lib/gsap";

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector(sel) as T;
const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));
// This page's own <div className="page">. Next keeps visited pages in the DOM (hidden), and the Work page
// also has an id="work", so never look things up in the whole document.
let page: HTMLElement;
const byId = (id: string) => page.querySelector<HTMLElement>("#" + id);

// Home-only animations from v4-Home: "gap" stats, the scroll-scrubbed missed-call story, the pinned work panels.
export default function HomeFx() {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    page = mark.current!.closest<HTMLElement>(".page")!;
    document.body.classList.add("grain");
    if (reducedMotion()) return () => document.body.classList.remove("grain");
    ensureSmoother();
    const ac = new AbortController();
    const mob = isMobile();
    const ctx = gsap.context(() => {
      gapFx();
      agentFx(mob);
      if (!mob) workFx(ac.signal);
      howFx(mob); // created after workFx so its start accounts for the Work section's pin spacing
      wipeFx(); // last, same reason
    });
    refreshSoon();
    // The hero fades in only once the page is quiet: after load + fonts, whose layout re-measure (refreshSoon,
    // ~0.15s of frozen frames each) would otherwise land mid-animation and make it jump. Our frames are queued
    // after that refresh, so the second one starts on a free main thread. Capped at 1.5s on slow connections.
    let started = false;
    const go = () => {
      if (started || ac.signal.aborted) return;
      started = true;
      requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("hero-go")));
    };
    const loaded = document.readyState === "complete" ? null : new Promise((r) => window.addEventListener("load", r, { once: true, signal: ac.signal }));
    Promise.all([document.fonts?.ready, loaded]).then(go);
    const cap = setTimeout(go, 1500);
    return () => {
      document.documentElement.classList.remove("hero-go");
      clearTimeout(cap); ac.abort(); ctx.revert();
      qa(document, "#how").forEach((s) => s.classList.remove("fx")); // may already be hidden here
      document.body.classList.remove("grain");
      qa(document, ".wipe").forEach((s) => s.classList.remove("wipe", "wout"));
      qa(document, ".scn").forEach((s) => s.classList.remove("scn"));
      document.querySelector(".wipebg")?.remove();
    };
  }, []);
  return <span ref={mark} hidden />;
}

// One fixed backdrop behind the page fades to each section's colour in place (no edge that scrolls),
// then that section's content fades in a moment later: colour first, elements second.
function wipeFx() {
  const secs = qa(page, "section").filter((s) => s.offsetHeight); // skip hidden desktop/mobile twins
  if (!secs.length) return;
  const body = getComputedStyle(document.body).backgroundColor;
  const cols = secs.map((s) => {
    const c = getComputedStyle(s).backgroundColor;
    return c === "rgba(0, 0, 0, 0)" ? body : c;
  });
  const bg = document.createElement("div");
  bg.className = "wipebg";
  // dots: navy on light (cream) sections, soft grey on navy ones
  const dot = (c: string) => (c.match(/\d+/g) ?? []).slice(0, 3).reduce((a, n) => a + +n, 0) > 384 ? "rgba(16,25,53,.18)" : "rgba(128,128,128,.1)";
  bg.style.backgroundColor = cols[0];
  bg.style.setProperty("--dot", dot(cols[0]));
  document.body.prepend(bg); // first in body: painted before (under) #smooth-wrapper but above the body's own background
  const fade = (c: string) => gsap.to(bg, { backgroundColor: c, "--dot": dot(c), duration: 0.7, ease: "power2.inOut", overwrite: true });
  // Batched on purpose: all class writes, then all trigger measuring, then the timelines (they measure
  // later, in one go). Mixing writes and measuring per section forced a full re-layout each time: ~0.2s stall on load.
  const desk = !isMobile();
  // the scene change moves content by a full screen, so only use it between two full-screen sections
  const full = secs.map((s) => s.offsetHeight >= window.innerHeight * 0.85);
  const scene = (i: number) => desk && i > 0 && full[i] && full[i - 1];
  secs.forEach((s, i) => {
    s.classList.add("wipe");
    if (scene(i)) { secs[i - 1].classList.add("scn"); s.classList.add("scn"); } // let held content spill past the section edge
  });
  // When the backdrop flips dark <-> light, the section above keeps text made for the old colour
  // (white on cream = invisible). So fade that section out as the colour changes, back in on the way up.
  // Desktop scene changes already crossfade their content, so they are left alone.
  const flip = (i: number) => !scene(i) && dot(cols[i]) !== dot(cols[i - 1]);
  secs.forEach((s, i) => i && ScrollTrigger.create({
    trigger: s, start: "top 50%",
    onEnter: () => { fade(cols[i]); if (flip(i)) secs[i - 1].classList.add("wout"); },
    onLeaveBack: () => { fade(cols[i - 1]); secs[i - 1].classList.remove("wout"); },
  }));
  secs.forEach((s, i) => {
    if (!i) return;
    if (!scene(i)) {
      gsap.timeline({ scrollTrigger: { trigger: s, start: "top 60%", toggleActions: "play none none reverse" } })
        .from(Array.from(s.children), { opacity: 0, duration: 0.7, ease: "power2.out" });
      return;
    }
    // Scene change (desktop): while s scrolls in, cancel the movement of both sections so they
    // stay still on screen and only crossfade, old out first, new in second.
    const vh = () => window.innerHeight;
    const out = Array.from(secs[i - 1].children), inn = Array.from(s.children);
    gsap.timeline({ scrollTrigger: { trigger: s, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true, ...snapPts() } })
      .fromTo(out, { y: 0 }, { y: () => vh(), ease: "none", duration: 1, immediateRender: false }, 0)
      .fromTo(inn, { y: () => -vh() }, { y: 0, ease: "none", duration: 1 }, 0)
      .fromTo(out, { autoAlpha: 1 }, { autoAlpha: 0, ease: "power1.in", duration: 0.5, immediateRender: false }, 0)
      .fromTo(inn, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.out", duration: 0.5 }, 0.5);
  });
}

function gapFx() {
  const g = byId("gap");
  if (!g) return;
  // Desktop: the scene change holds #gap's content still while it fades in, so its children's scroll
  // positions are shifted and their triggers would fire at load. Trigger off the section itself instead:
  // the content fades in from "top 50%", these play just after. Mobile scrolls normally: use the elements.
  const desk = !isMobile();
  const at = (el: Element, mob: string, d: string) => (desk ? { trigger: g, start: d } : { trigger: el, start: mob });
  gsap.from(qa(g, ".gl span"), { yPercent: 110, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.12, scrollTrigger: at(g, "top 75%", "top 45%") });
  const cards = qa(g, ".gc"), cta = q(g, ".gcta");
  const count = (el: HTMLElement) => { const o = { v: 0 }; el.textContent = "0"; return gsap.to(o, { v: Number(el.dataset.to), duration: 0.8, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } }); };
  // plays once when reached (no pin, no scrub), so a stop mid-scroll never leaves cards half shown
  gsap.from(cards, { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15, scrollTrigger: at(q(g, ".gs"), "top 80%", "top 35%") });
  qa(g, ".gcount").forEach((el) => { el.textContent = "0"; ScrollTrigger.create({ ...at(el, "top 85%", "top 30%"), once: true, onEnter: () => { count(el).duration(1.6); } }); });
  gsap.from(qa(g, ".bar i b"), { scaleX: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.1, scrollTrigger: at(q(g, ".gs"), "top 70%", "top 30%") });
  gsap.from(cta, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: at(cta, "top 88%", "top 20%") });
}

function agentFx(mob: boolean) {
  const g = byId("agent");
  if (!g) return;
  const st = qa(g, ".st"), ln = q(g, ".ln i"), dot = q(g, ".ln s"), ck = q(g, ".ck");
  const T = [0, 2, 41, 80, 82]; // seconds shown on the clock at each step
  const o = { v: 0 }, n = st.length - 1, AT: number[] = [];
  const fmt = (v: number) => { v = Math.round(v); return ("0" + Math.floor(v / 60)).slice(-2) + ":" + ("0" + (v % 60)).slice(-2); };
  const tl = gsap.timeline({ paused: true, onUpdate: () => { const t = tl.time(); st.forEach((s, i) => s.classList.toggle("on", t >= AT[i])); } });
  ck.textContent = "00:00";
  tl.set(ln, mob ? { scaleY: 0 } : { scaleX: 0 }, 0).set(dot, mob ? { top: "0%" } : { left: "0%" }, 0).set(o, { v: 0 }, 0)
    .set(qa(g, ".cd"), { opacity: 0, y: 12 }, 0).set(q(g, ".ft"), { opacity: 0, y: 16 }, 0);
  st.forEach((s, i) => {
    const at = 0.2 + i * 1.1, p = (i / n) * 100 + "%";
    if (i) {
      const m = { duration: 0.9, ease: "power2.inOut" };
      tl.to(ln, { ...(mob ? { scaleY: i / n } : { scaleX: i / n }), ...m }, at - 0.9);
      tl.to(dot, { ...(mob ? { top: p } : { left: p }), ...m }, at - 0.9);
      tl.to(o, { v: T[i], duration: 0.9, ease: "none", onUpdate: () => { ck.textContent = fmt(o.v); } }, at - 0.9);
    }
    AT[i] = at;
    tl.fromTo(q(s, ".ic"), { scale: 0.7 }, { scale: 1, duration: 0.5, ease: "back.out(3)", immediateRender: false }, at);
    tl.to(q(s, ".cd"), { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, at + 0.1);
  });
  tl.to(q(g, ".ft"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "+=.2");
  st.forEach((s) => s.classList.remove("on"));
  if (!mob) gsap.set(g, { padding: "var(--hsafe) 0 48px" });
  // Plays by itself once the section is mostly on screen (no pin, no scroll-driven steps);
  // scrolling on just moves to the next section.
  ScrollTrigger.create({ animation: tl, trigger: g, start: mob ? "top 65%" : "top 40%", once: true });
}

function workFx(signal: AbortSignal) {
  const sec = byId("work");
  if (!sec || document.documentElement.scrollHeight < innerHeight * 1.5) return;
  sec.classList.add("pinned");
  const panels = qa(sec, ".wp-panel"), btns = qa<HTMLButtonElement>(sec, ".wp-prog button");
  let cur = -1;
  const sparks = qa<SVGSVGElement>(sec, ".wpspark");
  const count = (el: HTMLElement) => {
    const t = el.getAttribute("data-t") || el.textContent || "";
    el.setAttribute("data-t", t);
    const m = t.match(/\d+(\.\d+)?/g);
    if (!m) return;
    const last = m[m.length - 1], end = parseFloat(last), o = { v: 0 }, at = t.lastIndexOf(last);
    gsap.to(o, { v: end, duration: 1.2, ease: "power2.out", onUpdate: () => { el.textContent = t.slice(0, at) + (end % 1 ? o.v.toFixed(1) : Math.round(o.v)) + t.slice(at + last.length); } });
  };
  const show = (k: number) => {
    if (k === cur) return;
    const old = panels[cur];
    cur = k;
    btns.forEach((b, j) => b.classList.toggle("on", j === k));
    // bars: sites already seen stay full, the current one fills by itself, later ones empty
    btns.forEach((b, j) => gsap.to(q(b, "em"), { width: j <= k ? "100%" : "0%", duration: j === k ? 0.9 : 0.3, ease: "power2.out", overwrite: true }));
    if (old) gsap.to(qa(old, ".wp-head,.wp-box"), { opacity: 0, y: -24, duration: 0.3, stagger: 0.03, onComplete: () => { if (old !== panels[cur]) old.classList.remove("on"); } });
    panels.forEach((p, j) => { if (j !== k && p !== old) p.classList.remove("on"); });
    const p = panels[k];
    p.classList.add("on");
    gsap.fromTo(q(p, ".wp-head"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: old ? 0.2 : 0 });
    gsap.fromTo(qa(p, ".wp-box"), { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: old ? 0.3 : 0.1 });
    gsap.fromTo(q(p, ".wp-logo"), { rotate: -12, scale: 0.6 }, { rotate: 0, scale: 1, duration: 0.7, ease: "back.out(2)", delay: old ? 0.25 : 0 });
    qa(p, ".pcount").forEach(count);
    // graph draws itself in one go as soon as the panel shows, no scrolling needed
    gsap.fromTo(sparks[k], { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power2.inOut", delay: old ? 0.5 : 0.3, overwrite: true });
  };
  panels.forEach((p, j) => { if (j) p.classList.remove("on"); });
  // The first panel used to sit fully drawn during the crossfade from the section before, then snap to
  // empty and pop back in when the pin started. Now it starts empty and builds in while the crossfade runs.
  gsap.set(qa(panels[0], ".wp-head,.wp-box"), { opacity: 0 });
  gsap.set(sparks[0], { clipPath: "inset(0 100% 0 0)" });
  qa(panels[0], ".pcount").forEach((el) => { const t = el.getAttribute("data-t") ?? el.textContent ?? ""; el.setAttribute("data-t", t); el.textContent = t.replace(/\d+(\.\d+)?(?!.*\d)/, "0"); });
  ScrollTrigger.create({ trigger: sec, start: "top 40%", once: true, onEnter: () => { if (cur < 0) show(0); } });
  const st = ScrollTrigger.create({
    // one scroll per site: the pin stops at 0 (first site), then one stop per next site; one more scroll leaves
    trigger: sec, start: "top top", end: "+=" + (panels.length - 1) * innerHeight, pin: true, anticipatePin: 1,
    ...snapPts(panels.slice(1, -1).map((_, j) => (j + 1) / (panels.length - 1))),
    onUpdate: (s) => {
      const n = panels.length - 1;
      show(Math.min(n, Math.floor(s.progress * n + 0.75))); // switch early, so the next site starts as soon as you scroll
    },
  });
  btns.forEach((b, j) => b.addEventListener("click", () => {
    const y = st.start + (j / (panels.length - 1)) * (st.end - st.start);
    const sm = ensureSmoother();
    if (sm) sm.scrollTo(y, { duration: 0.9 }); else scrollTo({ top: y, behavior: "smooth" });
  }, { signal }));
  if (st.isActive || st.progress > 0) show(Math.min(panels.length - 1, Math.floor(st.progress * (panels.length - 1) + 0.75)));
  // undo the pinned layout when the page unmounts (ctx.revert handles tweens, not classes)
  signal.addEventListener("abort", () => { sec.classList.remove("pinned"); panels.forEach((p, j) => p.classList.toggle("on", j === 0)); });
}

// Desktop: pinned stage, one step at a time in the same spot, then a full diagram. Mobile keeps the list.
function howStory(g: HTMLElement) {
  // One scroll per step: you arrive on step 1 (bar already part-filled), each scroll plays the next step by itself,
  // the last stop shows all four steps together, one more scroll leaves.
  const slides = qa(g, ".hs"), dia = q(g, ".hdia"), bar = q(g, ".hln i");
  const stops = slides.length; // steps 2..4 + the all-steps view
  g.classList.add("fx");
  gsap.set(slides.slice(1), { opacity: 0, y: 50 });
  gsap.set(bar, { scaleX: 1 / (stops + 1) });
  const tl = gsap.timeline({ paused: true }).addLabel("s0", 0);
  slides.forEach((s, i) => {
    const at = i * 1 + 0.01;
    tl.to(s, { opacity: 0, y: -50, duration: 0.4, ease: "power2.in" }, at);
    if (i + 1 < slides.length) tl.to(slides[i + 1], { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, at + 0.3);
    else tl.to(dia, { opacity: 1, duration: 0.3 }, at + 0.3)
      .fromTo(q(dia, ".dl"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, at + 0.3)
      .from(qa(dia, ".dn"), { y: 30, opacity: 0, duration: 0.4, ease: "power3.out", stagger: 0.12 }, at + 0.3);
    tl.to(bar, { scaleX: (i + 2) / (stops + 1), duration: 0.6, ease: "power2.out" }, at)
      .addLabel("s" + (i + 1), at + 0.9);
  });
  let cur = 0;
  const go = (k: number) => { if (k === cur) return; cur = k; tl.tweenTo("s" + k, { duration: 0.9, ease: "none", overwrite: true }); };
  ScrollTrigger.create({
    trigger: g, start: "top top", end: "+=" + innerHeight * stops, pin: true,
    ...snapPts(Array.from({ length: stops - 1 }, (_, j) => (j + 1) / stops)),
    onUpdate: (st) => go(Math.min(stops, Math.floor(st.progress * stops + 0.75))), // switch early: a small scroll is enough
    onLeaveBack: () => go(0),
  });
}

function howFx(mob: boolean) {
  const g = byId("how");
  if (!g) return;
  if (!mob) { howStory(g); return; }
  const steps = qa(g, ".step");
  const tl = gsap.timeline({ paused: true });
  tl.from(qa(g, ".kick,h2"), { y: 30, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.15 })
    .to(q(g, ".hln i"), { scaleX: 1, duration: steps.length * 0.9, ease: "none" }, 0.6);
  steps.forEach((s, i) => {
    const at = 0.8 + i * 0.9;
    tl.from(q(s, ".n"), { y: 20, opacity: 0, duration: 0.4, ease: "power3.out" }, at)
      .from(q(s, "h3"), { y: 20, opacity: 0, duration: 0.45, ease: "power3.out" }, at + 0.1)
      .from(qa(s, "li"), { y: 14, opacity: 0, duration: 0.4, ease: "power3.out", stagger: 0.1 }, at + 0.25);
  });
  ScrollTrigger.create({ animation: tl, trigger: g, start: "top 65%", refreshPriority: 1 }); // plays once
}
