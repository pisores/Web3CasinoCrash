import { gamesConfig, type GameType } from "@shared/schema";
import { GameCard } from "@/components/GameCard";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { LiveFeed, OnlineCounter } from "@/components/LiveFeed";
import { AudioControls } from "@/components/AudioControls";
import { useTelegram } from "@/components/TelegramProvider";
import { Trophy, User, Gift, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameLobbyProps {
  balance: number;
  onSelectGame: (gameId: GameType) => void;
  onOpenProfile: () => void;
  onOpenWallet: () => void;
  onOpenAdmin: () => void;
}

export function GameLobby({ balance, onSelectGame, onOpenProfile, onOpenWallet, onOpenAdmin }: GameLobbyProps) {
  const { user, hapticFeedback } = useTelegram();
  const isAdmin = user?.username === "nahalist" || user?.isAdmin;

  return (
    <div className="min-h-screen bg-background" data-testid="page-game-lobby">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* User Info - clickable for profile */}
          <Button 
            variant="ghost" 
            className="flex items-center gap-3 p-0 h-auto hover:bg-transparent"
            onClick={() => {
              hapticFeedback("light");
              onOpenProfile();
            }}
            data-testid="button-profile"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
              {user?.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt={user.firstName || "User"} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-foreground leading-tight">
                {user?.firstName || "Player"}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                @{user?.username || "guest"}
              </span>
            </div>
          </Button>

          {/* Online Counter & Balance */}
          <div className="flex items-center gap-2">
            <OnlineCounter />
            <AudioControls gameType="lobby" />
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  hapticFeedback("light");
                  onOpenAdmin();
                }}
                className="w-9 h-9"
                data-testid="button-admin"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            <BalanceDisplay 
              balance={balance} 
              onClick={() => {
                hapticFeedback("light");
                onOpenWallet();
              }}
              currency="USDT"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Referral Banner */}
        <div 
          className="relative bg-gradient-to-br from-primary/30 via-primary/15 to-transparent border border-primary/30 rounded-2xl p-5 overflow-hidden cursor-pointer hover-elevate"
          onClick={() => {
            hapticFeedback("light");
            onOpenProfile();
          }}
          data-testid="banner-referral"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Referral Bonus</span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Invite Friends & Earn
            </h2>
            <p className="text-sm text-muted-foreground">
              Get $50 for each friend you invite!
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
            <span className="text-2xl font-bold text-primary">97%</span>
            <p className="text-xs text-muted-foreground mt-1">RTP</p>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-foreground">24/7</span>
            <p className="text-xs text-muted-foreground mt-1">Live</p>
          </div>
        </div>

        {/* Live Feed */}
        <section className="bg-card border border-card-border rounded-2xl p-4">
          <LiveFeed />
        </section>

        {/* Games Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Games</h2>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Play to Win</span>
            </div>
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
