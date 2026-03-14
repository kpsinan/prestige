"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll position to trigger the shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/products" },
    { name: "About Us", href: "#" }, 
    { name: "Contact", href: "#" },
  ];

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-[#0B0F19]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-0" 
          : "bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/5 py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link 
          href="/" 
          className="relative z-50 text-xl font-black text-white tracking-tighter uppercase italic"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Prestige<span className="text-[#2563EB]">.</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? "text-[#60A5FA]" : "text-[#6B7280] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA (Call to Action) */}
        <div className="hidden md:block relative z-50">
          <Link 
            href="/products"
            className="group flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-[#2563EB] hover:border-[#2563EB] text-white px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-[9px] transition-all duration-300"
          >
            Find Parts
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON (The Three Lines) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative z-50 md:hidden p-2 text-white hover:text-[#60A5FA] transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="absolute top-full left-0 w-full bg-[#0B0F19] border-b border-[#2563EB]/20 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-lg font-black uppercase tracking-widest transition-colors ${
                        isActive ? "text-[#60A5FA]" : "text-white hover:text-[#2563EB]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Mobile CTA */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="pt-6 mt-2 border-t border-white/5"
              >
                <Link 
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 w-full bg-[#2563EB] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#60A5FA] transition-all shadow-xl shadow-[#2563EB]/20"
                >
                  Explore Full Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}