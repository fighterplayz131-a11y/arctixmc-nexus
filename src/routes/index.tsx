import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { CopyIp } from "@/components/CopyIp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RankCard } from "@/components/RankCard";
import { DiscordIcon } from "@/components/DiscordIcon";
import { Sparkles, Swords, Heart, Users, Zap, Shield, MessagesSquare } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArctixMC — Premium Minecraft Survival Server" },
      { name: "description", content: "Join ArctixMC Survival Season 1. Premium ranks, coins, and crate keys. IP: play.arctixmc.net" },
      { property: "og:title", content: "ArctixMC — Premium Minecraft Survival Server" },
      { property: "og:description", content: "The ultimate Minecraft survival experience. Season 1 live now." },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
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
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-28 text-center">
          <Badge className="mb-6 bg-primary/10 border border-primary/30 text-primary px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1.5" /> Season 1 — Now Live
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4 animate-slide-up">
            {settings.heroTitle}
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <CopyIp ip={settings.serverIp} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/store">
              <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-11">
                Visit Store
              </Button>
            </Link>
            <a href={settings.discordUrl} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="bg-card/50 border-border h-11 px-6">
                <DiscordIcon className="h-4 w-4 mr-2" /> Join Discord
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Active Players", value: "2,400+" },
            { icon: Zap, label: "Uptime", value: "99.9%" },
            { icon: Shield, label: "Anti-Cheat", value: "Premium" },
            { icon: Sparkles, label: "Custom Plugins", value: "30+" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-card/70 border border-border p-4 text-center">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-display text-xl font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-foreground">Game Modes</h2>
          <p className="text-muted-foreground text-sm">Live now and coming soon</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="rounded-xl bg-card/70 border border-primary/30 p-6 transition-colors hover:border-primary/50">
            <Badge className="gradient-primary text-primary-foreground border-0 mb-3">Live</Badge>
            <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Survival Season 1</h3>
            <p className="text-sm text-muted-foreground">Build, explore and thrive in a fresh world with custom enchants, land claims and a rich economy.</p>
          </div>
          <div className="rounded-xl bg-card/40 border border-border p-6 transition-colors hover:border-primary/30">
            <Badge variant="outline" className="border-border text-muted-foreground mb-3">Coming Soon</Badge>
            <div className="h-11 w-11 rounded-lg bg-rose-500/15 flex items-center justify-center mb-3">
              <Heart className="h-5 w-5 text-rose-400" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Lifesteal</h3>
            <p className="text-sm text-muted-foreground">Steal hearts, build alliances, and survive the most intense PvP economy.</p>
          </div>
          <div className="rounded-xl bg-card/40 border border-border p-6 transition-colors hover:border-primary/30">
            <Badge variant="outline" className="border-border text-muted-foreground mb-3">Coming Soon</Badge>
            <div className="h-11 w-11 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3">
              <Swords className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">PvP Practice</h3>
            <p className="text-sm text-muted-foreground">Sharpen your skills with crystal, sumo, build-uhc and ranked duels.</p>
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-16">
        <div className="relative overflow-hidden rounded-2xl border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/15 via-card/60 to-card/60 p-8 md:p-10">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <Badge className="bg-[#5865F2] text-white border-0 mb-3"><MessagesSquare className="h-3 w-3 mr-1" /> Community</Badge>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Join our Discord</h2>
              <p className="text-muted-foreground max-w-xl">Get support, find teammates, and stay updated on new seasons, events and giveaways. Our staff team responds fast.</p>
            </div>
            <a href={settings.discordUrl} target="_blank" rel="noreferrer">
              <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-0 h-12 px-6">
                <DiscordIcon className="h-5 w-5 mr-2" /> Join Server
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Store */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Ranks</h2>
            <p className="text-muted-foreground mt-1 text-sm">Unlock perks and stand out on the server</p>
          </div>
          <Link to="/store" className="hidden md:inline-flex">
            <Button variant="outline" className="bg-card/50 border-border">View All →</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((r) => <RankCard key={r.id} rank={r} />)}
        </div>
      </section>
    </div>
  );
}
