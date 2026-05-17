// src/context/CartContext.jsx
// Member 4 – Lojeni
// Global cart state that calls the Java backend

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cart as cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems,  setCartItems]  = useState([]);
  const [cartTotal,  setCartTotal]  = useState(0);
  const [cartCount,  setCartCount]  = useState(0);
  const [loading,    setLoading]    = useState(false);

  // ── Fetch cart from backend ───────────────────────────────────────────────

  const fetchCart = useCallback(async () => {
    if (!user?.id) { setCartItems([]); setCartTotal(0); setCartCount(0); return; }
    setLoading(true);
    try {
      const { ok, data } = await cartApi.get(user.id);
      if (ok) {
        setCartItems(data.items || []);
        setCartTotal(data.total || 0);
        setCartCount((data.items || []).reduce((s, i) => s + i.quantity, 0));
      }
    } catch (_) {}
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Add to cart ───────────────────────────────────────────────────────────

  const addToCart = async (bookId, quantity = 1) => {
    if (!user?.id) return { success: false, error: 'Please login first' };
    const { ok, data } = await cartApi.add(user.id, bookId, quantity);
    if (ok) await fetchCart();
    return { success: ok, message: data.message };
  };

  // ── Update quantity ───────────────────────────────────────────────────────

  const updateQuantity = async (bookId, quantity) => {
    if (!user?.id) return;
    await cartApi.update(user.id, bookId, quantity);
    await fetchCart();
  };

  // ── Remove from cart ──────────────────────────────────────────────────────

  const removeFromCart = async (bookId) => {
    if (!user?.id) return;
    await cartApi.remove(user.id, bookId);
    await fetchCart();
  };

  // ── Clear cart ────────────────────────────────────────────────────────────

  const clearCart = async () => {
    if (!user?.id) return;
    await cartApi.clear(user.id);
    setCartItems([]);
    setCartTotal(0);
    setCartCount(0);
  };

  // ── Discount ──────────────────────────────────────────────────────────────

  const applyDiscount = async (code) => {
    const { ok, data } = await cartApi.applyDiscount(code);
    return { success: ok, ...data };
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyDiscount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
