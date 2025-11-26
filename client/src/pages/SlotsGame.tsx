import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Cherry, Grape, Citrus, Star, Diamond, Gem, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlotsGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

const symbols = [
  { icon: Cherry, name: "cherry", color: "text-red-500", multiplier: 2 },
  { icon: Grape, name: "grape", color: "text-purple-500", multiplier: 3 },
  { icon: Citrus, name: "lemon", color: "text-yellow-500", multiplier: 4 },
  { icon: Star, name: "star", color: "text-amber-400", multiplier: 5 },
  { icon: Diamond, name: "diamond", color: "text-cyan-400", multiplier: 10 },
  { icon: Gem, name: "seven", color: "text-primary", multiplier: 25 },
];

export function SlotsGame({ balance, onBalanceChange, onBack }: SlotsGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "slots")!;
  const { hapticFeedback, user } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [reels, setReels] = useState([0, 0, 0]);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [animatingReel, setAnimatingReel] = useState(-1);

  const spinMutation = useMutation({
    mutationFn: async (betAmount: number) => {
      setIsWin(null);
      setWinAmount(0);
      
      // Animate reels while waiting for response
      const animateReels = async () => {
        for (let reel = 0; reel < 3; reel++) {
          setAnimatingReel(reel);
          const spins = 15 + reel * 5;
          for (let s = 0; s < spins; s++) {
            await new Promise((r) => setTimeout(r, 50));
            setReels((prev) => {
              const next = [...prev];
              next[reel] = (next[reel] + 1) % symbols.length;
              return next;
            });
          }
          hapticFeedback("light");
        }
        setAnimatingReel(-1);
      };
      
      const [response] = await Promise.all([
        apiRequest("POST", "/api/games/slots/spin", {
          userId: user?.id || "demo",
          amount: betAmount,
        }),
        animateReels(),
      ]);
      
      return response.json();
    },
    onSuccess: (data) => {
      setReels(data.symbols);
      setIsWin(data.isWin);
      setWinAmount(data.payout);
      
      // Use server balance
      if (data.newBalance !== undefined) {
        onBalanceChange(data.newBalance);
      }
      
      if (data.isWin) {
        hapticFeedback("heavy");
        toast({
          title: "You Won!",
          description: `+$${data.payout.toFixed(2)} (${data.multiplier}x)`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to spin. Please try again.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const spin = (betAmount: number) => {
    if (spinMutation.isPending) return;
    hapticFeedback("medium");
    spinMutation.mutate(betAmount);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-slots-game">
      <GameHeader title="Slots" balance={balance} onBack={onBack} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        {/* Slot Machine */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-4 rounded-3xl shadow-2xl">
              <div className="bg-card border-4 border-amber-900 rounded-2xl p-6 mb-4">
                <div className="flex gap-4 justify-center">
                  {reels.map((symbolIndex, reelIndex) => {
                    const Symbol = symbols[symbolIndex].icon;
                    const isAnimating = animatingReel === reelIndex;
                    return (
                      <div
                        key={reelIndex}
                        className={`
                          w-20 h-24 bg-background border-2 border-card-border rounded-xl
                          flex items-center justify-center
                          transition-transform duration-100
                          ${isAnimating ? "animate-pulse" : ""}
                        `}
                      >
                        {spinMutation.isPending && animatingReel >= reelIndex ? (
                          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        ) : (
                          <Symbol
                            className={`w-12 h-12 ${symbols[symbolIndex].color}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className={`h-0.5 ${isWin ? "bg-primary animate-pulse" : "bg-muted-foreground/20"}`} />
                </div>
              </div>

              <div className={`
                text-center py-3 px-6 rounded-xl mb-4
                ${isWin === true ? "bg-primary/20 border border-primary" :
                  isWin === false ? "bg-destructive/20 border border-destructive" :
                  "bg-muted"}
              `}>
                {spinMutation.isPending ? (
                  <p className="text-sm text-muted-foreground font-medium">Spinning...</p>
                ) : isWin === true ? (
                  <div className="space-y-1">
                    <p className="text-sm text-primary font-medium">WINNER!</p>
                    <p className="text-2xl font-bold text-primary">${winAmount.toFixed(2)}</p>
                  </div>
                ) : isWin === false ? (
                  <p className="text-sm text-destructive font-medium">Try Again!</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Spin to Win!</p>
                )}
              </div>

              <div className="flex justify-center gap-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-3 h-3 rounded-full
                      ${isWin ? "bg-primary animate-pulse" : "bg-muted"}
                    `}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-2 text-center">Paytable (3 matching)</p>
          <div className="grid grid-cols-3 gap-2">
            {symbols.slice(0, 6).map((s) => (
              <div key={s.name} className="flex items-center justify-center gap-1 text-xs">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-muted-foreground">{s.multiplier}x</span>
              </div>
            ))}
          </div>
        </div>

        <BettingPanel
          balance={balance}
          minBet={gameConfig.minBet}
          maxBet={gameConfig.maxBet}
          onBet={spin}
          isPlaying={spinMutation.isPending}
          buttonText={spinMutation.isPending ? "Spinning..." : "Spin"}
        />
      </main>
    </div>
  );
}
