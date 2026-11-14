// Everything on the site that is a placeholder or needs Fahim's check lives here.
// Work numbers: Google Search Console totals, copied exactly from the proof screenshots in public/proof/.

export const site = {
  name: "Asfequl Alam Fahim",
  url: "https://hellofahim.com",
  email: "asfequl@hellofahim.com",
  linkedin: "https://www.linkedin.com/in/asfequl-alam-fahim-474182399/",
  x: "https://x.com/Asfequl_Alam",
};

export type Stat = { value: string; label: string };

export type Company = {
  // Real screenshot (Ahrefs or Google Search Console) shown as proof. Put the file in public/proof/,
  // e.g. proof: { src: "/proof/ryne.png", alt: "Ahrefs organic traffic graph for ryne.ai, Oct 2025 to Apr 2026" }
  proof?: { src: string; alt: string };
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
  worth: Stat; // extra stat in the last box (no money: the companies don't allow revenue/value numbers)
};

export const companies: Company[] = [
  {
    name: "Ryne AI", proof: { src: "/proof/ryne-proof.png", alt: "Google Search Console for ryne.ai: 518K total clicks, 7.21M impressions, 7.2% average click rate" },
    logo: "/logo-ryne.png",
    url: "https://ryne.ai",
    host: "ryne.ai",
    role: "Website growth & management · UK team · Oct 2025 – now",
    main: { value: "518K", label: "clicks from Google search" },
    stats: [
      { value: "518K", label: "clicks from Google search" },
      { value: "7.2M", label: "times shown in Google search" },
      { value: "7.2%", label: "of searchers clicked through" },
    ],
    span: "Oct 2025 → Apr 2026",
    chart: [123.2, 113.9, 111.3, 95.4, 80.8, 75.5, 83.5, 71.5, 66.2, 62.3, 98, 139.1, 115.2, 102, 115.2, 107.3, 108.6, 87.4, 70.2, 25.2, 31.8, 21.2, 35.8, 8], // traced from the Search Console clicks line (peak = 8)
    worth: { value: "7.2M", label: "times shown in Google search" },
  },
  {
    name: "Humaniser", proof: { src: "/proof/humaniser-proof.png", alt: "Google Search Console for humaniser.com, Oct 2025 to Mar 2026: 215K total clicks, 2.13M impressions, 10.1% average click rate" },
    logo: "/logo-humaniser.png",
    url: "https://humaniser.com",
    host: "humaniser.com",
    role: "Website growth & management · Nov 2025 – now",
    main: { value: "215K", label: "clicks from Google search in 6 months" },
    stats: [
      { value: "215K", label: "clicks from Google search" },
      { value: "2.1M", label: "times shown in Google search" },
      { value: "10.1%", label: "of searchers clicked through" },
    ],
    span: "Oct 2025 → Mar 2026",
    chart: [192, 192, 173.6, 148.7, 128.1, 116.2, 100, 110.8, 108.7, 107.6, 146.5, 166, 134.6, 106.5, 110.8, 103.2, 96.8, 85.9, 65.4, 44.8, 28.6, 16.7, 14.5, 8], // traced from the Search Console clicks line (peak = 8)
    worth: { value: "3K", label: "clicks a day by Mar 2026, from 0 in Oct 2025" },
  },
  {
    name: "Reilaa", proof: { src: "/proof/reilaa-proof.png", alt: "Google Search Console for reilaa.com, Aug 2025 to Jan 2026: 142K total clicks, 6.46M impressions, average position 9.5" },
    logo: "/logo-reilaa.png",
    darkLogo: true,
    url: "https://reilaa.com",
    host: "reilaa.com",
    role: "Website growth & management · Nov 2025 – now",
    main: { value: "6.5M", label: "times shown in Google search" },
    stats: [
      { value: "142K", label: "clicks from Google search" },
      { value: "6.5M", label: "times shown in Google search" },
      { value: "9.5", label: "average Google position (page 1)" },
    ],
    span: "Aug 2025 → Jan 2026",
    chart: [185.6, 185.6, 182.8, 183.8, 181.9, 179.2, 176.4, 174.6, 176.4, 175.5, 165.5, 164.5, 162.7, 159, 152.6, 126.1, 8, 71.2, 146.2, 135.2, 73.9, 74.8, 116.9, 103.2], // traced from the Search Console clicks line (peak = 8)
    worth: { value: "9.5", label: "average position on Google (page 1)" },
  },
];

// Home "The gap is growing" cards. Checked against the linked sources on 2026-11-15.
export type MarketStat = { n: number; after: string; text: string; bars: { label: string; w: string; shown: string; hot?: boolean }[]; source: string; href: string };

export const marketStats: MarketStat[] = [
  {
    n: 58, after: "%",
    text: "of US small businesses now use generative AI. In 2023 it was 23%.",
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
    text: "Growing small businesses are nearly twice as likely to invest in AI as struggling ones.",
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

// Empty on purpose: the section stays hidden until real, approved quotes are added.
export const testimonials: Testimonial[] = [];
