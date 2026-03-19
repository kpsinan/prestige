"use client";

import { useCart } from "../../providers/CartProvider";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createCheckout } from "../../lib/shopify";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const lines = cartItems.map(item => ({ merchandiseId: item.variantId, quantity: item.quantity }));
      const checkoutUrl = await createCheckout(lines);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to initiate checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 md:mb-12 tracking-tight">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Cart Items Column */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <div className="flex flex-col gap-8">
                {cartItems.map((item) => (
                  <div key={item.variantId} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <div className="w-24 h-24 relative bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover p-2" />
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/products/${item.handle}`} className="font-bold text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors">
                          {item.title}
                        </Link>
                        <span className="text-gray-500 font-medium mt-1">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-center mt-4 md:mt-0">
                      <span className="md:hidden text-sm font-bold text-gray-400 uppercase">Quantity:</span>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 text-gray-500 hover:text-gray-900">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 text-gray-500 hover:text-gray-900">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-between md:justify-end mt-2 md:mt-0">
                      <span className="font-black text-lg text-blue-700">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.quantity)}
                      </span>
                      <button onClick={() => removeFromCart(item.variantId)} className="ml-4 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl sticky top-32">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="flex items-center justify-between mb-4 text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700 text-gray-300">
                  <span>Shipping</span>
                  <span className="text-sm">Calculated at next step</span>
                </div>
                
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-blue-400">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cartTotal)}
                  </span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mb-4"
                >
                  {isCheckingOut ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Checkout Securely"}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  256-bit SSL Secure Checkout
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}