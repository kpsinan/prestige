import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "../../../lib/shopify";
import AddToCart from "../../../components/AddToCart"; // <-- Import the new component

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
  
  // Shopify needs the specific Variant ID to add to cart
  const defaultVariantId = product.variants?.edges[0]?.node?.id;
  const isAvailable = product.availableForSale;

  return (
    <div className="min-h-screen bg-prestige-light pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-prestige-gray mb-8">
          <Link href="/" className="hover:text-prestige-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-prestige-primary transition-colors">Inventory</Link>
          <span>/</span>
          <span className="text-prestige-dark truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: Image */}
          <div className="relative aspect-square bg-white rounded-[2rem] md:rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.altText || product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8 md:p-12"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-prestige-gray/50 font-bold uppercase tracking-widest text-xs">
                No Image Available
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col">
            <div className="border-b border-gray-200 pb-8 mb-8">
              <p className="text-prestige-primary font-bold tracking-widest text-[10px] uppercase mb-3">Genuine Part</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-prestige-dark tracking-tighter mb-4 uppercase leading-none">
                {product.title}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-prestige-dark">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(price))}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-prestige-gray mb-4">Description</h3>
                <div 
                  className="text-prestige-dark/80 leading-relaxed text-sm prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || "" }} 
                />
              </div>

              {/* Replaced the static button with our new Interactive Client Component 
                Passing the variantId and availability status
              */}
              {defaultVariantId ? (
                <AddToCart 
                  variantId={defaultVariantId} 
                  availableForSale={isAvailable} 
                />
              ) : (
                <p className="text-red-500 font-bold">Product configuration error.</p>
              )}
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}