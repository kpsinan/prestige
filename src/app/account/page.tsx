import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerOrders } from "../../lib/shopify";
import { 
  Package, 
  User, 
  LogOut, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  CheckCircle2,
  XCircle,
  ChevronRight,
  Truck,
  Gift
} from "lucide-react";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  redirect("/account/login");
}

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) redirect("/account/login");

  const customer = await getCustomerOrders(token);

  if (!customer) {
    const cookieStoreToClear = await cookies();
    cookieStoreToClear.delete("customerAccessToken");
    redirect("/account/login");
  }

  const orders = customer.orders?.edges || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 pt-6 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Account
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome back, <span className="text-blue-600 font-bold">{customer.firstName}</span>
            </p>
          </div>
          
          <form action={logout} className="hidden md:block">
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm hover:bg-red-50 hover:text-red-600 transition-all active:scale-95">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: PROFILE SIDEBAR --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-100">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-sm font-medium text-gray-400 mt-1">{customer.email}</p>
                
                {/* Stats Row (Simplified: Removed Level) */}
                <div className="w-full mt-8 bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Orders</span>
                  <span className="text-xl font-black text-gray-900">{orders.length}</span>
                </div>
              </div>
            </div>

            {/* Mobile Sign Out */}
            <form action={logout} className="md:hidden">
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-red-600 font-black rounded-2xl shadow-sm">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
          </div>

          {/* --- RIGHT: RECENT ORDERS --- */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 px-2">
              <Clock className="w-5 h-5 text-blue-600" /> Order History
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 border border-gray-100 flex flex-col items-center text-center">
                <ShoppingBag className="w-12 h-12 text-gray-200 mb-6" />
                <h3 className="text-xl font-black text-gray-900 mb-8">No orders yet</h3>
                <Link href="/products" className="bg-[#0a2540] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((orderEdge: any) => {
                  const order = orderEdge.node;
                  const date = new Date(order.processedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                  const isPaid = order.financialStatus === "PAID";
                  const isFulfilled = order.fulfillmentStatus === "FULFILLED";
                  const isCanceled = !!order.canceledAt;
                  const orderIdNumber = order.id.split('/').pop();

                  return (
                    <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                      
                      {/* Card Header */}
                      <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-50">
                        <div className="flex gap-6 sm:gap-10">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-sm font-bold text-gray-900">{date}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                            <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isCanceled ? "bg-red-50 text-red-600" : isFulfilled ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"}`}>
                            {isCanceled ? "Canceled" : isFulfilled ? "Shipped" : "Processing"}
                          </span>
                        </div>
                      </div>

                      {/* Line Items (Now Clickable) */}
                      <div className="p-6 sm:p-8 space-y-5">
                        {order.lineItems.edges.map((itemEdge: any, idx: number) => {
                          const item = itemEdge.node;
                          const handle = item.variant?.product?.handle;

                          return (
                            <div key={idx} className="flex items-center gap-5 group/item">
                              {/* Product Link wrapper for Image */}
                              <Link 
                                href={handle ? `/products/${handle}` : "#"} 
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden group-hover/item:border-blue-200 transition-all"
                              >
                                <img 
                                  src={item.variant?.image?.url} 
                                  className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-500" 
                                  alt={item.title} 
                                />
                              </Link>

                              {/* Product Link wrapper for Title */}
                              <div className="flex-grow">
                                <Link 
                                  href={handle ? `/products/${handle}` : "#"} 
                                  className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors"
                                >
                                  {item.title}
                                </Link>
                                <p className="text-xs font-medium text-gray-500 mt-1">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer with Detail Button */}
                      <div className="px-6 py-5 sm:px-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                          <span className="text-2xl font-black text-[#0a2540]">₹{Math.round(order.totalPrice.amount)}</span>
                        </div>
                        
                        <Link 
                          href={`/account/orders/${orderIdNumber}`}
                          className="flex items-center gap-2 bg-white border border-gray-200 text-sm font-black text-gray-900 px-6 py-3 rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-700 transition-all active:scale-95 group"
                        >
                          <Truck className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                          Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}