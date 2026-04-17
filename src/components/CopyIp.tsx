import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyIp({ ip, label = "Server IP" }: { ip: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(ip); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="group inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-card/80 border border-border hover:border-primary/50 transition-colors"
    >
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-mono text-base md:text-lg text-primary font-semibold">{ip}</span>
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
    </button>
  );
}
