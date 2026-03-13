// src/lib/shopify/index.ts
import { getProductQuery, getAllProductsQuery } from "./queries";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables = {}, cache = 'force-cache' }: any) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken!,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Re-check for stock/price changes every minute
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return body.data;
  } catch (e) {
    console.error('Shopify Fetch Error:', e);
    throw {
      status: 500,
      message: 'Error fetching data from Shopify',
    };
  }
}

// 1. Fetch all products for the Inventory page
export async function getAllProducts() {
  const data = await shopifyFetch({ query: getAllProductsQuery });
  return data.products.edges.map((edge: any) => edge.node);
}

// 2. Fetch a single product for the Product Handle page
export async function getProduct(handle: string) {
  const data = await shopifyFetch({
    query: getProductQuery,
    variables: { handle },
  });
  return data.product;
}

// 3. Create a real Shopify checkout link
export async function createCheckout(variantId: string) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: [{ variantId, quantity: 1 }]
    }
  };

  const data = await shopifyFetch({
    query: mutation,
    variables,
    cache: 'no-store'
  });

  return data.checkoutCreate.checkout.webUrl;
}