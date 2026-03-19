"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;        // Product ID
  variantId: string; // Crucial for Shopify Checkout
  title: string;
  handle: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from LocalStorage on mount to persist data
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("prestige_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data");
      }
    }
  }, []);

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("prestige_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.variantId === newItem.variantId);
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }
      // New item
      return [...prevItems, newItem];
    });
    
  };

  const removeFromCart = (variantId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    );
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, toggleCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};