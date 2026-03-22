import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_ENDPOINT = `https://${DOMAIN}/admin/api/2024-01/graphql.json`;

async function adminGraphql(query: string, variables: any = {}) {
  const res = await fetch(ADMIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

export async function POST(req: Request) {
  console.log("--------------------------------------------------");
  console.log("🚀 [REFERRAL SYSTEM] Webhook Signal Received");

  try {
    const order = await req.json();
    const orderNumber = order.order_number;
    const isNowFulfilled = order.fulfillment_status === 'fulfilled';

    console.log(`📦 Order: #${orderNumber} | Current Status: ${order.fulfillment_status || 'unfulfilled'}`);

    // 1. Identify the Referrer
    const refAttribute = order.note_attributes?.find((attr: any) => attr.name === 'Referred_By') 
                      || order.custom_attributes?.find((attr: any) => attr.name === 'Referred_By');

    if (!refAttribute?.value) {
      console.log("ℹ️ Skipping: No referral tag found.");
      return NextResponse.json({ message: 'No referral' });
    }

    const referrerId = refAttribute.value;
    const globalCustomerId = `gid://shopify/Customer/${referrerId}`;

    // 2. Calculate 1%
    const subtotal = parseFloat(order.current_subtotal_price || "0");
    const earningAmount = parseFloat((subtotal * 0.01).toFixed(2));

    // 3. Fetch current Customer Wallet
    const getMetaQuery = `
      query getCustomer($id: ID!) {
        customer(id: $id) {
          balance: metafield(namespace: "custom", key: "affiliate_balance") { value }
          ledger: metafield(namespace: "custom", key: "affiliate_ledger") { value }
        }
      }
    `;
    const customerFetch = await adminGraphql(getMetaQuery, { id: globalCustomerId });
    if (customerFetch.errors) throw new Error("Shopify API Auth Failed");

    let currentBalance = parseFloat(customerFetch.data?.customer?.balance?.value || "0");
    let ledger = [];
    try {
      if (customerFetch.data?.customer?.ledger?.value) {
        ledger = JSON.parse(customerFetch.data.customer.ledger.value);
      }
    } catch (e) { ledger = []; }

    // 4. CHECK HISTORY: Has this specific order been paid or reversed?
    const paymentEntryIndex = ledger.findIndex((e: any) => e.reason === `Commission for Order #${orderNumber}`);
    const reversalEntryIndex = ledger.findIndex((e: any) => e.reason === `REVERSED: Order #${orderNumber} unfulfilled`);

    let newBalance = currentBalance;
    let changeMade = false;

    // --- CASE A: ADMIN FULFILLED THE ORDER ---
    if (isNowFulfilled) {
      // Only pay if they haven't been paid OR if the last action was a reversal
      if (paymentEntryIndex === -1 || (paymentEntryIndex !== -1 && reversalEntryIndex > paymentEntryIndex)) {
        newBalance = currentBalance + earningAmount;
        ledger.push({
          date: new Date().toISOString(),
          amount: earningAmount.toFixed(2),
          reason: `Commission for Order #${orderNumber}`
        });
        console.log(`✅ CREDITED: +₹${earningAmount} added to balance.`);
        changeMade = true;
      } else {
        console.log("ℹ️ Info: Customer already credited for this order.");
      }
    } 
    // --- CASE B: ADMIN UNFULFILLED / CANCELED ---
    else {
      // Only reverse if they HAVE been paid and we haven't reversed it yet
      if (paymentEntryIndex !== -1 && (reversalEntryIndex === -1 || reversalEntryIndex < paymentEntryIndex)) {
        newBalance = Math.max(0, currentBalance - earningAmount);
        ledger.push({
          date: new Date().toISOString(),
          amount: `-${earningAmount.toFixed(2)}`,
          reason: `REVERSED: Order #${orderNumber} unfulfilled`
        });
        console.log(`📉 REVERSED: -₹${earningAmount} removed from balance.`);
        changeMade = true;
      } else {
        console.log("ℹ️ Info: Nothing to reverse.");
      }
    }

    if (!changeMade) return NextResponse.json({ message: 'No balance change needed' });

    // 5. Update Shopify
    const updateMutation = `
      mutation updateMeta($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { message }
        }
      }
    `;

    await adminGraphql(updateMutation, {
      metafields: [
        { ownerId: globalCustomerId, namespace: "custom", key: "affiliate_balance", type: "number_decimal", value: newBalance.toFixed(2) },
        { ownerId: globalCustomerId, namespace: "custom", key: "affiliate_ledger", type: "json", value: JSON.stringify(ledger) }
      ]
    });

    console.log(`🏁 Process Complete. New Balance: ₹${newBalance.toFixed(2)}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔥 Webhook Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}