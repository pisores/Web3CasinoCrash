import { useEffect } from "react";
import { Volume2, VolumeX, Music, Music2 } from "lucide-react";
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

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleMusic}
        className="h-8 w-8"
        data-testid="button-toggle-music"
      >
        {settings.musicEnabled ? (
          <Music className="h-4 w-4 text-green-500" />
        ) : (
          <Music2 className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={toggleSound}
        className="h-8 w-8"
        data-testid="button-toggle-sound"
      >
        {settings.soundEnabled ? (
          <Volume2 className="h-4 w-4 text-green-500" />
        ) : (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
