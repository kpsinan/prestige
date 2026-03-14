import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2563EB]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Address */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-2xl font-black text-white tracking-tighter uppercase italic mb-6">
              Prestige<span className="text-[#2563EB]">.</span>
            </Link>
            <p className="text-[#6B7280] text-sm md:text-base leading-relaxed font-medium max-w-sm mb-8">
              Direct access to genuine OEM components and global spare parts. Reliability isn’t just an option—it’s our factory standard.
            </p>
            <div className="flex items-start gap-3 text-[#6B7280]">
              <MapPin className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed uppercase tracking-wider text-white/80">
                PALATHINGAL VP I/171G<br />
                MUNDA, MUNDA<br />
                VAZHIKKADAVU, Kerala
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Inventory</h3>
            <ul className="space-y-4">
              {[
                { name: "Full Catalog", href: "/products" },
                { name: "OEM Parts", href: "/products" },
                { name: "Track Order", href: "#" },
                { name: "Return Policy", href: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="group flex items-center text-[#6B7280] hover:text-[#60A5FA] text-sm font-bold transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Socials */}
          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Connect</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <a href="tel:+910000000000" className="flex items-center gap-3 text-[#6B7280] hover:text-white text-sm font-bold transition-colors">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  +91 (Call Support)
                </a>
              </li>
              <li>
                <a href="mailto:support@prestigetraders.com" className="flex items-center gap-3 text-[#6B7280] hover:text-white text-sm font-bold transition-colors">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  Support Email
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#6B7280] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#6B7280] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#6B7280] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest text-center md:text-left">
            © {currentYear} Prestige Traders. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#6B7280] text-[10px] font-black uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}