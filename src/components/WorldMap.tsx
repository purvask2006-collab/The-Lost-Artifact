import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PixelOverworldMap } from './PixelOverworldMap';
import { HowToPlayModal } from './HowToPlayModal';
import { ResetConfirmModal } from './ResetConfirmModal';
import { InventoryModal } from './InventoryModal';
import { FragmentPixelBadge, GuardianEnvironmentalDisplay } from './PixelArtwork';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Music,
  HelpCircle, 
  Backpack, 
  Sparkles, 
  RotateCcw,
  Lock,
  CheckCircle2,
  Play
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const WorldMap: React.FC = () => {
  const { 
    state, 
    returnToTitle, 
    toggleSound, 
    toggleMusic, 
    resetGame,
    goToScreen,
    selectCivilization,
  } = useGame();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const fragmentsCount = Object.values(state.recoveredFragments).filter(Boolean).length;
  const gemsCount = Object.values(state.collectedGemstones).filter(Boolean).length;
  const puzzlesCount = Object.values(state.solvedPuzzles).filter(Boolean).length;

  const isIndiaCompleted = Boolean(state.recoveredFragments.fragment_solar_wheel);
  const isJapanUnlocked = Boolean(state.unlockedCivs.japan || state.recoveredFragments.fragment_solar_wheel);
  const isJapanCompleted = Boolean(state.recoveredFragments.fragment_celestial_mirror);
  const isEgyptUnlocked = Boolean(state.unlockedCivs.egypt || state.recoveredFragments.fragment_celestial_mirror);
  const isEgyptCompleted = Boolean(state.recoveredFragments.fragment_eternal_eye);

  const handleSelectCiv = (civId: 'india' | 'japan' | 'egypt') => {
    if (civId === 'japan' && !isJapanUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    if (civId === 'egypt' && !isEgyptUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    soundManager.playTravel(state.soundEnabled);
    selectCivilization(civId);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-3 md:p-5 bg-zinc-950 text-zinc-100 select-none overflow-x-hidden">
      {/* 1. Top Bar Navigation */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 border-b-2 border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={returnToTitle}
            className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-pixel text-xs transition-colors cursor-pointer"
            title="Return to Title"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>TITLE</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-xl text-amber-400">☸</span>
            <div>
              <h1 className="font-pixel text-xs md:text-sm text-amber-400 tracking-wider">
                THE LOST ARTIFACT
              </h1>
              <div className="text-[10px] text-zinc-400 font-silkscreen hidden sm:block">
                EXPLORE THREE REALMS · RECOVER 12 GEMSTONE KEYS
              </div>
            </div>
          </div>
        </div>

        {/* 3 Fragment Silhouettes at Top */}
        <div className="flex items-center gap-3 px-3 py-1 bg-zinc-900 border-2 border-zinc-800">
          <span className="font-pixel text-[9px] text-zinc-400 hidden md:inline">FRAGMENTS:</span>
          <div className="flex items-center gap-2">
            <FragmentPixelBadge fragmentId="fragment_solar_wheel" collected={state.recoveredFragments.fragment_solar_wheel} size="sm" />
            <FragmentPixelBadge fragmentId="fragment_celestial_mirror" collected={state.recoveredFragments.fragment_celestial_mirror} size="sm" />
            <FragmentPixelBadge fragmentId="fragment_eternal_eye" collected={state.recoveredFragments.fragment_eternal_eye} size="sm" />
          </div>
          <span className="font-pixel text-xs text-amber-400 ml-1">
            {fragmentsCount}/3
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Codex Gemstones Inventory */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowInventory(true);
            }}
            className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-amber-600 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-pixel text-xs transition-colors cursor-pointer"
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>GEMSTONES ({gemsCount}/12)</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`pixel-btn p-1.5 border-2 text-xs font-pixel transition-colors cursor-pointer ${
              state.soundEnabled
                ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle SFX"
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`pixel-btn p-1.5 border-2 text-xs font-pixel transition-colors cursor-pointer ${
              state.musicEnabled
                ? 'border-sky-500 bg-sky-950/60 text-sky-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle Music"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHowToPlay(true);
            }}
            className="pixel-btn p-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset progress */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowResetConfirm(true);
            }}
            className="pixel-btn p-1.5 border-2 border-zinc-800 hover:border-red-700 bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 cursor-pointer"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Interactive Overworld Canvas */}
      <main className="relative z-10 w-full max-w-6xl mx-auto my-auto py-2">
        <PixelOverworldMap onSelectCivilization={handleSelectCiv} />
      </main>

      {/* 3. Bottom Civilization Quick Travel & Status Strip */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto border-t-2 border-zinc-800 pt-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-silkscreen">
        {/* Civilizations Navigation Cards */}
        <div className="flex flex-wrap items-center gap-3">
          {/* India */}
          <button
            onClick={() => handleSelectCiv('india')}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-2 border-amber-500/80 hover:bg-amber-950/40 text-amber-300 pixel-btn cursor-pointer"
          >
            <span className="font-pixel text-[11px]">☸ INDIA</span>
            <span className="text-[10px]">
              {isIndiaCompleted ? '★ SOLVED' : '✦ AMARA'}
            </span>
          </button>

          {/* Japan */}
          <button
            onClick={() => handleSelectCiv('japan')}
            className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-colors ${
              isJapanUnlocked
                ? 'bg-zinc-900 border-sky-500/80 hover:bg-sky-950/40 text-sky-300 pixel-btn cursor-pointer'
                : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span className="font-pixel text-[11px]">⛩ JAPAN</span>
            {isJapanUnlocked ? (
              <span className="text-[10px]">
                {isJapanCompleted ? '★ SOLVED' : '✦ YUKI'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px]">
                <Lock className="w-3 h-3" />
                LOCKED
              </span>
            )}
          </button>

          {/* Egypt */}
          <button
            onClick={() => handleSelectCiv('egypt')}
            className={`flex items-center gap-2 px-3 py-1.5 border-2 transition-colors ${
              isEgyptUnlocked
                ? 'bg-zinc-900 border-yellow-500/80 hover:bg-yellow-950/40 text-yellow-300 pixel-btn cursor-pointer'
                : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <span className="font-pixel text-[11px]">𓁹 EGYPT</span>
            {isEgyptUnlocked ? (
              <span className="text-[10px]">
                {isEgyptCompleted ? '★ SOLVED' : '✦ KIYA'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px]">
                <Lock className="w-3 h-3" />
                LOCKED
              </span>
            )}
          </button>
        </div>

        {/* Global Assembly Trigger or Progress Count */}
        {fragmentsCount === 3 ? (
          <button
            onClick={() => goToScreen('ASSEMBLY')}
            className="pixel-btn px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-xs border-2 border-amber-300 font-bold animate-pulse flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>ENTER FINAL CHAMBER (UNITE ARTIFACT)</span>
          </button>
        ) : (
          <div className="text-zinc-400 text-xs">
            <span>Puzzles Solved: <strong className="text-zinc-200">{puzzlesCount}/12</strong></span>
            <span className="mx-2">·</span>
            <span>Gemstones: <strong className="text-amber-400">{gemsCount}/12</strong></span>
          </div>
        )}
      </footer>

      {/* Auxiliary Modals */}
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

      <InventoryModal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
      />
    </div>
  );
};
