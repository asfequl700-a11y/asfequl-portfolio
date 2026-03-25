"use client";

import { useEffect, useState, useCallback } from "react";
import {
  HomeIcon,
  UserIcon,
  StarIcon,
  BriefcaseIcon,
  MailIcon,
} from "./Icons";

const navItems = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "about", label: "About", icon: <UserIcon /> },
  { id: "skills", label: "Skills", icon: <StarIcon /> },
  { id: "experience", label: "Work", icon: <BriefcaseIcon /> },
  { id: "contact", label: "Contact", icon: <MailIcon /> },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  const navTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav id="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? "active" : ""}`}
          onClick={() => navTo(item.id)}
        >
          {item.icon}
          <span className="nav-label">{item.label}</span>
          <span className="nav-pip"></span>
        </button>
      ))}
    </nav>
  );
}
