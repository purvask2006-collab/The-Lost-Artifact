import React from 'react';
import { X, Award, Disc } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS, ARTIFACT_FRAGMENTS } from '../data/gameData';
import { FragmentPixelBadge } from './PixelArtwork';
import { soundManager } from '../utils/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
  const { state } = useGame();

  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playCancel(state.soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-zinc-900 border-4 border-amber-600/80 shadow-[0_0_24px_rgba(217,119,6,0.3)] p-6 text-zinc-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="inventory-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-pixel text-base">✦</span>
            <h2 id="inventory-title" className="text-base md:text-lg font-pixel text-amber-400 tracking-wide">
              EXPEDITION INVENTORY & RELIC CODEX
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            aria-label="Close codex"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: The Three Ancient Artifact Fragments */}
        <div className="mb-6">
          <div className="flex items-center gap-2 font-pixel text-xs text-amber-400 mb-3 border-b border-zinc-800 pb-1">
            <Disc className="w-3.5 h-3.5" />
            <span>ARTIFACT FRAGMENTS ({Object.values(state.recoveredFragments).filter(Boolean).length}/3)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(ARTIFACT_FRAGMENTS).map(fragment => {
              const recovered = state.recoveredFragments[fragment.id];
              return (
                <div
                  key={fragment.id}
                  className={`p-3 border-2 transition-all ${
                    recovered
                      ? 'border-amber-500/80 bg-zinc-950/80'
                      : 'border-zinc-800 bg-zinc-950/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FragmentPixelBadge fragmentId={fragment.id} collected={recovered} size="sm" />
                    <div>
                      <div className="font-pixel text-[11px] text-zinc-200">
                        {recovered ? fragment.name : 'Unknown Fragment'}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-silkscreen">
                        {fragment.civilizationName}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-silkscreen line-clamp-3">
                    {recovered 
                      ? fragment.description 
                      : 'Locked inside the ancient mechanism vault. Solve the regional puzzle chambers to unlock.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Recovered Civilization Relics (6 total) */}
        <div>
          <div className="flex items-center gap-2 font-pixel text-xs text-amber-400 mb-3 border-b border-zinc-800 pb-1">
            <Award className="w-3.5 h-3.5" />
            <span>SOLVED PUZZLE RELICS ({Object.keys(state.collectedRewards).length}/6)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(CIVILIZATIONS).flatMap(civ => civ.puzzles).map(puzzle => {
              const collected = Boolean(state.collectedRewards[puzzle.reward.id]);
              return (
                <div 
                  key={puzzle.reward.id}
                  className={`p-3 border transition-colors ${
                    collected 
                      ? 'border-amber-600/60 bg-amber-950/20' 
                      : 'border-zinc-800/80 bg-zinc-950/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{collected ? puzzle.reward.icon : '❓'}</span>
                    <div>
                      <h4 className="font-pixel text-[10px] text-zinc-200">
                        {collected ? puzzle.reward.name : 'Hidden Relic'}
                      </h4>
                      <span className="text-[9px] text-zinc-500 font-silkscreen">
                        {puzzle.chamberName}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-silkscreen">
                    {collected ? puzzle.reward.description : 'Undiscovered in ancient chamber.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-pixel text-xs border border-zinc-700 transition-colors"
          >
            RETURN TO EXPEDITION
          </button>
        </div>
      </div>
    </div>
  );
};
