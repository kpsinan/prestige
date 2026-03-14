"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Settings2, CheckCircle2, Cpu, Search, X } from "lucide-react";
import { VEHICLE_HIERARCHY } from "../../lib/constants";

type BrandKey = keyof typeof VEHICLE_HIERARCHY;
type PartType = { handle: string; name: string };

// 🛠️ BUG FIX: Moved the Search Bar component OUTSIDE the main component 
// so React doesn't destroy and recreate it on every keystroke!
const StepSearchBar = ({ 
  placeholder, 
  value, 
  onChange 
}: { 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
}) => (
  <div className="relative w-full max-w-md mb-6 group">
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
      <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50/80 border border-gray-100 rounded-xl py-3 pl-10 pr-10 text-xs md:text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all focus:shadow-lg focus:shadow-blue-900/5"
    />
    <AnimatePresence>
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4 bg-gray-200 rounded-full p-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

export default function SmartSearch() {
  // Selection States
  const [selectedBrand, setSelectedBrand] = useState<BrandKey | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Individual Search States
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [partSearch, setPartSearch] = useState("");

  // Base Data arrays
  const allBrands = Object.keys(VEHICLE_HIERARCHY) as BrandKey[];

  const allModels = useMemo(() => 
    selectedBrand ? Object.keys(VEHICLE_HIERARCHY[selectedBrand].models) : []
  , [selectedBrand]);

  const allParts = useMemo(() => 
    (selectedBrand && selectedModel) 
      ? (VEHICLE_HIERARCHY[selectedBrand].models as any)[selectedModel] || []
      : []
  , [selectedBrand, selectedModel]);

  // Filtered Arrays based on individual search bars
  const filteredBrands = useMemo(() => 
    allBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
  , [allBrands, brandSearch]);

  const filteredModels = useMemo(() => 
    allModels.filter(m => m.toLowerCase().includes(modelSearch.toLowerCase()))
  , [allModels, modelSearch]);

  const filteredParts = useMemo(() => 
    allParts.filter((p: PartType) => p.name.toLowerCase().includes(partSearch.toLowerCase()))
  , [allParts, partSearch]);

  // Reset handlers to keep UI clean when changing upper-level selections
  const handleBrandSelect = (brand: BrandKey) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setModelSearch("");
    setPartSearch("");
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setPartSearch("");
  };

  return (
    <div className="w-full space-y-12 md:space-y-16">
      
      {/* STEP 1: MANUFACTURER */}
      <section>
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <span className="flex-none bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">01</span>
          <h2 className="flex-none text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
            Select Manufacturer
          </h2>
          <div className="h-px w-full bg-gray-100" />
        </div>

        {/* Step 1 Search */}
        <StepSearchBar 
          placeholder="Filter manufacturers..." 
          value={brandSearch} 
          onChange={setBrandSearch} 
        />
        
        {filteredBrands.length === 0 ? (
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest py-8">No manufacturers found matching &quot;{brandSearch}&quot;</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {filteredBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandSelect(brand)}
                className={`group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500 ${
                  selectedBrand === brand 
                  ? "border-blue-600 bg-blue-50/30 scale-105 shadow-xl shadow-blue-900/5" 
                  : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                }`}
              >
                <div className="relative w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-5">
                  <Image 
                    src={VEHICLE_HIERARCHY[brand].logo} 
                    alt={brand} 
                    fill 
                    className={`object-contain transition-all duration-700 ${
                      selectedBrand === brand ? "grayscale-0 opacity-100" : "grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] ${selectedBrand === brand ? "text-blue-600" : "text-gray-400"}`}>
                  {brand}
                </span>
                {selectedBrand === brand && (
                  <motion.div layoutId="active-dot" className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1.5 shadow-lg">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* STEP 2: MODEL SELECTION */}
      <AnimatePresence mode="wait">
        {selectedBrand && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 md:pt-10 border-t border-gray-100"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <span className="flex-none bg-black text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full">02</span>
              <h2 className="flex-none text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Select {selectedBrand} Series
              </h2>
              <div className="h-px w-full bg-gray-100" />
            </div>

            {/* Step 2 Search */}
            <StepSearchBar 
              placeholder={`Filter ${selectedBrand} series...`} 
              value={modelSearch} 
              onChange={setModelSearch} 
            />
            
            {filteredModels.length === 0 ? (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest py-4">No series found matching &quot;{modelSearch}&quot;</p>
            ) : (
              <div className="flex flex-wrap gap-3 md:gap-4">
                {filteredModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleModelSelect(model)}
                    className={`px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      selectedModel === model 
                      ? "bg-black text-white scale-105 shadow-xl shadow-black/20" 
                      : "bg-white text-gray-500 border border-gray-100 hover:border-black hover:text-black"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* STEP 3: RESULTS */}
      <AnimatePresence>
        {selectedModel && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 md:pt-10 border-t border-gray-100"
          >
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <span className="bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full shadow-lg">03</span>
                <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">
                  Compatible Components
                </h2>
                <div className="h-px w-full bg-gray-100 md:hidden" />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Settings2 className="w-3 h-3 text-blue-600 animate-spin-slow" />
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{filteredParts.length} verified matches</span>
              </div>
            </div>

            {/* Step 3 Search */}
            <StepSearchBar 
              placeholder="Search specific components..." 
              value={partSearch} 
              onChange={setPartSearch} 
            />

            {filteredParts.length === 0 ? (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest py-4">No components found matching &quot;{partSearch}&quot;</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {filteredParts.map((part: PartType, index: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={part.handle}
                  >
                    <Link 
                      href={`/products/${part.handle}`} 
                      className="group flex items-center justify-between p-5 md:p-6 bg-white border border-gray-100 rounded-2xl md:rounded-[2rem] hover:border-blue-600 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-gray-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                          <Cpu className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white group-hover:rotate-12 transition-all" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-xs md:text-sm text-gray-900 uppercase truncate group-hover:text-blue-600 transition-colors">
                            {part.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest">In Stock</p>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}