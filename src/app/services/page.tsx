import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";

// Ported from _design/v4-Services.dc.html
export const metadata: Metadata = {
  title: "Services",
  description: "Websites that make the phone ring, an AI receptionist that answers every call, and AI agents and automation for the boring jobs.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <SiteFx />
<section className="light"><div className="wrap"><div className="phero"><span className="kick">Services</span><h1>Pick the problem.<br />I&apos;ll fix it.</h1><p className="lead">Each service solves one way you lose customers. Start with the one that costs you most.</p></div></div></section><section style={{ paddingBottom: "90px" }}><div className="wrap"><div className="srow"><div style={{ display: "flex", flexDirection: "column", gap: "18px" }}><span className="kick" style={{ margin: "0" }}>01 · Websites</span><h3 style={{ fontSize: "44px" }}>A website that makes the phone ring.</h3><p className="muted" style={{ fontSize: "18px" }}>For when people can&apos;t find you, or your site doesn&apos;t make them call.</p><ul className="ticks"><li>Fast on phones</li><li>Call and quote buttons where thumbs reach</li><li>Page titles and Google basics done</li></ul></div><div className="scene" style={{ background: "#E6EBFF", padding: "48px 36px 0" }} aria-label="Animation: a website builds itself, then a visitor taps Call now">
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
</div></div><div className="srow"><div style={{ display: "flex", flexDirection: "column", gap: "18px" }}><span className="kick" style={{ margin: "0" }}>02 · AI receptionist</span><h3 style={{ fontSize: "44px" }}>Every call answered, day or night.</h3><p className="muted" style={{ fontSize: "18px" }}>When you&apos;re busy or closed, the AI picks up, asks what they need and books the job.</p><ul className="ticks"><li>Answers in your business name</li><li>Books into your calendar</li><li>Texts you a short summary</li></ul></div><div className="scene" aria-label="Animation: a call rings, the AI answers, a time is booked and you get a text">
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
</div></div><div className="srow"><div style={{ display: "flex", flexDirection: "column", gap: "18px" }}><span className="kick" style={{ margin: "0" }}>03 · AI agents &amp; automation</span><h3 style={{ fontSize: "44px" }}>Your busywork, on autopilot.</h3><p className="muted" style={{ fontSize: "18px" }}>AI agents and n8n workflows that do the repeat work: lead follow-up, emails, reports, YouTube, sheets.</p><ul className="ticks"><li>Custom AI agents</li><li>n8n workflows for your tools</li><li>Leads, emails, reports, YouTube</li></ul></div><div className="scene" style={{ backgroundColor: "#F7F8FA", backgroundImage: "radial-gradient(#C3CAD5 1.2px,transparent 1.2px)", backgroundSize: "20px 20px" }} aria-label="Animation: something new comes in, an AI agent handles it, and you get an alert">
<div style={{ position: "absolute", left: "48px", right: "48px", top: "40px", height: "100px" }}>
<div style={{ position: "absolute", left: "36px", right: "36px", top: "35px", height: "2px", background: "#9AA4B4" }}><span className="trav" style={{ top: "-6px", marginLeft: "-7px" }}></span></div>
<div style={{ position: "relative", zIndex: "2", display: "flex", justifyContent: "space-between", textAlign: "center" }}>
<div className="wfn" style={{ width: "88px" }}><span className="wfbox lit-8" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9l5 3-5 3z" /></svg></span>New video or lead</div>
<div className="wfn" style={{ width: "88px" }}><span className="wfbox lit-26" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" /></svg></span>AI agent works</div>
<div className="wfn" style={{ width: "88px" }}><span className="wfbox lit-46" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg></span>Saved + alert</div>
</div>
</div>
<div className="toast side-50" style={{ position: "absolute", right: "24px", bottom: "24px", width: "250px" }}><span className="ico hot" style={{ width: "36px", height: "36px", borderRadius: "10px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg></span><div><strong>Done for you</strong><small>5 new leads added to your sheet</small></div></div>
</div></div></div></section>
      <FinalCta title={<>Not sure which one?<br />Ask me.</>} />
    </>
  );
}
