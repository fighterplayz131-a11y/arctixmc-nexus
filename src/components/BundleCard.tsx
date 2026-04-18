import { Package, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store-context";
import { toast } from "sonner";
import { GemBurstButton } from "@/components/GemBurstButton";
import { WishlistHeart } from "@/components/WishlistHeart";

export type Bundle = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number;
  items: { name: string; type: string; quantity?: number }[];
  image_url: string | null;
  active: boolean;
};

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addToCart } = useStore();
  const save = bundle.original_price > bundle.price ? Math.round(((bundle.original_price - bundle.price) / bundle.original_price) * 100) : 0;

  return (
    <div className="relative rounded-xl bg-card/80 border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 flex flex-col">
      <WishlistHeart itemId={`bundle-${bundle.id}`} itemType="key" itemName={bundle.name} itemPrice={bundle.price} />
      {save > 0 && (
        <Badge className="absolute top-3 right-3 bg-emerald-500 text-emerald-950 border-0 font-semibold">Save {save}%</Badge>
      )}
      {bundle.image_url ? (
        <img src={bundle.image_url} alt={bundle.name} className="w-full h-32 object-cover rounded-lg mb-3" />
      ) : (
        <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
          <Package className="h-7 w-7 text-primary" />
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-foreground mb-1.5">{bundle.name}</h3>
      {bundle.description && (
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{bundle.description}</p>
      )}
      <div className="space-y-1 mb-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Includes</div>
        <ul className="text-xs text-foreground space-y-1">
          {bundle.items.map((it, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {it.quantity && it.quantity > 1 ? `${it.quantity}× ` : ""}{it.name}
              <span className="text-muted-foreground">({it.type})</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-end justify-between gap-2 pt-3 mt-auto border-t border-border">
        <div>
          {bundle.original_price > bundle.price && (
            <div className="text-xs text-muted-foreground line-through leading-none">रु {bundle.original_price}</div>
          )}
          <div className="text-xl font-bold text-foreground mt-1">रु {bundle.price}</div>
        </div>
        <GemBurstButton
          size="sm"
          onClick={() => {
            addToCart({ id: `bundle-${bundle.id}`, type: "key", name: bundle.name, price: bundle.price });
            toast.success(`${bundle.name} added to cart`);
          }}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add
        </GemBurstButton>
      </div>
    </div>
  );
}
