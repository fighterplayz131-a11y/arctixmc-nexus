import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useStore } from "@/lib/store-context";
import { toast } from "sonner";

export function WishlistHeart({
  itemId,
  itemType,
  itemName,
  itemPrice,
  className = "",
}: {
  itemId: string;
  itemType: "rank" | "coins" | "key";
  itemName: string;
  itemPrice: number;
  className?: string;
}) {
  const { username } = useStore();
  const wishlist = useWishlist();
  const saved = wishlist.has(itemId);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!username) {
      toast.error("Login to save items to your wishlist");
      return;
    }
    if (saved) {
      await wishlist.remove(itemId);
      toast.success("Removed from wishlist");
    } else {
      await wishlist.add({ item_id: itemId, item_type: itemType, item_name: itemName, item_price: itemPrice });
      toast.success("Added to wishlist");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`absolute top-3 left-3 z-10 h-8 w-8 inline-flex items-center justify-center rounded-full bg-background/70 backdrop-blur border border-border hover:scale-110 transition-transform ${className}`}
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
    </button>
  );
}
