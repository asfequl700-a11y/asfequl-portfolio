import type { Metadata } from "next";
import Link from "next/link";
import { Caveat } from "next/font/google";
import MailChip from "../components/MailChip";
import { Ar, SocialLinks } from "../components/ui";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// Pencil-sketch 404, same ink as the Home hero doodles (HeroDoodles.tsx): white line on navy, wobbly filter, Caveat handwriting.
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"] });
const INK = "#EEF1F8";

const css = `
/* one screen, no scroll: navy everywhere, footer hidden, page locked while this view is mounted */
html,body{overflow:hidden!important;height:100%;background:#101935!important}
.v footer{display:none}
.nf{position:relative;height:calc(100svh - var(--hdr));min-height:520px;overflow:hidden;color:${INK};text-align:center;
  background:
    linear-gradient(rgba(238,241,248,.035) 1px,transparent 1px) 0 0/34px 34px,
    linear-gradient(90deg,rgba(238,241,248,.035) 1px,transparent 1px) 0 0/34px 34px,
    radial-gradient(ellipse 70% 60% at 50% 45%,#18265a 0%,#101935 62%,#0b1230 100%)}
.nf .art{position:absolute;left:0;width:100%;height:auto;pointer-events:none;fill:none;stroke:${INK};stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.nf .sky{top:0}.nf .land{bottom:0}
.nf .ink{filter:url(#nf-sk)}
.nf .ghost{filter:url(#nf-sk2);opacity:.3;transform:translate(1.6px,1.2px)}
.nf .soft{opacity:.5}.nf .faint{opacity:.28}
.nf .art text{fill:${INK};stroke:none}
.nf .box{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 20px 7vh}
.nf .kick{font:600 13px/1 var(--f-mono),monospace;letter-spacing:.28em;text-transform:uppercase;color:#A9B3CC;opacity:.8}
.nf h1{font-size:clamp(120px,21vw,230px);line-height:.8;margin:14px 0 0;font-weight:700;letter-spacing:.02em}
.nf .under{width:min(300px,60vw);height:auto;margin:-4px 0 18px;overflow:visible}
.nf h2{font-size:clamp(30px,3.6vw,46px);line-height:1;margin:0;font-weight:700}
.nf p{margin:12px 0 0;font-size:clamp(16px,1.5vw,19px);color:#A9B3CC;max-width:30em}
.nf .cta{position:relative;margin-top:28px}
.nf .note{position:absolute;right:calc(100% + 10px);top:-30px;width:170px;height:auto;overflow:visible;fill:none;stroke:${INK};stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.nf .note text{fill:${INK};stroke:none}
.nf .reach{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:center;margin-top:22px}
.nf .social{display:flex;gap:16px;align-items:center}
.nf .social a{color:${INK};opacity:.8;transition:opacity .2s}.nf .social a:hover{opacity:1}
@media (max-width:760px){.nf .note,.nf .hide-sm{display:none}.nf .box{padding-bottom:12vh}}
`;

const SPARK = "M0 -11 C1 -4 4 -1 11 0 C4 1 1 4 0 11 C-1 4 -4 1 -11 0 C-4 -1 -1 -4 0 -11Z";
const CLOUD = "M10 40 C0 40 0 24 12 24 C12 10 32 6 38 18 C44 6 64 10 62 26 C74 26 74 40 62 40 Z";
// [x, y, scale, faint?]
const SPARKS: [number, number, number, boolean][] = [[520, 70, 1, false], [760, 40, .6, true], [1010, 250, .7, true], [600, 300, .5, true], [1290, 330, .8, false], [60, 360, .7, true], [1550, 70, .6, true], [880, 150, .5, true]];
const DOTS = [[450, 180], [680, 120], [1120, 60], [1500, 300], [200, 40], [960, 330], [380, 380]];

// Sky layer: planet, astronaut on a tether, plane with banner, moon, clouds, birds, stars.
function Sky() {
  return (
    <>
      {SPARKS.map(([x, y, s, f]) => <path key={x} className={f ? "faint" : "soft"} transform={`translate(${x} ${y}) scale(${s})`} d={SPARK} />)}
      {DOTS.map(([x, y]) => <circle key={x} className="faint" cx={x} cy={y} r="1.8" />)}

      {/* ringed planet with pencil shading */}
      <g transform="translate(150 130) rotate(-16)">
        <path d="M-72 4 C-72 26 72 26 72 4" className="soft" />
        <circle r="40" fill="#101935" />
        <path d="M-72 4 C-72 -14 -40 -10 -36 -8 M36 -8 C40 -10 72 -14 72 4" />
        <path d="M-40 4 C-38 14 38 14 40 4" />
        <path className="faint" d="M14 -30 L30 -14 M6 -36 L36 -6 M0 -40 L40 0 M-4 32 L4 38" />
        <circle className="soft" cx="-12" cy="-16" r="5" />
      </g>

      {/* astronaut floating, waving, tethered to the planet */}
      <path className="soft" d="M190 175 C240 230 220 300 300 315" strokeDasharray="2 8" />
      <g transform="translate(345 330) rotate(-14)">
        <rect x="-34" y="-36" width="68" height="64" rx="12" fill="#101935" />
        <path d="M-26 -30 Q-31 16 -22 36 L22 36 Q31 16 26 -30 Q0 -40 -26 -30Z" fill="#101935" />
        <circle cx="0" cy="-62" r="31" fill="#101935" />
        <path d="M-21 -66 Q0 -86 21 -66 Q23 -48 0 -46 Q-23 -48 -21 -66Z" />
        <path className="soft" d="M-12 -68 q6 -7 15 -7" />
        <rect x="-12" y="-14" width="24" height="17" rx="3" />
        <path className="soft" d="M-6 -6h4M3 -6h4" />
        <path d="M-25 20 H25" />
        <path d="M-26 -22 Q-52 -30 -60 -58" /><circle cx="-62" cy="-64" r="7" />
        <path d="M26 -20 Q50 -4 52 20" /><circle cx="52" cy="27" r="7" />
        <path d="M-13 36 L-17 70 M13 36 L19 68" />
        <path d="M-29 79 Q-29 69 -18 69 L-8 71 L-8 79Z M9 77 L12 67 L24 67 Q33 67 33 77Z" />
        <path className="soft" d="M-70 -78 l-6 -4 M-74 -66 l-8 0 M-68 -88 l-3 -7" />
      </g>

      {/* plane towing a banner */}
      <g className="hide-sm" transform="translate(1090 120) rotate(-3)">
        <path d="M-180 -2 L-70 2" className="soft" />
        <path d="M-470 -30 Q-400 -40 -330 -30 Q-260 -20 -180 -30 L-180 26 Q-260 16 -330 26 Q-400 36 -470 26 Z" />
        <path className="soft" d="M-470 -30 L-484 -2 L-470 26" />
        <text x="-325" y="9" textAnchor="middle" fontSize="30" className={hand.className} fontWeight="700">page not found</text>
        <g transform="scale(1.7)">
          <path d="M -24 -3 L -36 -20 L -28 -20 L -14 -4" />
          <path d="M -34 0 C -30 -9 18 -11 30 -4 C 38 0 36 5 28 7 C 8 10 -28 8 -34 0 Z" fill="#101935" />
          <path d="M 0 -4 L -12 -24 L -2 -24 L 14 -4" fill="#101935" />
          <path d="M 2 5 L -6 22 L 4 22 L 14 6" />
          <circle cx="18" cy="-1" r="3" />
          <path d="M 38 -11 L 38 13" />
        </g>
        <path className="faint" d="M90 -14 h22 M96 2 h30 M90 16 h18" />
      </g>

      {/* crescent moon with craters */}
      <g transform="translate(1440 150)">
        <path d="M-6 -56 A58 58 0 1 0 50 20 A46 46 0 1 1 -6 -56Z" />
        <circle className="soft" cx="-30" cy="10" r="7" /><circle className="soft" cx="-12" cy="36" r="4" /><circle className="faint" cx="-36" cy="-16" r="3" />
        <path className="faint" d="M-48 -20 l-6 10 M-50 0 l-8 12 M-46 22 l-8 10" />
      </g>

      {/* clouds and birds */}
      <path className="soft" transform="translate(1180 250) scale(1.25)" d={CLOUD} />
      <path className="faint" transform="translate(470 230) scale(.9)" d={CLOUD} />
      <path className="soft" d="M1300 230q11-13 22 0q11-13 22 0M1360 262q8-9 16 0q8-9 16 0M1268 276q7-8 14 0q7-8 14 0" />
    </>
  );
}

// Land layer: tall shapes stay at the edges so the middle stays clear for the text.
function Land() {
  return (
    <>
      {/* far mountains with snow caps and hatching */}
      <path className="soft" d="M0 250 L120 150 L200 205 L330 80 L470 230 L560 300" />
      <path className="soft" d="M300 108 L318 128 L332 112 L346 130 L362 116" />
      <path className="faint" d="M350 110 l-14 24 M372 132 l-16 28 M394 156 l-18 30 M414 180 l-18 32 M150 172 l-12 20 M172 188 l-12 22" />
      <path className="soft" d="M1040 300 L1150 210 L1240 260 L1380 110 L1500 220 L1600 170" />
      <path className="soft" d="M1352 140 L1366 156 L1380 140 L1394 158 L1408 142" />
      <path className="faint" d="M1404 140 l-14 24 M1426 162 l-16 28 M1448 184 l-18 30 M1180 236 l-12 20 M1204 248 l-12 22" />

      {/* rolling hill with pine trees (left) */}
      <path d="M0 290 Q150 220 330 270 T620 330" />
      {[[70, 262], [120, 250], [175, 246], [240, 252]].map(([x, y], i) => (
        <path key={x} d={`M${x} ${y} l-14 ${i % 2 ? 26 : 32} h28 Z M${x} ${y + 12} l-18 ${i % 2 ? 24 : 30} h36 Z M${x} ${y + (i % 2 ? 36 : 42)} v10`} />
      ))}

      {/* city skyline (right) */}
      <path d="M1100 340 V280 H1150 V250 H1196 V300 H1236 V200 H1290 V170 H1306 V200 H1330 V290 H1372 V230 H1430 V320 H1470 V260 H1530 V300 H1600" />
      <path className="soft" d="M1298 150 V170 M1298 150 l8 4 -8 4" />
      <path className="faint" d="M1250 220h10M1270 220h10M1250 240h10M1270 240h10M1250 260h10M1270 260h10M1386 250h10M1408 250h10M1386 272h10M1408 272h10M1484 280h10M1506 280h10M1162 268h8M1180 268h8" />

      {/* ground: double pencil line + grass ticks */}
      <path d="M0 340 Q400 326 800 338 T1600 334" />
      <path className="faint" d="M0 350 Q420 338 820 348 T1600 344" />
      <path className="soft" d="M560 336 l4 -10 l3 10 M780 338 l3 -8 l3 8 M1010 337 l4 -10 l3 10 M660 337 l3 -7 l3 7" />
    </>
  );
}

export default function NotFound() {
  return (
    <section className="nf">
      <style>{css}</style>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="nf-sk"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter>
        <filter id="nf-sk2"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" /><feDisplacementMap in="SourceGraphic" scale="4" /></filter>
      </svg>
      {/* each layer is drawn twice (ink + offset ghost) for a real pencil double-line */}
      <svg className="art sky" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
        <g id="nf-sky" className="ink"><Sky /></g><use href="#nf-sky" className="ghost" />
      </svg>
      <svg className="art land" viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <g id="nf-land" className="ink"><Land /></g><use href="#nf-land" className="ghost" />
      </svg>

      <div className="box">
        <span className="kick">Error 404</span>
        <h1 className={hand.className}>404</h1>
        <svg className="under" viewBox="0 0 300 26" aria-hidden="true" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" style={{ filter: "url(#nf-sk)" }}>
          <path d="M6 14 C80 4 190 4 294 10" /><path className="soft" d="M40 22 C110 14 200 14 262 19" opacity=".5" />
        </svg>
        <h2 className={hand.className}>You drew off the edge of the map.</h2>
        <p>This page doesn&apos;t exist. Don&apos;t waste your time here, the good stuff is one click away.</p>
        <div className="cta">
          <svg className="note" viewBox="0 0 170 70" aria-hidden="true" style={{ filter: "url(#nf-sk)" }}>
            <text x="4" y="26" fontSize="26" className={hand.className} fontWeight="700">this way!</text>
            <path d="M60 36 C80 62 120 66 158 52" /><path d="M146 44 L159 52 L147 61" />
          </svg>
          <Link className={buttonVariants({ variant: "brandStill" })} href="/">Take me home<Ar /></Link>
        </div>
        <div className="reach">
          <MailChip />
          <span className="social"><SocialLinks icons /></span>
        </div>
      </div>
    </section>
  );
}
