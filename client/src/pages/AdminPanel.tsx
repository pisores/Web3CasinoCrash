import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Settings, Users, Wallet, CheckCircle, XCircle, RefreshCw, Ticket, Plus } from "lucide-react";
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
  username: string | null;
  firstName: string | null;
  balance: number;
  walletAddress: string | null;
  isAdmin: boolean;
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

  const adminHeaders = {
    "x-admin-id": user?.id || "demo",
  };

  const { data: settings, isLoading: settingsLoading } = useQuery<AdminSettings>({
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

  const { data: promoCodes, isLoading: promoLoading } = useQuery<PromoCode[]>({
    queryKey: ["/api/admin/promo-codes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/promo-codes", { headers: adminHeaders });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Успешно", description: "Процент выигрыша обновлён" });
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Панель администратора</h1>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            @nahalist
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Настройки игр
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Процент выигрыша игроков: {winRate}%
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[winRate]}
                  onValueChange={([v]) => setWinRate(v)}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                  data-testid="slider-win-rate"
                />
                <Button
                  onClick={() => updateWinRateMutation.mutate(winRate)}
                  disabled={updateWinRateMutation.isPending}
                  data-testid="button-save-winrate"
                >
                  {updateWinRateMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Чем ниже процент, тем меньше шансов на выигрыш у игроков
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Запросы на вывод
              {withdrawals && withdrawals.length > 0 && (
                <Badge variant="destructive">{withdrawals.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawalsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
            ) : !withdrawals || withdrawals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Нет ожидающих выводов
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-3 bg-card border rounded-lg"
                    data-testid={`withdrawal-${w.id}`}
                  >
                    <div>
                      <p className="font-medium">${w.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {w.walletAddress}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(w.createdAt).toLocaleString("ru")}
                      </p>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Пользователи
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-8 text-muted-foreground">Загрузка...</div>
            ) : !users || users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Нет пользователей
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 bg-card border rounded-lg"
                    data-testid={`user-${u.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                        {u.firstName?.[0] || u.username?.[0] || "?"}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {u.username ? `@${u.username}` : u.firstName || "Пользователь"}
                          {u.isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Кошелёк: {u.walletAddress ? `${u.walletAddress.slice(0, 10)}...` : "Не подключен"}
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
                            className="w-24 h-8"
                            data-testid={`input-balance-${u.id}`}
                          />
                          <Button
                            size="sm"
                            onClick={() => updateBalanceMutation.mutate({ odejs: u.id, balance: parseFloat(newBalance) })}
                            disabled={updateBalanceMutation.isPending}
                            data-testid={`button-save-balance-${u.id}`}
                          >
                            OK
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingBalance(null)}
                          >
                            X
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-green-400">${u.balance.toFixed(2)}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingBalance(u.id);
                              setNewBalance(u.balance.toString());
                            }}
                            data-testid={`button-edit-balance-${u.id}`}
                          >
                            Изменить
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
                placeholder="Код (напр. BONUS100)"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                className="w-36 uppercase"
                data-testid="input-promo-code"
              />
              <Input
                type="number"
                placeholder="Бонус USDT"
                value={newPromoBonus}
                onChange={(e) => setNewPromoBonus(e.target.value)}
                className="w-28"
                data-testid="input-promo-bonus"
              />
              <Input
                type="number"
                placeholder="Лимит (0=∞)"
                value={newPromoMaxUses}
                onChange={(e) => setNewPromoMaxUses(e.target.value)}
                className="w-28"
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
                <Plus className="w-4 h-4 mr-1" />
                Создать
              </Button>
            </div>

            {promoLoading ? (
              <div className="text-center py-4 text-muted-foreground">Загрузка...</div>
            ) : !promoCodes || promoCodes.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Нет промокодов
              </div>
            ) : (
              <div className="space-y-2">
                {promoCodes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-card border rounded-lg"
                    data-testid={`promo-${p.id}`}
                  >
                    <div>
                      <p className="font-mono font-bold text-primary">{p.code}</p>
                      <p className="text-xs text-muted-foreground">
                        +{p.bonusAmount} USDT • Использовано: {p.currentUses || 0}/{p.maxUses || "∞"}
                      </p>
                    </div>
                    <Badge variant={p.isActive ? "default" : "secondary"}>
                      {p.isActive ? "Активен" : "Неактивен"}
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
