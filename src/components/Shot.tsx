"use client";

import { useRef } from "react";

// A real screenshot with a caption. Click opens it full size (same dialog look as the Work page proofs).
export default function Shot({ src, alt, caption, w, h }: { src: string; alt: string; caption: string; w: number; h: number }) {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <figure className="rshot">
      <button type="button" onClick={() => dlg.current?.showModal()} aria-label={`Open full size: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- already compressed WebP in /public/proof */}
        <img src={src} alt={alt} width={w} height={h} loading="lazy" />
        <span className="rshot-zoom">Tap to enlarge</span>
      </button>
      <figcaption><b>Real n8n workflow</b>{caption}</figcaption>
      <dialog ref={dlg} className="proof-dlg" onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <button type="button" className="proof-x" onClick={() => dlg.current?.close()} aria-label="Close">×</button>
      </dialog>
    </figure>
  );
}
