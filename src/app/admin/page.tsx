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
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Blog posts</h1>
        <Link href="/admin/new" className="rounded-full bg-[#FF6B1A] px-5 py-2.5 font-semibold text-white">+ New post</Link>
      </div>
      {err && <p className="text-red-600">{err}</p>}
      {posts && posts.length === 0 && <p>No posts yet. Click “New post”.</p>}
      <ul className="divide-y divide-[#DAD5CB] border-y border-[#DAD5CB]">
        {posts?.map((p) => (
          <li key={p.slug} className="flex items-center gap-4 py-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
            <Link href={`/admin/edit/${p.slug}`} className="flex-1 font-semibold hover:underline">{p.title}</Link>
            {p.status === "published" && <a href={`/blog/${p.slug}`} target="_blank" className="text-sm underline">View</a>}
            <button onClick={() => del(p.slug)} className="text-sm text-red-600 underline">Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
