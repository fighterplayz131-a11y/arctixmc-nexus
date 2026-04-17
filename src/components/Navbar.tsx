import { Link } from "@tanstack/react-router";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "./LoginDialog";

export function Navbar() {
  const { cart, username, logout, settings } = useStore();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const links = [
    { to: "/", label: "Home" },
    { to: "/store", label: "Store" },
    { to: "/cart", label: "Cart" },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-50 glass-strong">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground glow-primary group-hover:animate-glow-pulse">
              A
            </div>
            <span className="font-display text-lg font-bold tracking-wider gradient-text">
              {settings.serverName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5"
                activeProps={{ className: "px-4 py-2 text-sm font-medium text-primary rounded-md bg-primary/10" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-md hover:bg-primary/10 transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center glow-primary">
                  {cartCount}
                </span>
              )}
            </Link>
            {username ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md glass">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setLoginOpen(true)} variant="default" className="gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
                Login
              </Button>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden glass-strong border-t border-border px-4 py-4 space-y-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-4 py-2 rounded-md hover:bg-primary/10">
                {l.label}
              </Link>
            ))}
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
