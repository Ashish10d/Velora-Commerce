import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);
const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read('velora-cart', []));
  const [wishlist, setWishlist] = useState(() => read('velora-wishlist', []));
  const [user, setUser] = useState(() => read('velora-user', null));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem('velora-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('velora-wishlist', JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (product, variant = {}) => {
    setCart((items) => {
      const index = items.findIndex((item) => item._id === product._id && item.size === variant.size && item.color === variant.color);
      if (index >= 0) return items.map((item, itemIndex) => itemIndex === index ? { ...item, qty: item.qty + 1 } : item);
      return [...items, { ...product, ...variant, qty: 1 }];
    });
    setCartOpen(true);
  };

  const toggleWishlist = (product) => setWishlist((items) => items.some((item) => item._id === product._id) ? items.filter((item) => item._id !== product._id) : [...items, product]);
  const isWishlisted = (productId) => wishlist.some((item) => item._id === productId);
  const value = useMemo(() => ({ cart, setCart, cartOpen, setCartOpen, addToCart, wishlist, toggleWishlist, isWishlisted, user, setUser }), [cart, cartOpen, wishlist, user]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
