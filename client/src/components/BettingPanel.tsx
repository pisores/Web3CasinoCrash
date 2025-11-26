import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Zap } from "lucide-react";
import { useTelegram } from "./TelegramProvider";

interface BettingPanelProps {
  balance: number;
  minBet: number;
  maxBet: number;
  onBet: (amount: number) => void;
  isPlaying: boolean;
  buttonText?: string;
  buttonVariant?: "default" | "destructive";
  disabled?: boolean;
}

export function BettingPanel({
  balance,
  minBet,
  maxBet,
  onBet,
  isPlaying,
  buttonText = "Place Bet",
  buttonVariant = "default",
  disabled = false,
}: BettingPanelProps) {
  const [amount, setAmount] = useState(minBet);
  const { hapticFeedback } = useTelegram();

  const adjustAmount = (delta: number) => {
    hapticFeedback("light");
    const newAmount = Math.max(minBet, Math.min(maxBet, Math.min(balance, amount + delta)));
    setAmount(newAmount);
  };

  const multiplyAmount = (multiplier: number) => {
    hapticFeedback("light");
    const newAmount = Math.max(minBet, Math.min(maxBet, Math.min(balance, Math.floor(amount * multiplier))));
    setAmount(newAmount);
  };

  const setMaxBet = () => {
    hapticFeedback("medium");
    setAmount(Math.min(maxBet, balance));
  };

  const handleBet = () => {
    if (amount > balance) {
      return;
    }
    hapticFeedback("heavy");
    onBet(amount);
  };

  const quickAmounts = [10, 25, 50, 100];

  return (
    <div className="bg-card border border-card-border rounded-xl p-4 space-y-4" data-testid="betting-panel">
      {/* Amount Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Bet Amount</span>
          <span className="text-xs text-muted-foreground">
            Min: ${minBet} | Max: ${Math.min(maxBet, balance)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => adjustAmount(-10)}
            disabled={isPlaying || amount <= minBet}
            data-testid="button-decrease-bet"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || minBet;
                setAmount(Math.max(minBet, Math.min(maxBet, Math.min(balance, val))));
              }}
              className="pl-7 text-center text-lg font-semibold"
              disabled={isPlaying}
              data-testid="input-bet-amount"
            />
          </div>
          
          <Button
            size="icon"
            variant="secondary"
            onClick={() => adjustAmount(10)}
            disabled={isPlaying || amount >= Math.min(maxBet, balance)}
            data-testid="button-increase-bet"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex items-center gap-2">
        {quickAmounts.map((qa) => (
          <Button
            key={qa}
            size="sm"
            variant="secondary"
            className="flex-1 text-xs"
            onClick={() => {
              hapticFeedback("light");
              setAmount(Math.min(qa, Math.min(maxBet, balance)));
            }}
            disabled={isPlaying || qa > balance}
            data-testid={`button-quick-${qa}`}
          >
            ${qa}
          </Button>
        ))}
      </div>

      {/* Multiplier Buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => multiplyAmount(0.5)}
          disabled={isPlaying}
          data-testid="button-half-bet"
        >
          ½
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => multiplyAmount(2)}
          disabled={isPlaying || amount * 2 > Math.min(maxBet, balance)}
          data-testid="button-double-bet"
        >
          2×
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={setMaxBet}
          disabled={isPlaying}
          data-testid="button-max-bet"
        >
          MAX
        </Button>
      </div>

      {/* Main Bet Button */}
      <Button
        className="w-full h-12 text-base font-semibold gap-2"
        variant={buttonVariant}
        onClick={handleBet}
        disabled={disabled || isPlaying || amount > balance || amount < minBet}
        data-testid="button-place-bet"
      >
        <Zap className="w-5 h-5" />
        {buttonText}
      </Button>
    </div>
  );
}
