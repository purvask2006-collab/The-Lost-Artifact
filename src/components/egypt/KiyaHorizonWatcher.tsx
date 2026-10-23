import React, { useState } from 'react';

interface KiyaHorizonWatcherProps {
  size?: 'sm' | 'md' | 'lg';
  showDialogue?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  dialogueOverride?: string;
}

export const KiyaHorizonWatcher: React.FC<KiyaHorizonWatcherProps> = ({
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
    'Welcome to the Sunken Necropolis. I am Kiya, Horizon Watcher of Khem.',
    'Rotate the fallen ceiling stones to recreate the sacred constellation of Orion.',
    'Turn the aqueduct pipes carefully; the Nile spring must reach the sacred turquoise basin.',
    'Once both Sun Symbols are restored to the pyramid, the sealed tomb of Ra will reveal the Eternal Eye.',
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
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-60 p-2.5 bg-zinc-900 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] text-center animate-in fade-in zoom-in-95 duration-100">
          <p className="font-silkscreen text-[10px] text-yellow-200 leading-tight">
            "{currentDialogue}"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-zinc-900 border-r-2 border-b-2 border-yellow-500 rotate-45" />
        </div>
      )}

      {/* Pixel Art Kiya Character */}
      <div
        onClick={handleClick}
        className={`relative ${sizeClasses} ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95 transition-transform' : ''}`}
        title="Kiya — Horizon Watcher"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          {/* Black Egyptian Headdress / Nemes Wig with Gold Uraeus Snake Band */}
          <rect x="8" y="2" width="16" height="6" fill="#18181b" />
          <rect x="7" y="6" width="18" height="12" fill="#18181b" />
          <rect x="15" y="2" width="2" height="3" fill="#facc15" />
          <rect x="10" y="4" width="12" height="2" fill="#06b6d4" />
          {/* Face and Kohl Eyes */}
          <rect x="10" y="8" width="12" height="8" fill="#fef08a" />
          {/* Characteristic Egyptian Kohl Eyeliner & Turquoise eye */}
          <rect x="11" y="11" width="3" height="2" fill="#18181b" />
          <rect x="12" y="11" width="1" height="1" fill="#06b6d4" />
          <rect x="18" y="11" width="3" height="2" fill="#18181b" />
          <rect x="19" y="11" width="1" height="1" fill="#06b6d4" />
          {/* Turquoise and Gold Wesekh Broad Collar */}
          <rect x="9" y="16" width="14" height="4" fill="#06b6d4" />
          <rect x="11" y="17" width="10" height="2" fill="#eab308" />
          {/* White Pleated Linen Kalasiris Dress */}
          <rect x="10" y="20" width="12" height="10" fill="#f8fafc" />
          <line x1="16" y1="20" x2="16" y2="30" stroke="#e2e8f0" strokeWidth="1" />
          {/* Gold Armlets and Holding Lotus Staff */}
          <rect x="8" y="18" width="2" height="3" fill="#facc15" />
          <rect x="22" y="18" width="2" height="3" fill="#facc15" />
          <line x1="23" y1="16" x2="23" y2="30" stroke="#78350f" strokeWidth="1" />
          <circle cx="23" cy="15" r="2" fill="#06b6d4" />
          {/* Sandaled Feet */}
          <rect x="11" y="30" width="3" height="2" fill="#ca8a04" />
          <rect x="18" y="30" width="3" height="2" fill="#ca8a04" />
        </svg>

        {/* Ambient golden dust glow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-yellow-500/30 blur-xs rounded-full pointer-events-none" />
      </div>

      {interactive && (
        <span className="font-pixel text-[8px] text-yellow-400 mt-1 opacity-70">
          KIYA (CLICK)
        </span>
      )}
    </div>
  );
};
