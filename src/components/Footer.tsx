import { useStore } from "@/lib/store-context";
import { Twitter, MessageCircle, Youtube } from "lucide-react";

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="mt-24 border-t border-border glass">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">A</div>
            <span className="font-display text-lg font-bold gradient-text">{settings.serverName}</span>
          </div>
          <p className="text-sm text-muted-foreground">The ultimate Minecraft survival experience. Join thousands of players today.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Server</h4>
          <p className="text-sm text-muted-foreground">IP: <span className="text-primary font-mono">{settings.serverIp}</span></p>
          <p className="text-sm text-muted-foreground mt-1">Java Edition · 1.20+</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Community</h4>
          <div className="flex gap-3">
            <a href="#" className="p-2 rounded-md glass hover:glow-primary transition-all"><MessageCircle className="h-4 w-4" /></a>
            <a href="#" className="p-2 rounded-md glass hover:glow-primary transition-all"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="p-2 rounded-md glass hover:glow-primary transition-all"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.serverName}. Not affiliated with Mojang or Microsoft.
      </div>
    </footer>
  );
}
