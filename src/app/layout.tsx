import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono, Geist } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import PageTransition from "../components/PageTransition";
import { SiteFooter } from "../components/ui";
import { site } from "../data/site";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const display = Bricolage_Grotesque({ variable: "--f-display", subsets: ["latin"], axes: ["opsz"] });
const body = Inter({ variable: "--f-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--f-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Fahim · Websites and AI automation for local businesses", template: "%s · Fahim" },
  description: "I build websites that make the phone ring and AI helpers that answer calls, follow up leads and automate busy work with n8n.",
  openGraph: { siteName: "Fahim", type: "website", images: ["/profile.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(display.variable, body.variable, mono.variable, "font-sans", geist.variable)}>
      <body className="v">
        <a className="skip" href="#main">Skip to content</a>
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <SiteHeader />
            <main id="main"><PageTransition>{children}</PageTransition></main>
            <SiteFooter />
          </div>
        </div>
        {/* outside #smooth-wrapper: fixed elements inside the smooth-scroll transform would not stay put */}
        <Toaster theme="light" position="bottom-center" />
      </body>
    </html>
  );
}
