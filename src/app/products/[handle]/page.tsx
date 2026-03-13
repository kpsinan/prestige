// src/app/products/[handle]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getProduct, shopifyFetch } from "../../../lib/shopify";
import { createCartMutation } from "../../../lib/shopify/mutations";

// 1. Notice the 'Promise' type added to params here:
export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  
  // 2. Notice the 'await' added here:
  const { handle } = await params;
  
  const product = await getProduct(handle);

  if (!product) return notFound();

  const price = product.priceRange.maxVariantPrice.amount;
  const currency = product.priceRange.maxVariantPrice.currencyCode;
  const imageUrl = product.images.edges[0]?.node.url;
  const variantId = product.variants.edges[0].node.id;

  async function handleBuyNow() {
    'use server';
    
    const response = await shopifyFetch({
      query: createCartMutation,
      variables: {
        input: {
          lines: [{ quantity: 1, merchandiseId: variantId }]
        }
      }
    });

    const checkoutUrl = response.cartCreate.cart.checkoutUrl;
    redirect(checkoutUrl); 
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 border-b">
        <Link href="/" className="text-gray-500 hover:text-black transition-colors">← Back to Search</Link>
      </nav>
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square relative border rounded-2xl overflow-hidden bg-gray-50">
          {imageUrl ? (
            <Image src={imageUrl} alt={product.title} fill className="object-contain p-8" />
          ) : (
             <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
          )}
        </div>
        
        <div className="flex flex-col justify-center">
          <p className="text-blue-600 font-bold tracking-widest text-sm mb-2">PRESTIGE TRADERS</p>
          <h1 className="text-4xl font-extrabold mb-4">{product.title}</h1>
          <p className="text-2xl mb-6">{new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(price)}</p>
          
          <div className="border-t border-b py-6 mb-8">
            <h3 className="text-sm font-bold uppercase mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "Authentic spare part for Toyota models. Guaranteed fitment and high durability. Sourced directly by Prestige Traders, Edakkara."}
            </p>
          </div>

          <form action={handleBuyNow}>
            <button type="submit" className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95">
              Buy Now
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-400 mt-4 italic">Secure Guest Checkout via Shopify</p>
        </div>
      </div>
    </div>
  );
}