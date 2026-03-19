import { getProduct } from "../../../lib/shopify";
import { notFound } from "next/navigation";
import AddToCart from "../../../components/AddToCart";
import ProductGallery from "../../../components/ProductGallery"; 

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  // 1. Await params (Next.js 15+ requirement)
  const { handle } = await params;
  
  // 2. Fetch the single product from Shopify
  const product = await getProduct(handle);

  // 3. Handle 404 if product doesn't exist
  if (!product) {
    notFound();
  }

  // 4. Safely extract required data
  const variantId = product.variants?.edges[0]?.node?.id;
  const price = product.priceRange.maxVariantPrice.amount;
  const currency = product.priceRange.maxVariantPrice.currencyCode;

  return (
    // pb-36 ensures mobile users can scroll past the sticky CTA bar
    <div className="min-h-screen bg-white py-8 md:py-20 pb-36 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: DYNAMIC PRODUCT GALLERY       */}
          {/* ========================================== */}
          <div className="w-full flex flex-col">
            <ProductGallery 
              images={product.images?.edges || []} 
              title={product.title} 
            />
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: PRODUCT DETAILS & ACTION     */}
          {/* ========================================== */}
          <div className="flex flex-col">
            
            {/* 1. Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3 md:mb-4 leading-tight">
              {product.title}
            </h1>
            
            {/* 2. Price */}
            <p className="text-3xl md:text-4xl font-black text-[#1e3a8a] mb-6">
              {new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency, 
                maximumFractionDigits: 0 
              }).format(Number(price))}
            </p>

            {/* 3. Action Buttons (Positioned high up for maximum conversion) */}
            <div className="mb-10 w-full">
              <AddToCart 
                product={product} 
                variantId={variantId} 
                availableForSale={product.availableForSale} 
              />
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* 4. Product Description (Pushed below the buttons) */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">
                Product Details
              </h3>
              <div 
                className="prose prose-sm md:prose-base text-gray-600 max-w-none prose-p:leading-relaxed prose-li:marker:text-blue-500"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            {/* Trust Badges (Reassurance below description) */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Fast Dispatch</span>
                <span className="text-xs text-gray-500">Ships across Kerala</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Secure Payment</span>
                <span className="text-xs text-gray-500">256-bit SSL encrypted</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}