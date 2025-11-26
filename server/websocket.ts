import { WebSocketServer, WebSocket } from "ws";
import { type Server } from "http";

interface ConnectedUser {
  ws: WebSocket;
  odejs: string;
  username: string;
  photoUrl: string | null;
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

  setup(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });

    this.wss.on("connection", (ws) => {
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, ws, message);
        } catch (e) {
          console.error("WebSocket message error:", e);
        }
      });

      ws.on("close", () => {
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

  private handleMessage(clientId: string, ws: WebSocket, message: any) {
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
    }
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
