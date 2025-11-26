import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Rocket, TrendingUp, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CrashGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

type GameStatus = "waiting" | "betting" | "running" | "crashed";

export function CrashGame({ balance, onBalanceChange, onBack }: CrashGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "crash")!;
  const { hapticFeedback, user, shareGameResult } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(0);
  const [history, setHistory] = useState<number[]>([2.34, 1.12, 5.67, 1.45, 3.21, 1.89, 4.56, 2.10]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Define mutations first (before they're used in callbacks)
  const startMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/games/crash/start", {
        odejs: user?.id || "demo",
        amount,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCrashPoint(data.crashPoint);
      if (data.newBalance !== undefined) {
        onBalanceChange(data.newBalance);
      }
      startTimeRef.current = Date.now();
      setGameStatus("running");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive",
      });
      setGameStatus("waiting");
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const cashoutMutation = useMutation({
    mutationFn: async ({ betAmt, mult }: { betAmt: number; mult: number }) => {
      const response = await apiRequest("POST", "/api/games/crash/cashout", {
        odejs: user?.id || "demo",
        betAmount: betAmt,
        multiplier: mult,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.newBalance !== undefined) {
        onBalanceChange(data.newBalance);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const crashedMutation = useMutation({
    mutationFn: async ({ betAmt, crash }: { betAmt: number; crash: number }) => {
      const response = await apiRequest("POST", "/api/games/crash/crashed", {
        odejs: user?.id || "demo",
        betAmount: betAmt,
        crashPoint: crash,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (gameStatus === "running" || gameStatus === "crashed") {
      const points: [number, number][] = [];
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const maxTime = Math.min(elapsed, 10);
      
      for (let t = 0; t <= maxTime; t += 0.05) {
        const m = Math.pow(Math.E, t * 0.1);
        const x = (t / 10) * width;
        const y = height - ((m - 1) / 5) * height;
        points.push([x, Math.max(10, y)]);
      }

      if (points.length > 1) {
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "rgba(16, 185, 129, 0)");
        gradient.addColorStop(1, gameStatus === "crashed" ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, height);
        points.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(points[points.length - 1][0], height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = gameStatus === "crashed" ? "#ef4444" : "#10b981";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        points.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const lastPoint = points[points.length - 1];
        ctx.fillStyle = gameStatus === "crashed" ? "#ef4444" : "#10b981";
        ctx.beginPath();
        ctx.arc(lastPoint[0], lastPoint[1], 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [gameStatus]);

  const runGame = useCallback(() => {
    if (gameStatus !== "running") return;
    
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const currentMultiplier = Math.pow(Math.E, elapsed * 0.1);
    
    setMultiplier(parseFloat(currentMultiplier.toFixed(2)));
    drawGraph();

    if (currentMultiplier >= crashPoint) {
      setGameStatus("crashed");
      hapticFeedback("heavy");
      
      if (!hasCashedOut && betAmount > 0) {
        setHistory(prev => [crashPoint, ...prev.slice(0, 7)]);
        // Record lost bet on backend
        crashedMutation.mutate({ betAmt: betAmount, crash: crashPoint });
      }
      
      setTimeout(() => {
        setGameStatus("waiting");
        setMultiplier(1.0);
        setBetAmount(0);
        setHasCashedOut(false);
        setCashOutMultiplier(0);
        queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
      }, 2000);
      return;
    }

    animationRef.current = requestAnimationFrame(runGame);
  }, [gameStatus, crashPoint, hasCashedOut, betAmount, hapticFeedback, drawGraph, queryClient, crashedMutation]);

  useEffect(() => {
    if (gameStatus === "running") {
      animationRef.current = requestAnimationFrame(runGame);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStatus, runGame]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const placeBet = (amount: number) => {
    if (gameStatus !== "waiting") return;
    
    setBetAmount(amount);
    setGameStatus("betting");
    hapticFeedback("medium");

    setTimeout(() => {
      startMutation.mutate(amount);
    }, 1000);
  };

  const cashOut = () => {
    if (gameStatus !== "running" || hasCashedOut || betAmount === 0) return;
    
    setHasCashedOut(true);
    setCashOutMultiplier(multiplier);
    hapticFeedback("heavy");
    setHistory(prev => [multiplier, ...prev.slice(0, 7)]);
    
    // Save cashout to backend
    cashoutMutation.mutate({ betAmt: betAmount, mult: multiplier });
    
    toast({
      title: "Cashed Out!",
      description: `+$${(betAmount * multiplier).toFixed(2)} at ${multiplier.toFixed(2)}x`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-crash-game">
      <GameHeader title="Crash" balance={balance} onBack={onBack} gameType="crash" />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {history.map((h, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                h >= 2 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
              }`}
            >
              {h.toFixed(2)}x
            </span>
          ))}
        </div>

        <div className="flex-1 relative bg-card border border-card-border rounded-2xl overflow-hidden min-h-[280px]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {gameStatus === "waiting" && (
              <div className="text-center">
                <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Place your bet to start</p>
              </div>
            )}
            
            {gameStatus === "betting" && (
              <div className="text-center animate-pulse">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-primary font-medium">Starting...</p>
              </div>
            )}
            
            {(gameStatus === "running" || gameStatus === "crashed") && (
              <div className="text-center">
                <span
                  className={`text-5xl font-bold ${
                    gameStatus === "crashed" ? "text-destructive" : "text-primary"
                  }`}
                >
                  {multiplier.toFixed(2)}x
                </span>
                {gameStatus === "crashed" && (
                  <p className="text-destructive font-medium mt-2">CRASHED!</p>
                )}
                {hasCashedOut && (
                  <p className="text-primary font-medium mt-2">
                    Cashed out at {cashOutMultiplier.toFixed(2)}x
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {gameStatus === "running" && betAmount > 0 && !hasCashedOut ? (
          <Button
            className="w-full h-14 text-lg font-bold game-glow-win"
            onClick={cashOut}
            data-testid="button-cash-out"
          >
            Cash Out ${(betAmount * multiplier).toFixed(2)}
          </Button>
        ) : (
          <BettingPanel
            balance={balance}
            minBet={gameConfig.minBet}
            maxBet={gameConfig.maxBet}
            onBet={placeBet}
            isPlaying={gameStatus !== "waiting"}
            buttonText={gameStatus === "crashed" ? "Crashed!" : "Place Bet"}
            disabled={gameStatus !== "waiting"}
          />
        )}
      </main>
    </div>
  );
}
