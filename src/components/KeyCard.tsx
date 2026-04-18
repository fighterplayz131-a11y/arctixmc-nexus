import { Key, Plus } from "lucide-react";
import { useStore } from "@/lib/store-context";
import type { CrateKey } from "@/lib/store-defaults";
import { toast } from "sonner";
import { GemBurstButton } from "@/components/GemBurstButton";
import { WishlistHeart } from "@/components/WishlistHeart";

export function KeyCard({ item }: { item: CrateKey }) {
  const { addToCart } = useStore();
  return (
    <div className="relative rounded-xl bg-card/80 border border-border p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 flex flex-col">
      <WishlistHeart itemId={`key-${item.id}`} itemType="key" itemName={item.name} itemPrice={item.price} />
      <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
        <Key className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-display text-lg font-bold mb-2 text-foreground leading-tight">{item.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{item.description}</p>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
        <span className="text-xl font-bold text-foreground">रु {item.price}</span>
        <GemBurstButton
          size="sm"
          onClick={() => {
            addToCart({ id: `key-${item.id}`, type: "key", name: item.name, price: item.price });
            toast.success(`${item.name} added to cart`);
          }}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add
        </GemBurstButton>
      </div>
    </div>
  );
}
