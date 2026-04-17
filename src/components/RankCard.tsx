import { useState } from "react";
import { Check, Plus, ChevronDown } from "lucide-react";
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
      className="relative group rounded-xl bg-card/80 border transition-all hover:-translate-y-0.5 flex flex-col overflow-hidden"
      style={{ borderColor: `${rank.color}40` }}
    >
      {rank.tag && (
        <Badge
          className="absolute top-3 right-3 z-10 border-0 text-[10px] font-bold tracking-wider px-2 py-0.5"
          style={{ background: rank.color, color: "#0b1020" }}
        >
          {rank.tag}
        </Badge>
      )}

      <div
        className="h-36 flex items-center justify-center border-b"
        style={{
          background: `linear-gradient(135deg, ${rank.color}1F, transparent 70%)`,
          borderColor: `${rank.color}26`,
        }}
      >
        {rank.image ? (
          <img
            src={rank.image}
            alt={`${rank.name} rank`}
            className="h-28 w-28 object-contain transition-transform group-hover:scale-105"
            loading="lazy"
            width={224}
            height={224}
          />
        ) : (
          <div
            className="h-20 w-20 rounded-xl flex items-center justify-center text-2xl font-display font-bold"
            style={{ background: `${rank.color}33`, color: rank.color }}
          >
            {rank.name.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3
          className="text-center font-display text-xl font-bold tracking-wider mb-2 leading-tight"
          style={{ color: rank.color }}
        >
          {rank.name}
        </h3>

        <div className="text-center mb-4">
          <span className="text-xs text-muted-foreground line-through mr-2">रु {rank.price}</span>
          <span className="text-2xl font-bold text-foreground">रु {rank.discountPrice}</span>
          {discount > 0 && (
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: rank.color }}>
              Save {discount}%
            </div>
          )}
        </div>

        <ul className="space-y-1.5 mb-4 flex-1">
          {(expanded ? rank.perks : rank.perks.slice(0, 4)).map((perk, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/85 leading-snug">
              <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: rank.color }} />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        {rank.perks.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground mb-3 flex items-center justify-center gap-1 transition-colors"
          >
            {expanded ? "Show less" : `Show ${rank.perks.length - 4} more`}
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        <Button
          onClick={() => {
            addToCart({ id: `rank-${rank.id}`, type: "rank", name: rank.name + " Rank", price: rank.discountPrice });
            toast.success(`${rank.name} added to cart`);
          }}
          className="w-full font-semibold border-0"
          style={{ background: rank.color, color: "#0b1020" }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
