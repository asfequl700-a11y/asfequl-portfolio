import type { Metadata } from "next";
import Link from "next/link";
import MailChip from "../components/MailChip";
import { Ar, SocialLinks } from "../components/ui";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const css = `
/* one screen, no scroll: hide the footer and lock the page while this view is mounted */
html,body{overflow:hidden!important;height:100%}
.v footer{display:none}
.nf{position:relative;height:calc(100svh - var(--hdr));overflow:hidden;background:linear-gradient(#101935 0%,#1b2a5c 70%,#2b3a74 100%);color:#EEF1F8;text-align:center}
.nf svg.scene{position:absolute;inset:0;width:100%;height:100%}
.nf .box{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:0 16px 40px}
.nf h1{font-family:var(--f-display);font-size:clamp(88px,18vw,200px);line-height:.9;margin:0;letter-spacing:-.04em}
.nf h1 span{color:#FF6B1A}
.nf p{margin:0;font-size:clamp(17px,2.2vw,22px);color:#A9B3CC;max-width:26em}
.nf .row{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:center;margin-top:6px}
.nf .social{display:flex;gap:18px;align-items:center}
.nf .social a{color:#EEF1F8;opacity:.85}.nf .social a:hover{opacity:1;color:#FF6B1A}
.nf .float{animation:nf-float 6s ease-in-out infinite}
.nf .fly{animation:nf-fly 26s linear infinite}
.nf .tw{animation:nf-tw 3s ease-in-out infinite}
@keyframes nf-float{50%{transform:translateY(-14px) rotate(4deg)}}
@keyframes nf-fly{from{transform:translateX(-300px)}to{transform:translateX(1700px)}}
@keyframes nf-tw{50%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.nf .float,.nf .fly,.nf .tw{animation:none}.nf .fly{transform:translateX(900px)}}
@media (max-width:640px){.nf .hide-sm{display:none}}
`;

export default function NotFound() {
  return (
    <section className="nf">
      <style>{css}</style>
      <svg className="scene" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {/* stars */}
        {[[120, 90], [300, 200], [520, 70], [760, 150], [980, 60], [1190, 180], [1400, 90], [1500, 260], [660, 260], [60, 320]].map(([x, y], i) => (
          <circle key={i} className="tw" style={{ animationDelay: `${i * 0.35}s` }} cx={x} cy={y} r={i % 3 ? 2 : 3} fill="#fff" />
        ))}
        {/* moon */}
        <circle cx="1330" cy="170" r="52" fill="#FFE8B8" /><circle cx="1352" cy="156" r="46" fill="#1b2a5c" opacity=".35" />
        {/* plane pulling a banner */}
        <g className="fly hide-sm">
          <g transform="translate(0 130)">
            <path d="M-210 -6h150l-8 12h-142z" fill="#FF6B1A" /><text x="-195" y="5" fontSize="13" fill="#101935" fontWeight="700">lost? this way →</text>
            <path d="M-60 0h90l30-10 14 10-14 10-30-6h-90z" fill="#EEF1F8" /><path d="M-10 0l-18-26h12l24 24zM-10 2l-18 26h12l24-24z" fill="#C9D1E8" />
          </g>
        </g>
        {/* birds */}
        <g fill="none" stroke="#EEF1F8" strokeWidth="3" strokeLinecap="round" opacity=".8">
          <path d="M900 260q12-14 24 0q12-14 24 0" /><path d="M980 300q9-10 18 0q9-10 18 0" /><path d="M830 320q8-9 16 0q8-9 16 0" />
        </g>
        {/* astronaut */}
        <g className="float" transform="translate(250 300)">
          <rect x="-34" y="-8" width="68" height="76" rx="22" fill="#EEF1F8" />
          <circle cx="0" cy="-34" r="32" fill="#EEF1F8" /><rect x="-22" y="-46" width="44" height="26" rx="13" fill="#101935" /><ellipse cx="-8" cy="-40" rx="7" ry="4" fill="#5b6fb8" />
          <rect x="-46" y="0" width="16" height="44" rx="8" fill="#C9D1E8" transform="rotate(25 -38 0)" /><rect x="30" y="0" width="16" height="44" rx="8" fill="#C9D1E8" transform="rotate(-35 38 0)" />
          <rect x="-26" y="62" width="20" height="40" rx="10" fill="#C9D1E8" /><rect x="6" y="62" width="20" height="40" rx="10" fill="#C9D1E8" />
          <rect x="-12" y="14" width="24" height="16" rx="4" fill="#FF6B1A" />
          <path d="M60 20c60-20 60-70 120-70" stroke="#A9B3CC" strokeWidth="2" fill="none" strokeDasharray="4 6" />
        </g>
        {/* mountains */}
        <path d="M0 800V560l180-140 150 120 190-190 220 200 170-120 210 180 180-130 300 200v140z" fill="#243468" />
        <path d="M0 800V650l140-90 160 100 200-130 240 150 200-110 220 130 180-90 260 120v70z" fill="#18234d" />
        {/* city */}
        <g fill="#0e1631">
          {[[40, 90], [110, 140], [170, 70], [250, 120], [1180, 110], [1250, 160], [1330, 80], [1400, 130], [1480, 100]].map(([x, h], i) => (
            <rect key={i} x={x} y={740 - h} width={i % 2 ? 56 : 46} height={h + 60} />
          ))}
        </g>
        <g fill="#FFD27A" opacity=".8">
          {[[56, 665], [126, 625], [186, 700], [266, 640], [1196, 650], [1266, 600], [1346, 685], [1416, 635], [1496, 670]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="8" height="10" />
          ))}
        </g>
        <rect y="740" width="1600" height="60" fill="#0e1631" />
      </svg>

      <div className="box">
        <h1>4<span>0</span>4</h1>
        <p>This page got lost in space. Don&apos;t waste time here, the good stuff is on the home page.</p>
        <div className="row">
          <Link className={buttonVariants({ variant: "brandStill" })} href="/">Take me home<Ar /></Link>
        </div>
        <div className="row" style={{ marginTop: 18 }}>
          <MailChip />
          <span className="social"><SocialLinks icons /></span>
        </div>
      </div>
    </section>
  );
}
