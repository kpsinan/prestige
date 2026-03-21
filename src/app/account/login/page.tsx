"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginCustomer } from "../../../lib/shopify";
import { 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Lock,
  Check
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewlyRegistered = searchParams.get("registered") === "true";

  // Form State
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
      const response = await loginCustomer(email, password);

      if (response?.customerUserErrors?.length > 0) {
        setError("Invalid email or password. Please try again.");
      } else if (response?.customerAccessToken?.accessToken) {
        const token = response.customerAccessToken.accessToken;
        
        // Set the secure cookie
        document.cookie = `customerAccessToken=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;
        
        // Shout to the Header that we are logged in so it instantly updates
        window.dispatchEvent(new Event("auth-update"));
        
        setSuccess(true); // Triggers the green button animation
        
        // Wait 1.5s so they see the success tick, then go to Home
        setTimeout(() => {
          router.push("/");
          router.refresh(); 
        }, 1500);
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
    <div className="md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
      
      {/* Success Message from Fallback Registration */}
      {isNewlyRegistered && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 font-bold leading-relaxed">
            Account created successfully! Please log in below.
          </p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Don't have an account yet? <Link href="/account/register" className="text-blue-600 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium p-4 rounded-xl flex items-start gap-2 animate-in shake duration-300">
            <span className="shrink-0 mt-0.5">⚠️</span>
            {error}
          </div>
        )}

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
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <span className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">Forgot?</span>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            placeholder="••••••••"
          />
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
            <><Check className="w-5 h-5" /> Successfully Logged In!</>
          ) : isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
          ) : (
            <><Lock className="w-4 h-4" /> Secure Log In <ArrowRight className="w-4 h-4 ml-1" /></>
          )}
        </button>
        
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-24 px-4 sm:px-6 flex items-center justify-center">
      
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: BRANDING & TRUST              */}
        {/* ========================================== */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-900 to-[#0a2540] p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-block font-black text-2xl tracking-tight mb-8 hover:scale-105 transition-transform">
              PRESTIGE<span className="text-blue-400">.</span>
            </Link>

            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              Access your garage.
            </h2>
            
            <p className="text-blue-200 text-sm mb-10 leading-relaxed">
              Log in to track your current orders, review your past purchases, and manage your saved delivery addresses.
            </p>

            <div className="mt-12 flex items-center gap-2 text-xs font-medium text-blue-200/80 bg-white/5 p-4 rounded-xl border border-white/10">
              <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" /> 
              <p>Your session is secured with industry-standard 256-bit encryption.</p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: LOGIN FORM (Suspense Wrapped)*/}
        {/* ========================================== */}
        <Suspense fallback={<div className="md:w-7/12 p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
          <LoginForm />
        </Suspense>

      </div>
    </div>
  );
}