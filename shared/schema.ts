import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - stores Telegram user data
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  photoUrl: text("photo_url"),
  balance: real("balance").notNull().default(1),
  walletAddress: text("wallet_address"),
  isAdmin: boolean("is_admin").default(false),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  referralCount: real("referral_count").default(0),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game types enum
export const gameTypes = ["crash", "mines", "dice", "slots", "plinko", "scissors", "turtle", "poker"] as const;
export type GameType = typeof gameTypes[number];

// Bet history table
export const bets = pgTable("bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  odejs: text("user_id").notNull(),
  gameType: text("game_type").notNull(),
  amount: real("amount").notNull(),
  multiplier: real("multiplier"),
  payout: real("payout"),
  isWin: boolean("is_win").notNull(),
  gameData: text("game_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  createdAt: true,
});

export type InsertBet = z.infer<typeof insertBetSchema>;
export type Bet = typeof bets.$inferSelect;

// Withdrawal requests table
export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  odejs: text("user_id").notNull(),
  amount: real("amount").notNull(),
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  processedBy: text("processed_by"),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  processedBy: true,
});

export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;

// Admin settings table
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default("global"),
  winRatePercent: integer("win_rate_percent").notNull().default(50),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by"),
});

export type Settings = typeof settings.$inferSelect;

// Promo codes table
export const promoCodes = pgTable("promo_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  bonusAmount: real("bonus_amount").notNull(),
  maxUses: integer("max_uses").default(0),
  currentUses: integer("current_uses").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by"),
});

export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({
  id: true,
  createdAt: true,
  currentUses: true,
});

export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;

// User promo code usage tracking
export const promoCodeUsage = pgTable("promo_code_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  odejs: text("user_id").notNull(),
  promoCodeId: text("promo_code_id").notNull(),
  usedAt: timestamp("used_at").defaultNow(),
});

export type PromoCodeUsage = typeof promoCodeUsage.$inferSelect;

// Balance history table - tracks all balance changes
export const balanceHistory = pgTable("balance_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  odejs: text("user_id").notNull(),
  amount: real("amount").notNull(),
  balanceAfter: real("balance_after").notNull(),
  type: text("type").notNull(), // 'bet', 'win', 'deposit', 'withdraw', 'promo', 'referral', 'admin'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BalanceHistory = typeof balanceHistory.$inferSelect;

// Game configuration
export interface GameConfig {
  id: GameType;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
  icon: string;
  gradient: string;
}

export const gamesConfig: GameConfig[] = [
  { id: "poker", name: "Покер", description: "Texas Hold'em NL", minBet: 0.02, maxBet: 500, icon: "cards", gradient: "from-emerald-700 to-green-900" },
  { id: "crash", name: "Crash", description: "Cash out before the crash!", minBet: 1, maxBet: 1000, icon: "rocket", gradient: "from-rose-600 to-red-800" },
  { id: "mines", name: "Mines", description: "Find gems, avoid bombs", minBet: 1, maxBet: 500, icon: "gem", gradient: "from-violet-600 to-purple-800" },
  { id: "dice", name: "Dice", description: "Roll the dice, win big", minBet: 1, maxBet: 500, icon: "dice", gradient: "from-indigo-600 to-violet-800" },
  { id: "slots", name: "Slots", description: "Spin to win jackpots", minBet: 1, maxBet: 200, icon: "cherry", gradient: "from-blue-600 to-indigo-800" },
  { id: "plinko", name: "Plinko", description: "Drop the ball, hit multipliers", minBet: 1, maxBet: 300, icon: "circle", gradient: "from-emerald-600 to-green-800" },
  { id: "scissors", name: "Rock Paper Scissors", description: "Classic game of chance", minBet: 1, maxBet: 200, icon: "hand", gradient: "from-red-600 to-rose-800" },
  { id: "turtle", name: "Turtle Race", description: "Bet on the winning turtle", minBet: 1, maxBet: 500, icon: "turtle", gradient: "from-green-600 to-emerald-800" },
];

// Crash game state
export interface CrashGameState {
  status: "waiting" | "running" | "crashed";
  multiplier: number;
  crashPoint?: number;
  startTime?: number;
}

// Mines game state
export interface MinesGameState {
  gridSize: number;
  minesCount: number;
  revealedCells: number[];
  minePositions: number[];
  currentMultiplier: number;
  isGameOver: boolean;
  isWin: boolean;
}

// Dice game result
export interface DiceResult {
  target: number;
  roll: number;
  isOver: boolean;
  isWin: boolean;
  multiplier: number;
}

// Slots result
export interface SlotsResult {
  reels: string[][];
  finalSymbols: string[];
  isWin: boolean;
  multiplier: number;
}

// Plinko result
export interface PlinkoResult {
  path: number[];
  finalPosition: number;
  multiplier: number;
}

// ============ POKER ROOM ============

// Poker table limits
export const pokerLimits = ["NL2", "NL5", "NL10", "NL25", "NL50", "NL100", "NL200", "NL500"] as const;
export type PokerLimit = typeof pokerLimits[number];

// Poker table sizes
export const tableSizes = [6, 9] as const;
export type TableSize = typeof tableSizes[number];

// Card suits and ranks
export const suits = ["hearts", "diamonds", "clubs", "spades"] as const;
export const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"] as const;
export type Suit = typeof suits[number];
export type Rank = typeof ranks[number];

export interface Card {
  rank: Rank;
  suit: Suit;
}

// Poker tables table
export const pokerTables = pgTable("poker_tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  countryFlag: text("country_flag").notNull(), // emoji flag
  limit: text("limit").notNull(), // NL2, NL5, etc.
  maxSeats: integer("max_seats").notNull().default(9),
  smallBlind: real("small_blind").notNull(),
  bigBlind: real("big_blind").notNull(),
  minBuyIn: real("min_buy_in").notNull(),
  maxBuyIn: real("max_buy_in").notNull(),
  rakePercent: real("rake_percent").notNull().default(5),
  rakeCap: real("rake_cap").notNull(), // max rake in BB
  currentPlayers: integer("current_players").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PokerTable = typeof pokerTables.$inferSelect;

// Poker seats (players at table)
export const pokerSeats = pgTable("poker_seats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableId: text("table_id").notNull(),
  odejs: text("user_id").notNull(),
  seatNumber: integer("seat_number").notNull(), // 0-8 for 9-max, 0-5 for 6-max
  chipStack: real("chip_stack").notNull(),
  isActive: boolean("is_active").default(true),
  isSittingOut: boolean("is_sitting_out").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Note: Need to add unique index via SQL migration:
// CREATE UNIQUE INDEX idx_active_seat ON poker_seats (table_id, seat_number) WHERE is_active = true;
// CREATE UNIQUE INDEX idx_active_player ON poker_seats (table_id, user_id) WHERE is_active = true;

export type PokerSeat = typeof pokerSeats.$inferSelect;

// Poker hand history
export const pokerHands = pgTable("poker_hands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableId: text("table_id").notNull(),
  handNumber: integer("hand_number").notNull(),
  smallBlind: real("small_blind").notNull(),
  bigBlind: real("big_blind").notNull(),
  pot: real("pot").notNull().default(0),
  rake: real("rake").notNull().default(0),
  communityCards: text("community_cards"), // JSON array of cards
  winners: text("winners"), // JSON array of winner info
  status: text("status").notNull().default("preflop"), // preflop, flop, turn, river, showdown, finished
  dealerSeat: integer("dealer_seat").notNull(),
  currentBet: real("current_bet").notNull().default(0),
  currentTurn: integer("current_turn"), // seat number of current player
  createdAt: timestamp("created_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
});

export type PokerHand = typeof pokerHands.$inferSelect;

// Player hands in a poker hand
export const playerHands = pgTable("player_hands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  handId: text("hand_id").notNull(),
  odejs: text("user_id").notNull(),
  seatNumber: integer("seat_number").notNull(),
  holeCards: text("hole_cards"), // JSON array of 2 cards (hidden from others)
  betAmount: real("bet_amount").notNull().default(0),
  totalBetInHand: real("total_bet_in_hand").notNull().default(0),
  isFolded: boolean("is_folded").default(false),
  isAllIn: boolean("is_all_in").default(false),
  hasActed: boolean("has_acted").default(false),
  winAmount: real("win_amount").default(0),
});

export type PlayerHand = typeof playerHands.$inferSelect;

// Poker action types
export const pokerActions = ["fold", "check", "call", "bet", "raise", "all_in"] as const;
export type PokerAction = typeof pokerActions[number];

// Poker hand ranking
export const handRankings = [
  "high_card",
  "pair",
  "two_pair",
  "three_of_a_kind",
  "straight",
  "flush",
  "full_house",
  "four_of_a_kind",
  "straight_flush",
  "royal_flush"
] as const;
export type HandRanking = typeof handRankings[number];

// Predefined poker tables configuration
export interface PokerTableConfig {
  name: string;
  countryFlag: string;
  limit: PokerLimit;
  maxSeats: TableSize;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
}

// Countries for table names
export const tableCountries = [
  { name: "Россия", flag: "🇷🇺" },
  { name: "Украина", flag: "🇺🇦" },
  { name: "Беларусь", flag: "🇧🇾" },
  { name: "Казахстан", flag: "🇰🇿" },
  { name: "Узбекистан", flag: "🇺🇿" },
  { name: "Грузия", flag: "🇬🇪" },
  { name: "Армения", flag: "🇦🇲" },
  { name: "Азербайджан", flag: "🇦🇿" },
  { name: "Молдова", flag: "🇲🇩" },
  { name: "Кыргызстан", flag: "🇰🇬" },
  { name: "Таджикистан", flag: "🇹🇯" },
  { name: "Израиль", flag: "🇮🇱" },
  { name: "США", flag: "🇺🇸" },
] as const;

// Generate predefined tables config
export function generatePokerTablesConfig(): PokerTableConfig[] {
  const tables: PokerTableConfig[] = [];
  const limits: { limit: PokerLimit; sb: number; bb: number }[] = [
    { limit: "NL2", sb: 0.01, bb: 0.02 },
    { limit: "NL5", sb: 0.02, bb: 0.05 },
    { limit: "NL10", sb: 0.05, bb: 0.10 },
    { limit: "NL25", sb: 0.10, bb: 0.25 },
    { limit: "NL50", sb: 0.25, bb: 0.50 },
    { limit: "NL100", sb: 0.50, bb: 1.00 },
    { limit: "NL200", sb: 1.00, bb: 2.00 },
    { limit: "NL500", sb: 2.50, bb: 5.00 },
  ];
  
  let countryIndex = 0;
  
  for (const { limit, sb, bb } of limits) {
    // 6-max table
    const country6 = tableCountries[countryIndex % tableCountries.length];
    tables.push({
      name: `${country6.name} ${limit}`,
      countryFlag: country6.flag,
      limit,
      maxSeats: 6,
      smallBlind: sb,
      bigBlind: bb,
      minBuyIn: bb * 20,
      maxBuyIn: bb * 100,
    });
    countryIndex++;
    
    // 9-max table
    const country9 = tableCountries[countryIndex % tableCountries.length];
    tables.push({
      name: `${country9.name} ${limit}`,
      countryFlag: country9.flag,
      limit,
      maxSeats: 9,
      smallBlind: sb,
      bigBlind: bb,
      minBuyIn: bb * 20,
      maxBuyIn: bb * 100,
    });
    countryIndex++;
  }
  
  return tables;
}

// Poker game state for WebSocket
export interface PokerGameState {
  tableId: string;
  tableName: string;
  handNumber: number;
  pot: number;
  communityCards: Card[];
  status: "waiting" | "preflop" | "flop" | "turn" | "river" | "showdown";
  dealerSeat: number;
  currentTurn: number | null;
  currentBet: number;
  minRaise: number;
  players: PokerPlayerState[];
  timeBank: number;
  actionDeadline: number; // Unix timestamp when action expires (0 = no timer)
  bigBlind: number;
  smallBlind: number;
}

export interface PokerPlayerState {
  odejs: string;
  odejsname: string;
  odejsPhotoUrl?: string;
  seatNumber: number;
  chipStack: number;
  betAmount: number;
  isFolded: boolean;
  isAllIn: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isCurrentTurn: boolean;
  holeCards?: Card[]; // Only visible to the player themselves
  isSittingOut: boolean;
  isReady: boolean; // false = away
  handStrength?: string; // e.g. "Pair", "Two Pair", "Flush"
}
