import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS } from '../data/gameData';
import { FragmentPixelBadge } from './PixelArtwork';
import { IndianPriestessSprite } from './IndianPriestessSprite';
import { YukiShrineOracle } from './japan/YukiShrineOracle';
import { MisplacedScreenPuzzle } from './japan/MisplacedScreenPuzzle';
import { BellSequencePuzzle } from './japan/BellSequencePuzzle';
import { ShrineOfMemoriesMechanism } from './japan/ShrineOfMemoriesMechanism';
import { KiyaHorizonWatcher } from './egypt/KiyaHorizonWatcher';
import { ScatteredCeilingPuzzle } from './egypt/ScatteredCeilingPuzzle';
import { CrackedBasinPuzzle } from './egypt/CrackedBasinPuzzle';
import { PyramidOfSecretsMechanism } from './egypt/PyramidOfSecretsMechanism';
import { CrackedCourtyardPuzzle } from './india/CrackedCourtyardPuzzle';
import { FiveHearthsPuzzle } from './india/FiveHearthsPuzzle';
import { ChakraOfBalanceMechanism } from './india/ChakraOfBalanceMechanism';
import { InventoryModal } from './InventoryModal';
import { HowToPlayModal } from './HowToPlayModal';
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
  CheckCircle2, 
  Play
} from 'lucide-react';
import { soundManager } from '../utils/audio';

type ActiveChamberView = 'chamber_1' | 'chamber_2' | 'mechanism' | null;

export const CivHub: React.FC = () => {
  const { 
    state, 
    returnToWorldMap, 
    toggleSound, 
    openChamber, 
    openMechanism 
  } = useGame();

  const [activeChamber, setActiveChamber] = useState<ActiveChamberView>(() => {
    if (state.activePuzzleId) {
      return state.activePuzzleId.endsWith('_1') ? 'chamber_1' : 'chamber_2';
    }
    if (state.activeMechanismId) {
      return 'mechanism';
    }
    return null;
  });

  const [showInventory, setShowInventory] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Sync when state active puzzle or mechanism changes
  useEffect(() => {
    if (state.activePuzzleId) {
      setActiveChamber(state.activePuzzleId.endsWith('_1') ? 'chamber_1' : 'chamber_2');
    } else if (state.activeMechanismId) {
      setActiveChamber('mechanism');
    }
  }, [state.activePuzzleId, state.activeMechanismId]);

  const civId = state.selectedCiv || 'india';
  const civ = CIVILIZATIONS[civId];

  const puzzle1 = civ.puzzles[0];
  const puzzle2 = civ.puzzles[1];
  const mechanism = civ.mechanism;

  const isPuzzle1Solved = Boolean(state.solvedPuzzles[puzzle1.id]);
  const isPuzzle2Solved = Boolean(state.solvedPuzzles[puzzle2.id]);
  const isMechanismUnlocked = Boolean(state.unlockedMechanisms[mechanism.id]);
  const isFragmentRecovered = Boolean(state.recoveredFragments[civ.fragmentId]);

  const canUnlockMechanism = isPuzzle1Solved && isPuzzle2Solved;

  const handleOpenChamber1 = () => {
    soundManager.playClick(state.soundEnabled);
    openChamber(puzzle1.id);
    setActiveChamber('chamber_1');
  };

  const handleOpenChamber2 = () => {
    soundManager.playClick(state.soundEnabled);
    openChamber(puzzle2.id);
    setActiveChamber('chamber_2');
  };

  const handleOpenMechanism = () => {
    soundManager.playClick(state.soundEnabled);
    openMechanism(mechanism.id);
    setActiveChamber('mechanism');
  };

  const handleBackToHub = () => {
    soundManager.playCancel(state.soundEnabled);
    setActiveChamber(null);
  };

  // Render Active Sub-Puzzle or Mechanism if selected
  if (activeChamber === 'chamber_1') {
    if (civId === 'india') return <div className="p-4"><CrackedCourtyardPuzzle onBack={handleBackToHub} /></div>;
    if (civId === 'japan') return <div className="p-4"><MisplacedScreenPuzzle onBack={handleBackToHub} /></div>;
    if (civId === 'egypt') return <div className="p-4"><ScatteredCeilingPuzzle onBack={handleBackToHub} /></div>;
  }

  if (activeChamber === 'chamber_2') {
    if (civId === 'india') return <div className="p-4"><FiveHearthsPuzzle onBack={handleBackToHub} /></div>;
    if (civId === 'japan') return <div className="p-4"><BellSequencePuzzle onBack={handleBackToHub} /></div>;
    if (civId === 'egypt') return <div className="p-4"><CrackedBasinPuzzle onBack={handleBackToHub} /></div>;
  }

  if (activeChamber === 'mechanism') {
    if (civId === 'india') return <div className="p-4"><ChakraOfBalanceMechanism onBack={handleBackToHub} /></div>;
    if (civId === 'japan') return <div className="p-4"><ShrineOfMemoriesMechanism onBack={handleBackToHub} /></div>;
    if (civId === 'egypt') return <div className="p-4"><PyramidOfSecretsMechanism onBack={handleBackToHub} /></div>;
  }

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b ${civ.bgGradient} text-zinc-100 select-none overflow-x-hidden`}>
      {/* Civilization Background Layers */}
      {civId === 'india' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/assets/aistudio/image_1a2717da.png"
            alt="India Sacred Temple Complex"
            className="w-full h-full object-cover object-center filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-amber-950/75 to-black/85" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs" />
        </div>
      )}

      {civId === 'japan' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-sky-950/80 to-black" />
          {/* Subtle Sakura Blossom Petals effect */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f472b6_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
          {/* Torii silhouette roofline frame */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-red-700 border-b-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        </div>
      )}

      {civId === 'egypt' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-amber-950/90 to-black" />
          {/* Constellation Starry Sky Overlay */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Egyptian Pylon border frame */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-600 border-b-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
        </div>
      )}

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
        {/* Civilization Hero Banner with Companion Sprite */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            {civId === 'india' && (
              <IndianPriestessSprite
                size="lg"
                interactive={true}
                showDialogue={false}
                className="mb-1"
              />
            )}
            {civId === 'japan' && (
              <YukiShrineOracle
                size="lg"
                interactive={true}
                showDialogue={false}
                className="mb-1"
              />
            )}
            {civId === 'egypt' && (
              <KiyaHorizonWatcher
                size="lg"
                interactive={true}
                showDialogue={false}
                className="mb-1"
              />
            )}
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-pixel text-amber-400 mb-2 drop-shadow-[0_2px_0_#000]">
            {civ.name} — {civ.subtitle}
          </h2>
          <p className="text-xs md:text-sm text-zinc-300 font-silkscreen max-w-xl mx-auto leading-relaxed">
            {civ.description}
          </p>

          <div className="mt-2 text-[10px] text-amber-400/90 font-pixel">
            {civId === 'india' && '✦ PRIESTESS ANANYA STANDS WATCH AT THE SACRED STEPWELL'}
            {civId === 'japan' && '✦ SHRINE ORACLE YUKI WHISPERS GUIDANCE AMONG CHERRY BLOSSOMS'}
            {civId === 'egypt' && '✦ HORIZON WATCHER KIYA GUARDS THE PYRAMID OF SECRETS'}
          </div>
        </div>

        {/* The 3 Portals / Chambers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chamber 1 */}
          <div
            onClick={handleOpenChamber1}
            className={`pixel-btn p-5 border-4 cursor-pointer flex flex-col justify-between transition-all group ${
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
              <h3 className="font-pixel text-xs md:text-sm text-zinc-100 mb-2 group-hover:text-amber-300">
                {puzzle1.name}
              </h3>
              <p className="font-silkscreen text-xs text-zinc-400 mb-4 line-clamp-2">
                {puzzle1.description}
              </p>
            </div>

            <div>
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-silkscreen mb-3">
                <span className="text-zinc-400">Relic:</span>
                <span className="text-amber-300 flex items-center gap-1.5 font-pixel text-[11px]">
                  <span>{puzzle1.reward.icon}</span>
                  <span>{isPuzzle1Solved ? puzzle1.reward.name : 'Unknown'}</span>
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenChamber1();
                }}
                className={`w-full py-2 font-pixel text-xs border-2 flex items-center justify-center gap-1.5 ${
                  isPuzzle1Solved
                    ? 'border-emerald-600 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80'
                    : 'border-amber-500 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isPuzzle1Solved ? 'REPLAY PUZZLE' : 'ENTER & SOLVE'}</span>
              </button>
            </div>
          </div>

          {/* Chamber 2 */}
          <div
            onClick={handleOpenChamber2}
            className={`pixel-btn p-5 border-4 cursor-pointer flex flex-col justify-between transition-all group ${
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
              <h3 className="font-pixel text-xs md:text-sm text-zinc-100 mb-2 group-hover:text-amber-300">
                {puzzle2.name}
              </h3>
              <p className="font-silkscreen text-xs text-zinc-400 mb-4 line-clamp-2">
                {puzzle2.description}
              </p>
            </div>

            <div>
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-silkscreen mb-3">
                <span className="text-zinc-400">Relic:</span>
                <span className="text-amber-300 flex items-center gap-1.5 font-pixel text-[11px]">
                  <span>{puzzle2.reward.icon}</span>
                  <span>{isPuzzle2Solved ? puzzle2.reward.name : 'Unknown'}</span>
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenChamber2();
                }}
                className={`w-full py-2 font-pixel text-xs border-2 flex items-center justify-center gap-1.5 ${
                  isPuzzle2Solved
                    ? 'border-emerald-600 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80'
                    : 'border-amber-500 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isPuzzle2Solved ? 'REPLAY PUZZLE' : 'ENTER & SOLVE'}</span>
              </button>
            </div>
          </div>

          {/* Grand Mechanism Vault */}
          <div
            onClick={handleOpenMechanism}
            className={`pixel-btn p-5 border-4 cursor-pointer flex flex-col justify-between transition-all group ${
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
              <h3 className="font-pixel text-xs md:text-sm text-zinc-100 mb-2 flex items-center gap-2 group-hover:text-amber-300">
                <Cog className="w-4 h-4 text-amber-500" />
                <span>{mechanism.name}</span>
              </h3>
              <p className="font-silkscreen text-xs text-zinc-400 mb-4 line-clamp-2">
                {mechanism.description}
              </p>
            </div>

            <div>
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-silkscreen mb-3">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMechanism();
                }}
                className={`w-full py-2 font-pixel text-xs border-2 flex items-center justify-center gap-1.5 ${
                  isMechanismUnlocked
                    ? 'border-amber-400 bg-amber-950/60 text-amber-300 hover:bg-amber-900/80'
                    : canUnlockMechanism
                    ? 'border-yellow-400 bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-bold'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                }`}
              >
                <Cog className="w-3.5 h-3.5" />
                <span>{isMechanismUnlocked ? 'VIEW MECHANISM' : canUnlockMechanism ? 'ACTIVATE MECHANISM' : 'INSPECT VAULT'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Hub Summary */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto border-t-2 border-zinc-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-silkscreen text-zinc-400">
        <div className="flex items-center gap-2">
          <span>PROGRESS:</span>
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

      {/* Auxiliary Modals */}
      <InventoryModal isOpen={showInventory} onClose={() => setShowInventory(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} soundEnabled={state.soundEnabled} />
    </div>
  );
};
