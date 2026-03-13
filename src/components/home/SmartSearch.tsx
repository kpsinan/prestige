// src/components/home/SmartSearch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { VEHICLE_HIERARCHY } from "../../lib/constants";

// Type definition to keep TypeScript happy
type BrandKey = keyof typeof VEHICLE_HIERARCHY;

export default function SmartSearch() {
  const [selectedBrand, setSelectedBrand] = useState<BrandKey | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const brands = Object.keys(VEHICLE_HIERARCHY) as BrandKey[];
  
  const currentBrandData = selectedBrand ? VEHICLE_HIERARCHY[selectedBrand] : null;
  const models = currentBrandData ? Object.keys(currentBrandData.models) : [];
  
  // Safely extract parts based on the selected model
  const parts = (selectedBrand && selectedModel && currentBrandData) 
    ? (currentBrandData.models as any)[selectedModel] || []
    : [];

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden">
      {/* STEP 1: BRAND LOGOS */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">01</span>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Select Manufacturer
          </label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => { setSelectedBrand(brand); setSelectedModel(null); }}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedBrand === brand 
                ? "border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-900/5" 
                : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
              }`}
            >
              <div className="relative w-12 h-12 mb-3">
                <Image 
                  src={VEHICLE_HIERARCHY[brand].logo} 
                  alt={brand} 
                  fill 
                  className={`object-contain transition-all duration-500 ${selectedBrand === brand ? "scale-110" : "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"}`}
                />
              </div>
              <span className={`text-sm font-bold tracking-tight ${selectedBrand === brand ? "text-blue-600" : "text-gray-500"}`}>
                {brand}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: MODEL SELECTION */}
      {selectedBrand && (
        <div className="px-6 md:px-8 py-8 bg-gray-50/50 border-y border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">02</span>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Select {selectedBrand} Model
            </label>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedModel === model 
                  ? "bg-black text-white shadow-xl shadow-black/20 scale-105" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: PARTS RESULTS */}
      {selectedModel && (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">03</span>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Available Parts for {selectedModel}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parts.map((part: any) => (
              <Link 
                href={`/products/${part.handle}`} 
                key={part.handle}
                className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <span className="text-xl group-hover:scale-110 transition-transform">⚙️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{part.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Verified Genuine</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <span className="text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}