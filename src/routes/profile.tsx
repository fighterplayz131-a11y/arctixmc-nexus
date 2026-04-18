import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Coins, Trophy, Receipt, Heart, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/lib/wishlist-context";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — ArctixMC" }] }),
  component: ProfilePage,
});

type Profile = {
  username: string;
  display_name: string | null;
  total_spent: number;
  loyalty_points: number;
  referral_code: string | null;
};

type Invoice = { id: string; invoice_no: number; total: number; status: string; created_at: string };

function ProfilePage() {
  const { username, settings } = useStore();
  const wishlist = useWishlist();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookup, setLookup] = useState("");

  const activeUser = username ?? lookup;

  useEffect(() => {
    if (!activeUser) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      // Ensure profile row exists
      let { data } = await supabase.from("profiles").select("*").eq("username", activeUser).maybeSingle();
      if (!data && username && username === activeUser) {
        const refCode = activeUser.toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
        const { data: created } = await supabase.from("profiles").insert({
          username: activeUser, referral_code: refCode,
        }).select("*").single();
        data = created;
      }
      setProfile(data as Profile | null);

      // Aggregate spent + loyalty from invoices
      const { data: invs } = await supabase
        .from("invoices")
        .select("id,invoice_no,total,status,created_at")
        .ilike("username", activeUser)
        .order("created_at", { ascending: false });
      setInvoices((invs ?? []) as Invoice[]);
      setLoading(false);
    })();
  }, [activeUser, username]);

  const totalSpent = invoices.filter((i) => i.status !== "cancelled").reduce((s, i) => s + Number(i.total), 0);
  const loyaltyPoints = Math.floor(totalSpent * settings.loyaltyPointsPerRupee);

  function copyReferral() {
    if (!profile?.referral_code) return;
    const url = `${window.location.origin}/?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(url);
    toast.success("Referral link copied!");
  }

  if (!activeUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-fade-in">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h1 className="font-display text-2xl font-bold mb-2">Player Profile</h1>
        <p className="text-sm text-muted-foreground mb-4">Login or look up a player by username.</p>
        <div className="flex gap-2">
          <Input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder="Username" />
          <Button onClick={() => setLookup(lookup.trim())} className="gradient-primary text-primary-foreground">Look Up</Button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center py-16 text-muted-foreground">Loading profile…</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-xl gradient-primary flex items-center justify-center font-display text-2xl font-bold text-primary-foreground">
          {activeUser[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{profile?.display_name ?? activeUser}</h1>
          <div className="text-xs text-muted-foreground">@{activeUser}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Coins className="h-4 w-4" />} label="Total Spent" value={`रु ${totalSpent.toLocaleString()}`} />
        <StatCard icon={<Trophy className="h-4 w-4" />} label="Loyalty Points" value={loyaltyPoints.toLocaleString()} />
        <StatCard icon={<Receipt className="h-4 w-4" />} label="Orders" value={invoices.length.toString()} />
        <StatCard icon={<Heart className="h-4 w-4" />} label="Wishlist" value={wishlist.items.length.toString()} />
      </div>

      {settings.referralEnabled && profile?.referral_code && (
        <Card className="bg-card/70 border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Refer Friends</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Earn {settings.referralRewardCoins} coins for every friend who signs up using your link.</p>
          <div className="flex gap-2">
            <Input readOnly value={`${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${profile.referral_code}`} className="font-mono text-xs" />
            <Button onClick={copyReferral} className="gradient-primary text-primary-foreground"><Copy className="h-4 w-4" /></Button>
          </div>
        </Card>
      )}

      <Card className="bg-card/70 border-border p-5">
        <h2 className="font-display text-lg font-bold mb-3 text-foreground">Purchase History</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No purchases yet. <Link to="/store" className="text-primary hover:underline">Visit store</Link></p>
        ) : (
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between rounded-md bg-muted/30 border border-border p-3">
                <div>
                  <div className="text-sm font-mono text-primary">INV-{String(inv.invoice_no).padStart(4, "0")}</div>
                  <div className="text-xs text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={
                    inv.status === "completed" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]" :
                    inv.status === "cancelled" ? "bg-red-500/15 text-red-300 border-red-500/30 text-[10px]" :
                    "bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px]"
                  }>{inv.status}</Badge>
                  <span className="font-display font-bold text-foreground">रु {Number(inv.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {wishlist.items.length > 0 && (
        <Card className="bg-card/70 border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Wishlist</h2>
          </div>
          <ul className="space-y-2">
            {wishlist.items.map((w) => (
              <li key={w.id} className="flex items-center justify-between rounded-md bg-muted/30 border border-border p-3">
                <span className="text-sm text-foreground">{w.item_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">रु {w.item_price}</span>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => wishlist.remove(w.item_id)}>Remove</Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="bg-card/70 border-border p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">{icon}{label}</div>
      <div className="font-display text-xl font-bold text-foreground">{value}</div>
    </Card>
  );
}
