"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer, loginCustomer } from "../../../lib/shopify";
import { 
  Loader2, 
  ArrowRight, 
  Package, 
  Zap, 
  Tag, 
  ShieldCheck,
  Check
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await createCustomer(email, password, firstName, lastName);

      if (response?.customerUserErrors?.length > 0) {
        setError(response.customerUserErrors[0].message);
      } else if (response?.customer) {
        
        // Auto-login the user immediately after successful registration!
        const loginRes = await loginCustomer(email, password);
        
        if (loginRes?.customerAccessToken?.accessToken) {
          // Set the secure cookie
          document.cookie = `customerAccessToken=${loginRes.customerAccessToken.accessToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;
          
          // Shout to the Header that we are logged in so it instantly updates
          window.dispatchEvent(new Event("auth-update"));
          
          setSuccess(true); // Triggers the green button animation
          
          // Wait 1.5s so they see the success tick, then go to Home
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 1500);
        } else {
          // Fallback if auto-login fails for some reason
          router.push("/account/login?registered=true");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-24 px-4 sm:px-6 flex items-center justify-center">
      
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: THE BENEFITS                  */}
        {/* ========================================== */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-900 to-[#0a2540] p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-block font-black text-2xl tracking-tight mb-8 hover:scale-105 transition-transform">
              PRESTIGE<span className="text-blue-400">.</span>
            </Link>

            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              Unlock the full experience.
            </h2>
            
            <p className="text-blue-200 text-sm mb-10 leading-relaxed">
              Guest checkout is always available at the cart, but creating a free Prestige account gives you absolute control over your garage and kitchen upgrades.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <Package className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Order Tracking & History</h4>
                  <p className="text-xs text-blue-200 mt-1">Easily track your shipments and access invoices for past purchases.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Lightning Fast Checkout</h4>
                  <p className="text-xs text-blue-200 mt-1">Save your delivery details securely for 1-click ordering next time.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <Tag className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Member-Only Deals</h4>
                  <p className="text-xs text-blue-200 mt-1">Get early access to weekly specials and exclusive discount codes.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center gap-2 text-xs font-medium text-blue-200/80">
              <ShieldCheck className="w-4 h-4" /> Your data is securely encrypted.
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: REGISTRATION FORM            */}
        {/* ========================================== */}
        <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          <div className="md:hidden mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start">
            <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              In a rush? You can skip this and checkout as a guest from your cart. Or, create an account below to track your orders!
            </p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Already have an account? <Link href="/account/login" className="text-blue-600 font-bold hover:underline">Log in here</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium p-4 rounded-xl flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
              />
              <p className="text-[11px] text-gray-400 font-medium mt-1">Must be at least 5 characters long.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className={`mt-4 w-full text-white py-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 disabled:pointer-events-none ${
                success 
                  ? "bg-emerald-600 shadow-[0_4px_14px_0_rgba(5,150,105,0.39)]" 
                  : "bg-[#0a2540] shadow-[0_4px_14px_0_rgba(10,37,64,0.39)] hover:shadow-[0_6px_20px_rgba(10,37,64,0.23)] hover:bg-[#001428] active:scale-[0.98]"
              }`}
            >
              {success ? (
                <><Check className="w-5 h-5" /> Account Created & Logged In!</>
              ) : isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
            
          </form>

        </div>
      </div>
    </div>
  );
}