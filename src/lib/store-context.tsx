import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  loaded: boolean;
  setRanks: (r: Rank[]) => Promise<void>;
  setCoins: (c: CoinPack[]) => Promise<void>;
  setKeys: (k: CrateKey[]) => Promise<void>;
  setSettings: (s: Settings) => Promise<void>;
  login: (username: string) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
};

const StoreCtx = createContext<StoreState | null>(null);

function loadLocal<T>(key: string, fallback: T): T {
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
  const [loaded, setLoaded] = useState(false);

  // Hydrate from local + remote
  useEffect(() => {
    setUsername(loadLocal<string | null>("arctix:user", null));
    setCart(loadLocal<CartItem[]>("arctix:cart", []));

    (async () => {
      const { data } = await supabase.from("store_config").select("data").eq("id", 1).maybeSingle();
      const cfg = (data?.data ?? {}) as Partial<{
        ranks: Rank[]; coins: CoinPack[]; keys: CrateKey[]; settings: Settings;
      }>;
      if (cfg.ranks?.length) setRanksState(cfg.ranks);
      if (cfg.coins?.length) setCoinsState(cfg.coins);
      if (cfg.keys?.length) setKeysState(cfg.keys);
      if (cfg.settings) setSettingsState({ ...defaultSettings, ...cfg.settings });
      setLoaded(true);
    })();
  }, []);

  // Persist cart + user
  useEffect(() => { if (loaded) localStorage.setItem("arctix:cart", JSON.stringify(cart)); }, [cart, loaded]);
  useEffect(() => {
    if (!loaded) return;
    if (username) localStorage.setItem("arctix:user", JSON.stringify(username));
    else localStorage.removeItem("arctix:user");
  }, [username, loaded]);

  const persist = useCallback(async (patch: Record<string, unknown>) => {
    const next = {
      ranks, coins, keys, settings,
      ...patch,
    };
    await supabase.from("store_config").upsert({ id: 1, data: next });
  }, [ranks, coins, keys, settings]);

  const value: StoreState = {
    ranks, coins, keys, settings, username, cart, loaded,
    setRanks: async (r) => { setRanksState(r); await persist({ ranks: r }); },
    setCoins: async (c) => { setCoinsState(c); await persist({ coins: c }); },
    setKeys: async (k) => { setKeysState(k); await persist({ keys: k }); },
    setSettings: async (s) => { setSettingsState(s); await persist({ settings: s }); },
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
