import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { GemBurstButton } from "@/components/GemBurstButton";
import { Gift } from "lucide-react";
import { toast } from "sonner";

export function DailyReward() {
  const { username, settings } = useStore();
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!username) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("daily_rewards")
        .select("claimed_at")
        .eq("username", username)
        .order("claimed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setLastClaim(data?.claimed_at ?? null);
      setLoading(false);
    })();
  }, [username]);

  if (!settings.dailyRewardEnabled) return null;
  if (!username) return null;
  if (loading) return null;

  const canClaim = !lastClaim || Date.now() - new Date(lastClaim).getTime() > 24 * 3600 * 1000;
  const nextHrs = lastClaim ? Math.max(0, Math.ceil((24 * 3600 * 1000 - (Date.now() - new Date(lastClaim).getTime())) / (3600 * 1000))) : 0;

  async function claim() {
    if (!username) return;
    setClaiming(true);
    const { error } = await supabase.from("daily_rewards").insert({
      username,
      reward_type: "coins",
      amount: settings.dailyRewardCoins,
    });
    setClaiming(false);
    if (error) { toast.error("Could not claim reward"); return; }
    toast.success(`+${settings.dailyRewardCoins} coins claimed! Coins will be delivered in-game.`);
    setLastClaim(new Date().toISOString());
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-primary/15 border border-amber-400/30 p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
        <Gift className="h-6 w-6 text-amber-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-foreground">Daily Reward</div>
        <div className="text-xs text-muted-foreground">
          {canClaim ? `Claim ${settings.dailyRewardCoins} free coins!` : `Next claim in ~${nextHrs}h`}
        </div>
      </div>
      <GemBurstButton
        disabled={!canClaim || claiming}
        onClick={claim}
        className="gradient-primary text-primary-foreground"
      >
        {canClaim ? "Claim" : "Claimed"}
      </GemBurstButton>
    </div>
  );
}
