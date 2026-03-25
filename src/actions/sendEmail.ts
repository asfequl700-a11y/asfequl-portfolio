"use server";

import * as React from "react";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  fname: z.string().min(1, "First Name is required"),
  lname: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function sendEmail(data: ContactFormData) {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs.", details: parsed.error.format() };
  }

  const { fname, lname, email, subject, message } = parsed.data;

  try {
    const { data: resendData, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Replace with a verified domain (e.g. hello@yourdomain.com) if available
      to: ["asfequl700@gmail.com"], // Your receiving email
      replyTo: email,
      subject: `New Contact from ${fname} ${lname}: ${subject}`,
      react: React.createElement(EmailTemplate, { fname, lname, email, subject, message }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { error: "Failed to send email. Ensure the API key and domain are configured properly." };
    }

    return { success: true };
  } catch (error) {
    console.error("Internal Server Error:", error);
    return { error: String(error) || "An unexpected error occurred while sending the email." };
  }
}

