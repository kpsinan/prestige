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
  console.log("🚀 [REFERRAL SYSTEM] Webhook Received");

  try {
    const order = await req.json();
    const orderNumber = order.order_number;
    const status = order.fulfillment_status; // 'fulfilled' or null

    console.log(`📦 Order: #${orderNumber} | Status: ${status || 'unfulfilled'}`);

    // 1. Extract Referrer
    const refAttribute = order.note_attributes?.find((attr: any) => attr.name === 'Referred_By') 
                      || order.custom_attributes?.find((attr: any) => attr.name === 'Referred_By');

    if (!refAttribute?.value) {
      console.log("ℹ️ Skipping: No referral tag.");
      return NextResponse.json({ message: 'No referral' }, { status: 200 });
    }

    const referrerId = refAttribute.value;
    const globalCustomerId = `gid://shopify/Customer/${referrerId}`;

    // 2. Calculate Amount
    const subtotal = parseFloat(order.current_subtotal_price || "0");
    const earning = parseFloat((subtotal * 0.01).toFixed(2));

    // 3. Fetch current wallet data
    const getMetaQuery = `
      query getCustomer($id: ID!) {
        customer(id: $id) {
          balance: metafield(namespace: "custom", key: "affiliate_balance") { value }
          ledger: metafield(namespace: "custom", key: "affiliate_ledger") { value }
        }
      }
    `;
    const customerFetch = await adminGraphql(getMetaQuery, { id: globalCustomerId });
    
    if (customerFetch.errors) throw new Error("Shopify Auth Error");

    let currentBalance = parseFloat(customerFetch.data?.customer?.balance?.value || "0");
    let ledgerHistory = [];
    try {
      if (customerFetch.data?.customer?.ledger?.value) {
        ledgerHistory = JSON.parse(customerFetch.data.customer.ledger.value);
      }
    } catch (e) { ledgerHistory = []; }

    // 4. LOGIC BRANCHING: FULFILL vs UNFULFILL
    const hasBeenPaid = ledgerHistory.some((entry: any) => 
      entry.reason.includes(`#${orderNumber}`) && !entry.reason.includes("REVERSED")
    );
    const hasBeenReversed = ledgerHistory.some((entry: any) => 
      entry.reason.includes(`REVERSED: Order #${orderNumber}`)
    );

    let newBalance = currentBalance;
    let actionTaken = false;

    if (status === 'fulfilled') {
      // ONLY PAY IF NOT ALREADY PAID (OR IF PREVIOUSLY REVERSED)
      if (!hasBeenPaid || (hasBeenPaid && hasBeenReversed)) {
        newBalance = currentBalance + earning;
        ledgerHistory.push({
          date: new Date().toISOString(),
          amount: earning.toFixed(2),
          reason: `Commission for Order #${orderNumber}`
        });
        console.log(`💰 CREDIT: +₹${earning} added.`);
        actionTaken = true;
      } else {
        console.log("ℹ️ Skipping: Order already credited in ledger.");
      }
    } 
    else if (status === null || status === 'restocked') {
      // ONLY REVERSE IF IT WAS PREVIOUSLY PAID AND NOT YET REVERSED
      if (hasBeenPaid && !hasBeenReversed) {
        newBalance = Math.max(0, currentBalance - earning); // Don't go below 0
        ledgerHistory.push({
          date: new Date().toISOString(),
          amount: `-${earning.toFixed(2)}`,
          reason: `REVERSED: Order #${orderNumber} unfulfilled`
        });
        console.log(`📉 REVERSAL: -₹${earning} deducted.`);
        actionTaken = true;
      } else {
        console.log("ℹ️ Skipping: Nothing to reverse.");
      }
    }

    if (!actionTaken) {
      return NextResponse.json({ message: 'No action required' });
    }

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
        { ownerId: globalCustomerId, namespace: "custom", key: "affiliate_ledger", type: "json", value: JSON.stringify(ledgerHistory) }
      ]
    });

    console.log(`✅ Final Balance: ₹${newBalance.toFixed(2)}`);
    return NextResponse.json({ success: true, balance: newBalance });

  } catch (error: any) {
    console.error("🔥 ERROR:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}