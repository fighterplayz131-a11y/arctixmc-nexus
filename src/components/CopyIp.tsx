import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyIp({ ip }: { ip: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(ip); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl glass-strong hover:glow-primary transition-all"
    >
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Server IP</span>
      <span className="font-mono text-base md:text-lg text-primary glow-text">{ip}</span>
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
    </button>
  );
}
