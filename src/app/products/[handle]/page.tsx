// src/app/products/[handle]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "../../../lib/shopify";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const price = product.priceRange.maxVariantPrice.amount;
  const currency = product.priceRange.maxVariantPrice.currencyCode;
  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
          <a href="/" className="hover:text-blue-600">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-blue-600">Inventory</a>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT: Image */}
          <div className="relative aspect-square bg-[#F8F9FA] rounded-3xl border border-gray-100 overflow-hidden">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.altText || product.title}
                fill
                priority
                className="object-contain p-12"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col">
            <div className="border-b border-gray-100 pb-8 mb-8">
              <p className="text-blue-600 font-bold tracking-widest text-[10px] uppercase mb-3">Genuine Part</p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 uppercase leading-none">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(price)}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Description</h3>
                {/* THE FIX: We ensure __html always gets a string, even if product.descriptionHtml is null */}
                <div 
                  className="text-gray-600 leading-relaxed text-sm prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || "" }} 
                />
              </div>

              <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-black/10">
                Order Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}