import type { Metadata } from "next";
import Link from "next/link";
import SiteFx from "../../components/SiteFx";
import { FinalCta } from "../../components/ui";
import { listPosts } from "@/lib/blog";

export const dynamic = "force-dynamic"; // posts come from the database, show new ones right away

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on websites, AI automation and getting more customers for small businesses.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await listPosts();
  return (
    <div className="page">
      <SiteFx />
      <section className="light">
        <div className="wrap">
          <div className="phero">
            <span className="kick">Blog</span>
            <h1 style={{ fontSize: "96px" }}>Notes from<br />the work.</h1>
          </div>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: "20px" }}>
        <div className="wrap" style={{ display: "grid", gap: "0" }}>
          {posts.length === 0 && <p style={{ fontSize: "20px" }}>First posts are coming soon.</p>}
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-row">
              <span className="mono" style={{ fontSize: "14px", color: "#FF6B1A" }}>
                {p.published_at ? new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
              </span>
              <span>
                <h3 style={{ marginBottom: "6px" }}>{p.title}</h3>
                <span style={{ fontSize: "17px", color: "#5A6380" }}>{p.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <FinalCta title={<>Want this for<br />your business?</>} />
    </div>
  );
}
