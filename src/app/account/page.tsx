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
  CheckCircle2 
} from "lucide-react";

// Server Action to securely log the user out
async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  redirect("/account/login");
}

export default async function AccountPage() {
  // 1. Await cookies (Next.js 15+ requirement) and get the token
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  // 2. If they have no token, kick them back to the login page
  if (!token) {
    redirect("/account/login");
  }

  // 3. Ask Shopify who this token belongs to and get their past orders
  const customer = await getCustomerOrders(token);

  // 4. If the token is expired or invalid, kick them to login
  if (!customer) {
    const cookieStoreToClear = await cookies();
    cookieStoreToClear.delete("customerAccessToken");
    redirect("/account/login");
  }

  const orders = customer.orders?.edges || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              My Account
            </h1>
            <p className="text-gray-500 font-medium">
              Welcome back, <span className="text-gray-900 font-bold">{customer.firstName}</span>!
            </p>
          </div>
          
          {/* Logout Button (Powered by Server Action) */}
          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: PROFILE SUMMARY               */}
          {/* ========================================== */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {customer.firstName} {customer.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
              
              <div className="w-full h-px bg-gray-100 my-6" />
              
              <div className="w-full flex justify-between items-center text-sm font-bold">
                <span className="text-gray-500">Total Orders</span>
                <span className="text-[#0a2540] bg-gray-50 px-3 py-1 rounded-lg">{orders.length}</span>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 px-2">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Link href="/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors group">
                  <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-blue-600" /> Continue Shopping
                </Link>
                {/* Visual placeholder for future address management */}
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors group cursor-pointer">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-600" /> Saved Addresses
                </div>
              </div>
            </div>

          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: ORDER HISTORY                */}
          {/* ========================================== */}
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" /> Order History
            </h2>

            {orders.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 max-w-sm mb-8">
                  Looks like you haven't made any purchases yet. Your future garage and kitchen upgrades will appear here.
                </p>
                <Link 
                  href="/products" 
                  className="bg-[#0a2540] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-[#001428] active:scale-95 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              // Order List
              <div className="flex flex-col gap-6">
                {orders.map((orderEdge: any) => {
                  const order = orderEdge.node;
                  const date = new Date(order.processedAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  });
                  const price = order.totalPrice.amount;
                  const currency = order.totalPrice.currencyCode;
                  
                  // Status Colors logic
                  const isPaid = order.financialStatus === "PAID";
                  const isFulfilled = order.fulfillmentStatus === "FULFILLED";

                  return (
                    <div key={order.id} className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Placed</p>
                          <p className="font-bold text-gray-900">{date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {isPaid ? "Paid" : "Pending"}
                          </span>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${isFulfilled ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                            {isFulfilled ? "Shipped" : "Processing"}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="flex flex-col gap-4 mb-6">
                        {order.lineItems.edges.map((itemEdge: any, index: number) => {
                          const item = itemEdge.node;
                          return (
                            <div key={index} className="flex items-center justify-between gap-4">
                              <p className="text-sm font-medium text-gray-900 flex-grow truncate">
                                <span className="text-gray-400 mr-2">{item.quantity}x</span>
                                {item.title}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 bg-gray-50/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 py-4 sm:py-5 rounded-b-[2rem]">
                        <p className="text-sm font-bold text-gray-500">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-lg font-black text-[#0a2540]">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(price))}
                        </p>
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