import { Link } from "@tanstack/react-router";
import { ShoppingCart, User, LogOut, Menu, X, LifeBuoy } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "./LoginDialog";
import { DiscordIcon } from "./DiscordIcon";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/arctix-logo.png";

export function Navbar() {
  const { cart, username, logout, settings } = useStore();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const links = [
    { to: "/", label: "Home" },
    { to: "/store", label: "Store" },
    { to: "/tickets", label: "Support" },
    { to: "/cart", label: "Cart" },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-sm border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="ArctixMC" className="h-9 w-9 rounded-md object-cover" width={36} height={36} />
            <span className="font-display text-lg font-bold tracking-wider text-foreground">
              {settings.serverName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
                activeProps={{ className: "px-3 py-2 text-sm font-medium text-primary rounded-md bg-primary/10" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <a
              href={settings.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5865F2]/15 text-[#8a93f5] hover:bg-[#5865F2]/25 transition-colors text-sm font-medium"
            >
              <DiscordIcon className="h-4 w-4" /> Discord
            </a>
            <Link to="/cart" className="relative p-2 rounded-md hover:bg-muted transition-colors" aria-label="Cart">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {username ? (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/70 border border-border">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setLoginOpen(true)} className="gradient-primary text-primary-foreground">
                Login
              </Button>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-2 rounded-md hover:bg-muted">
                {l.label}
              </Link>
            ))}
            <a
              href={settings.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#5865F2]/15 text-[#8a93f5]"
            >
              <DiscordIcon className="h-4 w-4" /> Join Discord
            </a>
            <Link to="/tickets" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted">
              <LifeBuoy className="h-4 w-4" /> Support
            </Link>
            <div className="pt-2 border-t border-border">
              {username ? (
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm">{username}</span>
                  <Button size="sm" variant="ghost" onClick={logout}>Logout</Button>
                </div>
              ) : (
                <Button onClick={() => { setLoginOpen(true); setOpen(false); }} className="w-full gradient-primary text-primary-foreground">
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
