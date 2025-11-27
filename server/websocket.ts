import { WebSocketServer, WebSocket } from "ws";
import { type Server } from "http";
import { getPokerManager } from "./poker/gameManager";
import type { PokerGameState, PokerAction } from "@shared/schema";
import { storage } from "./storage";

interface ConnectedUser {
  ws: WebSocket;
  odejs: string;
  username: string;
  photoUrl: string | null;
  tableId?: string;
}

interface LiveBet {
  id: string;
  odejs: string;
  username: string;
  photoUrl: string | null;
  gameType: string;
  amount: number;
  payout: number;
  isWin: boolean;
  timestamp: number;
}

interface OnlineStats {
  onlineCount: number;
  recentBets: LiveBet[];
}

class GameWebSocket {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ConnectedUser> = new Map();
  private recentBets: LiveBet[] = [];
  private maxRecentBets = 50;
  private tableSubscriptions: Map<string, Set<string>> = new Map();

  setup(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });

    const pokerManager = getPokerManager(
      (tableId, state) => this.broadcastPokerState(tableId, state),
      async (odejs, amount) => {
        const user = await storage.getUser(odejs);
        if (user) {
          await storage.updateUserBalance(odejs, user.balance + amount);
        }
      }
    );

    this.wss.on("connection", (ws) => {
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, ws, message, pokerManager);
        } catch (e) {
          console.error("WebSocket message error:", e);
        }
      });

      ws.on("close", () => {
        const client = this.clients.get(clientId);
        if (client?.tableId) {
          this.unsubscribeFromTable(clientId, client.tableId);
        }
        this.clients.delete(clientId);
        this.broadcastOnlineCount();
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(clientId);
      });

      ws.send(JSON.stringify({
        type: "connected",
        clientId,
        onlineCount: this.clients.size,
        recentBets: this.recentBets.slice(0, 20),
      }));
    });

    console.log("WebSocket server initialized on /ws");
  }

  private handleMessage(clientId: string, ws: WebSocket, message: any, pokerManager: ReturnType<typeof getPokerManager>) {
    switch (message.type) {
      case "auth":
        this.clients.set(clientId, {
          ws,
          odejs: message.odejs,
          username: message.username || "Anonymous",
          photoUrl: message.photoUrl || null,
        });
        this.broadcastOnlineCount();
        break;

      case "ping":
        ws.send(JSON.stringify({ type: "pong" }));
        break;

      case "join_table":
        this.handleJoinTable(clientId, ws, message, pokerManager);
        break;

      case "leave_table":
        this.handleLeaveTable(clientId, message, pokerManager);
        break;

      case "poker_action":
        this.handlePokerAction(clientId, message, pokerManager);
        break;

      case "sit_down":
        this.handleSitDown(clientId, message, pokerManager);
        break;

      case "stand_up":
        this.handleStandUp(clientId, message, pokerManager);
        break;
    }
  }

  private async handleJoinTable(clientId: string, ws: WebSocket, message: any, pokerManager: ReturnType<typeof getPokerManager>) {
    const { tableId, odejs } = message;
    
    const client = this.clients.get(clientId);
    if (client) {
      if (client.tableId) {
        this.unsubscribeFromTable(clientId, client.tableId);
      }
      client.tableId = tableId;
      client.odejs = odejs;
    }

    this.subscribeToTable(clientId, tableId);

    try {
      const table = await storage.getPokerTable(tableId);
      if (table) {
        pokerManager.getOrCreateTable(
          tableId,
          table.smallBlind,
          table.bigBlind,
          table.rakePercent,
          table.rakeCap
        );
      }
    } catch (e) {
      console.error("Error getting poker table:", e);
    }

    const state = pokerManager.getState(tableId, odejs);
    if (state) {
      ws.send(JSON.stringify({ type: "poker_state", state }));
    }
  }

  private handleLeaveTable(clientId: string, message: any, pokerManager: ReturnType<typeof getPokerManager>) {
    const { tableId, seatNumber } = message;
    
    if (seatNumber !== undefined) {
      pokerManager.removePlayer(tableId, seatNumber);
    }

    this.unsubscribeFromTable(clientId, tableId);
    
    const client = this.clients.get(clientId);
    if (client) {
      client.tableId = undefined;
    }
  }

  private async handleSitDown(clientId: string, message: any, pokerManager: ReturnType<typeof getPokerManager>) {
    const { tableId, odejs, seatNumber, buyIn, username, photoUrl } = message;

    const client = this.clients.get(clientId);
    if (!client) return;

    const userId = String(odejs);
    const user = await storage.getUser(userId);
    if (!user || user.balance < buyIn) {
      client.ws.send(JSON.stringify({ 
        type: "error", 
        message: "Недостаточно средств" 
      }));
      return;
    }

    try {
      const table = await storage.getPokerTable(tableId);
      if (table) {
        pokerManager.getOrCreateTable(
          tableId,
          table.smallBlind,
          table.bigBlind,
          table.rakePercent,
          table.rakeCap
        );
      }
    } catch (e) {
      console.error("Error ensuring table exists:", e);
    }

    await storage.updateUserBalance(userId, user.balance - buyIn);

    const success = pokerManager.addPlayer(tableId, {
      odejs,
      username: username || user.username || "Player",
      photoUrl: photoUrl || null,
      seatNumber,
      chipStack: buyIn,
      isSittingOut: false,
    });

    if (success) {
      console.log(`Player ${username} sat at table ${tableId} seat ${seatNumber} with ${buyIn} chips`);
      if (pokerManager.canStartHand(tableId)) {
        setTimeout(() => {
          pokerManager.startNewHand(tableId);
        }, 2000);
      }
    } else {
      await storage.updateUserBalance(userId, user.balance);
      client.ws.send(JSON.stringify({ 
        type: "error", 
        message: "Не удалось сесть за стол" 
      }));
    }
  }

  private handleStandUp(clientId: string, message: any, pokerManager: ReturnType<typeof getPokerManager>) {
    const { tableId, seatNumber } = message;
    pokerManager.removePlayer(tableId, seatNumber);
  }

  private handlePokerAction(clientId: string, message: any, pokerManager: ReturnType<typeof getPokerManager>) {
    const { tableId, seatNumber, action, amount } = message;
    pokerManager.handleAction(tableId, seatNumber, action as PokerAction, amount);
  }

  private subscribeToTable(clientId: string, tableId: string) {
    if (!this.tableSubscriptions.has(tableId)) {
      this.tableSubscriptions.set(tableId, new Set());
    }
    this.tableSubscriptions.get(tableId)!.add(clientId);
  }

  private unsubscribeFromTable(clientId: string, tableId: string) {
    const subscribers = this.tableSubscriptions.get(tableId);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.tableSubscriptions.delete(tableId);
      }
    }
  }

  private broadcastPokerState(tableId: string, state: PokerGameState) {
    const subscribers = this.tableSubscriptions.get(tableId);
    if (!subscribers) return;

    Array.from(subscribers).forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        const personalizedState = {
          ...state,
          players: state.players.map(p => ({
            ...p,
            holeCards: p.odejs === client.odejs ? p.holeCards : 
              (state.status === "showdown" && !p.isFolded ? p.holeCards : undefined)
          }))
        };
        
        client.ws.send(JSON.stringify({ 
          type: "poker_state", 
          state: personalizedState 
        }));
      }
    });
  }

  broadcastBet(bet: Omit<LiveBet, "id" | "timestamp">) {
    const liveBet: LiveBet = {
      id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...bet,
      timestamp: Date.now(),
    };

    this.recentBets.unshift(liveBet);
    if (this.recentBets.length > this.maxRecentBets) {
      this.recentBets = this.recentBets.slice(0, this.maxRecentBets);
    }

    this.broadcast({
      type: "new_bet",
      bet: liveBet,
    });
  }

  private broadcastOnlineCount() {
    this.broadcast({
      type: "online_count",
      count: this.clients.size,
    });
  }

  private broadcast(data: any) {
    if (!this.wss) return;

    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  getStats(): OnlineStats {
    return {
      onlineCount: this.clients.size,
      recentBets: this.recentBets.slice(0, 20),
    };
  }
}

export const gameSocket = new GameWebSocket();
