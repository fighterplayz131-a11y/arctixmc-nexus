import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WishlistItem = {
  id: string;
  item_id: string;
  item_type: string;
  item_name: string;
  item_price: number;
};

type Ctx = {
  items: WishlistItem[];
  loading: boolean;
  add: (item: { item_id: string; item_type: string; item_name: string; item_price: number }) => Promise<void>;
  remove: (item_id: string) => Promise<void>;
  has: (item_id: string) => boolean;
  refresh: () => Promise<void>;
};

const WishlistCtx = createContext<Ctx | null>(null);

export function WishlistProvider({ username, children }: { username: string | null; children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!username) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase.from("wishlist").select("id,item_id,item_type,item_name,item_price").eq("username", username);
    setItems((data ?? []) as WishlistItem[]);
    setLoading(false);
  }, [username]);

  useEffect(() => { refresh(); }, [refresh]);

  const add: Ctx["add"] = async (item) => {
    if (!username) return;
    await supabase.from("wishlist").upsert({ username, ...item }, { onConflict: "username,item_id" });
    refresh();
  };
  const remove: Ctx["remove"] = async (item_id) => {
    if (!username) return;
    await supabase.from("wishlist").delete().eq("username", username).eq("item_id", item_id);
    refresh();
  };
  const has = (item_id: string) => items.some((i) => i.item_id === item_id);

  return <WishlistCtx.Provider value={{ items, loading, add, remove, has, refresh }}>{children}</WishlistCtx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistCtx);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
