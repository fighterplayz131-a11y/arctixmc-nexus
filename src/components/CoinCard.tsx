import { Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store-context";
import type { CoinPack } from "@/lib/store-defaults";
import { toast } from "sonner";

export function CoinCard({ pack }: { pack: CoinPack }) {
  const { addToCart } = useStore();
  return (
    <div className="relative rounded-xl bg-card/60 border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 text-center">
      {pack.bonus && (
        <Badge className="absolute top-3 right-3 bg-amber-400 text-amber-950 border-0">{pack.bonus}</Badge>
      )}
      <div className="mx-auto h-14 w-14 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-3">
        <Coins className="h-7 w-7 text-amber-400" />
      </div>
      <div className="font-display text-3xl font-bold text-foreground mb-1">{pack.coins.toLocaleString()}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Coins</div>
      <div className="text-xl font-bold mb-4">रु {pack.price}</div>
      <Button
        onClick={() => {
          addToCart({ id: `coin-${pack.id}`, type: "coins", name: `${pack.coins.toLocaleString()} Coins`, price: pack.price });
          toast.success(`${pack.coins.toLocaleString()} coins added to cart`);
        }}
        className="w-full gradient-primary text-primary-foreground"
      >
        <Plus className="h-4 w-4 mr-1" /> Add to Cart
      </Button>
    </div>
  );
}
