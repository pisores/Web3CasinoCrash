import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Users, Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { AudioControls } from "@/components/AudioControls";
import { useTelegram } from "@/components/TelegramProvider";
import type { PokerTable, PokerSeat } from "@shared/schema";

interface PokerLobbyProps {
  balance: number;
  onBack: () => void;
  onJoinTable: (tableId: string) => void;
  onOpenWallet: () => void;
}

export function PokerLobby({ balance, onBack, onJoinTable, onOpenWallet }: PokerLobbyProps) {
  const { user, hapticFeedback } = useTelegram();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [myTableId, setMyTableId] = useState<string | null>(null);

  const { data: tables, isLoading } = useQuery<PokerTable[]>({
    queryKey: ["/api/poker/tables"],
    refetchInterval: 5000, // Fallback polling every 5 seconds
  });

  // Get player's current seat
  const { data: mySeats } = useQuery<PokerSeat[]>({
    queryKey: [`/api/poker/my-seats/${user?.id}`],
    enabled: !!user?.id,
  });

  // Update myTableId when seats change
  useEffect(() => {
    if (mySeats && mySeats.length > 0) {
      setMyTableId(mySeats[0].tableId);
    } else {
      setMyTableId(null);
    }
  }, [mySeats]);

  // WebSocket for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe_lobby" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "lobby_update") {
        // Invalidate tables query to refresh
        queryClient.invalidateQueries({ queryKey: ["/api/poker/tables"] });
      }
      if (data.type === "table_players_update") {
        // Update specific table's player count
        queryClient.invalidateQueries({ queryKey: ["/api/poker/tables"] });
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  // Sort tables - player's table first, then by player count
  const sortedTables = [...(tables || [])].sort((a, b) => {
    // Player's table first
    if (a.id === myTableId) return -1;
    if (b.id === myTableId) return 1;
    // Then by player count (descending)
    return b.currentPlayers - a.currentPlayers;
  });

  const groupedTables = sortedTables.reduce((acc, table) => {
    if (!acc[table.limit]) acc[table.limit] = [];
    acc[table.limit].push(table);
    return acc;
  }, {} as Record<string, PokerTable[]>);

  // Show player's table section first if they're sitting
  const limits = ["NL2", "NL5", "NL10", "NL25", "NL50", "NL100", "NL200", "NL500"];

  // Find player's table info
  const myTable = tables?.find(t => t.id === myTableId);

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

        {/* Player's active table - shown at top with highlight */}
        {myTable && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">Ваш стол</span>
            </div>
            <button
              onClick={() => {
                hapticFeedback("medium");
                onJoinTable(myTable.id);
              }}
              className="w-full bg-gradient-to-r from-yellow-900/40 to-amber-900/30 hover:from-yellow-800/50 hover:to-amber-800/40 border-2 border-yellow-500/50 rounded-xl p-4 transition-all shadow-lg shadow-yellow-500/20"
              data-testid={`table-active-${myTable.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{myTable.countryFlag}</span>
                  <div className="text-left">
                    <div className="font-medium text-white flex items-center gap-2">
                      {myTable.name}
                      <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">
                        {myTable.limit}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-300">
                      {myTable.maxSeats}-max • ${myTable.minBuyIn.toFixed(2)} - ${myTable.maxBuyIn.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-bold">{myTable.currentPlayers}/{myTable.maxSeats}</span>
                  </div>
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-bold">
                    Вернуться
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {limits.map(limit => {
              // Filter out player's table from regular list if shown above
              const limitTables = groupedTables[limit]?.filter(t => t.id !== myTableId);
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
