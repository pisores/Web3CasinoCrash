import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TelegramProvider, useTelegram } from "@/components/TelegramProvider";
import { AudioProvider } from "@/components/AudioProvider";
import { GameLobby } from "@/pages/GameLobby";
import { CrashGame } from "@/pages/CrashGame";
import { MinesGame } from "@/pages/MinesGame";
import { DiceGame } from "@/pages/DiceGame";
import { SlotsGame } from "@/pages/SlotsGame";
import { PlinkoGame } from "@/pages/PlinkoGame";
import { ScissorsGame } from "@/pages/ScissorsGame";
import { TurtleRaceGame } from "@/pages/TurtleRaceGame";
import { PokerLobby } from "@/pages/PokerLobby";
import { PokerTable } from "@/pages/PokerTable";
import { ProfilePage } from "@/pages/ProfilePage";
import { WalletPage } from "@/pages/WalletPage";
import AdminPanel from "@/pages/AdminPanel";
import { type GameType, type PokerTable as PokerTableType } from "@shared/schema";
import { Loader2 } from "lucide-react";

type Screen = GameType | "profile" | "wallet" | "admin" | "poker_table" | null;

interface SelectedPokerTable {
  id: string;
  name: string;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  maxSeats: number;
}

function GameApp() {
  const { isReady, isLoading, user, updateBalance, refetchUser } = useTelegram();
  const [currentScreen, setCurrentScreen] = useState<Screen>(null);
  const [selectedPokerTable, setSelectedPokerTable] = useState<SelectedPokerTable | null>(null);

  const handleBalanceChange = (newBalance: number) => {
    updateBalance(Math.max(0, newBalance));
  };

  const handleBack = () => {
    setCurrentScreen(null);
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

  const balance = user?.balance ?? 1;

  if (currentScreen === "admin") {
    return <AdminPanel onBack={handleBack} />;
  }

  if (currentScreen === "wallet") {
    return (
      <WalletPage
        balance={balance}
        onBack={handleBack}
        onBalanceChange={handleBalanceChange}
      />
    );
  }

  if (currentScreen === "profile") {
    return (
      <ProfilePage
        balance={balance}
        onBack={handleBack}
        onOpenAdmin={() => setCurrentScreen("admin")}
      />
    );
  }

  if (currentScreen === "crash") {
    return (
      <CrashGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "mines") {
    return (
      <MinesGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "dice") {
    return (
      <DiceGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "slots") {
    return (
      <SlotsGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "plinko") {
    return (
      <PlinkoGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "scissors") {
    return (
      <ScissorsGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "turtle") {
    return (
      <TurtleRaceGame
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === "poker") {
    return (
      <PokerLobby
        balance={balance}
        onBack={handleBack}
        onJoinTable={async (tableId) => {
          try {
            const res = await fetch(`/api/poker/tables/${tableId}`);
            if (res.ok) {
              const table = await res.json();
              setSelectedPokerTable({
                id: table.id,
                name: table.name,
                smallBlind: table.smallBlind,
                bigBlind: table.bigBlind,
                minBuyIn: table.minBuyIn,
                maxBuyIn: table.maxBuyIn,
                maxSeats: table.maxSeats,
              });
              setCurrentScreen("poker_table");
            }
          } catch (error) {
            console.error("Failed to get table:", error);
          }
        }}
        onOpenWallet={() => setCurrentScreen("wallet")}
      />
    );
  }

  if (currentScreen === "poker_table" && selectedPokerTable) {
    return (
      <PokerTable
        tableId={selectedPokerTable.id}
        tableName={selectedPokerTable.name}
        balance={balance}
        smallBlind={selectedPokerTable.smallBlind}
        bigBlind={selectedPokerTable.bigBlind}
        minBuyIn={selectedPokerTable.minBuyIn}
        maxBuyIn={selectedPokerTable.maxBuyIn}
        maxSeats={selectedPokerTable.maxSeats}
        onBack={() => {
          setSelectedPokerTable(null);
          setCurrentScreen("poker");
          refetchUser();
        }}
        onBalanceChange={handleBalanceChange}
      />
    );
  }

  return (
    <GameLobby
      balance={balance}
      onSelectGame={(gameId) => setCurrentScreen(gameId)}
      onOpenProfile={() => setCurrentScreen("profile")}
      onOpenWallet={() => setCurrentScreen("wallet")}
      onOpenAdmin={() => setCurrentScreen("admin")}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TelegramProvider>
          <AudioProvider>
            <GameApp />
            <Toaster />
          </AudioProvider>
        </TelegramProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
