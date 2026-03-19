"use client";

import { useCart } from "../../providers/CartProvider";
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createCheckout } from "../../lib/shopify";

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Close cart when clicking outside
  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Format items for Shopify GraphQL mutation
      const lines = cartItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));
      
      const checkoutUrl = await createCheckout(lines);
      // Redirect user to Shopify's secure checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("There was an issue creating your checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />

      {/* Slide-out panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Your Cart
          </h2>
          <button onClick={toggleCart} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p className="font-medium text-lg">Your cart is empty</p>
              <button onClick={toggleCart} className="text-blue-600 font-bold hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.variantId} className="flex gap-4 bg-white">
                <div className="w-20 h-20 relative bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                
                <div className="flex flex-col flex-grow justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/products/${item.handle}`} onClick={toggleCart} className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-blue-600">
                      {item.title}
                    </Link>
                    <button onClick={() => removeFromCart(item.variantId)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <span className="font-black text-blue-700">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-xl font-black text-gray-900">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Shipping, taxes, and discounts calculated at checkout.</p>
            
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}