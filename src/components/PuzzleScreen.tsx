import React from 'react';
import { useGame } from '../context/GameContext';
import { CrackedCourtyardPuzzle } from './india/CrackedCourtyardPuzzle';
import { FiveHearthsPuzzle } from './india/FiveHearthsPuzzle';
import { MisplacedScreenPuzzle } from './japan/MisplacedScreenPuzzle';
import { BellSequencePuzzle } from './japan/BellSequencePuzzle';
import { ScatteredCeilingPuzzle } from './egypt/ScatteredCeilingPuzzle';
import { CrackedBasinPuzzle } from './egypt/CrackedBasinPuzzle';
import { ArrowLeft, Compass, Backpack } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const PuzzleScreen: React.FC = () => {
  const { state, goToScreen, returnToWorldMap, selectCivilization } = useGame();

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
      case 'india_puzzle_1':
        return <CrackedCourtyardPuzzle onBack={handleBack} />;
      case 'india_puzzle_2':
        return <FiveHearthsPuzzle onBack={handleBack} />;
      case 'japan_puzzle_1':
        return <MisplacedScreenPuzzle onBack={handleBack} />;
      case 'japan_puzzle_2':
        return <BellSequencePuzzle onBack={handleBack} />;
      case 'egypt_puzzle_1':
        return <ScatteredCeilingPuzzle onBack={handleBack} />;
      case 'egypt_puzzle_2':
        return <CrackedBasinPuzzle onBack={handleBack} />;
      default:
        return (
          <div className="p-8 text-center">
            <p className="font-pixel text-sm text-zinc-400 mb-4">No active puzzle selected</p>
            <button
              onClick={returnToWorldMap}
              className="pixel-btn px-4 py-2 bg-amber-500 text-zinc-950 font-pixel text-xs"
            >
              RETURN TO WORLD MAP
            </button>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col justify-between p-3 md:p-6 select-none overflow-x-hidden">
      {/* Top Header Navigation Strip */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="pixel-btn px-3 py-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-pixel text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXIT CHAMBER</span>
          </button>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500 animate-spin [animation-duration:15s]" />
            <span className="font-pixel text-xs text-amber-400 tracking-wider">
              {civId ? civId.toUpperCase() : 'EXPEDITION'} · PUZZLE CHAMBER
            </span>
          </div>
        </div>

        <button
          onClick={returnToWorldMap}
          className="pixel-btn px-3 py-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-pixel text-xs flex items-center gap-1.5"
        >
          <span>WORLD MAP</span>
        </button>
      </header>

      {/* Main Puzzle Component */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto flex items-center justify-center">
        {renderPuzzle()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto border-t border-zinc-800/80 pt-3 text-center text-[10px] font-silkscreen text-zinc-500">
        THE LOST ARTIFACT · SOLVE REAL LOGIC PUZZLES TO RECOVER ANCIENT RELICS
      </footer>
    </div>
  );
};
