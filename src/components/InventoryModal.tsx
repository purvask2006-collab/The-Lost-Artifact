import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GEMSTONES, ARTIFACT_FRAGMENTS } from '../data/gameData';
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

  const gemsCount = Object.values(state.collectedGemstones).filter(Boolean).length;
  const fragsCount = Object.values(state.recoveredFragments).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-2xl bg-[#1a1528] border-3 border-[#e8b84a] shadow-[0_0_30px_rgba(0,0,0,0.9)] p-6 text-[#e3dfb1] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="inventory-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3a334a] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e8b84a]" />
            <h2 id="inventory-title" className="font-pixel text-[18px] text-[#e8b84a] tracking-wide">
              EXPEDITION GEMSTONES & ARTIFACTS
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 border border-[#676b76] bg-[#241d33] hover:border-[#ffffff] text-[#e3dfb1] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Three Ancient Artifact Fragments */}
        <div className="mb-6">
          <div className="font-pixel text-[13px] text-[#e8b84a] mb-3">
            ARTIFACT FRAGMENTS ({fragsCount}/3)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(ARTIFACT_FRAGMENTS).map(fragment => {
              const recovered = state.recoveredFragments[fragment.id];
              return (
                <div
                  key={fragment.id}
                  className={`p-3 border-2 transition-all ${
                    recovered
                      ? 'border-[#e8b84a] bg-[#2a1d12] shadow-[0_0_10px_rgba(232,184,74,0.4)]'
                      : 'border-[#3a334a] bg-[#120e1c] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel text-lg text-[#fef08a]">{fragment.symbol}</span>
                    <span className="font-pixel text-[12px] text-[#ffffff]">{fragment.civilizationName}</span>
                  </div>
                  <div className="font-silkscreen text-[13px] text-[#e3dfb1]/80">
                    {recovered ? fragment.name : 'Sealed in Mechanism'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Twelve Gemstone Keys */}
        <div>
          <div className="font-pixel text-[13px] text-[#e8b84a] mb-3">
            GEMSTONE KEYS ({gemsCount}/12)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(GEMSTONES).map(gem => {
              const collected = state.collectedGemstones[gem.id];
              return (
                <div 
                  key={gem.id}
                  className={`p-2.5 border-2 transition-all flex flex-col items-center text-center ${
                    collected 
                      ? 'border-[#ffffff] bg-[#241d33] shadow-[0_0_8px_rgba(255,255,255,0.2)]' 
                      : 'border-[#3a334a] bg-[#120e1c] opacity-40'
                  }`}
                >
                  <span
                    className="font-pixel text-xl mb-1"
                    style={{ color: collected ? gem.hexColor : '#443c54' }}
                  >
                    {collected ? gem.icon : '●'}
                  </span>
                  <span className="font-pixel text-[11px] text-[#ffffff]">
                    {collected ? gem.name.split(' ')[0] : '???'}
                  </span>
                  <span className="font-silkscreen text-[11px] text-[#e3dfb1]/70 mt-0.5">
                    {gem.civilization.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-[#3a334a] flex justify-end">
          <button
            onClick={handleClose}
            className="pixel-btn pixel-btn-primary min-h-[44px] px-6 text-[14px]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
