import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RankCard } from "@/components/RankCard";
import { CoinCard } from "@/components/CoinCard";
import { KeyCard } from "@/components/KeyCard";
import { Crown, Coins, Key } from "lucide-react";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Store — ArctixMC" },
      { name: "description", content: "Browse ArctixMC ranks, coin packages, and crate keys." },
      { property: "og:title", content: "ArctixMC Store" },
      { property: "og:description", content: "Premium ranks, coins, and crate keys for ArctixMC." },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { ranks, coins, keys } = useStore();
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-6xl font-bold gradient-text glow-text mb-3">Store</h1>
        <p className="text-muted-foreground">Support the server and unlock exclusive perks</p>
      </div>

      <Tabs defaultValue="ranks" className="w-full">
        <TabsList className="mx-auto flex w-full max-w-md glass-strong h-12 p-1">
          <TabsTrigger value="ranks" className="flex-1 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Crown className="h-4 w-4 mr-1.5" /> Ranks
          </TabsTrigger>
          <TabsTrigger value="coins" className="flex-1 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Coins className="h-4 w-4 mr-1.5" /> Coins
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex-1 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Key className="h-4 w-4 mr-1.5" /> Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranks" className="mt-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranks.map((r) => <RankCard key={r.id} rank={r} />)}
          </div>
        </TabsContent>
        <TabsContent value="coins" className="mt-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {coins.map((c) => <CoinCard key={c.id} pack={c} />)}
          </div>
        </TabsContent>
        <TabsContent value="keys" className="mt-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keys.map((k) => <KeyCard key={k.id} item={k} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
