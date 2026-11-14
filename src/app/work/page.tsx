import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";
import { WorkList } from "../../components/Work";
import { Testimonials } from "../../components/Testimonials";

// Ported from _design/v4-Work.dc.html
export const metadata: Metadata = {
  title: "Work",
  description: "SEO, website growth and day-to-day management for ryne.ai, humaniser.com and reilaa.com: what I did and what changed.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="page">
      <SiteFx />
<section className="night"><div className="wrap"><div className="phero"><span className="kick">Work</span><h1>Three live sites.<br />Real people, real traffic.</h1><p className="lead">I&apos;m the SEO specialist for these three websites. I handle their growth and day-to-day management. Here&apos;s what the people I work with say, and how the Google traffic grew.</p></div></div></section><Testimonials /><WorkList />
      <FinalCta title={<>Want this for<br />your site?</>} />
    </div>
  );
}
