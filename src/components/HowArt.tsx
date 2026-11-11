// Minimal line drawings for the "How we'd work" steps (left side of each slide).
const p = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Call() {
  return (
    <svg viewBox="0 0 240 200" {...p}>
      <rect x="70" y="20" width="84" height="160" rx="16" />
      <path d="M100 36h24" />
      <circle cx="112" cy="162" r="6" />
      <path className="ha-ring" d="M172 70a40 40 0 0 1 0 60M186 56a60 60 0 0 1 0 88" opacity=".9" />
      <path className="ha-ring" d="M52 70a40 40 0 0 0 0 60M38 56a60 60 0 0 0 0 88" opacity=".9" />
      <path d="M92 90l12 12 26-26" stroke="#EEF1F8" />
    </svg>
  );
}

function Plan() {
  return (
    <svg viewBox="0 0 240 200" {...p}>
      <path d="M60 20h88l32 32v128H60z" />
      <path d="M148 20v32h32" />
      <path d="M82 80h12M82 110h12M82 140h12" stroke="#EEF1F8" />
      <path d="M106 80h52M106 110h44M106 140h50" opacity=".6" />
      <g className="ha-pen">
        <path d="M196 60l20 20-58 58-26 6 6-26z" />
        <path d="M186 70l20 20" />
      </g>
    </svg>
  );
}

function Build() {
  return (
    <svg viewBox="0 0 240 200" {...p}>
      <rect x="20" y="30" width="200" height="140" rx="12" />
      <path d="M20 60h200" />
      <circle cx="40" cy="45" r="4" /><circle cx="56" cy="45" r="4" /><circle cx="72" cy="45" r="4" />
      <rect className="ha-b1" x="40" y="78" width="72" height="44" rx="6" stroke="#EEF1F8" />
      <path className="ha-b2" d="M128 82h72M128 98h56M128 114h64" opacity=".6" />
      <rect className="ha-b3" x="40" y="136" width="160" height="18" rx="6" />
    </svg>
  );
}

function Launch() {
  return (
    <svg viewBox="0 0 240 200" {...p}>
      <path d="M30 186h180" opacity=".4" />
      <g className="ha-rocket">
        <path d="M120 14c26 20 34 56 26 96H94c-8-40 0-76 26-96z" />
        <circle cx="120" cy="62" r="11" stroke="#EEF1F8" />
        <path d="M94 110l-20 22 26-6M146 110l20 22-26-6" />
        <path className="ha-flame" d="M108 128c0 20 12 34 12 34s12-14 12-34" stroke="#EEF1F8" />
      </g>
      <path className="ha-star" d="M44 40v12M38 46h12M196 70v12M190 76h12" opacity=".7" />
    </svg>
  );
}

const arts = [Call, Plan, Build, Launch];

export default function HowArt({ i }: { i: number }) {
  const A = arts[i] ?? Call;
  return <div className="hwart"><A /></div>;
}
