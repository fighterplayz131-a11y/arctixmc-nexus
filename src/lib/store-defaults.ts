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

export type Settings = {
  serverName: string;
  serverIp: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  discordUrl: string;
  glowIntensity: number; // 0-100
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
  heroSubtitle: "The Ultimate Survival Experience",
  primaryColor: "#8AEFFF",
  discordUrl: "https://discord.gg/arctixmc",
  glowIntensity: 35,
};
