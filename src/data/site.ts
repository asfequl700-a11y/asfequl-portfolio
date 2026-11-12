// Everything on the site that is a placeholder or needs Fahim's check lives here.
// Work numbers: Ahrefs estimates of Google visitors, pulled 2026-11-10, best months (dated).

export const site = {
  name: "Asfequl Alam Fahim",
  url: "https://asfequl-portfolio.vercel.app", // TODO Fahim: change to the new domain once it is bought
  email: "asfequl@hellofahim.com",
  linkedin: "https://www.linkedin.com/in/asfequl-alam-fahim-474182399/",
  x: "https://x.com/Asfequl_Alam",
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
  span: string; // dates the chart covers
  chart: number[]; // monthly points, y in a 0-200 box (lower = higher on the chart)
  worth: Stat; // extra Ahrefs stat in the last box (no money: the companies don't allow revenue/value numbers)
};

export const companies: Company[] = [
  {
    name: "Ryne AI",
    logo: "/logo-ryne.png",
    url: "https://ryne.ai",
    host: "ryne.ai",
    role: "Website growth & management · UK team · Oct 2025 – now",
    main: { value: "2.8x", label: "Google visitors in 6 months" },
    stats: [
      { value: "30.9K", label: "monthly visitors, best month (Apr 2026)" },
      { value: "344", label: "keywords ranking on Google (Apr 2026)" },
      { value: "41", label: "keywords in Google top 3" },
    ],
    span: "Oct 2025 → Apr 2026",
    chart: [126.4, 82.8, 44.3, 10.1, 28.9, 68, 8], // Ahrefs monthly Google visitors, scaled (peak = 8)
    worth: { value: "2.8x", label: "more Google visitors in 6 months" },
  },
  {
    name: "Humaniser",
    logo: "/logo-humaniser.png",
    url: "https://humaniser.com",
    host: "humaniser.com",
    role: "Website growth & management · Nov 2025 – now",
    main: { value: "103K", label: "visitors in best month (Mar 2026)" },
    stats: [
      { value: "103K", label: "monthly visitors, best month (Mar 2026)" },
      { value: "3.2x", label: "growth, Oct 2025 → Mar 2026" },
      { value: "101", label: "keywords in Google top 3" },
    ],
    span: "Oct 2025 → Mar 2026",
    chart: [134.1, 43.6, 60.8, 60.6, 53.6, 8], // Ahrefs monthly Google visitors, scaled (peak = 8)
    worth: { value: "386", label: "keywords ranking on Google (Mar 2026)" },
  },
  {
    name: "Reilaa",
    logo: "/logo-reilaa.png",
    darkLogo: true,
    url: "https://reilaa.com",
    host: "reilaa.com",
    role: "Website growth & management · Nov 2025 – now",
    main: { value: "196K", label: "visitors in best month, from launch" },
    stats: [
      { value: "196K", label: "monthly visitors, best month (Jan 2026)" },
      { value: "4 months", label: "from launch to best month" },
      { value: "106K", label: "monthly visitors by month 3" },
    ],
    span: "Sep 2025 → Jan 2026",
    chart: [191.9, 191.3, 171.4, 91.8, 8], // Ahrefs monthly Google visitors, scaled (peak = 8)
    worth: { value: "727", label: "keywords ranking on Google (Jan 2026)" },
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

// Testimonials. DEMO ONLY until real quotes arrive: every entry with demo: true is
// placeholder text and shows a "Demo" badge. TODO Fahim: replace with real, approved quotes,
// then delete the demo flag. Never publish demo entries.
export type Testimonial = { quote: string; name: string; title: string; company: string; logo: string; darkLogo?: boolean; demo?: boolean };

export const testimonials: Testimonial[] = [
  { demo: true, quote: "Placeholder quote. Two or three sentences from the CEO about what Fahim worked on and what changed for the site will go here.", name: "Name Surname", title: "CEO", company: "Ryne AI", logo: "/logo-ryne.png" },
  { demo: true, quote: "Placeholder quote. A short line from the marketing lead about working with Fahim day to day: how he communicates and gets things done.", name: "Name Surname", title: "Marketing Manager", company: "Humaniser", logo: "/logo-humaniser.png" },
  { demo: true, quote: "Placeholder quote. What it was like to hand the website over to Fahim, and what improved after he joined.", name: "Name Surname", title: "Founder", company: "Reilaa", logo: "/logo-reilaa.png", darkLogo: true },
];
