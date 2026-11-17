import type { MetadataRoute } from "next";
import { site } from "../data/site";
import { listPosts } from "@/lib/blog";

export const dynamic = "force-dynamic"; // blog posts come from the database

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = ["", "/ai-automation-services", "/ai-receptionist-for-small-business", "/youtube-automation-for-creators", "/work", "/projects", "/about", "/contact", "/blog"].map((p) => ({
    url: site.url + p,
    changeFrequency: "monthly",
    priority: p ? 0.8 : 1,
  }));
  const posts = await listPosts().catch(() => []); // if the database is down, keep the normal pages
  return [...pages, ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.published_at ?? undefined, priority: 0.7 }))];
}
