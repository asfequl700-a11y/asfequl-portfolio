"use client";

import { useRef } from "react";

export type ProofShot = { src: string; alt: string };

// Small "proof" thumbnail on a site's chart card. Click opens the real Ahrefs / Search Console screenshot full size.
// No screenshot yet: nothing shows on the live site; on localhost a dashed box marks where it will go.
export default function Proof({ shot, site }: { shot?: ProofShot; site: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  if (!shot) {
    if (process.env.NODE_ENV !== "development") return null;
    return <span className="proof empty" title={`Add a screenshot for ${site} in src/data/site.ts (proof)`}>Proof screenshot<br />goes here</span>;
  }
  return (
    <>
      <button type="button" className="proof" onClick={() => dlg.current?.showModal()} aria-label={`See the real screenshot for ${site}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local screenshot, sizes vary */}
        <img src={shot.src} alt="" />
        <span>See proof</span>
      </button>
      <dialog ref={dlg} className="proof-dlg" onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt={shot.alt} />
        <button type="button" className="proof-x" onClick={() => dlg.current?.close()} aria-label="Close">×</button>
      </dialog>
    </>
  );
}
