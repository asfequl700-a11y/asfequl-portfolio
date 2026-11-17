import type { Metadata } from "next";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";
import BlogIndex, { type Card } from "../../components/BlogIndex";
import { readMinutes } from "../../components/PostArticle";
import { listPosts, type Post } from "@/lib/blog";
import { sortTopics, resolveAuthor } from "@/lib/blog-shared";

export const dynamic = "force-dynamic"; // posts come from the database, show new ones right away

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on websites, AI automation and getting more customers for small businesses.",
  alternates: { canonical: "/blog" },
};

const toCard = (p: Post): Card => ({
  slug: p.slug, title: p.title, description: p.description, cover: p.cover, topic: p.topic,
  date: p.published_at ?? "", mins: readMinutes(p.body), author: resolveAuthor(p.author_name, p.author_photo),
});

// Top 3: a pinned post takes its spot (1 big, 2 and 3 small); empty spots get the newest posts that are not pinned.
// Everything else goes below, newest first. Each post shows once.
function layout(posts: Post[]) {
  const top: Post[] = [];
  const unpinned = posts.filter((p) => !p.featured);
  for (const spot of [1, 2, 3]) {
    const p = posts.find((x) => x.featured === spot) ?? unpinned.find((x) => !top.includes(x));
    if (p && !top.includes(p)) top.push(p);
  }
  return { top, rest: posts.filter((p) => !top.includes(p)) };
}

export default async function BlogPage() {
  const posts = await listPosts(); // newest first
  const { top, rest } = layout(posts);
  const used = sortTopics(posts.map((p) => p.topic));
  return (
    <div className="page">
      <SiteFx />
      <div className="bl">
        <div className="bl-wrap">
          <section className="bl-top">
            <h1>Notes from<br /><em>the work.</em></h1>
            <div className="bl-top-r">
              <p>What I learn building websites, AI receptionists and automations for local businesses. Short and practical.</p>
              {posts.length > 0 && (
                <div className="bl-stats">
                  <div><b>{posts.length}</b><span className="bl-mono">{posts.length === 1 ? "Post" : "Posts"}</span></div>
                  {used.length > 0 && <div><b>{used.length}</b><span className="bl-mono">{used.length === 1 ? "Topic" : "Topics"}</span></div>}
                </div>
              )}
            </div>
          </section>
          {posts.length === 0
            ? <p className="bl-empty">First posts are coming soon.</p>
            : <BlogIndex top={top.map(toCard)} rest={rest.map(toCard)} topics={used} />}
        </div>
      </div>
      <FinalCta title={<>Want this for<br />your business?</>} />
    </div>
  );
}
