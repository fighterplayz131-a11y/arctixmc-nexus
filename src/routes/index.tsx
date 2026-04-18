import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store-context";
import { CopyIp } from "@/components/CopyIp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RankCard } from "@/components/RankCard";
import { CoinCard } from "@/components/CoinCard";
import { KeyCard } from "@/components/KeyCard";
import { DiscordIcon } from "@/components/DiscordIcon";
import { IcyBackground } from "@/components/IcyBackground";
import { DailyReward } from "@/components/DailyReward";
import { FlashSaleStrip } from "@/components/FlashSaleStrip";
import { Sparkles, Swords, Heart, Users, Zap, Shield, MessagesSquare, LifeBuoy, Activity, Trophy, Calendar, Clock, CheckCircle2, Award, Gift } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";

const ICONS: Record<string, typeof Zap> = { Zap, Sparkles, Shield, Users, Award, Trophy, Activity, Heart, Swords, Gift };


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArctixMC — Premium Minecraft Network" },
      { name: "description", content: "Join ArctixMC: Survival, Lifesteal and PvP. Premium ranks, coins and crate keys. IP: play.arctixmc.net" },
      { property: "og:title", content: "ArctixMC — Premium Minecraft Network" },
      { property: "og:description", content: "Premium Minecraft network. Season 1 Survival live now." },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { settings, ranks } = useStore();
  const featured = ranks.slice(0, 3);
  const bg = settings.heroBackgroundUrl || heroImage;
  const overlayAlpha = Math.min(0.95, Math.max(0, (settings.heroOverlay ?? 60) / 100));

  return (
    <div className="animate-fade-in">
      {/* Hero — Minecraft icy biome */}
      <section className="relative overflow-hidden">
        {/* Layered cinematic image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden="true"
        />
        {/* Animated parallax mountains + snow over the image */}
        <IcyBackground />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, oklch(0.15 0.03 255 / ${overlayAlpha * 0.85}), oklch(0.15 0.03 255 / ${overlayAlpha}) 70%, oklch(0.15 0.03 255) 100%)`,
          }}
        />
        <div className="absolute inset-0 mc-grid opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-28 text-center">
          <Badge className="mb-6 bg-primary/10 border border-primary/30 text-primary px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1.5" /> Season 1 — Now Live
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4 animate-slide-up">
            {settings.heroTitle}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <CopyIp ip={settings.serverIp} label={settings.copyIpLabel} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/store">
              <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-11">
                {settings.storeCtaText}
              </Button>
            </Link>
            <a href={settings.discordUrl} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="bg-card/60 border-border h-11 px-6">
                <DiscordIcon className="h-4 w-4 mr-2" /> {settings.discordCtaText}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Flash sales + Daily reward strip */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mt-6 space-y-3">
        <FlashSaleStrip />
        <DailyReward />
      </section>

      {/* Stats */}
      {settings.sections.stats && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 mt-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Users, label: "Active Players", value: settings.statActivePlayers },
              { icon: Zap, label: "Uptime", value: settings.statUptime },
              { icon: Shield, label: "Anti-Cheat", value: settings.statAntiCheat },
              { icon: Sparkles, label: "Custom Plugins", value: settings.statPlugins },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-card/80 border border-border p-4 text-center">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-display text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modes */}
      {settings.sections.modes && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-foreground">{settings.modesTitle}</h2>
            <p className="text-muted-foreground text-sm">{settings.modesSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-card/80 border border-primary/30 p-6 transition-colors hover:border-primary/50">
              <Badge className="gradient-primary text-primary-foreground border-0 mb-3">Live</Badge>
              <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-foreground">{settings.survivalTitle}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{settings.survivalText}</p>
            </div>
            <div className="rounded-xl bg-card/60 border border-border p-6 transition-colors hover:border-primary/30">
              <Badge variant="outline" className="border-border text-muted-foreground mb-3">Coming Soon</Badge>
              <div className="h-11 w-11 rounded-lg bg-rose-500/15 flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-foreground">{settings.lifestealTitle}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{settings.lifestealText}</p>
            </div>
            <div className="rounded-xl bg-card/60 border border-border p-6 transition-colors hover:border-primary/30">
              <Badge variant="outline" className="border-border text-muted-foreground mb-3">Coming Soon</Badge>
              <div className="h-11 w-11 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3">
                <Swords className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 text-foreground">{settings.pvpTitle}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{settings.pvpText}</p>
            </div>
          </div>
        </section>
      )}

      {/* Discord CTA */}
      {settings.sections.discord && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 pb-16">
          <div className="relative overflow-hidden rounded-2xl border border-[#5865F2]/30 bg-gradient-to-br from-[#5865F2]/15 via-card/70 to-card/70 p-8 md:p-10">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <Badge className="bg-[#5865F2] text-white border-0 mb-3"><MessagesSquare className="h-3 w-3 mr-1" /> Community</Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-foreground">{settings.discordTitle}</h2>
                <p className="text-muted-foreground max-w-xl leading-relaxed">{settings.discordText}</p>
              </div>
              <a href={settings.discordUrl} target="_blank" rel="noreferrer">
                <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-0 h-12 px-6">
                  <DiscordIcon className="h-5 w-5 mr-2" /> Join Server
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Featured Store */}
      {settings.sections.featured && (
        <section className="mx-auto max-w-7xl px-4 md:px-8 pb-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{settings.featuredTitle}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{settings.featuredSubtitle}</p>
            </div>
            <Link to="/store" className="hidden md:inline-flex">
              <Button variant="outline" className="bg-card/60 border-border">View All →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((r) => <RankCard key={r.id} rank={r} />)}
          </div>
        </section>
      )}

      {/* Ticket banner */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-16">
        <div className="rounded-2xl bg-card/70 border border-border p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-5 items-center">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <LifeBuoy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">{settings.ticketBannerTitle}</h3>
              <p className="text-sm text-muted-foreground">{settings.ticketBannerText}</p>
            </div>
          </div>
          <Link to="/tickets">
            <Button variant="outline" className="bg-card/60 border-border h-11 px-5">Open a Ticket</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
