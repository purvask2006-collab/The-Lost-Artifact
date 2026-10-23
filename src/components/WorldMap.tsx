import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PixelOverworldMap } from './PixelOverworldMap';
import { LocationModal, LocationTarget } from './LocationModal';
import { HowToPlayModal } from './HowToPlayModal';
import { ResetConfirmModal } from './ResetConfirmModal';
import { InventoryModal } from './InventoryModal';
import { FragmentPixelBadge } from './PixelArtwork';
import { CivilizationId, PuzzleId, MechanismId } from '../types/game';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Monitor, 
  HelpCircle, 
  Backpack, 
  Compass, 
  Sparkles, 
  RotateCcw,
  Lock,
  Unlock
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const WorldMap: React.FC = () => {
  const { 
    state, 
    returnToTitle, 
    toggleSound, 
    toggleCrtFilter, 
    resetGame,
    goToScreen,
    solvePuzzle,
    unlockMechanism,
    selectCivilization,
    openChamber,
    openMechanism
  } = useGame();

  const [activeLocationId, setActiveLocationId] = useState<string>('india_puzzle_1');
  const [selectedLocation, setSelectedLocation] = useState<LocationTarget | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const fragmentsCount = Object.values(state.recoveredFragments).filter(Boolean).length;
  const puzzlesCount = Object.values(state.solvedPuzzles).filter(Boolean).length;
  const mechanismsCount = Object.values(state.unlockedMechanisms).filter(Boolean).length;

  const isJapanUnlocked = Boolean(state.unlockedMechanisms.india_mechanism);
  const isEgyptUnlocked = Boolean(state.unlockedMechanisms.japan_mechanism);

  const handleSelectLocation = (target: LocationTarget) => {
    setActiveLocationId(target.id);
    setSelectedLocation(target);
  };

  const handleSolvePuzzle = (puzzleId: PuzzleId) => {
    solvePuzzle(puzzleId);
    // Refresh modal with completed state
    if (selectedLocation) {
      setSelectedLocation({
        ...selectedLocation,
        status: 'completed',
      });
    }
  };

  const handleUnlockMechanism = (mechanismId: MechanismId) => {
    unlockMechanism(mechanismId);
    // Refresh modal with completed state
    if (selectedLocation) {
      setSelectedLocation({
        ...selectedLocation,
        status: 'completed',
      });
    }
  };

  const handleEnterLocation = (civId: CivilizationId, type: 'puzzle' | 'mechanism', id: PuzzleId | MechanismId) => {
    setSelectedLocation(null);
    selectCivilization(civId);
    if (type === 'mechanism') {
      openMechanism(id as MechanismId);
    } else {
      openChamber(id as PuzzleId);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-3 md:p-5 bg-zinc-950 text-zinc-100 select-none overflow-x-hidden">
      {/* 1. Top Bar Navigation (<15% height, clean, single row) */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between gap-2 border-b-2 border-zinc-800 pb-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={returnToTitle}
            className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-pixel text-[11px] transition-colors"
            title="Return to Title"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>TITLE</span>
          </button>

          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500 animate-spin [animation-duration:20s]" />
            <h1 className="font-pixel text-xs md:text-sm text-amber-400 tracking-wider">
              OVERWORLD MAP
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Inventory / Codex */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowInventory(true);
            }}
            className="pixel-btn px-2.5 py-1.5 flex items-center gap-1.5 border-2 border-amber-600/80 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-pixel text-[11px] transition-colors"
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>CODEX</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`pixel-btn px-2.5 py-1.5 border-2 text-[11px] font-pixel transition-colors ${
              state.soundEnabled
                ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
            title="Toggle Sound Effects"
          >
            {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* CRT Filter Toggle */}
          <button
            onClick={toggleCrtFilter}
            className={`pixel-btn hidden sm:flex items-center px-2 py-1.5 border-2 text-[11px] font-pixel transition-colors ${
              state.crtFilterEnabled
                ? 'border-zinc-600 bg-zinc-900 text-zinc-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-600'
            }`}
            title="Toggle CRT Scanlines"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>

          {/* How to play */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHowToPlay(true);
            }}
            className="pixel-btn p-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
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
            className="pixel-btn p-1.5 border-2 border-zinc-800 hover:border-red-700 bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Interactive Pixel Overworld Map Canvas (Unobstructed View) */}
      <main className="relative z-10 w-full max-w-6xl mx-auto my-auto py-2">
        <PixelOverworldMap
          onSelectLocation={handleSelectLocation}
          activeLocationId={activeLocationId}
        />
      </main>

      {/* 3. Bottom Low-Occlusion Status & Civilization Progression Tracker */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto border-t-2 border-zinc-800 pt-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-silkscreen">
        {/* Civilizations Progression Strip */}
        <div className="flex flex-wrap items-center gap-3">
          {/* India Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-amber-600/80 text-amber-300">
            <span className="font-pixel text-[10px]">INDIA</span>
            <span className="text-[10px]">
              {state.unlockedMechanisms.india_mechanism ? '✓ UNLOCKED' : '✦ IN PROGRESS'}
            </span>
          </div>

          {/* Japan Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors ${
            isJapanUnlocked
              ? 'bg-zinc-900 border-sky-500/80 text-sky-300'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500'
          }`}>
            <span className="font-pixel text-[10px]">JAPAN</span>
            {isJapanUnlocked ? (
              <span className="text-[10px]">
                {state.unlockedMechanisms.japan_mechanism ? '✓ UNLOCKED' : '✦ IN PROGRESS'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px]">
                <Lock className="w-3 h-3" />
                SEALED
              </span>
            )}
          </div>

          {/* Egypt Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors ${
            isEgyptUnlocked
              ? 'bg-zinc-900 border-yellow-500/80 text-yellow-300'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500'
          }`}>
            <span className="font-pixel text-[10px]">EGYPT</span>
            {isEgyptUnlocked ? (
              <span className="text-[10px]">
                {state.unlockedMechanisms.egypt_mechanism ? '✓ UNLOCKED' : '✦ IN PROGRESS'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px]">
                <Lock className="w-3 h-3" />
                SEALED
              </span>
            )}
          </div>
        </div>

        {/* Fragment Keystones Counter */}
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-zinc-400">KEYSTONES:</span>
          <div className="flex items-center gap-1.5">
            <FragmentPixelBadge fragmentId="fragment_solar_wheel" collected={state.recoveredFragments.fragment_solar_wheel} size="sm" />
            <FragmentPixelBadge fragmentId="fragment_celestial_mirror" collected={state.recoveredFragments.fragment_celestial_mirror} size="sm" />
            <FragmentPixelBadge fragmentId="fragment_eternal_eye" collected={state.recoveredFragments.fragment_eternal_eye} size="sm" />
          </div>
          <span className="text-amber-400 font-pixel font-bold text-xs ml-1">
            {fragmentsCount}/3
          </span>
        </div>

        {/* Global Assembly Trigger or Progress Summary */}
        {fragmentsCount === 3 ? (
          <button
            onClick={() => goToScreen('ASSEMBLY')}
            className="pixel-btn px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-xs border-2 border-amber-300 font-bold animate-pulse flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNITE ARTIFACT</span>
          </button>
        ) : (
          <div className="text-[11px] text-zinc-400">
            <span>Puzzles: <strong className="text-zinc-200">{puzzlesCount}/6</strong></span>
            <span className="mx-2">·</span>
            <span>Mechanisms: <strong className="text-zinc-200">{mechanismsCount}/3</strong></span>
          </div>
        )}
      </footer>

      {/* 4. Interactive Location Modal */}
      <LocationModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onSolvePuzzle={handleSolvePuzzle}
        onUnlockMechanism={handleUnlockMechanism}
        onEnterLocation={handleEnterLocation}
        soundEnabled={state.soundEnabled}
      />

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
