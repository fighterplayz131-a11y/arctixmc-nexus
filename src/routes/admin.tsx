import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Lock, LogOut, Plus, Trash2, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Rank, CoinPack, CrateKey } from "@/lib/store-defaults";

const ADMIN_USER = "admin";
const ADMIN_PASS = "arctix2025";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ArctixMC" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("arctix:admin") === "1";
  });
  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { localStorage.removeItem("arctix:admin"); setAuthed(false); }} />;
}

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      localStorage.setItem("arctix:admin", "1");
      onAuth();
    } else setErr("Invalid credentials");
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl glass-strong p-8 space-y-4">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-full gradient-primary flex items-center justify-center glow-primary mb-3">
            <Lock className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">ArctixMC Store Management</p>
        </div>
        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={u} onChange={(e) => setU(e.target.value)} autoFocus />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" value={p} onChange={(e) => setP(e.target.value)} />
        </div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <Button type="submit" className="w-full gradient-primary text-primary-foreground glow-primary">Sign In</Button>
        <p className="text-xs text-muted-foreground text-center">Demo: admin / arctix2025</p>
      </form>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="glass-strong border-b border-border sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground glow-primary">A</div>
            <div>
              <div className="font-display font-bold gradient-text">ArctixMC Admin</div>
              <div className="text-xs text-muted-foreground">Store management dashboard</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/"><Button variant="outline" size="sm" className="glass"><Eye className="h-4 w-4 mr-1.5" /> View Store</Button></Link>
            <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="h-4 w-4 mr-1.5" /> Logout</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <Tabs defaultValue="ranks">
          <TabsList className="glass-strong">
            <TabsTrigger value="ranks">Ranks</TabsTrigger>
            <TabsTrigger value="coins">Coins</TabsTrigger>
            <TabsTrigger value="keys">Crate Keys</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="ranks" className="mt-6"><RanksAdmin /></TabsContent>
          <TabsContent value="coins" className="mt-6"><CoinsAdmin /></TabsContent>
          <TabsContent value="keys" className="mt-6"><KeysAdmin /></TabsContent>
          <TabsContent value="settings" className="mt-6"><SettingsAdmin /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RanksAdmin() {
  const { ranks, setRanks } = useStore();
  function update(idx: number, patch: Partial<Rank>) {
    setRanks(ranks.map((r, i) => i === idx ? { ...r, ...patch } : r));
  }
  function add() {
    setRanks([...ranks, { id: `rank-${Date.now()}`, name: "NEW RANK", price: 999, discountPrice: 699, perks: ["New perk"], commands: [], tag: "", color: "#00d4ff" }]);
  }
  function remove(idx: number) { setRanks(ranks.filter((_, i) => i !== idx)); toast.success("Rank deleted"); }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-bold">Manage Ranks</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Rank</Button>
      </div>
      {ranks.map((r, idx) => (
        <Card key={r.id} className="glass-strong border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg" style={{ background: r.color, boxShadow: `0 0 20px ${r.color}55` }} />
              <span className="font-display text-lg font-bold">{r.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(idx)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div><Label className="text-xs">Name</Label><Input value={r.name} onChange={(e) => update(idx, { name: e.target.value })} /></div>
            <div><Label className="text-xs">Original Price</Label><Input type="number" value={r.price} onChange={(e) => update(idx, { price: +e.target.value })} /></div>
            <div><Label className="text-xs">Discount Price</Label><Input type="number" value={r.discountPrice} onChange={(e) => update(idx, { discountPrice: +e.target.value })} /></div>
            <div><Label className="text-xs">Color</Label><Input type="color" value={r.color} onChange={(e) => update(idx, { color: e.target.value })} className="h-10 p-1" /></div>
            <div><Label className="text-xs">Tag</Label>
              <select value={r.tag} onChange={(e) => update(idx, { tag: e.target.value as Rank["tag"] })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border">
                <option value="">None</option>
                <option value="Best Value">Best Value</option>
                <option value="Popular">Popular</option>
              </select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Perks (one per line)</Label>
            <Textarea rows={4} value={r.perks.join("\n")} onChange={(e) => update(idx, { perks: e.target.value.split("\n").filter(Boolean) })} />
          </div>
          <div>
            <Label className="text-xs">Commands (one per line)</Label>
            <Textarea rows={2} value={r.commands.join("\n")} onChange={(e) => update(idx, { commands: e.target.value.split("\n").filter(Boolean) })} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function CoinsAdmin() {
  const { coins, setCoins } = useStore();
  function update(idx: number, patch: Partial<CoinPack>) { setCoins(coins.map((c, i) => i === idx ? { ...c, ...patch } : c)); }
  function add() { setCoins([...coins, { id: `c-${Date.now()}`, coins: 1000, price: 100 }]); }
  function remove(idx: number) { setCoins(coins.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-bold">Manage Coin Packages</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Package</Button>
      </div>
      {coins.map((c, idx) => (
        <Card key={c.id} className="glass-strong p-4 grid md:grid-cols-4 gap-3 items-end">
          <div><Label className="text-xs">Coins</Label><Input type="number" value={c.coins} onChange={(e) => update(idx, { coins: +e.target.value })} /></div>
          <div><Label className="text-xs">Price (रु)</Label><Input type="number" value={c.price} onChange={(e) => update(idx, { price: +e.target.value })} /></div>
          <div><Label className="text-xs">Bonus tag</Label><Input placeholder="+10%" value={c.bonus ?? ""} onChange={(e) => update(idx, { bonus: e.target.value })} /></div>
          <Button variant="ghost" onClick={() => remove(idx)} className="text-destructive"><Trash2 className="h-4 w-4 mr-1" /> Remove</Button>
        </Card>
      ))}
    </div>
  );
}

function KeysAdmin() {
  const { keys, setKeys } = useStore();
  function update(idx: number, patch: Partial<CrateKey>) { setKeys(keys.map((k, i) => i === idx ? { ...k, ...patch } : k)); }
  function add() { setKeys([...keys, { id: `k-${Date.now()}`, name: "New Crate Key", description: "Description", price: 99 }]); }
  function remove(idx: number) { setKeys(keys.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-bold">Manage Crate Keys</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Key</Button>
      </div>
      {keys.map((k, idx) => (
        <Card key={k.id} className="glass-strong p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div><Label className="text-xs">Name</Label><Input value={k.name} onChange={(e) => update(idx, { name: e.target.value })} /></div>
            <div><Label className="text-xs">Price (रु)</Label><Input type="number" value={k.price} onChange={(e) => update(idx, { price: +e.target.value })} /></div>
            <Button variant="ghost" onClick={() => remove(idx)} className="text-destructive self-end"><Trash2 className="h-4 w-4 mr-1" /> Remove</Button>
          </div>
          <div><Label className="text-xs">Description</Label><Textarea rows={2} value={k.description} onChange={(e) => update(idx, { description: e.target.value })} /></div>
        </Card>
      ))}
    </div>
  );
}

function SettingsAdmin() {
  const { settings, setSettings } = useStore();
  const [draft, setDraft] = useState(settings);
  return (
    <Card className="glass-strong p-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-xl font-bold">Store Settings</h2>
      <div className="grid gap-4">
        <div><Label>Server Name</Label><Input value={draft.serverName} onChange={(e) => setDraft({ ...draft, serverName: e.target.value })} /></div>
        <div><Label>Server IP</Label><Input value={draft.serverIp} onChange={(e) => setDraft({ ...draft, serverIp: e.target.value })} /></div>
        <div><Label>Hero Title</Label><Input value={draft.heroTitle} onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })} /></div>
        <div><Label>Hero Subtitle</Label><Input value={draft.heroSubtitle} onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })} /></div>
        <div><Label>Primary Color</Label><Input type="color" value={draft.primaryColor} onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })} className="h-10 p-1 w-32" /></div>
      </div>
      <Button onClick={() => { setSettings(draft); toast.success("Settings saved"); }} className="gradient-primary text-primary-foreground glow-primary">
        <Save className="h-4 w-4 mr-1.5" /> Save Settings
      </Button>
    </Card>
  );
}
