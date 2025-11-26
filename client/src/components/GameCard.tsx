import { type GameConfig } from "@shared/schema";
import { useTelegram } from "./TelegramProvider";

import crashImg from "@/assets/games/crash.png";
import minesImg from "@/assets/games/mines.png";
import diceImg from "@/assets/games/dice.png";
import slotImg from "@/assets/games/slot.png";
import plinkoImg from "@/assets/games/plinko.png";
import scissorImg from "@/assets/games/scissor.png";
import turtleImg from "@/assets/games/turtle.png";
import pokerImg from "@assets/generated_images/poker_table_casino_image.png";

interface GameCardProps {
  game: GameConfig;
  onClick: () => void;
}

const gameImages: Record<string, string> = {
  poker: pokerImg,
  crash: crashImg,
  mines: minesImg,
  dice: diceImg,
  slots: slotImg,
  plinko: plinkoImg,
  scissors: scissorImg,
  turtle: turtleImg,
};

export function GameCard({ game, onClick }: GameCardProps) {
  const { hapticFeedback } = useTelegram();
  const gameImage = gameImages[game.id];

  const handleClick = () => {
    hapticFeedback("medium");
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left bg-card border border-card-border rounded-2xl overflow-hidden hover-elevate active-elevate-2 transition-all active:scale-[0.98] group"
      data-testid={`card-game-${game.id}`}
    >
      <div className="flex items-stretch">
        {/* Game Image */}
        <div className={`relative w-28 h-28 flex-shrink-0 bg-gradient-to-br ${game.gradient} overflow-hidden`}>
          {gameImage ? (
            <img 
              src={gameImage} 
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white/50">{game.name[0]}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Game Info */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-foreground mb-1">{game.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{game.description}</p>
          
          {/* Bet Range Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
              ${game.minBet} - ${game.maxBet}
            </span>
          </div>
        </div>

        {/* Play Arrow */}
        <div className="flex items-center pr-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
