import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store-context";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RankCard } from "@/components/RankCard";
import { CoinCard } from "@/components/CoinCard";
import { KeyCard } from "@/components/KeyCard";
import { BundleCard, type Bundle } from "@/components/BundleCard";
import { Crown, Coins, Key, Package } from "lucide-react";

export default function StorePage() {
  const { ranks, coins, keys } = useStore();
  const visibleCoins = coins.filter((c) => c.visible !== false);
  const activeKeys = keys.filter((k) => k.active !== false);
  const [bundles, setBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    supabase.from("bundles").select("*").eq("active", true).order("created_at", { ascending: false }).then(({ data }) => {
      setBundles((data ?? []).map((b: { items: unknown }) => ({ ...b, items: Array.isArray(b.items) ? b.items : [] })) as Bundle[]);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 animate-fade-in">
      <Helmet>
        <title>Store — ArctixMC</title>
        <meta name="description" content="Browse ArctixMC ranks, coin packages, crate keys and bundles." />
        <meta property="og:title" content="ArctixMC Store" />
        <meta property="og:description" content="Premium ranks, coins, keys and bundles for ArctixMC." />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">Store</h1>
        <p className="text-muted-foreground text-sm">Support the server and unlock exclusive perks</p>
      </div>

      <Tabs defaultValue="ranks" className="w-full">
        <TabsList className="mx-auto flex w-full max-w-2xl bg-card/70 border border-border h-11 p-1">
          <TabsTrigger value="ranks" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
            <Crown className="h-4 w-4 mr-1.5" /> Ranks
          </TabsTrigger>
          <TabsTrigger value="coins" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
            <Coins className="h-4 w-4 mr-1.5" /> Coins
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
            <Key className="h-4 w-4 mr-1.5" /> Keys
          </TabsTrigger>
          <TabsTrigger value="bundles" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
            <Package className="h-4 w-4 mr-1.5" /> Bundles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranks" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ranks.map((r) => <RankCard key={r.id} rank={r} />)}
          </div>
        </TabsContent>
        <TabsContent value="coins" className="mt-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visibleCoins.map((c) => <CoinCard key={c.id} pack={c} />)}
          </div>
        </TabsContent>
        <TabsContent value="keys" className="mt-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeKeys.map((k) => <KeyCard key={k.id} item={k} />)}
          </div>
        </TabsContent>
        <TabsContent value="bundles" className="mt-8">
          {bundles.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-12">No bundles available right now. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
