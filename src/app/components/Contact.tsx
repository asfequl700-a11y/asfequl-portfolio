"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { sendEmail } from "@/actions/sendEmail";
import {
  LinkedInIcon,
  TwitterIcon,
  GitHubIcon,
  InstagramIcon,
  EmailIcon,
} from "./Icons";

const contactSchema = z.object({
  fname: z.string().min(1, "First Name is required"),
  lname: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    startTransition(async () => {
      const result = await sendEmail(data);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("✓ Sent! Check your inbox for a confirmation.");
      reset();
    });
  };

  return (
    <section id="contact">
      <div className="container">
        <p className="section-label reveal">04 &mdash; Contact</p>
        <div className="contact-grid">
          <div className="reveal-left">
            <h2 className="contact-heading">
              Let&rsquo;s build something&nbsp;<em>together</em>
            </h2>
            <p className="contact-sub">
              Have a project, a question, or just want to say hello? Send a message
              and I&rsquo;ll get back to you within 24 hours.
            </p>
            <div className="contact-links">
              <a href="mailto:asfequl700@gmail.com" className="contact-link">
                <div className="contact-link-icon">
                  <EmailIcon />
                </div>
                asfequl700@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/asfequl-alamfahim-474182399"
                target="_blank"
                className="contact-link"
              >
                <div className="contact-link-icon">
                  <LinkedInIcon size={15} />
                </div>
                LinkedIn Profile
              </a>
            </div>
            <div className="contact-socials">
              <a href="" className="social-pill" target="_blank">
                <LinkedInIcon size={13} />
                LinkedIn
              </a>
              <a href="" className="social-pill" target="_blank">
                <TwitterIcon size={13} />
                Twitter
              </a>
              <a href="" className="social-pill" target="_blank">
                <GitHubIcon size={13} />
                GitHub
              </a>
              <a href="" className="social-pill" target="_blank">
                <InstagramIcon size={13} />
                Instagram
              </a>
            </div>
          </div>

          <form className="form-card reveal-right" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="field">
                <label>First Name</label>
                <input 
                  type="text" 
                  placeholder="John" 
                  {...register("fname")} 
                  style={errors.fname ? { borderColor: "#ef4444" } : {}}
                />
                {errors.fname && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.fname.message}</span>}
              </div>
              <div className="field">
                <label>Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  {...register("lname")} 
                  style={errors.lname ? { borderColor: "#ef4444" } : {}}
                />
                {errors.lname && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.lname.message}</span>}
              </div>
            </div>
            <div className="field">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                {...register("email")} 
                style={errors.email ? { borderColor: "#ef4444" } : {}}
              />
              {errors.email && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.email.message}</span>}
            </div>
            <div className="field">
              <label>Subject</label>
              <input
                type="text"
                placeholder="SEO consultation, Collaboration…"
                {...register("subject")}
                style={errors.subject ? { borderColor: "#ef4444" } : {}}
              />
              {errors.subject && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.subject.message}</span>}
            </div>
            <div className="field">
              <label>Message</label>
              <textarea
                rows={5}
                placeholder="Tell me about your project or idea…"
                {...register("message")}
                style={errors.message ? { borderColor: "#ef4444" } : {}}
              ></textarea>
              {errors.message && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.message.message}</span>}
            </div>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={isPending}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}
            >
              {isPending ? "Sending…" : "Send Message"}
              {!isPending && <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
