"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { site } from "../data/site";

// Phones get the native share sheet; desktops without it copy the link instead.
export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: site.name, url }); } catch { /* user closed the sheet */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: nothing else to do */ }
  };
  return (
    <button type="button" onClick={share} aria-label={copied ? "Link copied" : "Share this site"} title={copied ? "Link copied" : "Share"}
      style={{ display: "inline-flex", alignItems: "center", background: "none", border: 0, padding: 0, color: "inherit", cursor: "pointer" }}>
      {copied ? <Check size={20} aria-hidden="true" /> : <Share2 size={20} aria-hidden="true" />}
    </button>
  );
}
