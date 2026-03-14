import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative bg-[#0B0F19] text-white pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
      {/* Advanced Cinematic Background Design */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_-20%,_#2563EB,_transparent)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[grid-white_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
          <span className="text-[9px] md:text-[10px] font-black text-[#6B7280] uppercase tracking-[0.4em]">
            Premium Auto Parts Since 2009
          </span>
        </div>

        {/* Cinematic Typography */}
        <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-black tracking-tighter mb-6 leading-[0.9] uppercase italic">
          Keep Your Vehicle <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-indigo-400">
            At Its Peak.
          </span>
        </h1>
        
        <p className="text-[#6B7280] max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed opacity-90 mb-10 px-4">
          Directly sourced, genuine spare parts for Toyota and more. 
          Guaranteed fitment, fast shipping, and secure guest checkout.
        </p>

        {/* Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
          <Link 
            href="/products"
            className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-[#2563EB] text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#60A5FA] transition-all shadow-2xl shadow-[#2563EB]/40"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="#smart-search"
            className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Find Specific Part
          </Link>
        </div>
      </div>
    </section>
  );
}