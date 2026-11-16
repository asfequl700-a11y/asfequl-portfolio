import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFx from "../../../components/SiteFx";
import PostArticle, { fmtDate, readMinutes } from "../../../components/PostArticle";
import { FinalCta } from "../../../components/ui";
import { getPost, listPosts } from "@/lib/blog";
import { site } from "../../../data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, images: [post.cover ?? "/profile.jpg"] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const more = (await listPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <div className="page">
      <SiteFx />
      <div className="post-page">
        <PostArticle title={post.title} description={post.description} blocks={post.body}
          publishedAt={post.published_at} url={`${site.url}/blog/${post.slug}`} />
        {more.length > 0 && (
          <section className="post-more" aria-labelledby="more-h">
            <div className="post-more-head">
              <h2 id="more-h">More from the blog</h2>
              <Link href="/blog" className="post-more-all">See all posts →</Link>
            </div>
            <div className="post-cards">
              {more.map((p) => (
                <Link key={p.slug} className="post-card" href={`/blog/${p.slug}`}>
                  <div className="thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.cover ? <img src={p.cover} alt="" loading="lazy" /> : <span>{p.title}</span>}
                  </div>
                  <h3>{p.title}</h3>
                  <div className="cmeta">
                    {fmtDate(p.published_at, true)}
                    <span className="read">{readMinutes(p.body)} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <FinalCta title={<>Want this for<br />your business?</>} />
    </div>
  );
}
