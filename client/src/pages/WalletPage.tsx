import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Copy, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTelegram } from "@/components/TelegramProvider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WalletPageProps {
  balance: number;
  onBack: () => void;
  onBalanceChange: (newBalance: number) => void;
}

interface Withdrawal {
  id: string;
  amount: number;
  walletAddress: string;
  status: string;
  createdAt: string;
}

export function WalletPage({ balance, onBack, onBalanceChange }: WalletPageProps) {
  const { user, refetchUser } = useTelegram();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: withdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["/api/wallet/withdrawals", user?.odejs],
    queryFn: async () => {
      const res = await fetch(`/api/wallet/withdrawals/${user?.odejs}`);
      return res.json();
    },
    enabled: !!user?.odejs,
  });

  const connectWalletMutation = useMutation({
    mutationFn: async (address: string) => {
      return apiRequest("/api/wallet/connect", {
        method: "POST",
        body: JSON.stringify({ odejs: user?.odejs, walletAddress: address }),
      });
    },
    onSuccess: () => {
      refetchUser();
      toast({ title: "Успешно", description: "Кошелёк подключен" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось подключить кошелёк", variant: "destructive" });
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("/api/wallet/deposit", {
        method: "POST",
        body: JSON.stringify({ 
          odejs: user?.odejs, 
          amount,
          txHash: `tx_${Date.now()}_demo`,
        }),
      });
    },
    onSuccess: (data: any) => {
      onBalanceChange(data.newBalance);
      refetchUser();
      setDepositAmount("");
      toast({ title: "Успешно", description: `Пополнено $${depositAmount}` });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось пополнить баланс", variant: "destructive" });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("/api/wallet/withdraw", {
        method: "POST",
        body: JSON.stringify({ odejs: user?.odejs, amount }),
      });
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

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      toast({ title: "Скопировано", description: "Адрес кошелька скопирован" });
    }
  };

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Кошелёк</h1>
        </div>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Баланс</p>
              <p className="text-4xl font-bold text-primary" data-testid="text-balance">
                ${balance.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {!user?.walletAddress ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5" />
                Подключить кошелёк
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Введите адрес вашего TON кошелька для пополнения и вывода средств
              </p>
              <Input
                placeholder="UQB...адрес кошелька"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                data-testid="input-wallet-address"
              />
              <Button
                className="w-full"
                onClick={() => connectWalletMutation.mutate(walletAddress)}
                disabled={!walletAddress || connectWalletMutation.isPending}
                data-testid="button-connect-wallet"
              >
                Подключить
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Подключённый кошелёк</p>
                    <p className="font-mono text-sm truncate max-w-[200px]" data-testid="text-wallet-address">
                      {user.walletAddress}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={copyAddress} data-testid="button-copy-address">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="deposit">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit" data-testid="tab-deposit">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Пополнить
                </TabsTrigger>
                <TabsTrigger value="withdraw" data-testid="tab-withdraw">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Вывести
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Отправьте TON на указанный адрес для пополнения баланса
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Сумма в $"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        data-testid="input-deposit-amount"
                      />
                      <Button
                        onClick={() => depositMutation.mutate(parseFloat(depositAmount))}
                        disabled={!depositAmount || depositMutation.isPending}
                        data-testid="button-deposit"
                      >
                        Пополнить
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {[10, 50, 100].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setDepositAmount(amount.toString())}
                          data-testid={`button-deposit-${amount}`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="withdraw">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Запрос на вывод будет рассмотрен администратором
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Сумма в $"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        max={balance}
                        data-testid="input-withdraw-amount"
                      />
                      <Button
                        onClick={() => withdrawMutation.mutate(parseFloat(withdrawAmount))}
                        disabled={!withdrawAmount || parseFloat(withdrawAmount) > balance || withdrawMutation.isPending}
                        data-testid="button-withdraw"
                      >
                        Вывести
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Доступно для вывода: ${balance.toFixed(2)}
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
                        <p className="font-medium">${w.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(w.createdAt).toLocaleDateString("ru")}
                        </p>
                      </div>
                      {getStatusBadge(w.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
