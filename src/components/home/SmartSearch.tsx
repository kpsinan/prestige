// src/components/home/SmartSearch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { VEHICLE_HIERARCHY } from "../../lib/constants";

type BrandKey = keyof typeof VEHICLE_HIERARCHY;

export default function SmartSearch() {
  const [selectedBrand, setSelectedBrand] = useState<BrandKey | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const brands = Object.keys(VEHICLE_HIERARCHY) as BrandKey[];
  const currentBrandData = selectedBrand ? VEHICLE_HIERARCHY[selectedBrand] : null;
  const models = currentBrandData ? Object.keys(currentBrandData.models) : [];
  
  const parts = (selectedBrand && selectedModel && currentBrandData) 
    ? (currentBrandData.models as any)[selectedModel] || []
    : [];

  return (
    <div className="w-full">
      {/* STEP 1: MANUFACTURER */}
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md">01</span>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Select Manufacturer
          </label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => { setSelectedBrand(brand); setSelectedModel(null); }}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-500 ${
                selectedBrand === brand 
                ? "border-blue-600 bg-blue-50/40 shadow-xl shadow-blue-900/5 scale-105" 
                : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white hover:scale-[1.02]"
              }`}
            >
              <div className="relative w-16 h-16 mb-5">
                <Image 
                  src={VEHICLE_HIERARCHY[brand].logo} 
                  alt={brand} 
                  fill 
                  className={`object-contain transition-all duration-700 ${
                    selectedBrand === brand ? "scale-110" : "grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100"
                  }`}
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedBrand === brand ? "text-blue-600" : "text-gray-400"}`}>
                {brand}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: MODEL SELECTION */}
      {selectedBrand && (
        <div className="px-4 md:px-10 py-10 bg-[#F9FAFB] border-y border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-md">02</span>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Select {selectedBrand} Model
            </label>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedModel === model 
                  ? "bg-black text-white shadow-2xl shadow-black/20 scale-105" 
                  : "bg-white text-gray-500 border border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: PARTS LIST */}
      {selectedModel && (
        <div className="p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md">03</span>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Compatible Components
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {parts.map((part: any) => (
              <Link 
                href={`/products/${part.handle}`} 
                key={part.handle}
                className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <span className="text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform">⚙️</span>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{part.name}</h4>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Authentic Component</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <span className="text-xl">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}