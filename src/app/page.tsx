import type { Metadata } from "next";
import HowArt from "../components/HowArt";
import SiteFx from "../components/SiteFx";
import Image from "next/image";
import Link from "next/link";
import { Ar, FinalCta } from "../components/ui";
import { WorkPanels } from "../components/Work";
import { Testimonials } from "../components/Testimonials";
import HomeFx from "../components/HomeFx";
import { marketStats } from "../data/site";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Ported from _design/v4-Home.dc.html
export const metadata: Metadata = {
  description: "Websites that sell and AI that picks up when you can’t. Fahim builds websites, AI receptionists, AI agents and automation for local businesses.",
  alternates: { canonical: "/" },
};

const howSteps = [
  { n: "01", t: "Call", short: "15 minutes, notes the same day", li: ["15 minutes. You tell me how you get customers today.", "I take notes and send you a short summary the same day."] },
  { n: "02", t: "Plan", short: "One-page plan. Nothing starts until you say yes", li: ["A one-page plan: scope, price, timeline.", "Shared as a PDF and a sheet you can comment on.", "Nothing starts until you say yes."] },
  { n: "03", t: "Build", short: "Preview link, revisions until you are happy", li: ["You get a preview link and updates as I go.", "Revisions until you are happy, no cap."] },
  { n: "04", t: "Launch", short: "Live on your domain, handover, I stay on", li: ["Goes live on your domain.", "Handover: logins, a short walkthrough video, and I stay on for fixes."] },
];

export default function HomePage() {
  return (
    <div className="page">
      <SiteFx />
<section className="night hero fs"><div className="hglow" aria-hidden="true"></div><div className="wrap"><div className="hgrid"><div style={{ display: "flex", flexDirection: "column", gap: "28px", position: "relative", zIndex: "2" }}><h1><span className="sr-only">Websites that win you jobs. AI that answers every call. Automations that do the busywork.</span><span className="rot rot2" aria-hidden="true"><span>Websites that<br /><em>win you jobs.</em></span><span>AI that answers<br /><em>every call.</em></span><span>Automations that<br /><em>do the busywork.</em></span></span></h1><p className="muted" style={{ fontSize: "21px", maxWidth: "30em" }}>I&apos;m Fahim. I build websites and AI helpers for <span className="rot" style={{ color: "#EEF1F8", fontWeight: "600" }}><span>plumbers.</span><span>clinics.</span><span>creators.</span></span><br />So no call, lead or message slips through.</p><div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}><Link className={buttonVariants({ variant: "brandStill" })} href="/contact">Book a free call<Ar /></Link><Link className={buttonVariants({ variant: "brandGhost" })} href="/projects">See what I&apos;ve built<Ar /></Link></div></div><div style={{ position: "relative", justifySelf: "end" }}><div className="arch"><Image src="/profile.jpg" alt="Fahim smiling, head and shoulders" fill sizes="(max-width: 900px) 100vw, 360px" preload /></div><div className="pcard" aria-label="Animation: a missed call is answered by AI and booked"><div className="prow"><span className="ic ringer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg></span><div><b>Incoming call</b><br /><span style={{ color: "#5A6380" }}>You&apos;re on a job · 2:14 PM</span></div></div><div className="bub c st">&quot;My kitchen tap won&apos;t stop leaking.&quot;</div><div className="bub a st s2">&quot;I can help. Is tomorrow at 10 OK?&quot;</div><div className="bub c st s3">&quot;Perfect, thanks!&quot;</div><span className="okchip st s4">✓ Booked · Tue 10:00 · text sent to you</span></div></div></div></div></section><section className="sec fs" id="gap"><div className="wrap">
<span className="kick">The gap is growing</span>
<h2 className="gl"><span>Your competitors</span><span>already <em>started.</em></span></h2>
<div className="gs">
{marketStats.map((m) => (
 <div key={m.text} className="gc"><div className="gn"><span className="gcount" data-to={m.n}>{m.n}</span>{m.after}</div>
  <p>{m.text}</p>
  <div className="bars">{m.bars.map((b) => <div key={b.label} className={b.hot ? "bar hot" : "bar"}><span>{b.label}</span><i><b style={{ "--w": b.w } as React.CSSProperties}></b></i><span>{b.shown}</span></div>)}</div>
  <a href={m.href} target="_blank" rel="noopener">{m.source}</a></div>
))}
</div>
<div className="gcta"><h3>Don&apos;t be the business still missing calls. Let&apos;s set you up.</h3>
 <div><Link className={buttonVariants({ variant: "brandStill" })} href="/contact">Book a free call<Ar /></Link><Link className={buttonVariants({ variant: "brandGhost" })} href="/services" style={{ color: "#EEF1F8" }}>See the demos<Ar /></Link></div></div>
</div>
</section>
<section className="night fs" id="agent"><div className="wrap">
<div className="ah"><div><span className="kick">How it works</span><h2>A missed call, <em>handled</em> for you.</h2><p>Your phone rings while you&apos;re busy. Here&apos;s what the AI does next, step by step. Example business.</p></div>
<div className="clk">time passed <b className="ck">01:22</b></div></div>
<div className="trk"><div className="ln"><i></i><s></s></div>
<div className="st on"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg></div><div><span className="t">00:00</span><h3>Missed call</h3><div className="cd">+1 905 ··· ·· 13. You&apos;re under a sink.</div></div></div><div className="st on"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4M9 13h.01M15 13h.01M9 17h6" /></svg></div><div><span className="t">00:02</span><h3>AI answers</h3><div className="cd">&quot;Smith Plumbing, how can I help?&quot;</div></div></div><div className="st on"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8z" /></svg></div><div><span className="t">00:41</span><h3>Checks the job</h3><div className="cd">Leaking tap · Hamilton · urgent</div></div></div><div className="st on"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4" /></svg></div><div><span className="t">01:20</span><h3>Books it</h3><div className="cd">Tue 10:00 added to your calendar</div></div></div><div className="st on"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h8" /></svg></div><div><span className="t">01:22</span><h3>You get a text</h3><div className="cd">&quot;New job booked. Details inside.&quot;</div></div></div>
</div>
<div className="ft"><div className="you"><span>You: <b>0 calls answered, 0 minutes spent.</b></span></div></div>
</div>
</section>
<section className="sec fs desktop-only" id="svc"><div className="wrap"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", marginBottom: "28px" }}><div><span className="kick">What I do</span><h2>Three ways I help.</h2></div><Link className={buttonVariants({ variant: "brandGhost" })} href="/services">All services<Ar /></Link></div><div className="xpanels">
<article className="xc on" tabIndex={0}>
 <div className="xc-closed"><span className="xc-num">01</span><span className="xc-name">Websites</span></div>
 <div className="xc-open">
  <span className="kick" style={{ margin: "0" }}>01 · Websites</span>
  <h3>A website that makes the phone ring.</h3>
  <p className="muted">For when people can&apos;t find you, or your site doesn&apos;t make them call.</p>
  <div className="xc-scene"><div className="scene" style={{ background: "#E6EBFF", padding: "48px 36px 0" }} aria-label="Animation: a website builds itself, then a visitor taps Call now">
<div className="browser" style={{ height: "100%", borderRadius: "16px 16px 0 0" }}>
<div className="bbar"><i></i><i></i><i></i><span>yourbusiness.com</span></div>
<div style={{ padding: "18px 22px" }}>
<div className="in-0" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b className="sk" style={{ width: "84px", height: "12px", background: "#141821" }}></b><span style={{ display: "flex", gap: "10px" }}><b className="sk" style={{ width: "34px", height: "8px", background: "#B9C1CD" }}></b><b className="sk" style={{ width: "34px", height: "8px", background: "#B9C1CD" }}></b><b className="sk" style={{ width: "34px", height: "8px", background: "#B9C1CD" }}></b></span></div>
<div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "20px", marginTop: "22px", alignItems: "center" }}>
<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
<b className="sk grow-8" style={{ width: "95%", height: "16px", background: "#141821" }}></b>
<b className="sk grow-14" style={{ width: "70%", height: "16px", background: "#141821" }}></b>
<b className="sk grow-20" style={{ width: "85%", height: "8px", background: "#B9C1CD", marginTop: "4px" }}></b>
<b className="sk grow-22" style={{ width: "60%", height: "8px", background: "#B9C1CD" }}></b>
<span style={{ position: "relative", alignSelf: "flex-start", marginTop: "8px" }}>
<span className="pop-30" style={{ display: "inline-block", background: "#FF6B1A", color: "#141821", fontWeight: "700", fontSize: "13px", borderRadius: "999px", padding: "8px 16px" }}>Call now</span>
<span className="rip" style={{ left: "24px", top: "-4px" }}></span>
<svg className="cur" viewBox="0 0 24 24" style={{ left: "52px", top: "16px" }}><path d="M4 2l16 9-7 2-3 7z" fill="#141821" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" /></svg>
</span>
</div>
<div className="pop-24" style={{ height: "124px", borderRadius: "12px", background: "#2346E8", position: "relative", overflow: "hidden" }}>
<span style={{ position: "absolute", right: "18px", top: "16px", width: "26px", height: "26px", borderRadius: "50%", background: "#FF6B1A" }}></span>
<svg viewBox="0 0 200 80" preserveAspectRatio="none" style={{ position: "absolute", left: "0", bottom: "0", width: "100%", height: "60%" }}><path d="M0 80L50 30l35 30 35-45 80 65z" fill="#DCE3FF" /></svg>
</div>
</div>
</div>
</div>
<div className="toast side-58" style={{ position: "absolute", right: "16px", bottom: "16px", width: "250px" }}><span className="ico hot" style={{ width: "38px", height: "38px", borderRadius: "12px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg></span><div><strong>New call from your site</strong><small>A visitor tapped Call now</small></div></div>
</div></div>
  <ul className="list"><li>Fast on phones</li><li>Call and quote buttons where thumbs reach</li><li>Page titles and Google basics done</li></ul>
  
 </div>
</article>
<article className="xc" tabIndex={0}>
 <div className="xc-closed"><span className="xc-num">02</span><span className="xc-name">AI receptionist</span></div>
 <div className="xc-open">
  <span className="kick" style={{ margin: "0" }}>02 · AI receptionist</span>
  <h3>Every call answered, day or night.</h3>
  <p className="muted">When you&apos;re busy or closed, the AI picks up, asks what they need and books the job.</p>
  <div className="xc-scene"><div className="scene" aria-label="Animation: a call rings, the AI answers, a time is booked and you get a text">
<span className="pill"><i></i>You&apos;re on a job</span>
<div style={{ position: "absolute", left: "24px", right: "24px", top: "72px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
<div className="pop-0" style={{ width: "130px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", fontSize: "14px" }}>
<span className="ico hot" style={{ width: "64px", height: "64px", borderRadius: "50%" }}><span className="ring" style={{ display: "flex" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "28px", height: "28px" }}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg></span></span>
<strong>Phone rings</strong><span className="muted" style={{ fontSize: "13px" }}>New customer</span></div>
<span className="grow-14" style={{ flex: "1", height: "2px", background: "#9AA4B4", marginTop: "32px" }}></span>
<div className="pop-20" style={{ width: "130px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", fontSize: "14px" }}>
<span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#E6EBFF", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="wave"><b></b><b></b><b></b><b></b><b></b></span></span>
<strong>AI answers</strong><span className="muted" style={{ fontSize: "13px" }}>Asks what, where, when</span></div>
<span className="grow-34" style={{ flex: "1", height: "2px", background: "#9AA4B4", marginTop: "32px" }}></span>
<div className="pop-40" style={{ width: "130px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", fontSize: "14px" }}>
<span style={{ width: "64px", height: "64px", borderRadius: "14px", background: "#F2F4F7", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4px", padding: "8px", boxSizing: "border-box" }}>
<b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b><b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b><b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b>
<b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b><b className="pop-48" style={{ background: "#FF6B1A", borderRadius: "3px" }}></b><b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b>
<b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b><b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b><b style={{ background: "#D6DBE3", borderRadius: "3px" }}></b>
</span>
<strong>Job booked</strong><span className="muted" style={{ fontSize: "13px" }}>Tue, 10:00 AM</span></div>
</div>
<div className="toast side-58" style={{ position: "absolute", right: "24px", bottom: "18px", width: "270px" }}><span className="ico" style={{ width: "38px", height: "38px", borderRadius: "12px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg></span><div><strong>Text to you</strong><small>New job: kitchen leak, Tue 10 AM</small></div></div>
</div></div>
  <ul className="list"><li>Answers in your business name</li><li>Books into your calendar</li><li>Texts you a short summary</li></ul>
  
 </div>
</article>
<article className="xc" tabIndex={0}>
 <div className="xc-closed"><span className="xc-num">03</span><span className="xc-name">AI agents &amp; automation</span></div>
 <div className="xc-open">
  <span className="kick" style={{ margin: "0" }}>03 · AI agents &amp; automation</span>
  <h3>Your busywork, on autopilot.</h3>
  <p className="muted">AI agents and n8n workflows that do the repeat work: leads, emails, reports, YouTube, sheets.</p>
  <div className="xc-scene"><div className="scene" style={{ backgroundColor: "#F7F8FA", backgroundImage: "radial-gradient(#C3CAD5 1.2px,transparent 1.2px)", backgroundSize: "20px 20px" }} aria-label="Animation: something new comes in, an AI agent handles it, and you get an alert">
<div style={{ position: "absolute", left: "48px", right: "48px", top: "40px", height: "100px" }}>
<div style={{ position: "absolute", left: "36px", right: "36px", top: "35px", height: "2px", background: "#9AA4B4" }}><span className="trav" style={{ top: "-6px", marginLeft: "-7px" }}></span></div>
<div style={{ position: "relative", zIndex: "2", display: "flex", justifyContent: "space-between", textAlign: "center" }}>
<div className="wfn" style={{ width: "88px" }}><span className="wfbox lit-8" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9l5 3-5 3z" /></svg></span>New video or lead</div>
<div className="wfn" style={{ width: "88px" }}><span className="wfbox lit-26" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" /></svg></span>AI agent works</div>
<div className="wfn" style={{ width: "88px" }}><span className="wfbox lit-46" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg></span>Saved + alert</div>
</div>
</div>
<div className="toast side-50" style={{ position: "absolute", right: "24px", bottom: "24px", width: "250px" }}><span className="ico hot" style={{ width: "36px", height: "36px", borderRadius: "10px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg></span><div><strong>Done for you</strong><small>5 new leads added to your sheet</small></div></div>
</div></div>
  <ul className="list"><li>Custom AI agents</li><li>n8n workflows for your tools</li><li>Leads, emails, reports, YouTube</li></ul>
  
 </div>
</article></div><div className="svc-prog"><button type="button" data-go={0} className="on"><i><em></em></i>Websites</button><button type="button" data-go={1} className=""><i><em></em></i>AI receptionist</button><button type="button" data-go={2} className=""><i><em></em></i>AI agents &amp; automation</button></div></div></section>
<section className="night fs mobile-only" style={{ padding: "56px 0" }}><div className="wrap" style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: "12px" }}><span className="kick">What I do</span><Link className={buttonVariants({ variant: "brand" })} style={{ marginTop: "24px", justifyContent: "center" }} href="/contact">Book a free call<Ar /></Link></div></section>
<WorkPanels />
<Testimonials full />
<section className="sec fs"><div className="wrap"><span className="kick">My AI agents</span><h2>Little helpers I built,<br />each with one job.</h2><ol className="agents"><li className="agr"><span className="agn">01</span><h3>Scout</h3><p className="job">Finds YouTube channels, scores them with AI, saves the good ones.</p><span className="agt">n8n · YouTube API · Gemini</span></li><li className="agr"><span className="agn">02</span><h3>Producer</h3><p className="job">Researches a topic and writes a full video package in Google Docs.</p><span className="agt">n8n · Gemini · Docs</span></li><li className="agr"><span className="agn">03</span><h3>Reader</h3><p className="job">Reads new articles, keeps the ones that matter, sends a summary.</p><span className="agt">n8n · RSS · Discord</span></li><li className="agr"><span className="agn">04</span><h3>Closer</h3><p className="job">Writes a personal email to each lead and checks for replies.</p><span className="agt">n8n · Gmail · Sheets</span></li></ol><Link className={buttonVariants({ variant: "brandGhost" })} style={{ marginTop: "32px" }} href="/projects">See them in action<Ar /></Link></div></section>
<section className="night fs" id="how"><div className="wrap"><span className="kick">How we&apos;d work</span><h2>From call to live in four steps.</h2><div className="hln"><i /></div>
<div className="steps">{howSteps.map((s) => <div key={s.n} className="step"><span className="n">{s.n}</span><h3>{s.t}</h3><ul className="muted">{s.li.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
<div className="hstage" aria-hidden="true">
{howSteps.map((s, i) => <div key={s.n} className="hs"><span className="big">{s.n}</span><div><h3>{s.t}</h3><ul>{s.li.map((x) => <li key={x}>{x}</li>)}</ul></div><HowArt i={i} /></div>)}
<div className="hdia"><i className="dl" />{howSteps.map((s, i) => <div key={s.n} className="dn"><div className="dtop"><span className="dc">{s.n}</span><HowArt i={i} /></div><b>{s.t}</b><small>{s.short}</small></div>)}</div>
</div></div></section>
<section className="sec fs"><div className="wrap" style={{ maxWidth: "900px" }}><span className="kick">Questions</span><h2>Before you ask.</h2><div className="faq"><details><summary>How much does it cost?</summary><p>Every business is different, so there is no fixed price list. We talk first, then I send a quote that fits what you need.</p></details><details><summary>How long does it take?</summary><p>It depends on the job. We agree on a timeline together after our call.</p></details><details><summary>Do I need to be technical?</summary><p>No. I set it up, explain it in plain words and stay around after launch.</p></details><details><summary>Who is this not for?</summary><p>Big companies with an IT team. I work best with small, busy businesses.</p></details></div></div></section>

      <FinalCta full title={<>Missing calls?<br />Let&apos;s fix that.</>} />
      <HomeFx />
    </div>
  );
}
