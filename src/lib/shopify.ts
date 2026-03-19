import { ShopifyProduct } from "../types/shopify";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

/**
 * Base Fetch Function with Enhanced Error Logging
 */
async function shopifyFetch({ query, variables }: { query: string; variables?: any }) {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken as string,
      },
      body: JSON.stringify({ query, variables }),
      // Forces Next.js to refresh stock data every 60 seconds
      next: { revalidate: 60 } 
    });

    const response = await result.json();

    if (response.errors) {
      console.error('Shopify API Error Detail:', JSON.stringify(response.errors, null, 2));
      throw new Error('Failed to fetch from Shopify API');
    }

    return { body: response.data };
  } catch (error) {
    console.error('Network or Parse Error fetching from Shopify:', error);
    throw error;
  }
}

/**
 * Fetch All Products (Includes Variant IDs for Cart)
 */
export async function getAllProducts(): Promise<any[]> {
  const query = `
    query getProducts {
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.body?.products?.edges.map((edge: any) => edge.node) || [];
}

/**
 * Fetch a Single Product by Handle (Updated to fetch up to 10 images)
 */
export async function getProduct(handle: string): Promise<any | null> {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        availableForSale
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });
  return response.body?.product || null;
}

/**
 * Fetch Products by Collection Handle
 */
export async function getCollectionProducts(handle: string): Promise<any[]> {
  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, variables: { handle } });
  return response.body?.collection?.products?.edges.map((edge: any) => edge.node) || [];
}

/**
 * Create a Checkout URL for Multi-Item Cart
 */
export async function createCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string> {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: lines
    }
  };

  const response = await shopifyFetch({ query, variables });
  const checkoutUrl = response.body?.cartCreate?.cart?.checkoutUrl;
  
  if (!checkoutUrl) {
    const userErrors = response.body?.cartCreate?.userErrors;
    console.error('Shopify Checkout User Errors:', userErrors);
    throw new Error(userErrors?.[0]?.message || 'Could not create checkout URL');
  }

  return checkoutUrl;
}