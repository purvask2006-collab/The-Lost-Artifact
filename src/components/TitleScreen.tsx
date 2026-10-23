import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { AncientArtifactLockup } from './PixelArtwork';
import { HowToPlayModal } from './HowToPlayModal';
import { ResetConfirmModal } from './ResetConfirmModal';
import { Volume2, VolumeX, Monitor, RotateCcw, HelpCircle, Play, BookmarkCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const TitleScreen: React.FC = () => {
  const { 
    state, 
    hasSavedGame, 
    startAdventure, 
    continueAdventure, 
    toggleSound, 
    toggleCrtFilter, 
    resetGame 
  } = useGame();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHowToPlay || showResetConfirm) {
        if (e.key === 'Escape') {
          setShowHowToPlay(false);
          setShowResetConfirm(false);
        }
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasSavedGame) {
          continueAdventure();
        } else {
          startAdventure();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSavedGame, startAdventure, continueAdventure, showHowToPlay, showResetConfirm]);

  const handleHover = (id: string) => {
    setHoveredButton(id);
    soundManager.playHover(state.soundEnabled);
  };

  // Count progress
  const fragmentsRecoveredCount = Object.values(state.recoveredFragments).filter(Boolean).length;
  const puzzlesSolvedCount = Object.values(state.solvedPuzzles).filter(Boolean).length;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 md:p-8 overflow-hidden bg-zinc-950 select-none">
      {/* Decorative Pixel Stars / Dust in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/6 w-1 h-1 bg-amber-300" />
        <div className="absolute top-24 left-3/4 w-1.5 h-1.5 bg-yellow-200" />
        <div className="absolute top-40 left-1/3 w-1 h-1 bg-sky-300" />
        <div className="absolute top-1/2 left-1/8 w-2 h-2 bg-amber-400 opacity-60" />
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-emerald-300" />
        <div className="absolute bottom-24 left-1/2 w-1.5 h-1.5 bg-amber-200" />
        <div className="absolute top-16 right-1/3 w-1 h-1 bg-white" />
      </div>

      {/* Top Utility Bar (Sound, CRT Filter, Help, Reset) */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => handleHover('sound')}
            className={`pixel-btn px-3 py-1.5 flex items-center gap-2 border-2 text-xs font-pixel transition-colors ${
              state.soundEnabled
                ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle Sound Effects"
          >
            {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SOUND {state.soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* CRT Filter Toggle */}
          <button
            onClick={toggleCrtFilter}
            onMouseEnter={() => handleHover('crt')}
            className={`pixel-btn hidden sm:flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-pixel transition-colors ${
              state.crtFilterEnabled
                ? 'border-zinc-600 bg-zinc-900 text-zinc-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-600'
            }`}
            title="Toggle CRT Scanlines"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>CRT {state.crtFilterEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* How to play */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHowToPlay(true);
            }}
            onMouseEnter={() => handleHover('help')}
            className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-amber-600/70 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-pixel text-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HOW TO PLAY</span>
          </button>

          {/* Reset progress */}
          {hasSavedGame && (
            <button
              onClick={() => {
                soundManager.playClick(state.soundEnabled);
                setShowResetConfirm(true);
              }}
              onMouseEnter={() => handleHover('reset')}
              className="pixel-btn p-1.5 border-2 border-zinc-800 hover:border-red-700 bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
              title="Reset Saved Expedition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Title Centerpiece */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-center my-auto z-10 text-center py-6">
        {/* Ancient Artifact Visual Pedestal */}
        <div className="relative mb-2">
          <AncientArtifactLockup className="w-48 h-48 md:w-60 md:h-60 drop-shadow-[0_0_20px_rgba(217,119,6,0.25)]" />
        </div>

        {/* Game Title */}
        <div className="space-y-3 mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pixel tracking-widest text-amber-400 drop-shadow-[0_4px_0_#78350f]">
            THE LOST ARTIFACT
          </h1>
          <p className="font-silkscreen text-xs sm:text-sm md:text-base text-zinc-400 tracking-wider max-w-lg mx-auto">
            "Three civilizations. Three fragments. One forgotten truth."
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3 font-pixel text-xs md:text-sm">
          {/* START ADVENTURE */}
          <button
            onClick={startAdventure}
            onMouseEnter={() => handleHover('start')}
            className="pixel-btn w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border-4 border-amber-300 shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START ADVENTURE</span>
          </button>

          {/* CONTINUE (active only if saved game exists) */}
          {hasSavedGame ? (
            <button
              onClick={continueAdventure}
              onMouseEnter={() => handleHover('continue')}
              className="pixel-btn w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-4 border-zinc-700 hover:border-amber-600/80 shadow-[0_4px_0_#18181b] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-colors"
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>CONTINUE EXPEDITION</span>
            </button>
          ) : (
            <div className="py-2.5 px-4 bg-zinc-900/50 text-zinc-600 border-2 border-zinc-800/80 text-xs flex items-center justify-center gap-2 cursor-not-allowed">
              <span>CONTINUE (NO SAVE DATA)</span>
            </div>
          )}
        </div>

        {/* Saved game preview banner if exists */}
        {hasSavedGame && (
          <div className="mt-4 px-4 py-1.5 bg-zinc-900/80 border border-zinc-800 text-[10px] md:text-xs text-zinc-400 flex items-center gap-3 font-silkscreen">
            <span className="text-amber-400">☸ {fragmentsRecoveredCount}/3 Fragments</span>
            <span>·</span>
            <span className="text-zinc-300">⚔ {puzzlesSolvedCount}/6 Puzzles</span>
            <span>·</span>
            <span className="text-zinc-500">Auto-saved</span>
          </div>
        )}
      </main>

      {/* Footer Controls & Hints */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-[10px] md:text-xs text-zinc-500 font-silkscreen border-t border-zinc-800/80 pt-4 z-10 gap-2">
        <div className="flex items-center gap-2">
          <span>INDIA</span>
          <span aria-hidden="true">·</span>
          <span>JAPAN</span>
          <span aria-hidden="true">·</span>
          <span>EGYPT</span>
        </div>
        <div className="text-zinc-400">
          Press <kbd className="px-1.5 py-0.5 bg-zinc-800 text-amber-300 border border-zinc-700 font-pixel text-[9px]">ENTER</kbd> or click to embark
        </div>
      </footer>

      {/* Modals */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        soundEnabled={state.soundEnabled}
      />

      <ResetConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetGame}
        soundEnabled={state.soundEnabled}
      />
    </div>
  );
};
