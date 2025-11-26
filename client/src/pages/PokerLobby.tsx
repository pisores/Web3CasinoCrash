import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { AudioControls } from "@/components/AudioControls";
import { useTelegram } from "@/components/TelegramProvider";
import type { PokerTable } from "@shared/schema";

interface PokerLobbyProps {
  balance: number;
  onBack: () => void;
  onJoinTable: (tableId: string) => void;
  onOpenWallet: () => void;
}

export function PokerLobby({ balance, onBack, onJoinTable, onOpenWallet }: PokerLobbyProps) {
  const { hapticFeedback } = useTelegram();

  const { data: tables, isLoading } = useQuery<PokerTable[]>({
    queryKey: ["/api/poker/tables"],
  });

  const groupedTables = tables?.reduce((acc, table) => {
    if (!acc[table.limit]) acc[table.limit] = [];
    acc[table.limit].push(table);
    return acc;
  }, {} as Record<string, PokerTable[]>) || {};

  const limits = ["NL2", "NL5", "NL10", "NL25", "NL50", "NL100", "NL200", "NL500"];

  return (
    <div className="min-h-screen bg-black" data-testid="page-poker-lobby">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-zinc-800">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                hapticFeedback("light");
                onBack();
              }}
              className="w-9 h-9"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white">Покер</h1>
              <p className="text-xs text-zinc-400">Texas Hold'em</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioControls gameType="lobby" />
            <BalanceDisplay
              balance={balance}
              onClick={() => {
                hapticFeedback("light");
                onOpenWallet();
              }}
              currency="USDT"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/30 border border-emerald-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🃏</span>
            <span className="text-lg font-bold text-white">Texas Hold'em</span>
          </div>
          <p className="text-sm text-zinc-300">
            Классический покер NL Hold'em. Рейк 5% (макс 3BB)
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {limits.map(limit => {
              const limitTables = groupedTables[limit];
              if (!limitTables?.length) return null;

              return (
                <div key={limit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-400">{limit}</span>
                    <span className="text-sm text-zinc-500">
                      ({limitTables[0].smallBlind}/{limitTables[0].bigBlind})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {limitTables.map(table => (
                      <button
                        key={table.id}
                        onClick={() => {
                          hapticFeedback("medium");
                          onJoinTable(table.id);
                        }}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-4 transition-all hover-elevate"
                        data-testid={`table-${table.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{table.countryFlag}</span>
                            <div className="text-left">
                              <div className="font-medium text-white">{table.name}</div>
                              <div className="text-sm text-zinc-400">
                                {table.maxSeats}-max • ${table.minBuyIn.toFixed(2)} - ${table.maxBuyIn.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-zinc-400">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{table.currentPlayers}/{table.maxSeats}</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400">
                              <Coins className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                ${table.bigBlind.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
