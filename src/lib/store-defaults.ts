import rankArctix from "@/assets/rank-arctix.jpg";
import rankMythic from "@/assets/rank-mythic.jpg";
import rankLegend from "@/assets/rank-legend.jpg";
import rankPrime from "@/assets/rank-prime.jpg";
import rankElite from "@/assets/rank-elite.jpg";

export type Rank = {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  perks: string[];
  commands: string[];
  tag?: "Best Value" | "Popular" | "";
  color: string;
  image?: string;
};

export type CoinPack = {
  id: string;
  coins: number;
  price: number;
  bonus?: string;
  visible?: boolean;
};

export type CrateKey = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  active?: boolean;
};

export type SectionVisibility = {
  stats: boolean;
  modes: boolean;
  discord: boolean;
  featured: boolean;
};

export type Settings = {
  serverName: string;
  serverIp: string;
  heroTitle: string;
  heroSubtitle: string;
  copyIpLabel: string;
  storeCtaText: string;
  discordCtaText: string;
  primaryColor: string;
  discordUrl: string;
  glowIntensity: number;
  heroOverlay: number; // 0-100 darkness
  heroBackgroundUrl?: string;
  // Section copy
  modesTitle: string;
  modesSubtitle: string;
  survivalTitle: string;
  survivalText: string;
  lifestealTitle: string;
  lifestealText: string;
  pvpTitle: string;
  pvpText: string;
  discordTitle: string;
  discordText: string;
  featuredTitle: string;
  featuredSubtitle: string;
  ticketBannerTitle: string;
  ticketBannerText: string;
  // Stats (editable on homepage)
  statActivePlayers: string;
  statUptime: string;
  statAntiCheat: string;
  statPlugins: string;
  sections: SectionVisibility;
  faqs: { q: string; a: string }[];
  supportTitle: string;
  supportSubtitle: string;
};

export const defaultRanks: Rank[] = [
  {
    id: "arctix",
    name: "ARCTIX",
    price: 2499,
    discountPrice: 1799,
    tag: "Best Value",
    color: "#8AEFFF",
    image: rankArctix,
    perks: [
      "Exclusive [ARCTIX] tag",
      "All previous rank perks",
      "/fly in lobby & survival hub",
      "10 sethomes",
      "Custom join messages",
      "Access to private ARCTIX realm",
      "Monthly 5,000 coins bonus",
      "Priority support",
    ],
    commands: ["lp user {player} parent set arctix"],
  },
  {
    id: "mythic",
    name: "MYTHIC",
    price: 1799,
    discountPrice: 1299,
    tag: "Popular",
    color: "#8AFFBD",
    image: rankMythic,
    perks: [
      "Exclusive [MYTHIC] tag",
      "All LEGEND perks",
      "8 sethomes",
      "Mythic kit (weekly)",
      "Custom particles trail",
      "Monthly 3,000 coins bonus",
    ],
    commands: ["lp user {player} parent set mythic"],
  },
  {
    id: "legend",
    name: "LEGEND",
    price: 1299,
    discountPrice: 899,
    tag: "",
    color: "#FF953B",
    image: rankLegend,
    perks: [
      "Exclusive [LEGEND] tag",
      "All PRIME perks",
      "6 sethomes",
      "Legend kit (weekly)",
      "Colored chat + bold",
      "Monthly 1,500 coins bonus",
    ],
    commands: ["lp user {player} parent set legend"],
  },
  {
    id: "prime",
    name: "PRIME",
    price: 899,
    discountPrice: 599,
    tag: "",
    color: "#FF1C72",
    image: rankPrime,
    perks: [
      "Exclusive [PRIME] tag",
      "All ELITE perks",
      "4 sethomes",
      "Prime kit (weekly)",
      "Colored chat",
    ],
    commands: ["lp user {player} parent set prime"],
  },
  {
    id: "elite",
    name: "ELITE",
    price: 499,
    discountPrice: 349,
    tag: "",
    color: "#911CFF",
    image: rankElite,
    perks: [
      "Exclusive [ELITE] tag",
      "3 sethomes",
      "Elite kit (weekly)",
      "/hat command",
      "Access to /workbench",
    ],
    commands: ["lp user {player} parent set elite"],
  },
];

export const defaultCoins: CoinPack[] = [
  { id: "c1", coins: 800, price: 75, visible: true },
  { id: "c2", coins: 1700, price: 150, bonus: "+6%", visible: true },
  { id: "c3", coins: 3500, price: 275, bonus: "+10%", visible: true },
  { id: "c4", coins: 6800, price: 420, bonus: "+15%", visible: true },
  { id: "c5", coins: 10000, price: 600, bonus: "+20%", visible: true },
  { id: "c6", coins: 18000, price: 999, bonus: "+30%", visible: true },
];

export const defaultKeys: CrateKey[] = [
  { id: "k1", name: "Common Crate Key", description: "Unlock common rewards: tools, food and basic gear.", price: 99, active: true },
  { id: "k2", name: "Rare Crate Key", description: "Rare loot, enchanted items and bonus coins.", price: 199, active: true },
  { id: "k3", name: "Epic Crate Key", description: "Epic gear, rare cosmetics and high-tier rewards.", price: 349, active: true },
  { id: "k4", name: "Mythic Crate Key", description: "The best loot — exclusive items, max enchants and big coin drops.", price: 599, active: true },
];

export const defaultSettings: Settings = {
  serverName: "ArctixMC",
  serverIp: "play.arctixmc.net",
  heroTitle: "Welcome to ArctixMC",
  heroSubtitle: "A premium Minecraft network — Survival, Lifesteal & PvP. Forge your legend in the frozen realm.",
  copyIpLabel: "Server IP",
  storeCtaText: "Visit Store",
  discordCtaText: "Join Discord",
  primaryColor: "#8AEFFF",
  discordUrl: "https://discord.gg/arctixmc",
  glowIntensity: 25,
  heroOverlay: 60,
  heroBackgroundUrl: "",
  modesTitle: "Game Modes",
  modesSubtitle: "Live now and coming soon",
  survivalTitle: "Survival Season 1",
  survivalText: "Build, explore and thrive in a fresh world with custom enchants, land claims and a rich economy.",
  lifestealTitle: "Lifesteal",
  lifestealText: "Steal hearts, build alliances, and survive the most intense PvP economy.",
  pvpTitle: "PvP Practice",
  pvpText: "Sharpen your skills with crystal, sumo, build-uhc and ranked duels.",
  discordTitle: "Join our Discord",
  discordText: "Get support, find teammates, and stay updated on new seasons, events and giveaways. Our staff team responds fast.",
  featuredTitle: "Featured Ranks",
  featuredSubtitle: "Unlock perks and stand out on the server",
  ticketBannerTitle: "Need Help?",
  ticketBannerText: "Open a support ticket and our staff will get back to you fast.",
  statActivePlayers: "2,400+",
  statUptime: "99.9%",
  statAntiCheat: "Premium",
  statPlugins: "30+",
  sections: { stats: true, modes: true, discord: true, featured: true },
  supportTitle: "Support Center",
  supportSubtitle: "Need help? Browse common questions or open a ticket — our staff replies fast.",
  faqs: [
    { q: "How do I receive my rank after purchase?", a: "Ranks are delivered automatically within a few minutes of payment. If it hasn't arrived in 30 minutes, open a Purchase Issue ticket with your in-game username." },
    { q: "What payment methods do you accept?", a: "We accept eSewa, Khalti, IME Pay, and major credit/debit cards through our checkout flow." },
    { q: "Can I refund my purchase?", a: "Refunds are only issued in the case of a duplicate charge or undelivered item. Please open a ticket with your invoice number." },
    { q: "How do I report a player or bug?", a: "Open a ticket under Bug Report or Staff Help with screenshots/video links and full details. We review reports within 24 hours." },
    { q: "When does Lifesteal/PvP launch?", a: "Lifesteal and PvP Practice are coming soon. Follow our Discord for the official launch dates and beta access." },
  ],
};
