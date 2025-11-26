import { Wallet, ChevronRight } from "lucide-react";

interface BalanceDisplayProps {
  balance: number;
  className?: string;
  onClick?: () => void;
  currency?: "USDT" | "TON";
}

export function BalanceDisplay({ balance, className = "", onClick, currency = "USDT" }: BalanceDisplayProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  const currencySymbol = currency === "TON" ? "TON" : "USDT";

  return (
    <button 
      className={`flex items-center gap-2 bg-card border border-card-border rounded-lg px-3 py-2 hover-elevate active-elevate-2 cursor-pointer transition-all ${className}`}
      onClick={onClick}
      data-testid="button-balance"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
        <Wallet className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs text-muted-foreground leading-none">Баланс</span>
        <span className="text-base font-semibold text-foreground leading-tight" data-testid="text-balance">
          {formattedBalance} {currencySymbol}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground ml-1" />
    </button>
  );
}
