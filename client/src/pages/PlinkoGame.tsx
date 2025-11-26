import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PlinkoGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

export function PlinkoGame({ balance, onBalanceChange, onBack }: PlinkoGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "plinko")!;
  const { hapticFeedback, user } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rows, setRows] = useState(8);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);
  const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [history, setHistory] = useState<{ multiplier: number; isWin: boolean }[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getMultipliers = useCallback((numRows: number) => {
    const mults: number[] = [];
    const slots = numRows + 1;
    const center = Math.floor(slots / 2);
    
    for (let i = 0; i < slots; i++) {
      const distance = Math.abs(i - center);
      if (distance === 0) mults.push(0.5);
      else if (distance === 1) mults.push(1);
      else if (distance === 2) mults.push(1.5);
      else if (distance === 3) mults.push(3);
      else mults.push(5 + (distance - 3) * 3);
    }
    return mults;
  }, []);

  const multipliers = getMultipliers(rows);

  const drawBoard = useCallback(() => {
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
    const pegRadius = 4;
    const pegSpacing = width / (rows + 2);
    const rowHeight = height / (rows + 2);

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 1;
      const rowWidth = pegsInRow * pegSpacing;
      const startX = (width - rowWidth) / 2 + pegSpacing / 2;
      
      for (let peg = 0; peg <= row; peg++) {
        const x = startX + peg * pegSpacing;
        const y = (row + 1) * rowHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (ballPosition) {
      ctx.fillStyle = "#10b981";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ballPosition.x * width, ballPosition.y * height, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [rows, ballPosition]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  const dropMutation = useMutation({
    mutationFn: async (betAmount: number) => {
      setLastMultiplier(null);
      setIsWin(null);
      setBallPosition({ x: 0.5, y: 0.05 });
      
      const response = await apiRequest("POST", "/api/games/plinko/drop", {
        odejs: user?.id || "demo",
        amount: betAmount,
        rows,
      });
      return response.json();
    },
    onSuccess: async (data) => {
      // Animate ball along path
      let position = 0.5;
      
      for (let i = 0; i < data.path.length; i++) {
        await new Promise((r) => setTimeout(r, 100));
        
        const direction = data.path[i];
        const offset = direction * (0.5 / (rows + 1));
        position = Math.max(0.1, Math.min(0.9, position + offset));
        
        setBallPosition({
          x: position,
          y: (i + 2) / (rows + 2),
        });
        
        hapticFeedback("light");
      }
      
      await new Promise((r) => setTimeout(r, 200));
      
      setLastMultiplier(data.multiplier);
      setIsWin(data.isWin);
      setHistory((prev) => [{ multiplier: data.multiplier, isWin: data.isWin }, ...prev.slice(0, 9)]);
      
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
      
      setTimeout(() => {
        setBallPosition(null);
      }, 1000);
      
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to drop ball. Please try again.",
        variant: "destructive",
      });
      setBallPosition(null);
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const drop = (betAmount: number) => {
    if (dropMutation.isPending) return;
    hapticFeedback("medium");
    dropMutation.mutate(betAmount);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-plinko-game">
      <GameHeader title="Plinko" balance={balance} onBack={onBack} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {history.map((h, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                h.isWin ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
              }`}
            >
              {h.multiplier.toFixed(1)}x
            </span>
          ))}
          {history.length === 0 && (
            <span className="text-sm text-muted-foreground">No history yet</span>
          )}
        </div>

        <div className="flex-1 relative bg-card border border-card-border rounded-2xl overflow-hidden min-h-[300px]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          
          <div className="absolute bottom-0 left-0 right-0 flex">
            {multipliers.map((mult, i) => (
              <div
                key={i}
                className={`
                  flex-1 py-2 text-center text-xs font-bold
                  ${mult >= 3 ? "bg-primary/30 text-primary" :
                    mult >= 1 ? "bg-blue-500/30 text-blue-400" :
                    "bg-destructive/30 text-destructive"}
                  ${i === 0 ? "rounded-bl-xl" : ""}
                  ${i === multipliers.length - 1 ? "rounded-br-xl" : ""}
                `}
              >
                {mult}x
              </div>
            ))}
          </div>

          {lastMultiplier !== null && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`
                px-6 py-3 rounded-2xl text-3xl font-bold
                ${isWin ? "bg-primary/90 text-primary-foreground" : "bg-destructive/90 text-destructive-foreground"}
              `}>
                {lastMultiplier.toFixed(1)}x
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between bg-card border border-card-border rounded-xl p-3">
          <span className="text-sm text-muted-foreground">Number of Rows</span>
          <Select
            value={rows.toString()}
            onValueChange={(v) => setRows(parseInt(v))}
            disabled={dropMutation.isPending}
          >
            <SelectTrigger className="w-24" data-testid="select-rows">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[8, 10, 12, 14, 16].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <BettingPanel
          balance={balance}
          minBet={gameConfig.minBet}
          maxBet={gameConfig.maxBet}
          onBet={drop}
          isPlaying={dropMutation.isPending}
          buttonText={dropMutation.isPending ? "Dropping..." : "Drop Ball"}
        />
      </main>
    </div>
  );
}
