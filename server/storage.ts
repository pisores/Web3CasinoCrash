import { type User, type InsertUser, type Bet, type InsertBet, users, bets } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: string, balance: number): Promise<User | undefined>;
  updateUserReferralCode(id: string, referralCode: string): Promise<User | undefined>;
  incrementReferralCount(id: string): Promise<User | undefined>;
  createBet(bet: InsertBet): Promise<Bet>;
  getUserBets(userId: string, limit?: number): Promise<Bet[]>;
  getRecentBets(limit?: number): Promise<Bet[]>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserBalance(id: string, balance: number): Promise<User | undefined> {
    const [user] = await db.update(users).set({ balance }).where(eq(users.id, id)).returning();
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

  async getUserBets(userId: string, limit: number = 10): Promise<Bet[]> {
    return db.select().from(bets).where(eq(bets.userId, userId)).orderBy(desc(bets.createdAt)).limit(limit);
  }

  async getRecentBets(limit: number = 20): Promise<Bet[]> {
    return db.select().from(bets).orderBy(desc(bets.createdAt)).limit(limit);
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bets: Map<string, Bet>;

  constructor() {
    this.users = new Map();
    this.bets = new Map();
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      balance: insertUser.balance ?? 1000,
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

  async getUserBets(userId: string, limit: number = 10): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter((bet) => bet.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getRecentBets(limit: number = 20): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new DatabaseStorage();
