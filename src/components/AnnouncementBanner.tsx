import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, X } from "lucide-react";

type Announcement = { id: string; title: string; body: string | null; variant: string };

export function AnnouncementBanner() {
  const [list, setList] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("announcements")
        .select("id,title,body,variant,starts_at,ends_at")
        .eq("active", true)
        .lte("starts_at", now)
        .order("created_at", { ascending: false });
      const filtered = (data ?? []).filter((a) => !a.ends_at || a.ends_at > now);
      setList(filtered as Announcement[]);
    })();
    try {
      const raw = localStorage.getItem("arctix:announcements_dismissed");
      if (raw) setDismissed(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  function dismiss(id: string) {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    localStorage.setItem("arctix:announcements_dismissed", JSON.stringify([...next]));
  }

  const visible = list.filter((a) => !dismissed.has(a.id));
  if (!visible.length) return null;

  return (
    <div className="space-y-1.5">
      {visible.map((a) => (
        <div
          key={a.id}
          className={`flex items-start gap-3 px-4 py-2.5 text-sm border-b ${
            a.variant === "warning"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
              : a.variant === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-primary/10 border-primary/30 text-foreground"
          }`}
        >
          <Megaphone className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold">{a.title}</span>
            {a.body && <span className="ml-2 opacity-80">{a.body}</span>}
          </div>
          <button onClick={() => dismiss(a.id)} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
