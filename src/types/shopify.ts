export interface ShopifyImage {
  node: {
    url: string;
    altText?: string;
  };
}

export interface ShopifyVariant {
  node: {
    id: string;
    availableForSale: boolean;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: ShopifyImage[];
  };
  variants?: {
    edges: ShopifyVariant[];
  };
}