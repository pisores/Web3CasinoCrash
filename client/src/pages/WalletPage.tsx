import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, ArrowUpRight, Gift, CheckCircle, Clock, XCircle, Ticket, Copy, ArrowDownLeft, Shield, User } from "lucide-react";
import { useTelegram } from "@/components/TelegramProvider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEPOSIT_ADDRESS = "UQDLojwLKmB87iF5FrF79A8atSmbrMp2s9IWlPXfFQGoaWzs";

interface WalletPageProps {
  balance: number;
  onBack: () => void;
  onBalanceChange: (newBalance: number) => void;
}

interface Withdrawal {
  id: string;
  odejs: string;
  amount: number;
  walletAddress: string;
  status: string;
  createdAt: string;
  user?: {
    username: string;
    firstName: string;
  };
}

export function WalletPage({ balance, onBack, onBalanceChange }: WalletPageProps) {
  const { user, refetchUser, telegramUser } = useTelegram();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const isAdmin = telegramUser?.username === "nahalist" || user?.isAdmin;

  const { data: withdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["/api/wallet/withdrawals", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/wallet/withdrawals/${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  // Admin: fetch all pending withdrawals
  const { data: pendingWithdrawals, refetch: refetchPending } = useQuery<Withdrawal[]>({
    queryKey: ["/api/admin/withdrawals/pending"],
    queryFn: async () => {
      const res = await fetch("/api/admin/withdrawals", {
        headers: { "x-admin-id": user?.id?.toString() || "" },
      });
      return res.json();
    },
    enabled: Boolean(user?.id && isAdmin),
  });

  // Admin: process withdrawal (API expects "status" field with "approved" or "rejected")
  const processWithdrawalMutation = useMutation({
    mutationFn: async ({ withdrawalId, action }: { withdrawalId: string; action: "approve" | "reject" }) => {
      const status = action === "approve" ? "approved" : "rejected";
      const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/process`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-id": user?.id?.toString() || "",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      refetchPending();
      toast({ 
        title: variables.action === "approve" ? "Одобрено" : "Отклонено",
        description: `Заявка на вывод ${variables.action === "approve" ? "одобрена" : "отклонена"}`,
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Ошибка", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const applyPromoMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch("/api/promo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odejs: user?.id, code }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка");
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      onBalanceChange(data.newBalance);
      refetchUser();
      setPromoCode("");
      toast({ 
        title: "Промокод активирован!", 
        description: `+${data.bonus} USDT добавлено на баланс` 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Ошибка", 
        description: error.message || "Промокод недействителен или уже использован", 
        variant: "destructive" 
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async ({ amount, address }: { amount: number; address: string }) => {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ odejs: user?.id, amount, walletAddress: address }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка");
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      onBalanceChange(data.newBalance);
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/withdrawals"] });
      setWithdrawAmount("");
      toast({ title: "Запрос создан", description: "Ожидает одобрения администратора" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось создать запрос на вывод", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Одобрен</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 mr-1" /> Отклонён</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" /> Ожидание</Badge>;
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= balance && withdrawAddress.trim()) {
      withdrawMutation.mutate({ amount, address: withdrawAddress.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Кошелёк</h1>
        </div>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Ваш баланс</p>
              <p className="text-4xl font-bold text-blue-400" data-testid="text-balance">
                {balance.toFixed(2)} USDT
              </p>
              <p className="text-xs text-muted-foreground mt-2">≈ TON</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue={isAdmin ? "requests" : "deposit"}>
          <TabsList className={`grid w-full ${isAdmin ? "grid-cols-4" : "grid-cols-3"}`}>
            {isAdmin && (
              <TabsTrigger value="requests" data-testid="tab-requests" className="relative">
                <Shield className="w-4 h-4 mr-1" />
                Заявки
                {pendingWithdrawals && pendingWithdrawals.filter(w => w.status === "pending").length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingWithdrawals.filter(w => w.status === "pending").length}
                  </span>
                )}
              </TabsTrigger>
            )}
            <TabsTrigger value="deposit" data-testid="tab-deposit">
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              Пополнить
            </TabsTrigger>
            <TabsTrigger value="promo" data-testid="tab-promo">
              <Ticket className="w-4 h-4 mr-1" />
              Промокод
            </TabsTrigger>
            <TabsTrigger value="withdraw" data-testid="tab-withdraw">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              Вывести
            </TabsTrigger>
          </TabsList>
          
          {isAdmin && (
            <TabsContent value="requests">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    Заявки на вывод
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!pendingWithdrawals || pendingWithdrawals.filter(w => w.status === "pending").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Нет активных заявок</p>
                    </div>
                  ) : (
                    pendingWithdrawals
                      .filter(w => w.status === "pending")
                      .map((w) => (
                        <div
                          key={w.id}
                          className="p-4 bg-muted/30 rounded-lg border border-border space-y-3"
                          data-testid={`pending-withdrawal-${w.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {w.user?.firstName || "Пользователь"} 
                                  {w.user?.username && <span className="text-muted-foreground ml-1">@{w.user.username}</span>}
                                </span>
                              </div>
                              <p className="text-2xl font-bold text-primary">{w.amount.toFixed(2)} USDT</p>
                            </div>
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              <Clock className="w-3 h-3 mr-1" /> Ожидание
                            </Badge>
                          </div>
                          
                          <div className="p-2 bg-background/50 rounded border">
                            <p className="text-xs text-muted-foreground mb-1">Адрес вывода:</p>
                            <code className="text-xs font-mono break-all">{w.walletAddress}</code>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              variant="default"
                              onClick={() => processWithdrawalMutation.mutate({ withdrawalId: w.id, action: "approve" })}
                              disabled={processWithdrawalMutation.isPending}
                              data-testid={`button-approve-${w.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Одобрить
                            </Button>
                            <Button
                              className="flex-1"
                              variant="destructive"
                              onClick={() => processWithdrawalMutation.mutate({ withdrawalId: w.id, action: "reject" })}
                              disabled={processWithdrawalMutation.isPending}
                              data-testid={`button-reject-${w.id}`}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Создано: {new Date(w.createdAt).toLocaleString("ru-RU")}
                          </p>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  Пополнение баланса
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Отправьте TON/USDT на этот адрес для пополнения баланса
                </p>
                
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-muted-foreground mb-2">TON кошелёк для пополнения:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-background/50 p-2 rounded break-all" data-testid="text-deposit-address">
                      {DEPOSIT_ADDRESS}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(DEPOSIT_ADDRESS);
                        toast({ title: "Скопировано!", description: "Адрес скопирован в буфер обмена" });
                      }}
                      data-testid="button-copy-address"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-sm font-medium text-yellow-400">Важно:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>1. Отправьте TON или USDT на указанный адрес</li>
                    <li>2. Укажите ваш Telegram ID в комментарии к переводу</li>
                    <li>3. Баланс будет пополнен в течение 5-10 минут</li>
                    <li>4. Минимальная сумма: 1 USDT</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="promo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="w-5 h-5 text-primary" />
                  Активировать промокод
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Введите промокод для получения бонуса на баланс
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="uppercase"
                    data-testid="input-promo-code"
                  />
                  <Button
                    onClick={() => applyPromoMutation.mutate(promoCode)}
                    disabled={!promoCode.trim() || applyPromoMutation.isPending}
                    data-testid="button-apply-promo"
                  >
                    {applyPromoMutation.isPending ? "..." : "Активировать"}
                  </Button>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Промокоды можно получить от администратора или по реферальной программе
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="w-5 h-5" />
                  Вывод средств
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Укажите адрес TON кошелька и сумму для вывода
                </p>
                <Input
                  placeholder="Адрес TON кошелька (UQB...)"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  data-testid="input-withdraw-address"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Сумма USDT"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={balance}
                    data-testid="input-withdraw-amount"
                  />
                  <Button
                    onClick={handleWithdraw}
                    disabled={
                      !withdrawAmount || 
                      !withdrawAddress.trim() ||
                      parseFloat(withdrawAmount) > balance || 
                      parseFloat(withdrawAmount) <= 0 ||
                      withdrawMutation.isPending
                    }
                    data-testid="button-withdraw"
                  >
                    Вывести
                  </Button>
                </div>
                <div className="flex gap-2">
                  {[10, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawAmount(amount.toString())}
                      disabled={amount > balance}
                      data-testid={`button-withdraw-${amount}`}
                    >
                      {amount} USDT
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Доступно: {balance.toFixed(2)} USDT • Минимум: 10 USDT
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {withdrawals && withdrawals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">История выводов</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {withdrawals.slice(0, 5).map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  data-testid={`withdrawal-history-${w.id}`}
                >
                  <div>
                    <p className="font-medium">{w.amount.toFixed(2)} USDT</p>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                      {w.walletAddress}
                    </p>
                  </div>
                  {getStatusBadge(w.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Реферальная программа</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Приглашайте друзей и получайте 50 USDT за каждого! 
                  Перейдите в профиль для получения реферальной ссылки.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
