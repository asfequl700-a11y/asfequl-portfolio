import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, PenLine, Scissors, Rocket, Inbox, ServerCog, Radar, ListFilter, AtSign, Send } from "lucide-react";
import SiteFx from "../../components/SiteFx";
import ContactForm from "../../components/ContactForm";
import Shot from "../../components/Shot";
import WorkflowBoard from "../../components/WorkflowBoard";
import { Testimonials } from "../../components/Testimonials";
import { Ar } from "../../components/ui";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Get your time back: automation for YouTube creators",
  description: "Research, scripts, shorts and publishing eat the hours you could spend filming. I build the n8n and AI systems that do it for you, so you can make your next video.",
  alternates: { canonical: "/creators" },
};

const flow = [
  [Lightbulb, "Idea", "Research feed with topics your viewers ask for"],
  [PenLine, "Script", "First draft in your style, ready to edit"],
  [Scissors, "Shorts", "Your long video, cut and written into posts"],
  [Rocket, "Publish", "Checklist and scheduling, nothing forgotten"],
] as const;

const pains = [
  ["Hunting for ideas", "Hours of scrolling to decide what to film next. Hours you don't get back."],
  ["Writing every script from zero", "A blank page before every single video."],
  ["Cutting shorts by hand", "One long video should become many posts. Without time, it never does."],
  ["Uploads and inbox", "Scheduling, plus questions about your course or coaching."],
];

const builds = [
  [Lightbulb, "Idea research feed", "Fresh video ideas delivered to you, based on your niche. No more scrolling for them.", true],
  [PenLine, "Script first drafts", "Start from a draft in your voice, not a blank page.", true],
  [Scissors, "Shorts and posts pipeline", "Long video in, shorts and social posts out, without you doing it by hand.", false],
  [Rocket, "Publishing checklist", "Titles, thumbnails and scheduling done the same way every time. Nothing forgotten.", false],
  [Inbox, "Enquiry capture", "Questions about your course or coaching land in one place, ready to answer.", false],
  [ServerCog, "Hosted and kept running", "Built with n8n and AI. I host it and keep it working on a monthly plan.", false],
] as const;

const scout = [[Radar, "Scans YouTube channels"], [ListFilter, "Checks size, upload activity and offers"], [AtSign, "Finds contact details"], [Send, "Drafts the outreach for me to approve"]] as const;

export default function CreatorsPage() {
  return (
    <div className="page lp">
      <SiteFx />

      <section className="night lp-hero"><div className="wrap"><div className="lp-hgrid">
        <div>
          <span className="kick">For YouTube creators who sell something</span>
          <h1>Stop the busywork.<br /><em>Make your next video.</em></h1>
          <p className="lead muted">Research, scripts, shorts and publishing eat the hours you could spend filming. I build the systems that do them for you.</p>
          <div className="lp-row">
            <a className={buttonVariants({ variant: "brandStill" })} href="#book">Get my hours back<Ar /></a>
            <a className={buttonVariants({ variant: "brandGhost" })} href="#how">See how it works<Ar /></a>
          </div>
        </div>
        <ol className="lp-pipe" aria-label="Example: from idea to publish">
          {flow.map(([Icon, t, s]) => <li key={t}><span className="lp-ico"><Icon aria-hidden="true" /></span><div><b>{t}</b><small>{s}</small></div></li>)}
        </ol>
      </div></div></section>

      <div className="lp-marq" aria-hidden="true"><div>
        {[0, 1].map((k) => <span key={k}>{["Ideas", "Scripts", "Shorts", "Thumbnails", "Scheduling", "Replies", "Research", "Posts"].map((w) => <b key={w}>{w}</b>)}</span>)}
      </div></div>

      <section className="sec"><div className="wrap">
        <span className="kick">The real cost</span>
        <h2>Every hour on busywork<br />is a video you didn&apos;t make.</h2>
        <ol className="agents">
          {pains.map(([t, p], i) => <li key={t} className="agr"><span className="agn">0{i + 1}</span><h3>{t}</h3><p className="job">{p}</p><span /></li>)}
        </ol>
        <p className="lp-trade">You can&apos;t add hours to the day. To make more videos, you either give up sleep or hand the repeat work to a system. I build the system.</p>
      </div></section>

      <section className="sec" style={{ background: "#EFEBE4" }}><div className="wrap">
        <span className="kick">See it work</span>
        <h2>Film once.<br />Your agents do the rest.</h2>
        <p className="muted" style={{ marginTop: "16px", maxWidth: "38em", color: "#5A6380" }}>This is the kind of board I build in n8n. One video goes in. Agents read it, write it up and cut it down while you start the next one. You approve it, then it goes out.</p>
        <WorkflowBoard />
      </div></section>

      <section className="sec"><div className="wrap">
        <span className="kick">What you get back</span>
        <h2>Pick the job you hate most.<br />We automate it first.</h2>
        <div className="lp-bento">
          {builds.map(([Icon, t, p, big]) => <div key={t} className={big ? "lp-card big" : "lp-card"}><span className="lp-ico"><Icon aria-hidden="true" /></span><h3>{t}</h3><p>{p}</p></div>)}
          <div className="lp-card wide">
            <div><h3>Something else eating your time?</h3><p>If you can describe the task, we can look at automating it. Any kind of agent or workflow. Tell me about it on a free call.</p></div>
            <a className="lp-dark" href="#book">Apply for a free call<Ar /></a>
          </div>
        </div>
      </div></section>

      <section className="night sec" id="how"><div className="wrap">
        <span className="kick">How it works</span>
        <h2>From stuck in busywork<br />to done, in three steps.</h2>
        <ol className="lp-steps">
          <li><h3>Tell me where your week goes</h3><p>A short call. No tech talk.</p></li>
          <li><h3>We pick the biggest time-eater</h3><p>One workflow first, so you feel the difference before we add more.</p></li>
          <li><h3>I build it and keep it running</h3><p>I host it and fix it if something breaks. You just use it.</p></li>
        </ol>
      </div></section>

      <section className="sec"><div className="wrap">
        <span className="kick">Proof</span>
        <h2>I automate my own work first.</h2>
        <div className="rshots">
          <Shot src="/proof/n8n-video-package.webp" w={2540} h={470} alt="My n8n workflow that turns a topic into a video package: start, YouTube research, AI writing, then save and share" caption="Turns a topic into a full video package: it researches competitor videos, studies their thumbnails, writes titles, thumbnail ideas and a script, then saves it to a Google Doc and posts it to Discord. Running today." />
          <div className="rshots two">
            <Shot src="/proof/n8n-video-package-ai.webp" w={1740} h={825} alt="Close-up of the AI writing step in my n8n workflow" caption="Close-up of the AI writing step. One model writes, a backup model takes over if it fails." />
          </div>
        </div>
        <div className="lp-proof night">
          <div>
            <span className="lp-tag">Built by me, running today</span>
            <h3>I built a system that finds creators for me.</h3>
            <p>It screens thousands of channels for me. That is a lot of searching I don&apos;t do by hand. I&apos;d build the same kind of system for your channel.</p>
            <div className="lp-row"><Link className={buttonVariants({ variant: "brandStill" })} href="/projects">See my projects<Ar /></Link></div>
          </div>
          <div className="lp-mini">{scout.map(([Icon, t]) => <div key={t}><Icon aria-hidden="true" />{t}</div>)}</div>
        </div>
        <div className="lp-grid">
          <div className="lp-card"><h3>I&apos;ve seen real publishing</h3><p>I work on a marketing team and have watched video go from first idea to final upload.</p></div>
          <div className="lp-card"><h3>Results on real websites</h3><p>I&apos;ve worked on Ryne AI, Humaniser and Reilaa. See what changed on my Work page.</p><Link className="lp-go" href="/work">See my work →</Link></div>
        </div>
      </div></section>

      <Testimonials />

      {/* Video slot: add a click-to-load youtube-nocookie player here once Fahim sends an Unlisted link. */}

      <section className="sec"><div className="wrap" style={{ maxWidth: "900px" }}>
        <span className="kick">Questions</span>
        <h2>Quick answers.</h2>
        <div className="faq">
          <details><summary>How much time could I get back?</summary><p>It depends on what you do by hand today. On the call we list your repeat tasks, and I tell you honestly which ones are worth automating.</p></details>
          <details><summary>How much does it cost?</summary><p>Every channel is different, so there is no fixed price list. We talk first, then I send a quote that fits what you need.</p></details>
          <details><summary>Do I need to be technical?</summary><p>No. I set it up, explain it in plain words and stay around after launch.</p></details>
          <details><summary>Can I start small?</summary><p>Yes. We pick the one task that eats the most time and start there.</p></details>
        </div>
      </div></section>

      <section className="night sec" id="book"><div className="wrap"><div className="lp-cta">
        <div>
          <span className="kick">Your next step</span>
          <h2>Ready to get your week back?</h2>
          <p className="muted lp-fine">Tell me what eats your time. I reply personally within 48 hours.</p>
        </div>
        <div className="ctc-card"><ContactForm creators /></div>
      </div></div></section>
    </div>
  );
}
