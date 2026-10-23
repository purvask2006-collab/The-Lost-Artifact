import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MinimalHUD, InventoryTray, JournalModal } from './PixelUiKit';
import { CrackedCourtyardPuzzle } from './india/CrackedCourtyardPuzzle';
import { FiveHearthsPuzzle } from './india/FiveHearthsPuzzle';
import { CrookedArchPuzzle } from './india/CrookedArchPuzzle';
import { BrokenMandalaPuzzle } from './india/BrokenMandalaPuzzle';
import { MisplacedScreenPuzzle } from './japan/MisplacedScreenPuzzle';
import { AsymmetricGardenPuzzle } from './japan/AsymmetricGardenPuzzle';
import { BellSequencePuzzle } from './japan/BellSequencePuzzle';
import { DisorderedTearoomPuzzle } from './japan/DisorderedTearoomPuzzle';
import { ScatteredCeilingPuzzle } from './egypt/ScatteredCeilingPuzzle';
import { CrackedBasinPuzzle } from './egypt/CrackedBasinPuzzle';
import { WanderingShadowPuzzle } from './egypt/WanderingShadowPuzzle';
import { StarClockPuzzle } from './egypt/StarClockPuzzle';
import { soundManager } from '../utils/audio';
import { CIVILIZATIONS } from '../data/gameData';
import { CivilizationId, PuzzleInfo } from '../types/game';
import { FastForward, CheckCircle2, ArrowRight, Cog, Sparkles } from 'lucide-react';

export const PuzzleScreen: React.FC = () => {
  const { 
    state, 
    returnToWorldMap, 
    selectCivilization, 
    openChamber, 
    openMechanism, 
    skipCurrentPuzzle 
  } = useGame();
  
  const [showTray, setShowTray] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  const puzzleId = state.activePuzzleId;
  const civId: CivilizationId = state.selectedCiv || (puzzleId ? (puzzleId.split('_')[0] as CivilizationId) : 'india');
  const isCurrentSolved = puzzleId ? Boolean(state.solvedPuzzles[puzzleId]) : false;

  const currentCivPuzzles: readonly PuzzleInfo[] = (CIVILIZATIONS[civId]?.puzzles) || [];
  const currentIndex = currentCivPuzzles.findIndex((p: PuzzleInfo) => p.id === puzzleId);
  const nextPuzzle = currentIndex >= 0 && currentIndex < currentCivPuzzles.length - 1 ? currentCivPuzzles[currentIndex + 1] : null;

  const handleBack = () => {
    soundManager.playCancel(state.soundEnabled);
    if (civId) {
      selectCivilization(civId);
    } else {
      returnToWorldMap();
    }
  };

  const handleSkip = () => {
    skipCurrentPuzzle();
  };

  const renderPuzzle = () => {
    const key = `${puzzleId}_${isCurrentSolved ? 'solved' : 'unsolved'}`;

    let puzzleContent = null;
    switch (puzzleId) {
      // India (4 Chambers)
      case 'india_puzzle_1':
        puzzleContent = <CrackedCourtyardPuzzle onBack={handleBack} />;
        break;
      case 'india_puzzle_2':
        puzzleContent = <FiveHearthsPuzzle onBack={handleBack} />;
        break;
      case 'india_puzzle_3':
        puzzleContent = <CrookedArchPuzzle onBack={handleBack} />;
        break;
      case 'india_puzzle_4':
        puzzleContent = <BrokenMandalaPuzzle onBack={handleBack} />;
        break;

      // Japan (4 Chambers)
      case 'japan_puzzle_1':
        puzzleContent = <MisplacedScreenPuzzle onBack={handleBack} />;
        break;
      case 'japan_puzzle_2':
        puzzleContent = <AsymmetricGardenPuzzle onBack={handleBack} />;
        break;
      case 'japan_puzzle_3':
        puzzleContent = <BellSequencePuzzle onBack={handleBack} />;
        break;
      case 'japan_puzzle_4':
        puzzleContent = <DisorderedTearoomPuzzle onBack={handleBack} />;
        break;

      // Egypt (4 Chambers)
      case 'egypt_puzzle_1':
        puzzleContent = <ScatteredCeilingPuzzle onBack={handleBack} />;
        break;
      case 'egypt_puzzle_2':
        puzzleContent = <CrackedBasinPuzzle onBack={handleBack} />;
        break;
      case 'egypt_puzzle_3':
        puzzleContent = <WanderingShadowPuzzle onBack={handleBack} />;
        break;
      case 'egypt_puzzle_4':
        puzzleContent = <StarClockPuzzle onBack={handleBack} />;
        break;

      default:
        puzzleContent = (
          <div className="p-8 text-center pixel-panel">
            <h3 className="font-pixel text-[18px] text-[#e8b84a] mb-4">CHAMBER PORTAL</h3>
            <button
              onClick={returnToWorldMap}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-6 text-[15px]"
            >
              RETURN TO MAP
            </button>
          </div>
        );
    }

    return (
      <div key={key} className="w-full flex justify-center">
        {puzzleContent}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-[#130e20] text-[#e3dfb1] flex flex-col justify-between select-none overflow-x-hidden">
      {/* 1. Persistent Minimal HUD with onSkip option */}
      <MinimalHUD
        onBack={handleBack}
        civId={civId}
        onSkip={handleSkip}
        isAlreadySolved={isCurrentSolved}
        onOpenJournal={() => setShowJournal(true)}
        onOpenTray={() => setShowTray(true)}
      />

      {/* 2. Top Banner: Quick Skip / Completed Navigation strip */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-3 pt-3">
        {!isCurrentSolved ? (
          <div className="flex items-center justify-between gap-3 px-4 py-2 bg-[#1a1528]/90 border-2 border-[#443c54] shadow-[0_2px_0_#000]">
            <div className="font-silkscreen text-[14px] text-[#e3dfb1]/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8b84a]" />
              <span>CHAMBER IN PROGRESS</span>
            </div>
            <button
              onClick={handleSkip}
              className="pixel-btn min-h-[40px] px-4 border-2 border-[#e8b84a] bg-[#3a2818] hover:bg-[#4f3721] text-[#fef08a] font-silkscreen text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_10px_rgba(232,184,74,0.3)]"
              title="Skip this challenge and collect its gemstone key"
            >
              <FastForward className="w-4 h-4 text-amber-300" />
              <span>SKIP CHALLENGE</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#12281e]/95 border-2 border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
              <span className="font-silkscreen text-[14px] text-[#6ee7b7] font-bold">
                CHAMBER SOLVED · KEY COLLECTED
              </span>
            </div>
            <div className="flex items-center gap-2">
              {nextPuzzle ? (
                <button
                  onClick={() => openChamber(nextPuzzle.id)}
                  className="pixel-btn pixel-btn-primary min-h-[40px] px-4 text-[13px] flex items-center gap-1.5"
                >
                  <span>NEXT CHAMBER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => civId && openMechanism(CIVILIZATIONS[civId].mechanism.id)}
                  className="pixel-btn pixel-btn-primary min-h-[40px] px-4 text-[13px] flex items-center gap-1.5"
                >
                  <span>UNLOCK MECHANISM</span>
                  <Cog className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleBack}
                className="pixel-btn min-h-[40px] px-3.5 text-[13px] border-[#676b76] bg-[#241d33] text-[#e3dfb1] hover:text-white"
              >
                <span>REALM MAP</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Puzzle Centerpiece (~70% of screen) */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto p-3 md:p-6 flex items-center justify-center">
        {renderPuzzle()}
      </main>

      {/* Auxiliary Inventory Tray & Inscriptions */}
      <InventoryTray isOpen={showTray} onClose={() => setShowTray(false)} />
      <JournalModal isOpen={showJournal} onClose={() => setShowJournal(false)} />
    </div>
  );
};
