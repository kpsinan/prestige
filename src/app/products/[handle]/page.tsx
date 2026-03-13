// src/app/products/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "../../../lib/shopify"; // Fixed Relative Path

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Dynamic Header Section */}
      <section className="bg-white border-b border-gray-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Complete Inventory</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Genuine Spare Parts
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
            Sourced directly for performance and reliability. Every component in our {products.length} product catalog is verified for fitment.
          </p>
        </div>
      </section>

      {/* Product Gallery */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product: any) => {
            const price = product.priceRange.maxVariantPrice.amount;
            const currency = product.priceRange.maxVariantPrice.currencyCode;
            const imageUrl = product.images.edges[0]?.node.url;

            return (
              <Link 
                href={`/products/${product.handle}`} 
                key={product.id}
                className="group flex flex-col"
              >
                {/* Image Card */}
                <div className="aspect-square relative bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-900/10 group-hover:-translate-y-2 transition-all duration-500">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={product.title} 
                      fill 
                      className="object-contain p-10 transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 font-bold uppercase tracking-widest text-xs">No Preview</div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                      Genuine
                    </span>
                  </div>
                </div>

                {/* Product Detail */}
                <div className="mt-6 px-2">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-gray-900">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(price)}
                    </p>
                    <span className="text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      VIEW PART →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}