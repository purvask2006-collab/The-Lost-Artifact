import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS } from '../data/gameData';
import { MinimalHUD, InventoryTray, JournalModal, PixelIconButton } from './PixelUiKit';
import { PuzzleId, MechanismId } from '../types/game';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  Cog, 
  Sparkles 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const CivHub: React.FC = () => {
  const { 
    state, 
    returnToWorldMap, 
    openChamber, 
    openMechanism 
  } = useGame();

  const [showTray, setShowTray] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  const civId = state.selectedCiv || 'india';
  const civ = CIVILIZATIONS[civId];

  const mechanism = civ.mechanism;
  const isMechanismUnlocked = Boolean(state.unlockedMechanisms[mechanism.id]);
  const isFragmentRecovered = Boolean(state.recoveredFragments[civ.fragmentId]);

  // Check if all 4 puzzles in this realm are solved
  const all4PuzzlesSolved = civ.puzzles.every(p => state.solvedPuzzles[p.id]);

  const handleOpenPuzzle = (puzzleId: PuzzleId, isLocked: boolean) => {
    if (isLocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    openChamber(puzzleId);
  };

  const handleOpenMechanism = () => {
    if (!all4PuzzlesSolved && !isMechanismUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    openMechanism(mechanism.id);
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-b ${civ.bgGradient} text-[#e3dfb1] select-none overflow-x-hidden`}>
      {/* Background Graphic Ambient */}
      {civId === 'india' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/assets/aistudio/image_1a2717da.png"
            alt="India Temple Complex"
            className="w-full h-full object-cover object-center filter saturate-125 opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130e20] via-[#241a12]/80 to-[#130e20]/90" />
        </div>
      )}

      {/* 1. Persistent Minimal HUD */}
      <MinimalHUD
        onBack={returnToWorldMap}
        civId={civId}
        onOpenJournal={() => setShowJournal(true)}
        onOpenTray={() => setShowTray(true)}
      />

      {/* 2. Main Realm Level-Select Scene (The Realm IS the menu) */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Title Header: Logo only, no walls of text */}
        <div className="text-center">
          <h2 className="font-pixel text-[24px] md:text-[32px] text-[#e8b84a] tracking-widest drop-shadow-[0_3px_0_#000]">
            {civ.name.toUpperCase()}
          </h2>
          <div className="font-silkscreen text-[15px] text-[#e3dfb1]/80 mt-1">
            {civ.subtitle.toUpperCase()}
          </div>
        </div>

        {/* 4 Mini-Puzzle Stations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {civ.puzzles.map((puzzle, index) => {
            const isSolved = Boolean(state.solvedPuzzles[puzzle.id]);
            // Sequential unlock: first puzzle is unlocked, subsequent unlock when previous is solved
            const isAvailable = index === 0 || Boolean(state.solvedPuzzles[civ.puzzles[index - 1].id]);

            return (
              <motion.div
                key={puzzle.id}
                whileHover={isAvailable ? { y: -4 } : {}}
                onClick={() => handleOpenPuzzle(puzzle.id, !isAvailable)}
                className={`pixel-panel p-4 flex flex-col justify-between transition-all ${
                  isSolved
                    ? 'border-[#10b981] bg-[#1a2e26]/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer'
                    : isAvailable
                    ? 'border-[#e8b84a] bg-[#2a1f14]/80 shadow-[0_0_15px_rgba(232,184,74,0.3)] cursor-pointer'
                    : 'border-[#443c54] bg-[#151120]/80 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  {/* Chamber Marker & Gem Key Icon */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3a334a]">
                    <span className="font-pixel text-[12px] text-[#e8b84a]">
                      CHAMBER 0{puzzle.puzzleNumber}
                    </span>
                    <span
                      className="font-pixel text-lg"
                      style={{ color: puzzle.gemstone.hexColor }}
                      title={puzzle.gemstone.name}
                    >
                      {puzzle.gemstone.icon}
                    </span>
                  </div>

                  {/* Puzzle Title (Clean 18px text) */}
                  <h3 className="font-silkscreen text-[18px] font-bold text-[#ffffff] mb-2 leading-tight">
                    {puzzle.name}
                  </h3>

                  {/* 1-Line Visual Objective */}
                  <p className="font-silkscreen text-[14px] text-[#e3dfb1]/80 mb-4 line-clamp-2">
                    {puzzle.description.split('.')[0]}.
                  </p>
                </div>

                {/* Single-Action Tactile Button: 1-2 words max */}
                <button
                  className={`w-full min-h-[44px] pixel-btn text-[14px] flex items-center justify-center gap-2 ${
                    isSolved
                      ? 'border-[#10b981] text-[#6ee7b7] bg-[#12281e]'
                      : isAvailable
                      ? 'pixel-btn-primary'
                      : 'border-[#443c54] text-[#676b76] bg-[#181324] cursor-not-allowed'
                  }`}
                >
                  {isSolved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                      <span>REPLAY</span>
                    </>
                  ) : isAvailable ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>PLAY</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#676b76]" />
                      <span>LOCKED</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Grand Regional Mechanism Station (Centered Set Piece) */}
        <motion.div
          whileHover={all4PuzzlesSolved || isMechanismUnlocked ? { scale: 1.01 } : {}}
          onClick={handleOpenMechanism}
          className={`pixel-panel p-5 border-4 transition-all flex flex-col md:flex-row items-center justify-between gap-5 ${
            isMechanismUnlocked
              ? 'border-[#10b981] bg-[#12241d]/90 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer'
              : all4PuzzlesSolved
              ? 'border-[#e8b84a] bg-[#3a2818]/90 animate-pixel-glow cursor-pointer'
              : 'border-[#443c54] bg-[#1a1528]/80 opacity-75 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 border-3 border-[#e8b84a] bg-[#241d33] flex items-center justify-center text-3xl shrink-0 shadow-[0_0_12px_rgba(232,184,74,0.4)]">
              {isMechanismUnlocked ? '💎' : <Cog className="w-8 h-8 text-[#e8b84a] animate-spin [animation-duration:16s]" />}
            </div>

            <div>
              <div className="font-pixel text-[12px] text-[#e8b84a] flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="w-4 h-4" />
                <span>GRAND UNLOCKING MECHANISM</span>
              </div>
              <h3 className="font-pixel text-[18px] md:text-[22px] text-[#ffffff] mt-1">
                {mechanism.name}
              </h3>
              <p className="font-silkscreen text-[14px] text-[#e3dfb1]/80 mt-1">
                {isMechanismUnlocked
                  ? 'Artifact Fragment Recovered.'
                  : all4PuzzlesSolved
                  ? 'All 4 gemstone keys ready. Place keys to unlock.'
                  : 'Requires 4 regional gemstone keys.'}
              </p>
            </div>
          </div>

          {/* Action button */}
          <button
            className={`min-h-[44px] px-6 py-2.5 pixel-btn text-[14px] shrink-0 flex items-center gap-2 ${
              isMechanismUnlocked
                ? 'border-[#10b981] text-[#6ee7b7] bg-[#163328]'
                : all4PuzzlesSolved
                ? 'pixel-btn-primary'
                : 'border-[#443c54] text-[#676b76] bg-[#181324] cursor-not-allowed'
            }`}
          >
            <Cog className="w-4 h-4" />
            <span>{isMechanismUnlocked ? 'VIEW VAULT' : all4PuzzlesSolved ? 'UNLOCK' : 'SEALED'}</span>
          </button>
        </motion.div>
      </main>

      {/* Auxiliary Trays & Inscriptions */}
      <InventoryTray isOpen={showTray} onClose={() => setShowTray(false)} />
      <JournalModal isOpen={showJournal} onClose={() => setShowJournal(false)} />
    </div>
  );
};
