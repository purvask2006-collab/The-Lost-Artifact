import React, { useState } from 'react';

export type SpriteDirection =
  | 'south'
  | 'south-east'
  | 'east'
  | 'north-east'
  | 'north'
  | 'north-west'
  | 'west'
  | 'south-west';

export const PRIESTESS_SPRITES: Record<SpriteDirection, string> = {
  'south': '/assets/aistudio/south_e9b304ce.png',
  'south-east': '/assets/aistudio/south-east_4b2d2657.png',
  'east': '/assets/aistudio/east_9c4fc393.png',
  'north-east': '/assets/aistudio/north-east_12f76636.png',
  'north': '/assets/aistudio/north_a328a402.png',
  'north-west': '/assets/aistudio/north-west_6832c9b1.png',
  'west': '/assets/aistudio/west_a28735cc.png',
  'south-west': '/assets/aistudio/south-west_def5a725.png',
};

export const INDIA_BG_IMAGE = '/assets/aistudio/image_1a2717da.png';

const DIRECTION_ORDER: SpriteDirection[] = [
  'south',
  'south-west',
  'west',
  'north-west',
  'north',
  'north-east',
  'east',
  'south-east',
];

interface IndianPriestessSpriteProps {
  direction?: SpriteDirection;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDialogue?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const IndianPriestessSprite: React.FC<IndianPriestessSpriteProps> = ({
  direction: propDirection = 'south',
  size = 'md',
  showDialogue = false,
  interactive = false,
  className = '',
  onClick,
}) => {
  const [currentDirection, setCurrentDirection] = useState<SpriteDirection>(propDirection);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isTalking, setIsTalking] = useState(false);

  // Sync if propDirection changes
  React.useEffect(() => {
    setCurrentDirection(propDirection);
  }, [propDirection]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  const dialogues = [
    'Welcome, seeker. I am Ananya, guardian of the Sacred Temple Ghats.',
    'Align the broken mandalas in the Cracked Courtyard to channel the earth’s heat.',
    'Kindle the Five Hearths in harmony: earth, wind, sky, water, and spirit.',
    'Once both rites are solved, the central Chakra of Balance will reveal the Solar Wheel.',
  ];

  const handleClick = () => {
    if (interactive) {
      // Rotate to next direction on click
      const nextIdx = (DIRECTION_ORDER.indexOf(currentDirection) + 1) % DIRECTION_ORDER.length;
      setCurrentDirection(DIRECTION_ORDER[nextIdx]);
      setDialogueIndex(prev => (prev + 1) % dialogues.length);
      setIsTalking(true);
    }
    if (onClick) {
      onClick();
    }
  };

  const spriteSrc = PRIESTESS_SPRITES[currentDirection] || PRIESTESS_SPRITES['south'];

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Dialogue Balloon */}
      {(showDialogue || isTalking) && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-56 p-2 bg-zinc-900 border-2 border-amber-500 shadow-[0_0_12px_rgba(217,119,6,0.5)] text-center animate-in fade-in zoom-in-95 duration-100">
          <p className="font-silkscreen text-[10px] text-amber-200 leading-tight">
            "{dialogues[dialogueIndex]}"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-zinc-900 border-r-2 border-b-2 border-amber-500 rotate-45" />
        </div>
      )}

      {/* Priestess Sprite */}
      <div
        onClick={handleClick}
        className={`relative ${sizeClasses} ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform' : ''}`}
        title="Ananya — Indian Priestess Guardian"
      >
        <img
          src={spriteSrc}
          alt="Indian Priestess Sprite"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />

        {/* Ambient Footprint Glow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-amber-500/25 blur-xs rounded-full pointer-events-none" />
      </div>

      {interactive && (
        <span className="font-pixel text-[8px] text-amber-400 mt-1 opacity-70">
          ANANYA (CLICK)
        </span>
      )}
    </div>
  );
};
