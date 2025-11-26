import { type User, type InsertUser, type Bet, type InsertBet, type Withdrawal, type InsertWithdrawal, type Settings, users, bets, withdrawals, settings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: string, balance: number): Promise<User | undefined>;
  updateUserWallet(id: string, walletAddress: string): Promise<User | undefined>;
  updateUserReferralCode(id: string, referralCode: string): Promise<User | undefined>;
  incrementReferralCount(id: string): Promise<User | undefined>;
  createBet(bet: InsertBet): Promise<Bet>;
  getUserBets(odejs: string, limit?: number): Promise<Bet[]>;
  getRecentBets(limit?: number): Promise<Bet[]>;
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getPendingWithdrawals(): Promise<Withdrawal[]>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  processWithdrawal(id: string, status: string, processedBy: string): Promise<Withdrawal | undefined>;
  getSettings(): Promise<Settings>;
  updateWinRate(winRatePercent: number, updatedBy: string): Promise<Settings>;
  getAllUsers(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user;
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, referralCode));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserBalance(id: string, balance: number): Promise<User | undefined> {
    const [user] = await db.update(users).set({ balance }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserWallet(id: string, walletAddress: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ walletAddress }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserReferralCode(id: string, referralCode: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ referralCode }).where(eq(users.id, id)).returning();
    return user;
  }

  async incrementReferralCount(id: string): Promise<User | undefined> {
    const currentUser = await this.getUser(id);
    if (!currentUser) return undefined;
    const newCount = (currentUser.referralCount || 0) + 1;
    const [user] = await db.update(users).set({ referralCount: newCount }).where(eq(users.id, id)).returning();
    return user;
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    const [bet] = await db.insert(bets).values(insertBet).returning();
    return bet;
  }

  async getUserBets(odejs: string, limit: number = 10): Promise<Bet[]> {
    return db.select().from(bets).where(eq(bets.odejs, odejs)).orderBy(desc(bets.createdAt)).limit(limit);
  }

  async getRecentBets(limit: number = 20): Promise<Bet[]> {
    return db.select().from(bets).orderBy(desc(bets.createdAt)).limit(limit);
  }

  async createWithdrawal(insertWithdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [withdrawal] = await db.insert(withdrawals).values(insertWithdrawal).returning();
    return withdrawal;
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return db.select().from(withdrawals).where(eq(withdrawals.status, "pending")).orderBy(desc(withdrawals.createdAt));
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
  }

  async processWithdrawal(id: string, status: string, processedBy: string): Promise<Withdrawal | undefined> {
    const [withdrawal] = await db.update(withdrawals)
      .set({ status, processedBy, processedAt: new Date() })
      .where(eq(withdrawals.id, id))
      .returning();
    return withdrawal;
  }

  async getSettings(): Promise<Settings> {
    const [existing] = await db.select().from(settings).where(eq(settings.id, "global"));
    if (existing) return existing;
    const [newSettings] = await db.insert(settings).values({ id: "global", winRatePercent: 50 }).returning();
    return newSettings;
  }

  async updateWinRate(winRatePercent: number, updatedBy: string): Promise<Settings> {
    const [updated] = await db.update(settings)
      .set({ winRatePercent, updatedBy, updatedAt: new Date() })
      .where(eq(settings.id, "global"))
      .returning();
    if (updated) return updated;
    const [newSettings] = await db.insert(settings).values({ id: "global", winRatePercent, updatedBy }).returning();
    return newSettings;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.balance));
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bets: Map<string, Bet>;
  private withdrawalsMap: Map<string, Withdrawal>;
  private settingsData: Settings;

  constructor() {
    this.users = new Map();
    this.bets = new Map();
    this.withdrawalsMap = new Map();
    this.settingsData = { id: "global", winRatePercent: 50, updatedAt: new Date(), updatedBy: null };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      balance: insertUser.balance ?? 1,
      walletAddress: null,
      isAdmin: insertUser.isAdmin ?? false,
      referralCode: null,
      referredBy: null,
      referralCount: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(id: string, balance: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, balance };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserWallet(id: string, walletAddress: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, walletAddress };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserReferralCode(id: string, referralCode: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, referralCode };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async incrementReferralCount(id: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, referralCount: (user.referralCount || 0) + 1 };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    const id = randomUUID();
    const bet: Bet = {
      ...insertBet,
      id,
      createdAt: new Date(),
    };
    this.bets.set(id, bet);
    return bet;
  }

  async getUserBets(odejs: string, limit: number = 10): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter((bet) => bet.odejs === odejs)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getRecentBets(limit: number = 20): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createWithdrawal(insertWithdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const id = randomUUID();
    const withdrawal: Withdrawal = {
      ...insertWithdrawal,
      id,
      status: "pending",
      createdAt: new Date(),
      processedAt: null,
      processedBy: null,
    };
    this.withdrawalsMap.set(id, withdrawal);
    return withdrawal;
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return Array.from(this.withdrawalsMap.values())
      .filter((w) => w.status === "pending")
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return Array.from(this.withdrawalsMap.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async processWithdrawal(id: string, status: string, processedBy: string): Promise<Withdrawal | undefined> {
    const withdrawal = this.withdrawalsMap.get(id);
    if (!withdrawal) return undefined;
    
    const updated = { ...withdrawal, status, processedBy, processedAt: new Date() };
    this.withdrawalsMap.set(id, updated);
    return updated;
  }

  async getSettings(): Promise<Settings> {
    return this.settingsData;
  }

  async updateWinRate(winRatePercent: number, updatedBy: string): Promise<Settings> {
    this.settingsData = { ...this.settingsData, winRatePercent, updatedBy, updatedAt: new Date() };
    return this.settingsData;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => b.balance - a.balance);
  }
}

export const storage = new DatabaseStorage();
