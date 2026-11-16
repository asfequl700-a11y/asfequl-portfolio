import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFx from "../../../components/SiteFx";
import BlogBlocks from "../../../components/BlogBlocks";
import { FinalCta } from "../../../components/ui";
import { getPost } from "@/lib/blog";

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
  return (
    <div className="page">
      <SiteFx />
      <article>
        <section className="light">
          <div className="wrap">
            <div className="phero">
              <span className="kick">
                {post.published_at ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Blog"}
              </span>
              <h1 style={{ fontSize: "72px", maxWidth: "16em" }}>{post.title}</h1>
              {post.description && <p className="lead">{post.description}</p>}
            </div>
          </div>
        </section>
        <section className="sec" style={{ paddingTop: "20px" }}>
          <div className="wrap">
            <BlogBlocks blocks={post.body} />
          </div>
        </section>
      </article>
      <FinalCta title={<>Want this for<br />your business?</>} />
    </div>
  );
}
