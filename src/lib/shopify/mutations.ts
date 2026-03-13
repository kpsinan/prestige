// src/lib/shopify/mutations.ts

export const createCartMutation = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
    }
  }
`;