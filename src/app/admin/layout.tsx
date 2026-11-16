import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin bg-[#F7F4EE] text-[#0E1530]">
      <div className="mx-auto min-h-screen max-w-4xl px-5 pb-24 pt-32">{children}</div>
    </div>
  );
}
