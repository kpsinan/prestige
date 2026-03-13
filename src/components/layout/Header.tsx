// src/components/layout/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 group">
            PRESTIGE<span className="text-blue-600 group-hover:text-blue-700 transition-colors">TRADERS</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/products" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
            >
              Shop All Parts
            </Link>
          </nav>
        </div>

        {/* Right: Trust Badges & Contact */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Established</span>
            <span className="text-xs font-bold text-gray-900">SINCE 2009</span>
          </div>
          
          <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden lg:flex">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Location</span>
              <span className="text-xs font-bold text-gray-900">EDAKKARA, KL</span>
            </div>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg shadow-black/10">
              <span className="text-white text-[10px] font-bold">IN</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}