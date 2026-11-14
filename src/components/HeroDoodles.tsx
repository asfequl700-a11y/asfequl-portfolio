import { Caveat } from "next/font/google";

// Hand-drawn (sketch) white doodles for the Home hero only: banner plane, sky bits, sailing boat.
const hand = Caveat({ subsets: ["latin"], weight: "700" });
const MSG = "Hi there, thanks for stopping by!";

// Plane flies along `d` (straight, a loop, a wave), the banner ribbon + text follow the same path.
// L = path length in viewBox units (measured with getTotalLength), G = rope gap, B = banner length.
const FLIGHTS = {
  dk: { box: "0 0 1600 300", d: "M -420 170 L 420 170 A 70 70 0 0 0 420 30 A 70 70 0 0 0 420 170 L 800 170 C 900 170 940 90 1040 90 C 1140 90 1160 160 1260 160 L 2050 160", L: 2930, B: 380, font: 28, w: 40, scale: 1 },
  mb: { box: "0 0 400 170", d: "M -420 110 L 140 110 A 45 45 0 0 0 140 20 A 45 45 0 0 0 140 110 L 220 110 C 270 110 290 70 340 70 L 900 70", L: 1585, B: 300, font: 22, w: 32, scale: 0.8 },
};
const G = 34;
const TIMING = { dur: "24s", begin: "0s", repeatCount: "indefinite", keyTimes: "0;0.75;1", calcMode: "linear" } as const;

function Flight({ v }: { v: keyof typeof FLIGHTS }) {
  const f = FLIGHTS[v];
  const id = `hd-path-${v}`;
  const dash = (o: number) => `${G + f.B - o}`;
  const dashes = `${dash(0)};${dash(f.L)};${dash(f.L)}`;
  const text = `${14 - G - f.B};${f.L + 14 - G - f.B};${f.L + 14 - G - f.B}`;
  return (
    <svg className={`hd-flight hd-${v}`} viewBox={f.box} aria-hidden="true">
      <path id={id} d={f.d} fill="none" />
      {/* ribbon: white outline + dark fill, as one dash travelling along the path */}
      {[["#fff", f.w], ["#101935", f.w - 4]].map(([c, w]) => (
        <use key={c} href={`#${id}`} stroke={c as string} strokeWidth={w} strokeDasharray={`${f.B} 99999`} strokeDashoffset={dash(0)}>
          <animate attributeName="stroke-dashoffset" values={dashes} {...TIMING} />
        </use>
      ))}
      <text className={hand.className} fill="#fff" fontSize={f.font} dominantBaseline="central">
        <textPath href={`#${id}`} startOffset={14 - G - f.B}>
          {MSG}
          <animate attributeName="startOffset" values={text} {...TIMING} />
        </textPath>
      </text>
      <g className="hd-ink">
        <g transform={`scale(${f.scale})`}>
          <path d="M -34 1 L -60 2" />
          <path d="M -24 -3 L -36 -20 L -28 -20 L -14 -4" />
          <path d="M -34 0 C -30 -9 18 -11 30 -4 C 38 0 36 5 28 7 C 8 10 -28 8 -34 0 Z" fill="#101935" />
          <path d="M 0 -4 L -12 -24 L -2 -24 L 14 -4" fill="#101935" />
          <path d="M 2 5 L -6 22 L 4 22 L 14 6" />
          <circle cx="18" cy="-1" r="3" />
          <path className="hd-prop" d="M 38 -11 L 38 13" />
        </g>
        <animateMotion path={f.d} rotate="auto" keyPoints="0;1;1" {...TIMING} />
      </g>
    </svg>
  );
}

const SPARK = "M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z";
const CLOUD = "M10 40 C0 40 0 24 12 24 C12 10 32 6 38 18 C44 6 64 10 62 26 C74 26 74 40 62 40 Z";
// [left, top, size, path, viewBox, extra class]
const BITS: [string, string, number, string, string, string][] = [
  ["4%", "16%", 26, SPARK, "-2 -2 28 28", "tw"],
  ["30%", "8%", 18, SPARK, "-2 -2 28 28", "tw d2"],
  ["66%", "6%", 22, SPARK, "-2 -2 28 28", "tw d3"],
  ["93%", "44%", 20, SPARK, "-2 -2 28 28", "tw d2"],
  ["47%", "88%", 16, SPARK, "-2 -2 28 28", "tw d3 dk"],
  ["2%", "62%", 14, SPARK, "-2 -2 28 28", "tw"],
  ["88%", "8%", 54, "M38 7 A24 24 0 1 0 53 40 A19 19 0 1 1 38 7Z", "0 0 60 60", ""],
  ["34%", "13%", 86, CLOUD, "-2 4 78 40", "dr dk"],
  ["74%", "22%", 70, CLOUD, "-2 4 78 40", "dr d2"],
  ["3%", "80%", 40, "M30 30 c0 -4 6 -4 6 0 c0 8 -12 8 -12 0 c0 -12 18 -12 18 0 c0 16 -24 16 -24 0", "2 2 56 56", "dk"],
  ["56%", "4%", 60, "M2 10 L14 2 L26 10 L38 2 L50 10 L62 2", "0 0 64 12", "dk"],
];

export default function HeroDoodles() {
  return (
    <div className="hd" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="hd-sk"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter>
      </svg>
      {BITS.map(([left, top, size, d, box, cls]) => (
        <svg key={left + top} className={`hd-bit ${cls}`} style={{ left, top, width: size }} viewBox={box}><path d={d} /></svg>
      ))}
      <Flight v="dk" />
      <Flight v="mb" />
      <div className="hd-sea">
        <div className="hd-boat"><svg viewBox="-4 -14 78 62" className="hd-ink">
          <path d="M 36 30 L 36 -10 M 36 -10 L 47 -6 L 36 -3" />
          <path d="M 39 -6 L 39 26 L 64 26 Z" />
          <path d="M 33 -1 L 33 26 L 13 26 Z" />
          <path d="M 0 30 L 70 30 L 60 44 L 10 44 Z" fill="#101935" />
        </svg></div>
        <div className="hd-wave" />
        <div className="hd-wave w2" />
      </div>
    </div>
  );
}
