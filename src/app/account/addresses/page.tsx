import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getCustomerOrders, addCustomerAddress, deleteCustomerAddress } from "../../../lib/shopify";
import { MapPin, ArrowLeft, Plus, Trash2, Home } from "lucide-react";

export default async function AddressesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }

  const customer = await getCustomerOrders(token);
  if (!customer) redirect("/account/login");

  const addresses = customer.addresses?.edges || [];

  // ==========================================
  // SERVER ACTIONS (Runs securely on the server)
  // ==========================================
  async function handleAddAddress(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    const token = cookieStore.get("customerAccessToken")?.value;
    if (!token) return;

    const address = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      address1: formData.get("address1") as string,
      city: formData.get("city") as string,
      province: formData.get("province") as string,
      zip: formData.get("zip") as string,
      country: "India", // Defaulting to India for your store
    };

    await addCustomerAddress(token, address);
    revalidatePath("/account/addresses"); // Instantly refreshes the page data
  }

  async function handleDeleteAddress(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    const token = cookieStore.get("customerAccessToken")?.value;
    const addressId = formData.get("addressId") as string;
    
    if (token && addressId) {
      await deleteCustomerAddress(token, addressId);
      revalidatePath("/account/addresses");
    }
  }

  // ==========================================
  // UI RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Header */}
        <div className="mb-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" /> Saved Addresses
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Manage your delivery addresses for faster checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* LEFT: Saved Addresses List */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 mb-2">Your Address Book ({addresses.length})</h3>
            
            {addresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">You haven't saved any addresses yet.</p>
              </div>
            ) : (
              addresses.map((addressEdge: any) => {
                const addr = addressEdge.node;
                return (
                  <div key={addr.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative group">
                    <p className="font-bold text-gray-900 mb-1">{addr.firstName} {addr.lastName}</p>
                    <p className="text-gray-500 text-sm">{addr.address1}</p>
                    <p className="text-gray-500 text-sm">{addr.city}, {addr.province} {addr.zip}</p>
                    <p className="text-gray-500 text-sm">{addr.country}</p>
                    
                    {/* Delete Button calling a Server Action */}
                    <form action={handleDeleteAddress} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input type="hidden" name="addressId" value={addr.id} />
                      <button type="submit" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Add New Address Form */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm sticky top-28">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add New Address
            </h3>
            
            <form action={handleAddAddress} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" required placeholder="First Name" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <input type="text" name="lastName" required placeholder="Last Name" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <input type="text" name="address1" required placeholder="Street Address / House Name" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="city" required placeholder="City / Town" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <input type="text" name="zip" required placeholder="PIN Code" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <input type="text" name="province" required placeholder="State (e.g., Kerala)" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              
              <button type="submit" className="mt-2 w-full bg-[#0a2540] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#001428] active:scale-[0.98] transition-all">
                Save Address
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}