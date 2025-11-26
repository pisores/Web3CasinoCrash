import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { AudioControls } from "@/components/AudioControls";
import { useTelegram } from "@/components/TelegramProvider";
import { useAudio } from "@/components/AudioProvider";
import { useToast } from "@/hooks/use-toast";
import type { Card, PokerGameState, PokerPlayerState, PokerAction } from "@shared/schema";

interface PokerTableProps {
  tableId: string;
  tableName: string;
  balance: number;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  maxSeats: number;
  onBack: () => void;
  onBalanceChange: (newBalance: number) => void;
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const SUIT_COLORS: Record<string, string> = {
  hearts: "text-red-500",
  diamonds: "text-red-500",
  clubs: "text-white",
  spades: "text-white",
};

function PlayingCard({ card, hidden = false, size = "md" }: { card?: Card; hidden?: boolean; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-11 text-xs",
    md: "w-12 h-16 text-sm",
    lg: "w-16 h-22 text-base",
  };

  if (hidden || !card) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-800 to-blue-900 rounded-md border border-blue-600 flex items-center justify-center`}>
        <div className="w-3/4 h-3/4 border border-blue-500 rounded-sm" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-md border border-zinc-300 flex flex-col items-center justify-center font-bold ${SUIT_COLORS[card.suit]}`}>
      <span>{card.rank}</span>
      <span>{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  );
}

function PlayerSeat({ 
  player, 
  position, 
  isMe, 
  maxSeats 
}: { 
  player?: PokerPlayerState; 
  position: number; 
  isMe: boolean;
  maxSeats: number;
}) {
  const positions9 = [
    "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-12 left-4",
    "top-1/3 left-0",
    "top-4 left-12",
    "top-0 left-1/2 -translate-x-1/2",
    "top-4 right-12",
    "top-1/3 right-0",
    "bottom-12 right-4",
    "bottom-0 right-1/4",
  ];
  
  const positions6 = [
    "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-8 left-8",
    "top-8 left-8",
    "top-0 left-1/2 -translate-x-1/2",
    "top-8 right-8",
    "bottom-8 right-8",
  ];

  const positionClass = maxSeats === 6 ? positions6[position] : positions9[position];

  if (!player) {
    return (
      <div className={`absolute ${positionClass} w-16`}>
        <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center">
          <span className="text-xs text-zinc-500">+</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute ${positionClass} w-24`}>
      <div className={`relative ${player.isCurrentTurn ? "ring-2 ring-yellow-400 rounded-full" : ""}`}>
        <div className={`w-14 h-14 mx-auto rounded-full overflow-hidden border-2 ${
          player.isFolded ? "border-zinc-600 opacity-50" : 
          isMe ? "border-emerald-500" : "border-zinc-500"
        }`}>
          {player.odejsPhotoUrl ? (
            <img src={player.odejsPhotoUrl} alt={player.odejsname} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center text-white font-bold">
              {player.odejsname?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {player.isDealer && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
            D
          </div>
        )}

        {player.isAllIn && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-600 rounded text-[10px] font-bold text-white">
            ALL IN
          </div>
        )}
      </div>

      <div className="mt-1 text-center">
        <div className="text-xs text-zinc-300 truncate">{player.odejsname}</div>
        <div className="text-sm font-bold text-white">${player.chipStack.toFixed(2)}</div>
      </div>

      {player.betAmount > 0 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <div className="px-2 py-0.5 bg-yellow-600 rounded text-xs font-bold text-white">
            ${player.betAmount.toFixed(2)}
          </div>
        </div>
      )}

      {player.holeCards && player.holeCards.length === 2 && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-0.5">
          <PlayingCard card={player.holeCards[0]} size="sm" />
          <PlayingCard card={player.holeCards[1]} size="sm" />
        </div>
      )}
    </div>
  );
}

export function PokerTable({
  tableId,
  tableName,
  balance,
  smallBlind,
  bigBlind,
  minBuyIn,
  maxBuyIn,
  maxSeats,
  onBack,
  onBalanceChange,
}: PokerTableProps) {
  const { user, hapticFeedback } = useTelegram();
  const { playSound } = useAudio();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<PokerGameState | null>(null);
  const [chipStack, setChipStack] = useState(0);
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [buyInAmount, setBuyInAmount] = useState(minBuyIn);
  const [betAmount, setBetAmount] = useState(bigBlind);
  const [showBuyIn, setShowBuyIn] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  const myPlayer = gameState?.players.find(p => p.odejs === user?.id);
  const isMyTurn = myPlayer?.isCurrentTurn;
  const canCheck = gameState?.currentBet === (myPlayer?.betAmount || 0);
  const callAmount = (gameState?.currentBet || 0) - (myPlayer?.betAmount || 0);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_table", tableId, odejs: user?.id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "poker_state") {
        setGameState(data.state);
        
        const me = data.state.players.find((p: PokerPlayerState) => p.odejs === user?.id);
        if (me) {
          setMySeat(me.seatNumber);
          setChipStack(me.chipStack);
        }
      }

      if (data.type === "deal_cards") {
        playSound("reveal");
      }

      if (data.type === "action") {
        if (data.action === "fold") playSound("click");
        else if (data.action === "bet" || data.action === "raise") playSound("bet");
        else playSound("click");
      }

      if (data.type === "showdown") {
        playSound("win");
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [tableId, user?.id, playSound]);

  const sendAction = useCallback((action: PokerAction, amount?: number) => {
    if (!wsRef.current || !isMyTurn) return;

    wsRef.current.send(JSON.stringify({
      type: "poker_action",
      tableId,
      seatNumber: mySeat,
      action,
      amount,
    }));

    hapticFeedback("medium");
  }, [tableId, mySeat, isMyTurn, hapticFeedback]);

  const handleBuyIn = async () => {
    if (buyInAmount > balance) {
      toast({ title: "Недостаточно средств", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`/api/poker/tables/${tableId}/sit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          odejs: user?.id,
          buyIn: buyInAmount,
        }),
      });

      if (!res.ok) throw new Error("Failed to sit");

      const data = await res.json();
      setMySeat(data.seatNumber);
      setChipStack(buyInAmount);
      onBalanceChange(balance - buyInAmount);
      setShowBuyIn(false);
      playSound("bet");
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось сесть за стол", variant: "destructive" });
    }
  };

  const handleLeave = async () => {
    try {
      const res = await fetch(`/api/poker/tables/${tableId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odejs: user?.id, seatNumber: mySeat }),
      });

      if (res.ok) {
        onBalanceChange(balance + chipStack);
        onBack();
      }
    } catch (error) {
      toast({ title: "Ошибка выхода", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col" data-testid="page-poker-table">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-zinc-800">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLeave}
              className="w-9 h-9"
              data-testid="button-leave"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-sm font-bold text-white">{tableName}</h1>
              <p className="text-xs text-zinc-400">${smallBlind}/{bigBlind}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioControls gameType="lobby" />
            <BalanceDisplay balance={balance} currency="USDT" />
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Poker Table */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[3/2]">
            {/* Table felt */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-green-900 rounded-[50%] border-8 border-amber-900 shadow-2xl" />
            
            {/* Table rail */}
            <div className="absolute inset-2 rounded-[50%] border-4 border-amber-800/50" />

            {/* Pot */}
            {gameState?.pot > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="px-4 py-2 bg-black/50 rounded-full border border-yellow-500">
                  <span className="text-lg font-bold text-yellow-400">
                    ${gameState.pot.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Community Cards */}
            {gameState?.communityCards && gameState.communityCards.length > 0 && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {gameState.communityCards.map((card, i) => (
                  <PlayingCard key={i} card={card} size="md" />
                ))}
              </div>
            )}

            {/* Player Seats */}
            {Array.from({ length: maxSeats }).map((_, i) => {
              const player = gameState?.players.find(p => p.seatNumber === i);
              return (
                <PlayerSeat 
                  key={i} 
                  player={player} 
                  position={i} 
                  isMe={player?.odejs === user?.id}
                  maxSeats={maxSeats}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* Action Panel */}
      {mySeat !== null && isMyTurn && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-zinc-700 p-4 space-y-3">
          {/* Bet slider */}
          <div className="flex items-center gap-4">
            <Slider
              value={[betAmount]}
              onValueChange={([v]) => setBetAmount(v)}
              min={gameState?.minRaise || bigBlind}
              max={chipStack}
              step={0.01}
              className="flex-1"
            />
            <Input
              type="number"
              value={betAmount.toFixed(2)}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              className="w-24 bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="destructive"
              onClick={() => sendAction("fold")}
              className="h-12"
              data-testid="button-fold"
            >
              Фолд
            </Button>

            {canCheck ? (
              <Button
                variant="secondary"
                onClick={() => sendAction("check")}
                className="h-12"
                data-testid="button-check"
              >
                Чек
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => sendAction("call")}
                className="h-12"
                data-testid="button-call"
              >
                Колл ${callAmount.toFixed(2)}
              </Button>
            )}

            <Button
              variant="default"
              onClick={() => sendAction(gameState?.currentBet === 0 ? "bet" : "raise", betAmount)}
              className="h-12 bg-emerald-600 hover:bg-emerald-700"
              data-testid="button-raise"
            >
              {gameState?.currentBet === 0 ? "Бет" : "Рейз"} ${betAmount.toFixed(2)}
            </Button>

            <Button
              variant="default"
              onClick={() => sendAction("all_in")}
              className="h-12 bg-red-600 hover:bg-red-700"
              data-testid="button-allin"
            >
              All-In
            </Button>
          </div>
        </div>
      )}

      {/* Buy-in Dialog */}
      {mySeat === null && !showBuyIn && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-zinc-700 p-4">
          <Button
            className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowBuyIn(true)}
            data-testid="button-sit"
          >
            Сесть за стол (${minBuyIn.toFixed(2)} - ${maxBuyIn.toFixed(2)})
          </Button>
        </div>
      )}

      {showBuyIn && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold text-white">Бай-ин</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Мин: ${minBuyIn.toFixed(2)}</span>
                <span className="text-zinc-400">Макс: ${maxBuyIn.toFixed(2)}</span>
              </div>
              <Slider
                value={[buyInAmount]}
                onValueChange={([v]) => setBuyInAmount(v)}
                min={minBuyIn}
                max={Math.min(maxBuyIn, balance)}
                step={0.01}
              />
              <Input
                type="number"
                value={buyInAmount.toFixed(2)}
                onChange={(e) => setBuyInAmount(parseFloat(e.target.value) || minBuyIn)}
                className="bg-zinc-800 border-zinc-700 text-center text-xl"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowBuyIn(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleBuyIn}
                disabled={buyInAmount > balance}
              >
                Сесть за ${buyInAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
