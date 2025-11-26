import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio, type GameType } from "./AudioProvider";

interface AudioControlsProps {
  gameType?: GameType;
}

export function AudioControls({ gameType = "lobby" }: AudioControlsProps) {
  const {
    settings,
    setCurrentGame,
    toggleMusic,
    toggleSound,
  } = useAudio();

  useEffect(() => {
    setCurrentGame(gameType);
  }, [gameType, setCurrentGame]);

  const isEnabled = settings.musicEnabled || settings.soundEnabled;

  const handleToggle = () => {
    if (isEnabled) {
      if (settings.musicEnabled) toggleMusic();
      if (settings.soundEnabled) toggleSound();
    } else {
      if (!settings.musicEnabled) toggleMusic();
      if (!settings.soundEnabled) toggleSound();
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleToggle}
      className="h-8 w-8"
      data-testid="button-toggle-audio"
    >
      {isEnabled ? (
        <Volume2 className="h-4 w-4 text-green-500" />
      ) : (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
