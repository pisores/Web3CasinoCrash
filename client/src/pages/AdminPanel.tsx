import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Users, Wallet, CheckCircle, XCircle, RefreshCw, Ticket, Plus, History, Gamepad2, Clock, Eye, Shield } from "lucide-react";
import { useTelegram } from "@/components/TelegramProvider";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Withdrawal {
  id: string;
  odejs: string;
  amount: number;
  walletAddress: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  processedBy: string | null;
}

interface User {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  balance: number;
  walletAddress: string | null;
  isAdmin: boolean;
  lastSeenAt: string | null;
}

interface AdminSettings {
  id: string;
  winRatePercent: number;
  updatedAt: string;
  updatedBy: string | null;
}

interface PromoCode {
  id: string;
  code: string;
  bonusAmount: number;
  maxUses: number | null;
  currentUses: number | null;
  isActive: boolean | null;
  createdAt: string;
}

interface Bet {
  id: string;
  odejs: string;
  gameType: string;
  amount: number;
  multiplier: number | null;
  payout: number | null;
  isWin: boolean;
  createdAt: string;
}

interface BalanceHistory {
  id: string;
  odejs: string;
  amount: number;
  balanceAfter: number;
  type: string;
  description: string | null;
  createdAt: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { user } = useTelegram();
  const { toast } = useToast();
  const [winRate, setWinRate] = useState<number>(50);
  const [editingBalance, setEditingBalance] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState<string>("");
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoBonus, setNewPromoBonus] = useState("");
  const [newPromoMaxUses, setNewPromoMaxUses] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const adminHeaders = {
    "x-admin-id": user?.id || "demo",
  };

  const { data: settings } = useQuery<AdminSettings>({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setWinRate(data.winRatePercent);
      return data;
    },
  });

  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/withdrawals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/withdrawals", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
  });

  const { data: activeUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users/active"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users/active", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: promoCodes, isLoading: promoLoading } = useQuery<PromoCode[]>({
    queryKey: ["/api/admin/promo-codes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/promo-codes", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
  });

  const { data: recentBets } = useQuery<Bet[]>({
    queryKey: ["/api/admin/bets"],
    queryFn: async () => {
      const res = await fetch("/api/admin/bets?limit=50", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
  });

  const { data: userBets } = useQuery<Bet[]>({
    queryKey: ["/api/admin/users", selectedUser?.id, "bets"],
    queryFn: async () => {
      if (!selectedUser) return [];
      const res = await fetch(`/api/admin/users/${selectedUser.id}/bets?limit=30`, { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: !!selectedUser,
  });

  const { data: userWithdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/users", selectedUser?.id, "withdrawals"],
    queryFn: async () => {
      if (!selectedUser) return [];
      const res = await fetch(`/api/admin/users/${selectedUser.id}/withdrawals`, { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    enabled: !!selectedUser,
  });

  const updateWinRateMutation = useMutation({
    mutationFn: async (percent: number) => {
      const res = await fetch("/api/admin/settings/winrate", {
        method: "POST",
        headers: { ...adminHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ winRatePercent: percent }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: (data, savedPercent) => {
      // Immediately update local state with the saved value to prevent slider jump
      setWinRate(savedPercent);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Успешно", description: `RTP установлен на ${savedPercent}%` });
    },
  });

  const processWithdrawalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/withdrawals/${id}/process`, {
        method: "POST",
        headers: { ...adminHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to process");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      toast({
        title: variables.status === "approved" ? "Одобрено" : "Отклонено",
        description: `Вывод ${variables.status === "approved" ? "одобрен" : "отклонён"}`,
      });
    },
  });

  const updateBalanceMutation = useMutation({
    mutationFn: async ({ odejs, balance }: { odejs: string; balance: number }) => {
      const res = await fetch(`/api/admin/users/${odejs}/balance`, {
        method: "POST",
        headers: { ...adminHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ balance }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingBalance(null);
      toast({ title: "Успешно", description: "Баланс обновлён" });
    },
  });

  const createPromoMutation = useMutation({
    mutationFn: async ({ code, bonusAmount, maxUses }: { code: string; bonusAmount: number; maxUses: number }) => {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { ...adminHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ code, bonusAmount, maxUses }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promo-codes"] });
      setNewPromoCode("");
      setNewPromoBonus("");
      setNewPromoMaxUses("");
      toast({ title: "Успешно", description: "Промокод создан" });
    },
    onError: (error: any) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ odejs, isAdmin }: { odejs: string; isAdmin: boolean }) => {
      const res = await fetch(`/api/admin/users/${odejs}/admin`, {
        method: "POST",
        headers: { ...adminHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ 
        title: "Успешно", 
        description: variables.isAdmin ? "Права администратора выданы" : "Права администратора отозваны" 
      });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось изменить статус", variant: "destructive" });
    },
  });

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("ru", { 
      day: "2-digit", 
      month: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const isOnline = (lastSeen: string | null) => {
    if (!lastSeen) return false;
    const diff = Date.now() - new Date(lastSeen).getTime();
    return diff < 5 * 60 * 1000; // 5 minutes
  };

  const getGameName = (type: string) => {
    const names: Record<string, string> = {
      crash: "Crash",
      mines: "Mines",
      dice: "Dice",
      slots: "Slots",
      plinko: "Plinko",
      scissors: "RPS",
      turtle: "Turtle",
    };
    return names[type] || type;
  };

  if (!user?.isAdmin && user?.username !== "nahalist") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Доступ запрещён</h2>
            <p className="text-muted-foreground mb-4">
              Только администратор @nahalist может получить доступ к этой панели
            </p>
            <Button onClick={onBack} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User Detail Modal
  if (selectedUser) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)} data-testid="button-back-users">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">
              {selectedUser.username ? `@${selectedUser.username}` : selectedUser.firstName || "Пользователь"}
            </h1>
            {isOnline(selectedUser.lastSeenAt) && (
              <Badge className="bg-green-500/20 text-green-400">Онлайн</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Баланс</p>
                <p className="text-2xl font-bold text-green-400">{selectedUser.balance.toFixed(2)} USDT</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Кошелёк</p>
                <p className="text-sm font-mono truncate">{selectedUser.walletAddress || "Не указан"}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                История игр
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userBets || userBets.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Нет ставок</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {userBets.map((bet) => (
                    <div key={bet.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant={bet.isWin ? "default" : "secondary"} className={bet.isWin ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {getGameName(bet.gameType)}
                        </Badge>
                        <span className="text-sm">{bet.amount.toFixed(2)} USDT</span>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${bet.isWin ? "text-green-400" : "text-red-400"}`}>
                          {bet.isWin ? `+${(bet.payout || 0).toFixed(2)}` : `-${bet.amount.toFixed(2)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(bet.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                История выводов
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userWithdrawals || userWithdrawals.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Нет выводов</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {userWithdrawals.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div>
                        <p className="font-medium">{w.amount.toFixed(2)} USDT</p>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">{w.walletAddress}</p>
                      </div>
                      <Badge variant={w.status === "approved" ? "default" : w.status === "rejected" ? "destructive" : "secondary"}>
                        {w.status === "approved" ? "Одобрен" : w.status === "rejected" ? "Отклонён" : "Ожидание"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Админ-панель</h1>
          </div>
          <Badge variant="outline" className="bg-primary/10">@nahalist</Badge>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="withdrawals" data-testid="tab-withdrawals">
              <Wallet className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="games" data-testid="tab-games">
              <Gamepad2 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="promo" data-testid="tab-promo">
              <Ticket className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    Онлайн / Сегодня
                  </span>
                  <Badge>{activeUsers?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!activeUsers || activeUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Нет активных пользователей</p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {activeUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isOnline(u.lastSeenAt) ? "bg-green-400" : "bg-yellow-400"}`} />
                          <span className="font-medium">{u.username ? `@${u.username}` : u.firstName || "User"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-mono text-sm">{u.balance.toFixed(2)}</span>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedUser(u)} data-testid={`button-view-user-${u.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Все пользователи ({users?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Загрузка...</div>
                ) : !users || users.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">Нет пользователей</div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2 bg-card border rounded-lg" data-testid={`user-${u.id}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                            {u.firstName?.[0] || u.username?.[0] || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-sm flex items-center gap-1">
                              {u.username ? `@${u.username}` : u.firstName || "User"}
                              {u.isAdmin && <Badge variant="secondary" className="text-xs ml-1">Admin</Badge>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {u.walletAddress ? `${u.walletAddress.slice(0, 8)}...` : "Нет кошелька"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingBalance === u.id ? (
                            <>
                              <Input
                                type="number"
                                value={newBalance}
                                onChange={(e) => setNewBalance(e.target.value)}
                                className="w-20 h-8"
                                data-testid={`input-balance-${u.id}`}
                              />
                              <Button size="sm" onClick={() => updateBalanceMutation.mutate({ odejs: u.id, balance: parseFloat(newBalance) })} data-testid={`button-save-balance-${u.id}`}>
                                OK
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingBalance(null)}>X</Button>
                            </>
                          ) : (
                            <>
                              <span className="font-mono text-green-400">{u.balance.toFixed(2)}</span>
                              <Button size="sm" variant="ghost" onClick={() => { setEditingBalance(u.id); setNewBalance(u.balance.toString()); }} data-testid={`button-edit-balance-${u.id}`}>
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant={u.isAdmin ? "default" : "outline"}
                                className={u.isAdmin ? "bg-primary/20 text-primary" : ""}
                                onClick={() => toggleAdminMutation.mutate({ odejs: u.id, isAdmin: !u.isAdmin })} 
                                data-testid={`button-toggle-admin-${u.id}`}
                              >
                                <Shield className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setSelectedUser(u)} data-testid={`button-view-${u.id}`}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Запросы на вывод
                  {withdrawals && withdrawals.length > 0 && <Badge variant="destructive">{withdrawals.length}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawalsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
                ) : !withdrawals || withdrawals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Нет ожидающих выводов</div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((w) => (
                      <div key={w.id} className="flex items-center justify-between p-3 bg-card border rounded-lg" data-testid={`withdrawal-${w.id}`}>
                        <div>
                          <p className="font-medium">${w.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{w.walletAddress}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(w.createdAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500 border-green-500/50"
                            onClick={() => processWithdrawalMutation.mutate({ id: w.id, status: "approved" })}
                            disabled={processWithdrawalMutation.isPending}
                            data-testid={`button-approve-${w.id}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-500/50"
                            onClick={() => processWithdrawalMutation.mutate({ id: w.id, status: "rejected" })}
                            disabled={processWithdrawalMutation.isPending}
                            data-testid={`button-reject-${w.id}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Последние ставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!recentBets || recentBets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Нет ставок</div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {recentBets.map((bet) => {
                      const betUser = users?.find(u => u.id === bet.odejs);
                      return (
                        <div key={bet.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant={bet.isWin ? "default" : "secondary"} className={bet.isWin ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                              {getGameName(bet.gameType)}
                            </Badge>
                            <span className="text-sm font-medium">
                              {betUser?.username ? `@${betUser.username}` : betUser?.firstName || "User"}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${bet.isWin ? "text-green-400" : "text-red-400"}`}>
                              {bet.isWin ? `+${(bet.payout || 0).toFixed(2)}` : `-${bet.amount.toFixed(2)}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(bet.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Промокоды
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Input
                    placeholder="Код"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-28 uppercase"
                    data-testid="input-promo-code"
                  />
                  <Input
                    type="number"
                    placeholder="Бонус"
                    value={newPromoBonus}
                    onChange={(e) => setNewPromoBonus(e.target.value)}
                    className="w-24"
                    data-testid="input-promo-bonus"
                  />
                  <Input
                    type="number"
                    placeholder="Лимит"
                    value={newPromoMaxUses}
                    onChange={(e) => setNewPromoMaxUses(e.target.value)}
                    className="w-20"
                    data-testid="input-promo-max-uses"
                  />
                  <Button
                    onClick={() => createPromoMutation.mutate({
                      code: newPromoCode,
                      bonusAmount: parseFloat(newPromoBonus),
                      maxUses: parseInt(newPromoMaxUses) || 0,
                    })}
                    disabled={!newPromoCode || !newPromoBonus || createPromoMutation.isPending}
                    data-testid="button-create-promo"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {promoLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Загрузка...</div>
                ) : !promoCodes || promoCodes.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">Нет промокодов</div>
                ) : (
                  <div className="space-y-2">
                    {promoCodes.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-card border rounded-lg" data-testid={`promo-${p.id}`}>
                        <div>
                          <p className="font-mono font-bold text-primary">{p.code}</p>
                          <p className="text-xs text-muted-foreground">
                            +{p.bonusAmount} USDT | {p.currentUses || 0}/{p.maxUses || "∞"}
                          </p>
                        </div>
                        <Badge variant={p.isActive ? "default" : "secondary"}>
                          {p.isActive ? "Активен" : "Выкл"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Настройки RTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    RTP (Return to Player): {winRate}%
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[winRate]}
                      onValueChange={([v]) => setWinRate(v)}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                      data-testid="slider-rtp"
                    />
                    <Button
                      onClick={() => updateWinRateMutation.mutate(winRate)}
                      disabled={updateWinRateMutation.isPending}
                      data-testid="button-save-rtp"
                    >
                      {updateWinRateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Сохранить"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    RTP определяет % возврата игрокам. Например: 50% = половина ставок возвращается игрокам
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setWinRate(30)}
                      className={winRate === 30 ? "border-primary" : ""}
                    >
                      30% (Высокий доход)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setWinRate(50)}
                      className={winRate === 50 ? "border-primary" : ""}
                    >
                      50% (Стандарт)
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setWinRate(70)}
                      className={winRate === 70 ? "border-primary" : ""}
                    >
                      70% (Щедрый)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
