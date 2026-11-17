import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFx from "../../../components/SiteFx";
import PostArticle, { fmtDate, readMinutes } from "../../../components/PostArticle";
import { FinalCta } from "../../../components/ui";
import { getPost, listPosts } from "@/lib/blog";
import { site } from "../../../data/site";
import Avatar from "../../../components/Avatar";
import { resolveAuthor, shortName, autoDescription } from "@/lib/blog-shared";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const description = post.description || autoDescription(post.body);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article", url: `/blog/${post.slug}`, title: post.title, description, images: [post.cover ?? "/profile.jpg"],
      publishedTime: post.published_at ? post.published_at.replace(" ", "T") + "Z" : undefined, modifiedTime: post.updated_at.replace(" ", "T") + "Z", authors: [resolveAuthor(post.author_name, post.author_photo).name],
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: [post.cover ?? "/profile.jpg"] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const author = resolveAuthor(post.author_name, post.author_photo);
  const abs = (u: string) => (u.startsWith("/") ? site.url + u : u);
  const url = `${site.url}/blog/${post.slug}`;
  // Google's article + breadcrumb data, built from the post every time (nothing to fill in)
  const ld = [
    {
      "@context": "https://schema.org", "@type": "BlogPosting",
      headline: post.title, description: post.description || autoDescription(post.body), image: abs(post.cover ?? "/profile.jpg"),
      datePublished: post.published_at ? post.published_at.replace(" ", "T") + "Z" : undefined,
      dateModified: post.updated_at ? post.updated_at.replace(" ", "T") + "Z" : undefined,
      author: { "@type": "Person", name: author.name, url: site.url + "/about" },
      publisher: { "@type": "Person", name: site.name, url: site.url },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: site.url + "/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  const more = (await listPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <div className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <SiteFx />
      <div className="post-page">
        <PostArticle title={post.title} description={post.description} blocks={post.body}
          publishedAt={post.published_at} url={`${site.url}/blog/${post.slug}`} author={resolveAuthor(post.author_name, post.author_photo)} />
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
                    {(() => { const a = resolveAuthor(p.author_name, p.author_photo); return <><Avatar name={a.name} photo={a.photo} size={20} decorative />{shortName(a)} · </>; })()}{fmtDate(p.published_at, true)}
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
