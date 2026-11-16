// A paragraph is a list of runs, so bold / italic / links work without Markdown or raw HTML.
export type Run = { text: string; bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean; href?: string };

// One block = one piece of a post. The editor writes these; the page just draws them.
// Old posts stay valid: "level" and "ordered" are optional (heading = H2, list = bullets).
export type Block =
  | { type: "heading"; text: string; level?: 1 | 2 | 3 }
  | { type: "paragraph"; runs: Run[] }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string }
  | { type: "divider" }
  | { type: "image"; src: string; alt: string }
  | { type: "cta"; text: string; button: string; href: string }
  | { type: "youtube"; id: string };

// Only these link starts are allowed (blocks javascript: and friends). Used on save AND when drawing.
export const safeHref = (h: unknown): h is string => typeof h === "string" && h.length <= 2000 && /^(https?:\/\/|\/|mailto:|#)/.test(h);
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Starter topics. New ones are made in the editor ("+ New topic…") and are stored on the post itself.
export const TOPICS = ["Websites", "AI receptionist", "Automation", "Notes"] as const;
// A topic name: 1-40 letters, numbers, spaces and & ' - . (blocks odd characters; "" = no topic)
export const cleanTopic = (t: unknown): string | null => {
  if (typeof t !== "string") return null;
  const v = t.trim().replace(/\s+/g, " ");
  return v === "" || (v.length <= 40 && /^[\p{L}\p{N} &'.-]+$/u.test(v)) ? v : null;
};
// Starter topics first (in this order), then any new ones A-Z
export const sortTopics = (ts: Iterable<string>) => {
  const set = [...new Set([...ts].filter(Boolean))];
  const start = TOPICS.filter((t) => set.includes(t));
  return [...start, ...set.filter((t) => !(TOPICS as readonly string[]).includes(t)).sort((a, b) => a.localeCompare(b))];
};
// "Show at the top of the blog": 0 = no, 1 = big card, 2 = small card 1, 3 = small card 2
export const FEATURED_LABELS = ["No", "Big card", "Small card 1", "Small card 2"] as const;
