import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Gem, Bomb, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MinesGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

type CellState = "hidden" | "gem" | "mine";

export function MinesGame({ balance, onBalanceChange, onBack }: MinesGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "mines")!;
  const { hapticFeedback, user } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const GRID_SIZE = 25;
  const [minesCount, setMinesCount] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [cells, setCells] = useState<CellState[]>(Array(GRID_SIZE).fill("hidden"));
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [gameId, setGameId] = useState("");

  const calculateMultiplier = useCallback((revealed: number, mines: number) => {
    if (revealed === 0) return 1.0;
    const safeSpots = GRID_SIZE - mines;
    let multiplier = 1;
    for (let i = 0; i < revealed; i++) {
      multiplier *= safeSpots / (safeSpots - i);
    }
    return Math.floor(multiplier * 0.97 * 100) / 100;
  }, []);

  const startMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/games/mines/start", {
        odejs: user?.id || "demo",
        amount,
        minesCount,
      });
      return response.json();
    },
    onSuccess: (data, amount) => {
      setGameId(data.gameId);
      setMinePositions(data.minePositions);
      setCells(Array(GRID_SIZE).fill("hidden"));
      setRevealedCount(0);
      setCurrentMultiplier(1.0);
      setBetAmount(amount);
      setIsPlaying(true);
      setIsGameOver(false);
      setIsWin(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const startGame = (amount: number) => {
    hapticFeedback("medium");
    onBalanceChange(balance - amount);
    startMutation.mutate(amount);
  };

  const revealMutation = useMutation({
    mutationFn: async (cellIndex: number) => {
      const response = await apiRequest("POST", "/api/games/mines/reveal", {
        gameId,
        cellIndex,
        minePositions,
        revealedCount,
      });
      return response.json();
    },
    onSuccess: (data, cellIndex) => {
      if (data.isMine) {
        hapticFeedback("heavy");
        const newCells = [...cells];
        minePositions.forEach((pos) => {
          newCells[pos] = "mine";
        });
        newCells[cellIndex] = "mine";
        setCells(newCells);
        setIsGameOver(true);
        setIsWin(false);
        setIsPlaying(false);
        queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
      } else {
        hapticFeedback("light");
        const newCells = [...cells];
        newCells[cellIndex] = "gem";
        setCells(newCells);
        
        const newRevealed = revealedCount + 1;
        setRevealedCount(newRevealed);
        setCurrentMultiplier(data.multiplier);
        
        if (newRevealed === GRID_SIZE - minesCount) {
          const winnings = betAmount * data.multiplier;
          onBalanceChange(balance + winnings);
          setIsGameOver(true);
          setIsWin(true);
          setIsPlaying(false);
          hapticFeedback("heavy");
          toast({
            title: "You Won!",
            description: `+$${winnings.toFixed(2)}`,
          });
          queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
        }
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reveal cell. Please try again.",
        variant: "destructive",
      });
    },
  });

  const revealCell = (index: number) => {
    if (!isPlaying || cells[index] !== "hidden" || isGameOver || revealMutation.isPending) return;
    revealMutation.mutate(index);
  };

  const cashOut = () => {
    if (!isPlaying || revealedCount === 0) return;
    
    hapticFeedback("heavy");
    const winnings = betAmount * currentMultiplier;
    onBalanceChange(balance + winnings);
    
    const newCells = [...cells];
    minePositions.forEach((pos) => {
      if (newCells[pos] === "hidden") {
        newCells[pos] = "mine";
      }
    });
    setCells(newCells);
    
    setIsGameOver(true);
    setIsWin(true);
    setIsPlaying(false);
    
    toast({
      title: "Cashed Out!",
      description: `+$${winnings.toFixed(2)} at ${currentMultiplier.toFixed(2)}x`,
    });
    
    queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
  };

  const resetGame = () => {
    setCells(Array(GRID_SIZE).fill("hidden"));
    setMinePositions([]);
    setRevealedCount(0);
    setCurrentMultiplier(1.0);
    setBetAmount(0);
    setIsPlaying(false);
    setIsGameOver(false);
    setIsWin(false);
    setGameId("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-mines-game">
      <GameHeader title="Mines" balance={balance} onBack={onBack} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between bg-card border border-card-border rounded-xl p-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Gems Found</p>
            <p className="text-lg font-bold text-primary">{revealedCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Multiplier</p>
            <p className="text-lg font-bold text-foreground">{currentMultiplier.toFixed(2)}x</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Potential</p>
            <p className="text-lg font-bold text-primary">
              ${(betAmount * currentMultiplier).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-5 gap-2 w-full max-w-[320px] aspect-square">
            {cells.map((cell, index) => (
              <button
                key={index}
                onClick={() => revealCell(index)}
                disabled={!isPlaying || cell !== "hidden" || isGameOver || revealMutation.isPending}
                className={`
                  aspect-square rounded-lg border-2 flex items-center justify-center
                  transition-all duration-200 active:scale-95
                  ${cell === "hidden" 
                    ? "bg-card border-card-border hover:bg-accent hover:border-primary/50" 
                    : cell === "gem"
                    ? "bg-primary/20 border-primary game-glow-win animate-mine-reveal"
                    : "bg-destructive/20 border-destructive game-glow-loss animate-mine-reveal"
                  }
                  ${!isPlaying && cell === "hidden" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                data-testid={`cell-${index}`}
              >
                {cell === "gem" && <Gem className="w-6 h-6 text-primary" />}
                {cell === "mine" && <Bomb className="w-6 h-6 text-destructive" />}
                {cell === "hidden" && isPlaying && (
                  <Sparkles className="w-4 h-4 text-muted-foreground opacity-30" />
                )}
              </button>
            ))}
          </div>
        </div>

        {isGameOver && (
          <div className={`text-center p-4 rounded-xl ${isWin ? "bg-primary/20" : "bg-destructive/20"}`}>
            <p className={`text-lg font-bold ${isWin ? "text-primary" : "text-destructive"}`}>
              {isWin ? `You won $${(betAmount * currentMultiplier).toFixed(2)}!` : "Boom! You hit a mine!"}
            </p>
          </div>
        )}

        {isGameOver ? (
          <Button
            className="w-full h-12"
            onClick={resetGame}
            data-testid="button-play-again"
          >
            Play Again
          </Button>
        ) : isPlaying ? (
          <Button
            className="w-full h-12 text-lg font-bold"
            onClick={cashOut}
            disabled={revealedCount === 0}
            data-testid="button-cash-out"
          >
            Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-card border border-card-border rounded-xl p-3">
              <span className="text-sm text-muted-foreground">Number of Mines</span>
              <Select
                value={minesCount.toString()}
                onValueChange={(v) => setMinesCount(parseInt(v))}
              >
                <SelectTrigger className="w-24" data-testid="select-mines">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 5, 10, 15, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} mines
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <BettingPanel
              balance={balance}
              minBet={gameConfig.minBet}
              maxBet={gameConfig.maxBet}
              onBet={startGame}
              isPlaying={startMutation.isPending}
            />
          </div>
        )}
      </main>
    </div>
  );
}
