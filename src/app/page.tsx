// src/app/page.tsx

import SmartSearch from "../components/home/SmartSearch";
import HeroBanner from "../components/home/HeroBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-prestige-gray flex flex-col">
      {/* 1. The striking visual header */}
      <HeroBanner />

      {/* 2. The Smart Search (pulled up slightly to overlap the black banner) */}
      <div className="max-w-6xl mx-auto px-6 w-full -mt-10 relative z-10">
        <SmartSearch />
      </div>

      {/* 3. Trust Indicators Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-prestige-blue rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🛡️</div>
            <h3 className="font-bold text-gray-900 mb-2">100% Genuine Parts</h3>
            <p className="text-gray-500 text-sm">Sourced directly from verified manufacturers. Quality guaranteed.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-prestige-blue rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Fast Dispatch</h3>
            <p className="text-gray-500 text-sm">Orders processed quickly from our Edakkara facility.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-prestige-blue rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure Checkout</h3>
            <p className="text-gray-500 text-sm">Safe, encrypted guest checkout powered by Shopify.</p>
          </div>
        </div>
      </section>
    </div>
  );
}