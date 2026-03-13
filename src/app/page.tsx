// src/app/page.tsx
import SmartSearch from "../components/home/SmartSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. THE INDUSTRIAL HERO SECTION */}
      <section className="relative bg-[#0A0A0A] pt-24 pb-40 overflow-hidden">
        {/* Decorative Grid Pattern for a "Technical" feel */}
        <div className="absolute inset-0 opacity-10 bg-[grid-white/[0.05]] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        {/* Subtle Blue Glow in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Precision Sourced Spare Parts
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            ENGINEERED TO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-300">
              PERFORM.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            Directly sourced, authentic car spare parts for Toyota and premium brands. 
            Delivering reliability to Edakkara and beyond since 2009.
          </p>
        </div>
      </section>

      {/* 2. THE FLOATING SEARCH INTERFACE */}
      {/* We use -mt-24 to "pull" the search box up into the dark hero section */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 -mt-24">
        <div className="bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Diagnostic Search</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          </div>
          <div className="p-2 sm:p-4">
            <SmartSearch />
          </div>
        </div>
      </section>

      {/* 3. BRAND TRUST SECTION (THE EDDYS) */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Badge 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Authenticity</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every part in our inventory undergoes a rigorous 5-point quality check to ensure it meets factory specifications.
            </p>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Swift Dispatch</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Orders placed before 2 PM are dispatched same-day from our hub in Edakkara. Real-time tracking included.
            </p>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Friction</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Secure guest checkout powered by Shopify. No accounts, no passwords—just your parts delivered.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LOCAL PRESENCE STRIP */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📍</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Headquarters</p>
              <p className="font-bold text-gray-900">Edakkara, Malappuram, Kerala</p>
            </div>
          </div>
          <div className="h-px w-20 bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="text-3xl">📞</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Customer Support</p>
              <p className="font-bold text-gray-900">Ready to assist with fitment questions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}