import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TelegramProvider, useTelegram } from "@/components/TelegramProvider";
import { GameLobby } from "@/pages/GameLobby";
import { CrashGame } from "@/pages/CrashGame";
import { MinesGame } from "@/pages/MinesGame";
import { DiceGame } from "@/pages/DiceGame";
import { SlotsGame } from "@/pages/SlotsGame";
import { PlinkoGame } from "@/pages/PlinkoGame";
import { ScissorsGame } from "@/pages/ScissorsGame";
import { TurtleRaceGame } from "@/pages/TurtleRaceGame";
import { type GameType } from "@shared/schema";
import { Loader2 } from "lucide-react";

function GameApp() {
  const { isReady, isLoading, user, updateBalance, refetchUser } = useTelegram();
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const handleBalanceChange = (newBalance: number) => {
    updateBalance(Math.max(0, newBalance));
  };

  const handleBack = () => {
    setCurrentGame(null);
    refetchUser();
  };

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const balance = user?.balance ?? 1000;

  if (currentGame === "crash") {
    return (
      <CrashGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentGame === "mines") {
    return (
      <MinesGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentGame === "dice") {
    return (
      <DiceGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentGame === "slots") {
    return (
      <SlotsGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentGame === "plinko") {
    return (
      <PlinkoGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentGame === "scissors") {
    return (
      <ScissorsGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentGame === "turtle") {
    return (
      <TurtleRaceGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  return (
    <GameLobby
      balance={balance}
      onSelectGame={(gameId) => setCurrentGame(gameId)}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TelegramProvider>
          <GameApp />
          <Toaster />
        </TelegramProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
