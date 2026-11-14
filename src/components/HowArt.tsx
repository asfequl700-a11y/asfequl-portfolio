import { useId, type CSSProperties } from "react";

// Hand-drawn white sketches for the "How we'd work" steps, matching the hero doodles:
// wobbly white lines that draw themselves like a pen, hold, fade, and redraw.
const p = { fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
// One pen stroke: pathLength=1 lets CSS draw it from 0 to 100%; d = order it is drawn in.
const sk = (d: number, extra = "") => ({ className: ("ha-sk " + extra).trim(), pathLength: 1, style: { "--d": d } as CSSProperties });

function Call() {
  return (
    <>
      <path {...sk(0)} d="M84 22c22-3 46-2 60 1 6 2 9 6 9 14l1 124c0 9-4 14-12 15-20 2-42 2-58 0-7-1-11-6-11-14V37c0-9 3-14 11-15z" />
      <path {...sk(1)} d="M101 37c7 1 15 0 22-1" />
      <path {...sk(1)} d="M107 161c2-5 9-5 11 0 1 5-4 8-8 6" />
      <path {...sk(2)} d="M92 91c4 4 8 8 12 11 9-11 17-20 27-27" />
      <path {...sk(3, "ha-ring")} d="M172 72c10 14 10 42 1 56M187 57c18 24 18 64 0 88" />
      <path {...sk(3, "ha-ring")} d="M52 72c-10 14-10 42-1 56M37 57c-18 24-18 64 0 88" />
    </>
  );
}

function Plan() {
  return (
    <>
      <path {...sk(0)} d="M61 21c28-1 58 0 86-1l33 33c1 42 0 84 1 127-40 1-80 0-120 1-1-53 1-107 0-160z" />
      <path {...sk(1)} d="M147 21c0 11-1 21 1 32 10 1 21 0 32 0" />
      <path {...sk(2)} d="M82 80c4 0 8 1 12 0M82 110c4 1 8 0 12 0M82 140c4 0 8 0 12 1" />
      <path {...sk(3)} d="M106 80c18 1 35-1 52 0M106 110c15 0 29 1 44 0M106 140c17-1 33 1 50 0" opacity=".7" />
      <g className="ha-pen">
        <path {...sk(4)} d="M196 60c7 6 13 13 20 20-19 20-39 39-58 58l-26 6 6-26c19-19 39-39 58-58z" />
        <path {...sk(5)} d="M186 70c7 6 14 13 20 20" />
      </g>
    </>
  );
}

function Build() {
  return (
    <>
      <path {...sk(0)} d="M32 31c58-2 118 0 176-1 8 1 12 5 12 12 1 38 0 78 1 116 0 8-5 12-12 12-60 1-118 0-178 1-7 0-11-5-11-12-1-39 1-78 0-116 0-8 4-12 12-12z" />
      <path {...sk(1)} d="M21 60c66 1 133-1 199 0" />
      <path {...sk(1, "ha-blink")} d="M36 45c1-4 7-4 8 0s-6 5-8 0M52 45c1-4 7-4 8 0s-6 5-8 0M68 45c1-4 7-4 8 0s-6 5-8 0" />
      <path {...sk(2)} d="M46 78c20 1 40-1 60 0 5 0 6 3 6 6 0 11 1 22 0 32 0 4-2 6-6 6-20 0-40 1-60 0-4 0-6-2-6-6 0-10-1-21 0-32 0-4 2-6 6-6z" />
      <path {...sk(3)} d="M128 82c24 1 48-1 72 0M128 98c19 0 37 1 56 0M128 114c21-1 43 1 64 0" opacity=".7" />
      <path {...sk(4)} d="M46 136c50 1 99-1 148 0 5 0 6 3 6 6 0 3 1 7 0 6 0 4-2 6-6 6-50 0-99 1-148 0-4 0-6-2-6-6v-6c0-4 2-6 6-6z" />
    </>
  );
}

function Launch() {
  return (
    <>
      <path {...sk(0)} d="M30 186c40-2 80 1 120-1 20 0 40 1 60 0" opacity=".5" />
      <g className="ha-rocket">
        <path {...sk(1)} d="M120 14c27 20 35 57 26 96-17 1-35-1-52 0-9-40-1-76 26-96z" />
        <path {...sk(2)} d="M120 51c7 0 11 5 11 11-1 7-5 11-12 11-6-1-10-5-10-11 0-7 5-11 11-11z" />
        <path {...sk(3)} d="M94 110c-7 8-14 15-20 22l26-6M146 110c7 8 14 15 20 22l-26-6" />
        <path {...sk(4, "ha-flame")} d="M108 128c0 20 12 34 12 34s12-14 12-34" />
      </g>
      <path {...sk(5, "ha-star")} d="M44 40c0 4 1 8 0 12M38 46c4 0 8 1 12 0M196 70c1 4 0 8 0 12M190 76c4 0 8-1 12 0" />
    </>
  );
}

const arts = [Call, Plan, Build, Launch];

export default function HowArt({ i }: { i: number }) {
  const A = arts[i] ?? Call;
  const id = "ha-sk" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <div className="hwart">
      <svg viewBox="0 0 240 200" {...p} aria-hidden="true">
        {/* same wobble as the hero doodles (#hd-sk) so the lines look hand-drawn */}
        <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter>
        <g filter={`url(#${id})`}><A /></g>
      </svg>
    </div>
  );
}
