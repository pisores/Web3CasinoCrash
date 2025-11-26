import { useState, useEffect, useCallback, useRef } from "react";
import { useTelegram } from "@/components/TelegramProvider";

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

interface MultiplayerState {
  isConnected: boolean;
  onlineCount: number;
  recentBets: LiveBet[];
}

export function useMultiplayer() {
  const { user, telegramUser } = useTelegram();
  const [state, setState] = useState<MultiplayerState>({
    isConnected: false,
    onlineCount: 0,
    recentBets: [],
  });
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setState((prev) => ({ ...prev, isConnected: true }));
        
        // Authenticate with user info
        if (user && telegramUser) {
          ws.send(JSON.stringify({
            type: "auth",
            odejs: user.id,
            username: telegramUser.username || telegramUser.first_name || "Player",
            photoUrl: telegramUser.photo_url || null,
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (e) {
          console.error("WebSocket message parse error:", e);
        }
      };

      ws.onclose = () => {
        setState((prev) => ({ ...prev, isConnected: false }));
        wsRef.current = null;
        
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }, [user, telegramUser]);

  const handleMessage = useCallback((message: any) => {
    switch (message.type) {
      case "connected":
        setState((prev) => ({
          ...prev,
          onlineCount: message.onlineCount,
          recentBets: message.recentBets || [],
        }));
        break;

      case "online_count":
        setState((prev) => ({
          ...prev,
          onlineCount: message.count,
        }));
        break;

      case "new_bet":
        setState((prev) => ({
          ...prev,
          recentBets: [message.bet, ...prev.recentBets.slice(0, 49)],
        }));
        break;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Ping to keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, []);

  return state;
}
