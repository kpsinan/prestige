// src/lib/shopify/index.ts

import { getProductQuery } from './queries';
import { getAllProductsQuery } from './queries';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({ query, variables = {} }: { query: string, variables?: any }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();
  
  if (errors) {
    console.error('Shopify API Errors:', errors);
    throw new Error('Failed to fetch from Shopify Storefront API');
  }
  
  return data;
}

// ADD THIS NEW FUNCTION TO THE BOTTOM
export async function getProduct(handle: string) {
  const data = await shopifyFetch({
    query: getProductQuery,
    variables: { handle }
  });
  return data.product;
}

export async function getAllProducts() {
  const data = await shopifyFetch({
    query: getAllProductsQuery,
  });
  // Transform the Shopify "edges/nodes" structure into a clean array
  return data.products.edges.map((edge: any) => edge.node);
}