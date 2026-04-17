import { useStore } from "@/lib/store-context";
import { Link } from "@tanstack/react-router";
import { DiscordIcon } from "./DiscordIcon";
import logo from "@/assets/arctix-logo.png";

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="ArctixMC" className="h-8 w-8 rounded-md object-cover" width={32} height={32} />
            <span className="font-display text-lg font-bold text-foreground">{settings.serverName}</span>
          </div>
          <p className="text-sm text-muted-foreground">A premium Minecraft network. Survival, Lifesteal & PvP — built for the long run.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Server</h4>
          <p className="text-sm text-muted-foreground">IP: <span className="text-primary font-mono">{settings.serverIp}</span></p>
          <p className="text-sm text-muted-foreground mt-1">Java Edition · 1.20+</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Links</h4>
          <ul className="space-y-1.5 text-sm">
            <li><Link to="/store" className="text-muted-foreground hover:text-foreground">Store</Link></li>
            <li><Link to="/tickets" className="text-muted-foreground hover:text-foreground">Support Tickets</Link></li>
            <li><Link to="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">Community</h4>
          <a
            href={settings.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors text-sm font-medium"
          >
            <DiscordIcon className="h-4 w-4" /> Join our Discord
          </a>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings.serverName}. Not affiliated with Mojang or Microsoft.
      </div>
    </footer>
  );
}
