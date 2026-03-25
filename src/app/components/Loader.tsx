"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [count, setCount] = useState(1);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 2500; // 2.5 seconds for a premium, smooth wind-down

    const animateLoader = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(timestamp - startTime, duration);
      
      // Cubic ease-out function for extremely smooth deceleration
      const t = progress / duration;
      const easeOutCubic = 1 - Math.pow(1 - t, 3);
      
      // Calculate current percentage (1 to 100)
      const current = Math.floor(easeOutCubic * 99) + 1;
      setCount(current);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateLoader);
      } else {
        setCount(100); // Guarantee it settles at 100
        setTimeout(() => setHidden(true), 500); // Wait half a second before hiding
      }
    };

    animationFrameId = requestAnimationFrame(animateLoader);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="loader" className={hidden ? "hidden" : ""}>
      <div className="loader-counter">{count}</div>
      <div className="loader-line"></div>
      <div className="loader-name">
        <span>Asfequl</span>
        <span>Alam</span>
        <span>Fahim</span>
      </div>
      <p className="loader-role">
        SEO Specialist &middot; Digital Creator &middot; Indie Hacker
      </p>
    </div>
  );
}
