import type { ReactNode } from "react";
import Link from "next/link";
import MailChip from "./MailChip";
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
      <path className="area" d={`${line} L${w} 200 L0 200 Z`} />
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

export function SocialLinks() {
  return (
    <>
      <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      {/* TODO Fahim: X link. Hidden while site.x is "#" */}
      {site.x !== "#" && <a href={site.x} target="_blank" rel="noopener noreferrer">X</a>}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="night">
      <div className="wrap">
        <div className="vfoot">
          <span>© 2026 {site.name}</span>
          <span style={{ display: "flex", gap: "22px" }}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <SocialLinks />
          </span>
        </div>
      </div>
    </footer>
  );
}
