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

export const PuzzleScreen: React.FC = () => {
  const { state, returnToWorldMap, selectCivilization } = useGame();
  const [showTray, setShowTray] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  const puzzleId = state.activePuzzleId;
  const civId = state.selectedCiv || (puzzleId ? (puzzleId.split('_')[0] as any) : 'india');

  const handleBack = () => {
    soundManager.playCancel(state.soundEnabled);
    if (civId) {
      selectCivilization(civId);
    } else {
      returnToWorldMap();
    }
  };

  const renderPuzzle = () => {
    switch (puzzleId) {
      // India (4 Chambers)
      case 'india_puzzle_1':
        return <CrackedCourtyardPuzzle onBack={handleBack} />;
      case 'india_puzzle_2':
        return <FiveHearthsPuzzle onBack={handleBack} />;
      case 'india_puzzle_3':
        return <CrookedArchPuzzle onBack={handleBack} />;
      case 'india_puzzle_4':
        return <BrokenMandalaPuzzle onBack={handleBack} />;

      // Japan (4 Chambers)
      case 'japan_puzzle_1':
        return <MisplacedScreenPuzzle onBack={handleBack} />;
      case 'japan_puzzle_2':
        return <AsymmetricGardenPuzzle onBack={handleBack} />;
      case 'japan_puzzle_3':
        return <BellSequencePuzzle onBack={handleBack} />;
      case 'japan_puzzle_4':
        return <DisorderedTearoomPuzzle onBack={handleBack} />;

      // Egypt (4 Chambers)
      case 'egypt_puzzle_1':
        return <ScatteredCeilingPuzzle onBack={handleBack} />;
      case 'egypt_puzzle_2':
        return <CrackedBasinPuzzle onBack={handleBack} />;
      case 'egypt_puzzle_3':
        return <WanderingShadowPuzzle onBack={handleBack} />;
      case 'egypt_puzzle_4':
        return <StarClockPuzzle onBack={handleBack} />;

      default:
        return (
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
  };

  return (
    <div className="relative min-h-screen w-full bg-[#130e20] text-[#e3dfb1] flex flex-col justify-between select-none overflow-x-hidden">
      {/* 1. Persistent Minimal HUD */}
      <MinimalHUD
        onBack={handleBack}
        civId={civId}
        onOpenJournal={() => setShowJournal(true)}
        onOpenTray={() => setShowTray(true)}
      />

      {/* 2. Main Puzzle Centerpiece (~70% of screen) */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto p-3 md:p-6 flex items-center justify-center">
        {renderPuzzle()}
      </main>

      {/* Auxiliary Inventory Tray & Inscriptions */}
      <InventoryTray isOpen={showTray} onClose={() => setShowTray(false)} />
      <JournalModal isOpen={showJournal} onClose={() => setShowJournal(false)} />
    </div>
  );
};
