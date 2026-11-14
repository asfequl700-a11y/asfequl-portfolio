"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { site } from "../data/site";
import { sendEnquiry } from "../app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await sendEnquiry(new FormData(e.currentTarget));
      if (res.ok) return setState("sent");
      toast.error(res.error, { description: `You can also email me at ${site.email}` });
    } catch {
      toast.error("Couldn't send right now.", { description: `Please email me at ${site.email}` });
    }
    setState("idle");
  };

  if (state === "sent") {
    return (
      <div className="vform vf-done" role="status">
        <b>Message sent.</b>
        <span>Thanks. I&apos;ll read it and reply to your email personally.</span>
        <button type="button" className="vf-again" onClick={() => setState("idle")}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="vform" onSubmit={onSubmit}>
      <div className="vf-head">
        <b>Start a project</b>
        <span>Tell me a little about your business.</span>
      </div>
      <div className="vf-row">
        <div><Label htmlFor="n">Your name</Label><Input id="n" name="name" placeholder="Jane Smith" required maxLength={100} autoComplete="name" /></div>
        <div><Label htmlFor="e">Email</Label><Input id="e" name="email" type="email" placeholder="jane@business.com" required maxLength={200} autoComplete="email" /></div>
      </div>
      {/* Spam trap: hidden from people, bots fill it in. */}
      <div className="vf-trap" aria-hidden="true"><label htmlFor="c">Company</label><input id="c" name="company" tabIndex={-1} autoComplete="off" /></div>
      <div><Label htmlFor="m">Your message</Label><Textarea id="m" name="message" placeholder="e.g. I run a plumbing business and miss calls when I'm on a job." required minLength={5} maxLength={5000} /></div>
      <Button variant="brand" type="submit" className="vf-send" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : <>Send message<span aria-hidden="true">&rarr;</span></>}
      </Button>
      <p className="vf-note">I reply personally within 48 hours.</p>
    </form>
  );
}
