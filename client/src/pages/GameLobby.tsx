import { gamesConfig, type GameType } from "@shared/schema";
import { GameCard } from "@/components/GameCard";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { useTelegram } from "@/components/TelegramProvider";
import { Trophy, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameLobbyProps {
  balance: number;
  onSelectGame: (gameId: GameType) => void;
}

export function GameLobby({ balance, onSelectGame }: GameLobbyProps) {
  const { user } = useTelegram();

  return (
    <div className="min-h-screen bg-background" data-testid="page-game-lobby">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
              {user?.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt={user.first_name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground leading-tight">
                {user?.first_name || "Player"}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                @{user?.username || "guest"}
              </span>
            </div>
          </div>

          {/* Balance */}
          <BalanceDisplay balance={balance} />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Welcome Bonus</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Start with $1,000
            </h2>
            <p className="text-sm text-muted-foreground">
              Play your favorite casino games and win big!
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-card-border rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-foreground">7</span>
            <p className="text-xs text-muted-foreground mt-1">Games</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-primary">98%</span>
            <p className="text-xs text-muted-foreground mt-1">RTP</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-foreground">24/7</span>
            <p className="text-xs text-muted-foreground mt-1">Live</p>
          </div>
        </div>

        {/* Games Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Games</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
              <History className="w-4 h-4" />
              History
            </Button>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 gap-4">
            {gamesConfig.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => onSelectGame(game.id)}
              />
            ))}
          </div>
        </section>

        {/* Bottom Spacing for safe area */}
        <div className="h-8" />
      </main>
    </div>
  );
}
