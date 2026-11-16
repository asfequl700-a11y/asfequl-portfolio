"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = "G-TSM3CLHD8N";
const KEY = "analytics-consent";

// Google Analytics loads only after the visitor clicks Accept (needed for UK/EU visitors).
export default function Analytics() {
  const [choice, setChoice] = useState<"yes" | "no" | "ask" | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch {}
    // reading localStorage must wait until after hydration, so setting state here is intended
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(saved === "yes" || saved === "no" ? saved : "ask");
  }, []);

  function pick(v: "yes" | "no") {
    try { localStorage.setItem(KEY, v); } catch {}
    setChoice(v);
  }

  return (
    <>
      {choice === "yes" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {choice === "ask" && (
        <div role="dialog" aria-label="Cookie consent" className="fixed bottom-4 left-4 right-4 z-9999 max-w-md rounded-xl border border-white/15 bg-neutral-900 p-4 text-sm text-white shadow-2xl sm:right-auto">
          <p className="mb-3">I use Google Analytics to count visits. It sets cookies. Is that OK?</p>
          <div className="flex gap-2">
            <button onClick={() => pick("yes")} className="rounded-lg bg-white px-4 py-2 font-medium text-black">Accept</button>
            <button onClick={() => pick("no")} className="rounded-lg border border-white/30 px-4 py-2">No thanks</button>
          </div>
        </div>
      )}
    </>
  );
}
