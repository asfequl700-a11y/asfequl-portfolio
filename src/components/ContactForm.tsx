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
    const form = e.currentTarget;
    // TODO Fahim: wire an email API here (for example a Next.js route handler that calls Resend,
    // with the API key in .env.local). Until then nothing is sent; the visitor sees the toast below.
    // const data = Object.fromEntries(new FormData(form));
    form.reset();
    toast("Thanks! The form is not connected yet.", { description: `Please also email me at ${site.email}`, duration: 10000 });
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
