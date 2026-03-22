"use client";

import { useState, useEffect } from "react";
import { Share2, Check, Gift, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCustomerOrders } from "../lib/shopify";

export default function PremiumShareButton({ productHandle }: { productHandle: string }) {
  const [copied, setCopied] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };

    const token = getCookie("customerAccessToken");

    if (token) {
      getCustomerOrders(token)
        .then((data) => {
          if (data?.id) {
            const rawId = data.id.split("/").pop();
            setCustomerId(rawId);

            const url = `${window.location.origin}/products/${productHandle}?ref=${rawId}`;
            setShareUrl(url);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [productHandle]);

  const handleShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out 👀",
          text: "You’ll love this product. I’m earning rewards when you buy!",
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (!shareUrl) return;
    const text = encodeURIComponent(
      `Hey! Check this out 👇\n${shareUrl}\n\nI get rewards if you buy 😄`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="h-16 w-full bg-gray-50 animate-pulse rounded-xl mt-6"></div>
    );
  }

  // 🔒 Not logged in
  if (!customerId) {
    return (
      <Link
        href="/account/login"
        className="mt-6 flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">
              Earn rewards when you share 💸
            </p>
            <p className="text-xs text-gray-500">
              Login & start earning on every order.
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </Link>
    );
  }

  // ✅ Logged in
  return (
    <div className="mt-6 space-y-3">
      {/* Main Share Button */}
      <button
        onClick={handleShare}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] hover:scale-[1.01] ${
          copied
            ? "bg-emerald-50 border-emerald-200 shadow-sm"
            : "bg-gradient-to-r from-blue-100 via-blue-50 to-transparent border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              copied ? "bg-emerald-100" : "bg-blue-100"
            }`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 text-blue-600 group-hover:rotate-6 transition-transform" />
            )}
          </div>

          <div className="text-left">
            <p
              className={`font-semibold text-sm ${
                copied ? "text-emerald-900" : "text-blue-950"
              }`}
            >
              {copied ? "Link Ready 🚀" : "Share & Start Earning 💸"}
            </p>
            <p
              className={`text-xs ${
                copied ? "text-emerald-700" : "text-blue-800/80"
              }`}
            >
              {copied
                ? "Paste it anywhere and earn rewards."
                : "Earn every time your friends shop."}
            </p>
          </div>
        </div>
      </button>

      {/* WhatsApp Quick Share */}
      <button
        onClick={handleWhatsAppShare}
        className="w-full p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium hover:bg-green-100 transition-all"
      >
        Share on WhatsApp 📲
      </button>
    </div>
  );
}