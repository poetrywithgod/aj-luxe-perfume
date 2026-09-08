"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  price: number;
  volumeMl?: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aj-luxe-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Client-only persistence — no server-side cart yet, so this resets if
  // the person clears storage or switches devices. Fine for pre-checkout
  // browsing; swap for a real persisted cart once accounts/checkout exist.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Reading persisted state after mount (not in the initial render) is
      // what keeps server and first-client-render output identical; doing
      // this in useState's initializer instead would read localStorage
      // during SSR-hydration and cause a real mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage write failures (e.g. private browsing quota)
    }
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...current, { ...item, qty }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (productId) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  };

  const setQty: CartContextValue["setQty"] = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  };

  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQty, clear, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
