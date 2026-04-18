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
import {
  LifeBuoy, CheckCircle2, Search, Send, MessageCircle, ChevronLeft,
  Bug, CreditCard, Receipt, AlertTriangle, Clock, Paperclip, X as XIcon,
  Activity, ShieldCheck, MessagesSquare,
} from "lucide-react";
import { toast } from "sonner";
import { GemBurstButton } from "@/components/GemBurstButton";
import { SupportFAQ, TicketStatusTracker } from "@/components/SupportFAQ";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Support — ArctixMC" }] }),
  component: TicketsPage,
});

const CATEGORIES = ["Purchase Issue", "Rank Issue", "Coins Issue", "Crate Key Issue", "Bug Report", "Server Issue", "Staff Help", "Other"];
const PRIORITIES = ["low", "normal", "high", "urgent"];
const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const schema = z.object({
  username: z.string().trim().min(3).max(16).regex(/^[A-Za-z0-9_]+$/),
  contact: z.string().trim().max(120).optional().or(z.literal("")),
  category: z.string().min(1),
  subject: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  priority: z.string(),
});

type Ticket = {
  id: string; ticket_no: number; username: string; category: string;
  subject: string; status: string; priority: string; created_at: string;
  description?: string; contact?: string | null; admin_notes?: string | null;
};

type Reply = {
  id: string; ticket_id: string; author_type: "user" | "admin";
  author_name: string; message: string; created_at: string;
};

type Attachment = {
  id: string; file_url: string; file_name: string; file_size: number; mime_type: string | null;
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
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [lookup, setLookup] = useState("");
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);

  useEffect(() => { setForm((f) => ({ ...f, username: username ?? f.username })); }, [username]);

  useEffect(() => {
    const name = username ?? lookup;
    if (!name) { setMyTickets([]); return; }
    (async () => {
      const { data } = await supabase
        .from("tickets")
        .select("*")
        .ilike("username", name)
        .order("created_at", { ascending: false })
        .limit(50);
      setMyTickets((data ?? []) as Ticket[]);
    })();
  }, [username, lookup, submitted]);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const valid = arr.filter((f) => {
      if (f.size > MAX_FILE_SIZE) { toast.error(`${f.name} exceeds 20MB`); return false; }
      return true;
    });
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  }

  async function uploadAttachments(ticketId: string) {
    for (const f of files) {
      const path = `${ticketId}/${Date.now()}-${f.name}`;
      const { error } = await supabase.storage.from("ticket-files").upload(path, f);
      if (error) { toast.error(`Upload failed: ${f.name}`); continue; }
      const { data } = supabase.storage.from("ticket-files").getPublicUrl(path);
      await supabase.from("ticket_attachments").insert({
        ticket_id: ticketId,
        file_url: data.publicUrl,
        file_name: f.name,
        file_size: f.size,
        mime_type: f.type,
        uploaded_by: form.username,
      });
    }
  }

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
    if (error || !data) {
      setSubmitting(false);
      toast.error("Failed to create ticket. Please try again.");
      return;
    }
    if (files.length > 0) await uploadAttachments(data.id);
    setSubmitting(false);
    setSubmitted({ no: data.ticket_no, id: data.id });
    setForm((f) => ({ ...f, subject: "", description: "" }));
    setFiles([]);
  }

  if (openTicket) {
    return <TicketThread ticket={openTicket} onBack={() => setOpenTicket(null)} authorName={username ?? "Guest"} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-12 animate-fade-in space-y-6">
      <div className="text-center mb-2">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
          <LifeBuoy className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{settings.supportTitle}</h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">{settings.supportSubtitle}</p>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-card/60 border border-border text-xs">
          <span className={`h-2 w-2 rounded-full ${settings.supportActive ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-foreground">{settings.supportActive ? "Support Active" : "Support Offline"}</span>
          <span className="text-muted-foreground">· {settings.responseTimeText}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickCard icon={<MessagesSquare className="h-5 w-5" />} title="Discord Support" subtitle="Fast staff replies" href={settings.discordUrl} />
        <QuickCard icon={<CreditCard className="h-5 w-5" />} title="Payment Help" subtitle="Failed payment? Tap to scroll" anchor="#payment-help" />
        <QuickCard icon={<Receipt className="h-5 w-5" />} title="Order Lookup" subtitle="Find past purchases" anchor="#order-lookup" />
        <QuickCard icon={<Bug className="h-5 w-5" />} title="Report Bug" subtitle="Glitches or server issues" anchor="#new-ticket" />
      </div>

      <SupportFAQ />

      {/* Payment Help */}
      <div id="payment-help" className="rounded-xl bg-card/60 border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">{settings.paymentHelpTitle}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{settings.paymentHelpText}</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {settings.paymentMethods.map((m) => (
            <div key={m.name} className="rounded-md bg-muted/40 border border-border p-3 flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Lookup */}
      <OrderLookup />

      {/* Support Rules */}
      <div className="rounded-xl bg-amber-500/5 border border-amber-500/30 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
          <h2 className="font-display text-lg font-bold text-foreground">Support Rules & Guidelines</h2>
        </div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {settings.supportRules.map((r, i) => (
            <li key={i} className="flex gap-2"><span className="text-amber-300">•</span><span>{r}</span></li>
          ))}
        </ul>
      </div>

      {/* Form + my tickets */}
      <div id="new-ticket" className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="rounded-xl bg-card/60 border border-border p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold mb-1">Ticket Created</h2>
              <p className="text-muted-foreground mb-4">Your ticket ID is</p>
              <div className="inline-block px-4 py-2 rounded-md bg-muted/60 font-mono text-lg text-primary">#{submitted.no}</div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" /> {settings.responseTimeText}
              </p>
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
                <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail. Include time, steps to reproduce, etc." />
              </div>
              <div>
                <Label className="text-xs">Attachments (max {MAX_FILES} · 20MB each)</Label>
                <label className="mt-1 flex items-center justify-center gap-2 h-20 rounded-md border border-dashed border-border bg-muted/20 cursor-pointer hover:border-primary/50">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add screenshots, receipts, or videos</span>
                  <input type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1">
                        <span className="truncate text-foreground">{f.name} <span className="text-muted-foreground">({(f.size / 1024 / 1024).toFixed(1)}MB)</span></span>
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-destructive">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <GemBurstButton type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground">
                {submitting ? "Submitting..." : "Submit Ticket"}
              </GemBurstButton>
            </form>
          )}
        </div>

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

function QuickCard({ icon, title, subtitle, href, anchor }: { icon: React.ReactNode; title: string; subtitle: string; href?: string; anchor?: string }) {
  const cls = "flex items-center gap-3 rounded-xl bg-card/60 border border-border p-3 mc-btn hover:border-primary/40";
  const inner = (
    <>
      <div className="h-9 w-9 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{title}</div>
        <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>
      </div>
    </>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  return <a href={anchor} className={cls}>{inner}</a>;
}

function OrderLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ id: string; invoice_no: number; total: number; status: string; created_at: string; username: string }>>([]);
  const [searched, setSearched] = useState(false);

  async function search() {
    if (!query.trim()) return;
    const q = query.trim();
    let req = supabase.from("invoices").select("id,invoice_no,total,status,created_at,username");
    if (/^\d+$/.test(q)) {
      req = req.eq("invoice_no", Number(q));
    } else {
      req = req.ilike("username", q);
    }
    const { data } = await req.order("created_at", { ascending: false }).limit(20);
    setResults((data ?? []) as typeof results);
    setSearched(true);
  }

  return (
    <div id="order-lookup" className="rounded-xl bg-card/60 border border-border p-6">
      <div className="flex items-center gap-2 mb-3">
        <Receipt className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold text-foreground">Order Lookup</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Look up past purchases by username or invoice number (e.g., 42).</p>
      <div className="flex gap-2 mb-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="username or invoice #" onKeyDown={(e) => e.key === "Enter" && search()} />
        <Button onClick={search} className="gradient-primary text-primary-foreground"><Search className="h-4 w-4" /></Button>
      </div>
      {searched && results.length === 0 && <p className="text-sm text-muted-foreground">No invoices found.</p>}
      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-md bg-muted/30 border border-border p-3">
              <div className="min-w-0">
                <div className="text-sm font-mono text-primary">INV-{String(r.invoice_no).padStart(4, "0")}</div>
                <div className="text-xs text-muted-foreground">{r.username} · {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={
                  r.status === "completed" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]" :
                  r.status === "cancelled" ? "bg-red-500/15 text-red-300 border-red-500/30 text-[10px]" :
                  "bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px]"
                }>{r.status}</Badge>
                <span className="font-display font-bold text-foreground">रु {Number(r.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TicketThread({ ticket, onBack, authorName }: { ticket: Ticket; onBack: () => void; authorName: string }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    const [{ data: reps }, { data: atts }] = await Promise.all([
      supabase.from("ticket_replies").select("*").eq("ticket_id", ticket.id).order("created_at", { ascending: true }),
      supabase.from("ticket_attachments").select("id,file_url,file_name,file_size,mime_type").eq("ticket_id", ticket.id),
    ]);
    setReplies((reps ?? []) as Reply[]);
    setAttachments((atts ?? []) as Attachment[]);
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
        <TicketStatusTracker status={ticket.status} />
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed mt-2">{ticket.description}</p>
        {attachments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Attachments ({attachments.length})</div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((a) => {
                const isImg = a.mime_type?.startsWith("image/");
                return (
                  <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-border bg-muted/30 p-2 hover:border-primary/40">
                    {isImg ? (
                      <img src={a.file_url} alt={a.file_name} className="h-20 w-20 object-cover rounded" />
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center text-xs text-muted-foreground p-2 text-center">{a.file_name}</div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
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
