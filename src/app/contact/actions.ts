"use server";

import { Resend } from "resend";
import { site } from "../../data/site";

export type SendResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Runs on the server only, so the Resend key in .env.local never reaches the browser.
export async function sendEnquiry(formData: FormData): Promise<SendResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const channel = String(formData.get("channel") ?? "").trim().slice(0, 300); // only sent by the /creators form

  // Spam trap: real people never see or fill the "company" field; bots do. Pretend it worked.
  if (String(formData.get("company") ?? "")) return { ok: true };

  if (!name || name.length > 100) return { ok: false, error: "Please add your name." };
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "Please check your email address." };
  if (message.length < 5 || message.length > 5000) return { ok: false, error: "Please write a short message." };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "The form isn't set up yet." };

  const { error } = await new Resend(key).emails.send({
    from: `Website form <form@hellofahim.com>`,
    to: site.email,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}${channel ? `\nChannel: ${channel}` : ""}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false, error: "Something went wrong sending your message." };
  }
  return { ok: true };
}
