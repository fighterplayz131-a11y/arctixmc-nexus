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
import { LifeBuoy, CheckCircle2, Search, Send, MessageCircle, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { GemBurstButton } from "@/components/GemBurstButton";
import { SupportFAQ, TicketStatusTracker } from "@/components/SupportFAQ";

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
  description?: string;
  contact?: string | null;
  admin_notes?: string | null;
};

type Reply = {
  id: string;
  ticket_id: string;
  author_type: "user" | "admin";
  author_name: string;
  message: string;
  created_at: string;
};

function TicketsPage() {
  const { username, settings } = useStore();
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
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    setForm((f) => ({ ...f, username: username ?? f.username }));
  }, [username]);

  useEffect(() => {
    const name = username ?? lookup;
    if (!name) { setMyTickets([]); return; }
    (async () => {
      const { data } = await supabase
        .from("tickets")
        .select("*")
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

  if (openTicket) {
    return <TicketThread ticket={openTicket} onBack={() => setOpenTicket(null)} authorName={username ?? "Guest"} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 animate-fade-in space-y-8">
      <div className="text-center mb-2">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
          <LifeBuoy className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{settings.supportTitle}</h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">{settings.supportSubtitle}</p>
      </div>

      <SupportFAQ />

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
              <GemBurstButton className="mt-5 gradient-primary text-primary-foreground" onClick={() => setSubmitted(null)}>Create Another</GemBurstButton>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Create Ticket</h2>
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
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border text-foreground">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Priority</Label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full h-9 rounded-md bg-input px-3 text-sm border border-border text-foreground">
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
              <GemBurstButton type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground">
                {submitting ? "Submitting..." : "Submit Ticket"}
              </GemBurstButton>
            </form>
          )}
        </div>

        {/* My tickets */}
        <div className="rounded-xl bg-card/60 border border-border p-6">
          <h2 className="font-display text-lg font-bold mb-3 text-foreground">Your Tickets</h2>
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
                <li key={t.id}>
                  <button
                    onClick={() => setOpenTicket(t)}
                    className="w-full text-left rounded-md bg-muted/40 border border-border p-3 mc-btn hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-primary">#{t.ticket_no}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="text-sm font-medium truncate text-foreground">{t.subject}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.category} · {new Date(t.created_at).toLocaleDateString()}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketThread({ ticket, onBack, authorName }: { ticket: Ticket; onBack: () => void; authorName: string }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    const { data } = await supabase.from("ticket_replies").select("*").eq("ticket_id", ticket.id).order("created_at", { ascending: true });
    setReplies((data ?? []) as Reply[]);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ticket.id]);

  async function send() {
    if (!msg.trim()) return;
    setSending(true);
    const { error } = await supabase.from("ticket_replies").insert({
      ticket_id: ticket.id,
      author_type: "user",
      author_name: authorName,
      message: msg.trim(),
    });
    setSending(false);
    if (error) { toast.error("Could not send reply"); return; }
    setMsg("");
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-10 animate-fade-in">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to tickets
      </button>
      <div className="rounded-xl bg-card/70 border border-border p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-primary">#{ticket.ticket_no}</span>
          <StatusBadge status={ticket.status} />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">{ticket.subject}</h2>
        <div className="text-xs text-muted-foreground mb-3">{ticket.category} · {ticket.username} · {new Date(ticket.created_at).toLocaleString()}</div>
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
      </div>

      <div className="rounded-xl bg-card/60 border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-4 w-4 text-primary" />
          <h3 className="font-display font-bold text-foreground">Conversation</h3>
        </div>
        <div className="space-y-3 mb-4 max-h-[420px] overflow-y-auto scrollbar-thin">
          {replies.length === 0 && <p className="text-sm text-muted-foreground">No replies yet. Start the conversation below.</p>}
          {replies.map((r) => (
            <div key={r.id} className={`rounded-lg p-3 border ${r.author_type === "admin" ? "bg-primary/10 border-primary/30" : "bg-muted/40 border-border"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground">
                  {r.author_name} {r.author_type === "admin" && <Badge className="ml-1 bg-primary/20 text-primary border-primary/30 text-[9px]">STAFF</Badge>}
                </span>
                <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground">{r.message}</p>
            </div>
          ))}
        </div>
        {ticket.status !== "closed" ? (
          <div className="flex gap-2">
            <Textarea rows={2} placeholder="Type your reply..." value={msg} onChange={(e) => setMsg(e.target.value)} />
            <GemBurstButton onClick={send} disabled={sending || !msg.trim()} className="gradient-primary text-primary-foreground self-end">
              <Send className="h-4 w-4" />
            </GemBurstButton>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-2">This ticket is closed.</p>
        )}
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
