import React from 'react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS } from '../data/gameData';
import { CivilizationId, PuzzleId, MechanismId } from '../types/game';
import { FragmentPixelBadge } from './PixelArtwork';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  KeyRound, 
  Cog, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface LocationTarget {
  type: 'puzzle' | 'mechanism';
  civId: CivilizationId;
  id: PuzzleId | MechanismId;
  name: string;
  description: string;
  status: 'available' | 'completed' | 'locked';
  lockReason?: string;
  rewardName?: string;
  rewardIcon?: string;
  rewardDesc?: string;
  riddle?: string;
}

interface LocationModalProps {
  location: LocationTarget | null;
  onClose: () => void;
  onSolvePuzzle: (puzzleId: PuzzleId) => void;
  onUnlockMechanism: (mechanismId: MechanismId) => void;
  soundEnabled: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  location,
  onClose,
  onSolvePuzzle,
  onUnlockMechanism,
  soundEnabled,
}) => {
  if (!location) return null;

  const civ = CIVILIZATIONS[location.civId];
  const isMechanism = location.type === 'mechanism';

  const handleClose = () => {
    soundManager.playCancel(soundEnabled);
    onClose();
  };

  const handleAction = () => {
    if (location.status !== 'available') return;
    if (isMechanism) {
      onUnlockMechanism(location.id as MechanismId);
    } else {
      onSolvePuzzle(location.id as PuzzleId);
    }
  };

  const statusStyles = {
    available: {
      badge: 'border-amber-400 bg-amber-950/80 text-amber-300',
      label: 'AVAILABLE FOR EXPLORATION',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
    },
    completed: {
      badge: 'border-emerald-500 bg-emerald-950/80 text-emerald-300',
      label: 'CHAMBER COMPLETED',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    locked: {
      badge: 'border-zinc-700 bg-zinc-950/80 text-zinc-500',
      label: 'SEALED & LOCKED',
      icon: <Lock className="w-3.5 h-3.5 text-zinc-500" />,
    },
  }[location.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-zinc-900 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.4)] p-5 md:p-6 text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="loc-title"
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] px-2 py-0.5 border border-zinc-700 bg-zinc-950 text-amber-400">
              {civ.name.toUpperCase()}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-pixel ${statusStyles.badge}`}>
              {statusStyles.icon}
              <span>{statusStyles.label}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 border-2 border-amber-500/80 bg-zinc-950 shrink-0">
            {isMechanism ? (
              <Cog className="w-7 h-7 text-amber-400 animate-spin [animation-duration:12s]" />
            ) : (
              <KeyRound className="w-7 h-7 text-amber-400" />
            )}
          </div>
          <div>
            <h2 id="loc-title" className="text-base md:text-lg font-pixel text-zinc-100 tracking-wide">
              {location.name}
            </h2>
            <p className="text-xs text-zinc-400 font-silkscreen mt-1">
              {civ.region}
            </p>
          </div>
        </div>

        {/* Description Body */}
        <p className="text-xs md:text-sm text-zinc-300 font-silkscreen leading-relaxed mb-4 p-3 bg-zinc-950/70 border border-zinc-800">
          {location.description}
        </p>

        {/* Riddle (for puzzles) */}
        {location.riddle && (
          <div className="p-3 bg-amber-950/20 border border-amber-900/60 mb-4">
            <div className="text-[10px] text-amber-500 font-pixel mb-1 flex items-center gap-1">
              <span>✦</span>
              <span>ANCIENT STONE INSCRIPTION</span>
            </div>
            <p className="font-silkscreen text-xs text-amber-200 italic">
              "{location.riddle}"
            </p>
          </div>
        )}

        {/* Lock Explanation (if locked) */}
        {location.status === 'locked' && location.lockReason && (
          <div className="p-3 bg-red-950/20 border-2 border-red-800/80 mb-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-red-400 font-pixel mb-1">ACCESS REQUIREMENT</div>
              <p className="text-xs text-red-200 font-silkscreen">
                {location.lockReason}
              </p>
            </div>
          </div>
        )}

        {/* Reward Showcase */}
        {location.rewardName && (
          <div className="p-3 bg-zinc-950 border border-zinc-800 mb-5">
            <div className="text-[10px] text-zinc-400 font-pixel mb-2 flex items-center justify-between">
              <span>{isMechanism ? 'ANCIENT KEYSTONE REWARD:' : 'CHAMBER RELIC REWARD:'}</span>
              {location.status === 'completed' && (
                <span className="text-emerald-400 font-pixel text-[9px]">CLAIMED IN INVENTORY</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isMechanism ? (
                <FragmentPixelBadge
                  fragmentId={civ.fragmentId}
                  collected={location.status === 'completed'}
                  size="md"
                />
              ) : (
                <div className="w-12 h-12 border-2 border-amber-600/80 bg-zinc-900 flex items-center justify-center text-2xl">
                  {location.rewardIcon || '🏺'}
                </div>
              )}
              <div className="flex-1">
                <div className="font-pixel text-xs text-amber-300">
                  {location.rewardName}
                </div>
                <div className="text-[11px] text-zinc-400 font-silkscreen line-clamp-2 mt-0.5">
                  {location.rewardDesc}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-zinc-800 gap-3">
          <button
            onClick={handleClose}
            className="pixel-btn px-4 py-2 border-2 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-pixel text-xs transition-colors"
          >
            RETURN TO MAP
          </button>

          {location.status === 'completed' && (
            <div className="font-pixel text-xs text-emerald-400 flex items-center gap-1.5 py-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>CHAMBER CLEARED</span>
            </div>
          )}

          {location.status === 'locked' && (
            <div className="font-pixel text-[11px] text-zinc-500 flex items-center gap-1 py-2">
              <Lock className="w-3.5 h-3.5" />
              <span>LOCKED PATHWAY</span>
            </div>
          )}

          {location.status === 'available' && (
            <button
              onClick={handleAction}
              className="pixel-btn px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-amber-300 shadow-[0_3px_0_#92400e] flex items-center gap-2 transition-colors"
            >
              <span>{isMechanism ? 'ACTIVATE MECHANISM' : 'SOLVE PUZZLE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
