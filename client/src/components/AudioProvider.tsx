import { createContext, useContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type GameType = "crash" | "mines" | "dice" | "slots" | "plinko" | "scissors" | "turtle" | "lobby";

interface AudioSettings {
  musicEnabled: boolean;
  soundEnabled: boolean;
  musicVolume: number;
  soundVolume: number;
}

interface AudioContextType {
  settings: AudioSettings;
  currentGame: GameType;
  setCurrentGame: (game: GameType) => void;
  playSound: (soundName: keyof typeof SOUND_EFFECTS) => void;
  toggleMusic: () => void;
  toggleSound: () => void;
  setMusicVolume: (volume: number) => void;
  setSoundVolume: (volume: number) => void;
}

const MUSIC_TRACKS: Record<GameType, string> = {
  lobby: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
  crash: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3",
  mines: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b32e02f9.mp3",
  dice: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946f883660.mp3",
  slots: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6d870a4.mp3",
  plinko: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_545f469438.mp3",
  scissors: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3",
  turtle: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3",
};

const SOUND_EFFECTS = {
  win: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3",
  lose: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_9c67635e47.mp3",
  click: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c78ab46e31.mp3",
  bet: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7a6dced38d.mp3",
  spin: "https://cdn.pixabay.com/download/audio/2022/10/17/audio_8cc694ac4b.mp3",
  reveal: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_bf51797db5.mp3",
  crash: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3",
  cashout: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3",
};

const DEFAULT_SETTINGS: AudioSettings = {
  musicEnabled: false,
  soundEnabled: true,
  musicVolume: 0.3,
  soundVolume: 0.5,
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem("gameAudioSettings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [currentGame, setCurrentGame] = useState<GameType>("lobby");
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("gameAudioSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!settings.musicEnabled) {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
      return;
    }

    const playMusic = async () => {
      try {
        if (musicRef.current) {
          musicRef.current.pause();
        }

        const audio = new Audio(MUSIC_TRACKS[currentGame]);
        audio.loop = true;
        audio.volume = settings.musicVolume;
        musicRef.current = audio;

        await audio.play().catch(() => {
          console.log("Music autoplay blocked");
        });
      } catch (error) {
        console.log("Failed to play music:", error);
      }
    };

    playMusic();

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, [currentGame, settings.musicEnabled, settings.musicVolume]);

  const playSound = useCallback(
    (soundName: keyof typeof SOUND_EFFECTS) => {
      if (!settings.soundEnabled) return;

      try {
        const audio = new Audio(SOUND_EFFECTS[soundName]);
        audio.volume = settings.soundVolume;
        audio.play().catch(() => {});
      } catch (error) {
        console.log("Failed to play sound:", error);
      }
    },
    [settings.soundEnabled, settings.soundVolume]
  );

  const toggleMusic = useCallback(() => {
    setSettings((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, musicVolume: volume }));
    if (musicRef.current) {
      musicRef.current.volume = volume;
    }
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, soundVolume: volume }));
  }, []);

  return (
    <AudioContext.Provider
      value={{
        settings,
        currentGame,
        setCurrentGame,
        playSound,
        toggleMusic,
        toggleSound,
        setMusicVolume,
        setSoundVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
}

export type { GameType, AudioSettings };
export { SOUND_EFFECTS };
