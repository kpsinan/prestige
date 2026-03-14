import { ShopifyProduct } from "../types/shopify";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

/**
 * Base Fetch Function
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

    const { data, errors } = await result.json();

    if (errors) {
      console.error('Shopify API Errors:', errors);
      throw new Error('Failed to fetch from Shopify API');
    }

    return { body: data };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}

/**
 * Fetch All Products
 */
export async function getAllProducts(): Promise<ShopifyProduct[]> {
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
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.body?.products?.edges.map((edge: any) => edge.node) || [];
}

/**
 * Fetch a Single Product by Handle
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
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
        images(first: 5) {
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
 * Create a Checkout URL for "Buy Now"
 */
export async function createCheckout(variantId: string): Promise<string> {
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
      lines: [
        {
          merchandiseId: variantId,
          quantity: 1
        }
      ]
    }
  };

  const response = await shopifyFetch({ query, variables });
  const checkoutUrl = response.body?.cartCreate?.cart?.checkoutUrl;
  
  if (!checkoutUrl) {
    throw new Error('Could not create checkout URL');
  }

  return checkoutUrl;
}