import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramTheme {
  colorScheme: "light" | "dark";
  bgColor: string;
  textColor: string;
  hintColor: string;
  linkColor: string;
  buttonColor: string;
  buttonTextColor: string;
  secondaryBgColor: string;
}

interface TelegramContextType {
  telegramUser: TelegramUser | null;
  user: User | null;
  theme: TelegramTheme;
  isReady: boolean;
  isTelegram: boolean;
  isLoading: boolean;
  hapticFeedback: (type: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  expand: () => void;
  close: () => void;
  updateBalance: (newBalance: number) => void;
  refetchUser: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  setMainButtonLoading: (loading: boolean) => void;
  shareGameResult: (text: string) => void;
  switchDevAccount: (username: string) => void;
}

const defaultTheme: TelegramTheme = {
  colorScheme: "dark",
  bgColor: "#111827",
  textColor: "#f3f4f6",
  hintColor: "#9ca3af",
  linkColor: "#10b981",
  buttonColor: "#10b981",
  buttonTextColor: "#ffffff",
  secondaryBgColor: "#1f2937",
};

const TelegramContext = createContext<TelegramContextType>({
  telegramUser: null,
  user: null,
  theme: defaultTheme,
  isReady: false,
  isTelegram: false,
  isLoading: true,
  hapticFeedback: () => {},
  showAlert: () => {},
  showConfirm: async () => false,
  expand: () => {},
  close: () => {},
  updateBalance: () => {},
  refetchUser: () => {},
  showBackButton: () => {},
  hideBackButton: () => {},
  showMainButton: () => {},
  hideMainButton: () => {},
  setMainButtonLoading: () => {},
  shareGameResult: () => {},
  switchDevAccount: () => {},
});

export function useTelegram() {
  return useContext(TelegramContext);
}

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<TelegramTheme>(defaultTheme);
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const queryClient = useQueryClient();

  // Initialize Telegram WebApp
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      setIsTelegram(true);
      
      tg.ready();
      tg.expand();
      
      if (tg.initDataUnsafe?.user) {
        setTelegramUser(tg.initDataUnsafe.user);
      }
      
      const updateTheme = () => {
        const newTheme: TelegramTheme = {
          colorScheme: tg.colorScheme || "dark",
          bgColor: tg.themeParams?.bg_color || defaultTheme.bgColor,
          textColor: tg.themeParams?.text_color || defaultTheme.textColor,
          hintColor: tg.themeParams?.hint_color || defaultTheme.hintColor,
          linkColor: tg.themeParams?.link_color || defaultTheme.linkColor,
          buttonColor: tg.themeParams?.button_color || defaultTheme.buttonColor,
          buttonTextColor: tg.themeParams?.button_text_color || defaultTheme.buttonTextColor,
          secondaryBgColor: tg.themeParams?.secondary_bg_color || defaultTheme.secondaryBgColor,
        };
        setTheme(newTheme);
        
        if (newTheme.colorScheme === "light") {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        }
      };
      
      updateTheme();
      tg.onEvent("themeChanged", updateTheme);
      
      try {
        tg.setHeaderColor(tg.themeParams?.bg_color || "#111827");
        tg.setBackgroundColor(tg.themeParams?.bg_color || "#111827");
      } catch (e) {
        // Ignore if not supported
      }
      
      setIsReady(true);
      
      return () => {
        tg.offEvent("themeChanged", updateTheme);
      };
    } else {
      // Development mode - check localStorage for saved dev account
      const savedUsername = localStorage.getItem("dev_telegram_username");
      const savedName = localStorage.getItem("dev_telegram_name");
      
      if (savedUsername) {
        // Use saved dev account
        setTelegramUser({
          id: Math.abs(savedUsername.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 12345),
          first_name: savedName || savedUsername,
          last_name: "",
          username: savedUsername,
        });
      } else {
        // Default to admin account
        setTelegramUser({
          id: 123456789,
          first_name: "Admin",
          last_name: "",
          username: "nahalist",
        });
      }
      // Force dark mode in demo
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      setIsReady(true);
    }
  }, []);

  // Sync user with backend - auto-refresh every 10 seconds for balance sync
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useQuery<User>({
    queryKey: ["/api/users/telegram", telegramUser?.id],
    queryFn: async () => {
      if (!telegramUser) throw new Error("No telegram user");
      const response = await apiRequest("POST", "/api/users/telegram", {
        telegramId: telegramUser.id.toString(),
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        photoUrl: telegramUser.photo_url,
      });
      return response.json();
    },
    enabled: !!telegramUser && isReady,
    staleTime: 5000, // Consider stale after 5 seconds
    refetchInterval: 10000, // Auto-refresh every 10 seconds for balance sync
    refetchOnWindowFocus: true, // Refresh when user returns to app
  });

  // Send heartbeat to track user activity
  useEffect(() => {
    if (!user?.id) return;
    
    const sendHeartbeat = () => {
      fetch(`/api/users/${user.id}/heartbeat`, { method: "POST" }).catch(() => {});
    };
    
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  // Update balance mutation
  const updateBalanceMutation = useMutation({
    mutationFn: async (newBalance: number) => {
      if (!user) throw new Error("No user");
      const response = await apiRequest("PATCH", `/api/users/${user.id}/balance`, {
        balance: newBalance,
      });
      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/users/telegram", telegramUser?.id], updatedUser);
    },
  });

  const updateBalance = (newBalance: number) => {
    updateBalanceMutation.mutate(newBalance);
  };

  const hapticFeedback = (type: "light" | "medium" | "heavy" | "rigid" | "soft") => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  const showAlert = (message: string) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.showAlert) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.showConfirm) {
        tg.showConfirm(message, (confirmed: boolean) => {
          resolve(confirmed);
        });
      } else {
        resolve(window.confirm(message));
      }
    });
  };

  const expand = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.expand) {
      tg.expand();
    }
  };

  const close = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.close) {
      tg.close();
    }
  };

  const showBackButton = (onClick: () => void) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.BackButton) {
      tg.BackButton.hide();
      tg.BackButton.offClick();
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.MainButton) {
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.MainButton) {
      tg.MainButton.hide();
      tg.MainButton.offClick();
    }
  };

  const setMainButtonLoading = (loading: boolean) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.MainButton) {
      if (loading) {
        tg.MainButton.showProgress();
      } else {
        tg.MainButton.hideProgress();
      }
    }
  };

  const shareGameResult = (text: string) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.switchInlineQuery) {
      tg.switchInlineQuery(text, ["users", "groups", "channels"]);
    } else if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard?.writeText(text);
      showAlert("Result copied to clipboard!");
    }
  };

  const switchDevAccount = (username: string) => {
    if (isTelegram) return; // Only works in dev mode
    
    if (!username.trim()) {
      // Clear and reset to admin
      localStorage.removeItem("dev_telegram_username");
      localStorage.removeItem("dev_telegram_name");
      setTelegramUser({
        id: 123456789,
        first_name: "Admin",
        last_name: "",
        username: "nahalist",
      });
    } else {
      // Set new dev account
      const cleanUsername = username.replace("@", "").trim();
      localStorage.setItem("dev_telegram_username", cleanUsername);
      localStorage.setItem("dev_telegram_name", cleanUsername);
      setTelegramUser({
        id: Math.abs(cleanUsername.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 12345),
        first_name: cleanUsername,
        last_name: "",
        username: cleanUsername,
      });
    }
    // Invalidate user query to force refetch
    queryClient.invalidateQueries({ queryKey: ["/api/users/telegram"] });
  };

  return (
    <TelegramContext.Provider
      value={{
        telegramUser,
        user: user || null,
        theme,
        isReady,
        isTelegram,
        isLoading: userLoading,
        hapticFeedback,
        showAlert,
        showConfirm,
        expand,
        close,
        updateBalance,
        refetchUser: () => refetchUser(),
        showBackButton,
        hideBackButton,
        showMainButton,
        hideMainButton,
        setMainButtonLoading,
        shareGameResult,
        switchDevAccount,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}
