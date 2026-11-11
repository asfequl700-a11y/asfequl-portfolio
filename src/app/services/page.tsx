import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";

// Ported from _design/v4-Services.dc.html
export const metadata: Metadata = {
  title: "Services",
  description: "Websites that make the phone ring, an AI receptionist that answers every call, lead follow-up and n8n automation for the boring jobs.",
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
</div></div><div className="srow"><div style={{ display: "flex", flexDirection: "column", gap: "18px" }}><span className="kick" style={{ margin: "0" }}>03 · Lead follow-up</span><h3 style={{ fontSize: "44px" }}>No enquiry left on read.</h3><p className="muted" style={{ fontSize: "18px" }}>Form fills, emails and DMs get a reply in minutes, then a nudge until they book.</p><ul className="ticks"><li>Instant first reply</li><li>Reminders that stop when they book</li><li>Every lead saved in one sheet</li></ul></div><div className="scene" aria-label="Animation: a new lead arrives, the AI replies, and the lead moves to Booked">
<span className="pill"><i></i>You&apos;re on a job. The AI is handling it.</span>
<div style={{ position: "absolute", top: "70px", left: "50%", marginLeft: "-254px", width: "508px", display: "flex", gap: "14px" }}>
<div className="col"><h4>New</h4></div>
<div className="col"><h4>Replied</h4></div>
<div className="col"><h4>Booked</h4><div className="lcard" style={{ marginTop: "auto", opacity: ".55" }}>Dental check-up<br /><span className="muted">Booked yesterday</span></div></div>
<div className="lcard lead" style={{ position: "absolute", left: "10px", top: "34px", width: "140px", boxSizing: "border-box" }}><strong>Sarah</strong><br /><span className="muted">Leaking tap, needs help this week</span></div>
<div className="pop-34" style={{ position: "absolute", left: "184px", top: "104px", width: "140px", background: "#2346E8", color: "#FFFFFF", borderRadius: "12px 12px 12px 4px", padding: "8px 10px", fontSize: "12px", boxSizing: "border-box" }}>AI: Hi Sarah, can we come Tue at 10?</div>
<div className="pop-64" style={{ position: "absolute", left: "358px", top: "104px", width: "140px", background: "#FF6B1A", color: "#141821", fontWeight: "700", borderRadius: "10px", padding: "8px 10px", fontSize: "12.5px", boxSizing: "border-box", textAlign: "center" }}>Booked, Tue 10 AM</div>
</div>
</div></div><div className="srow"><div style={{ display: "flex", flexDirection: "column", gap: "18px" }}><span className="kick" style={{ margin: "0" }}>04 · n8n automation</span><h3 style={{ fontSize: "44px" }}>The boring jobs, done for you.</h3><p className="muted" style={{ fontSize: "18px" }}>Copying form details, sending reminders, updating sheets. n8n connects your apps and does it on its own.</p><ul className="ticks"><li>Forms → Sheets → alerts</li><li>Custom flows for your tools</li><li>I show you how it works</li></ul></div><div className="scene" style={{ backgroundColor: "#F7F8FA", backgroundImage: "radial-gradient(#C3CAD5 1.2px,transparent 1.2px)", backgroundSize: "20px 20px" }} aria-label="Animation: a form comes in, n8n saves it to a sheet and alerts the team">
<div style={{ position: "absolute", left: "48px", right: "48px", top: "34px", height: "100px" }}>
<div style={{ position: "absolute", left: "36px", right: "36px", top: "35px", height: "2px", background: "#9AA4B4" }}><span className="trav" style={{ top: "-6px", marginLeft: "-7px" }}></span></div>
<div style={{ position: "relative", zIndex: "2", display: "flex", justifyContent: "space-between" }}>
<div className="wfn" style={{ width: "72px" }}><span className="wfbox lit-8" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg></span>Form sent</div>
<div className="wfn" style={{ width: "72px" }}><span className="wfbox lit-26" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M4 9h16M4 15h16M10 3v18" /></svg></span>Saved</div>
<div className="wfn" style={{ width: "72px" }}><span className="wfbox lit-46" style={{ width: "72px", height: "72px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg></span>Team alerted</div>
</div>
</div>
<div style={{ position: "absolute", left: "32px", bottom: "24px", width: "300px", background: "#FFFFFF", borderRadius: "12px", boxShadow: "inset 0 0 0 1px #D6DBE3", fontSize: "12.5px", overflow: "hidden" }}>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 0.8fr", background: "#E9EDF2", padding: "7px 12px", fontWeight: "600" }}><span>Name</span><span>Need</span><span>Time</span></div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 0.8fr", padding: "7px 12px", borderTop: "1px solid #E9EDF2" }} className="muted"><span>Omar</span><span>Boiler service</span><span>8:15</span></div>
<div className="in-28" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 0.8fr", padding: "7px 12px", borderTop: "1px solid #E9EDF2", background: "#FFF4EC" }}><span>Sarah</span><span>Leaking tap</span><span>9:42</span></div>
</div>
<div className="toast side-50" style={{ position: "absolute", right: "24px", bottom: "24px", width: "200px" }}><span className="ico hot" style={{ width: "36px", height: "36px", borderRadius: "10px" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg></span><div><strong>Team alert</strong><small>New lead saved</small></div></div>
</div></div></div></section>
      <FinalCta title={<>Not sure which one?<br />Ask me.</>} />
    </>
  );
}
