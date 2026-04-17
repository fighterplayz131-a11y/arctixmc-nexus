export type Rank = {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  perks: string[];
  commands: string[];
  tag?: "Best Value" | "Popular" | "";
  color: string;
};

export type CoinPack = {
  id: string;
  coins: number;
  price: number;
  bonus?: string;
};

export type CrateKey = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type Settings = {
  serverName: string;
  serverIp: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
};

export const defaultRanks: Rank[] = [
  {
    id: "arctix",
    name: "ARCTIX",
    price: 2499,
    discountPrice: 1799,
    tag: "Best Value",
    color: "#00d4ff",
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
    color: "#a855f7",
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
    color: "#fbbf24",
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
    color: "#22d3ee",
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
    color: "#10b981",
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
  { id: "c1", coins: 800, price: 75 },
  { id: "c2", coins: 1700, price: 150, bonus: "+6%" },
  { id: "c3", coins: 3500, price: 275, bonus: "+10%" },
  { id: "c4", coins: 6800, price: 420, bonus: "+15%" },
  { id: "c5", coins: 10000, price: 600, bonus: "+20%" },
  { id: "c6", coins: 18000, price: 999, bonus: "+30%" },
];

export const defaultKeys: CrateKey[] = [
  { id: "k1", name: "Common Crate Key", description: "Unlock common rewards: tools, food and basic gear.", price: 99 },
  { id: "k2", name: "Rare Crate Key", description: "Rare loot, enchanted items and bonus coins.", price: 199 },
  { id: "k3", name: "Epic Crate Key", description: "Epic gear, rare cosmetics and high-tier rewards.", price: 349 },
  { id: "k4", name: "Mythic Crate Key", description: "The best loot — exclusive items, max enchants and big coin drops.", price: 599 },
];

export const defaultSettings: Settings = {
  serverName: "ArctixMC",
  serverIp: "play.arctixmc.net",
  heroTitle: "Welcome to ArctixMC",
  heroSubtitle: "The Ultimate Survival Experience",
  primaryColor: "#00d4ff",
};
