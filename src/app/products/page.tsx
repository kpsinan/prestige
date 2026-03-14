import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "../../lib/shopify";

// 1. Added TypeScript interfaces to replace 'any' for better developer experience and safety
interface ShopifyImage {
  node: {
    url: string;
  };
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ShopifyImage[];
  };
}

export default async function AllProductsPage() {
  const products: ShopifyProduct[] = await getAllProducts();

  // 2. Graceful fallback if the Shopify fetch fails or returns empty
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-xl text-[#6B7280] font-medium">Inventory is currently being updated.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      
      {/* Dynamic Header Section */}
      <section className="bg-white border-b border-[#6B7280]/10 pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#2563EB]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/20 mb-6 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]">
                Complete Inventory
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-[#0B0F19] tracking-tighter mb-4 uppercase leading-[0.9] italic">
              Genuine <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">Spare Parts.</span>
            </h1>
          </div>
          
          <p className="text-[#6B7280] max-w-sm text-sm md:text-base font-medium leading-relaxed pb-2">
            Sourced directly for performance and reliability. Every component in our <strong className="text-[#0B0F19]">{products.length} product catalog</strong> is verified for fitment.
          </p>
        </div>
      </section>

      {/* Product Gallery */}
      <div className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => {
            const price = product.priceRange.maxVariantPrice.amount;
            const currency = product.priceRange.maxVariantPrice.currencyCode;
            const imageUrl = product.images.edges[0]?.node.url;

            return (
              <Link 
                href={`/products/${product.handle}`} 
                key={product.id}
                // 3. Added focus states for accessibility
                className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-4 rounded-2xl"
              >
                {/* Image Card */}
                <div className="aspect-square relative bg-white rounded-[2rem] border border-[#6B7280]/10 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-[#2563EB]/20 group-hover:border-[#2563EB]/30 group-hover:-translate-y-2 transition-all duration-500">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={`View details for ${product.title}`} 
                      fill 
                      // 4. Added sizes and priority for Next.js Image optimization
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={index < 4} // Loads the first row immediately (LCP improvement)
                      className="object-contain p-10 transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-50 text-[#6B7280]/40 font-bold uppercase tracking-widest text-xs">
                      No Preview
                    </div>
                  )}
                  
                  {/* Subtle gradient overlay on hover to make badge pop */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/0 group-hover:to-black/5 transition-colors duration-500 pointer-events-none" />

                  {/* 5. Added z-index to ensure badge stays above image */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#6B7280]/10 text-[#0B0F19] shadow-sm">
                      Genuine
                    </span>
                  </div>
                </div>

                {/* Product Detail */}
                <div className="mt-6 px-2">
                  {/* 6. Changed h3 to h2 for proper semantic heading hierarchy */}
                  <h2 className="text-sm font-black text-[#0B0F19] uppercase tracking-tight line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                    {product.title}
                  </h2>
                  <div className="flex items-center justify-between mt-3 overflow-hidden">
                    <p className="text-lg font-bold text-[#0B0F19]">
                      {/* 7. Wrapped 'price' in Number() to prevent formatting errors */}
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(price))}
                    </p>
                    {/* 8. Added aria-hidden to decorative arrow */}
                    <span aria-hidden="true" className="text-[10px] font-black text-[#2563EB] flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      VIEW PART <span className="text-[14px] leading-none">→</span>
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