import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog admin", robots: { index: false, follow: false } };

// The admin has its own slim top bar, so the public site header and footer are hidden while it is open.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <style>{".v header,.v footer{display:none}#smooth-content{padding-top:0!important}.admin a:not(.underline){text-decoration:none}@layer base{.admin button{background:transparent;border:0;padding:0;font:inherit;color:inherit;cursor:pointer}}"}</style>
      <div className="admin min-h-screen bg-[#0E1530] text-white">
        <nav className="sticky top-0 z-40 h-[60px] border-b border-white/10 bg-[#0B1129]">
          <div className="flex h-full items-center justify-between px-5 sm:px-7">
            <Link href="/admin" className="text-lg font-bold">fahim<span className="text-[#FF6B1A]">.</span> <span className="font-medium text-white/60">blog admin</span></Link>
            <div className="flex gap-5 text-sm text-white/70">
              <Link href="/blog" target="_blank" className="hover:text-white">View blog</Link>
              <Link href="/" target="_blank" className="hover:text-white">View site</Link>
              <a href="/cdn-cgi/access/logout" className="hover:text-white">Log out</a>
            </div>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
}
