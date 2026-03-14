import SmartSearch from "../components/home/SmartSearch";
import { ShieldCheck, Zap, Settings2, ArrowRight } from "lucide-react"; 

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      
      {/* 1. THE CINEMATIC HERO SECTION */}
      <section className="relative bg-[#0B0F19] pt-24 pb-48 md:pt-32 md:pb-64 px-4 overflow-hidden">
        {/* Advanced Background Visuals */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_-20%,_#2563EB,_transparent)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[grid-white_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 mb-8 md:mb-12 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60A5FA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
            </span>
            <span className="text-[8px] md:text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] md:tracking-[0.4em]">
              Precision Sourced • Edakkara
            </span>
          </div>

          {/* Bulletproof Hex Gradient Typography */}
          <h1 className="text-5xl sm:text-7xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.9] md:leading-[0.8] mb-8 md:mb-12 uppercase italic">
            Engineered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#818CF8]">
              Prestige.
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-[#6B7280] text-sm md:text-lg font-medium leading-relaxed opacity-90 px-4">
            Direct access to genuine OEM components and global spare parts. 
            Reliability isn’t just an option—it’s our factory standard.
          </p>
        </div>
      </section>

      {/* 2. THE FLOATING DIAGNOSTIC CARD */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 -mt-24 md:-mt-44">
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-[#6B7280]/10 overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-[#F9FAFB]/90 backdrop-blur-md border-b border-[#6B7280]/10 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-400/50 border border-red-400/20" />
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-400/50 border border-amber-400/20" />
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-400/50 border border-green-400/20" />
            </div>
            <div className="flex items-center gap-2">
              <Settings2 className="w-3 h-3 text-[#2563EB] animate-spin-slow" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                System Diagnostic: Active
              </span>
            </div>
          </div>
          
          <div className="p-6 md:p-16">
             <SmartSearch />
          </div>
        </div>
      </section>

      {/* 3. THE "WHY PRESTIGE" GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {[
            { Icon: ShieldCheck, title: "Certified Genuine", text: "Every part is authenticated via serial tracking. No duplicates. Zero compromise on factory safety." },
            { Icon: Zap, title: "Rapid Logistics", text: "Express delivery across Malappuram and Kerala. Most parts arrive at your facility within 48 hours." },
            { Icon: Settings2, title: "Expert Support", text: "Consult with our master technicians in Edakkara to ensure perfect factory fitment before you buy." }
          ].map((item, i) => (
            <div key={i} className="group flex flex-col items-center text-center">
              <div className="mb-6 p-5 md:p-6 bg-[#2563EB]/5 border border-[#2563EB]/10 rounded-2xl md:rounded-3xl hover:bg-[#2563EB] hover:border-[#2563EB] transition-all duration-500 hover:scale-110 shadow-sm hover:shadow-xl hover:shadow-[#2563EB]/20">
                <item.Icon size={32} className="md:w-[40px] md:h-[40px] text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-[#0B0F19] mb-3 md:mb-4">{item.title}</h3>
              <p className="text-[#0B0F19]/70 text-xs md:text-sm leading-relaxed font-medium max-w-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION STRIP */}
      <section className="px-4 md:px-6 mb-16 md:mb-24">
        <div className="max-w-7xl mx-auto bg-[#0B0F19] rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl">
          
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-[#2563EB]/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-[#60A5FA]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
          
          <h2 className="relative z-10 text-4xl md:text-8xl font-black text-white tracking-tighter mb-8 md:mb-12 uppercase italic">
            Not finding <br className="md:hidden"/> your part?
          </h2>
          
          <a 
            href="/products"
            className="group relative z-10 inline-flex items-center gap-3 md:gap-4 bg-[#2563EB] text-white px-8 py-4 md:px-14 md:py-7 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[11px] hover:bg-[#60A5FA] transition-all duration-300 shadow-2xl shadow-[#2563EB]/40 hover:shadow-[#60A5FA]/50 hover:-translate-y-1"
          >
            Explore Full Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>
      
    </div>
  );
}