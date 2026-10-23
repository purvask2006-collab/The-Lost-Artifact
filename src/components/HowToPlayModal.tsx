import React from 'react';
import { X, Sparkles, Map, KeyRound, Award, Disc } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose, soundEnabled }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playCancel(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border-4 border-amber-600/80 shadow-[0_0_24px_rgba(217,119,6,0.3)] p-6 text-zinc-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-amber-500 font-pixel text-lg">✦</span>
            <h2 id="modal-title" className="text-lg md:text-xl font-pixel text-amber-400 tracking-wide">
              EXPEDITION CODEX
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            aria-label="Close rules"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-zinc-300">
          <div>
            <h3 className="text-amber-400 font-silkscreen font-bold flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-amber-500" />
              1. THE THREE CIVILIZATIONS
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm">
              Journey freely across the ancient world map between <strong className="text-amber-300">India (The Indus Sanctum)</strong>, <strong className="text-sky-300">Japan (The Whispering Shrines)</strong>, and <strong className="text-yellow-300">Egypt (The Sunken Necropolis)</strong>. No combat, no hazards—only logic and ancient riddles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-950/70 border border-zinc-800">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-1 text-xs">
                <KeyRound className="w-4 h-4 text-amber-400" />
                SIX LOGIC PUZZLES
              </div>
              <p className="text-zinc-400 text-xs">
                Each civilization houses two distinct puzzle chambers. Solve them through deductive pattern recognition, celestial alignment, and balanced mechanisms.
              </p>
            </div>

            <div className="p-3 bg-zinc-950/70 border border-zinc-800">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-1 text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                SIX SACRED RELICS
              </div>
              <p className="text-zinc-400 text-xs">
                Every solved puzzle awards a sacred archaeological relic (Gnomon, Lotus Gem, Shakuhachi, Magatama, Scarab, and Ankh).
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-amber-400 font-silkscreen font-bold flex items-center gap-2 mb-2">
              <Disc className="w-4 h-4 text-amber-500" />
              2. ANCIENT MECHANISMS & FRAGMENTS
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm">
              Each civilization features a monumental mechanism (Solar Chakra Engine, Torii Spirit Gate, and Ankh Keystone). When you have conquered both local puzzle chambers, activate the mechanism to claim its artifact fragment:
            </p>
            <div className="mt-3 flex flex-col gap-2 font-pixel text-xs text-zinc-300 pl-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">☸</span>
                <span>Fragment of the Solar Wheel (India)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-400">⛩</span>
                <span>Fragment of the Celestial Mirror (Japan)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">𓁹</span>
                <span>Fragment of the Eternal Eye (Egypt)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-amber-400 font-silkscreen font-bold flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. FINAL RECONSTRUCTION
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm">
              Assemble all three recovered fragments upon the sacred central pedestal to decipher the lost ancient truth. Your expedition progress is auto-saved locally at all times.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-zinc-800 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-pixel text-xs tracking-wider border-2 border-amber-400 transition-colors"
          >
            UNDERSTOOD
          </button>
        </div>
      </div>
    </div>
  );
};
