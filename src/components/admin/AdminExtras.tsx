import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store-context";
import type { Settings } from "@/lib/store-defaults";

// ============ COUPONS ============
type Coupon = {
  id?: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  expires_at: string | null;
  max_uses: number | null;
  used_count?: number;
  active: boolean;
};

export function CouponsAdmin() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Coupon>({ code: "", discount_type: "percent", discount_value: 10, expires_at: null, max_uses: null, active: true });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Coupon[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!draft.code.trim()) return toast.error("Code required");
    const { error } = await supabase.from("coupons").insert({
      code: draft.code.trim().toUpperCase(),
      discount_type: draft.discount_type,
      discount_value: draft.discount_value,
      expires_at: draft.expires_at,
      max_uses: draft.max_uses,
      active: draft.active,
    });
    if (error) return toast.error(error.message);
    toast.success("Coupon created");
    setDraft({ code: "", discount_type: "percent", discount_value: 10, expires_at: null, max_uses: null, active: true });
    load();
  }
  async function update(id: string, patch: Partial<Coupon>) {
    const { error } = await supabase.from("coupons").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-5">
      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Create Coupon</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Code</Label><Input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} placeholder="WINTER20" /></div>
          <div>
            <Label>Type</Label>
            <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={draft.discount_type} onChange={(e) => setDraft({ ...draft, discount_type: e.target.value as "percent" | "fixed" })}>
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed (Rs)</option>
            </select>
          </div>
          <div><Label>Value</Label><Input type="number" value={draft.discount_value} onChange={(e) => setDraft({ ...draft, discount_value: +e.target.value })} /></div>
          <div><Label>Max Uses (blank = unlimited)</Label><Input type="number" value={draft.max_uses ?? ""} onChange={(e) => setDraft({ ...draft, max_uses: e.target.value ? +e.target.value : null })} /></div>
          <div className="md:col-span-2"><Label>Expires At (blank = never)</Label><Input type="datetime-local" value={draft.expires_at ?? ""} onChange={(e) => setDraft({ ...draft, expires_at: e.target.value || null })} /></div>
        </div>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Coupon</Button>
      </Card>

      <Card className="bg-card/70 border-border p-5">
        <h2 className="font-display text-lg font-bold mb-3">All Coupons ({items.length})</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">No coupons yet.</p> : (
          <div className="space-y-2">
            {items.map((c) => (
              <div key={c.id} className="rounded-md border border-border bg-muted/20 p-3 flex flex-wrap items-center gap-3">
                <div className="font-mono font-bold">{c.code}</div>
                <div className="text-sm text-muted-foreground">{c.discount_type === "percent" ? `${c.discount_value}%` : `Rs ${c.discount_value}`} off</div>
                <div className="text-xs text-muted-foreground">Used {c.used_count ?? 0}/{c.max_uses ?? "∞"}</div>
                {c.expires_at && <div className="text-xs text-muted-foreground">Expires {new Date(c.expires_at).toLocaleDateString()}</div>}
                <label className="flex items-center gap-1 text-xs ml-auto">
                  <input type="checkbox" checked={c.active} onChange={(e) => update(c.id!, { active: e.target.checked })} /> Active
                </label>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(c.id!)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============ BUNDLES ============
type Bundle = {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number;
  items: { name: string; type: string; quantity?: number }[];
  image_url: string | null;
  active: boolean;
};

export function BundlesAdmin() {
  const { ranks, coins, keys } = useStore();
  const [items, setItems] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Bundle>({ name: "", description: "", price: 0, original_price: 0, items: [], image_url: null, active: true });
  // Catalog selector: which existing item to add
  const catalog = [
    ...ranks.map((r) => ({ key: `rank:${r.id}`, label: `${r.name} Rank — रु ${r.discountPrice}`, name: r.name, type: "rank", price: r.discountPrice })),
    ...coins.map((c) => ({ key: `coins:${c.id}`, label: `${c.coins.toLocaleString()} Coins — रु ${c.price}`, name: `${c.coins.toLocaleString()} Coins`, type: "coins", price: c.price })),
    ...keys.map((k) => ({ key: `key:${k.id}`, label: `${k.name} — रु ${k.price}`, name: k.name, type: "key", price: k.price })),
  ];
  const [selectedKey, setSelectedKey] = useState<string>(catalog[0]?.key ?? "");
  const [qty, setQty] = useState(1);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("bundles").select("*").order("created_at", { ascending: false });
    setItems((data ?? []).map((b: { items: unknown }) => ({ ...b, items: Array.isArray(b.items) ? b.items : [] })) as Bundle[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  // Auto-calc original_price from items so admin sees suggested savings
  const suggestedOriginal = draft.items.reduce((sum, it) => {
    const cat = catalog.find((c) => c.name === it.name && c.type === it.type);
    return sum + (cat?.price ?? 0) * (it.quantity ?? 1);
  }, 0);

  function addItemToDraft() {
    const cat = catalog.find((c) => c.key === selectedKey);
    if (!cat) return toast.error("Select an item first");
    setDraft({ ...draft, items: [...draft.items, { name: cat.name, type: cat.type, quantity: qty }] });
    setQty(1);
  }

  async function add() {
    if (!draft.name.trim()) return toast.error("Name required");
    if (draft.items.length === 0) return toast.error("Add at least one item to the bundle");
    const { error } = await supabase.from("bundles").insert({
      name: draft.name, description: draft.description, price: draft.price,
      original_price: draft.original_price || suggestedOriginal,
      items: draft.items, image_url: draft.image_url, active: draft.active,
    });
    if (error) return toast.error(error.message);
    toast.success("Bundle created");
    setDraft({ name: "", description: "", price: 0, original_price: 0, items: [], image_url: null, active: true });
    load();
  }
  async function update(id: string, patch: Partial<Bundle>) {
    const { error } = await supabase.from("bundles").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("bundles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-5">
      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Create Bundle</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Starter Pack" /></div>
          <div><Label>Image URL (optional)</Label><Input value={draft.image_url ?? ""} onChange={(e) => setDraft({ ...draft, image_url: e.target.value || null })} /></div>
          <div><Label>Bundle Price (Rs)</Label><Input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: +e.target.value })} /></div>
          <div>
            <Label>Original Price (Rs) — leave 0 for auto</Label>
            <Input type="number" value={draft.original_price} onChange={(e) => setDraft({ ...draft, original_price: +e.target.value })} placeholder={`Auto: ${suggestedOriginal}`} />
          </div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={2} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What players get in this bundle…" /></div>
        </div>

        <div className="space-y-2">
          <Label>Add items from your store</Label>
          <div className="flex flex-wrap gap-2">
            <select className="flex-1 min-w-[200px] h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
              {catalog.length === 0 ? <option value="">No store items yet</option> : catalog.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <Input type="number" min={1} className="w-20" value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
            <Button size="sm" variant="outline" onClick={addItemToDraft}><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
          </div>
          {draft.items.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {draft.items.map((it, i) => (
                <span key={i} className="text-xs bg-muted rounded px-2 py-1 flex items-center gap-1.5">
                  {it.quantity && it.quantity > 1 ? `${it.quantity}× ` : ""}{it.name}
                  <span className="text-muted-foreground">({it.type})</span>
                  <button className="text-destructive hover:text-destructive/80" onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}>×</button>
                </span>
              ))}
            </div>
          )}
          {suggestedOriginal > 0 && draft.price > 0 && draft.price < suggestedOriginal && (
            <p className="text-xs text-emerald-400">
              Players save रु {suggestedOriginal - draft.price} ({Math.round(((suggestedOriginal - draft.price) / suggestedOriginal) * 100)}% off)
            </p>
          )}
        </div>

        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Bundle</Button>
      </Card>

      <Card className="bg-card/70 border-border p-5">
        <h2 className="font-display text-lg font-bold mb-3">All Bundles ({items.length})</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">No bundles yet.</p> : (
          <div className="space-y-2">
            {items.map((b) => (
              <div key={b.id} className="rounded-md border border-border bg-muted/20 p-3 flex flex-wrap items-center gap-3">
                <div className="font-display font-bold">{b.name}</div>
                <div className="text-sm">Rs {b.price} <span className="line-through text-muted-foreground">Rs {b.original_price}</span></div>
                <div className="text-xs text-muted-foreground">{b.items.length} items: {b.items.map((i) => `${i.quantity ?? 1}× ${i.name}`).join(", ")}</div>
                <label className="flex items-center gap-1 text-xs ml-auto"><input type="checkbox" checked={b.active} onChange={(e) => update(b.id!, { active: e.target.checked })} /> Active</label>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(b.id!)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============ FLASH SALES ============
type FlashSale = {
  id?: string;
  title: string;
  description: string | null;
  discount_percent: number;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

export function FlashSalesAdmin() {
  const [items, setItems] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<FlashSale>({ title: "", description: "", discount_percent: 20, starts_at: new Date().toISOString().slice(0, 16), ends_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16), active: true });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("flash_sales").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as FlashSale[]); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!draft.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("flash_sales").insert(draft);
    if (error) return toast.error(error.message);
    toast.success("Flash sale created"); load();
  }
  async function update(id: string, patch: Partial<FlashSale>) {
    const { error } = await supabase.from("flash_sales").update(patch).eq("id", id);
    if (error) return toast.error(error.message); load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("flash_sales").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-5">
      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Create Flash Sale</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2"><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Weekend Mega Sale" /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={2} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
          <div><Label>Discount %</Label><Input type="number" value={draft.discount_percent} onChange={(e) => setDraft({ ...draft, discount_percent: +e.target.value })} /></div>
          <div><Label>Starts</Label><Input type="datetime-local" value={draft.starts_at.slice(0, 16)} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} /></div>
          <div><Label>Ends</Label><Input type="datetime-local" value={draft.ends_at.slice(0, 16)} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })} /></div>
        </div>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Add Flash Sale</Button>
      </Card>

      <Card className="bg-card/70 border-border p-5">
        <h2 className="font-display text-lg font-bold mb-3">All Flash Sales ({items.length})</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">No flash sales yet.</p> : (
          <div className="space-y-2">
            {items.map((s) => (
              <div key={s.id} className="rounded-md border border-border bg-muted/20 p-3 flex flex-wrap items-center gap-3">
                <div className="font-display font-bold">{s.title}</div>
                <div className="text-sm text-primary">{s.discount_percent}% off</div>
                <div className="text-xs text-muted-foreground">Until {new Date(s.ends_at).toLocaleString()}</div>
                <label className="flex items-center gap-1 text-xs ml-auto"><input type="checkbox" checked={s.active} onChange={(e) => update(s.id!, { active: e.target.checked })} /> Active</label>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(s.id!)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============ ANNOUNCEMENTS ============
type Announcement = {
  id?: string;
  title: string;
  body: string | null;
  variant: "info" | "success" | "warning" | "danger";
  starts_at: string;
  ends_at: string | null;
  active: boolean;
};

export function AnnouncementsAdmin() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Announcement>({ title: "", body: "", variant: "info", starts_at: new Date().toISOString().slice(0, 16), ends_at: null, active: true });

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Announcement[]); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!draft.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("announcements").insert(draft);
    if (error) return toast.error(error.message);
    toast.success("Announcement posted"); load();
  }
  async function update(id: string, patch: Partial<Announcement>) {
    const { error } = await supabase.from("announcements").update(patch).eq("id", id);
    if (error) return toast.error(error.message); load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-5">
      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Post Announcement</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2"><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Body</Label><Textarea rows={3} value={draft.body ?? ""} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></div>
          <div>
            <Label>Variant</Label>
            <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={draft.variant} onChange={(e) => setDraft({ ...draft, variant: e.target.value as Announcement["variant"] })}>
              <option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="danger">Danger</option>
            </select>
          </div>
          <div><Label>Ends At (optional)</Label><Input type="datetime-local" value={draft.ends_at ?? ""} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value || null })} /></div>
        </div>
        <Button onClick={add} className="gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> Post Announcement</Button>
      </Card>

      <Card className="bg-card/70 border-border p-5">
        <h2 className="font-display text-lg font-bold mb-3">All Announcements ({items.length})</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">No announcements yet.</p> : (
          <div className="space-y-2">
            {items.map((a) => (
              <div key={a.id} className="rounded-md border border-border bg-muted/20 p-3 flex flex-wrap items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${a.variant === "danger" ? "bg-red-500/20 text-red-400" : a.variant === "warning" ? "bg-amber-500/20 text-amber-400" : a.variant === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"}`}>{a.variant}</span>
                <div className="font-display font-bold">{a.title}</div>
                <label className="flex items-center gap-1 text-xs ml-auto"><input type="checkbox" checked={a.active} onChange={(e) => update(a.id!, { active: e.target.checked })} /> Active</label>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(a.id!)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============ SUPPORT / REWARDS / REFERRAL SETTINGS ============
export function RewardsSettingsAdmin() {
  const { settings, setSettings } = useStore();
  const [draft, setDraft] = useState<Settings>(settings);
  useEffect(() => setDraft(settings), [settings]);

  function save() { setSettings(draft); toast.success("Settings saved"); }

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Support Rules</h2>
        <p className="text-xs text-muted-foreground">One rule per line — shown on the Support page.</p>
        <div className="space-y-2">
          {draft.supportRules.map((r, i) => (
            <div key={i} className="flex gap-2">
              <Input value={r} onChange={(e) => { const next = [...draft.supportRules]; next[i] = e.target.value; setDraft({ ...draft, supportRules: next }); }} />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDraft({ ...draft, supportRules: draft.supportRules.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, supportRules: [...draft.supportRules, "New rule"] })}><Plus className="h-3 w-3 mr-1" /> Add Rule</Button>
        </div>
      </Card>

      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Payment Help</h2>
        <div><Label>Title</Label><Input value={draft.paymentHelpTitle} onChange={(e) => setDraft({ ...draft, paymentHelpTitle: e.target.value })} /></div>
        <div><Label>Help Text</Label><Textarea rows={3} value={draft.paymentHelpText} onChange={(e) => setDraft({ ...draft, paymentHelpText: e.target.value })} /></div>
        <div><Label>Response Time Note</Label><Input value={draft.responseTimeText} onChange={(e) => setDraft({ ...draft, responseTimeText: e.target.value })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.supportActive} onChange={(e) => setDraft({ ...draft, supportActive: e.target.checked })} /> Support is currently active</label>
        <div className="space-y-2">
          <Label>Payment Methods</Label>
          {draft.paymentMethods.map((m, i) => (
            <div key={i} className="flex gap-2">
              <Input className="w-1/3" placeholder="Name" value={m.name} onChange={(e) => { const next = [...draft.paymentMethods]; next[i] = { ...next[i], name: e.target.value }; setDraft({ ...draft, paymentMethods: next }); }} />
              <Input className="flex-1" placeholder="Note" value={m.note} onChange={(e) => { const next = [...draft.paymentMethods]; next[i] = { ...next[i], note: e.target.value }; setDraft({ ...draft, paymentMethods: next }); }} />
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDraft({ ...draft, paymentMethods: draft.paymentMethods.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, paymentMethods: [...draft.paymentMethods, { name: "New", note: "" }] })}><Plus className="h-3 w-3 mr-1" /> Add Method</Button>
        </div>
      </Card>

      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Daily Reward</h2>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.dailyRewardEnabled} onChange={(e) => setDraft({ ...draft, dailyRewardEnabled: e.target.checked })} /> Enable daily reward claim</label>
        <div><Label>Coins per claim</Label><Input type="number" value={draft.dailyRewardCoins} onChange={(e) => setDraft({ ...draft, dailyRewardCoins: +e.target.value })} /></div>
      </Card>

      <Card className="bg-card/70 border-border p-5 space-y-4">
        <h2 className="font-display text-lg font-bold">Referral & Loyalty</h2>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.referralEnabled} onChange={(e) => setDraft({ ...draft, referralEnabled: e.target.checked })} /> Enable referral system</label>
        <div><Label>Referral reward (coins)</Label><Input type="number" value={draft.referralRewardCoins} onChange={(e) => setDraft({ ...draft, referralRewardCoins: +e.target.value })} /></div>
        <div><Label>Loyalty points per Rs spent</Label><Input type="number" value={draft.loyaltyPointsPerRupee} onChange={(e) => setDraft({ ...draft, loyaltyPointsPerRupee: +e.target.value })} /></div>
      </Card>

      <div className="lg:col-span-2 sticky bottom-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border">
        <Button onClick={save} className="gradient-primary text-primary-foreground w-full"><Save className="h-4 w-4 mr-1.5" /> Save Settings</Button>
      </div>
    </div>
  );
}
