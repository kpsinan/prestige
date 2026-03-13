import SmartSearch from "../components/home/SmartSearch";
import { ShieldCheck, Zap, Settings2, ArrowRight } from "lucide-react"; // Assuming lucide-react is installed

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. THE CINEMATIC HERO SECTION */}
      <section className="relative bg-[#080808] pt-32 pb-64 overflow-hidden">
        {/* Advanced Background Visuals */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a,_transparent)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[grid-white_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
              Precision Sourced • Edakkara
            </span>
          </div>

          <h1 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] mb-12 uppercase italic">
            Engineered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-400">
              Prestige.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-lg font-medium leading-relaxed opacity-70">
            Direct access to genuine OEM components and global spare parts. 
            Reliability isn’t just an option—it’s our factory standard.
          </p>
        </div>
      </section>

      {/* 2. THE FLOATING DIAGNOSTIC CARD */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 -mt-44">
        <div className="bg-white rounded-[4rem] shadow-[0_80px_100px_-30px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100 px-10 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20 border border-amber-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/50" />
            </div>
            <div className="flex items-center gap-2">
              <Settings2 className="w-3 h-3 text-blue-600 animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">System Diagnostic: Active</span>
            </div>
          </div>
          
          <div className="p-8 md:p-16">
             <SmartSearch />
          </div>
        </div>
      </section>

      {/* 3. THE "WHY PRESTIGE" GRID */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="group flex flex-col items-center text-center">
            <div className="mb-8 p-6 bg-blue-50 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-4">Certified Genuine</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Every part is authenticated via serial tracking. No duplicates. Zero compromise on factory safety.
            </p>
          </div>

          <div className="group flex flex-col items-center text-center">
            <div className="mb-8 p-6 bg-blue-50 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:-rotate-6">
              <Zap size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-4">Rapid Logistics</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Express delivery across Malappuram and Kerala. Most parts arrive at your facility within 48 hours.
            </p>
          </div>

          <div className="group flex flex-col items-center text-center">
            <div className="mb-8 p-6 bg-blue-50 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
              <Settings2 size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-4">Expert Support</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Consult with our master technicians in Edakkara to ensure perfect factory fitment before you buy.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION STRIP */}
      <section className="mx-6 mb-24">
        <div className="max-w-7xl mx-auto bg-[#080808] rounded-[5rem] p-20 md:p-32 text-center relative overflow-hidden">
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
          
          <h2 className="relative z-10 text-5xl md:text-8xl font-black text-white tracking-tighter mb-12 uppercase italic">
            Not finding <br className="md:hidden"/> your part?
          </h2>
          
          <a 
            href="/products"
            className="group relative z-10 inline-flex items-center gap-4 bg-blue-600 text-white px-14 py-7 rounded-full font-black uppercase tracking-[0.3em] text-[11px] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40"
          >
            Explore Full Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>
      
    </div>
  );
}