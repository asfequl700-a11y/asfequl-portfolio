"use client";

import { useEffect, useRef } from "react";
import { ensureSmoother, gsap, refreshSoon, isMobile, reducedMotion, ScrollTrigger } from "../lib/gsap";

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
    const ac = new AbortController();
    fitAgentLine();
    window.addEventListener("resize", fitAgentLine, { signal: ac.signal });
    if (reducedMotion()) return () => { ac.abort(); document.body.classList.remove("grain"); };
    ensureSmoother();
    const mob = isMobile();
    const ctx = gsap.context(() => {
      gapFx();
      agentFx(mob);
      howFx();
      wipeFx();
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
    Promise.all([document.fonts?.ready, loaded]).then(() => { fitAgentLine(); go(); });
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
  secs.forEach((s) => s.classList.add("wipe"));
  // When the backdrop flips dark <-> light, the section above keeps text made for the old colour
  // (white on cream = invisible). So fade that section out as the colour changes, back in on the way up.
  const flip = (i: number) => dot(cols[i]) !== dot(cols[i - 1]);
  secs.forEach((s, i) => i && ScrollTrigger.create({
    trigger: s, start: "top 50%",
    onEnter: () => { fade(cols[i]); if (flip(i)) secs[i - 1].classList.add("wout"); },
    onLeaveBack: () => { fade(cols[i - 1]); secs[i - 1].classList.remove("wout"); },
  }));
  // same on every screen size: plain scrolling, each section fades in as it arrives
  secs.forEach((s, i) => i && gsap.timeline({ scrollTrigger: { trigger: s, start: "top 60%", toggleActions: "play none none reverse" } })
    .from(Array.from(s.children), { opacity: 0, duration: 0.7, ease: "power2.out" }));
}

function gapFx() {
  const g = byId("gap");
  if (!g) return;
  const at = (el: Element, start: string) => ({ trigger: el, start });
  gsap.from(qa(g, ".gl span"), { yPercent: 110, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.12, scrollTrigger: at(g, "top 75%") });
  const cards = qa(g, ".gc"), cta = q(g, ".gcta");
  const count = (el: HTMLElement) => { const o = { v: 0 }; el.textContent = "0"; return gsap.to(o, { v: Number(el.dataset.to), duration: 0.8, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } }); };
  // plays once when reached (no pin, no scrub), so a stop mid-scroll never leaves cards half shown
  gsap.from(cards, { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15, scrollTrigger: at(q(g, ".gs"), "top 80%") });
  qa(g, ".gcount").forEach((el) => { el.textContent = "0"; ScrollTrigger.create({ ...at(el, "top 85%"), once: true, onEnter: () => { count(el).duration(1.6); } }); });
  gsap.from(qa(g, ".bar i b"), { scaleX: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.1, scrollTrigger: at(q(g, ".gs"), "top 70%") });
  gsap.from(cta, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: at(cta, "top 88%") });
}

// Phones/tablets: the steps stack in a column of uneven heights, so the line is fitted from the
// first icon's centre to the last one's (no tail sticking out below), and each step's share of it saved.
let lineAt: number[] = [];
function fitAgentLine() {
  const g = byId("agent");
  const ln = g && q(g, ".ln");
  if (!g || !ln) return;
  const st = qa(g, ".st");
  if (!matchMedia("(max-width:900px)").matches) { ln.style.top = ln.style.height = ln.style.bottom = ""; lineAt = st.map((_, i) => i / (st.length - 1)); return; }
  const c = st.map((s) => { const ic = q(s, ".ic"); return s.offsetTop + ic.offsetTop + ic.offsetHeight / 2; });
  const a = c[0], len = c[c.length - 1] - a;
  ln.style.top = a + "px"; ln.style.height = len + "px"; ln.style.bottom = "auto";
  lineAt = c.map((v) => (v - a) / len);
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
    // read when the tween first plays, i.e. after fonts have settled the step heights
    const f = () => (mob ? lineAt[i] ?? i / n : i / n), at = 0.2 + i * 1.1, p = () => f() * 100 + "%";
    if (i) {
      const m = { duration: 0.9, ease: "power2.inOut" };
      tl.to(ln, { ...(mob ? { scaleY: f } : { scaleX: f }), ...m }, at - 0.9);
      tl.to(dot, { ...(mob ? { top: p } : { left: p }), ...m }, at - 0.9);
      tl.to(o, { v: T[i], duration: 0.9, ease: "none", onUpdate: () => { ck.textContent = fmt(o.v); } }, at - 0.9);
    }
    AT[i] = at;
    tl.fromTo(q(s, ".ic"), { scale: 0.7 }, { scale: 1, duration: 0.5, ease: "back.out(3)", immediateRender: false }, at);
    tl.to(q(s, ".cd"), { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, at + 0.1);
  });
  tl.to(q(g, ".ft"), { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "+=.2");
  tl.timeScale(1.7);
  st.forEach((s) => s.classList.remove("on"));
  // Plays by itself once the section is mostly on screen (no pin, no scroll-driven steps);
  // scrolling on just moves to the next section.
  ScrollTrigger.create({ animation: tl, trigger: g, start: "top 65%", once: true });
}

function howFx() {
  const g = byId("how");
  if (!g) return;
  // Everything arrives together in one short fade (nothing to wait for if you scroll fast); the sketches
  // then draw themselves once (CSS, started by .draw) and keep a small idle motion.
  const tl = gsap.timeline({ paused: true, onStart: () => g.classList.add("draw") });
  tl.from(qa(g, ".kick,h2"), { y: 24, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 }, 0)
    .to(q(g, ".hln i"), { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0)
    .from(qa(g, ".step"), { y: 16, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.1);
  ScrollTrigger.create({ animation: tl, trigger: g, start: "top 65%", refreshPriority: 1 }); // plays once
}
