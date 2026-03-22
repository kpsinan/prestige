"use client";

import { useEffect, useState } from "react";

export default function ShutterEffect() {
  const [shouldRender, setShouldRender] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 1. UX Improvement: Use localStorage to show only once per day
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem("prestige_shutter_date");

    if (lastSeen === today) {
      setShouldRender(false);
      return;
    }

    // 2. Motion Improvement: Cinematic 400ms delay before rolling up
    const startTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 400);

    // 3. Cleanup: Remove from DOM after animation completes
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      localStorage.setItem("prestige_shutter_date", today);
    }, 1600); // 400ms delay + 1000ms max animation + 200ms buffer

    return () => {
      clearTimeout(startTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden">
      {/* Single Metal Shutter
        - Performance: will-change-transform pre-optimizes the animation
        - Mobile: duration-[700ms] on mobile, md:duration-[1000ms] on desktop
        - Motion: Heavy, mechanical cubic-bezier snap
      */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center 
          transition-transform ease-[cubic-bezier(0.85,0,0.15,1)] will-change-transform
          duration-[700ms] md:duration-[1000ms]
          ${isAnimating ? "-translate-y-full" : "translate-y-0"}
        `}
        style={{
          // Visuals: Enhanced realistic metal slats with highlights and shadows (No images)
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.6)),
            repeating-linear-gradient(
              to bottom,
              #1c1c1c,
              #1c1c1c 22px,
              #2a2a2a 22px,
              #2a2a2a 24px,
              #121212 24px,
              #121212 26px
            )
          `,
        }}
      >
        {/* Visuals: Subtle radial light leak from the top */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_65%)] pointer-events-none" />

        {/* Visuals: Painted logo with an ambient drop-shadow glow */}
        <h1 className="relative z-10 text-white text-3xl md:text-5xl font-light tracking-[0.3em] uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
          Prestige
        </h1>

        {/* Visuals: Heavy, weighted bottom bar to anchor the physics */}
        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] border-t border-[#3a3a3a] shadow-[0_15px_40px_rgba(0,0,0,0.9)] z-20" />
      </div>
    </div>
  );
}