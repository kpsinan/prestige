"use server";

import { searchProducts } from "../lib/shopify";

export async function getSearchSuggestions(query: string) {
  // Don't search if the query is too short
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const results = await searchProducts(query);
    // Return only the top 5 results to keep the dropdown snappy and clean
    return results.slice(0, 5); 
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return [];
  }
}