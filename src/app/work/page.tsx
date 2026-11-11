import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";
import { WorkList } from "../../components/Work";

// Ported from _design/v4-Work.dc.html
export const metadata: Metadata = {
  title: "Work",
  description: "Website growth and day-to-day management for Ryne AI, Humaniser and Reilaa: what I did and what changed.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <SiteFx />
<section className="night"><div className="wrap"><div className="phero"><span className="kick">Work</span><h1>Three live sites.<br />Real people, real traffic.</h1><p className="lead">I&apos;ve worked on growth and day-to-day management for these websites. Here&apos;s what I did and what changed.</p></div></div></section><WorkList />
      <FinalCta title={<>Want this for<br />your site?</>} />
    </>
  );
}
