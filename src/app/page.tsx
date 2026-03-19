"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Car, 
  Settings,
  Star,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Heart,
  Eye,
  MessageCircle,
  Wrench,
  Utensils,
  ShoppingBag,
  Check,
  X,
  Loader2
} from "lucide-react"; 
import Link from "next/link";
import { getAllProducts } from "../lib/shopify"; 
import { useCart } from "../providers/CartProvider"; // Essential for functional cart

// Comprehensive Shopify Type for local usage
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: { node: { url: string; altText?: string } }[];
  };
  variants: {
    edges: { node: { id: string } }[];
  };
}

export default function HomePage() {
  const { addToCart } = useCart();
  
  // 1. Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  // 2. UI & Product State
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; name: string }>({ show: false, name: "" });
  const [trendingProducts, setTrendingProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Countdown Timer Logic
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev; 
      });
    }, 1000);

    // Fetch Actual Products for "Trending" Section
    const fetchTrending = async () => {
      try {
        const products = await getAllProducts();
        if (products && products.length > 0) {
          setTrendingProducts(products.slice(0, 4));
        }
      } catch (error) {
        console.error("Home: Failed to fetch trending products", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchTrending();
    return () => clearInterval(timer);
  }, []);

  // 3. Robust Add to Cart Handler
  const handleAddToCart = (product: ShopifyProduct) => {
    setAddingToCartId(product.id);
    
    // Map Shopify Data to CartProvider Item format
    const cartItem = {
      id: product.id,
      variantId: product.variants.edges[0]?.node.id, // THE CRITICAL PART FOR CHECKOUT
      title: product.title,
      handle: product.handle,
      price: Number(product.priceRange.maxVariantPrice.amount),
      image: product.images.edges[0]?.node.url || "",
      quantity: 1
    };

    addToCart(cartItem);

    // Show feedback
    setTimeout(() => {
      setAddingToCartId(null);
      setToast({ show: true, name: product.title });
      setTimeout(() => setToast({ show: false, name: "" }), 3000);
    }, 600); 
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans text-gray-900 relative">
      
      {/* --- FLOATING TOAST NOTIFICATION --- */}
      <div className={`fixed bottom-6 right-6 z-[110] transition-all duration-500 transform ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        <div className="bg-gray-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border border-white/10">
          <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-grow pr-2">
            <p className="text-sm font-bold">Added to cart</p>
            <p className="text-xs text-gray-400 line-clamp-1">{toast.name}</p>
          </div>
          <button onClick={() => setToast({show: false, name: ""})} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-50/80 to-white pt-10 pb-12 md:pt-20 md:pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-300/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center z-10 relative">
          
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border border-blue-100 text-blue-800 mb-5 md:mb-6">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Trusted across Kerala
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Quality Spares. <br />
              <span className="text-blue-600">Built for Life.</span>
            </h1>
            
            <p className="text-gray-500 text-sm md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
              From premium kitchen gear to compatible spare parts for Toyota, Suzuki, and Mahindra. Reliability you can trust since 2009.
            </p>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 md:gap-4 mb-6">
              <Link 
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="#categories"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-50/50 text-blue-800 px-8 py-4 rounded-xl font-bold hover:bg-blue-100 hover:-translate-y-1 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-blue-500" /> Fast delivery</span>
              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-500" /> Quality-tested parts</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[500px] rounded-[2.5rem] bg-gray-100 shadow-xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Home and Auto Essentials" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl inline-block max-w-[200px]">
                 <div className="flex text-amber-400 mb-1">
                   <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                 </div>
                 <p className="text-gray-900 font-bold text-xs">"Perfect fit for my Toyota & great kitchen gear!"</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND SECTION (Uniform Sizing Fix) */}
      <section className="bg-gray-50/50 py-10 md:py-14 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          
          {/* Section 1: Auto Compatibility */}
          <div className="mb-10">
            <p className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 md:mb-8">
              Compatible parts available for leading brands
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 cursor-default">
              {[
                { src: "/logo/toyota.svg", alt: "Toyota" },
                { src: "/logo/suzuki.svg", alt: "Suzuki" },
                { src: "/logo/mahindra.png", alt: "Mahindra" }
              ].map((logo, i) => (
                <div key={i} className="flex items-center justify-center w-24 md:w-36 h-10 md:h-14">
                  <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-24 h-px bg-gray-200 mx-auto mb-10"></div>

          {/* Section 2: Platforms */}
          <div>
            <p className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 md:mb-8">
              Available on platforms
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale hover:grayscale-0 transition-all duration-300">
              {[
                { src: "/logo/meesho.svg", alt: "Meesho" },
                { src: "/logo/yesbharat.svg", alt: "YesBharath" },
                { src: "/logo/kasavukendra.svg", alt: "Kasavu Kendra" },
                { src: "/logo/amazon.svg", alt: "Amazon" }
              ].map((logo, i) => (
                <div key={i} className="flex items-center justify-center w-24 md:w-36 h-10 md:h-14">
                  <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] md:text-xs text-gray-400 text-center mt-12 max-w-2xl mx-auto leading-relaxed">
            Disclaimer: We supply aftermarket and compatible spare parts. We are not affiliated with, sponsored by, or endorsed by Toyota, Suzuki, Mahindra, or any other vehicle manufacturer. All trademarks and logos belong to their respective owners.
          </p>
        </div>
      </section>

      {/* 3. HIGHLIGHTED CATEGORY GRID */}
      <section id="categories" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2">Shop by Category</h2>
            <p className="text-gray-500 text-sm md:text-base">Premium departments for your home and garage.</p>
          </div>
          <Link href="/products" className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 group text-sm md:text-base">
            Browse All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Link href="/collections/kitchen" className="group col-span-1 md:col-span-2 relative p-8 md:p-10 rounded-3xl bg-blue-900 text-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop" alt="Kitchen" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 text-white">
                <Utensils className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Kitchen & Home</h3>
                <p className="text-blue-100 text-sm font-medium max-w-sm">Premium cookware, appliances, and luxury towels for the modern household.</p>
              </div>
            </div>
          </Link>

          <Link href="/collections/auto-parts" className="group flex flex-col justify-between p-8 rounded-3xl bg-blue-50/50 hover:bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-gray-900">Auto Spare Parts</h3>
              <p className="text-gray-500 text-sm">Quality compatible parts for Toyota, Suzuki & Mahindra.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. PROMO / DEALS BANNER */}
      <section className="px-4 mb-16 md:mb-24">
        <div className="max-w-7xl mx-auto rounded-3xl bg-blue-900 overflow-hidden shadow-lg relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-100 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                <Clock className="w-3.5 h-3.5 text-red-400" /> Lightning Deals Active
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Weekly Service Specials</h2>
              <p className="text-blue-200 text-sm md:text-base font-medium">Up to 30% off on premium kitchen combos & service maintenance kits.</p>
            </div>
            
            {isMounted && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-xl backdrop-blur-sm">
                    <span className="text-xl md:text-2xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-blue-200 font-bold">Hrs</span>
                  </div>
                  <span className="text-white/30 font-bold text-xl">:</span>
                  <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-xl backdrop-blur-sm">
                    <span className="text-xl md:text-2xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-blue-200 font-bold">Min</span>
                  </div>
                  <span className="text-white/30 font-bold text-xl">:</span>
                  <div className="flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-xl backdrop-blur-sm">
                    <span className="text-xl md:text-2xl font-black text-white">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase text-blue-200 font-bold">Sec</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. DYNAMIC TRENDING PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Trending Right Now</h2>
          <Link href="/products" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {loadingProducts ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col bg-gray-50 rounded-2xl h-80 border border-gray-100"></div>
            ))
          ) : trendingProducts.map((prod, i) => {
            const price = prod.priceRange.maxVariantPrice.amount;
            const currency = prod.priceRange.maxVariantPrice.currencyCode;
            const imageUrl = prod.images.edges[0]?.node?.url;
            const isAvailable = prod.availableForSale;

            return (
              <div key={prod.id} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                
                <Link href={`/products/${prod.handle}`} className="relative w-full aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Sold Out</span>
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-grow">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Premium Quality</span>
                  <Link href={`/products/${prod.handle}`} className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-3">
                    {prod.title}
                  </Link>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-black text-blue-700">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(price))}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      disabled={addingToCartId === prod.id || !isAvailable}
                      className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-90 disabled:opacity-50"
                    >
                      {addingToCartId === prod.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TRUST SECTION */}
      <section className="bg-blue-50/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              { Icon: ShieldCheck, title: "Trusted Supplier", text: "High-quality aftermarket parts and home goods sourced from reliable manufacturers." },
              { Icon: Wrench, title: "Reliable Compatibility", text: "Every part is quality-tested to ensure a reliable fit for your specific vehicle." },
              { Icon: Truck, title: "Lightning Fast Dispatch", text: "Fast dispatch across Kerala to get you back on the road quicker." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="mb-5 p-4 bg-white shadow-sm rounded-2xl text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <item.Icon size={32} />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL BENEFIT-DRIVEN CTA */}
      <section className="px-4 pb-20 md:pb-32 pt-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Ready to experience true quality?
            </h2>
            <p className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of customers who trust Prestige Traders for their daily essentials and vehicle maintenance.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-800 px-10 py-4 rounded-xl font-black text-base hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-xl transition-all duration-300"
              >
                Shop All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-10 text-blue-100 text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-80">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Secure Checkout</span>
                <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Fast Delivery</span>
                <span className="flex items-center gap-2 md:hidden lg:flex"><ShieldCheck className="w-4 h-4" /> Trusted Since 2009</span>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}