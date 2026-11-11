// Everything on the site that is a placeholder or needs Fahim's check lives here.
// Numbers marked "TODO Fahim" are DEMO values from the design mockups. Replace them with real ones.

export const site = {
  name: "Asfequl Alam Fahim",
  url: "https://asfequl-portfolio.vercel.app", // TODO Fahim: change to the new domain once it is bought
  email: "asfequl@hellofahim.com",
  linkedin: "https://www.linkedin.com/in/asfequl-alamfahim-474182399", // TODO Fahim: confirm this LinkedIn link is still active
  x: "#", // TODO Fahim: X link
};

export type Stat = { value: string; label: string };

export type Company = {
  name: string;
  logo: string;
  darkLogo?: boolean;
  url: string;
  host: string;
  role: string;
  main: Stat; // big number on the Home panel
  stats: Stat[];
  chart: number[]; // 12 monthly points, y in a 0-200 box (lower = higher on the chart)
  did: string; // "What I did", empty shows a TODO marker
};

export const companies: Company[] = [
  {
    name: "Ryne AI",
    logo: "/logo-ryne.png",
    url: "https://ryne.ai",
    host: "ryne.ai",
    role: "Website growth & management · UK team · Oct 2025 – now",
    main: { value: "+180%", label: "monthly visitors" }, // TODO Fahim: real number
    stats: [
      { value: "48K", label: "monthly visitors" }, // TODO Fahim: real number
      { value: "120+", label: "keywords on page 1" }, // TODO Fahim: real number
      { value: "3x", label: "sign-ups" }, // TODO Fahim: real number
    ],
    chart: [161.8, 153.3, 157.5, 136.2, 119.1, 123.4, 93.5, 72.1, 80.6, 50.7, 33.6, 8], // TODO Fahim: real monthly data
    did: "", // TODO Fahim: your tasks, in your words
  },
  {
    name: "Humaniser",
    logo: "/logo-humaniser.png",
    url: "https://humaniser.com",
    host: "humaniser.com",
    role: "Website growth & management · 2025 – now",
    main: { value: "100K+", label: "visits in best month" }, // TODO Fahim: real number
    stats: [
      { value: "100K+", label: "visits in best month" }, // TODO Fahim: real number
      { value: "100+", label: "keywords in top 3" }, // TODO Fahim: real number
      { value: "2.5x", label: "growth in 6 months" }, // TODO Fahim: real number
    ],
    chart: [157.1, 150.6, 131.2, 111.7, 115, 95.5, 79.3, 82.6, 59.9, 43.7, 27.4, 8], // TODO Fahim: real monthly data
    did: "", // TODO Fahim: your tasks, in your words
  },
  {
    name: "Reilaa",
    logo: "/logo-reilaa.png",
    darkLogo: true,
    url: "https://reilaa.com",
    host: "reilaa.com",
    role: "Website growth & management · 2025 – now",
    main: { value: "0 → 50K", label: "monthly visitors, from launch" }, // TODO Fahim: real number
    stats: [
      { value: "50K", label: "monthly visitors" }, // TODO Fahim: real number
      { value: "0 → 50K", label: "from a brand-new site" }, // TODO Fahim: real number
      { value: "60+", label: "keywords ranking" }, // TODO Fahim: real number
    ],
    chart: [192.2, 192.2, 188.5, 181, 169.7, 150.9, 128.3, 98.2, 71.9, 45.6, 23, 8], // TODO Fahim: real monthly data
    did: "", // TODO Fahim: your tasks, in your words
  },
];

// Home "The gap is growing" cards. These come from the linked public sources, not from Fahim.
// TODO Fahim: open each source once and check the number still matches before going live.
export type MarketStat = { n: number; after: string; text: string; bars: { label: string; w: string; shown: string; hot?: boolean }[]; source: string; href: string };

export const marketStats: MarketStat[] = [
  {
    n: 58, after: "%",
    text: "of US small businesses now use AI. In 2023 it was 23%.",
    bars: [
      { label: "2023", w: "23%", shown: "23%" },
      { label: "2024", w: "40%", shown: "40%" },
      { label: "2025", w: "58%", shown: "58%", hot: true },
    ],
    source: "Source: U.S. Chamber of Commerce, 2025 ↗",
    href: "https://www.uschamber.com/technology/empowering-small-business-the-impact-of-technology-on-u-s-small-business",
  },
  {
    n: 3, after: " in 4",
    text: "small and medium businesses are already putting money into AI.",
    bars: [
      { label: "invest", w: "75%", shown: "75%", hot: true },
      { label: "not yet", w: "25%", shown: "25%" },
    ],
    source: "Source: Salesforce SMB Trends, 2025 ↗",
    href: "https://www.salesforce.com/blog/ai-and-the-future-of-business/",
  },
  {
    n: 2, after: "x",
    text: "Growing businesses are nearly twice as likely to invest in AI as struggling ones.",
    bars: [
      { label: "growing", w: "96%", shown: "~2x", hot: true },
      { label: "struggle", w: "50%", shown: "1x" },
    ],
    source: "Source: Salesforce SMB Trends, 2025 ↗",
    href: "https://www.salesforce.com/blog/ai-and-the-future-of-business/",
  },
];

// Builds the chart path the mockups used: 12 points spread across `w`.
export const sparkPoints = (ys: number[], w: number) => ys.map((y, i) => `${+((i * w) / (ys.length - 1)).toFixed(1)} ${y}`);
