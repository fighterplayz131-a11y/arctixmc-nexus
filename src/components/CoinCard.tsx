import { Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store-context";
import type { CoinPack } from "@/lib/store-defaults";
import { toast } from "sonner";

export function CoinCard({ pack }: { pack: CoinPack }) {
  const { addToCart } = useStore();
  return (
    <div className="relative group rounded-2xl glass-strong p-6 transition-all hover:-translate-y-1 hover:glow-primary text-center">
      {pack.bonus && (
        <Badge className="absolute -top-3 right-4 bg-amber-400/90 text-amber-950 border-0">Bonus {pack.bonus}</Badge>
      )}
      <div className="mx-auto h-16 w-16 rounded-full bg-amber-400/10 flex items-center justify-center mb-3 group-hover:animate-float">
        <Coins className="h-8 w-8 text-amber-400" />
      </div>
      <div className="font-display text-3xl font-bold gradient-text mb-1">{pack.coins.toLocaleString()}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Coins</div>
      <div className="text-2xl font-bold mb-4">रु {pack.price}</div>
      <Button
        onClick={() => {
          addToCart({ id: `coin-${pack.id}`, type: "coins", name: `${pack.coins.toLocaleString()} Coins`, price: pack.price });
          toast.success(`${pack.coins.toLocaleString()} coins added to cart`);
        }}
        className="w-full gradient-primary text-primary-foreground glow-primary"
      >
        <Plus className="h-4 w-4 mr-1" /> Add to Cart
      </Button>
    </div>
  );
}
