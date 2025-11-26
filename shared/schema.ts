import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, boolean } from "drizzle-orm/pg-core";
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
  balance: real("balance").notNull().default(1000),
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
  userId: text("user_id").notNull(),
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
