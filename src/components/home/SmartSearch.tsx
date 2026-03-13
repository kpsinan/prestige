"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Settings2, CheckCircle2, Cpu } from "lucide-react";
import { VEHICLE_HIERARCHY } from "../../lib/constants";

type BrandKey = keyof typeof VEHICLE_HIERARCHY;

export default function SmartSearch() {
  const [selectedBrand, setSelectedBrand] = useState<BrandKey | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const brands = Object.keys(VEHICLE_HIERARCHY) as BrandKey[];

  const models = useMemo(() => 
    selectedBrand ? Object.keys(VEHICLE_HIERARCHY[selectedBrand].models) : []
  , [selectedBrand]);

  const parts = useMemo(() => 
    (selectedBrand && selectedModel) 
      ? (VEHICLE_HIERARCHY[selectedBrand].models as any)[selectedModel] || []
      : []
  , [selectedBrand, selectedModel]);

  return (
    <div className="w-full space-y-16">
      
      {/* STEP 1: MANUFACTURER SELECTION */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <span className="flex-none bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">01</span>
          <h2 className="flex-none text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
            Select Manufacturer
          </h2>
          <div className="h-px w-full bg-gray-100" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => { setSelectedBrand(brand); setSelectedModel(null); }}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
                selectedBrand === brand 
                ? "border-blue-600 bg-blue-50/30 shadow-2xl shadow-blue-900/5 scale-105" 
                : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white hover:scale-[1.02]"
              }`}
            >
              <div className="relative w-16 h-16 mb-5 transition-transform duration-500 group-hover:scale-110">
                <Image 
                  src={VEHICLE_HIERARCHY[brand].logo} 
                  alt={brand} 
                  fill 
                  className={`object-contain transition-all duration-700 ${
                    selectedBrand === brand ? "grayscale-0 opacity-100" : "grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100"
                  }`}
                />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${selectedBrand === brand ? "text-blue-600" : "text-gray-400"}`}>
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
      </section>

      {/* STEP 2: MODEL SELECTION */}
      <AnimatePresence mode="wait">
        {selectedBrand && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pt-10 border-t border-gray-100"
          >
            <div className="flex items-center gap-4 mb-10">
              <span className="flex-none bg-black text-white text-[10px] font-black px-3 py-1 rounded-full">02</span>
              <h2 className="flex-none text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Select {selectedBrand} Series
              </h2>
              <div className="h-px w-full bg-gray-100" />
            </div>
            
            <div className="flex flex-wrap gap-4">
              {models.map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    selectedModel === model 
                    ? "bg-black text-white shadow-2xl shadow-black/20 scale-110" 
                    : "bg-white text-gray-500 border border-gray-100 hover:border-black hover:text-black"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* STEP 3: RESULTS */}
      <AnimatePresence>
        {selectedModel && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-10 border-t border-gray-100"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">03</span>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                  Compatible Components
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2">
                 <Settings2 className="w-3 h-3 text-blue-600 animate-spin-slow" />
                 <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{parts.length} verified matches</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {parts.map((part: any, index: number) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={part.handle}
                >
                  <Link 
                    href={`/products/${part.handle}`} 
                    className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                        <Cpu className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:rotate-12 transition-all" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                          {part.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">In Stock • Genuine Fit</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}