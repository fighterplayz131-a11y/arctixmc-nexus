import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Support Tickets — ArctixMC" }] }),
  component: TicketsPage,
});

const CATEGORIES = ["Purchase Issue", "Rank Issue", "Coins Issue", "Crate Key Issue", "Bug Report", "Staff Help", "Other"];
const PRIORITIES = ["low", "normal", "high", "urgent"];

const schema = z.object({
  username: z.string().trim().min(3).max(16).regex(/^[A-Za-z0-9_]+$/),
  contact: z.string().trim().max(120).optional().or(z.literal("")),
  category: z.string().min(1),
  subject: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  priority: z.string(),
});

type Ticket = {
  id: string;
  ticket_no: number;
  username: string;
  category: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
};

function TicketsPage() {
  const { username } = useStore();
  const [submitted, setSubmitted] = useState<{ no: number; id: string } | null>(null);
  const [form, setForm] = useState({
    username: username ?? "",
    contact: "",
    category: CATEGORIES[0],
    subject: "",
    description: "",
    priority: "normal",
  });
  const [submitting, setSubmitting] = useState(false);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [lookup, setLookup] = useState("");

  useEffect(() => {
    setForm((f) => ({ ...f, username: username ?? f.username }));
  }, [username]);

  useEffect(() => {
    const name = username ?? lookup;
    if (!name) { setMyTickets([]); return; }
    (async () => {
      const { data } = await supabase
        .from("tickets")
        .select("id,ticket_no,username,category,subject,status,priority,created_at")
        .ilike("username", name)
        .order("created_at", { ascending: false })
        .limit(20);
      setMyTickets((data ?? []) as Ticket[]);
    })();
  }, [username, lookup, submitted]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid form");
      setSubmitting(false);
      return;
    }
    const { data, error } = await supabase
      .from("tickets")
      .insert({ ...parsed.data, contact: parsed.data.contact || null })
      .select("id,ticket_no")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Failed to create ticket. Please try again.");
      return;
    }
    setSubmitted({ no: data.ticket_no, id: data.id });
    setForm((f) => ({ ...f, subject: "", description: "" }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
          <LifeBuoy className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Support Tickets</h1>
        <p className="text-muted-foreground text-sm">Need help? Create a ticket and our staff will get back to you.</p>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Form / Success */}
        <div className="rounded-xl bg-card/60 border border-border p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold mb-1">Ticket Created</h2>
              <p className="text-muted-foreground mb-4">Your ticket ID is</p>
              <div className="inline-block px-4 py-2 rounded-md bg-muted/60 font-mono text-lg text-primary">#{submitted.no}</div>
              <p className="text-xs text-muted-foreground mt-4">We'll respond as soon as possible.</p>
              <Button className="mt-5 gradient-primary text-primary-foreground" onClick={() => setSubmitted(null)}>Create Another</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-display text-lg font-bold">Create Ticket</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Minecraft Username</Label>
                  <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Notch" />
                </div>
                <div>
                  <Label className="text-xs">Contact (optional)</Label>
                  <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Email or Discord" />
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Priority</Label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p[0].toUpperCase()+p.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary" />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." />
              </div>
              <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground">
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          )}
        </div>

        {/* My tickets */}
        <div className="rounded-xl bg-card/60 border border-border p-6">
          <h2 className="font-display text-lg font-bold mb-3">Your Tickets</h2>
          {!username && (
            <div className="mb-4 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Look up by username" value={lookup} onChange={(e) => setLookup(e.target.value)} />
            </div>
          )}
          {myTickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tickets found.</p>
          ) : (
            <ul className="space-y-2">
              {myTickets.map((t) => (
                <li key={t.id} className="rounded-md bg-muted/40 border border-border p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-primary">#{t.ticket_no}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="text-sm font-medium truncate">{t.subject}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.category} · {new Date(t.created_at).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    in_progress: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    closed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  };
  const cls = map[status] ?? "bg-muted text-muted-foreground border-border";
  return <Badge variant="outline" className={cls + " text-[10px]"}>{status.replace("_", " ")}</Badge>;
}
