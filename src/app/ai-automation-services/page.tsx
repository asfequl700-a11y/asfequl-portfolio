import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import Shot from "../../components/Shot";
import { FinalCta } from "../../components/ui";
import { WebsiteRow, ReceptionistRow, AgentsRow } from "../../components/ServiceRows";

// Ported from _design/v4-Services.dc.html
export const metadata: Metadata = {
  title: "AI Automation Services for Small Business",
  description: "Custom AI agents, n8n workflow automation, an AI receptionist and websites for small business. Get hours back every week. Book a free call.",
  alternates: { canonical: "/ai-automation-services" },
};

export default function ServicesPage() {
  return (
    <div className="page">
      <SiteFx />
<section className="light"><div className="wrap"><div className="phero"><span className="kick">AI automation services</span><h1>Pick the problem.<br />I&apos;ll fix it.</h1><p className="lead">AI agents, workflow automation, an AI receptionist and websites for small business. Each one fixes a way you lose time or customers. Start with the one that costs you most.</p></div></div></section><section style={{ paddingBottom: "90px" }}><div className="wrap"><WebsiteRow /><ReceptionistRow /><AgentsRow /></div></section>
      <section className="sec"><div className="wrap">
        <span className="kick">Proof</span>
        <h2>Real workflows,<br />not mock-ups.</h2>
        <div className="rshots two">
          <Shot src="/proof/n8n-receptionist.webp" w={1560} h={470} alt="My n8n AI receptionist workflow with tools to book, look up, update and delete appointments" caption="The tools my AI receptionist can call: availability, booking, lookups, changes and cancellations." />
          <Shot src="/proof/n8n-video-package-ai.webp" w={1740} h={825} alt="Close-up of the AI writing step in my n8n video package workflow" caption="A video-package workflow for YouTube creators: research, thumbnails, titles and a script." />
        </div>
      </div></section>
      <FinalCta title={<>Not sure which one?<br />Ask me.</>} />
    </div>
  );
}
