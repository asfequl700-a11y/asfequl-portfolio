"use client";

import { Fragment, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ar } from "./ui";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { site } from "../data/site";

const links = [
  ["/", "Home"],
  ["/ai-automation-services", "Services"],
  ["/work", "Work"],
  ["/projects", "Projects"],
  ["/about", "About"],
  ["/blog", "Blog"],
] as const;

// Shown under Services (hover/focus on desktop, indented in the mobile menu)
const sub = [
  ["/ai-automation-services", "AI automation services"],
  ["/ai-receptionist-for-small-business", "AI receptionist"],
  ["/youtube-automation-for-creators", "YouTube automation"],
] as const;
const inServices = (path: string) => sub.some(([h]) => h === path);

// "Blog" stays highlighted on a post page (/blog/...) too
const isOn = (path: string, href: string) => path === href || (href === "/blog" && path.startsWith("/blog/"));

// Pages whose top section is light in the mockups; the rest start dark.
const lightPages = ["/ai-automation-services", "/about"];

export default function SiteHeader() {
  const path = usePathname();
  const onContact = path === "/contact";
  const [open, setOpen] = useState(false);
  // Services dropdown: state, not CSS :hover, so it closes after a click even if the mouse stays put
  const [dd, setDd] = useState(false);  const close = () => setOpen(false);
  // Fixed header: full width at the very top, then it gathers into one compact box on the first scroll
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      // every screen size: gather into the compact box on the very first scroll
      setCompact(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);
  return (
    <div className={cn("vhead", lightPages.includes(path) ? "light" : "night", path.startsWith("/blog") && "whitetop", compact && "compact")}>
      <header className="wrap vtop">
        <Link className="vlogo" href="/" onClick={close}>
          fahim<b>.</b>
        </Link>
        <nav className="vnav" aria-label="Main">
          {links.map(([href, label]) => {
            const on = href === "/ai-automation-services" ? inServices(path) : isOn(path, href);
            const link = (
              <Link
                key={href}
                href={href}
                className={cn(buttonVariants({ variant: "pill" }), on && "on")}
                aria-current={isOn(path, href) ? "page" : undefined}
              >
                {label}
                {href === "/ai-automation-services" && <ChevronDown className="vchev" aria-hidden="true" />}
              </Link>
            );
            if (href !== "/ai-automation-services") return link;
            return (
              <div
                key={href}
                className={cn("vdrop", dd && "open")}
                onMouseEnter={() => setDd(true)}
                onMouseLeave={() => setDd(false)}
                onFocus={() => setDd(true)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDd(false); }}
              >
                {link}
                <div className="vmenu">
                  {sub.map(([h, l]) => (
                    <Link key={h} href={h} className={path === h ? "on" : undefined} onClick={() => setDd(false)}>{l}</Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        {onContact ? (
          // Already on the form: offer the direct email instead of a link back to this page
          <a
            className={buttonVariants({ variant: "brandStill" })}
            href={`mailto:${site.email}`}
            style={{ minHeight: "44px" }}
          >
            Email me
            <Ar />
          </a>
        ) : (
          <Link
            className={buttonVariants({ variant: "brandStill" })}
            href="/contact"
            style={{ minHeight: "44px" }}
          >
            Book a free call
            <Ar />
          </Link>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="brandGhost" className="mbtn" />}
          >
            Menu
          </SheetTrigger>
          <SheetContent side="right" className="bg-background p-5 pt-16">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="snav" aria-label="Mobile">
              {links.map(([href, label]) => (
                <Fragment key={href}>
                  <Link href={href} className={isOn(path, href) ? "on" : undefined} onClick={close}>
                    {label}
                  </Link>
                  {href === "/ai-automation-services" &&
                    sub.slice(1).map(([h, l]) => (
                      <Link key={h} href={h} className={cn("subl", path === h && "on")} onClick={close}>
                        {l}
                      </Link>
                    ))}
                </Fragment>
              ))}
            </nav>
            <Separator className="my-2" />
            <Link
              className={buttonVariants({ variant: "brand" })}
              href={onContact ? `mailto:${site.email}` : "/contact"}
              onClick={close}
            >
              {onContact ? "Email me" : "Book a free call"}
              <Ar />
            </Link>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
