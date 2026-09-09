"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  deliveryLocation: "within-ph" | "outside-ph";
  note: string;
};

type CheckoutContextValue = {
  shipping: ShippingDetails | null;
  setShipping: (details: ShippingDetails) => void;
  clearShipping: () => void;
  // False until sessionStorage has been read on mount — consumers that
  // redirect away when `shipping` is missing should wait for this,
  // otherwise they'd bounce on every load before the restore finishes.
  hydrated: boolean;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

const STORAGE_KEY = "aj-luxe-checkout-shipping";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [shipping, setShippingState] = useState<ShippingDetails | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // sessionStorage (not localStorage, unlike the cart) — shipping details
  // are only meant to survive the Cart → Shipping → Payment →
  // Confirmation hop within one checkout attempt, not linger across
  // browser sessions the way the cart itself should.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setShippingState(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    } finally {
      setHydrated(true);
    }
  }, []);

  function setShipping(details: ShippingDetails) {
    setShippingState(details);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(details));
    } catch {
      // ignore storage write failures (e.g. private browsing quota)
    }
  }

  function clearShipping() {
    setShippingState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <CheckoutContext.Provider
      value={{ shipping, setShipping, clearShipping, hydrated }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within a CheckoutProvider");
  return ctx;
}
