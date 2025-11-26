import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiceGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function DiceGame({ balance, onBalanceChange, onBack }: DiceGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "dice")!;
  const { hapticFeedback, user, telegramUser } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<boolean | null>(null);
  const [displayRoll, setDisplayRoll] = useState<number | null>(null);
  const [history, setHistory] = useState<{ roll: number; isWin: boolean }[]>([]);

  const calculateMultiplier = useCallback((t: number, over: boolean) => {
    const winChance = over ? (100 - t) / 100 : t / 100;
    if (winChance <= 0) return 0;
    return Math.floor((0.97 / winChance) * 100) / 100;
  }, []);

  const winChance = isOver ? 100 - target : target;
  const multiplier = calculateMultiplier(target, isOver);

  const rollMutation = useMutation({
    mutationFn: async (betAmount: number) => {
      // Animate roll while waiting for response
      const animateRoll = async () => {
        const rollDuration = 1500;
        const rollInterval = 50;
        const rolls = rollDuration / rollInterval;
        
        for (let i = 0; i < rolls; i++) {
          await new Promise((r) => setTimeout(r, rollInterval - i));
          setDisplayRoll(Math.floor(Math.random() * 100) + 1);
        }
      };
      
      const [response] = await Promise.all([
        apiRequest("POST", "/api/games/dice/roll", {
          odejs: user?.id || "demo",
          amount: betAmount,
          target,
          isOver,
        }),
        animateRoll(),
      ]);
      
      return response.json();
    },
    onSuccess: (data) => {
      setLastRoll(data.roll);
      setDisplayRoll(data.roll);
      setLastWin(data.isWin);
      setHistory((prev) => [{ roll: data.roll, isWin: data.isWin }, ...prev.slice(0, 9)]);
      
      // Use server balance
      if (data.newBalance !== undefined) {
        onBalanceChange(data.newBalance);
      }
      
      if (data.isWin) {
        hapticFeedback("heavy");
        toast({
          title: "You Won!",
          description: `+$${data.payout.toFixed(2)}`,
        });
      } else {
        hapticFeedback("rigid");
      }
      
      // Invalidate user query to sync balance
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to roll dice. Please try again.",
        variant: "destructive",
      });
      // Revert balance on error
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const roll = (betAmount: number) => {
    if (rollMutation.isPending) return;
    hapticFeedback("medium");
    rollMutation.mutate(betAmount);
  };

  const currentDisplayRoll = displayRoll ?? lastRoll;
  const DiceIcon = currentDisplayRoll ? diceIcons[Math.min(5, Math.floor((currentDisplayRoll - 1) / 16.67))] : Dice1;

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-dice-game">
      <GameHeader title="Dice" balance={balance} onBack={onBack} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        {/* History */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {history.map((h, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                h.isWin ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
              }`}
            >
              {h.roll}
            </span>
          ))}
          {history.length === 0 && (
            <span className="text-sm text-muted-foreground">No history yet</span>
          )}
        </div>

        {/* Dice Display */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div
              className={`
                w-40 h-40 rounded-3xl flex items-center justify-center
                transition-all duration-300
                ${rollMutation.isPending ? "animate-bounce" : ""}
                ${lastWin === true ? "bg-primary/20 border-2 border-primary game-glow-win" : 
                  lastWin === false ? "bg-destructive/20 border-2 border-destructive game-glow-loss" :
                  "bg-card border-2 border-card-border"}
              `}
            >
              {rollMutation.isPending ? (
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              ) : (
                <div className="text-center">
                  <DiceIcon className={`w-16 h-16 mx-auto mb-2 ${
                    lastWin === true ? "text-primary" : 
                    lastWin === false ? "text-destructive" : 
                    "text-foreground"
                  }`} />
                  <span className={`text-4xl font-bold ${
                    lastWin === true ? "text-primary" : 
                    lastWin === false ? "text-destructive" : 
                    "text-foreground"
                  }`}>
                    {currentDisplayRoll ?? "?"}
                  </span>
                </div>
              )}
            </div>

            {lastWin !== null && !rollMutation.isPending && (
              <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold ${
                lastWin ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
              }`}>
                {lastWin ? "WIN!" : "LOSE"}
              </div>
            )}
          </div>
        </div>

        {/* Target Selector */}
        <div className="bg-card border border-card-border rounded-xl p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              variant={isOver ? "default" : "secondary"}
              className="flex-1 gap-2"
              onClick={() => {
                hapticFeedback("light");
                setIsOver(true);
              }}
              disabled={rollMutation.isPending}
              data-testid="button-over"
            >
              <ArrowUp className="w-4 h-4" />
              Roll Over
            </Button>
            <Button
              variant={!isOver ? "default" : "secondary"}
              className="flex-1 gap-2"
              onClick={() => {
                hapticFeedback("light");
                setIsOver(false);
              }}
              disabled={rollMutation.isPending}
              data-testid="button-under"
            >
              <ArrowDown className="w-4 h-4" />
              Roll Under
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target</span>
              <span className="font-medium text-foreground">{target}</span>
            </div>
            <Slider
              value={[target]}
              onValueChange={([v]) => setTarget(v)}
              min={2}
              max={98}
              step={1}
              disabled={rollMutation.isPending}
              data-testid="slider-target"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Win Chance</p>
              <p className="text-lg font-bold text-foreground">{winChance}%</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Multiplier</p>
              <p className="text-lg font-bold text-primary">{multiplier.toFixed(2)}x</p>
            </div>
          </div>
        </div>

        <BettingPanel
          balance={balance}
          minBet={gameConfig.minBet}
          maxBet={gameConfig.maxBet}
          onBet={roll}
          isPlaying={rollMutation.isPending}
          buttonText={rollMutation.isPending ? "Rolling..." : "Roll Dice"}
        />
      </main>
    </div>
  );
}
