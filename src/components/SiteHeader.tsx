"use client";

import { useState } from "react";
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
  return (
    <div className={lightPages.includes(path) ? "vhead light" : "vhead night"}>
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
          className={buttonVariants({ variant: "brand" })}
          href="/contact"
          style={{ minHeight: "44px" }}
        >
          Book a call
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
              Book a call
              <Ar />
            </Link>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
