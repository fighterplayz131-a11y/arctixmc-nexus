import { Coins, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store-context";
import type { CoinPack } from "@/lib/store-defaults";
import { toast } from "sonner";
import { GemBurstButton } from "@/components/GemBurstButton";

export function CoinCard({ pack }: { pack: CoinPack }) {
  const { addToCart } = useStore();
  return (
    <div className="relative rounded-xl bg-card/80 border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 text-center flex flex-col">
      {pack.bonus && (
        <Badge className="absolute top-3 right-3 bg-amber-400 text-amber-950 border-0 font-semibold">{pack.bonus}</Badge>
      )}
      <div className="mx-auto h-14 w-14 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-3">
        <Coins className="h-7 w-7 text-amber-400" />
      </div>
      <div className="font-display text-3xl font-bold text-foreground mb-1 leading-none">{pack.coins.toLocaleString()}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4 mt-1">Coins</div>
      <div className="text-xl font-bold text-foreground mb-4">रु {pack.price}</div>
      <GemBurstButton
        onClick={() => {
          addToCart({ id: `coin-${pack.id}`, type: "coins", name: `${pack.coins.toLocaleString()} Coins`, price: pack.price });
          toast.success(`${pack.coins.toLocaleString()} coins added to cart`);
        }}
        className="w-full gradient-primary text-primary-foreground mt-auto"
      >
        <Plus className="h-4 w-4" /> Add to Cart
      </GemBurstButton>
    </div>
  );
}
