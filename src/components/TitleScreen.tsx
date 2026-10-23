import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { AncientArtifactLockup } from './PixelArtwork';
import { HowToPlayModal } from './HowToPlayModal';
import { ResetConfirmModal } from './ResetConfirmModal';
import { Volume2, VolumeX, Music, RotateCcw, HelpCircle, Play, BookmarkCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const TitleScreen: React.FC = () => {
  const { 
    state, 
    hasSavedGame, 
    startAdventure, 
    continueAdventure, 
    toggleSound, 
    toggleMusic, 
    resetGame 
  } = useGame();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const solvedCount = Object.values(state.solvedPuzzles).filter(Boolean).length;
  const gemsCount = Object.values(state.collectedGemstones).filter(Boolean).length;
  const fragsCount = Object.values(state.recoveredFragments).filter(Boolean).length;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 md:p-8 overflow-hidden bg-zinc-950 select-none">
      {/* 1. Atmospheric Ambient Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid and star dust */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Utility Bar (Audio, Music, Help, Reset) */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`pixel-btn px-3 py-1.5 flex items-center gap-2 border-2 text-xs font-pixel transition-colors ${
              state.soundEnabled
                ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle Sound Effects"
          >
            {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SFX {state.soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`pixel-btn px-3 py-1.5 flex items-center gap-2 border-2 text-xs font-pixel transition-colors ${
              state.musicEnabled
                ? 'border-sky-500 bg-sky-950/60 text-sky-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle Background Music"
          >
            <Music className="w-3.5 h-3.5" />
            <span>MUSIC {state.musicEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* How to play */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHowToPlay(true);
            }}
            className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-amber-600/70 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-pixel text-xs transition-colors"
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
              className="pixel-btn p-1.5 border-2 border-zinc-800 hover:border-red-700 bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
              title="Reset Saved Expedition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Title Centerpiece */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-center my-auto z-10 text-center py-4">
        {/* Ancient Artifact Visual Pedestal with Three Structures Silhouette */}
        <div className="relative mb-3 flex flex-col items-center">
          <AncientArtifactLockup className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 drop-shadow-[0_0_30px_rgba(217,119,6,0.3)]" />
        </div>

        {/* Game Title */}
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pixel tracking-widest text-amber-400 drop-shadow-[0_4px_0_#78350f]">
            THE LOST ARTIFACT
          </h1>
          <p className="font-silkscreen text-xs sm:text-sm text-zinc-300 tracking-wider max-w-xl mx-auto leading-relaxed">
            Three Guardians. Twelve Gemstone Keys. One Forgotten Ancient Truth.
          </p>
        </div>

        {/* Environmental Relics of the 3 Guardians (Foreground Plinth) */}
        <div className="w-full max-w-2xl mb-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-zinc-900/80 border-2 border-zinc-800 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
          {/* Amara's Objects */}
          <div className="flex items-center gap-2.5 text-left border-b sm:border-b-0 sm:border-r border-zinc-800 pb-2 sm:pb-0 sm:pr-2">
            <span className="text-xl">☸</span>
            <div>
              <div className="font-pixel text-[9px] text-amber-400">AMARA (INDIA)</div>
              <div className="font-silkscreen text-[10px] text-zinc-400">Measuring Cord & Copper Bowl</div>
            </div>
          </div>

          {/* Yuki's Objects */}
          <div className="flex items-center gap-2.5 text-left border-b sm:border-b-0 sm:border-r border-zinc-800 pb-2 sm:pb-0 sm:pr-2">
            <span className="text-xl">⛩</span>
            <div>
              <div className="font-pixel text-[9px] text-sky-400">YUKI (JAPAN)</div>
              <div className="font-silkscreen text-[10px] text-zinc-400">Silver Bell & Gohei Wand</div>
            </div>
          </div>

          {/* Kiya's Objects */}
          <div className="flex items-center gap-2.5 text-left">
            <span className="text-xl">𓁹</span>
            <div>
              <div className="font-pixel text-[9px] text-yellow-400">KIYA (EGYPT)</div>
              <div className="font-silkscreen text-[10px] text-zinc-400">Wax Tablet & Sighting Tool</div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3 font-pixel text-xs md:text-sm">
          {/* START ADVENTURE */}
          <button
            onClick={startAdventure}
            className="pixel-btn w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border-4 border-amber-300 shadow-[0_4px_0_#92400e] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START ADVENTURE</span>
          </button>

          {/* CONTINUE EXPEDITION */}
          {hasSavedGame ? (
            <button
              onClick={continueAdventure}
              className="pixel-btn w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-4 border-zinc-700 hover:border-amber-600/80 shadow-[0_4px_0_#18181b] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
            <span className="text-amber-400">💎 {gemsCount}/12 Gemstones</span>
            <span>·</span>
            <span className="text-sky-300">⚔ {solvedCount}/12 Puzzles</span>
            <span>·</span>
            <span className="text-yellow-400">✦ {fragsCount}/3 Fragments</span>
          </div>
        )}
      </main>

      {/* Footer Controls & Hints */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-[10px] md:text-xs text-zinc-500 font-silkscreen border-t border-zinc-800/80 pt-4 z-10 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">INDIA: CHAKRA</span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-400">JAPAN: SHRINE</span>
          <span aria-hidden="true">·</span>
          <span className="text-yellow-400">EGYPT: PYRAMID</span>
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
