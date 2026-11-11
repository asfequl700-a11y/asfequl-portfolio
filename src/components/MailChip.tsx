"use client";

import { useState, type CSSProperties } from "react";
import { site } from "../data/site";

export default function MailChip({ style }: { style?: CSSProperties }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`; // clipboard blocked: open the mail app instead
    }
  };
  return (
    <span className="mailchip" style={style}>
      {site.email}
      <button type="button" onClick={copy} aria-live="polite">{copied ? "Copied" : "Copy"}</button>
    </span>
  );
}
