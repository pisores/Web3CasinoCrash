import { useEffect } from "react";
import { Volume2, VolumeX, Music, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
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
    setMusicVolume,
    setSoundVolume,
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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs"
            data-testid="button-audio-settings"
          >
            ⚙️
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-zinc-900 border-zinc-700">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Музыка</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.musicVolume * 100)}%
                </span>
              </div>
              <Slider
                value={[settings.musicVolume]}
                onValueChange={([v]) => setMusicVolume(v)}
                max={1}
                step={0.1}
                className="w-full"
                data-testid="slider-music-volume"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Звуки</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={([v]) => setSoundVolume(v)}
                max={1}
                step={0.1}
                className="w-full"
                data-testid="slider-sound-volume"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
