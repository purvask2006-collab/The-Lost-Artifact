import React, { useState } from 'react';

interface YukiShrineOracleProps {
  size?: 'sm' | 'md' | 'lg';
  showDialogue?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  dialogueOverride?: string;
}

export const YukiShrineOracle: React.FC<YukiShrineOracleProps> = ({
  size = 'md',
  showDialogue = false,
  interactive = false,
  className = '',
  onClick,
  dialogueOverride,
}) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isTalking, setIsTalking] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }[size];

  const dialogues = [
    'Welcome to the Whispering Shrines. I am Yuki, keeper of the Sacred Torii.',
    'Slide the shoji screens in the pavilion until the spiritual current reaches the stone lantern.',
    'Listen and watch the temple bells carefully; each chime resonates with one of the four spirits.',
    'When both Spirit Seals rest upon the altar, the Torii gate will open to the Celestial Mirror.',
  ];

  const currentDialogue = dialogueOverride || dialogues[dialogueIndex];

  const handleClick = () => {
    if (interactive) {
      setDialogueIndex(prev => (prev + 1) % dialogues.length);
      setIsTalking(true);
    }
    if (onClick) onClick();
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Dialogue Balloon */}
      {(showDialogue || isTalking) && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-60 p-2.5 bg-zinc-900 border-2 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-center animate-in fade-in zoom-in-95 duration-100">
          <p className="font-silkscreen text-[10px] text-sky-200 leading-tight">
            "{currentDialogue}"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-zinc-900 border-r-2 border-b-2 border-sky-400 rotate-45" />
        </div>
      )}

      {/* Pixel Art Yuki Character */}
      <div
        onClick={handleClick}
        className={`relative ${sizeClasses} ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform' : ''}`}
        title="Yuki — Shrine Oracle"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          {/* Hair in twin long hime locks with crimson ribbon */}
          <rect x="10" y="2" width="12" height="6" fill="#18181b" />
          <rect x="8" y="5" width="16" height="6" fill="#18181b" />
          <rect x="7" y="11" width="3" height="12" fill="#18181b" />
          <rect x="22" y="11" width="3" height="12" fill="#18181b" />
          <rect x="12" y="2" width="8" height="2" fill="#dc2626" />
          {/* Face and large eyes */}
          <rect x="10" y="7" width="12" height="8" fill="#fef08a" />
          <rect x="12" y="10" width="2" height="3" fill="#0284c7" />
          <rect x="18" y="10" width="2" height="3" fill="#0284c7" />
          <rect x="15" y="13" width="2" height="1" fill="#f43f5e" />
          {/* White Miko Kimono Top with Red Hakama Pants */}
          <rect x="9" y="15" width="14" height="6" fill="#f8fafc" />
          <rect x="14" y="15" width="4" height="6" fill="#dc2626" />
          <rect x="7" y="17" width="4" height="6" fill="#f8fafc" />
          <rect x="21" y="17" width="4" height="6" fill="#f8fafc" />
          {/* Kagura Bell Wand in Hand */}
          <line x1="6" y1="18" x2="6" y2="25" stroke="#78350f" strokeWidth="1" />
          <circle cx="6" cy="18" r="2.5" fill="#facc15" />
          {/* Red Hakama Pleated Skirt */}
          <rect x="9" y="21" width="14" height="9" fill="#dc2626" />
          <line x1="16" y1="21" x2="16" y2="30" stroke="#991b1b" strokeWidth="1" />
          {/* Wooden Geta Sandals */}
          <rect x="11" y="30" width="3" height="2" fill="#78350f" />
          <rect x="18" y="30" width="3" height="2" fill="#78350f" />
        </svg>

        {/* Ambient cherry petal glow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-sky-500/30 blur-xs rounded-full pointer-events-none" />
      </div>

      {interactive && (
        <span className="font-pixel text-[8px] text-sky-400 mt-1 opacity-70">
          YUKI (CLICK)
        </span>
      )}
    </div>
  );
};
