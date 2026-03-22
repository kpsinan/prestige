import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerOrders } from "../../../../lib/shopify";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  Receipt, 
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Await params for Next.js 15 compatibility
  const { id } = await params;

  // 2. Authenticate the user
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;
  if (!token) redirect("/account/login");

  const customer = await getCustomerOrders(token);
  if (!customer) redirect("/account/login");

  // 3. Find the specific order that matches the URL ID
  const rawId = `gid://shopify/Order/${id}`;
  const order = customer.orders?.edges.find((edge: any) => edge.node.id === rawId)?.node;

  // If the order doesn't exist or doesn't belong to them
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the details for this order.</p>
        <Link href="/account" className="bg-[#0a2540] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // 4. Extract important data safely
  const date = new Date(order.processedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
  
  const isPaid = order.financialStatus === "PAID";
  const isFulfilled = order.fulfillmentStatus === "FULFILLED";
  const isCanceled = !!order.canceledAt;
  const currency = order.totalPrice.currencyCode;

  // Extract fulfillment/tracking details (Shopify returns this as an array of successful fulfillments)
  const fulfillment = order.successfulFulfillments?.[0];
  const trackingCompany = fulfillment?.trackingCompany || "Standard Courier";
  const trackingNumber = fulfillment?.trackingInfo?.[0]?.number;
  const trackingUrl = fulfillment?.trackingInfo?.[0]?.url;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 pt-8 md:pt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* --- Header & Back Button --- */}
        <div className="mb-8">
          <Link href="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                Placed on {date}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2">
               {isCanceled ? (
                 <span className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-black uppercase tracking-wider flex items-center gap-2 border border-red-100">
                   <XCircle className="w-4 h-4" /> Canceled
                 </span>
               ) : (
                 <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider flex items-center gap-2 border ${isFulfilled ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                   {isFulfilled ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                   {isFulfilled ? "Shipped" : "Processing"}
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: ITEMS & PRICING --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Items Card */}
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Items in this Order
              </h2>
              <div className="space-y-6">
                {order.lineItems.edges.map((itemEdge: any, idx: number) => {
                  const item = itemEdge.node;
                  const itemPrice = item.variant?.price?.amount || 0;
                  
                  return (
                    <div key={idx} className="flex items-center gap-5 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center p-2">
                        {item.variant?.image?.url ? (
                          <img src={item.variant.image.url} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2">{item.title}</h4>
                          <p className="text-sm text-gray-500 font-medium mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-black text-[#0a2540] shrink-0">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(itemPrice))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Pricing Summary Card */}
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" /> Payment Summary
              </h2>
              
              <div className="space-y-4 text-sm font-medium text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(order.subtotalPrice?.amount || order.totalPrice.amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Taxes</span>
                  <span className="text-gray-900">Calculated at Checkout</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900 uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-[#0a2540]">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(order.totalPrice.amount))}
                </span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  Payment Status: {isPaid ? "Successful" : "Pending / COD"}
                </span>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: LOGISTICS & ADDRESS --- */}
          <div className="space-y-8">
            
            {/* 3. Courier & Tracking Card (The Amazon/Flipkart vibe) */}
            <div className="bg-gradient-to-b from-[#0a2540] to-blue-950 rounded-[2.5rem] p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
              
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 relative z-10">
                <Truck className="w-5 h-5 text-blue-400" /> Tracking Details
              </h2>

              {!isFulfilled ? (
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                    <Clock className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Preparing to Ship</h3>
                  <p className="text-sm text-blue-200/80 leading-relaxed">
                    We are packing your order. Tracking details will appear here as soon as it is handed over to our delivery partners.
                  </p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-5 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">Courier Partner</p>
                    <p className="font-black text-xl text-white mb-4">{trackingCompany}</p>
                    
                    <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">Tracking Number</p>
                    <p className="font-mono text-lg text-white bg-black/20 px-3 py-2 rounded-lg inline-block select-all">
                      {trackingNumber || "N/A"}
                    </p>
                  </div>

                  {trackingUrl ? (
                    <a 
                      href={trackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg shadow-blue-500/30"
                    >
                      Track Package <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-sm text-blue-200 text-center font-medium mt-2">
                      Tracking link not available yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 4. Shipping Address Card */}
            {order.shippingAddress && (
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" /> Delivery Address
                </h2>
                <div className="text-gray-600 leading-relaxed text-sm font-medium bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900 text-base mb-1">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                  <p>{order.shippingAddress.zip}</p>
                  <p className="font-bold text-gray-900 mt-2">{order.shippingAddress.country}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}