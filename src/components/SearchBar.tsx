"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { getSearchSuggestions } from "../actions/search";
import Image from "next/image";
import Link from "next/link";

interface SearchBarProps {
  onClose?: () => void; // Added so it can close the mobile header when clicked
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        setShowDropdown(true);
        const results = await getSearchSuggestions(searchQuery);
        setSuggestions(results);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      onClose?.(); // Close mobile header
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    // REMOVED "hidden md:block" so it works on mobile
    <div className="relative w-full" ref={dropdownRef}>
      
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
          placeholder="Search for products, parts..."
          className="w-full bg-gray-50 text-gray-900 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-4 pr-12 outline-none transition-all text-sm font-medium placeholder:text-gray-400 shadow-sm"
        />
        <button 
          type="submit" 
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#0a2540] text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          
          {suggestions.length > 0 ? (
            <div className="flex flex-col">
              <div className="max-h-[320px] overflow-y-auto">
                {suggestions.map((product) => (
                  <Link 
                    href={`/products/${product.handle}`} 
                    key={product.id}
                    onClick={() => {
                      setShowDropdown(false);
                      onClose?.(); // Close mobile header
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                  >
                    <div className="w-12 h-12 relative bg-white rounded-lg border border-gray-100 shrink-0 overflow-hidden">
                      {product.images?.edges[0]?.node?.url ? (
                        <Image src={product.images.edges[0].node.url} alt={product.title} fill className="object-cover" />
                      ) : (
                        <Search className="w-4 h-4 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.priceRange.maxVariantPrice.currencyCode, maximumFractionDigits: 0 }).format(Number(product.priceRange.maxVariantPrice.amount))}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <button 
                onClick={() => handleSearch()}
                className="w-full bg-gray-50 p-3 text-xs font-bold text-[#0a2540] hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 border-t border-gray-100"
              >
                View all results for "{searchQuery}" <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            !isSearching && (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 font-medium">No products found for "{searchQuery}"</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}