import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Lock, LogOut, Plus, Trash2, Save, Eye, Upload } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./tickets";
import type { Rank, CoinPack, CrateKey } from "@/lib/store-defaults";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ArctixMC" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setIsAdmin(false); setChecking(false); return; }
      supabase.rpc("has_role", { _user_id: s.user.id, _role: "admin" }).then(({ data }) => {
        setIsAdmin(!!data);
        setChecking(false);
      });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) { setChecking(false); return; }
      supabase.rpc("has_role", { _user_id: data.session.user.id, _role: "admin" }).then(({ data: ok }) => {
        setIsAdmin(!!ok);
        setChecking(false);
      });
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  if (checking) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!session || !isAdmin) return <AdminLogin />;
  return <AdminDashboard onLogout={async () => { await supabase.auth.signOut(); }} />;
}

function AdminLogin() {
  const [email, setEmail] = useState("admin@arctixmc.net");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) setErr(error.message);
      else toast.success("Account created. You can sign in now.");
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-card/70 border border-border p-7 space-y-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full gradient-primary flex items-center justify-center mb-3">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-muted-foreground mt-1">ArctixMC Store Management</p>
        </div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <Button type="submit" disabled={busy} className="w-full gradient-primary text-primary-foreground">
          {busy ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs text-muted-foreground hover:text-foreground w-full text-center">
          {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">Only the email <span className="text-primary">admin@arctixmc.net</span> receives admin role.</p>
      </form>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="bg-card/70 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">A</div>
            <div>
              <div className="font-display font-bold">ArctixMC Admin</div>
              <div className="text-xs text-muted-foreground">Store management dashboard</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/"><Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1.5" /> View Store</Button></Link>
            <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="h-4 w-4 mr-1.5" /> Logout</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        <Tabs defaultValue="ranks">
          <TabsList className="bg-card/70 border border-border flex-wrap h-auto">
            <TabsTrigger value="ranks">Ranks</TabsTrigger>
            <TabsTrigger value="coins">Coins</TabsTrigger>
            <TabsTrigger value="keys">Crate Keys</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="ranks" className="mt-5"><RanksAdmin /></TabsContent>
          <TabsContent value="coins" className="mt-5"><CoinsAdmin /></TabsContent>
          <TabsContent value="keys" className="mt-5"><KeysAdmin /></TabsContent>
          <TabsContent value="tickets" className="mt-5"><TicketsAdmin /></TabsContent>
          <TabsContent value="settings" className="mt-5"><SettingsAdmin /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RanksAdmin() {
  const { ranks, setRanks } = useStore();
  const [uploading, setUploading] = useState<string | null>(null);

  function update(idx: number, patch: Partial<Rank>) {
    setRanks(ranks.map((r, i) => i === idx ? { ...r, ...patch } : r));
  }
  function add() {
    setRanks([...ranks, { id: `rank-${Date.now()}`, name: "NEW RANK", price: 999, discountPrice: 699, perks: ["New perk"], commands: [], tag: "", color: "#8AEFFF" }]);
  }
  function remove(idx: number) { setRanks(ranks.filter((_, i) => i !== idx)); toast.success("Rank deleted"); }

  async function uploadImage(idx: number, file: File) {
    const id = ranks[idx].id;
    setUploading(id);
    const path = `${id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("rank-images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(null); return; }
    const { data } = supabase.storage.from("rank-images").getPublicUrl(path);
    update(idx, { image: data.publicUrl });
    toast.success("Image uploaded");
    setUploading(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-bold">Manage Ranks</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Rank</Button>
      </div>
      {ranks.map((r, idx) => (
        <Card key={r.id} className="bg-card/70 border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md border border-border" style={{ background: r.color }} />
              <span className="font-display text-lg font-bold" style={{ color: r.color }}>{r.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(idx)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div><Label className="text-xs">Name</Label><Input value={r.name} onChange={(e) => update(idx, { name: e.target.value })} /></div>
            <div><Label className="text-xs">Original Price</Label><Input type="number" value={r.price} onChange={(e) => update(idx, { price: +e.target.value })} /></div>
            <div><Label className="text-xs">Discount Price</Label><Input type="number" value={r.discountPrice} onChange={(e) => update(idx, { discountPrice: +e.target.value })} /></div>
            <div><Label className="text-xs">Color</Label><Input type="color" value={r.color} onChange={(e) => update(idx, { color: e.target.value })} className="h-9 p-1" /></div>
            <div><Label className="text-xs">Tag</Label>
              <select value={r.tag} onChange={(e) => update(idx, { tag: e.target.value as Rank["tag"] })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border">
                <option value="">None</option>
                <option value="Best Value">Best Value</option>
                <option value="Popular">Popular</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-3">
            {r.image && <img src={r.image} alt="" className="h-16 w-16 rounded-md border border-border object-cover" />}
            <div className="flex-1">
              <Label className="text-xs">Image URL</Label>
              <Input value={r.image ?? ""} onChange={(e) => update(idx, { image: e.target.value })} placeholder="https://..." />
            </div>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(idx, f); }} />
              <Button asChild variant="outline" size="sm"><span><Upload className="h-3 w-3 mr-1" /> {uploading === r.id ? "…" : "Upload"}</span></Button>
            </label>
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
  function add() { setCoins([...coins, { id: `c-${Date.now()}`, coins: 1000, price: 100, visible: true }]); }
  function remove(idx: number) { setCoins(coins.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-bold">Manage Coin Packages</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Package</Button>
      </div>
      {coins.map((c, idx) => (
        <Card key={c.id} className="bg-card/70 border-border p-4 grid md:grid-cols-5 gap-3 items-end">
          <div><Label className="text-xs">Coins</Label><Input type="number" value={c.coins} onChange={(e) => update(idx, { coins: +e.target.value })} /></div>
          <div><Label className="text-xs">Price (रु)</Label><Input type="number" value={c.price} onChange={(e) => update(idx, { price: +e.target.value })} /></div>
          <div><Label className="text-xs">Bonus tag</Label><Input placeholder="+10%" value={c.bonus ?? ""} onChange={(e) => update(idx, { bonus: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm pb-2"><input type="checkbox" checked={c.visible !== false} onChange={(e) => update(idx, { visible: e.target.checked })} /> Visible</label>
          <Button variant="ghost" onClick={() => remove(idx)} className="text-destructive"><Trash2 className="h-4 w-4 mr-1" /> Remove</Button>
        </Card>
      ))}
    </div>
  );
}

function KeysAdmin() {
  const { keys, setKeys } = useStore();
  function update(idx: number, patch: Partial<CrateKey>) { setKeys(keys.map((k, i) => i === idx ? { ...k, ...patch } : k)); }
  function add() { setKeys([...keys, { id: `k-${Date.now()}`, name: "New Crate Key", description: "Description", price: 99, active: true }]); }
  function remove(idx: number) { setKeys(keys.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-bold">Manage Crate Keys</h2>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Key</Button>
      </div>
      {keys.map((k, idx) => (
        <Card key={k.id} className="bg-card/70 border-border p-4 space-y-3">
          <div className="grid md:grid-cols-4 gap-3">
            <div><Label className="text-xs">Name</Label><Input value={k.name} onChange={(e) => update(idx, { name: e.target.value })} /></div>
            <div><Label className="text-xs">Price (रु)</Label><Input type="number" value={k.price} onChange={(e) => update(idx, { price: +e.target.value })} /></div>
            <label className="flex items-center gap-2 text-sm pb-2"><input type="checkbox" checked={k.active !== false} onChange={(e) => update(idx, { active: e.target.checked })} /> Active</label>
            <Button variant="ghost" onClick={() => remove(idx)} className="text-destructive self-end"><Trash2 className="h-4 w-4 mr-1" /> Remove</Button>
          </div>
          <div><Label className="text-xs">Description</Label><Textarea rows={2} value={k.description} onChange={(e) => update(idx, { description: e.target.value })} /></div>
        </Card>
      ))}
    </div>
  );
}

type AdminTicket = {
  id: string; ticket_no: number; username: string; contact: string | null;
  category: string; subject: string; description: string; status: string;
  priority: string; admin_notes: string | null; created_at: string;
};

function TicketsAdmin() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("tickets").select("*").order("created_at", { ascending: false }).limit(200);
    setTickets((data ?? []) as AdminTicket[]);
  }
  useEffect(() => { load(); }, []);

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.username.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || String(t.ticket_no).includes(q);
    }
    return true;
  });

  async function updateTicket(id: string, patch: Partial<AdminTicket>) {
    const { error } = await supabase.from("tickets").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Updated");
    load();
  }
  async function deleteTicket(id: string) {
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <h2 className="font-display text-lg font-bold mr-auto">Tickets ({filtered.length})</h2>
        <Input className="w-64" placeholder="Search by user, subject, #" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md bg-input px-3 text-sm border border-border">
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((t) => (
          <Card key={t.id} className="bg-card/70 border-border p-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
              <span className="font-mono text-xs text-primary w-12">#{t.ticket_no}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{t.subject}</div>
                <div className="text-xs text-muted-foreground">{t.username} · {t.category} · {new Date(t.created_at).toLocaleString()}</div>
              </div>
              <StatusBadge status={t.status} />
            </div>
            {expanded === t.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-3">
                {t.contact && <div className="text-xs text-muted-foreground">Contact: <span className="text-foreground">{t.contact}</span></div>}
                <p className="text-sm whitespace-pre-wrap">{t.description}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Status</Label>
                    <select value={t.status} onChange={(e) => updateTicket(t.id, { status: e.target.value })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Priority</Label>
                    <div className="text-sm py-2">{t.priority}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Admin notes</Label>
                  <Textarea rows={2} defaultValue={t.admin_notes ?? ""} onBlur={(e) => updateTicket(t.id, { admin_notes: e.target.value })} />
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteTicket(t.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete ticket
                </Button>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No tickets.</p>}
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const { settings, setSettings } = useStore();
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings]);

  return (
    <Card className="bg-card/70 border-border p-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-lg font-bold">Store Settings</h2>
      <div className="grid gap-4">
        <div><Label>Server Name</Label><Input value={draft.serverName} onChange={(e) => setDraft({ ...draft, serverName: e.target.value })} /></div>
        <div><Label>Server IP</Label><Input value={draft.serverIp} onChange={(e) => setDraft({ ...draft, serverIp: e.target.value })} /></div>
        <div><Label>Hero Title</Label><Input value={draft.heroTitle} onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })} /></div>
        <div><Label>Hero Subtitle</Label><Input value={draft.heroSubtitle} onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })} /></div>
        <div><Label>Discord Invite URL</Label><Input value={draft.discordUrl} onChange={(e) => setDraft({ ...draft, discordUrl: e.target.value })} /></div>
        <div><Label>Primary Color</Label><Input type="color" value={draft.primaryColor} onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })} className="h-10 p-1 w-32" /></div>
      </div>
      <Button onClick={() => { setSettings(draft); toast.success("Settings saved"); }} className="gradient-primary text-primary-foreground">
        <Save className="h-4 w-4 mr-1.5" /> Save Settings
      </Button>
    </Card>
  );
}
