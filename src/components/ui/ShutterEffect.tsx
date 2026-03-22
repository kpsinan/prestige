"use client";

import { useEffect, useState } from "react";

export default function ShutterEffect() {
  const [shouldRender, setShouldRender] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

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

    // 3. UX Improvement: Smooth exit fade-out just before the component unmounts
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1300); // Triggers as the shutter is finishing its roll-up

    // 4. Cleanup: Remove from DOM completely
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      localStorage.setItem("prestige_shutter_date", today);
    }, 1600); // 400ms delay + 1000ms max animation + 200ms buffer

    return () => {
      clearTimeout(startTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] pointer-events-none overflow-hidden transition-opacity duration-300 ease-in-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Single Metal Shutter
        - Performance: will-change-transform and backface-hidden prevent UI flickering
        - Mobile: duration-[700ms] on mobile, md:duration-[1000ms] on desktop
        - Motion: Heavy, mechanical cubic-bezier snap
      */}
      <div
        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center 
          transition-transform ease-[cubic-bezier(0.85,0,0.15,1)] will-change-transform
          duration-[700ms] md:duration-[1000ms]
          ${isAnimating ? "-translate-y-full" : "translate-y-0"}
        `}
        style={{
          // Performance: Prevent GPU flickering
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          // Visuals: Enhanced layered gradients for metal texture & light overlay (motion blur illusion)
          backgroundImage: `
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.8)),
            repeating-linear-gradient(
              to bottom,
              #171717,
              #171717 18px,
              #242424 18px,
              #242424 20px,
              #0d0d0d 20px,
              #0d0d0d 24px
            )
          `,
        }}
      >
        {/* Visuals: Subtle radial light leak from the top */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.08)_0%,transparent_55%)] pointer-events-none" />

        {/* Branding Enhancements */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Small “OPENING STORE” text */}
          <span className="text-neutral-400 text-xs md:text-sm font-medium tracking-[0.4em] mb-4 uppercase drop-shadow-md">
            Opening Store
          </span>
          
          {/* Painted logo with an ambient drop-shadow glow */}
          <h1 className="text-white text-4xl md:text-6xl font-light tracking-[0.3em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Prestige
          </h1>
        </div>

        {/* Visuals: Heavy, weighted bottom bar to anchor the physical feel */}
        <div className="absolute bottom-0 w-full h-10 md:h-12 bg-gradient-to-b from-[#3a3a3a] via-[#1a1a1a] to-[#050505] border-t-2 border-[#4a4a4a] shadow-[0_25px_50px_rgba(0,0,0,1)] z-20" />
      </div>
    </div>
  );
}