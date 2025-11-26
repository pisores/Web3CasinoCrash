import { Wallet } from "lucide-react";

interface BalanceDisplayProps {
  balance: number;
  className?: string;
}

export function BalanceDisplay({ balance, className = "" }: BalanceDisplayProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <div 
      className={`flex items-center gap-2 bg-card border border-card-border rounded-lg px-3 py-2 ${className}`}
      data-testid="balance-display"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
        <Wallet className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground leading-none">Balance</span>
        <span className="text-base font-semibold text-foreground leading-tight" data-testid="text-balance">
          ${formattedBalance}
        </span>
      </div>
    </div>
  );
}
