"use client";

import { useState, useEffect } from "react";
// Added getCustomerAddressesOnly to the import
import { createCheckout, getCustomerAddressesOnly } from "../lib/shopify";
import { useCart } from "../providers/CartProvider";
import { ShoppingCart, Zap, Loader2, Plus, Minus, CheckCircle2, X, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AddToCartProps {
  product: any; 
  variantId: string;
  availableForSale: boolean;
}

export default function AddToCart({ product, variantId, availableForSale }: AddToCartProps) {
  const [isBuying, setIsBuying] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);
  const { cartItems, addToCart, updateQuantity } = useCart();

  const price = Number(product.priceRange.maxVariantPrice.amount);
  const currency = product.priceRange.maxVariantPrice.currencyCode;
  const productImageUrl = product.images?.edges[0]?.node?.url || "";
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);

  const cartItem = cartItems.find((item: any) => item.variantId === variantId);
  const isInCart = !!cartItem;
  const currentQty = cartItem?.quantity || 0;

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (showSuccessToast) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 50); 
      const hideTimer = setTimeout(() => setShowSuccessToast(false), 4000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [showSuccessToast]);

  const handleSmartAdd = () => {
    if (!isInCart) {
      addToCart({
        id: product.id, variantId, title: product.title, handle: product.handle, 
        price, image: productImageUrl, quantity: 1
      });
      setShowSuccessToast(true);
    } else {
      setSelectedQty(currentQty);
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    if (selectedQty === 0) {
       updateQuantity(variantId, 0); 
    } else if (isInCart) {
       updateQuantity(variantId, selectedQty);
    } else {
       addToCart({
        id: product.id, variantId, title: product.title, handle: product.handle, 
        price, image: productImageUrl, quantity: selectedQty
      });
    }
    setIsModalOpen(false);
    setShowSuccessToast(true);
  };

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      // 1. Check the browser cookies to see if they are logged in
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      };
      
      const token = getCookie("customerAccessToken");
      let defaultAddress = undefined;

      // 2. If logged in, quickly fetch their saved addresses
      if (token) {
        try {
          const addresses = await getCustomerAddressesOnly(token);
          if (addresses && addresses.length > 0) {
            defaultAddress = addresses[0]; // Use the first saved address
          }
        } catch (err) {
          console.error("Failed to fetch address", err);
        }
      }

      // 3. Pass the token and the default address to Shopify
      const checkoutUrl = await createCheckout(
        [{ merchandiseId: variantId, quantity: isInCart ? currentQty : 1 }], 
        token,
        defaultAddress
      );
      
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed", error);
      setIsBuying(false);
    }
  };

  if (!availableForSale) {
    return (
      <button disabled className="w-full bg-gray-50 text-gray-400 py-4 rounded-xl font-bold uppercase tracking-widest text-sm cursor-not-allowed border border-gray-200 mt-6">
        Out of Stock
      </button>
    );
  }

  return (
    <>
      <div className="w-full mt-6 md:mt-8">
        
        {/* Scarcity Indicator (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 mb-3 text-red-600 font-bold text-sm bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
          🔥 Selling fast • Only 5 left
        </div>

        {/* Sticky Mobile Wrapper (With iOS Safe Area Support) */}
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/90 backdrop-blur-xl border-t border-gray-200 z-50 md:relative md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none md:z-auto shadow-[0_-10px_30px_rgba(0,0,0,0.06)] md:shadow-none">
          
          {/* Scarcity Indicator (Mobile) */}
          <div className="md:hidden flex justify-center items-center gap-1.5 mb-2.5 text-red-600 font-bold text-xs">
            🔥 Selling fast • Only 5 left
          </div>

          <div className="flex gap-2 sm:gap-3 max-w-7xl mx-auto w-full">
            
            {/* --- REFINED "ADD TO CART" --- */}
            <button 
              onClick={handleSmartAdd} 
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 md:py-4 rounded-xl font-bold transition-all active:scale-95 min-h-[48px] md:h-[56px] text-[11px] min-[375px]:text-sm md:text-base border ${
                isInCart 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-none"
              }`}
            >
              {isInCart ? (
                <><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> <span className="truncate">Edit Qty ({currentQty})</span></>
              ) : (
                <><ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" /> <span className="truncate">Add to Cart</span></>
              )}
            </button>

            {/* --- DOMINANT "BUY NOW" --- */}
            <div className="flex-[1.1] min-[375px]:flex-[1.2] md:flex-[1.3] flex flex-col">
              <button 
                onClick={handleBuyNow} 
                disabled={isBuying} 
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 sm:py-3.5 md:py-4 rounded-xl font-bold shadow-[0_10px_30px_rgba(10,37,64,0.35)] hover:from-blue-950 hover:to-blue-900 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none min-h-[48px] md:h-[56px] text-[11px] min-[375px]:text-sm md:text-base px-1 sm:px-2"
              >
                {isBuying ? (
                  <><Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin shrink-0" /> <span className="truncate">Processing</span></>
                ) : (
                  <><Zap className="w-4 h-4 md:w-5 md:h-5 fill-current text-amber-400 shrink-0" /> <span className="truncate">Buy Now &bull; {formattedPrice}</span></>
                )}
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-end gap-1.5 mt-2.5 text-gray-400 text-xs font-medium pr-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure & Instant Checkout
          </div>
        </div>
      </div>

      {/* ========================================================
        2. ENHANCED TOAST (High Contrast CTA)
        ========================================================
      */}
      {showSuccessToast && (
        <div className="fixed bottom-[140px] md:bottom-10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-[150] bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm">Added to cart</p>
                <p className="text-xs text-gray-400 truncate">{product.title}</p>
              </div>
            </div>
            <Link 
              href="/cart" 
              className="shrink-0 bg-white text-gray-900 hover:bg-gray-100 text-xs font-bold py-2 px-3 sm:px-3.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              View Cart <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div 
            className="h-1 bg-emerald-500 transition-all ease-linear"
            style={{ width: `${progress}%`, transitionDuration: progress === 100 ? '0ms' : '4000ms' }}
          />
        </div>
      )}

      {/* ========================================================
        3. PREMIUM BOTTOM SHEET (Scroll Safe)
        ========================================================
      */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center pointer-events-none">
          
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          <div className="relative w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-[100%] md:slide-in-from-bottom-0 md:zoom-in-95 duration-400 ease-out flex flex-col max-h-[90vh] overflow-y-auto">
            
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 md:hidden shrink-0" />

            <div className="mb-5 sm:mb-6 shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight">Select quantity</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Update before adding to cart</p>
            </div>

            <div className="flex gap-3 sm:gap-4 items-center mb-6 sm:mb-8 shrink-0">
              {productImageUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-2xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden shadow-sm">
                  <Image src={productImageUrl} alt={product.title} fill className="object-cover p-2" />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                </div>
              )}
              <div className="flex flex-col flex-grow min-w-0">
                <h4 className="font-bold text-gray-900 line-clamp-2 text-sm leading-tight">{product.title}</h4>
                <p className="text-[#0a2540] font-black mt-1 sm:mt-1.5 text-base sm:text-lg">
                  {formattedPrice}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 shrink-0">
              <button 
                onClick={() => setSelectedQty(Math.max(0, selectedQty - 1))} 
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl transition-all active:scale-90 border ${
                  selectedQty === 0 
                    ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" 
                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 shadow-sm"
                }`}
              >
                <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <span className="text-3xl sm:text-4xl font-black text-[#0a2540] w-12 sm:w-16 text-center select-none tracking-tighter">
                {selectedQty}
              </span>
              
              <button 
                onClick={() => setSelectedQty(selectedQty + 1)} 
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-white border border-gray-200 hover:border-gray-300 text-[#0a2540] shadow-sm transition-all active:scale-90"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl mb-6 sm:mb-8 border border-gray-100/50 shadow-inner shrink-0">
               <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2 font-medium">
                 <span>Price per item</span>
                 <span>{formattedPrice}</span>
               </div>
               <div className="h-px w-full bg-gray-200 mb-2" />
               <div className="flex justify-between text-base sm:text-lg font-black text-gray-900">
                 <span>Subtotal <span className="text-xs sm:text-sm font-medium text-gray-400 ml-1">({selectedQty} items)</span></span>
                 <span className="text-[#0a2540]">
                   {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price * selectedQty)}
                 </span>
               </div>
            </div>

            <button 
              onClick={handleModalConfirm} 
              className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(10,37,64,0.35)] hover:from-blue-950 hover:to-blue-900 active:scale-[0.98] transition-all shrink-0 mt-auto"
            >
              {selectedQty === 0 ? "Remove from Cart" : "Update Cart"}
            </button>
            
          </div>
        </div>
      )}
    </>
  );
}