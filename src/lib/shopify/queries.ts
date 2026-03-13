// src/lib/shopify/queries.ts

export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
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
`;

export const getAllProductsQuery = `
  query getAllProducts {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
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