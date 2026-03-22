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

/* ========================================================
   1. PRODUCTS & COLLECTIONS
   ======================================================== */

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
              maxVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
            variants(first: 1) {
              edges { node { id availableForSale } }
            }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query });
  return response.body?.products?.edges.map((edge: any) => edge.node) || [];
}

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
          maxVariantPrice { amount currencyCode }
        }
        images(first: 10) {
          edges { node { url altText } }
        }
        variants(first: 1) {
          edges { node { id availableForSale } }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { handle } });
  return response.body?.product || null;
}

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
                maxVariantPrice { amount currencyCode }
              }
              images(first: 1) {
                edges { node { url altText } }
              }
              variants(first: 1) {
                edges { node { id } }
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

/* ========================================================
   2. SEARCH CAPABILITIES
   ======================================================== */

export async function searchProducts(searchTerm: string): Promise<any[]> {
  const query = `
    query searchProducts($query: String!) {
      products(first: 24, query: $query) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            priceRange {
              maxVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { query: searchTerm } });
  return response.body?.products?.edges.map((edge: any) => edge.node) || [];
}

export async function getCustomerAddressesOnly(accessToken: string) {
  const query = `
    query getCustomerAddresses($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        addresses(first: 10) {
          edges {
            node {
              firstName
              lastName
              address1
              city
              province
              zip
              country
            }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { customerAccessToken: accessToken } });
  return response.body?.customer?.addresses?.edges.map((edge: any) => edge.node) || [];
}

/* ========================================================
   3. CHECKOUT CAPABILITIES
   ======================================================== */

export async function createCheckout(
  lines: { merchandiseId: string; quantity: number }[],
  customerAccessToken?: string,
  shippingAddress?: any // <--- NEW: Accepts the chosen address
): Promise<string> {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl }
        userErrors { field message }
      }
    }
  `;

  const input: any = { lines: lines };

  if (customerAccessToken) {
    input.buyerIdentity = {
      customerAccessToken: customerAccessToken
    };
    
    // --- NEW: INJECT THE ADDRESS FOR CASHFREE / SHOP PAY ---
    if (shippingAddress) {
      input.buyerIdentity.deliveryAddressPreferences = [{
        deliveryAddress: {
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          province: shippingAddress.province,
          country: shippingAddress.country || "India",
          zip: shippingAddress.zip,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName
        }
      }];
    }
  }

  const variables = { input };
  const response = await shopifyFetch({ query, variables });
  const checkoutUrl = response.body?.cartCreate?.cart?.checkoutUrl;
  
  if (!checkoutUrl) {
    const userErrors = response.body?.cartCreate?.userErrors;
    console.error('Shopify Checkout User Errors:', userErrors);
    throw new Error(userErrors?.[0]?.message || 'Could not create checkout URL');
  }

  return checkoutUrl;
}

/* ========================================================
   4. CUSTOMER ACCOUNTS (LOGIN, REGISTER, HISTORY)
   ======================================================== */

export async function createCustomer(email: string, password: string, firstName: string, lastName: string) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { code field message }
      }
    }
  `;
  const variables = { input: { email, password, firstName, lastName } };
  const response = await shopifyFetch({ query, variables });
  return response.body?.customerCreate;
}

export async function loginCustomer(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }
  `;
  const variables = { input: { email, password } };
  const response = await shopifyFetch({ query, variables });
  return response.body?.customerAccessTokenCreate;
}

export async function getCustomerOrders(accessToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        firstName
        lastName
        email
        addresses(first: 10) {
          edges {
            node { id firstName lastName address1 city province zip country }
          }
        }
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              canceledAt
              cancelReason
              totalPrice { amount currencyCode }
              lineItems(first: 5) {
                edges {
                  node { 
                    title 
                    quantity 
                    # --- NEW: Fetch Image & Product URL Handle ---
                    variant {
                      image { url }
                      product { handle }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { customerAccessToken: accessToken } });
  return response.body?.customer;
}
// --- NEW: Add a New Address ---
export async function addCustomerAddress(accessToken: string, address: any) {
  const query = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress { id }
        customerUserErrors { message }
      }
    }
  `;
  const response = await shopifyFetch({ query, variables: { customerAccessToken: accessToken, address } });
  return response.body?.customerAddressCreate;
}

// --- NEW: Delete an Address ---
export async function deleteCustomerAddress(accessToken: string, addressId: string) {
  const query = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
      }
    }
  `;
  await shopifyFetch({ query, variables: { customerAccessToken: accessToken, id: addressId } });
}