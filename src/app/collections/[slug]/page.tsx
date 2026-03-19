import { getCollectionProducts } from "../../../lib/shopify";
import Link from "next/link";
import Image from "next/image";

export default async function CollectionPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Fetch real products from this specific Shopify collection
  const products = await getCollectionProducts(slug);

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slug.replace('-', ' ')}</h1>
        <p className="text-gray-500">No products found in this collection.</p>
        <Link href="/products" className="mt-6 text-blue-600 font-bold hover:underline">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold capitalize mb-12 border-b pb-6">
          {slug.replace('-', ' ')}
        </h1>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <Link 
              href={`/products/${product.handle}`} 
              key={product.id} 
              className="group flex flex-col"
            >
              <div className="aspect-square relative mb-4 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:shadow-lg transition-all">
                {product.images?.edges[0]?.node?.url ? (
                  <Image 
                    src={product.images.edges[0].node.url} 
                    alt={product.title} 
                    fill 
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
              </div>
              <h2 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h2>
              <p className="text-blue-700 font-black mt-2">
                {new Intl.NumberFormat('en-IN', { 
                  style: 'currency', 
                  currency: 'INR' 
                }).format(Number(product.priceRange.maxVariantPrice.amount))}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}