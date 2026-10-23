import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS } from '../data/gameData';
import { IndiaPixelIcon, JapanPixelIcon, EgyptPixelIcon, FragmentPixelBadge } from './PixelArtwork';
import { InventoryModal } from './InventoryModal';
import { HowToPlayModal } from './HowToPlayModal';
import { PuzzleInfo } from '../types/game';
import { 
  ArrowLeft, 
  KeyRound, 
  Cog, 
  Lock, 
  Unlock, 
  Sparkles, 
  Backpack, 
  HelpCircle, 
  Volume2, 
  VolumeX,
  X,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const CivHub: React.FC = () => {
  const { 
    state, 
    returnToWorldMap, 
    toggleSound, 
    solvePuzzle, 
    unlockMechanism 
  } = useGame();

  const [inspectingPuzzle, setInspectingPuzzle] = useState<PuzzleInfo | null>(null);
  const [inspectingMechanism, setInspectingMechanism] = useState<boolean>(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const civId = state.selectedCiv || 'india';
  const civ = CIVILIZATIONS[civId];

  const puzzle1 = civ.puzzles[0];
  const puzzle2 = civ.puzzles[1];
  const mechanism = civ.mechanism;

  const isPuzzle1Solved = state.solvedPuzzles[puzzle1.id];
  const isPuzzle2Solved = state.solvedPuzzles[puzzle2.id];
  const isMechanismUnlocked = state.unlockedMechanisms[mechanism.id];
  const isFragmentRecovered = state.recoveredFragments[civ.fragmentId];

  const canUnlockMechanism = isPuzzle1Solved && isPuzzle2Solved;

  const renderCivIcon = () => {
    switch (civId) {
      case 'india':
        return <IndiaPixelIcon className="w-16 h-16" />;
      case 'japan':
        return <JapanPixelIcon className="w-16 h-16" />;
      case 'egypt':
        return <EgyptPixelIcon className="w-16 h-16" />;
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b ${civ.bgGradient} text-zinc-100 select-none overflow-x-hidden`}>
      {/* Background ambient pixel grid */}
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Top Header & Navigation */}
      <header className="relative z-10 w-full flex flex-wrap items-center justify-between gap-3 border-b-2 border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={returnToWorldMap}
            className="pixel-btn px-3 py-1.5 flex items-center gap-2 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-pixel text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>WORLD MAP</span>
          </button>

          <div>
            <h1 className="font-pixel text-xs md:text-sm text-amber-400">
              {civ.name.toUpperCase()}
            </h1>
            <div className="text-[10px] text-zinc-400 font-silkscreen">
              {civ.era} · {civ.region}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Inventory */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowInventory(true);
            }}
            className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-amber-600/80 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-pixel text-xs"
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>CODEX</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`pixel-btn px-2.5 py-1.5 border-2 text-xs font-pixel transition-colors ${
              state.soundEnabled
                ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
          >
            {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Help */}
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHowToPlay(true);
            }}
            className="pixel-btn p-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hub Chamber View */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto py-6">
        {/* Civilization Hero Banner */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            {renderCivIcon()}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-pixel text-amber-400 mb-2 drop-shadow-[0_2px_0_#000]">
            {civ.name}
          </h2>
          <p className="text-xs md:text-sm text-zinc-300 font-silkscreen max-w-xl mx-auto">
            {civ.description}
          </p>
        </div>

        {/* The 3 Portals / Chambers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chamber 1 */}
          <div
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setInspectingPuzzle(puzzle1);
            }}
            className={`pixel-btn p-5 border-4 cursor-pointer flex flex-col justify-between transition-all ${
              isPuzzle1Solved
                ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                : 'border-zinc-700 bg-zinc-900/90 hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <span className="font-pixel text-[10px] text-zinc-400">CHAMBER I</span>
                {isPuzzle1Solved ? (
                  <span className="flex items-center gap-1 font-pixel text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SOLVED
                  </span>
                ) : (
                  <span className="font-pixel text-[10px] text-amber-400 flex items-center gap-1">
                    <KeyRound className="w-3 h-3" />
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="font-pixel text-xs md:text-sm text-zinc-100 mb-2">
                {puzzle1.name}
              </h3>
              <p className="font-silkscreen text-xs text-zinc-400 mb-4 line-clamp-2">
                {puzzle1.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-silkscreen">
              <span className="text-zinc-400">Relic:</span>
              <span className="text-amber-300 flex items-center gap-1.5 font-pixel text-[11px]">
                <span>{puzzle1.reward.icon}</span>
                <span>{isPuzzle1Solved ? puzzle1.reward.name : 'Unknown'}</span>
              </span>
            </div>
          </div>

          {/* Chamber 2 */}
          <div
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setInspectingPuzzle(puzzle2);
            }}
            className={`pixel-btn p-5 border-4 cursor-pointer flex flex-col justify-between transition-all ${
              isPuzzle2Solved
                ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                : 'border-zinc-700 bg-zinc-900/90 hover:border-amber-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <span className="font-pixel text-[10px] text-zinc-400">CHAMBER II</span>
                {isPuzzle2Solved ? (
                  <span className="flex items-center gap-1 font-pixel text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SOLVED
                  </span>
                ) : (
                  <span className="font-pixel text-[10px] text-amber-400 flex items-center gap-1">
                    <KeyRound className="w-3 h-3" />
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="font-pixel text-xs md:text-sm text-zinc-100 mb-2">
                {puzzle2.name}
              </h3>
              <p className="font-silkscreen text-xs text-zinc-400 mb-4 line-clamp-2">
                {puzzle2.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-silkscreen">
              <span className="text-zinc-400">Relic:</span>
              <span className="text-amber-300 flex items-center gap-1.5 font-pixel text-[11px]">
                <span>{puzzle2.reward.icon}</span>
                <span>{isPuzzle2Solved ? puzzle2.reward.name : 'Unknown'}</span>
              </span>
            </div>
          </div>

          {/* Ancient Mechanism Vault */}
          <div
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setInspectingMechanism(true);
            }}
            className={`pixel-btn p-5 border-4 cursor-pointer flex flex-col justify-between transition-all ${
              isMechanismUnlocked
                ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : canUnlockMechanism
                ? 'border-yellow-500 bg-yellow-950/20 animate-pulse'
                : 'border-zinc-800 bg-zinc-950/90 opacity-80 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                <span className="font-pixel text-[10px] text-zinc-400">GRAND MECHANISM</span>
                {isMechanismUnlocked ? (
                  <span className="flex items-center gap-1 font-pixel text-[10px] text-amber-300">
                    <Unlock className="w-3.5 h-3.5" />
                    RELEASED
                  </span>
                ) : canUnlockMechanism ? (
                  <span className="flex items-center gap-1 font-pixel text-[10px] text-yellow-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    READY
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-pixel text-[10px] text-zinc-500">
                    <Lock className="w-3 h-3" />
                    LOCKED
                  </span>
                )}
              </div>
              <h3 className="font-pixel text-xs md:text-sm text-zinc-100 mb-2 flex items-center gap-2">
                <Cog className="w-4 h-4 text-amber-500" />
                <span>{mechanism.name}</span>
              </h3>
              <p className="font-silkscreen text-xs text-zinc-400 mb-4 line-clamp-2">
                {mechanism.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-silkscreen">
              <span className="text-zinc-400">Vault Fragment:</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-pixel text-[10px]">
                  {isFragmentRecovered ? 'RECOVERED' : 'SEALED'}
                </span>
                <FragmentPixelBadge
                  fragmentId={civ.fragmentId}
                  collected={isFragmentRecovered}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Hub Summary */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto border-t-2 border-zinc-800 pt-4 flex items-center justify-between text-xs font-silkscreen text-zinc-400">
        <div className="flex items-center gap-2">
          <span>CIVILIZATION PROGRESS:</span>
          <span className="text-amber-400 font-pixel font-bold">
            {(isPuzzle1Solved ? 1 : 0) + (isPuzzle2Solved ? 1 : 0)}/2 PUZZLES
          </span>
          <span>·</span>
          <span className={isFragmentRecovered ? 'text-emerald-400 font-pixel' : 'text-zinc-500 font-pixel'}>
            {isFragmentRecovered ? 'FRAGMENT RECOVERED' : 'FRAGMENT SEALED'}
          </span>
        </div>

        <button
          onClick={returnToWorldMap}
          className="pixel-btn px-4 py-2 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-pixel text-[10px]"
        >
          RETURN TO WORLD MAP
        </button>
      </footer>

      {/* Puzzle Chamber Modal (Inspect & Solve Preview) */}
      {inspectingPuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-zinc-900 border-4 border-amber-600 shadow-[0_0_24px_rgba(217,119,6,0.4)] p-6 text-zinc-100">
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-pixel text-xs">
                <KeyRound className="w-4 h-4" />
                <span>{inspectingPuzzle.chamberName.toUpperCase()}</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playCancel(state.soundEnabled);
                  setInspectingPuzzle(null);
                }}
                className="p-1 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-pixel text-zinc-100 mb-2">
              {inspectingPuzzle.name}
            </h3>
            <p className="text-xs text-zinc-300 font-silkscreen mb-4 leading-relaxed">
              {inspectingPuzzle.description}
            </p>

            <div className="p-3 bg-zinc-950 border border-amber-800/60 mb-4">
              <div className="text-[10px] text-amber-500 font-pixel mb-1">ANCIENT INSCRIPTION RIDDLE:</div>
              <p className="font-silkscreen text-xs text-amber-200 italic">
                "{inspectingPuzzle.riddle}"
              </p>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 mb-6">
              <div className="text-[10px] text-zinc-400 font-pixel mb-1.5">CHAMBER REWARD:</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{inspectingPuzzle.reward.icon}</span>
                <div>
                  <div className="font-pixel text-xs text-amber-400">{inspectingPuzzle.reward.name}</div>
                  <div className="text-[10px] text-zinc-400 font-silkscreen">{inspectingPuzzle.reward.description}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  soundManager.playCancel(state.soundEnabled);
                  setInspectingPuzzle(null);
                }}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 font-pixel text-xs text-zinc-300"
              >
                BACK
              </button>

              {/* Direct interactive solve action */}
              {state.solvedPuzzles[inspectingPuzzle.id] ? (
                <div className="font-pixel text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CHAMBER CLEARED</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    solvePuzzle(inspectingPuzzle.id);
                    setInspectingPuzzle(null);
                  }}
                  className="pixel-btn px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-amber-300"
                >
                  SOLVE ANCIENT RIDDLE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mechanism Vault Modal */}
      {inspectingMechanism && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-zinc-900 border-4 border-amber-600 shadow-[0_0_24px_rgba(217,119,6,0.4)] p-6 text-zinc-100">
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-pixel text-xs">
                <Cog className="w-4 h-4" />
                <span>GRAND MECHANISM VAULT</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playCancel(state.soundEnabled);
                  setInspectingMechanism(false);
                }}
                className="p-1 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-pixel text-zinc-100 mb-2">
              {mechanism.name}
            </h3>
            <p className="text-xs text-zinc-300 font-silkscreen mb-4 leading-relaxed">
              {mechanism.description}
            </p>

            <div className="p-3 bg-zinc-950 border border-zinc-800 mb-4">
              <div className="text-[10px] text-zinc-400 font-pixel mb-2">KEY RECEPTACLE REQUIREMENTS:</div>
              <div className="space-y-2 font-silkscreen text-xs">
                <div className="flex items-center justify-between">
                  <span>1. {puzzle1.reward.name} ({puzzle1.name})</span>
                  <span className={isPuzzle1Solved ? 'text-emerald-400 font-pixel text-[10px]' : 'text-red-400 font-pixel text-[10px]'}>
                    {isPuzzle1Solved ? 'SLOTTED' : 'MISSING'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>2. {puzzle2.reward.name} ({puzzle2.name})</span>
                  <span className={isPuzzle2Solved ? 'text-emerald-400 font-pixel text-[10px]' : 'text-red-400 font-pixel text-[10px]'}>
                    {isPuzzle2Solved ? 'SLOTTED' : 'MISSING'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 border border-amber-800/80 mb-6 flex items-center gap-3">
              <FragmentPixelBadge fragmentId={civ.fragmentId} collected={isFragmentRecovered} size="md" />
              <div>
                <div className="font-pixel text-xs text-amber-300">{mechanism.fragmentReward.name}</div>
                <div className="font-silkscreen text-[11px] text-zinc-400">{mechanism.fragmentReward.description}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  soundManager.playCancel(state.soundEnabled);
                  setInspectingMechanism(false);
                }}
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 font-pixel text-xs text-zinc-300"
              >
                BACK
              </button>

              {isMechanismUnlocked ? (
                <div className="font-pixel text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VAULT OPENED</span>
                </div>
              ) : canUnlockMechanism ? (
                <button
                  onClick={() => {
                    unlockMechanism(mechanism.id);
                    setInspectingMechanism(false);
                  }}
                  className="pixel-btn px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-amber-300"
                >
                  ACTIVATE MECHANISM & CLAIM FRAGMENT
                </button>
              ) : (
                <div className="text-[10px] font-pixel text-zinc-500">
                  SOLVE BOTH PUZZLES FIRST
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Codex & Rules modals */}
      <InventoryModal isOpen={showInventory} onClose={() => setShowInventory(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} soundEnabled={state.soundEnabled} />
    </div>
  );
};
