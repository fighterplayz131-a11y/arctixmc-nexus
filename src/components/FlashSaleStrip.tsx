import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";

type Sale = { id: string; title: string; description: string | null; discount_percent: number; ends_at: string };

function timeLeft(end: string) {
  const ms = new Date(end).getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m ${s}s`;
}

export function FlashSaleStrip() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [, force] = useState(0);

  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("flash_sales")
        .select("id,title,description,discount_percent,starts_at,ends_at")
        .eq("active", true)
        .lte("starts_at", now)
        .gt("ends_at", now)
        .order("ends_at", { ascending: true });
      setSales((data ?? []) as Sale[]);
    })();
    const t = window.setInterval(() => force((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!sales.length) return null;

  return (
    <div className="space-y-2">
      {sales.map((s) => (
        <div key={s.id} className="rounded-xl bg-gradient-to-r from-red-500/15 to-amber-500/15 border border-red-400/30 p-4 flex items-center gap-4">
          <Flame className="h-7 w-7 text-red-400 shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-foreground">{s.title} <span className="ml-2 text-amber-300">−{s.discount_percent}%</span></div>
            {s.description && <div className="text-xs text-muted-foreground truncate">{s.description}</div>}
          </div>
          <div className="font-mono text-sm text-amber-200 shrink-0">{timeLeft(s.ends_at)}</div>
        </div>
      ))}
    </div>
  );
}
