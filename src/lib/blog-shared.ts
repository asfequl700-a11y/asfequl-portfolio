// A paragraph is a list of runs, so bold / italic / links work without Markdown or raw HTML.
export type Run = { text: string; bold?: boolean; italic?: boolean; href?: string };

// One block = one piece of a post. The editor writes these; the page just draws them.
export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; runs: Run[] }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "cta"; text: string; button: string; href: string }
  | { type: "youtube"; id: string };

// Only these link starts are allowed (blocks javascript: and friends). Used on save AND when drawing.
export const safeHref = (h: unknown): h is string => typeof h === "string" && h.length <= 2000 && /^(https?:\/\/|\/|mailto:|#)/.test(h);
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
