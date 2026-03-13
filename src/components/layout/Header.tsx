// src/components/layout/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-prestige-black hover:opacity-80 transition-opacity">
          PRESTIGE<span className="text-prestige-blue">TRADERS</span>
        </Link>
        
        <div className="flex gap-4 items-center">
          <span className="hidden sm:inline-block text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            EST. 2009
          </span>
          <div className="h-10 px-4 bg-prestige-black text-white rounded-full flex items-center justify-center text-sm font-semibold hover:bg-gray-800 transition-colors cursor-default">
             Kerala, IN
          </div>
        </div>
      </div>
    </header>
  );
}