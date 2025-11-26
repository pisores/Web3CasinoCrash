import { type User, type InsertUser, type Bet, type InsertBet, type Withdrawal, type InsertWithdrawal, type Settings, type PromoCode, type InsertPromoCode, type PromoCodeUsage, type BalanceHistory, type PokerTable, type PokerSeat, users, bets, withdrawals, settings, promoCodes, promoCodeUsage, balanceHistory, pokerTables, pokerSeats } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
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
  updateUserAdmin(id: string, isAdmin: boolean): Promise<User | undefined>;
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
  // Promo codes
  getPromoCode(code: string): Promise<PromoCode | undefined>;
  getPromoCodeById(id: string): Promise<PromoCode | undefined>;
  createPromoCode(promoCode: InsertPromoCode): Promise<PromoCode>;
  getAllPromoCodes(): Promise<PromoCode[]>;
  incrementPromoCodeUsage(id: string): Promise<PromoCode | undefined>;
  checkPromoCodeUsage(odejs: string, promoCodeId: string): Promise<boolean>;
  recordPromoCodeUsage(odejs: string, promoCodeId: string): Promise<PromoCodeUsage>;
  // User activity & balance history
  updateLastSeen(id: string): Promise<User | undefined>;
  getRecentlyActiveUsers(): Promise<User[]>;
  addBalanceHistory(odejs: string, amount: number, balanceAfter: number, type: string, description?: string): Promise<BalanceHistory>;
  getBalanceHistory(odejs: string, limit?: number): Promise<BalanceHistory[]>;
  getAllBalanceHistory(limit?: number): Promise<BalanceHistory[]>;
  getUserWithdrawals(odejs: string): Promise<Withdrawal[]>;
  // Poker
  getPokerTables(): Promise<PokerTable[]>;
  getPokerTable(id: string): Promise<PokerTable | undefined>;
  getTableSeats(tableId: string): Promise<PokerSeat[]>;
  getPlayerSeat(tableId: string, odejs: string): Promise<PokerSeat | undefined>;
  addPlayerToTable(tableId: string, odejs: string, seatNumber: number, chipStack: number): Promise<PokerSeat>;
  removePlayerFromTable(tableId: string, odejs: string): Promise<void>;
  updateTablePlayerCount(tableId: string, count: number): Promise<void>;
  updatePlayerChipStack(tableId: string, odejs: string, chipStack: number): Promise<void>;
  updateBalance(odejs: string, amount: number, type: string, description?: string): Promise<User | undefined>;
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

  async updateUserAdmin(id: string, isAdmin: boolean): Promise<User | undefined> {
    const [user] = await db.update(users).set({ isAdmin }).where(eq(users.id, id)).returning();
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

  // Promo codes
  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, code));
    return promo;
  }

  async getPromoCodeById(id: string): Promise<PromoCode | undefined> {
    const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
    return promo;
  }

  async createPromoCode(insertPromoCode: InsertPromoCode): Promise<PromoCode> {
    const [promo] = await db.insert(promoCodes).values(insertPromoCode).returning();
    return promo;
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
  }

  async incrementPromoCodeUsage(id: string): Promise<PromoCode | undefined> {
    const current = await this.getPromoCodeById(id);
    if (!current) return undefined;
    const [promo] = await db.update(promoCodes)
      .set({ currentUses: (current.currentUses || 0) + 1 })
      .where(eq(promoCodes.id, id))
      .returning();
    return promo;
  }

  async checkPromoCodeUsage(odejs: string, promoCodeId: string): Promise<boolean> {
    const [usage] = await db.select().from(promoCodeUsage)
      .where(and(eq(promoCodeUsage.odejs, odejs), eq(promoCodeUsage.promoCodeId, promoCodeId)));
    return !!usage;
  }

  async recordPromoCodeUsage(odejs: string, promoCodeId: string): Promise<PromoCodeUsage> {
    const [usage] = await db.insert(promoCodeUsage).values({ odejs, promoCodeId }).returning();
    return usage;
  }

  async updateLastSeen(id: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ lastSeenAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async getRecentlyActiveUsers(): Promise<User[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return db.select().from(users).where(gte(users.lastSeenAt, today)).orderBy(desc(users.lastSeenAt));
  }

  async addBalanceHistory(odejs: string, amount: number, balanceAfter: number, type: string, description?: string): Promise<BalanceHistory> {
    const [history] = await db.insert(balanceHistory).values({ odejs, amount, balanceAfter, type, description }).returning();
    return history;
  }

  async getBalanceHistory(odejs: string, limit: number = 50): Promise<BalanceHistory[]> {
    return db.select().from(balanceHistory).where(eq(balanceHistory.odejs, odejs)).orderBy(desc(balanceHistory.createdAt)).limit(limit);
  }

  async getAllBalanceHistory(limit: number = 100): Promise<BalanceHistory[]> {
    return db.select().from(balanceHistory).orderBy(desc(balanceHistory.createdAt)).limit(limit);
  }

  async getUserWithdrawals(odejs: string): Promise<Withdrawal[]> {
    return db.select().from(withdrawals).where(eq(withdrawals.odejs, odejs)).orderBy(desc(withdrawals.createdAt));
  }

  // ============ POKER FUNCTIONS ============

  async getPokerTables(): Promise<PokerTable[]> {
    return db.select().from(pokerTables).where(eq(pokerTables.isActive, true)).orderBy(pokerTables.bigBlind);
  }

  async getPokerTable(id: string): Promise<PokerTable | undefined> {
    const [table] = await db.select().from(pokerTables).where(eq(pokerTables.id, id));
    return table;
  }

  async getTableSeats(tableId: string): Promise<PokerSeat[]> {
    return db.select().from(pokerSeats).where(and(eq(pokerSeats.tableId, tableId), eq(pokerSeats.isActive, true)));
  }

  async getPlayerSeat(tableId: string, odejs: string): Promise<PokerSeat | undefined> {
    const [seat] = await db.select().from(pokerSeats).where(
      and(eq(pokerSeats.tableId, tableId), eq(pokerSeats.odejs, odejs), eq(pokerSeats.isActive, true))
    );
    return seat;
  }

  async addPlayerToTable(tableId: string, odejs: string, seatNumber: number, chipStack: number): Promise<PokerSeat> {
    const [seat] = await db.insert(pokerSeats).values({
      tableId,
      odejs,
      seatNumber,
      chipStack,
    }).returning();
    return seat;
  }

  async removePlayerFromTable(tableId: string, odejs: string): Promise<void> {
    await db.update(pokerSeats)
      .set({ isActive: false })
      .where(and(eq(pokerSeats.tableId, tableId), eq(pokerSeats.odejs, odejs)));
  }

  async updateTablePlayerCount(tableId: string, count: number): Promise<void> {
    await db.update(pokerTables).set({ currentPlayers: count }).where(eq(pokerTables.id, tableId));
  }

  async updatePlayerChipStack(tableId: string, odejs: string, chipStack: number): Promise<void> {
    await db.update(pokerSeats)
      .set({ chipStack })
      .where(and(eq(pokerSeats.tableId, tableId), eq(pokerSeats.odejs, odejs), eq(pokerSeats.isActive, true)));
  }

  async updateBalance(odejs: string, amount: number, type: string, description?: string): Promise<User | undefined> {
    const user = await this.getUser(odejs);
    if (!user) return undefined;
    const newBalance = Math.max(0, user.balance + amount);
    await this.updateUserBalance(odejs, newBalance);
    await this.addBalanceHistory(odejs, amount, newBalance, type, description);
    return this.getUser(odejs);
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bets: Map<string, Bet>;
  private withdrawalsMap: Map<string, Withdrawal>;
  private settingsData: Settings;
  private promoCodesMap: Map<string, PromoCode>;
  private promoCodeUsageMap: Map<string, PromoCodeUsage>;

  constructor() {
    this.users = new Map();
    this.bets = new Map();
    this.withdrawalsMap = new Map();
    this.settingsData = { id: "global", winRatePercent: 50, updatedAt: new Date(), updatedBy: null };
    this.promoCodesMap = new Map();
    this.promoCodeUsageMap = new Map();
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
      id,
      telegramId: insertUser.telegramId,
      username: insertUser.username || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      photoUrl: insertUser.photoUrl || null,
      balance: insertUser.balance ?? 1,
      walletAddress: null,
      isAdmin: insertUser.isAdmin ?? false,
      referralCode: null,
      referredBy: null,
      referralCount: 0,
      lastSeenAt: new Date(),
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
      id,
      odejs: insertBet.odejs,
      gameType: insertBet.gameType,
      amount: insertBet.amount,
      multiplier: insertBet.multiplier ?? null,
      payout: insertBet.payout ?? null,
      isWin: insertBet.isWin,
      gameData: insertBet.gameData ?? null,
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

  // Promo codes for MemStorage
  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    return Array.from(this.promoCodesMap.values()).find(p => p.code === code);
  }

  async getPromoCodeById(id: string): Promise<PromoCode | undefined> {
    return this.promoCodesMap.get(id);
  }

  async createPromoCode(insertPromoCode: InsertPromoCode): Promise<PromoCode> {
    const id = randomUUID();
    const promo: PromoCode = {
      id,
      code: insertPromoCode.code,
      bonusAmount: insertPromoCode.bonusAmount,
      maxUses: insertPromoCode.maxUses ?? null,
      currentUses: 0,
      isActive: insertPromoCode.isActive ?? true,
      createdAt: new Date(),
      createdBy: insertPromoCode.createdBy ?? null,
    };
    this.promoCodesMap.set(id, promo);
    return promo;
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return Array.from(this.promoCodesMap.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async incrementPromoCodeUsage(id: string): Promise<PromoCode | undefined> {
    const promo = this.promoCodesMap.get(id);
    if (!promo) return undefined;
    const updated = { ...promo, currentUses: (promo.currentUses || 0) + 1 };
    this.promoCodesMap.set(id, updated);
    return updated;
  }

  async checkPromoCodeUsage(odejs: string, promoCodeId: string): Promise<boolean> {
    const key = `${odejs}-${promoCodeId}`;
    return this.promoCodeUsageMap.has(key);
  }

  async recordPromoCodeUsage(odejs: string, promoCodeId: string): Promise<PromoCodeUsage> {
    const id = randomUUID();
    const usage: PromoCodeUsage = { id, odejs, promoCodeId, usedAt: new Date() };
    const key = `${odejs}-${promoCodeId}`;
    this.promoCodeUsageMap.set(key, usage);
    return usage;
  }

  async updateLastSeen(id: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, lastSeenAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async getRecentlyActiveUsers(): Promise<User[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.users.values())
      .filter(u => u.lastSeenAt && u.lastSeenAt >= today)
      .sort((a, b) => (b.lastSeenAt?.getTime() || 0) - (a.lastSeenAt?.getTime() || 0));
  }

  async addBalanceHistory(odejs: string, amount: number, balanceAfter: number, type: string, description?: string): Promise<BalanceHistory> {
    const id = randomUUID();
    const history: BalanceHistory = { id, odejs, amount, balanceAfter, type, description: description || null, createdAt: new Date() };
    return history;
  }

  async getBalanceHistory(odejs: string, limit: number = 50): Promise<BalanceHistory[]> {
    return [];
  }

  async getAllBalanceHistory(limit: number = 100): Promise<BalanceHistory[]> {
    return [];
  }

  async getUserWithdrawals(odejs: string): Promise<Withdrawal[]> {
    return Array.from(this.withdrawalsMap.values())
      .filter(w => w.odejs === odejs)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Poker stub methods for MemStorage (in-memory implementation not used for poker)
  async getPokerTables(): Promise<PokerTable[]> {
    return [];
  }

  async getPokerTable(id: string): Promise<PokerTable | undefined> {
    return undefined;
  }

  async getTableSeats(tableId: string): Promise<PokerSeat[]> {
    return [];
  }

  async getPlayerSeat(tableId: string, odejs: string): Promise<PokerSeat | undefined> {
    return undefined;
  }

  async addPlayerToTable(tableId: string, odejs: string, seatNumber: number, chipStack: number): Promise<PokerSeat> {
    throw new Error("Poker not supported in MemStorage");
  }

  async removePlayerFromTable(tableId: string, odejs: string): Promise<void> {
    // Not supported
  }

  async updateTablePlayerCount(tableId: string, count: number): Promise<void> {
    // Not supported
  }

  async updatePlayerChipStack(tableId: string, odejs: string, chipStack: number): Promise<void> {
    // Not supported
  }

  async updateBalance(odejs: string, amount: number, type: string, description?: string): Promise<User | undefined> {
    const user = this.users.get(odejs);
    if (!user) return undefined;
    const newBalance = Math.max(0, user.balance + amount);
    const updated = { ...user, balance: newBalance };
    this.users.set(odejs, updated);
    return updated;
  }
}

export const storage = new DatabaseStorage();
