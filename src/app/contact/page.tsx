import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import ContactReach from "../../components/ContactReach";
import ContactForm from "../../components/ContactForm";

// Ported from _design/v4-Contact.dc.html
export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what your business does and where you lose customers. No pitch, just a plan. Email asfequl@hellofahim.com or send the form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="page">
      <SiteFx />
<section className="night ctc"><div className="wrap"><div className="stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "center" }}><div style={{ display: "flex", flexDirection: "column", gap: "22px" }}><h1>Let&apos;s talk about<br />your business.</h1><p className="muted">Tell me what you do and where you lose customers. No pitch, just a plan.</p><ContactReach /></div><div className="ctc-card"><ContactForm /></div></div></div></section>
    </div>
  );
}
