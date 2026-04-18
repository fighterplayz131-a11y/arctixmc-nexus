import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import type { Rank } from "@/lib/store-defaults";

type Upgrade = {
  canUpgrade: boolean;
  fromRank: Rank | null;
  upgradePrice: number;
};

/**
 * Detects the user's currently-owned rank from completed/pending invoices.
 * If they own a cheaper rank, returns the price-difference upgrade offer.
 */
export function useRankUpgrade(targetRank: Rank, allRanks: Rank[]): Upgrade {
  const { username } = useStore();
  const [ownedRankId, setOwnedRankId] = useState<string | null>(null);

  useEffect(() => {
    if (!username) { setOwnedRankId(null); return; }
    (async () => {
      const { data } = await supabase
        .from("invoices")
        .select("items,status")
        .ilike("username", username);
      if (!data) return;
      // Find highest-priced rank owned among non-cancelled invoices
      let best: { id: string; price: number } | null = null;
      for (const inv of data) {
        if (inv.status === "cancelled") continue;
        const items = (inv.items ?? []) as Array<{ id?: string; type?: string }>;
        for (const it of items) {
          if (it.type !== "rank" || !it.id) continue;
          const rid = it.id.replace(/^rank-/, "");
          const r = allRanks.find((x) => x.id === rid);
          if (!r) continue;
          if (!best || r.discountPrice > best.price) best = { id: r.id, price: r.discountPrice };
        }
      }
      setOwnedRankId(best?.id ?? null);
    })();
  }, [username, allRanks]);

  if (!ownedRankId) return { canUpgrade: false, fromRank: null, upgradePrice: targetRank.discountPrice };
  if (ownedRankId === targetRank.id) return { canUpgrade: false, fromRank: null, upgradePrice: 0 };
  const owned = allRanks.find((r) => r.id === ownedRankId) ?? null;
  if (!owned) return { canUpgrade: false, fromRank: null, upgradePrice: targetRank.discountPrice };
  if (owned.discountPrice >= targetRank.discountPrice) {
    return { canUpgrade: false, fromRank: null, upgradePrice: targetRank.discountPrice };
  }
  return {
    canUpgrade: true,
    fromRank: owned,
    upgradePrice: Math.max(1, targetRank.discountPrice - owned.discountPrice),
  };
}
