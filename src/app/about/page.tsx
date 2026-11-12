import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import Image from "next/image";
import { FinalCta } from "../../components/ui";

// Ported from _design/v4-About.dc.html
export const metadata: Metadata = {
  title: "About",
  description: "Hi, I’m Fahim from Comilla, Bangladesh. I work on website growth with a UK team at Ryne AI and build n8n automations for small businesses.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteFx />
<section className="light"><div className="wrap"><div className="phero stack" style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: "56px", alignItems: "end" }}><div><span className="kick">About</span><h1 style={{ fontSize: "96px" }}>Hi, I&apos;m Fahim.<br />I like making<br />computers do the work.</h1></div><div className="arch" style={{ height: "420px", width: "100%" }}><Image src="/profile.jpg" alt="Portrait of Fahim" fill sizes="(max-width: 900px) 100vw, 40vw" preload /></div></div></div></section><section className="sec" style={{ paddingTop: "20px" }}><div className="wrap stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px" }}><div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "20px" }}><p>I live in Comilla, Bangladesh. Since October 2025 I&apos;ve worked with a UK team on website growth at Ryne AI, and I help on Humaniser and Reilaa.</p><p>Along the way I fell for automation. I build n8n workflows that do my repetitive work, and now I help small businesses do the same: a better website and fewer missed customers.</p><p className="muted" style={{ fontSize: "16px" }}><span className="todo">check this story is true in your words</span></p></div><div style={{ display: "flex", flexDirection: "column", gap: "28px" }}><div><h3 style={{ marginBottom: "14px" }}>Tools I use</h3><div className="tags">{[["Next.js", "nextdotjs"], ["React", "react"], ["Tailwind CSS", "tailwindcss"], ["n8n", "n8n"], ["Gemini", "googlegemini"], ["Claude", "claude"], ["Google Sheets", "googlesheets"], ["Discord", "discord"], ["Vercel", "vercel"], ["GitHub", "github"], ["Resend", "resend"], ["Obsidian", "obsidian"], ["Search Console", "googlesearchconsole"]].map(([name, logo]) => <span key={logo} style={{ fontSize: "15px", padding: "7px 14px", display: "inline-flex", alignItems: "center", gap: "8px" }}><img src={`/logos/${logo}.svg`} alt="" width={18} height={18} />{name}</span>)}</div></div><div><h3 style={{ marginBottom: "6px" }}>Timeline</h3><div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "16px", padding: "16px 0", borderTop: "1px solid #DAD5CB" }}><span className="mono" style={{ fontSize: "14px", color: "#FF6B1A" }}>Oct 2025 – now</span><span>Ryne AI · website growth &amp; management</span></div><div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "16px", padding: "16px 0", borderTop: "1px solid #DAD5CB" }}><span className="mono" style={{ fontSize: "14px", color: "#FF6B1A" }}>Nov 2025 – now</span><span>Humaniser &amp; Reilaa · website growth &amp; management</span></div><div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "16px", padding: "16px 0", borderTop: "1px solid #DAD5CB" }}><span className="mono" style={{ fontSize: "14px", color: "#FF6B1A" }}>2019 – now</span><span>Building AI tools &amp; AI automation</span></div></div></div></div></section>
      <FinalCta title={<>Say hi.</>} extra={<p className="clock" style={{ marginTop: "30px" }}>Comilla, Bangladesh · 02:14 AM · my AI is still answering</p>} />
    </>
  );
}
