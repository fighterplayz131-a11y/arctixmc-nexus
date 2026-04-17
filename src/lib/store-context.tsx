import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  defaultRanks,
  defaultCoins,
  defaultKeys,
  defaultSettings,
  type Rank,
  type CoinPack,
  type CrateKey,
  type Settings,
} from "./store-defaults";

export type CartItem = {
  id: string;
  type: "rank" | "coins" | "key";
  name: string;
  price: number;
  quantity: number;
};

type StoreState = {
  ranks: Rank[];
  coins: CoinPack[];
  keys: CrateKey[];
  settings: Settings;
  username: string | null;
  cart: CartItem[];
  setRanks: (r: Rank[]) => void;
  setCoins: (c: CoinPack[]) => void;
  setKeys: (k: CrateKey[]) => void;
  setSettings: (s: Settings) => void;
  login: (username: string) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
};

const StoreCtx = createContext<StoreState | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ranks, setRanksState] = useState<Rank[]>(defaultRanks);
  const [coins, setCoinsState] = useState<CoinPack[]>(defaultCoins);
  const [keys, setKeysState] = useState<CrateKey[]>(defaultKeys);
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [username, setUsername] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRanksState(load("arctix:ranks", defaultRanks));
    setCoinsState(load("arctix:coins", defaultCoins));
    setKeysState(load("arctix:keys", defaultKeys));
    setSettingsState(load("arctix:settings", defaultSettings));
    setUsername(load<string | null>("arctix:user", null));
    setCart(load<CartItem[]>("arctix:cart", []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("arctix:ranks", JSON.stringify(ranks)); }, [ranks, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("arctix:coins", JSON.stringify(coins)); }, [coins, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("arctix:keys", JSON.stringify(keys)); }, [keys, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("arctix:settings", JSON.stringify(settings)); }, [settings, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("arctix:cart", JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    if (username) localStorage.setItem("arctix:user", JSON.stringify(username));
    else localStorage.removeItem("arctix:user");
  }, [username, hydrated]);

  const value: StoreState = {
    ranks, coins, keys, settings, username, cart,
    setRanks: setRanksState,
    setCoins: setCoinsState,
    setKeys: setKeysState,
    setSettings: setSettingsState,
    login: (u) => setUsername(u),
    logout: () => setUsername(null),
    addToCart: (item) => setCart((c) => {
      const existing = c.find((i) => i.id === item.id);
      if (existing) return c.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...c, { ...item, quantity: 1 }];
    }),
    removeFromCart: (id) => setCart((c) => c.filter((i) => i.id !== id)),
    updateQuantity: (id, qty) => setCart((c) => c.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
    clearCart: () => setCart([]),
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
