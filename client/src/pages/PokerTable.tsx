import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, LogOut, Menu, Plus, Settings, Info } from "lucide-react";
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
  clubs: "text-zinc-900",
  spades: "text-zinc-900",
};

function PlayingCard({ card, hidden = false, size = "md" }: { card?: Card; hidden?: boolean; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-7 h-10 text-[10px]",
    md: "w-10 h-14 text-xs",
    lg: "w-12 h-17 text-sm",
  };

  if (hidden || !card) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-red-700 to-red-900 rounded-md border-2 border-red-600 flex items-center justify-center shadow-lg`}>
        <div className="w-3/4 h-3/4 border border-red-500/50 rounded-sm bg-red-800/50" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-md border border-zinc-200 flex flex-col items-center justify-center font-bold shadow-lg ${SUIT_COLORS[card.suit]}`}>
      <span className="leading-none">{card.rank}</span>
      <span className="leading-none text-lg">{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  );
}

function truncateName(name: string, maxLength: number = 8): string {
  if (!name) return "???";
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 1) + "…";
}

interface PlayerSeatProps {
  player?: PokerPlayerState;
  position: number;
  isMe: boolean;
  maxSeats: number;
  isSitOut?: boolean;
  playersCount: number;
}

function PlayerSeat({ player, position, isMe, maxSeats, isSitOut = false, playersCount }: PlayerSeatProps) {
  const positions6 = [
    { top: "85%", left: "50%", transform: "translate(-50%, -50%)" },
    { top: "65%", left: "5%", transform: "translate(0, -50%)" },
    { top: "20%", left: "5%", transform: "translate(0, -50%)" },
    { top: "5%", left: "50%", transform: "translate(-50%, 0)" },
    { top: "20%", right: "5%", left: "auto", transform: "translate(0, -50%)" },
    { top: "65%", right: "5%", left: "auto", transform: "translate(0, -50%)" },
  ];

  const positions9 = [
    { top: "88%", left: "50%", transform: "translate(-50%, -50%)" },
    { top: "75%", left: "8%", transform: "translate(0, -50%)" },
    { top: "45%", left: "2%", transform: "translate(0, -50%)" },
    { top: "15%", left: "12%", transform: "translate(0, -50%)" },
    { top: "3%", left: "50%", transform: "translate(-50%, 0)" },
    { top: "15%", right: "12%", left: "auto", transform: "translate(0, -50%)" },
    { top: "45%", right: "2%", left: "auto", transform: "translate(0, -50%)" },
    { top: "75%", right: "8%", left: "auto", transform: "translate(0, -50%)" },
    { top: "88%", right: "25%", left: "auto", transform: "translate(0, -50%)" },
  ];

  const positionStyle = maxSeats <= 6 ? positions6[position] : positions9[position];
  const showSitOut = isSitOut && player && playersCount === 1;

  if (!player) {
    return (
      <div 
        className="absolute w-16 flex flex-col items-center"
        style={positionStyle as any}
      >
        <div className="w-12 h-12 rounded-full bg-zinc-800/60 border-2 border-dashed border-zinc-600/50 flex items-center justify-center cursor-pointer hover:bg-zinc-700/60 transition-colors">
          <Plus className="w-5 h-5 text-zinc-500" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute flex flex-col items-center z-10"
      style={positionStyle as any}
    >
      {player.holeCards && player.holeCards.length === 2 && (
        <div className="flex gap-0.5 mb-1 -rotate-6">
          <PlayingCard card={isMe ? player.holeCards[0] : undefined} hidden={!isMe} size="sm" />
          <div className="-ml-3 rotate-12">
            <PlayingCard card={isMe ? player.holeCards[1] : undefined} hidden={!isMe} size="sm" />
          </div>
        </div>
      )}

      <div className="relative">
        <div className={`w-14 h-14 rounded-full overflow-hidden border-3 ${
          player.isFolded ? "border-zinc-600 opacity-40" : 
          player.isCurrentTurn ? "border-yellow-400 ring-2 ring-yellow-400/50" :
          isMe ? "border-emerald-500" : "border-blue-500"
        } shadow-lg`}>
          {player.odejsPhotoUrl ? (
            <img src={player.odejsPhotoUrl} alt={player.odejsname} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-lg">
              {player.odejsname?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {player.isDealer && (
          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black shadow-md border border-zinc-300">
            D
          </div>
        )}

        {player.isAllIn && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-600 rounded text-[9px] font-bold text-white shadow-md">
            ALL IN
          </div>
        )}
      </div>

      <div className={`mt-1 px-2 py-1 rounded-lg ${isMe ? "bg-emerald-600" : "bg-blue-600"} min-w-[60px] text-center shadow-md`}>
        <div className="text-[10px] text-white/90 font-medium truncate max-w-[70px]">
          {truncateName(player.odejsname || "Player", 9)}
        </div>
        <div className="text-xs font-bold text-white">
          ${player.chipStack.toFixed(0)}
        </div>
      </div>

      {showSitOut && (
        <div className="mt-1 px-2 py-0.5 bg-orange-500 rounded text-[9px] font-bold text-white">
          SIT OUT
        </div>
      )}

      {player.betAmount > 0 && (
        <div className="absolute" style={{ 
          top: position === 0 || position === 4 ? "-30px" : "50%",
          left: position < 3 ? "70px" : "auto",
          right: position >= 4 ? "70px" : "auto",
        }}>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 border border-red-400 shadow-sm" />
            <span className="text-xs font-bold text-white">${player.betAmount.toFixed(0)}</span>
          </div>
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
  const playersCount = gameState?.players.length || 0;

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
    if (mySeat === null) {
      onBack();
      return;
    }

    try {
      const res = await fetch(`/api/poker/tables/${tableId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odejs: user?.id, seatNumber: mySeat }),
      });

      if (res.ok) {
        const data = await res.json();
        onBalanceChange(balance + (data.returned || 0));
      }
      onBack();
    } catch (error) {
      toast({ title: "Ошибка выхода", variant: "destructive" });
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col" data-testid="page-poker-table">
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-zinc-800"
              data-testid="button-menu"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-zinc-800"
              data-testid="button-add"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-sm">
              JP
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-zinc-800"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-zinc-800"
              data-testid="button-info"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg" style={{ aspectRatio: "16/10" }}>
            <svg viewBox="0 0 400 250" className="w-full h-full">
              <defs>
                <linearGradient id="tableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="50%" stopColor="#0f2744" />
                  <stop offset="100%" stopColor="#0a1929" />
                </linearGradient>
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d4a6f" />
                  <stop offset="100%" stopColor="#1a3252" />
                </linearGradient>
                <filter id="tableShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
                </filter>
              </defs>
              
              <ellipse cx="200" cy="125" rx="190" ry="115" fill="url(#borderGradient)" filter="url(#tableShadow)" />
              <ellipse cx="200" cy="125" rx="175" ry="105" fill="url(#tableGradient)" />
              <ellipse cx="200" cy="125" rx="165" ry="95" fill="none" stroke="#1a3a5a" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
              
              <text x="200" y="130" textAnchor="middle" fill="#1a4a7a" fontSize="24" fontWeight="bold" opacity="0.3">
                PapaPoker
              </text>
            </svg>

            {gameState?.pot !== undefined && gameState.pot > 0 && (
              <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-emerald-300 shadow-md" />
                  <span className="text-sm text-zinc-300">${gameState.pot.toFixed(0)}</span>
                </div>
                <div className="text-emerald-400 text-xs font-medium">Total Pot</div>
                <div className="text-white font-bold text-lg">${gameState.pot.toFixed(0)}</div>
              </div>
            )}

            {gameState?.communityCards && gameState.communityCards.length > 0 && (
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 flex gap-1">
                {gameState.communityCards.map((card, i) => (
                  <PlayingCard key={i} card={card} size="md" />
                ))}
              </div>
            )}

            {Array.from({ length: maxSeats }).map((_, i) => {
              const player = gameState?.players.find(p => p.seatNumber === i);
              return (
                <PlayerSeat 
                  key={i} 
                  player={player} 
                  position={i} 
                  isMe={player?.odejs === user?.id}
                  maxSeats={maxSeats}
                  isSitOut={mySeat !== null && playersCount === 1}
                  playersCount={playersCount}
                />
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <div className="text-zinc-500 text-sm">{tableName}</div>
          <div className="text-zinc-400 text-xs">Холдем Безлимитный</div>
          <div className="text-zinc-400 text-xs">Ставки: ${smallBlind}/${bigBlind}</div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-zinc-800 rounded-lg"
              onClick={handleLeave}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-zinc-800 rounded-lg"
              onClick={handleLeave}
              data-testid="button-leave"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          
          <BalanceDisplay balance={balance} currency="USDT" />
        </div>

        {mySeat !== null && isMyTurn && (
          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-3">
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
                className="w-20 bg-zinc-800 border-zinc-700 text-center"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="destructive"
                onClick={() => sendAction("fold")}
                className="h-11"
                data-testid="button-fold"
              >
                Фолд
              </Button>

              {canCheck ? (
                <Button
                  variant="secondary"
                  onClick={() => sendAction("check")}
                  className="h-11"
                  data-testid="button-check"
                >
                  Чек
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => sendAction("call")}
                  className="h-11"
                  data-testid="button-call"
                >
                  Колл ${callAmount.toFixed(0)}
                </Button>
              )}

              <Button
                onClick={() => sendAction(gameState?.currentBet === 0 ? "bet" : "raise", betAmount)}
                className="h-11 bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-raise"
              >
                {gameState?.currentBet === 0 ? "Бет" : "Рейз"}
              </Button>

              <Button
                onClick={() => sendAction("all_in")}
                className="h-11 bg-red-600 hover:bg-red-700"
                data-testid="button-allin"
              >
                All-In
              </Button>
            </div>
          </div>
        )}

        {mySeat === null && !showBuyIn && (
          <div className="px-4 pb-4">
            <Button
              className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowBuyIn(true)}
              data-testid="button-sit"
            >
              Сесть за стол (${minBuyIn.toFixed(2)} - ${maxBuyIn.toFixed(2)})
            </Button>
          </div>
        )}
      </div>

      {showBuyIn && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm space-y-4 border border-zinc-700">
            <h2 className="text-xl font-bold text-white text-center">Бай-ин</h2>
            
            <div className="space-y-3">
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
                className="bg-zinc-800 border-zinc-700 text-center text-xl h-12"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowBuyIn(false)}
                className="flex-1 h-11"
              >
                Отмена
              </Button>
              <Button
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleBuyIn}
                disabled={buyInAmount > balance}
              >
                Сесть ${buyInAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
