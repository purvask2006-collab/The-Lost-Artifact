import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-[#1a1528] border-3 border-[#e8b84a] shadow-[0_0_30px_rgba(0,0,0,0.9)] p-6 text-[#e3dfb1]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#3a334a] pb-3 mb-5">
            <h2 className="font-pixel text-[18px] text-[#e8b84a] tracking-wider">
              HOW TO PLAY
            </h2>
            <button
              onClick={handleClose}
              className="p-1 border border-[#676b76] bg-[#241d33] hover:border-[#ffffff] text-[#e3dfb1] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Visual Step-by-Step (Show, don't tell) */}
          <div className="space-y-4 font-silkscreen text-[15px]">
            {/* Step 1 */}
            <div className="flex items-center gap-3 p-3 bg-[#120e1c] border-2 border-[#676b76]">
              <span className="w-10 h-10 border-2 border-[#f59e0b] bg-[#241a12] flex items-center justify-center text-xl shrink-0">
                🧩
              </span>
              <div>
                <div className="font-pixel text-[13px] text-[#fef08a]">1. SOLVE CHAMBERS</div>
                <div className="text-[14px] text-[#e3dfb1]/80">Restore ancient logic patterns.</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 p-3 bg-[#120e1c] border-2 border-[#676b76]">
              <span className="w-10 h-10 border-2 border-[#f472b6] bg-[#2a1728] flex items-center justify-center text-xl shrink-0">
                💎
              </span>
              <div>
                <div className="font-pixel text-[13px] text-[#fef08a]">2. COLLECT 12 GEM KEYS</div>
                <div className="text-[14px] text-[#e3dfb1]/80">4 gemstone keys per civilization.</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 p-3 bg-[#120e1c] border-2 border-[#676b76]">
              <span className="w-10 h-10 border-2 border-[#06b6d4] bg-[#12232e] flex items-center justify-center text-xl shrink-0">
                ☸
              </span>
              <div>
                <div className="font-pixel text-[13px] text-[#fef08a]">3. UNLOCK MECHANISMS</div>
                <div className="text-[14px] text-[#e3dfb1]/80">Socket 4 gems to claim 3 fragments.</div>
              </div>
            </div>

            {/* Convenience Note */}
            <div className="p-2.5 bg-[#18231c] border border-[#10b981]/50 text-[13px] text-[#a7f3d0] flex items-center gap-2">
              <span className="font-pixel text-xs text-[#10b981]">TIP:</span>
              <span>Use <strong>SKIP</strong> in any chamber or <strong>SOLVE ALL</strong> on the map to progress instantly without delay!</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t-2 border-[#3a334a] flex justify-end">
            <button
              onClick={handleClose}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-6 text-[14px] flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>PLAY</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
