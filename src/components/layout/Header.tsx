// src/components/layout/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-gray-900 group">
            PRESTIGE<span className="text-blue-600 group-hover:text-blue-700 transition-colors">TRADERS</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/products" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
            >
              Inventory
            </Link>
          </nav>
        </div>

        {/* Right: Technical Stats */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-900">EDAKKARA HUB</span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1.5 rounded-full tracking-widest">
               EST. 2009
             </span>
          </div>
        </div>

      </div>
    </header>
  );
}