"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Added for logo support
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  MapPin,
  ChevronDown
} from "lucide-react";
import SearchBar from "../SearchBar";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const pathname = usePathname();

  // Track scroll position for shrinking/glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers to prevent menu and search from being open at the same time
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsMobileMenuOpen(false);
  };

  // E-commerce Navigation Links
  const navLinks = [
    { name: "Home", href: "/", hasDropdown: false },
    { name: "Auto Parts", href: "/collections/auto-parts", hasDropdown: true },
    { name: "Kitchen & Home", href: "/collections/kitchen", hasDropdown: true },
    { name: "Today's Deals", href: "/collections/deals", hasDropdown: false, isHighlight: true },
  ];

  // Framer Motion Variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    show: { 
      opacity: 1, 
      height: "auto",
      transition: { staggerChildren: 0.06, duration: 0.3, ease: "easeInOut" as const }
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-blue-900 text-white px-4 py-2 text-center text-[11px] md:text-xs font-medium flex items-center justify-center tracking-wide">
        <span className="text-amber-400 font-extrabold mr-2">SALE:</span> 
        Up to 30% off on compatible auto parts and kitchen essentials. 
        <Link href="/collections/deals" className="underline ml-2 hover:text-blue-200 transition-colors">Shop Now</Link>
      </div>

      {/* MAIN STICKY HEADER */}
      <header 
        className={`sticky top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] py-1" 
            : "bg-white border-b border-gray-100 py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          
          {/* HEADER ROW 1: Branding, Search, Actions */}
          <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8 transition-all duration-500 ease-in-out">
            
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full hover:text-blue-600 transition-all active:scale-95"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <Link 
                href="/" 
                className="relative z-50 flex items-center transition-transform hover:scale-[1.02] active:scale-95"
                onClick={() => { setIsMobileMenuOpen(false); setIsMobileSearchOpen(false); }}
              >
                {/* Logo Image instead of Text */}
<Image 
  src="/logo.svg" 
  alt="Prestige Logo" 
  width={200} // Increased base width for better resolution
  height={60} // Increased base height
  className="h-12 md:h-16 w-auto object-contain" // Adjusted Tailwind classes
  priority
/>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl justify-center z-50">
              <SearchBar />
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 relative z-50">
              
              {/* Mobile Search Toggle Button */}
              <button 
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 group transition-colors rounded-xl hover:bg-blue-50/50 active:scale-95"
                aria-label="Toggle Search"
              >
                {isMobileSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
              </button>

              <Link href="/account" className="hidden md:flex flex-col items-center gap-0.5 text-gray-600 hover:text-blue-600 group transition-colors p-2 rounded-xl hover:bg-blue-50/50 active:scale-95">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] font-bold">Sign In</span>
              </Link>

              <Link href="/wishlist" className="hidden md:flex flex-col items-center gap-0.5 text-gray-600 hover:text-blue-600 group transition-colors p-2 rounded-xl hover:bg-blue-50/50 active:scale-95">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] font-bold">Wishlist</span>
              </Link>

              {/* Enhanced Cart Icon */}
              <Link href="/cart" className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-blue-600 group transition-colors p-2 rounded-xl hover:bg-blue-50/50 active:scale-95">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 sm:w-6 sm:h-6 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300" />
                  
                  {/* Static Prominent Cart Badge */}
                  <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                    2
                  </span>
                </div>
                <span className="text-[10px] font-bold hidden md:block mt-0.5">Cart</span>
              </Link>
            </div>
          </div>

          {/* MOBILE SEARCH SLIDE-DOWN */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="md:hidden absolute left-0 right-0 top-full bg-white px-4 py-4 border-b border-gray-100 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] z-[100]"
              >
                <SearchBar onClose={() => setIsMobileSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* HEADER ROW 2: Desktop Navigation Bar */}
          <div 
            className={`hidden md:block overflow-hidden transition-all duration-500 ease-in-out ${
              isScrolled ? "max-h-0 opacity-0 -translate-y-2" : "max-h-16 opacity-100 translate-y-0"
            }`}
          >
            <nav className="flex items-center gap-8 h-12 border-t border-gray-100">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group relative flex items-center gap-1.5 text-[13px] font-bold transition-colors py-3"
                  >
                    <span className={`${link.isHighlight ? "text-red-600 group-hover:text-red-700" : isActive ? "text-blue-600" : "text-gray-600 group-hover:text-gray-900"}`}>
                      {link.name}
                    </span>
                    
                    {link.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900 group-hover:rotate-180"}`} />
                    )}

                    <span className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'} ${link.isHighlight ? 'bg-red-600' : ''}`} />
                  </Link>
                );
              })}
              
              <div className="ml-auto flex items-center gap-2 text-[11px] font-bold text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-gray-900 cursor-pointer transition-all active:scale-95 group">
                <MapPin className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                Delivering to <span className="text-gray-900 underline decoration-gray-300 group-hover:decoration-gray-900 transition-colors">Kerala</span>
              </div>
            </nav>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] overflow-hidden absolute w-full z-40"
            >
              <div className="px-4 py-4 space-y-4">
                
                <div className="flex flex-col gap-2 pb-6 border-b border-gray-100 mt-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div key={link.name} variants={mobileItemVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all active:scale-[0.98] ${
                            isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className={link.isHighlight ? "text-red-600" : ""}>{link.name}</span>
                          {link.hasDropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div variants={mobileItemVariants} className="flex items-center justify-around pt-2 pb-4 text-gray-600">
                  <Link href="/account" className="flex flex-col items-center gap-1.5 hover:text-blue-600 active:scale-95 transition-transform">
                    <div className="p-3 bg-gray-50 rounded-full"><User className="w-5 h-5" /></div>
                    <span className="text-[11px] font-bold">Account</span>
                  </Link>
                  <Link href="/wishlist" className="flex flex-col items-center gap-1.5 hover:text-blue-600 active:scale-95 transition-transform">
                    <div className="p-3 bg-gray-50 rounded-full"><Heart className="w-5 h-5" /></div>
                    <span className="text-[11px] font-bold">Wishlist</span>
                  </Link>
                  <div className="flex flex-col items-center gap-1.5 hover:text-blue-600 active:scale-95 transition-transform cursor-pointer">
                    <div className="p-3 bg-gray-50 rounded-full"><MapPin className="w-5 h-5 text-blue-500" /></div>
                    <span className="text-[11px] font-bold">Location</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}