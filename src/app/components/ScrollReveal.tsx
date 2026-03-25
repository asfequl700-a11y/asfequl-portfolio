"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            // Animate skill bars
            e.target.querySelectorAll(".skill-bar").forEach((b) => {
              const el = b as HTMLElement;
              el.style.width = (el.dataset.w || "0") + "%";
            });
          }
        });
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
