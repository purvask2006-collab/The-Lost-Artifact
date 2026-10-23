import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward, CheckCircle2, Sparkles, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SolveAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  soundEnabled: boolean;
}

export const SolveAllModal: React.FC<SolveAllModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-[#1a1528] border-3 border-[#10b981] p-6 text-[#e3dfb1] shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#3a334a] pb-3 mb-4">
            <div className="flex items-center gap-2 text-[#6ee7b7] font-pixel text-[16px]">
              <FastForward className="w-5 h-5 text-[#10b981]" />
              <span>SOLVE ALL CHALLENGES?</span>
            </div>
            <button
              onClick={() => {
                soundManager.playCancel(soundEnabled);
                onClose();
              }}
              className="p-1 border border-[#676b76] bg-[#241d33] hover:border-[#ffffff] text-[#e3dfb1] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-6">
            <p className="font-silkscreen text-[15px] text-[#ffffff] leading-relaxed">
              Instantly complete all challenges across the entire expedition:
            </p>
            <ul className="space-y-1.5 font-silkscreen text-[14px] text-[#e3dfb1]/85 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Solve all 12 chambers (India, Japan, Egypt)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Collect all 12 gemstone keys</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>Unlock all 3 grand mechanisms and reveal all 3 fragments</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e8b84a] shrink-0" />
                <span>Gain direct access to the Sanctum of Reassembly</span>
              </li>
            </ul>
            <p className="font-silkscreen text-[13px] text-[#e8b84a] pt-1">
              * You can still freely explore, test, and replay any individual chamber anytime.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#3a334a]">
            <button
              onClick={() => {
                soundManager.playCancel(soundEnabled);
                onClose();
              }}
              className="pixel-btn min-h-[44px] px-4 text-[14px] border-[#676b76] bg-[#241d33] text-[#e3dfb1] hover:text-white"
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                soundManager.playSolve(soundEnabled);
                onConfirm();
                onClose();
              }}
              className="pixel-btn min-h-[44px] px-5 text-[14px] border-2 border-[#10b981] bg-[#163328] hover:bg-[#1f4738] text-[#6ee7b7] shadow-[0_0_15px_rgba(16,185,129,0.5)] font-bold cursor-pointer"
            >
              SOLVE ALL
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
