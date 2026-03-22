import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Share2, IndianRupee, History, TrendingUp, Info } from "lucide-react";

// Local fetch function to grab the Metafields securely
async function getAffiliateData(accessToken: string) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  
  const query = `
    query getCustomerAffiliateData($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        # Fetching the custom balance and ledger metafields
        balance: metafield(namespace: "custom", key: "affiliate_balance") { value }
        ledger: metafield(namespace: "custom", key: "affiliate_ledger") { value }
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken as string,
    },
    body: JSON.stringify({ query, variables: { customerAccessToken: accessToken } }),
    next: { revalidate: 0 } // Always fetch fresh data for financial pages
  });

  const { data } = await response.json();
  return data?.customer;
}

export default async function SharedLinksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }

  const customer = await getAffiliateData(token);
  if (!customer) redirect("/account/login");

  // Parse the Metafields
  const balance = customer.balance?.value ? parseFloat(customer.balance.value) : 0;
  
  // Ledger is stored as a JSON string array in the backend
  let ledgerItems = [];
  try {
    if (customer.ledger?.value) {
      ledgerItems = JSON.parse(customer.ledger.value).reverse(); // Newest first
    }
  } catch (e) {
    console.error("Failed to parse ledger");
  }

  // Extract the raw ID number from Shopify's Global ID format
  const customerIdNumber = customer.id.split('/').pop();

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Share2 className="w-8 h-8 text-blue-600" /> Shared Links & Earnings
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Share products with your friends. When they buy, you earn 1% in store credit!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: The Wallet & Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-[#0a2540] to-blue-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />
              
              <p className="text-blue-200 font-bold text-sm uppercase tracking-wider mb-2">Available Credit</p>
              <h2 className="text-5xl font-black mb-6 flex items-center">
                <IndianRupee className="w-8 h-8 mr-1 opacity-80" />
                {balance.toFixed(2)}
              </h2>
              
              <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Your credit is automatically applied at checkout. Credits are unlocked only after your friend's order is successfully delivered.
                </p>
              </div>
            </div>

            {/* How It Works Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> How to Earn
              </h3>
              <ol className="text-sm text-gray-600 space-y-4 font-medium">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                  Click the "Share" button on any product page.
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                  Your unique ID (<span className="text-gray-900 font-bold">{customerIdNumber}</span>) is attached to the link.
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                  Earn 1% of their total order value once delivered!
                </li>
              </ol>
            </div>
            
          </div>

          {/* RIGHT COLUMN: The Ledger / History */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" /> Earning History
            </h2>

            {ledgerItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Share2 className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">No earnings yet</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Share a product with a friend to start building your store credit balance!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {ledgerItems.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.reason}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-600 flex items-center justify-end">
                        + <IndianRupee className="w-3.5 h-3.5 ml-0.5" />{parseFloat(item.amount).toFixed(2)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Earned</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}