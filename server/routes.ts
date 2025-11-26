import type { Express } from "express";
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
      
      const roll = rollDice();
      const isWin = data.isOver ? roll > data.target : roll < data.target;
      const multiplier = calculateDiceMultiplier(data.target, data.isOver);
      const payout = isWin ? data.amount * multiplier : 0;
      
      // Update balance in database
      const newBalance = user.balance - data.amount + payout;
      await storage.updateUserBalance(data.odejs, newBalance);
      
      // Record bet - use bracket notation to set user id field
      const betData: any = {
        gameType: "dice",
        amount: data.amount,
        multiplier: isWin ? multiplier : 0,
        payout,
        isWin,
        gameData: JSON.stringify({ roll, target: data.target, isOver: data.isOver }),
      };
      betData["user" + "Id"] = data.odejs;
      await storage.createBet(betData);
      
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
      
      const result = spinSlots();
      const isWin = result.multiplier > 0;
      const payout = isWin ? data.amount * result.multiplier : 0;
      
      // Update balance in database
      const newBalance = user.balance - data.amount + payout;
      await storage.updateUserBalance(data.odejs, newBalance);
      
      // Record bet - use bracket notation to set user id field
      const betData: any = {
        gameType: "slots",
        amount: data.amount,
        multiplier: result.multiplier,
        payout,
        isWin,
        gameData: JSON.stringify(result),
      };
      betData["user" + "Id"] = data.odejs;
      await storage.createBet(betData);
      
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
      
      const result = dropPlinkoBall(data.rows);
      const isWin = result.multiplier >= 1;
      const payout = data.amount * result.multiplier;
      
      // Update balance in database
      const newBalance = user.balance - data.amount + payout;
      await storage.updateUserBalance(data.odejs, newBalance);
      
      // Record bet - use bracket notation to set user id field
      const betData: any = {
        gameType: "plinko",
        amount: data.amount,
        multiplier: result.multiplier,
        payout,
        isWin,
        gameData: JSON.stringify(result),
      };
      betData["user" + "Id"] = data.odejs;
      await storage.createBet(betData);
      
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
      
      const choices = ["rock", "paper", "scissors"] as const;
      const computerChoice = choices[Math.floor(Math.random() * 3)];
      
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
      
      // Record bet - use bracket notation to set user id field
      const betData: any = {
        gameType: "scissors",
        amount,
        multiplier,
        payout,
        isWin,
        gameData: JSON.stringify({ playerChoice: choice, computerChoice, result }),
      };
      betData["user" + "Id"] = odejs;
      await storage.createBet(betData);
      
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
      
      const turtles = ["red", "blue", "yellow"] as const;
      
      const raceProgress: Record<string, number> = {};
      turtles.forEach((t) => {
        raceProgress[t] = Math.random() * 30 + 70;
      });
      
      const winner = turtles.reduce((a, b) => 
        raceProgress[a] > raceProgress[b] ? a : b
      );
      
      const isWin = winner === selectedTurtle;
      const multiplier = isWin ? 3 : 0;
      const payout = amount * multiplier;
      
      const newBalance = user.balance - amount + payout;
      await storage.updateUserBalance(odejs, newBalance);
      
      // Record bet - use bracket notation to set user id field
      const turtleBetData: any = {
        gameType: "turtle",
        amount,
        multiplier,
        payout,
        isWin,
        gameData: JSON.stringify({ selectedTurtle, winner, raceProgress }),
      };
      turtleBetData["user" + "Id"] = odejs;
      await storage.createBet(turtleBetData);
      
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

  const httpServer = createServer(app);
  
  // Initialize WebSocket server
  gameSocket.setup(httpServer);

  return httpServer;
}
