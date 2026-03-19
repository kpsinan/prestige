"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CreditCard,
  Truck,
  ArrowRight,
  CheckCircle2,
  MessageCircle
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* TOP ROW: Value Propositions (Trust Builders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-800/50">
          <div className="flex items-center gap-4 text-white p-5 rounded-2xl bg-gray-800/30 border border-blue-500/20 hover:border-blue-500/40 hover:bg-gray-800/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-base">Fast Dispatch</h4>
              <p className="text-gray-400 text-xs md:text-sm">Quick delivery across Kerala</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white p-5 rounded-2xl bg-gray-800/30 border border-blue-500/20 hover:border-blue-500/40 hover:bg-gray-800/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-base">Quality Assured</h4>
              <p className="text-gray-400 text-xs md:text-sm">Tested compatible parts & home gear</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white p-5 rounded-2xl bg-gray-800/30 border border-blue-500/20 hover:border-blue-500/40 hover:bg-gray-800/50 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-base">Secure Checkout</h4>
              <p className="text-gray-400 text-xs md:text-sm">100% protected payments</p>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12 border-b border-gray-800/50">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block hover:scale-[1.02] active:scale-95 transition-transform duration-200">
              <span className="text-2xl md:text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-blue-500 bg-clip-text text-transparent">PRESTIGE</span>
                <span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted destination for premium kitchen essentials and high-quality compatible aftermarket auto parts. Upgrade your lifestyle reliably.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Shop Categories</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/collections/auto-parts" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Auto Spare Parts</Link></li>
              <li><Link href="/collections/kitchen" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Kitchen & Home</Link></li>
              <li><Link href="/collections/accessories" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Tools & Maintenance</Link></li>
              <li><Link href="/collections/deals" className="text-amber-400 hover:text-amber-300 transition-colors duration-200 inline-block text-sm font-semibold">Weekly Deals</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Customer Support</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/account" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">My Account</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Track Order</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Shipping Policy</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 inline-block text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="flex flex-col gap-4 mb-8">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Malappuram District,<br />Kerala, India 679328</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>support@prestigetraders.in</span>
              </li>
            </ul>
            
            {/* Quick Contact CTA */}
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-bold mb-8 px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-lg hover:bg-green-400/20 active:scale-95 transition-all duration-200">
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            
            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="relative">
              <label htmlFor="newsletter" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                Get exclusive deals & updates
              </label>
              <div className="relative">
                <input 
                  id="newsletter"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white text-sm rounded-xl focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-4 pr-12 py-3.5 transition-all duration-300 outline-none"
                />
                <button 
                  type="submit" 
                  className={`absolute right-1 top-1 bottom-1 px-3.5 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 ${
                    isSubscribed ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20"
                  }`}
                >
                  {isSubscribed ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {isSubscribed && (
                <p className="absolute -bottom-6 left-1 text-green-400 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  Subscribed successfully! ✓
                </p>
              )}
            </form>
          </div>

        </div>

        {/* BOTTOM ROW: Legal & Copyright */}
        <div className="pt-8 flex flex-col items-center text-center gap-8">
          
          {/* Permanent Legal Disclaimer */}
          <div className="max-w-4xl p-5 rounded-2xl bg-gray-800/30 border border-gray-800/80 shadow-inner">
            <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">Legal Disclaimer:</strong> Prestige Traders supplies aftermarket and compatible replacement parts. We are not affiliated with, sponsored by, authorized by, or endorsed by Toyota Motor Corporation, Suzuki Motor Corporation, Mahindra & Mahindra Limited, or any other vehicle manufacturer. All manufacturer names, symbols, and descriptions used in our images and text are used solely for identification purposes to indicate the compatibility of our products.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
            <p className="text-gray-500 text-xs md:text-sm font-medium">
              &copy; {currentYear} Prestige Traders. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4 text-gray-500 text-xs md:text-sm font-medium">
              <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</Link>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <Link href="/terms" className="hover:text-blue-400 transition-colors duration-200">Terms of Service</Link>
            </div>

            {/* Mock Payment Icons */}
            <div className="flex items-center gap-2 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default">
              <div className="w-10 h-6 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-[8px] font-bold text-white tracking-widest hover:border-blue-500/50 transition-colors">VISA</div>
              <div className="w-10 h-6 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-[8px] font-bold text-white tracking-widest hover:border-blue-500/50 transition-colors">MC</div>
              <div className="w-10 h-6 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-[8px] font-bold text-white tracking-widest hover:border-blue-500/50 transition-colors">UPI</div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}