"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../providers/CartProvider";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useCart() as any;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // The magic happens here: as soon as they land on this page, the cart empties!
    clearCart();
  }, [clearCart]);

  if (!isMounted) return null;

  return (
    <div className="min-h-[80vh] bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100 text-center relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Thank you for your purchase. We've received your order and are getting it ready to be shipped.
          </p>

          <div className="flex flex-col gap-3">
            <Link 
              href="/account" 
              className="w-full bg-[#0a2540] text-white py-4 rounded-xl font-bold text-sm shadow-md hover:bg-[#001428] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> Track My Order
            </Link>
            
            <Link 
              href="/products" 
              className="w-full bg-blue-50 text-blue-700 py-4 rounded-xl font-bold text-sm hover:bg-blue-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}