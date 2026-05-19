import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

/**
 * Custom hook to access cart state and actions.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Available discount codes (mirrors backend DiscountCode data)
const DISCOUNT_CODES = {
  'LUXURY10': { percentage: 10, maxDiscount: 20, label: '10% off (up to $20)' },
  'BOOKS20':  { percentage: 20, maxDiscount: 50, label: '20% off (up to $50)' },
  'WELCOME5': { percentage: 5,  maxDiscount: 10, label: '5% off (up to $10)' },
  'VIP30':    { percentage: 30, maxDiscount: 100, label: '30% off (up to $100)' },
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code, amount, label }
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Show a temporary notification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // ─── Add to Cart ───────────────────────────────────────────────
  const addToCart = useCallback((book) => {
    setCartItems(prev => {
      // DSA: Linear Search — check if item already exists
      const existingIndex = prev.findIndex(item => item.id === book.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      return [...prev, { ...book, quantity: 1 }];
    });
    showNotification(`${book.title} added to cart!`);
  }, [showNotification]);

  // ─── Remove from Cart ──────────────────────────────────────────
  const removeFromCart = useCallback((id) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) showNotification(`${item.title} removed from cart`, 'info');
      return prev.filter(item => item.id !== id);
    });
  }, [showNotification]);

  // ─── Update Quantity ───────────────────────────────────────────
  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  // ─── Increase / Decrease ──────────────────────────────────────
  const increaseQuantity = useCallback((id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.quantity <= 1) {
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  // ─── Save for Later ───────────────────────────────────────────
  const saveForLater = useCallback((id) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        setSavedItems(saved => [...saved, { ...item }]);
        showNotification(`${item.title} saved for later`, 'info');
      }
      return prev.filter(i => i.id !== id);
    });
  }, [showNotification]);

  // ─── Move back to Cart ────────────────────────────────────────
  const moveToCart = useCallback((id) => {
    setSavedItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        setCartItems(cart => {
          const existingIndex = cart.findIndex(ci => ci.id === id);
          if (existingIndex !== -1) {
            const updated = [...cart];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + item.quantity
            };
            return updated;
          }
          return [...cart, { ...item }];
        });
        showNotification(`${item.title} moved to cart!`);
      }
      return prev.filter(i => i.id !== id);
    });
  }, [showNotification]);

  // ─── Remove from Saved ────────────────────────────────────────
  const removeFromSaved = useCallback((id) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
    showNotification('Item removed from saved list', 'info');
  }, [showNotification]);

  // ─── Apply Discount Code ──────────────────────────────────────
  const applyDiscountCode = useCallback((code) => {
    const upperCode = code.toUpperCase().trim();
    const discount = DISCOUNT_CODES[upperCode];
    if (discount) {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const rawDiscount = subtotal * (discount.percentage / 100);
      const actualDiscount = Math.min(rawDiscount, discount.maxDiscount);
      setAppliedDiscount({ code: upperCode, amount: actualDiscount, label: discount.label });
      showNotification(`Discount "${upperCode}" applied! You save $${actualDiscount.toFixed(2)}`);
      return true;
    } else {
      showNotification('Invalid discount code. Try LUXURY10, BOOKS20, WELCOME5, or VIP30.', 'error');
      return false;
    }
  }, [cartItems, showNotification]);

  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null);
    showNotification('Discount removed', 'info');
  }, [showNotification]);

  // ─── Clear Cart ────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedDiscount(null);
  }, []);

  // ─── Computed Values (memoized) ────────────────────────────────
  const cartCount = useMemo(() =>
    cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(() =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalSavings = useMemo(() =>
    cartItems.reduce((acc, item) =>
      acc + (item.originalPrice - item.price) * item.quantity, 0),
    [cartItems]
  );

  const tax = useMemo(() => subtotal * 0.10, [subtotal]);
  const delivery = useMemo(() => subtotal > 50 ? 0 : 5.0, [subtotal]);
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const total = useMemo(() =>
    Math.max(0, subtotal + tax + delivery - discountAmount),
    [subtotal, tax, delivery, discountAmount]
  );

  const value = {
    // State
    cartItems,
    savedItems,
    appliedDiscount,
    notification,
    // Computed
    cartCount,
    subtotal,
    totalSavings,
    tax,
    delivery,
    discountAmount,
    total,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    saveForLater,
    moveToCart,
    removeFromSaved,
    applyDiscountCode,
    removeDiscount,
    clearCart,
    setCartItems,
    showNotification,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
