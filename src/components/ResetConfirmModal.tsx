import React from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-zinc-900 border-4 border-red-700 shadow-[0_0_24px_rgba(220,38,38,0.3)] p-6 text-zinc-100"
        role="alertdialog"
        aria-labelledby="reset-title"
      >
        <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-red-500 font-pixel text-sm">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 id="reset-title">RESET PROGRESS?</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playCancel(soundEnabled);
              onClose();
            }}
            className="p-1 border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-zinc-300 text-xs md:text-sm mb-6 leading-relaxed">
          This will permanently erase all solved puzzle chambers, unlocked ancient mechanisms, and recovered artifact fragments. Are you sure you wish to restart your journey from the beginning?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playCancel(soundEnabled);
              onClose();
            }}
            className="px-4 py-2 border-2 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-pixel text-xs transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 border-2 border-red-500 bg-red-700 hover:bg-red-600 text-white font-pixel text-xs flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ERASE ALL
          </button>
        </div>
      </div>
    </div>
  );
};
