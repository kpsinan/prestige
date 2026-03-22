import { NextResponse } from 'next/server';

// This must be your Shopify Admin API Token (starts with shpat_)
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_ENDPOINT = `https://${DOMAIN}/admin/api/2024-01/graphql.json`;

// Helper to interact with the powerful Admin API
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
  try {
    // 1. Receive the Order Data from Shopify Webhook
    const order = await req.json();

    // 2. Look for our hidden "Referred_By" attribute in the order
    const refAttribute = order.note_attributes?.find((attr: any) => attr.name === 'Referred_By') 
                      || order.custom_attributes?.find((attr: any) => attr.name === 'Referred_By');

    // If no one referred this order, exit silently.
    if (!refAttribute || !refAttribute.value) {
      return NextResponse.json({ message: 'No referral tag found. Skipping.' }, { status: 200 });
    }

    const referrerIdNumber = refAttribute.value;
    const globalCustomerId = `gid://shopify/Customer/${referrerIdNumber}`;
    
    // 3. Calculate 1% of the subtotal
    const orderTotal = parseFloat(order.current_subtotal_price);
    const earnedAmount = (orderTotal * 0.01).toFixed(2);
    
    if (parseFloat(earnedAmount) <= 0) {
      return NextResponse.json({ message: 'Earning is zero. Skipping.' }, { status: 200 });
    }

    // 4. Fetch the Customer's CURRENT Balance & Ledger from Shopify
    const getMetafieldsQuery = `
      query getCustomerMetafields($id: ID!) {
        customer(id: $id) {
          balance: metafield(namespace: "custom", key: "affiliate_balance") { value }
          ledger: metafield(namespace: "custom", key: "affiliate_ledger") { value }
        }
      }
    `;
    const customerData = await adminGraphql(getMetafieldsQuery, { id: globalCustomerId });
    const currentBalance = parseFloat(customerData.data?.customer?.balance?.value || "0");
    const newBalance = (currentBalance + parseFloat(earnedAmount)).toFixed(2);

    // Parse the old ledger and add the new entry
    let ledgerArray = [];
    try {
      if (customerData.data?.customer?.ledger?.value) {
        ledgerArray = JSON.parse(customerData.data.customer.ledger.value);
      }
    } catch (e) { /* Ignore parse errors */ }

    ledgerArray.push({
      date: new Date().toISOString(),
      amount: earnedAmount,
      reason: `Order #${order.order_number}`
    });

    // 5. Save the updated Balance and Ledger back to Shopify
    const updateMetafieldsMutation = `
      mutation updateCustomerMetafields($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { message }
        }
      }
    `;
    
    await adminGraphql(updateMetafieldsMutation, {
      metafields: [
        {
          ownerId: globalCustomerId,
          namespace: "custom",
          key: "affiliate_balance",
          type: "number_decimal",
          value: newBalance.toString()
        },
        {
          ownerId: globalCustomerId,
          namespace: "custom",
          key: "affiliate_ledger",
          type: "json",
          value: JSON.stringify(ledgerArray)
        }
      ]
    });

    console.log(`Successfully credited ₹${earnedAmount} to Customer ${referrerIdNumber}`);
    return NextResponse.json({ success: true, credited: earnedAmount });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}