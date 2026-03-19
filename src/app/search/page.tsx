import { searchProducts } from "../../lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // 1. Await the search parameters (Next.js 15 requirement)
  const { q } = await searchParams;
  const searchQuery = q || "";

  // 2. Fetch the results from Shopify
  const products = searchQuery ? await searchProducts(searchQuery) : [];

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Search Results
          </h1>
          {searchQuery && (
            <p className="text-gray-500 mt-3 md:text-lg">
              Showing results for <span className="font-bold text-gray-900">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Empty State: No Products Found */}
        {products.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              We couldn't find anything matching "{searchQuery}". Try checking your spelling or using more general terms.
            </p>
            <Link 
              href="/products" 
              className="bg-[#0a2540] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#001428] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Product Grid */}
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
                </div>

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