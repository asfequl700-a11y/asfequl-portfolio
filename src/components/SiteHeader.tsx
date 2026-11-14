"use client";

import { useEffect, useState } from "react";
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

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/work", "Work"],
  ["/projects", "Projects"],
  ["/about", "About"],
] as const;

// Pages whose top section is light in the mockups; the rest start dark.
const lightPages = ["/services", "/about"];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  // Fixed header: full width over the hero, then it gathers into one compact box once the hero has scrolled away
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const hero = document.querySelector("main section");
      // half-screen: the same moment the home backdrop fades to the next section's colour, so the
      // (transparent, light-text) full bar never sits on a cream background
      setCompact(hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.5 : window.scrollY > window.innerHeight * 0.5);
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
    <div className={cn("vhead", lightPages.includes(path) ? "light" : "night", compact && "compact")}>
      <header className="wrap vtop">
        <Link className="vlogo" href="/" onClick={close}>
          fahim<b>.</b>
        </Link>
        <nav className="vnav" aria-label="Main">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "pill" }),
                path === href && "on",
              )}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className={buttonVariants({ variant: "brandStill" })}
          href="/contact"
          style={{ minHeight: "44px" }}
        >
          Book a free call
          <Ar />
        </Link>
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
                <Link
                  key={href}
                  href={href}
                  className={path === href ? "on" : undefined}
                  onClick={close}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Separator className="my-2" />
            <Link
              className={buttonVariants({ variant: "brand" })}
              href="/contact"
              onClick={close}
            >
              Book a free call
              <Ar />
            </Link>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
