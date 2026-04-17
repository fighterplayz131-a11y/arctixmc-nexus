import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { CopyIp } from "@/components/CopyIp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RankCard } from "@/components/RankCard";
import { Sparkles, Swords, Heart, Users, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArctixMC — Premium Minecraft Survival Server" },
      { name: "description", content: "Join ArctixMC Survival Season 1. Premium ranks, coins, and crate keys. IP: play.arctixmc.net" },
      { property: "og:title", content: "ArctixMC — Premium Minecraft Survival Server" },
      { property: "og:description", content: "The ultimate Minecraft survival experience. Season 1 live now." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { settings, ranks } = useStore();
  const featured = ranks.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-24 md:pt-32 md:pb-32 text-center">
          <Badge className="mb-6 glass border-primary/30 text-primary px-4 py-1.5">
            <Sparkles className="h-3 w-3 mr-1.5" /> Season 1 — Now Live
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight gradient-text glow-text mb-4 animate-slide-up">
            {settings.heroTitle}
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <CopyIp ip={settings.serverIp} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/store">
              <Button size="lg" className="gradient-primary text-primary-foreground glow-primary px-8 h-12">
                Visit Store
              </Button>
            </Link>
            <a href="#modes">
              <Button size="lg" variant="outline" className="glass h-12 px-8">Explore Modes</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Active Players", value: "2,400+" },
            { icon: Zap, label: "Uptime", value: "99.9%" },
            { icon: Shield, label: "Anti-Cheat", value: "Premium" },
            { icon: Sparkles, label: "Custom Plugins", value: "30+" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl glass p-5 text-center">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-3 gradient-text">Game Modes</h2>
          <p className="text-muted-foreground">Live now and coming soon</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl glass-strong p-7 hover:glow-primary transition-all">
            <Badge className="gradient-primary text-primary-foreground border-0 mb-3">Live</Badge>
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 glow-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Survival Season 1</h3>
            <p className="text-sm text-muted-foreground">Build, explore, and thrive in a fresh world with custom enchants, land claims, and a thriving economy.</p>
          </div>
          <div className="rounded-2xl glass p-7 hover:glow-primary transition-all">
            <Badge variant="outline" className="border-primary/40 text-primary mb-3">Coming Soon</Badge>
            <div className="h-12 w-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-rose-400" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Lifesteal</h3>
            <p className="text-sm text-muted-foreground">Steal hearts, build alliances, and survive the most intense PvP economy ever crafted.</p>
          </div>
          <div className="rounded-2xl glass p-7 hover:glow-primary transition-all">
            <Badge variant="outline" className="border-primary/40 text-primary mb-3">Coming Soon</Badge>
            <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <Swords className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">PvP Practice</h3>
            <p className="text-sm text-muted-foreground">Sharpen your skills with crystal, sumo, build-uhc, and ranked duels.</p>
          </div>
        </div>
      </section>

      {/* Featured Store */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold gradient-text">Featured Ranks</h2>
            <p className="text-muted-foreground mt-2">Unlock perks and stand out on the server</p>
          </div>
          <Link to="/store" className="hidden md:inline-flex">
            <Button variant="outline" className="glass">View All →</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((r) => <RankCard key={r.id} rank={r} />)}
        </div>
      </section>
    </div>
  );
}
