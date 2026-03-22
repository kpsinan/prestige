"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Tracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // Save the referrer's ID in a cookie for 30 days
      document.cookie = `referral_code=${ref}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;
    }
  }, [searchParams]);

  return null; // This component is completely invisible
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}