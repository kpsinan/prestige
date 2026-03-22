import { getAllProducts } from "../../lib/shopify";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage() {
  // 1. Fetch ALL products
  const products = await getAllProducts();

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            All Products
          </h1>
          <p className="text-gray-500 mt-3 md:text-lg">
            Browse our premium collection of automotive and home essentials.
          </p>
        </div>

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => {
            const price = product.priceRange.maxVariantPrice.amount;
            const currency = product.priceRange.maxVariantPrice.currencyCode;

            return (
              <Link 
                href={`/products/${product.handle}`} 
                key={product.id} 
                className="group flex flex-col bg-white rounded-3xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image Card */}
                <div className="bg-gray-50 rounded-2xl aspect-square relative overflow-hidden mb-4 sm:mb-5">
                  {product.images?.edges[0]?.node?.url ? (
                    <Image
                      src={product.images.edges[0].node.url}
                      alt={product.title}
                      fill
                      className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                  )}
                  
                  {!product.availableForSale && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="font-black text-[#0a2540] text-lg sm:text-xl mt-auto">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: currency,
                      maximumFractionDigits: 0
                    }).format(Number(price))}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}