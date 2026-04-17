import { Key, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store-context";
import type { CrateKey } from "@/lib/store-defaults";
import { toast } from "sonner";

export function KeyCard({ item }: { item: CrateKey }) {
  const { addToCart } = useStore();
  return (
    <div className="rounded-2xl glass-strong p-6 transition-all hover:-translate-y-1 hover:glow-primary flex flex-col">
      <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-4 glow-primary">
        <Key className="h-7 w-7 text-primary-foreground" />
      </div>
      <h3 className="font-display text-lg font-bold mb-2">{item.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold gradient-text">रु {item.price}</span>
        <Button
          size="sm"
          onClick={() => {
            addToCart({ id: `key-${item.id}`, type: "key", name: item.name, price: item.price });
            toast.success(`${item.name} added to cart`);
          }}
          className="gradient-primary text-primary-foreground glow-primary"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}
