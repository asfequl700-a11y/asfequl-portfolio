import { Caveat, Mrs_Saint_Delafield } from "next/font/google";

// Signature + "my signature" note on the polaroid's bottom white strip (Home hero).
const sig = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400" });
const hand = Caveat({ subsets: ["latin"], weight: "600" });

export default function PolaroidSign() {
  return (
    <div className="pol-sign" aria-hidden="true">
      {/* TODO(Fahim): replace this placeholder text with an image of your real signature, e.g. <img src="/signature.png" /> */}
      <span className={`pol-sig ${sig.className}`}>Fahim</span>
      <span className={`pol-note ${hand.className}`}>
        <svg viewBox="0 0 60 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 14 C 54 34, 22 36, 9 13" />
          <path d="M4 22 L 8 11 L 18 15" />
        </svg>
        my signature
      </span>
    </div>
  );
}
