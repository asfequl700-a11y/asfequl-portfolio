import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono, Geist } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import PageTransition from "../components/PageTransition";
import Analytics from "../components/Analytics";
import { SiteFooter } from "../components/ui";
import { site } from "../data/site";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const display = Bricolage_Grotesque({ variable: "--f-display", subsets: ["latin"], axes: ["opsz"] });
const body = Inter({ variable: "--f-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--f-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Fahim · AI automation and websites for small business", template: "%s · Fahim" },
  description: "I build AI automation, AI receptionists and websites for small businesses and YouTube creators. n8n workflows that answer calls, follow up leads and save you hours.",
  openGraph: { siteName: "Fahim", type: "website", images: ["/profile.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(display.variable, body.variable, mono.variable, "font-sans", geist.variable)}>
      <body className="v">
        {/* reload always starts at the top (browser scroll restoring fights the pinned sections); .fx gates the hero entrance */}
        <Script id="boot" strategy="beforeInteractive">{"history.scrollRestoration='manual';scrollTo(0,0);var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('fx');setTimeout(function(){d.classList.add('hero-go')},3500)}"}</Script>
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
        <Analytics />
      </body>
    </html>
  );
}
