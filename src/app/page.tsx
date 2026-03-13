// src/app/page.tsx
import SmartSearch from "../components/home/SmartSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. THE CINEMATIC HERO SECTION */}
      <section className="relative bg-[#080808] pt-32 pb-56 overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-5 bg-[grid-white/[0.1]] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Sourced in Edakkara
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10 uppercase">
            Superior <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-300">
              Machinery.
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-gray-400 text-sm md:text-lg font-medium leading-relaxed opacity-80">
            Direct access to genuine Toyota and global spare parts. 
            Engineered for reliability, delivered with prestige.
          </p>
        </div>
      </section>

      {/* 2. THE FLOATING DIAGNOSTIC CARD */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 -mt-36">
        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#F9FAFB] border-b border-gray-100 px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Diagnostic: Active</span>
          </div>
          
          <div className="p-4 md:p-8">
             <SmartSearch />
          </div>
        </div>
      </section>

      {/* 3. THE "WHY PRESTIGE" GRID */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="group">
            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">🛡️</div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-4">Certified Genuine</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Every part is authenticated via serial tracking. No duplicates. No compromises on safety.
            </p>
          </div>

          <div className="group">
            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">⚡</div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-4">Rapid Logistics</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Express delivery across Malappuram and Kerala. Most parts arrive at your door within 48 hours.
            </p>
          </div>

          <div className="group">
            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">⚙️</div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-4">Expert Support</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Consult with our technicians in Edakkara to ensure perfect factory fitment before you buy.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION STRIP */}
      <section className="mx-6 mb-24">
        <div className="max-w-7xl mx-auto bg-[#080808] rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px]"></div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-10 uppercase">
            Not finding <br className="md:hidden"/> your part?
          </h2>
          <a 
            href="/products"
            className="inline-block bg-blue-600 text-white px-14 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-500 hover:scale-105 transition-all shadow-2xl shadow-blue-900/30"
          >
            Explore Full Catalog
          </a>
        </div>
      </section>
    </div>
  );
}