import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTelegram } from "@/components/TelegramProvider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Users, Gift, Share2, Settings, Shield } from "lucide-react";
import { BalanceDisplay } from "@/components/BalanceDisplay";

interface ProfilePageProps {
  balance: number;
  onBack: () => void;
  onOpenAdmin?: () => void;
}

export function ProfilePage({ balance, onBack, onOpenAdmin }: ProfilePageProps) {
  const { user, hapticFeedback, shareGameResult, telegramUser } = useTelegram();
  const isAdmin = user?.username === "nahalist" || user?.isAdmin;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [referralInput, setReferralInput] = useState("");

  const { data: referralStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "referral-stats"],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await fetch(`/api/users/${user.id}/referral-stats`);
      return response.json();
    },
    enabled: !!user?.id,
  });

  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/users/${user?.id}/referral-code`, {});
      return response.json();
    },
    onSuccess: (data) => {
      hapticFeedback("medium");
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "referral-stats"] });
      toast({
        title: "Referral Code Generated",
        description: `Your code: ${data.referralCode}`,
      });
    },
  });

  const applyCodeMutation = useMutation({
    mutationFn: async (referralCode: string) => {
      const response = await apiRequest("POST", `/api/users/${user?.id}/apply-referral`, {
        referralCode,
      });
      return response.json();
    },
    onSuccess: (data) => {
      hapticFeedback("heavy");
      queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
      toast({
        title: "Bonus Received!",
        description: data.message,
      });
      setReferralInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Invalid referral code",
        variant: "destructive",
      });
    },
  });

  const copyReferralCode = () => {
    if (referralStats?.referralCode) {
      navigator.clipboard.writeText(referralStats.referralCode);
      hapticFeedback("light");
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareReferralLink = () => {
    if (referralStats?.referralCode) {
      hapticFeedback("medium");
      shareGameResult(`Join me at Telegram Casino and use my referral code: ${referralStats.referralCode} to get $100 bonus!`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-profile">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                hapticFeedback("light");
                onBack();
              }}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Profile</h1>
          </div>
          <BalanceDisplay balance={balance} />
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {telegramUser?.first_name?.[0] || "U"}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">
                  {telegramUser?.first_name} {telegramUser?.last_name}
                </CardTitle>
                <CardDescription>@{telegramUser?.username || "user"}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Admin Panel Link - only for @nahalist */}
        {isAdmin && onOpenAdmin && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-4">
              <Button
                className="w-full"
                variant="default"
                onClick={() => {
                  hapticFeedback("medium");
                  onOpenAdmin();
                }}
                data-testid="button-admin-panel"
              >
                <Shield className="w-5 h-5 mr-2" />
                Админ-панель
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Управление казино, пользователями и настройками
              </p>
            </CardContent>
          </Card>
        )}

        {/* Referral Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Referral Program
            </CardTitle>
            <CardDescription>
              Invite friends and earn $50 for each referral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {referralStats?.referralCount || 0}
                </p>
                <p className="text-sm text-muted-foreground">Friends Invited</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  ${referralStats?.totalEarned || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </div>
            </div>

            {/* Your Referral Code */}
            {referralStats?.referralCode ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Referral Code</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-foreground">
                    {referralStats.referralCode}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={copyReferralCode}
                    data-testid="button-copy-code"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={shareReferralLink}
                    data-testid="button-share-code"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => generateCodeMutation.mutate()}
                disabled={generateCodeMutation.isPending}
                data-testid="button-generate-code"
              >
                {generateCodeMutation.isPending ? "Generating..." : "Generate Referral Code"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Apply Referral Code */}
        {!user?.referredBy && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Have a Referral Code?
              </CardTitle>
              <CardDescription>
                Enter a friend's code to receive $100 bonus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Enter referral code"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                data-testid="input-referral-code"
              />
              <Button
                className="w-full"
                onClick={() => applyCodeMutation.mutate(referralInput)}
                disabled={!referralInput || applyCodeMutation.isPending}
                data-testid="button-apply-code"
              >
                {applyCodeMutation.isPending ? "Applying..." : "Apply Code"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
