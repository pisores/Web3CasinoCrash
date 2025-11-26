import { useMultiplayer } from "@/hooks/useMultiplayer";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { gamesConfig } from "@shared/schema";

const gameNames: Record<string, string> = {
  crash: "Crash",
  mines: "Mines",
  dice: "Dice",
  slots: "Slots",
  plinko: "Plinko",
  scissors: "RPS",
  turtle: "Turtle Race",
};

export function LiveFeed() {
  const { isConnected, onlineCount, recentBets } = useMultiplayer();

  return (
    <div className="space-y-3">
      {/* Online Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {onlineCount} online
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Live Bets</span>
      </div>

      {/* Recent Bets */}
      <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
        {recentBets.slice(0, 10).map((bet) => (
          <div
            key={bet.id}
            className="flex items-center justify-between bg-card/50 rounded-lg px-3 py-2 text-sm"
            data-testid={`live-bet-${bet.id}`}
          >
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                {bet.photoUrl ? (
                  <img
                    src={bet.photoUrl}
                    alt={bet.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {bet.username[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              
              {/* Username & Game */}
              <div className="flex flex-col">
                <span className="text-foreground font-medium truncate max-w-20">
                  {bet.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {gameNames[bet.gameType] || bet.gameType}
                </span>
              </div>
            </div>

            {/* Amount & Result */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">${bet.amount}</span>
              {bet.isWin ? (
                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-medium">+${bet.payout.toFixed(0)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-destructive">
                  <TrendingDown className="w-3 h-3" />
                  <span className="font-medium">-${bet.amount}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {recentBets.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No recent bets yet
          </div>
        )}
      </div>
    </div>
  );
}

export function OnlineCounter() {
  const { isConnected, onlineCount } = useMultiplayer();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
      <Users className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{onlineCount}</span>
    </div>
  );
}
