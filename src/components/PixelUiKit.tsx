import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Music, 
  X, 
  RotateCcw,
  Sparkles,
  BookOpen,
  FastForward,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';
import { CIVILIZATIONS, GEMSTONES, ARTIFACT_FRAGMENTS } from '../data/gameData';
import { CivilizationId, GemstoneId } from '../types/game';

/**
 * 1. PixelIconButton
 * High-contrast, tactile 44px+ button. Maximum 1-2 words or icon-only.
 */
interface PixelIconButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'accent' | 'danger';
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export const PixelIconButton: React.FC<PixelIconButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  active = false,
  disabled = false,
  className = '',
  title,
}) => {
  const { state } = useGame();

  const variantStyles = {
    default: active
      ? 'border-[#e8b84a] bg-[#3a2f52] text-[#ffffff] shadow-[0_0_10px_rgba(232,184,74,0.4)]'
      : 'border-[#676b76] bg-[#241d33] text-[#e3dfb1] hover:border-[#e8b84a] hover:text-white',
    primary: 'pixel-btn-primary animate-pixel-glow',
    accent: 'border-[#06b6d4] bg-[#162738] text-[#67e8f9] hover:border-[#ffffff] hover:text-white',
    danger: 'border-[#6e1d38] bg-[#31141e] text-[#fca5a5] hover:border-[#ef4444]',
  }[variant];

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 2, scale: 0.98 }}
      onMouseEnter={() => !disabled && soundManager.playHover(state.soundEnabled)}
      onClick={() => {
        if (!disabled) {
          soundManager.playClick(state.soundEnabled);
          onClick();
        }
      }}
      disabled={disabled}
      className={`pixel-btn min-h-[44px] min-w-[44px] px-3.5 py-2 ${variantStyles} ${
        disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : 'cursor-pointer'
      } ${className}`}
      title={title || label}
    >
      <span className="shrink-0 text-lg flex items-center justify-center">{icon}</span>
      {label && <span className="font-silkscreen text-[14px] tracking-wide whitespace-nowrap">{label}</span>}
    </motion.button>
  );
};

/**
 * 2. Visual Gem Slot & Fragment Progress Row
 * NO "2 / 4" numeric text. Visual glowing gems and silhouettes only.
 */
export const VisualProgressRow: React.FC<{ civId?: CivilizationId | null }> = ({ civId }) => {
  const { state } = useGame();

  const currentCivId = civId || state.selectedCiv || 'india';
  const civ = CIVILIZATIONS[currentCivId];

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-[#1a1528] border-2 border-[#676b76] shadow-[0_3px_0_#000]">
      {/* Civilization Crest */}
      <span className="text-xl shrink-0" title={civ.name}>
        {currentCivId === 'india' ? '☸' : currentCivId === 'japan' ? '⛩' : '𓁹'}
      </span>

      {/* 4 Regional Gemstone Slots */}
      <div className="flex items-center gap-2">
        {civ.puzzles.map((p, idx) => {
          const isCollected = state.collectedGemstones[p.gemstone.id];
          return (
            <div
              key={p.id}
              className={`w-7 h-7 border-2 flex items-center justify-center transition-all ${
                isCollected
                  ? 'border-[#ffffff] bg-[#2a223d] shadow-[0_0_12px_rgba(232,184,74,0.7)]'
                  : 'border-[#443c54] bg-[#120e1c] opacity-50'
              }`}
              title={`${p.gemstone.name} (${isCollected ? 'Collected' : 'Locked'})`}
            >
              {isCollected ? (
                <span
                  className="font-pixel text-[12px] animate-pulse"
                  style={{ color: p.gemstone.hexColor }}
                >
                  {p.gemstone.icon}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#443c54]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-[2px] h-5 bg-[#3a334a]" />

      {/* 3 Ancient Artifact Fragments Silhouettes */}
      <div className="flex items-center gap-1.5">
        {(['fragment_solar_wheel', 'fragment_celestial_mirror', 'fragment_eternal_eye'] as const).map(fId => {
          const recovered = state.recoveredFragments[fId];
          const info = ARTIFACT_FRAGMENTS[fId];
          return (
            <div
              key={fId}
              className={`w-7 h-7 border-2 flex items-center justify-center text-xs transition-all ${
                recovered
                  ? 'border-[#e8b84a] bg-[#3a2818] text-[#fef08a] shadow-[0_0_10px_rgba(232,184,74,0.8)]'
                  : 'border-[#3a334a] bg-[#130e20] text-[#443c54] opacity-40'
              }`}
              title={`${info.name} (${recovered ? 'Recovered' : 'Missing'})`}
            >
              <span className="font-pixel text-[11px]">{info.symbol}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 3. Minimal Persistent HUD
 * Always standard layout:
 * Left: [ArrowLeft]
 * Center: VisualProgressRow
 * Right: [Book] Journal, [Sparkles] Gem Tray, [Sound] SFX, [Music] BGM
 */
interface MinimalHUDProps {
  onBack?: () => void;
  onHint?: () => void;
  hasHint?: boolean;
  onSkip?: () => void;
  isAlreadySolved?: boolean;
  civId?: CivilizationId | null;
  onOpenJournal?: () => void;
  onOpenTray?: () => void;
}

export const MinimalHUD: React.FC<MinimalHUDProps> = ({
  onBack,
  onHint,
  hasHint = false,
  onSkip,
  isAlreadySolved = false,
  civId,
  onOpenJournal,
  onOpenTray,
}) => {
  const { state, toggleSound, toggleMusic } = useGame();

  return (
    <header className="relative z-30 w-full flex items-center justify-between gap-3 px-3 py-2 border-b-3 border-[#2a223d] bg-[#130e20]/90 backdrop-blur-xs select-none">
      {/* Top Left: Back Icon Button */}
      <div className="flex items-center gap-2">
        {onBack && (
          <PixelIconButton
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={onBack}
            title="Back"
          />
        )}
      </div>

      {/* Top Center: Visual Gem Progress & Fragment Silhouettes */}
      <div className="flex items-center justify-center">
        <VisualProgressRow civId={civId} />
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-2">
        {/* Optional Skip / Auto-Solve Button */}
        {onSkip && !isAlreadySolved && (
          <PixelIconButton
            icon={<FastForward className="w-5 h-5 text-[#f59e0b]" />}
            label="SKIP"
            onClick={onSkip}
            variant="primary"
            title="Skip Challenge & Award Gemstone"
          />
        )}

        {/* Optional Hint Button */}
        {onHint && (
          <PixelIconButton
            icon={<Lightbulb className="w-5 h-5 text-[#fde047]" />}
            onClick={onHint}
            variant={hasHint ? 'primary' : 'default'}
            title="Hint"
          />
        )}

        {/* Journal (Brief Carved Inscriptions, replaces walls of text) */}
        {onOpenJournal && (
          <PixelIconButton
            icon={<BookOpen className="w-5 h-5 text-[#38bdf8]" />}
            onClick={onOpenJournal}
            title="Journal"
          />
        )}

        {/* Gem Tray / Inventory Toggle */}
        {onOpenTray && (
          <PixelIconButton
            icon={<Sparkles className="w-5 h-5 text-[#f472b6]" />}
            onClick={onOpenTray}
            variant="accent"
            title="Gemstone Tray"
          />
        )}

        {/* SFX Toggle */}
        <PixelIconButton
          icon={state.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-[#676b76]" />}
          onClick={toggleSound}
          active={state.soundEnabled}
          title={state.soundEnabled ? 'SFX On' : 'SFX Off'}
        />

        {/* Music Toggle */}
        <PixelIconButton
          icon={<Music className={`w-5 h-5 ${state.musicEnabled ? 'text-[#38bdf8]' : 'text-[#676b76]'}`} />}
          onClick={toggleMusic}
          active={state.musicEnabled}
          title={state.musicEnabled ? 'Music On' : 'Music Off'}
        />
      </div>
    </header>
  );
};

/**
 * 4. Slide-Up Gemstone Inventory Tray
 * 12 slots in 3 rows of 4. Tap gem = spins with 2-word name. No long descriptions.
 */
export const InventoryTray: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { state } = useGame();
  const [inspectedGem, setInspectedGem] = useState<GemstoneId | null>(null);

  const gemsCount = Object.values(state.collectedGemstones).filter(Boolean).length;

  const rows: { name: string; icon: string; ids: GemstoneId[] }[] = [
    { name: 'INDIA', icon: '☸', ids: ['ruby', 'emerald', 'sapphire', 'citrine'] },
    { name: 'JAPAN', icon: '⛩', ids: ['rose_quartz', 'moonstone', 'amethyst', 'obsidian'] },
    { name: 'EGYPT', icon: '𓁹', ids: ['lapis_lazuli', 'turquoise', 'carnelian', 'malachite'] },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-xs select-none">
          <motion.div
            initial={{ y: 280, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 280, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-[#1a1528] border-t-4 border-x-4 border-[#e8b84a] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] text-[#e3dfb1]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#3a334a]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#e8b84a]" />
                <h2 className="font-pixel text-[18px] text-[#e8b84a] tracking-wider">
                  GEMSTONE TRAY
                </h2>
                <span className="font-silkscreen text-[14px] text-[#676b76]">
                  {gemsCount}/12 KEYS
                </span>
              </div>
              <PixelIconButton
                icon={<X className="w-5 h-5" />}
                onClick={onClose}
                title="Close Tray"
              />
            </div>

            {/* 3 Rows of 4 Slots */}
            <div className="space-y-3">
              {rows.map(row => (
                <div key={row.name} className="flex items-center gap-3">
                  <div className="w-16 flex items-center gap-1 font-pixel text-[12px] text-[#676b76]">
                    <span>{row.icon}</span>
                    <span>{row.name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 flex-1">
                    {row.ids.map(gemId => {
                      const gem = GEMSTONES[gemId];
                      const isCollected = state.collectedGemstones[gemId];
                      const isInspected = inspectedGem === gemId;

                      return (
                        <button
                          key={gemId}
                          onClick={() => {
                            if (isCollected) {
                              soundManager.playClick(state.soundEnabled);
                              setInspectedGem(gemId);
                            }
                          }}
                          className={`relative h-14 border-3 flex flex-col items-center justify-center p-1 transition-all ${
                            isCollected
                              ? 'border-[#ffffff] bg-[#2a223d] shadow-[0_0_12px_rgba(232,184,74,0.4)] cursor-pointer hover:scale-105'
                              : 'border-[#3a334a] bg-[#120e1c] opacity-40 cursor-not-allowed'
                          } ${isInspected ? 'ring-2 ring-[#e8b84a]' : ''}`}
                          title={isCollected ? gem.name : 'Unclaimed'}
                        >
                          <span
                            className="font-pixel text-xl"
                            style={{ color: isCollected ? gem.hexColor : '#443c54' }}
                          >
                            {isCollected ? gem.icon : '●'}
                          </span>
                          <span className="font-silkscreen text-[12px] text-[#e3dfb1] truncate max-w-full mt-0.5">
                            {isCollected ? gem.name.split(' ')[0] : '???'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Inspected Gem Display: Max 2 words name label */}
            {inspectedGem && (
              <div className="mt-4 p-2.5 bg-[#120e1c] border-2 border-[#e8b84a] flex items-center justify-between text-[14px] font-silkscreen">
                <span className="text-[#e8b84a] font-pixel text-[14px]">
                  {GEMSTONES[inspectedGem].name.toUpperCase()}
                </span>
                <span className="text-[#67e8f9]">
                  {GEMSTONES[inspectedGem].colorName}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * 5. Minimal Journal Modal (Replaces walls of text on gameplay screens)
 * Max 15 words per carved inscription entry.
 */
export const JournalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-[#1a1528] border-3 border-[#676b76] p-6 shadow-[0_0_40px_rgba(0,0,0,0.9)] text-[#e3dfb1]"
          >
            <div className="flex items-center justify-between border-b-2 border-[#3a334a] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#38bdf8]" />
                <h3 className="font-pixel text-[16px] text-[#e8b84a]">EXPEDITION JOURNAL</h3>
              </div>
              <PixelIconButton icon={<X className="w-5 h-5" />} onClick={onClose} />
            </div>

            <div className="space-y-4 font-silkscreen text-[14px] leading-relaxed">
              <div className="p-3 bg-[#120e1c] border-2 border-[#f59e0b]">
                <div className="font-pixel text-[12px] text-[#f59e0b] mb-1">AMARA · INDIA</div>
                <p className="italic text-[#e3dfb1]">"Every mess is a pattern waiting to be understood."</p>
              </div>

              <div className="p-3 bg-[#120e1c] border-2 border-[#f472b6]">
                <div className="font-pixel text-[12px] text-[#f472b6] mb-1">YUKI · JAPAN</div>
                <p className="italic text-[#e3dfb1]">"She senses wrongness instantly and restores quiet harmony."</p>
              </div>

              <div className="p-3 bg-[#120e1c] border-2 border-[#06b6d4]">
                <div className="font-pixel text-[12px] text-[#06b6d4] mb-1">KIYA · EGYPT</div>
                <p className="italic text-[#e3dfb1]">"She treats every misaligned star as an insult against the sky."</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * 6. GhostHandTutorial
 * Skippable visual tutorial showing drag, rotate, or slide move. No text blocks.
 */
export const GhostHandTutorial: React.FC<{
  type: 'click' | 'rotate' | 'slide' | 'drag';
  onDismiss: () => void;
}> = ({ type, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 cursor-pointer"
      title="Click anywhere to skip"
    >
      <motion.div
        animate={
          type === 'rotate'
            ? { rotate: [0, 90, 0], scale: [1, 1.1, 1] }
            : type === 'slide'
            ? { x: [-30, 30, -30] }
            : { scale: [1, 1.25, 1], y: [0, -8, 0] }
        }
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 border-3 border-[#e8b84a] bg-[#241d33] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(232,184,74,0.8)]"
      >
        {type === 'rotate' ? '↻' : type === 'slide' ? '⇄' : '👆'}
      </motion.div>
      <span className="font-silkscreen text-[14px] text-[#fef08a] mt-3 bg-[#130e20] px-3 py-1 border border-[#e8b84a]">
        CLICK TO SKIP
      </span>
    </motion.div>
  );
};
