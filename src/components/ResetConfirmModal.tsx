import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  soundEnabled: boolean;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
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
          className="w-full max-w-md bg-[#1a1528] border-3 border-[#6e1d38] p-6 text-[#e3dfb1] shadow-[0_0_30px_rgba(110,29,56,0.5)]"
        >
          <div className="flex items-center justify-between border-b-2 border-[#3a334a] pb-3 mb-4">
            <div className="flex items-center gap-2 text-[#f87171] font-pixel text-[16px]">
              <AlertTriangle className="w-5 h-5" />
              <span>RESET EXPEDITION?</span>
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

          <p className="font-silkscreen text-[15px] text-[#e3dfb1]/80 mb-6 leading-relaxed">
            Erase all recovered gemstone keys and artifact fragments?
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playCancel(soundEnabled);
                onClose();
              }}
              className="pixel-btn min-h-[44px] px-4 text-[14px]"
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="pixel-btn min-h-[44px] px-4 border-[#ef4444] bg-[#6e1d38] text-white hover:bg-[#991b1b] text-[14px] flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>RESET</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
