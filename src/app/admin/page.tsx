"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { slug: string; title: string; status: "draft" | "published"; updated_at: string };

export default function AdminHome() {
  const [posts, setPosts] = useState<Item[] | null>(null);
  const [err, setErr] = useState("");

  const load = () =>
    fetch("/api/admin/posts")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setPosts)
      .catch(() => setErr("Could not load posts. Are you logged in?"));

  useEffect(() => { load(); }, []);

  async function del(slug: string) {
    if (!confirm(`Delete "${slug}" for good?`)) return;
    await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-28 pt-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog posts</h1>
        <Link href="/admin/new" className="rounded-full bg-[#FF6B1A] px-5 py-2.5 font-semibold text-white hover:brightness-110">+ New post</Link>
      </div>
      {err && <p className="text-red-400">{err}</p>}
      {posts && posts.length === 0 && <p className="text-white/70">No posts yet. Click “New post”.</p>}
      <ul className="flex flex-col gap-3">
        {posts?.map((p) => (
          <li key={p.slug} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#16204A] px-5 py-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === "published" ? "bg-green-500/20 text-green-300" : "bg-amber-500/20 text-amber-300"}`}>{p.status}</span>
            <Link href={`/admin/edit/${p.slug}`} className="flex-1 font-semibold hover:text-[#FF8A4C]">{p.title}</Link>
            {p.status === "published" && <a href={`/blog/${p.slug}`} target="_blank" className="text-sm text-white/70 underline hover:text-white">View</a>}
            <button onClick={() => del(p.slug)} className="text-sm text-red-400 underline hover:text-red-300">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
