"use client";

import type { FormEvent } from "react";
import { toast } from "sonner";
import { site } from "../data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const needs = ["A new website", "AI receptionist", "AI agents & automation", "Not sure yet"];

export default function ContactForm() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    // shortcut: opens the visitor's email app instead of sending from a server; upgrade to Resend if visitors without a mail app matter.
    const body = `Name: ${d.name}\nEmail: ${d.email}\nNeed: ${d.need}\n\n${d.message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Website enquiry: ${d.need}`)}&body=${encodeURIComponent(body)}`;
    toast("Your email app should open now.", { description: `If it doesn't, email me at ${site.email}`, duration: 10000 });
  };

  return (
    <form className="vform" onSubmit={onSubmit}>
      <div><Label htmlFor="n">Your name</Label><Input id="n" name="name" placeholder="Jane Smith" required autoComplete="name" /></div>
      <div><Label htmlFor="e">Email</Label><Input id="e" name="email" type="email" placeholder="jane@business.com" required autoComplete="email" /></div>
      <div>
        <Label htmlFor="b">What do you need?</Label>
        <Select name="need" defaultValue={needs[0]}>
          <SelectTrigger id="b"><SelectValue /></SelectTrigger>
          <SelectContent>{needs.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label htmlFor="m">Tell me a bit more</Label><Textarea id="m" name="message" rows={4} placeholder="I run a plumbing business and miss calls when I'm on a job." required /></div>
      <Button variant="brand" type="submit">Send message</Button>
    </form>
  );
}
