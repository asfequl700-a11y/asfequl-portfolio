import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
// Note: onboarding@resend.dev is strictly for testing only. Replace with your verified domain for production.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const OWNER_EMAIL = "asfequl700@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { fname, lname, email, subject, message } = await req.json();

    if (!fname || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ownerHtml = `
      <div style="font-family:sans-serif;max-width:600px;background:#0a0a0a;color:#f0ede8;padding:40px;border-radius:16px">
        <h2 style="color:#c8a96e">New message from your portfolio</h2>
        <hr style="border:none;border-top:1px solid #222;margin:20px 0"/>
        <p><b>Name:</b> ${fname} ${lname}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject || "—"}</p>
        <p><b>Message:</b></p>
        <blockquote style="border-left:3px solid #c8a96e;margin:8px 0;padding:12px 20px;background:#111;border-radius:0 8px 8px 0">
          ${message.replace(/\n/g, "<br/>")}
        </blockquote>
      </div>
    `;

    const visitorHtml = `
      <div style="font-family:sans-serif;max-width:600px;background:#0a0a0a;color:#f0ede8;padding:48px;border-radius:16px">
        <h1 style="font-size:32px;color:#c8a96e">Thank you, ${fname}!</h1>
        <p style="color:#aaa;margin:8px 0 32px">Your message has been received.</p>
        <p style="line-height:1.8">Hi ${fname},<br/><br/>I've received your message and will get back to you within <b style="color:#c8a96e">24 hours</b>. Looking forward to connecting!</p>
        <div style="margin:40px 0;padding:24px;background:#111;border-radius:12px;border:1px solid #222">
          <p style="font-size:12px;color:#555;margin-bottom:6px">Your message</p>
          <p style="color:#ccc;line-height:1.7">${message.replace(/\n/g, "<br/>")}</p>
        </div>
        <p>Cheers,<br/><b style="color:#c8a96e">Asfequl alam Fahim</b><br/><span style="font-size:13px;color:#555">SEO Specialist · Ryne AI</span></p>
      </div>
    `;

    // 1. Notify you (the owner)
    const { error: ownerError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      replyTo: email,
      subject: `New Contact: ${subject || "Message from " + fname}`,
      html: ownerHtml,
    });

    if (ownerError) {
      console.error(ownerError);
      return NextResponse.json({ error: ownerError.message || "Failed to notify owner" }, { status: 500 });
    }

    // 2. Send confirmation to the visitor
    const { error: visitorError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Hi ${fname}, message received! ✨`,
      html: visitorHtml,
    });

    if (visitorError) {
      console.error(visitorError);
      return NextResponse.json({ error: visitorError.message || "Failed to send visitor confirmation" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server/Network Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred parsing the request." }, { status: 500 });
  }
}
