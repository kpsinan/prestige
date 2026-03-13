// src/components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tighter">
              PRESTIGE<span className="text-blue-500">TRADERS</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Directly sourcing high-performance, genuine spare parts for global automotive brands. Quality verified at our Kerala headquarters.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Navigation</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-sm text-gray-300 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Vehicle Search</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Contact</h3>
            <p className="text-sm text-gray-300">
              Edakkara, Malappuram<br />
              Kerala, India
            </p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Open: Mon — Sat, 9AM — 7PM
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Prestige Traders. Genuine Parts Guaranteed.
          </p>
          <div className="flex gap-4">
            <span className="h-1 w-8 bg-blue-600 rounded-full"></span>
            <span className="h-1 w-8 bg-gray-800 rounded-full"></span>
            <span className="h-1 w-8 bg-gray-800 rounded-full"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}