import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";

interface TurtleRaceGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

type TurtleColor = "red" | "blue" | "yellow";

const turtles: { id: TurtleColor; name: string; color: string; bgColor: string }[] = [
  { id: "red", name: "Red", color: "bg-red-500", bgColor: "bg-red-500/20" },
  { id: "blue", name: "Blue", color: "bg-blue-500", bgColor: "bg-blue-500/20" },
  { id: "yellow", name: "Yellow", color: "bg-yellow-500", bgColor: "bg-yellow-500/20" },
];

export function TurtleRaceGame({ balance, onBalanceChange, onBack }: TurtleRaceGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "turtle")!;
  const { hapticFeedback, user, shareGameResult } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTurtle, setSelectedTurtle] = useState<TurtleColor | null>(null);
  const [positions, setPositions] = useState<Record<TurtleColor, number>>({
    red: 0,
    blue: 0,
    yellow: 0,
  });
  const [winner, setWinner] = useState<TurtleColor | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [history, setHistory] = useState<{ winner: TurtleColor; myBet: TurtleColor; isWin: boolean }[]>([]);
  
  const animationRef = useRef<number>();

  const raceMutation = useMutation({
    mutationFn: async ({ betAmount, turtle }: { betAmount: number; turtle: TurtleColor }) => {
      const response = await apiRequest("POST", "/api/games/turtle/race", {
        odejs: user?.id || "demo",
        amount: betAmount,
        selectedTurtle: turtle,
      });
      return response.json();
    },
    onMutate: () => {
      setWinner(null);
      setPositions({ red: 0, blue: 0, yellow: 0 });
      setIsRacing(true);
    },
    onSuccess: async (data) => {
      const targetPositions = data.raceProgress;
      const finishLine = 100;
      
      const animate = () => {
        setPositions((prev) => {
          const newPos = { ...prev };
          let allFinished = true;
          
          for (const turtle of turtles) {
            const target = targetPositions[turtle.id];
            if (prev[turtle.id] < target) {
              const speed = Math.random() * 3 + 1;
              newPos[turtle.id] = Math.min(prev[turtle.id] + speed, target);
              if (newPos[turtle.id] < target) allFinished = false;
            }
          }
          
          if (allFinished) {
            setIsRacing(false);
            setWinner(data.winner);
            
            if (data.newBalance !== undefined) {
              onBalanceChange(data.newBalance);
            }
            
            setHistory((h) => [
              { winner: data.winner, myBet: data.selectedTurtle, isWin: data.isWin },
              ...h.slice(0, 9),
            ]);
            
            if (data.isWin) {
              hapticFeedback("heavy");
              toast({
                title: "Your Turtle Won!",
                description: `+$${data.payout.toFixed(2)} (3x)`,
              });
            } else {
              hapticFeedback("rigid");
            }
            
            queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
            return newPos;
          }
          
          hapticFeedback("light");
          animationRef.current = requestAnimationFrame(animate);
          return newPos;
        });
      };
      
      animate();
    },
    onError: () => {
      setIsRacing(false);
      toast({
        title: "Error",
        description: "Failed to start race. Please try again.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleRace = (betAmount: number) => {
    if (!selectedTurtle || isRacing) return;
    hapticFeedback("medium");
    raceMutation.mutate({ betAmount, turtle: selectedTurtle });
  };

  const resetGame = () => {
    setSelectedTurtle(null);
    setWinner(null);
    setPositions({ red: 0, blue: 0, yellow: 0 });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-turtle-game">
      <GameHeader title="Turtle Race" balance={balance} onBack={onBack} gameType="turtle" />

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
              {h.winner.charAt(0).toUpperCase() + h.winner.slice(1)} Won
            </span>
          ))}
          {history.length === 0 && (
            <span className="text-sm text-muted-foreground">No races yet</span>
          )}
        </div>

        {/* Race Track */}
        <div className="flex-1 bg-card border border-card-border rounded-2xl p-4 overflow-hidden">
          <div className="h-full flex flex-col justify-center gap-4">
            {turtles.map((turtle) => (
              <div key={turtle.id} className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${turtle.color}`} />
                  <span className="text-xs text-muted-foreground">{turtle.name}</span>
                  {winner === turtle.id && (
                    <span className="text-xs text-primary font-bold animate-pulse">WINNER!</span>
                  )}
                </div>
                
                {/* Track */}
                <div className="relative h-12 bg-muted/30 rounded-lg overflow-hidden">
                  {/* Lane lines */}
                  <div className="absolute inset-0 flex">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-dashed border-muted-foreground/20"
                      />
                    ))}
                  </div>
                  
                  {/* Finish line */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-r from-transparent via-primary to-primary" />
                  
                  {/* Turtle */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full ${turtle.color} flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-75`}
                    style={{ left: `${Math.min(positions[turtle.id], 85)}%` }}
                  >
                    {turtle.name[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Turtle Selection */}
        {!winner && !isRacing && (
          <div className="bg-card border border-card-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Choose your turtle (3x payout)
            </p>
            <div className="flex justify-center gap-3">
              {turtles.map((turtle) => (
                <Button
                  key={turtle.id}
                  variant={selectedTurtle === turtle.id ? "default" : "secondary"}
                  className={`flex-1 h-14 ${
                    selectedTurtle === turtle.id ? turtle.color : ""
                  }`}
                  onClick={() => {
                    hapticFeedback("light");
                    setSelectedTurtle(turtle.id);
                  }}
                  data-testid={`button-turtle-${turtle.id}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full ${turtle.color}`} />
                    <span className="text-xs">{turtle.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Result / Actions */}
        {winner ? (
          <div className="space-y-3">
            <div
              className={`text-center p-4 rounded-xl ${
                winner === selectedTurtle ? "bg-primary/20" : "bg-destructive/20"
              }`}
            >
              <p
                className={`text-lg font-bold ${
                  winner === selectedTurtle ? "text-primary" : "text-destructive"
                }`}
              >
                {winner === selectedTurtle
                  ? "Your turtle won!"
                  : `${winner.charAt(0).toUpperCase() + winner.slice(1)} turtle won!`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 h-12" onClick={resetGame} data-testid="button-play-again">
                Race Again
              </Button>
              {winner === selectedTurtle && (
                <Button
                  variant="secondary"
                  className="h-12 px-4"
                  onClick={() => {
                    hapticFeedback("light");
                    shareGameResult("I won at Turtle Race! My turtle came first. Play with me in Telegram Casino");
                  }}
                  data-testid="button-share"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <BettingPanel
            balance={balance}
            minBet={gameConfig.minBet}
            maxBet={gameConfig.maxBet}
            onBet={handleRace}
            isPlaying={isRacing}
            buttonText={isRacing ? "Racing..." : "Start Race"}
            disabled={!selectedTurtle}
          />
        )}
      </main>
    </div>
  );
}
