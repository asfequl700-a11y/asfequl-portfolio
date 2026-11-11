"use client";

import { useEffect } from "react";
import { ensureSmoother, gsap, refreshSoon, isMobile, reducedMotion, ScrollTrigger } from "../lib/gsap";

const q = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector(sel) as T;
const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

// Home-only animations from v4-Home: "gap" stats, the scroll-scrubbed missed-call story, the pinned work panels.
export default function HomeFx() {
  useEffect(() => {
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
    return () => {
      ac.abort(); ctx.revert();
      document.getElementById("how")?.classList.remove("fx");
      document.body.classList.remove("grain");
      qa(document, ".wipe").forEach((s) => s.classList.remove("wipe"));
      qa(document, ".scn").forEach((s) => s.classList.remove("scn"));
      document.querySelector(".wipebg")?.remove();
    };
  }, []);
  return null;
}

// One fixed backdrop behind the page fades to each section's colour in place (no edge that scrolls),
// then that section's content fades in a moment later: colour first, elements second.
function wipeFx() {
  const secs = qa(document, "#smooth-content section").filter((s) => s.offsetHeight); // skip hidden desktop/mobile twins
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
  secs.forEach((s, i) => {
    s.classList.add("wipe");
    if (desk && i) { secs[i - 1].classList.add("scn"); s.classList.add("scn"); } // let held content spill past the section edge
  });
  secs.forEach((s, i) => i && ScrollTrigger.create({
    trigger: s, start: "top 50%",
    onEnter: () => fade(cols[i]),
    onLeaveBack: () => fade(cols[i - 1]),
  }));
  secs.forEach((s, i) => {
    if (!i) return;
    if (!desk) {
      gsap.timeline({ scrollTrigger: { trigger: s, start: "top 60%", toggleActions: "play none none reverse" } })
        .from(Array.from(s.children), { opacity: 0, duration: 0.7, ease: "power2.out" });
      return;
    }
    // Scene change (desktop): while s scrolls in, cancel the movement of both sections so they
    // stay still on screen and only crossfade, old out first, new in second.
    const vh = () => window.innerHeight;
    const out = Array.from(secs[i - 1].children), inn = Array.from(s.children);
    gsap.timeline({ scrollTrigger: { trigger: s, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true } })
      .fromTo(out, { y: 0 }, { y: () => vh(), ease: "none", duration: 1, immediateRender: false }, 0)
      .fromTo(inn, { y: () => -vh() }, { y: 0, ease: "none", duration: 1 }, 0)
      .fromTo(out, { autoAlpha: 1 }, { autoAlpha: 0, ease: "power1.in", duration: 0.5, immediateRender: false }, 0)
      .fromTo(inn, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.out", duration: 0.5 }, 0.5);
  });
}

function gapFx() {
  const g = document.getElementById("gap");
  if (!g) return;
  gsap.from(qa(g, ".gl span"), { yPercent: 110, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.12, scrollTrigger: { trigger: g, start: "top 75%" } });
  const cards = qa(g, ".gc"), cta = q(g, ".gcta");
  const count = (el: HTMLElement) => { const o = { v: 0 }; el.textContent = "0"; return gsap.to(o, { v: Number(el.dataset.to), duration: 0.8, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } }); };
  if (isMobile()) {
    gsap.from(cards, { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.15, scrollTrigger: { trigger: q(g, ".gs"), start: "top 80%" } });
    qa(g, ".gcount").forEach((el) => { el.textContent = "0"; ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => { count(el).duration(1.6); } }); });
    gsap.from(qa(g, ".bar i b"), { scaleX: 0, duration: 1.2, ease: "power3.inOut", stagger: 0.1, scrollTrigger: { trigger: q(g, ".gs"), start: "top 70%" } });
    gsap.from(cta, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: cta, start: "top 88%" } });
    return;
  }
  // Desktop: pin the section; each scroll step reveals the next card, then the call-to-action bar,
  // then a short hold before the normal crossfade to the next section. Everything is scrubbed, so it follows the wheel.
  gsap.set([...cards, cta], { autoAlpha: 0, y: 50 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: g, start: "top top", end: () => "+=" + window.innerHeight * 2.5, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
  cards.forEach((c, i) => {
    const t = i * 1.2;
    tl.to(c, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, t)
      .from(qa(c, ".bar i b"), { scaleX: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, t + 0.3);
    qa(c, ".gcount").forEach((el) => tl.add(count(el), t + 0.2));
  });
  tl.to(cta, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, cards.length * 1.2)
    .to({}, { duration: 0.6 }); // short hold with everything visible
}

function agentFx(mob: boolean) {
  const g = document.getElementById("agent");
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
  if (!mob) gsap.set(g, { padding: "72px 0" });
  ScrollTrigger.create({ animation: tl, trigger: g, start: mob ? "top 65%" : "top top", end: mob ? "bottom 75%" : "+=1800", pin: !mob, scrub: 0.6 });
}

function workFx(signal: AbortSignal) {
  const sec = document.getElementById("work");
  if (!sec || document.documentElement.scrollHeight < innerHeight * 1.5) return;
  sec.classList.add("pinned");
  const panels = qa(sec, ".wp-panel"), btns = qa<HTMLButtonElement>(sec, ".wp-prog button");
  let cur = -1;
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
    if (old) gsap.to(qa(old, ".wp-head,.wp-box"), { opacity: 0, y: -24, duration: 0.3, stagger: 0.03, onComplete: () => { if (old !== panels[cur]) old.classList.remove("on"); } });
    panels.forEach((p, j) => { if (j !== k && p !== old) p.classList.remove("on"); });
    const p = panels[k];
    p.classList.add("on");
    gsap.fromTo(q(p, ".wp-head"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: old ? 0.2 : 0 });
    gsap.fromTo(qa(p, ".wp-box"), { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: old ? 0.3 : 0.1 });
    gsap.fromTo(q(p, ".wp-logo"), { rotate: -12, scale: 0.6 }, { rotate: 0, scale: 1, duration: 0.7, ease: "back.out(2)", delay: old ? 0.25 : 0 });
    qa(p, ".pcount").forEach(count);
    const line = p.querySelector(".wpspark .line");
    if (line) gsap.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", delay: 0.4 });
  };
  panels.forEach((p, j) => { if (j) p.classList.remove("on"); });
  const st = ScrollTrigger.create({
    trigger: sec, start: "top top", end: "+=" + panels.length * innerHeight, pin: true, anticipatePin: 1,
    onEnter: () => { if (cur < 0) show(0); },
    onUpdate: (s) => {
      const n = panels.length;
      show(Math.min(n - 1, Math.floor(s.progress * n)));
      btns.forEach((b, j) => { const f = Math.max(0, Math.min(1, s.progress * n - j)); q(b, "em").style.width = f * 100 + "%"; });
    },
  });
  btns.forEach((b, j) => b.addEventListener("click", () => {
    const y = st.start + ((j + 0.5) / panels.length) * (st.end - st.start);
    const sm = ensureSmoother();
    if (sm) sm.scrollTo(y, true); else scrollTo({ top: y, behavior: "smooth" });
  }, { signal }));
  if (st.isActive || st.progress > 0) show(Math.min(panels.length - 1, Math.floor(st.progress * panels.length)));
  // undo the pinned layout when the page unmounts (ctx.revert handles tweens, not classes)
  signal.addEventListener("abort", () => { sec.classList.remove("pinned"); panels.forEach((p, j) => p.classList.toggle("on", j === 0)); });
}

// Desktop: pinned stage, one step at a time in the same spot, then a full diagram. Mobile keeps the list.
function howStory(g: HTMLElement) {
  const slides = qa(g, ".hs"), dia = q(g, ".hdia");
  g.classList.add("fx");
  gsap.set(slides.slice(1), { opacity: 0, y: 50 });
  const tl = gsap.timeline({ paused: true });
  tl.to(q(g, ".hln i"), { scaleX: 1, duration: slides.length * 1.2, ease: "none" }, 0);
  slides.forEach((s, i) => {
    const at = i * 1.2;
    if (i) tl.to(s, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, at);
    tl.to(s, { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" }, at + 0.8);
  });
  const end = slides.length * 1.2;
  tl.to(dia, { opacity: 1, duration: 0.3 }, end)
    .fromTo(q(dia, ".dl"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, end)
    .from(qa(dia, ".dn"), { y: 30, opacity: 0, duration: 0.4, ease: "power3.out", stagger: 0.25 }, end);
  ScrollTrigger.create({ animation: tl, trigger: g, start: "top top", end: "+=" + innerHeight * 4, pin: true, scrub: 0.6 });
}

function howFx(mob: boolean) {
  const g = document.getElementById("how");
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
  ScrollTrigger.create({ animation: tl, trigger: g, start: "top 65%", end: "bottom bottom", scrub: 0.6, refreshPriority: 1 });
}
