"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../providers/CartProvider";
import { createCheckout, getCustomerAddressesOnly } from "../../lib/shopify";
import { Trash2, Plus, Minus, ArrowRight, MapPin, Loader2, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart() as any;
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Auth & Address State
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [token, setToken] = useState<string | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  const items = cartItems || [];
  const cartTotal = items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    setIsMounted(true);
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };
    
    const customerToken = getCookie("customerAccessToken");
    if (customerToken) {
      setToken(customerToken);
      // Fetch addresses for the dropdown so we can inject them into checkout
      getCustomerAddressesOnly(customerToken).then(data => {
        if (data && data.length > 0) setAddresses(data);
      }).catch(console.error);
    }
  }, []);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const lines = items.map((item: any) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));

      // Grab the address they selected from the dropdown
      const chosenAddress = addresses.length > 0 ? addresses[selectedAddressIndex] : undefined;

      // Pass the items, the user token, AND the chosen address to Shopify
      const checkoutUrl = await createCheckout(lines, token, chosenAddress);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout Error:", error);
      setIsCheckingOut(false);
    }
  };

  // Prevent hydration mismatch on the first render
  if (!isMounted) return null;

  // ==========================================
  // EMPTY CART STATE
  // ==========================================
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-[#FAFAFA]">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-sm">Looks like you haven't added any premium auto parts or kitchen gear yet.</p>
        <Link href="/products" className="bg-[#0a2540] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#001428] active:scale-95 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  // ==========================================
  // ACTIVE CART STATE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-8">
          Shopping Cart ({items.length})
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* ========================================== */}
          {/* LEFT: CART ITEMS LIST                      */}
          {/* ========================================== */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {items.map((item: any) => (
              <div key={item.variantId} className="bg-white rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Product Image */}
                <Link href={`/products/${item.handle}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 relative flex items-center justify-center group">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  )}
                </Link>

                {/* Details & Controls */}
                <div className="flex-grow flex flex-col justify-between h-full w-full">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <Link href={`/products/${item.handle}`} className="font-bold text-gray-900 text-lg hover:text-blue-600 line-clamp-2 transition-colors">
                      {item.title}
                    </Link>
                    
                    {/* Delete Button (Fixed to use variantId) */}
                    <button 
                      onClick={() => removeFromCart(item.variantId)} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-xl font-black text-[#0a2540]">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                    </p>
                    
                    {/* Quantity Selector (Fixed to use variantId) */}
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                      <button 
                        onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 rounded-lg shadow-sm transition-all active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-900 select-none">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 rounded-lg shadow-sm transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* ========================================== */}
          {/* RIGHT: ORDER SUMMARY & ADDRESS INJECTION   */}
          {/* ========================================== */}
          <div className="w-full lg:w-1/3 bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm lg:sticky top-28">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-500 font-medium">
              <span>Subtotal</span>
              <span className="text-gray-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartTotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-gray-500 font-medium pb-6 border-b border-gray-100">
              <span>Shipping</span>
              <span className="text-emerald-600 font-bold tracking-wide uppercase text-xs">Calculated at next step</span>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-[#0a2540]">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartTotal)}
              </span>
            </div>

            {/* Address Selection Dropdown (Only shows if logged in with saved addresses) */}
            {token && addresses.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <label className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Deliver To
                </label>
                <select 
                  value={selectedAddressIndex}
                  onChange={(e) => setSelectedAddressIndex(Number(e.target.value))}
                  className="w-full bg-white border border-blue-200 text-gray-900 rounded-lg px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-sm"
                >
                  {addresses.map((addr, index) => (
                    <option key={index} value={index}>
                      {addr.firstName} - {addr.city}, {addr.zip}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Login Nudge (If not logged in) */}
            {!token && (
              <div className="mb-6 text-center">
                <p className="text-xs text-gray-500 mb-2">Want to track your order and checkout faster?</p>
                <Link href="/account/login" className="text-sm font-bold text-blue-600 hover:underline">
                  Log in to your account
                </Link>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#0a2540] text-white py-4 rounded-xl font-bold text-base shadow-[0_4px_14px_0_rgba(10,37,64,0.39)] hover:shadow-[0_6px_20px_rgba(10,37,64,0.23)] hover:bg-[#001428] active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isCheckingOut ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Preparing Secure Checkout...</>
              ) : (
                <>Proceed to Checkout <ArrowRight className="w-5 h-5 ml-1" /></>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure 256-bit encrypted checkout
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}