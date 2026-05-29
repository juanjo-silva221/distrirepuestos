import React, { useEffect, useState } from 'react';
import { CartContext } from './cartContext';

const CART_STORAGE_KEY = 'motorepuestos-cart';

function loadStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!rawCart) {
    return [];
  }

  try {
    return JSON.parse(rawCart);
  } catch (error) {
    console.error('Error parsing cart from localStorage', error);
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find((item) => item.id === product.id);

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...previousCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((previousCart) => previousCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen((previousValue) => !previousValue);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        cartTotal,
        cartItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
