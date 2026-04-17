import { useState } from "react";
import { Crown, Check, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store-context";
import type { Rank } from "@/lib/store-defaults";
import { toast } from "sonner";

export function RankCard({ rank }: { rank: Rank }) {
  const { addToCart } = useStore();
  const [expanded, setExpanded] = useState(false);
  const discount = Math.round(((rank.price - rank.discountPrice) / rank.price) * 100);

  return (
    <div
      className="relative group rounded-2xl glass-strong p-6 transition-all hover:-translate-y-1 hover:glow-primary flex flex-col"
      style={{ borderColor: `${rank.color}40` }}
    >
      {rank.tag && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground border-0 glow-primary">
          {rank.tag}
        </Badge>
      )}

      <div className="flex items-center justify-center mb-4">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${rank.color}, ${rank.color}80)`, boxShadow: `0 0 30px ${rank.color}55` }}
        >
          <Crown className="h-8 w-8 text-white" />
        </div>
      </div>

      <h3 className="text-center font-display text-2xl font-bold tracking-widest mb-1" style={{ color: rank.color }}>
        {rank.name}
      </h3>

      <div className="text-center mb-5">
        <span className="text-sm text-muted-foreground line-through mr-2">रु {rank.price}</span>
        <span className="text-3xl font-bold gradient-text">रु {rank.discountPrice}</span>
        {discount > 0 && <div className="text-xs text-primary mt-1">Save {discount}%</div>}
      </div>

      <ul className="space-y-2 mb-5 flex-1">
        {(expanded ? rank.perks : rank.perks.slice(0, 4)).map((perk, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: rank.color }} />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      {rank.perks.length > 4 && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary hover:underline mb-3 flex items-center justify-center gap-1">
          {expanded ? "Show less" : `Show ${rank.perks.length - 4} more perks`}
          <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}

      <Button
        onClick={() => {
          addToCart({ id: `rank-${rank.id}`, type: "rank", name: rank.name + " Rank", price: rank.discountPrice });
          toast.success(`${rank.name} added to cart`);
        }}
        className="w-full gradient-primary text-primary-foreground hover:opacity-90 glow-primary"
      >
        <Plus className="h-4 w-4 mr-1" /> Add to Cart
      </Button>
    </div>
  );
}
