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
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game types enum
export const gameTypes = ["crash", "mines", "dice", "slots", "plinko", "scissors", "turtle"] as const;
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
