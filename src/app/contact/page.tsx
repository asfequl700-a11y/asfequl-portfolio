import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { SocialLinks } from "../../components/ui";
import MailChip from "../../components/MailChip";
import ContactForm from "../../components/ContactForm";

// Ported from _design/v4-Contact.dc.html
export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what your business does and where you lose customers. No pitch, just a plan. Email asfequl@hellofahim.com or send the form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteFx />
<section className="night" style={{ paddingBottom: "110px" }}><div className="wrap"><div className="stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", paddingTop: "72px", alignItems: "start" }}><div style={{ display: "flex", flexDirection: "column", gap: "26px" }}><h1 style={{ fontSize: "96px" }}>Let&apos;s talk about<br />your business.</h1><p className="muted" style={{ fontSize: "20px" }}>Tell me what you do and where you lose customers. No pitch, just a plan.</p><MailChip style={{ alignSelf: "flex-start" }} /><div style={{ display: "flex", gap: "16px" }}><SocialLinks /></div></div><ContactForm /></div></div></section>
    </>
  );
}
