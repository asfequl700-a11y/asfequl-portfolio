import type { Metadata } from "next";
import Link from "next/link";
import { Phone, PhoneMissed, Bot, ClipboardCheck, CalendarCheck, MessageSquare } from "lucide-react";
import SiteFx from "../../components/SiteFx";
import { WebsiteRow, ReceptionistRow, AgentsRow } from "../../components/ServiceRows";
import Shot from "../../components/Shot";
import { Testimonials } from "../../components/Testimonials";
import { FinalCta, Ar } from "../../components/ui";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Stop missing calls: websites and AI receptionist for local businesses",
  description: "You can't be on the job and by the phone at once. I build the website that makes the phone ring and the AI receptionist that answers it and books the job. For plumbers, electricians, clinics and more.",
  alternates: { canonical: "/local" },
};

const who = ["Plumbers", "Electricians", "Car painters", "Roofers", "Cleaners", "Clinics", "Salons"];
const hero = [
  [Phone, "Phone rings", "You're busy on a job"],
  [Bot, "AI answers", "In your business name"],
  [CalendarCheck, "Job booked", "Straight into your calendar"],
  [MessageSquare, "You get a text", "A short summary, nothing to chase"],
] as const;
const missed = [
  [PhoneMissed, "00:00", "Missed call", "You're under a sink."],
  [Bot, "00:02", "AI answers", "“Smith Plumbing, how can I help?”"],
  [ClipboardCheck, "00:41", "Checks the job", "Leaking tap · Hamilton · urgent"],
  [CalendarCheck, "01:20", "Books it", "Tue 10:00 added to your calendar"],
  [MessageSquare, "01:22", "You get a text", "“New job booked. Details inside.”"],
] as const;
const steps = [
  ["Call", "15 minutes. You tell me how you get customers today."],
  ["Plan", "A one-page plan. Nothing starts until you say yes."],
  ["Build", "A preview link for you to check. Revisions until you are happy. You run the business, I do the building."],
  ["Launch", "Live on your domain. Handover, and I stay on for fixes."],
];

export default function LocalPage() {
  return (
    <div className="page lp">
      <SiteFx />

      <section className="night lp-hero"><div className="wrap"><div className="lp-hgrid">
        <div>
          <span className="kick">For local businesses</span>
          <h1>Don&apos;t lose jobs<br /><em>to missed calls.</em></h1>
          <p className="lead muted">Missed calls are lost jobs, and you can&apos;t be on the job and by the phone at the same time. I build the website that makes the phone ring, and an AI receptionist that answers it, so you keep working and the jobs keep coming.</p>
          <div className="lp-row">
            <Link className={buttonVariants({ variant: "brandStill" })} href="/contact">Get my calls answered<Ar /></Link>
            <a className={buttonVariants({ variant: "brandGhost" })} href="#missed">See a missed call handled<Ar /></a>
          </div>
        </div>
        <ol className="lp-pipe" aria-label="What happens when the phone rings">
          {hero.map(([Icon, t, s]) => <li key={t}><span className="lp-ico"><Icon aria-hidden="true" /></span><div><b>{t}</b><small>{s}</small></div></li>)}
        </ol>
      </div></div></section>

      <div className="lp-marq" aria-label="Who it is for"><div>
        {[0, 1].map((k) => <span key={k} aria-hidden={k === 1}>{who.map((w) => <b key={w}>{w}</b>)}</span>)}
      </div></div>

      <section className="night sec" id="missed"><div className="wrap">
        <span className="kick">A missed call, handled</span>
        <h2>Under a sink or on a roof,<br />the phone still gets answered.</h2>
        <p className="muted" style={{ marginTop: "14px" }}>Example business. Here is what the AI does in under two minutes while you keep working.</p>
        <ol className="lp-htl">
          {missed.map(([Icon, t, h, s]) => <li key={t}><span className="dot"><Icon aria-hidden="true" /></span><time>{t}</time><div><b>{h}</b><br /><span className="t">{s}</span></div></li>)}
        </ol>
      </div></section>

      <section className="sec"><div className="wrap">
        <span className="kick">Under the hood</span>
        <h2>It doesn&apos;t just answer.<br />It books the job.</h2>
        <div className="rshots"><Shot src="/proof/n8n-receptionist.webp" w={1560} h={470} alt="My n8n AI receptionist workflow: tools to check availability, book, look up, update and delete appointments, and save new clients" caption="The tools the AI can call: check availability, book, look up, change and cancel appointments, find a client and save a new one." /></div>
      </div></section>

      <section className="light" style={{ paddingBottom: "40px" }}><div className="wrap">
        <div className="phero" style={{ paddingBottom: "0" }}><span className="kick">What you get</span><h2 style={{ maxWidth: "20em" }}>Three jobs I take off your plate.</h2></div>
        <WebsiteRow /><ReceptionistRow /><AgentsRow />
      </div></section>

      <section className="night sec" id="how"><div className="wrap">
        <span className="kick">How we&apos;d work</span>
        <h2>Live in four steps,<br />while you keep working.</h2>
        <ol className="lp-steps">{steps.map(([t, p]) => <li key={t}><h3>{t}</h3><p>{p}</p></li>)}</ol>
      </div></section>

      <Testimonials />

      <section className="sec"><div className="wrap" style={{ maxWidth: "900px" }}>
        <span className="kick">Questions</span>
        <h2>Quick answers.</h2>
        <div className="faq">
          <details><summary>How much time will this save me?</summary><p>It depends on how many calls and enquiries you handle by hand today. On our call I ask about your week and tell you honestly what is worth automating.</p></details>
          <details><summary>How much does it cost?</summary><p>Every business is different, so there is no fixed price list. We talk first, then I send a quote that fits what you need.</p></details>
          <details><summary>How long does it take?</summary><p>It depends on the job. We agree on a timeline together after our call.</p></details>
          <details><summary>Do I need to be technical?</summary><p>No. I set it up, explain it in plain words and stay around after launch.</p></details>
          <details><summary>Who is this not for?</summary><p>Big companies with an IT team. I work best with small, busy businesses.</p></details>
        </div>
      </div></section>

      <FinalCta title={<>Stop missing calls.<br />Start saving time.</>} />
    </div>
  );
}
