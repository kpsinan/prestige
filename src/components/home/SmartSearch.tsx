// src/components/home/SmartSearch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { VEHICLE_HIERARCHY, Brand } from "../../lib/constants"; // Changed to relative path

// We tell TypeScript exactly what a "Part" looks like
type Part = {
  name: string;
  handle: string;
};

export default function SmartSearch() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const brands = Object.keys(VEHICLE_HIERARCHY) as Brand[];
  const models = selectedBrand ? Object.keys(VEHICLE_HIERARCHY[selectedBrand]) : [];
  
  // Typecasting the parts array so TypeScript knows what it is handling
  const parts: Part[] = selectedBrand && selectedModel 
    ? (VEHICLE_HIERARCHY[selectedBrand][selectedModel as keyof typeof VEHICLE_HIERARCHY[typeof selectedBrand]] as Part[]) 
    : [];

  const handleBrandClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null); 
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Parts For Your Vehicle</h2>

      {/* STEP 1: Select Brand */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">1. Select Brand</h3>
        <div className="flex gap-3 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedBrand === brand
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Select Model */}
      {selectedBrand && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">2. Select Model</h3>
          <div className="flex gap-3 flex-wrap">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedModel === model
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Available Parts */}
      {selectedModel && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 border-t pt-6 mt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">3. Available Parts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Now TypeScript knows that 'part' has a .handle and .name */}
            {parts.map((part) => (
              <Link 
                href={`/products/${part.handle}`} 
                key={part.handle}
                className="group flex flex-col justify-between p-4 border rounded-lg hover:border-black hover:shadow-md transition-all"
              >
                <span className="font-semibold text-gray-800 group-hover:text-black">{part.name}</span>
                <span className="text-sm text-blue-600 mt-2 font-medium">View Details →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}