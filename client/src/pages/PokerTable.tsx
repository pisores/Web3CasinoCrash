import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { useTelegram } from "@/components/TelegramProvider";
import { useToast } from "@/hooks/use-toast";
import type { Card, PokerGameState, PokerPlayerState, PokerAction } from "@shared/schema";
import pokerBgImage from "@assets/generated_images/dark_water_texture_background.png";

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
    <div className={`${sizeClasses[size]} bg-zinc-100 rounded-md border border-zinc-300 flex flex-col items-center justify-center font-bold shadow-lg ${SUIT_COLORS[card.suit]}`}>
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
  onSeatClick?: (seatNumber: number) => void;
}

function PlayerSeat({ player, position, isMe, maxSeats, isSitOut = false, playersCount, onSeatClick }: PlayerSeatProps) {
  const positions6 = [
    { bottom: "2%", left: "50%", transform: "translate(-50%, 0)" },
    { top: "65%", left: "0%", transform: "translate(-20%, -50%)" },
    { top: "25%", left: "0%", transform: "translate(-20%, -50%)" },
    { top: "5%", left: "50%", transform: "translate(-50%, -50%)" },
    { top: "25%", right: "0%", left: "auto", transform: "translate(20%, -50%)" },
    { top: "65%", right: "0%", left: "auto", transform: "translate(20%, -50%)" },
  ];

  const positions9 = [
    { bottom: "2%", left: "50%", transform: "translate(-50%, 0)" },
    { top: "75%", left: "0%", transform: "translate(-20%, -50%)" },
    { top: "50%", left: "0%", transform: "translate(-30%, -50%)" },
    { top: "25%", left: "0%", transform: "translate(-20%, -50%)" },
    { top: "5%", left: "35%", transform: "translate(-50%, -50%)" },
    { top: "5%", left: "65%", transform: "translate(-50%, -50%)" },
    { top: "25%", right: "0%", left: "auto", transform: "translate(20%, -50%)" },
    { top: "50%", right: "0%", left: "auto", transform: "translate(30%, -50%)" },
    { top: "75%", right: "0%", left: "auto", transform: "translate(20%, -50%)" },
  ];

  const positionStyle = maxSeats <= 6 ? positions6[position] : positions9[position];
  const showSitOut = isSitOut && player && playersCount === 1;

  if (!player) {
    return (
      <div 
        className="absolute w-16 flex flex-col items-center"
        style={positionStyle as any}
      >
        <div 
          className="w-12 h-12 rounded-full bg-zinc-800/60 border-2 border-dashed border-zinc-600/50 flex items-center justify-center cursor-pointer hover:bg-zinc-700/60 hover:border-emerald-500/50 transition-colors"
          onClick={() => onSeatClick?.(position)}
          data-testid={`button-seat-${position}`}
        >
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
          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-md border border-yellow-600">
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
  const { toast } = useToast();

  const [gameState, setGameState] = useState<PokerGameState | null>(null);
  const [chipStack, setChipStack] = useState(0);
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [buyInAmount, setBuyInAmount] = useState(minBuyIn);
  const [betAmount, setBetAmount] = useState(bigBlind);
  const [showBuyIn, setShowBuyIn] = useState(false);
  const [showRebuy, setShowRebuy] = useState(false);
  const [rebuyAmount, setRebuyAmount] = useState(minBuyIn);
  const [kickCountdown, setKickCountdown] = useState<number | null>(null);

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
      console.log("WebSocket message:", data.type, data);
      
      if (data.type === "poker_state") {
        console.log("Poker state received, players:", data.state.players);
        setGameState(data.state);
        
        const me = data.state.players.find((p: PokerPlayerState) => p.odejs === user?.id);
        if (me) {
          console.log("Found my player:", me);
          setMySeat(me.seatNumber);
          setChipStack(me.chipStack);
          
          // Check if stack is zero and hand is over - show rebuy dialog with countdown
          if (me.chipStack <= 0 && data.state.status === "waiting" && !showRebuy) {
            setShowRebuy(true);
            setRebuyAmount(minBuyIn);
            setKickCountdown(10);
          }
        } else if (mySeat !== null) {
          // We were removed from the table
          setMySeat(null);
          setChipStack(0);
          setShowRebuy(false);
          setKickCountdown(null);
        }
      }

      if (data.type === "kicked") {
        toast({ title: data.message || "Вы были удалены со стола", variant: "destructive" });
        setMySeat(null);
        setChipStack(0);
        setShowRebuy(false);
        setKickCountdown(null);
      }

      if (data.type === "error") {
        toast({ title: data.message || "Ошибка", variant: "destructive" });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [tableId, user?.id]);

  // Countdown timer for kick
  useEffect(() => {
    if (kickCountdown === null || kickCountdown <= 0) return;
    
    const timer = setInterval(() => {
      setKickCountdown(prev => {
        if (prev === null || prev <= 1) {
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [kickCountdown]);

  // Handle rebuy
  const handleRebuy = async () => {
    if (mySeat === null) return;
    
    if (rebuyAmount > balance) {
      toast({ title: "Недостаточно средств", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`/api/poker/tables/${tableId}/rebuy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          odejs: user?.id,
          amount: rebuyAmount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to rebuy");
      }

      const data = await res.json();
      setChipStack(data.newStack);
      onBalanceChange(balance - rebuyAmount);
      setShowRebuy(false);
      setKickCountdown(null);
      hapticFeedback("medium");
      toast({ title: `Докупка успешна: $${rebuyAmount.toFixed(2)}` });
    } catch (error: any) {
      console.error("Rebuy error:", error);
      toast({ title: error.message || "Ошибка докупки", variant: "destructive" });
    }
  };

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

  const handleSeatClick = (seatNumber: number) => {
    if (mySeat !== null) return;
    setSelectedSeat(seatNumber);
    setBuyInAmount(minBuyIn);
    setShowBuyIn(true);
    hapticFeedback("light");
  };

  const handleBuyIn = async () => {
    if (selectedSeat === null) {
      toast({ title: "Выберите место", variant: "destructive" });
      return;
    }
    if (buyInAmount > balance) {
      toast({ title: "Недостаточно средств", variant: "destructive" });
      return;
    }

    console.log("Attempting to sit at seat", selectedSeat, "with buy-in", buyInAmount);

    try {
      const res = await fetch(`/api/poker/tables/${tableId}/sit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          odejs: user?.id,
          buyIn: buyInAmount,
          seatNumber: selectedSeat,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("REST API error:", errorData);
        throw new Error(errorData.error || "Failed to sit");
      }

      const data = await res.json();
      console.log("REST API success, seatNumber:", data.seatNumber);
      
      setMySeat(data.seatNumber);
      setChipStack(buyInAmount);
      onBalanceChange(balance - buyInAmount);
      setShowBuyIn(false);
      setSelectedSeat(null);
      hapticFeedback("medium");

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sitMessage = {
          type: "sit_down",
          tableId,
          odejs: user?.id,
          seatNumber: data.seatNumber,
          buyIn: buyInAmount,
          username: user?.firstName || user?.username || "Player",
          photoUrl: user?.photoUrl,
        };
        console.log("Sending WebSocket sit_down:", sitMessage);
        wsRef.current.send(JSON.stringify(sitMessage));
      }
    } catch (error: any) {
      console.error("Buy-in error:", error);
      toast({ title: "Ошибка", description: error.message || "Не удалось сесть за стол", variant: "destructive" });
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleStandUp = async () => {
    if (mySeat === null) return;

    if (gameState && gameState.status !== "waiting") {
      toast({ title: "Дождитесь окончания раздачи", variant: "destructive" });
      return;
    }

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "leave_table",
          tableId,
          seatNumber: mySeat,
        }));
      }

      const res = await fetch(`/api/poker/tables/${tableId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odejs: user?.id, seatNumber: mySeat }),
      });

      if (res.ok) {
        const data = await res.json();
        onBalanceChange(balance + (data.returned || 0));
        setMySeat(null);
        setChipStack(0);
        toast({ title: "Вы встали из-за стола" });
      }
    } catch (error) {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 flex flex-col overflow-hidden" data-testid="page-poker-table">
      <header className="shrink-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="px-2 py-1 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={handleBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-[10px]">
              PP
            </div>
            <span className="text-zinc-400 text-xs">{tableName}</span>
          </div>

          <div className="w-8" />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-black/40"
          style={{ 
            backgroundImage: `url(${pokerBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'darken'
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="relative w-full h-full max-w-sm">
            <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="tableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2d8a4e" />
                  <stop offset="50%" stopColor="#1e6b3a" />
                  <stop offset="100%" stopColor="#165a2f" />
                </linearGradient>
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a4a2e" />
                  <stop offset="50%" stopColor="#0d3320" />
                  <stop offset="100%" stopColor="#0a2818" />
                </linearGradient>
                <filter id="tableShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
                </filter>
              </defs>
              
              <ellipse cx="100" cy="160" rx="95" ry="150" fill="url(#borderGradient)" filter="url(#tableShadow)" />
              <ellipse cx="100" cy="160" rx="85" ry="140" fill="url(#tableGradient)" />
              <ellipse cx="100" cy="160" rx="75" ry="125" fill="none" stroke="#2a7a45" strokeWidth="1" opacity="0.3" />
              
              <text x="100" y="155" textAnchor="middle" fill="#1a5a35" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif" opacity="0.4">
                PapaPoker
              </text>
              <text x="100" y="172" textAnchor="middle" fill="#1a5a35" fontSize="8" opacity="0.3">
                TEXAS HOLD'EM
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
                  onSeatClick={mySeat === null ? handleSeatClick : undefined}
                />
              );
            })}
          </div>
        </div>

      </main>

      <div className="shrink-0 bg-black/90 backdrop-blur-sm border-t border-zinc-800/50">
        {mySeat !== null && isMyTurn && (
          <div className="px-3 py-2 space-y-2">
            <div className="flex items-center gap-2">
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
                className="w-16 h-8 bg-zinc-800 border-zinc-700 text-center text-sm"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="destructive"
                onClick={() => sendAction("fold")}
                className="h-9 text-sm"
                data-testid="button-fold"
              >
                Фолд
              </Button>

              {canCheck ? (
                <Button
                  variant="secondary"
                  onClick={() => sendAction("check")}
                  className="h-9 text-sm"
                  data-testid="button-check"
                >
                  Чек
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => sendAction("call")}
                  className="h-9 text-sm"
                  data-testid="button-call"
                >
                  Колл ${callAmount.toFixed(0)}
                </Button>
              )}

              <Button
                onClick={() => sendAction(gameState?.currentBet === 0 ? "bet" : "raise", betAmount)}
                className="h-9 text-sm bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-raise"
              >
                {gameState?.currentBet === 0 ? "Бет" : "Рейз"}
              </Button>

              <Button
                onClick={() => sendAction("all_in")}
                className="h-9 text-sm bg-red-600 hover:bg-red-700"
                data-testid="button-allin"
              >
                All-In
              </Button>
            </div>
          </div>
        )}

        {mySeat === null && (
          <div className="px-3 py-2 text-center">
            <span className="text-zinc-500 text-sm">Нажмите на свободное место чтобы сесть</span>
          </div>
        )}

        {mySeat !== null && !isMyTurn && (
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Ваш стек: ${chipStack.toFixed(2)}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStandUp}
              className="text-red-400 border-red-400/50 hover:bg-red-500/10"
              data-testid="button-stand-up"
            >
              Встать
            </Button>
          </div>
        )}
      </div>

      {showBuyIn && selectedSeat !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm space-y-4 border border-zinc-700">
            <h2 className="text-xl font-bold text-white text-center">Место #{selectedSeat + 1}</h2>
            <p className="text-zinc-400 text-center text-sm">Выберите сумму бай-ина</p>
            
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
                onClick={() => { setShowBuyIn(false); setSelectedSeat(null); }}
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

      {showRebuy && mySeat !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm space-y-4 border border-red-700">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Докупка</h2>
              <p className="text-red-400 text-sm mt-1">Ваш стек: $0</p>
              {kickCountdown !== null && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                    <span className="text-red-400 font-bold">{kickCountdown}</span>
                  </div>
                  <span className="text-red-400 text-sm">секунд до удаления</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Мин: ${minBuyIn.toFixed(2)}</span>
                <span className="text-zinc-400">Макс: ${maxBuyIn.toFixed(2)}</span>
              </div>
              <Slider
                value={[rebuyAmount]}
                onValueChange={([v]) => setRebuyAmount(v)}
                min={minBuyIn}
                max={Math.min(maxBuyIn, balance)}
                step={0.01}
              />
              <Input
                type="number"
                value={rebuyAmount.toFixed(2)}
                onChange={(e) => setRebuyAmount(parseFloat(e.target.value) || minBuyIn)}
                className="bg-zinc-800 border-zinc-700 text-center text-xl h-12"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRebuy(false);
                  setKickCountdown(null);
                }}
                className="flex-1 h-11"
              >
                Уйти
              </Button>
              <Button
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleRebuy}
                disabled={rebuyAmount > balance}
                data-testid="button-rebuy"
              >
                Докупить ${rebuyAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
