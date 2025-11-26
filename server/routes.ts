import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameSocket } from "./websocket";
import { insertUserSchema, insertBetSchema, gamesConfig, type GameType } from "@shared/schema";
import { z } from "zod";

// Helper to broadcast bet to all connected clients
async function broadcastBetResult(
  odejs: string,
  gameType: string,
  amount: number,
  payout: number,
  isWin: boolean
) {
  const user = await storage.getUser(odejs);
  if (user) {
    gameSocket.broadcastBet({
      odejs: user.id,
      username: user.username || user.firstName || "Player",
      photoUrl: user.photoUrl || null,
      gameType,
      amount,
      payout,
      isWin,
    });
  }
}

// Get current win rate from settings
async function getWinRate(): Promise<number> {
  try {
    const currentSettings = await storage.getSettings();
    return currentSettings.winRatePercent / 100; // Convert to decimal (e.g., 50 -> 0.5)
  } catch {
    return 0.5; // Default 50% win rate
  }
}

// Check if player should win based on admin-controlled win rate
async function shouldPlayerWin(): Promise<boolean> {
  const winRate = await getWinRate();
  return Math.random() < winRate;
}

// Game logic utilities
function generateCrashPoint(): number {
  const houseEdge = 0.97;
  const r = Math.random();
  return Math.max(1.0, Math.floor((houseEdge / (1 - r)) * 100) / 100);
}

function generateMinePositions(gridSize: number, minesCount: number): number[] {
  const positions: number[] = [];
  while (positions.length < minesCount) {
    const pos = Math.floor(Math.random() * gridSize);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

function calculateMinesMultiplier(revealed: number, mines: number, gridSize: number = 25): number {
  if (revealed === 0) return 1.0;
  const safeSpots = gridSize - mines;
  let multiplier = 1;
  for (let i = 0; i < revealed; i++) {
    multiplier *= safeSpots / (safeSpots - i);
  }
  return Math.floor(multiplier * 0.97 * 100) / 100;
}

function calculateDiceMultiplier(target: number, isOver: boolean): number {
  const winChance = isOver ? (100 - target) / 100 : target / 100;
  if (winChance <= 0) return 0;
  return Math.floor((0.97 / winChance) * 100) / 100;
}

function rollDice(): number {
  return Math.floor(Math.random() * 100) + 1;
}

function spinSlots(): { symbols: number[]; multiplier: number } {
  const symbols = [
    Math.floor(Math.random() * 6),
    Math.floor(Math.random() * 6),
    Math.floor(Math.random() * 6),
  ];
  
  const multipliers = [2, 3, 4, 5, 10, 25];
  let multiplier = 0;
  
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    multiplier = multipliers[symbols[0]];
  } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
    const matchSymbol = symbols[0] === symbols[1] ? symbols[0] : symbols[1] === symbols[2] ? symbols[1] : symbols[0];
    multiplier = Math.floor(multipliers[matchSymbol] / 3);
  }
  
  return { symbols, multiplier };
}

function getPlinkoMultipliers(rows: number): number[] {
  const mults: number[] = [];
  const slots = rows + 1;
  const center = Math.floor(slots / 2);
  
  for (let i = 0; i < slots; i++) {
    const distance = Math.abs(i - center);
    if (distance === 0) mults.push(0.5);
    else if (distance === 1) mults.push(1);
    else if (distance === 2) mults.push(1.5);
    else if (distance === 3) mults.push(3);
    else mults.push(5 + (distance - 3) * 3);
  }
  return mults;
}

function dropPlinkoBall(rows: number): { path: number[]; finalPosition: number; multiplier: number } {
  const path: number[] = [];
  let position = 0.5;
  
  for (let row = 0; row < rows; row++) {
    const direction = Math.random() < 0.5 ? -1 : 1;
    path.push(direction);
    const offset = direction * (0.5 / (rows + 1));
    position = Math.max(0.1, Math.min(0.9, position + offset));
  }
  
  const multipliers = getPlinkoMultipliers(rows);
  const slotWidth = 1 / (rows + 1);
  const finalSlot = Math.max(0, Math.min(rows, Math.floor(position / slotWidth)));
  
  return {
    path,
    finalPosition: finalSlot,
    multiplier: multipliers[finalSlot],
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get or create user by Telegram ID
  app.post("/api/users/telegram", async (req, res) => {
    try {
      const schema = z.object({
        telegramId: z.string(),
        username: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        photoUrl: z.string().optional(),
      });
      
      const data = schema.parse(req.body);
      
      let user = await storage.getUserByTelegramId(data.telegramId);
      
      if (!user) {
        user = await storage.createUser({
          telegramId: data.telegramId,
          username: data.username || null,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          photoUrl: data.photoUrl || null,
          balance: 1000,
        });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  // Update user balance
  app.patch("/api/users/:id/balance", async (req, res) => {
    try {
      const schema = z.object({
        balance: z.number().min(0),
      });
      
      const data = schema.parse(req.body);
      const user = await storage.updateUserBalance(req.params.id, data.balance);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Generate referral code for user
  app.post("/api/users/:id/referral-code", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (user.referralCode) {
        return res.json({ referralCode: user.referralCode });
      }
      
      const code = `REF${user.telegramId.slice(-6).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`;
      const updatedUser = await storage.updateUserReferralCode(user.id, code);
      
      res.json({ referralCode: code, user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: "Failed to generate referral code" });
    }
  });

  // Apply referral code
  app.post("/api/users/:id/apply-referral", async (req, res) => {
    try {
      const schema = z.object({
        referralCode: z.string(),
      });
      
      const data = schema.parse(req.body);
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (user.referredBy) {
        return res.status(400).json({ error: "Already used a referral code" });
      }
      
      const referrer = await storage.getUserByReferralCode(data.referralCode);
      
      if (!referrer) {
        return res.status(404).json({ error: "Invalid referral code" });
      }
      
      if (referrer.id === user.id) {
        return res.status(400).json({ error: "Cannot use your own referral code" });
      }
      
      // Give bonus to new user
      const bonusAmount = 100;
      const referrerBonus = 50;
      
      await storage.updateUserBalance(user.id, user.balance + bonusAmount);
      await storage.updateUserBalance(referrer.id, referrer.balance + referrerBonus);
      await storage.incrementReferralCount(referrer.id);
      
      // Update user's referredBy field
      const updatedUser = await storage.getUser(user.id);
      
      res.json({ 
        success: true, 
        bonus: bonusAmount,
        message: `You received $${bonusAmount} bonus!`,
        user: updatedUser
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to apply referral code" });
    }
  });

  // Get user referral stats
  app.get("/api/users/:id/referral-stats", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        referralCode: user.referralCode,
        referralCount: user.referralCount || 0,
        totalEarned: (user.referralCount || 0) * 50,
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to get referral stats" });
    }
  });

  // Get games config
  app.get("/api/games", (req, res) => {
    res.json(gamesConfig);
  });

  // Play Crash game
  app.post("/api/games/crash/start", async (req, res) => {
    try {
      const schema = z.object({
        odejs: z.string(),
        amount: z.number().min(1),
      });
      
      const data = schema.parse(req.body);
      const crashPoint = generateCrashPoint();
      
      res.json({
        crashPoint,
        gameId: `crash_${Date.now()}`,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Play Mines game
  app.post("/api/games/mines/start", async (req, res) => {
    try {
      const schema = z.object({
        odejs: z.string(),
        amount: z.number().min(1),
        minesCount: z.number().min(1).max(24),
      });
      
      const data = schema.parse(req.body);
      const minePositions = generateMinePositions(25, data.minesCount);
      
      res.json({
        gameId: `mines_${Date.now()}`,
        minePositions, // In production, this would be hidden
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  app.post("/api/games/mines/reveal", async (req, res) => {
    try {
      const schema = z.object({
        gameId: z.string(),
        cellIndex: z.number().min(0).max(24),
        minePositions: z.array(z.number()),
        revealedCount: z.number(),
      });
      
      const data = schema.parse(req.body);
      const isMine = data.minePositions.includes(data.cellIndex);
      const multiplier = calculateMinesMultiplier(
        data.revealedCount + (isMine ? 0 : 1),
        data.minePositions.length
      );
      
      res.json({
        isMine,
        multiplier,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Play Dice game
  app.post("/api/games/dice/roll", async (req, res) => {
    try {
      console.log("Dice roll request body:", JSON.stringify(req.body));
      
      const schema = z.object({
        odejs: z.string(),
        amount: z.number().min(1),
        target: z.number().min(2).max(98),
        isOver: z.boolean(),
      });
      
      const data = schema.parse(req.body);
      console.log("Dice roll parsed data:", JSON.stringify(data));
      
      // Get user and validate balance
      const user = await storage.getUser(data.odejs);
      console.log("User found:", user ? JSON.stringify(user) : "null");
      if (!user || user.balance < data.amount) {
        console.log("User validation failed:", !user ? "no user" : "insufficient balance");
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Check admin-controlled win rate
      const playerShouldWin = await shouldPlayerWin();
      
      // Generate roll that matches the desired outcome with safe boundary handling
      let roll: number;
      const safeTarget = Math.max(2, Math.min(98, data.target)); // Ensure valid range
      
      if (playerShouldWin) {
        // Generate winning roll
        if (data.isOver) {
          const winRange = 100 - safeTarget;
          roll = winRange > 0 ? Math.floor(Math.random() * winRange) + safeTarget + 1 : safeTarget + 1;
        } else {
          const winRange = safeTarget - 1;
          roll = winRange > 0 ? Math.floor(Math.random() * winRange) + 1 : 1;
        }
      } else {
        // Generate losing roll
        if (data.isOver) {
          roll = Math.floor(Math.random() * safeTarget) + 1;
        } else {
          const loseRange = 100 - safeTarget;
          roll = loseRange > 0 ? Math.floor(Math.random() * loseRange) + safeTarget + 1 : 100;
        }
      }
      
      // Clamp roll to valid range
      roll = Math.max(1, Math.min(100, roll));
      
      const isWin = data.isOver ? roll > data.target : roll < data.target;
      const multiplier = calculateDiceMultiplier(data.target, data.isOver);
      const payout = isWin ? data.amount * multiplier : 0;
      
      // Update balance in database
      const newBalance = user.balance - data.amount + payout;
      await storage.updateUserBalance(data.odejs, newBalance);
      
      // Record bet
      await storage.createBet({
        odejs: data.odejs,
        gameType: "dice",
        amount: data.amount,
        multiplier: isWin ? multiplier : 0,
        payout,
        isWin,
        gameData: JSON.stringify({ roll, target: data.target, isOver: data.isOver }),
      });
      
      // Broadcast to all players
      await broadcastBetResult(data.odejs, "dice", data.amount, payout, isWin);
      
      console.log("Dice roll complete, sending response");
      res.json({
        roll,
        isWin,
        multiplier: isWin ? multiplier : 0,
        payout,
        newBalance,
      });
    } catch (error) {
      console.error("Dice roll error:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Play Slots game
  app.post("/api/games/slots/spin", async (req, res) => {
    try {
      const schema = z.object({
        odejs: z.string(),
        amount: z.number().min(1),
      });
      
      const data = schema.parse(req.body);
      
      // Get user and validate balance
      const user = await storage.getUser(data.odejs);
      if (!user || user.balance < data.amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Check admin-controlled win rate
      const playerShouldWin = await shouldPlayerWin();
      
      let result;
      if (playerShouldWin) {
        // Generate winning spin (at least two matching symbols)
        const winSymbol = Math.floor(Math.random() * 6);
        const symbols = [winSymbol, winSymbol, winSymbol]; // Triple match for guaranteed win
        const multipliers = [2, 3, 4, 5, 10, 25];
        result = { symbols, multiplier: multipliers[winSymbol] };
      } else {
        // Generate losing spin (all different symbols)
        const s1 = Math.floor(Math.random() * 6);
        let s2 = (s1 + 1 + Math.floor(Math.random() * 5)) % 6;
        let s3 = (s2 + 1 + Math.floor(Math.random() * 4)) % 6;
        if (s3 === s1) s3 = (s3 + 1) % 6;
        result = { symbols: [s1, s2, s3], multiplier: 0 };
      }
      
      const isWin = result.multiplier > 0;
      const payout = isWin ? data.amount * result.multiplier : 0;
      
      // Update balance in database
      const newBalance = user.balance - data.amount + payout;
      await storage.updateUserBalance(data.odejs, newBalance);
      
      // Record bet
      await storage.createBet({
        odejs: data.odejs,
        gameType: "slots",
        amount: data.amount,
        multiplier: result.multiplier,
        payout,
        isWin,
        gameData: JSON.stringify(result),
      });
      
      // Broadcast to all players
      await broadcastBetResult(data.odejs, "slots", data.amount, payout, isWin);
      
      res.json({
        symbols: result.symbols,
        isWin,
        multiplier: result.multiplier,
        payout,
        newBalance,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Play Plinko game
  app.post("/api/games/plinko/drop", async (req, res) => {
    try {
      const schema = z.object({
        odejs: z.string(),
        amount: z.number().min(1),
        rows: z.number().min(8).max(16),
      });
      
      const data = schema.parse(req.body);
      
      // Get user and validate balance
      const user = await storage.getUser(data.odejs);
      if (!user || user.balance < data.amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Check admin-controlled win rate
      const playerShouldWin = await shouldPlayerWin();
      
      const multipliers = getPlinkoMultipliers(data.rows);
      const slots = data.rows + 1;
      const center = Math.floor(slots / 2);
      
      let result;
      if (playerShouldWin) {
        // Generate winning result (edge position with high multiplier)
        const edgePosition = Math.random() < 0.5 ? 0 : slots - 1;
        const path = [];
        for (let i = 0; i < data.rows; i++) {
          path.push(edgePosition === 0 ? -1 : 1);
        }
        result = { path, finalPosition: edgePosition, multiplier: multipliers[edgePosition] };
      } else {
        // Generate losing result (center position with low multiplier)
        const path = [];
        for (let i = 0; i < data.rows; i++) {
          path.push(Math.random() < 0.5 ? -1 : 1);
        }
        result = { path, finalPosition: center, multiplier: multipliers[center] };
      }
      
      const isWin = result.multiplier >= 1;
      const payout = data.amount * result.multiplier;
      
      // Update balance in database
      const newBalance = user.balance - data.amount + payout;
      await storage.updateUserBalance(data.odejs, newBalance);
      
      // Record bet
      await storage.createBet({
        odejs: data.odejs,
        gameType: "plinko",
        amount: data.amount,
        multiplier: result.multiplier,
        payout,
        isWin,
        gameData: JSON.stringify(result),
      });
      
      // Broadcast to all players
      await broadcastBetResult(data.odejs, "plinko", data.amount, payout, isWin);
      
      res.json({
        path: result.path,
        finalPosition: result.finalPosition,
        multiplier: result.multiplier,
        payout,
        isWin,
        newBalance,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Rock Paper Scissors game
  app.post("/api/games/scissors/play", async (req, res) => {
    try {
      const { odejs, amount, choice } = req.body;
      
      const user = await storage.getUser(odejs);
      if (!user || user.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Check admin-controlled win rate
      const playerShouldWin = await shouldPlayerWin();
      
      // Generate computer choice based on desired outcome
      const winMap: Record<string, string> = { rock: "scissors", paper: "rock", scissors: "paper" };
      const loseMap: Record<string, string> = { rock: "paper", paper: "scissors", scissors: "rock" };
      
      let computerChoice: string;
      if (playerShouldWin) {
        computerChoice = winMap[choice]; // Computer picks losing option
      } else {
        computerChoice = loseMap[choice]; // Computer picks winning option
      }
      
      let result: "win" | "lose" | "draw";
      if (choice === computerChoice) {
        result = "draw";
      } else if (
        (choice === "rock" && computerChoice === "scissors") ||
        (choice === "paper" && computerChoice === "rock") ||
        (choice === "scissors" && computerChoice === "paper")
      ) {
        result = "win";
      } else {
        result = "lose";
      }
      
      const multiplier = result === "win" ? 2 : result === "draw" ? 1 : 0;
      const payout = amount * multiplier;
      const isWin = result === "win";
      
      const newBalance = user.balance - amount + payout;
      await storage.updateUserBalance(odejs, newBalance);
      
      // Record bet
      await storage.createBet({
        odejs,
        gameType: "scissors",
        amount,
        multiplier,
        payout,
        isWin,
        gameData: JSON.stringify({ playerChoice: choice, computerChoice, result }),
      });
      
      // Broadcast to all players
      await broadcastBetResult(odejs, "scissors", amount, payout, isWin);
      
      res.json({
        playerChoice: choice,
        computerChoice,
        result,
        multiplier,
        payout,
        isWin,
        newBalance,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Turtle Race game
  app.post("/api/games/turtle/race", async (req, res) => {
    try {
      const { odejs, amount, selectedTurtle } = req.body;
      
      const user = await storage.getUser(odejs);
      if (!user || user.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      // Check admin-controlled win rate
      const playerShouldWin = await shouldPlayerWin();
      
      const turtles = ["red", "blue", "yellow"] as const;
      
      const raceProgress: Record<string, number> = {};
      turtles.forEach((t) => {
        raceProgress[t] = Math.random() * 30 + 70;
      });
      
      // Override winner based on admin-controlled outcome
      let winner: string;
      if (playerShouldWin) {
        winner = selectedTurtle;
        // Make sure selected turtle has highest progress
        raceProgress[selectedTurtle] = 100;
      } else {
        // Select any turtle except the player's choice
        const otherTurtles = turtles.filter(t => t !== selectedTurtle);
        winner = otherTurtles[Math.floor(Math.random() * otherTurtles.length)];
        // Make sure winner has highest progress
        raceProgress[winner] = 100;
        raceProgress[selectedTurtle] = Math.min(raceProgress[selectedTurtle], 95);
      }
      
      const isWin = winner === selectedTurtle;
      const multiplier = isWin ? 3 : 0;
      const payout = amount * multiplier;
      
      const newBalance = user.balance - amount + payout;
      await storage.updateUserBalance(odejs, newBalance);
      
      // Record bet
      await storage.createBet({
        odejs,
        gameType: "turtle",
        amount,
        multiplier,
        payout,
        isWin,
        gameData: JSON.stringify({ selectedTurtle, winner, raceProgress }),
      });
      
      // Broadcast to all players
      await broadcastBetResult(odejs, "turtle", amount, payout, isWin);
      
      res.json({
        selectedTurtle,
        winner,
        raceProgress,
        multiplier,
        payout,
        isWin,
        newBalance,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Get user bet history
  app.get("/api/users/:userId/bets", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const bets = await storage.getUserBets(req.params.userId, limit);
    res.json(bets);
  });

  // Get recent bets (for live feed)
  app.get("/api/bets/recent", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const bets = await storage.getRecentBets(limit);
    res.json(bets);
  });

  // Get online stats
  app.get("/api/stats/online", (req, res) => {
    res.json(gameSocket.getStats());
  });

  // ===== WALLET & DEPOSIT ENDPOINTS =====

  // Connect wallet
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { odejs, walletAddress } = req.body;
      
      const user = await storage.getUser(odejs);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      await storage.updateUserWallet(odejs, walletAddress);
      res.json({ success: true, walletAddress });
    } catch (error) {
      res.status(400).json({ error: "Failed to connect wallet" });
    }
  });

  // Deposit funds (simulated - in production would verify blockchain transaction)
  app.post("/api/wallet/deposit", async (req, res) => {
    try {
      const { odejs, amount, txHash } = req.body;
      
      const user = await storage.getUser(odejs);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (!user.walletAddress) {
        return res.status(400).json({ error: "Wallet not connected" });
      }
      
      const newBalance = user.balance + amount;
      await storage.updateUserBalance(odejs, newBalance);
      
      res.json({ success: true, newBalance, txHash });
    } catch (error) {
      res.status(400).json({ error: "Failed to deposit" });
    }
  });

  // Request withdrawal
  app.post("/api/wallet/withdraw", async (req, res) => {
    try {
      const { odejs, amount, walletAddress } = req.body;
      
      if (!odejs || !amount || amount <= 0) {
        return res.status(400).json({ error: "Некорректный запрос" });
      }

      if (!walletAddress || !walletAddress.trim()) {
        return res.status(400).json({ error: "Укажите адрес кошелька" });
      }

      if (amount < 10) {
        return res.status(400).json({ error: "Минимальная сумма вывода: 10 USDT" });
      }

      const user = await storage.getUser(odejs);
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
      
      if (user.balance < amount) {
        return res.status(400).json({ error: "Недостаточно средств" });
      }
      
      // Deduct balance immediately
      await storage.updateUserBalance(odejs, user.balance - amount);
      
      // Create withdrawal request with provided wallet address
      const withdrawalData: any = {
        amount,
        walletAddress: walletAddress.trim(),
        status: "pending",
      };
      withdrawalData["user" + "Id"] = odejs;
      const withdrawal = await storage.createWithdrawal(withdrawalData);
      
      res.json({ success: true, withdrawal, newBalance: user.balance - amount });
    } catch (error) {
      res.status(400).json({ error: "Не удалось создать запрос на вывод" });
    }
  });

  // Get user withdrawals
  app.get("/api/wallet/withdrawals/:odejs", async (req, res) => {
    try {
      const allWithdrawals = await storage.getAllWithdrawals();
      const userWithdrawals = allWithdrawals.filter(w => w.odejs === req.params.odejs);
      res.json(userWithdrawals);
    } catch (error) {
      res.status(400).json({ error: "Failed to get withdrawals" });
    }
  });

  // ===== ADMIN ENDPOINTS =====

  // Middleware to check admin - verifies user exists and has admin privileges
  // Note: For production, implement Telegram initData HMAC verification
  const checkAdmin: RequestHandler = async (req, res, next) => {
    const adminId = req.headers["x-admin-id"] as string;
    if (!adminId) {
      res.status(401).json({ error: "Unauthorized - Admin ID required" });
      return;
    }
    
    const admin = await storage.getUser(adminId);
    if (!admin) {
      res.status(401).json({ error: "Unauthorized - User not found" });
      return;
    }
    
    // Check if user is admin by isAdmin flag OR by username (nahalist is always admin)
    const isAdminUser = admin.isAdmin || admin.username === "nahalist";
    if (!isAdminUser) {
      res.status(403).json({ error: "Forbidden - Admin access required" });
      return;
    }
    
    // Attach admin user to request for use in route handlers
    (req as any).adminUser = admin;
    next();
  };

  // Get admin settings
  app.get("/api/admin/settings", checkAdmin, async (req, res) => {
    try {
      const currentSettings = await storage.getSettings();
      res.json(currentSettings);
    } catch (error) {
      res.status(400).json({ error: "Failed to get settings" });
    }
  });

  // Update win rate
  app.post("/api/admin/settings/winrate", checkAdmin, async (req, res) => {
    try {
      const { winRatePercent } = req.body;
      const adminId = req.headers["x-admin-id"] as string;
      
      if (winRatePercent < 0 || winRatePercent > 100) {
        return res.status(400).json({ error: "Win rate must be between 0 and 100" });
      }
      
      const updated = await storage.updateWinRate(winRatePercent, adminId);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update win rate" });
    }
  });

  // Get pending withdrawals
  app.get("/api/admin/withdrawals", checkAdmin, async (req, res) => {
    try {
      const pendingWithdrawals = await storage.getPendingWithdrawals();
      res.json(pendingWithdrawals);
    } catch (error) {
      res.status(400).json({ error: "Failed to get withdrawals" });
    }
  });

  // Get all withdrawals
  app.get("/api/admin/withdrawals/all", checkAdmin, async (req, res) => {
    try {
      const allWithdrawals = await storage.getAllWithdrawals();
      res.json(allWithdrawals);
    } catch (error) {
      res.status(400).json({ error: "Failed to get withdrawals" });
    }
  });

  // Process withdrawal (approve/reject)
  app.post("/api/admin/withdrawals/:id/process", checkAdmin, async (req, res) => {
    try {
      const { status } = req.body; // "approved" or "rejected"
      const adminId = req.headers["x-admin-id"] as string;
      
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const withdrawal = await storage.processWithdrawal(req.params.id, status, adminId);
      
      if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal not found" });
      }
      
      // If rejected, refund the user
      if (status === "rejected") {
        const user = await storage.getUser(withdrawal.odejs);
        if (user) {
          await storage.updateUserBalance(withdrawal.odejs, user.balance + withdrawal.amount);
        }
      }
      
      res.json(withdrawal);
    } catch (error) {
      res.status(400).json({ error: "Failed to process withdrawal" });
    }
  });

  // Get all users (admin)
  app.get("/api/admin/users", checkAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      res.status(400).json({ error: "Failed to get users" });
    }
  });

  // Update user balance (admin)
  app.post("/api/admin/users/:id/balance", checkAdmin, async (req, res) => {
    try {
      const { balance } = req.body;
      const user = await storage.updateUserBalance(req.params.id, balance);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Failed to update balance" });
    }
  });

  // ===== PROMO CODE ENDPOINTS =====

  // Apply promo code
  app.post("/api/promo/apply", async (req, res) => {
    try {
      const { odejs, code } = req.body;
      
      if (!odejs || !code) {
        return res.status(400).json({ error: "Требуется ID пользователя и промокод" });
      }

      const user = await storage.getUser(odejs);
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      const promo = await storage.getPromoCode(code.toUpperCase());
      if (!promo) {
        return res.status(400).json({ error: "Промокод не найден" });
      }

      if (!promo.isActive) {
        return res.status(400).json({ error: "Промокод неактивен" });
      }

      if (promo.maxUses && promo.maxUses > 0 && (promo.currentUses || 0) >= promo.maxUses) {
        return res.status(400).json({ error: "Лимит использований промокода исчерпан" });
      }

      const alreadyUsed = await storage.checkPromoCodeUsage(odejs, promo.id);
      if (alreadyUsed) {
        return res.status(400).json({ error: "Вы уже использовали этот промокод" });
      }

      // Apply bonus
      const newBalance = user.balance + promo.bonusAmount;
      await storage.updateUserBalance(odejs, newBalance);
      await storage.incrementPromoCodeUsage(promo.id);
      await storage.recordPromoCodeUsage(odejs, promo.id);

      res.json({ 
        success: true, 
        bonus: promo.bonusAmount, 
        newBalance 
      });
    } catch (error) {
      console.error("Promo code error:", error);
      res.status(400).json({ error: "Не удалось применить промокод" });
    }
  });

  // Get all promo codes (admin)
  app.get("/api/admin/promo-codes", checkAdmin, async (req, res) => {
    try {
      const codes = await storage.getAllPromoCodes();
      res.json(codes);
    } catch (error) {
      res.status(400).json({ error: "Failed to get promo codes" });
    }
  });

  // Create promo code (admin)
  app.post("/api/admin/promo-codes", checkAdmin, async (req, res) => {
    try {
      const { code, bonusAmount, maxUses } = req.body;
      const adminId = req.headers["x-admin-id"] as string;
      
      if (!code || !bonusAmount) {
        return res.status(400).json({ error: "Код и сумма бонуса обязательны" });
      }

      const existing = await storage.getPromoCode(code.toUpperCase());
      if (existing) {
        return res.status(400).json({ error: "Такой промокод уже существует" });
      }

      const promoCode = await storage.createPromoCode({
        code: code.toUpperCase(),
        bonusAmount,
        maxUses: maxUses || 0,
        isActive: true,
        createdBy: adminId,
      });

      res.json(promoCode);
    } catch (error) {
      res.status(400).json({ error: "Failed to create promo code" });
    }
  });

  // ===== ACTIVITY & HISTORY ENDPOINTS =====

  // Update user last seen (called on every app open)
  app.post("/api/users/:id/heartbeat", async (req, res) => {
    try {
      const user = await storage.updateLastSeen(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to update activity" });
    }
  });

  // Get recently active users (admin)
  app.get("/api/admin/users/active", checkAdmin, async (req, res) => {
    try {
      const activeUsers = await storage.getRecentlyActiveUsers();
      res.json(activeUsers);
    } catch (error) {
      res.status(400).json({ error: "Failed to get active users" });
    }
  });

  // Get user game history (admin)
  app.get("/api/admin/users/:id/bets", checkAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const userBets = await storage.getUserBets(req.params.id, limit);
      res.json(userBets);
    } catch (error) {
      res.status(400).json({ error: "Failed to get user bets" });
    }
  });

  // Get user balance history (admin)
  app.get("/api/admin/users/:id/balance-history", checkAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await storage.getBalanceHistory(req.params.id, limit);
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: "Failed to get balance history" });
    }
  });

  // Get user withdrawals (admin)
  app.get("/api/admin/users/:id/withdrawals", checkAdmin, async (req, res) => {
    try {
      const userWithdrawals = await storage.getUserWithdrawals(req.params.id);
      res.json(userWithdrawals);
    } catch (error) {
      res.status(400).json({ error: "Failed to get user withdrawals" });
    }
  });

  // Get all recent bets (admin)
  app.get("/api/admin/bets", checkAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const recentBets = await storage.getRecentBets(limit);
      res.json(recentBets);
    } catch (error) {
      res.status(400).json({ error: "Failed to get bets" });
    }
  });

  // Get all balance history (admin)
  app.get("/api/admin/balance-history", checkAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const history = await storage.getAllBalanceHistory(limit);
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: "Failed to get balance history" });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server
  gameSocket.setup(httpServer);

  return httpServer;
}
