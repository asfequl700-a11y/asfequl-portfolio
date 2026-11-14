import type { ReactNode } from "react";
import Link from "next/link";
import MailChip from "./MailChip";
import ShareButton from "./ShareButton";
import { site, sparkPoints } from "../data/site";
import { buttonVariants } from "@/components/ui/button";

const arrow = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

// Circle arrow inside buttons: two arrows, the second slides in on hover (see .ar in globals.css).
export function Ar() {
  return <span className="ar" aria-hidden="true">{arrow}{arrow}</span>;
}

// Growth chart from the mockups (area + line that draws in + end dot).
export function Spark({ ys, w, className }: { ys: number[]; w: number; className: string }) {
  const pts = sparkPoints(ys, w);
  const line = "M" + pts.join(" L");
  const last = ys[ys.length - 1];
  return (
    <svg className={className} viewBox={`0 0 ${w} 200`} preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="sparkfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF6B1A" stopOpacity=".28" /><stop offset="1" stopColor="#FF6B1A" stopOpacity="0" /></linearGradient></defs>
      <path className="area" d={`${line} L${w} 200 L0 200 Z`} fill="url(#sparkfade)" />
      <path className="line" pathLength={1} d={line} />
      <circle className="tip" cx={w} cy={last} r="4" />
    </svg>
  );
}

// Closing call-to-action used at the bottom of every page except Contact.
// full: Home only, the section fills one screen like the other Home sections.
export function FinalCta({ title, extra, full }: { title: ReactNode; extra?: ReactNode; full?: boolean }) {
  return (
    <section className={full ? "night fs" : "night"}>
      <div className="wrap final">
        <span className="kick">One call is enough to start</span>
        <h2>{title}</h2>
        <p className="muted" style={{ fontSize: "20px", margin: "26px auto 36px", maxWidth: "30em" }}>Tell me what your business does and where you lose customers. I&apos;ll reply within one working day with a plan.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <Link className={buttonVariants({ variant: "brandStill" })} href="/contact">Book a free call<Ar /></Link>
          <MailChip />
        </div>
        {extra}
      </div>
      <div className="giant">hellofahim</div>
    </section>
  );
}

export const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
);
export const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" /></svg>
);

export function SocialLinks({ icons = false }: { icons?: boolean }) {
  const st = { display: "inline-flex", alignItems: "center" };
  return (
    <>
      <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" style={st}>{icons ? <LinkedInIcon /> : "LinkedIn"}</a>
      <a href={site.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X" style={st}>{icons ? <XIcon /> : "X"}</a>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="night">
      <div className="wrap">
        <div className="vfoot">
          <span>© 2026 {site.name}</span>
          <span style={{ display: "flex", gap: "22px", alignItems: "center" }}>
            <SocialLinks icons />
            <ShareButton />
          </span>
        </div>
      </div>
    </footer>
  );
}
