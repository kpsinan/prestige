"use client";

import { useState } from "react";
import { createCheckout } from "../lib/shopify";

interface AddToCartProps {
  variantId: string;
  availableForSale: boolean;
}

export default function AddToCart({ variantId, availableForSale }: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 1. Logic for "Add to Cart"
  const handleAddToCart = async () => {
    if (!availableForSale) return;
    setIsAdding(true);
    setShowSuccess(false);
    
    try {
      // We use the same createCheckout logic to initialize a Shopify Cart session
      const checkoutUrl = await createCheckout(variantId);
      
      // Save the checkout URL in LocalStorage so the user can return to it later
      if (typeof window !== "undefined") {
        localStorage.setItem("prestige_cart_url", checkoutUrl);
      }

      // Show a temporary success state
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      console.log("Item added to Shopify Cart session:", checkoutUrl);
    } catch (error) {
      console.error("Cart Error:", error);
      alert("Could not add to cart. Check your internet connection.");
    } finally {
      setIsAdding(false);
    }
  };

  // 2. Logic for "Buy Now" (Instant Redirect)
  const handleBuyNow = async () => {
    if (!availableForSale) return;
    setIsBuying(true);
    
    try {
      const checkoutUrl = await createCheckout(variantId);
      if (checkoutUrl) {
        // Instant teleport to Shopify Secure Checkout
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Buy Now Error:", error);
      alert("Checkout is unavailable. Is your Shopify store active?");
    } finally {
      setIsBuying(false);
    }
  };

  if (!availableForSale) {
    return (
      <div className="w-full mt-8">
        <button disabled className="w-full bg-gray-100 text-gray-400 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] cursor-not-allowed border border-gray-200">
          Sold Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-8">
      {/* Success Message Pop-up */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-bounce text-center">
          ✓ Added to Inventory Cart
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding || isBuying}
          className="flex-1 bg-white border-2 border-prestige-dark text-prestige-dark py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
        >
          {isAdding ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            "Add to Cart"
          )}
        </button>

        {/* Buy Now */}
        <button 
          onClick={handleBuyNow}
          disabled={isAdding || isBuying}
          className="flex-1 bg-prestige-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-prestige-primary transition-all duration-300 shadow-xl shadow-prestige-dark/10 hover:shadow-prestige-primary/30 hover:-translate-y-1 disabled:opacity-50"
        >
          {isBuying ? "Securely Redirecting..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}