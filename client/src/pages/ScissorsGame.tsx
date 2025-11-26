import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GameHeader } from "@/components/GameHeader";
import { BettingPanel } from "@/components/BettingPanel";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/components/TelegramProvider";
import { gamesConfig } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Hand, Scissors, FileText } from "lucide-react";

interface ScissorsGameProps {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBack: () => void;
}

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw" | null;

const choices: { id: Choice; name: string; icon: typeof Hand; beats: Choice }[] = [
  { id: "rock", name: "Rock", icon: Hand, beats: "scissors" },
  { id: "paper", name: "Paper", icon: FileText, beats: "rock" },
  { id: "scissors", name: "Scissors", icon: Scissors, beats: "paper" },
];

export function ScissorsGame({ balance, onBalanceChange, onBack }: ScissorsGameProps) {
  const gameConfig = gamesConfig.find((g) => g.id === "scissors")!;
  const { hapticFeedback, user } = useTelegram();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [history, setHistory] = useState<{ result: Result; playerChoice: Choice }[]>([]);

  const playMutation = useMutation({
    mutationFn: async ({ betAmount, choice }: { betAmount: number; choice: Choice }) => {
      const response = await apiRequest("POST", "/api/games/scissors/play", {
        userId: user?.id || "demo",
        amount: betAmount,
        choice,
      });
      return response.json();
    },
    onMutate: async ({ choice }) => {
      setPlayerChoice(choice);
      setComputerChoice(null);
      setResult(null);
      
      await new Promise((r) => setTimeout(r, 500));
      
      const randomChoices: Choice[] = ["rock", "paper", "scissors"];
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 100));
        setComputerChoice(randomChoices[Math.floor(Math.random() * 3)]);
      }
    },
    onSuccess: (data) => {
      setComputerChoice(data.computerChoice);
      setResult(data.result);
      
      if (data.newBalance !== undefined) {
        onBalanceChange(data.newBalance);
      }
      
      setHistory((prev) => [
        { result: data.result, playerChoice: data.playerChoice },
        ...prev.slice(0, 9),
      ]);
      
      if (data.result === "win") {
        hapticFeedback("heavy");
        toast({
          title: "You Won!",
          description: `+$${data.payout.toFixed(2)} (2x)`,
        });
      } else if (data.result === "draw") {
        hapticFeedback("medium");
        toast({
          title: "Draw!",
          description: "Your bet was returned",
        });
      } else {
        hapticFeedback("rigid");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to play. Please try again.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
    },
  });

  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const handlePlay = (betAmount: number) => {
    if (!selectedChoice || playMutation.isPending) return;
    hapticFeedback("medium");
    playMutation.mutate({ betAmount, choice: selectedChoice });
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setSelectedChoice(null);
  };

  const getResultColor = (r: Result) => {
    if (r === "win") return "text-primary";
    if (r === "lose") return "text-destructive";
    return "text-yellow-500";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-scissors-game">
      <GameHeader title="Rock Paper Scissors" balance={balance} onBack={onBack} />

      <main className="flex-1 flex flex-col p-4 gap-4">
        {/* History */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {history.map((h, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                h.result === "win"
                  ? "bg-primary/20 text-primary"
                  : h.result === "lose"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-yellow-500/20 text-yellow-500"
              }`}
            >
              {h.result?.toUpperCase()}
            </span>
          ))}
          {history.length === 0 && (
            <span className="text-sm text-muted-foreground">No history yet</span>
          )}
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* Choices Display */}
          <div className="flex items-center gap-8">
            {/* Player Choice */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">You</p>
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center border-2 ${
                  result === "win"
                    ? "border-primary bg-primary/20"
                    : result === "lose"
                    ? "border-destructive bg-destructive/20"
                    : playerChoice
                    ? "border-card-border bg-card"
                    : "border-dashed border-muted-foreground/30 bg-muted/20"
                }`}
              >
                {playerChoice ? (
                  (() => {
                    const choice = choices.find((c) => c.id === playerChoice);
                    const Icon = choice?.icon || Hand;
                    return <Icon className="w-10 h-10 text-foreground" />;
                  })()
                ) : (
                  <span className="text-2xl text-muted-foreground">?</span>
                )}
              </div>
            </div>

            {/* VS */}
            <div className="text-2xl font-bold text-muted-foreground">VS</div>

            {/* Computer Choice */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Computer</p>
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center border-2 ${
                  result === "lose"
                    ? "border-primary bg-primary/20"
                    : result === "win"
                    ? "border-destructive bg-destructive/20"
                    : computerChoice
                    ? "border-card-border bg-card"
                    : "border-dashed border-muted-foreground/30 bg-muted/20"
                } ${playMutation.isPending && !result ? "animate-pulse" : ""}`}
              >
                {computerChoice ? (
                  (() => {
                    const choice = choices.find((c) => c.id === computerChoice);
                    const Icon = choice?.icon || Hand;
                    return <Icon className="w-10 h-10 text-foreground" />;
                  })()
                ) : (
                  <span className="text-2xl text-muted-foreground">?</span>
                )}
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`text-3xl font-bold ${getResultColor(result)} animate-in zoom-in duration-300`}
            >
              {result === "win" ? "YOU WIN!" : result === "lose" ? "YOU LOSE!" : "DRAW!"}
            </div>
          )}
        </div>

        {/* Choice Selection */}
        {!result && (
          <div className="bg-card border border-card-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">Choose your move</p>
            <div className="flex justify-center gap-4">
              {choices.map((choice) => {
                const Icon = choice.icon;
                return (
                  <Button
                    key={choice.id}
                    variant={selectedChoice === choice.id ? "default" : "secondary"}
                    className="w-20 h-20 flex flex-col gap-1"
                    onClick={() => {
                      hapticFeedback("light");
                      setSelectedChoice(choice.id);
                    }}
                    disabled={playMutation.isPending}
                    data-testid={`button-${choice.id}`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="text-xs">{choice.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {result ? (
          <Button className="w-full h-12" onClick={resetGame} data-testid="button-play-again">
            Play Again
          </Button>
        ) : (
          <BettingPanel
            balance={balance}
            minBet={gameConfig.minBet}
            maxBet={gameConfig.maxBet}
            onBet={handlePlay}
            isPlaying={playMutation.isPending}
            buttonText={playMutation.isPending ? "Playing..." : "Play"}
            disabled={!selectedChoice}
          />
        )}
      </main>
    </div>
  );
}
