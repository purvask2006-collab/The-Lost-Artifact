import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

export const DisorderedTearoomPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.japan_puzzle_4);

  // 4 corner tatami arrows (0: Top-Left, 1: Top-Right, 2: Bottom-Left, 3: Bottom-Right)
  // Angles in degrees. Solved when all arrows face toward the room center:
  // TL: 135°, TR: 225°, BL: 45°, BR: 315°
  const [arrows, setArrows] = useState<number[]>(() => {
    return isAlreadySolved ? [135, 225, 45, 315] : [45, 135, 225, 45];
  });

  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  const rotateArrow = (idx: number) => {
    if (isSolved) return;
    soundManager.playSlide(state.soundEnabled);

    const nextArrows = [...arrows];
    nextArrows[idx] = (nextArrows[idx] + 90) % 360;
    setArrows(nextArrows);

    // Check win condition
    if (
      nextArrows[0] === 135 &&
      nextArrows[1] === 225 &&
      nextArrows[2] === 45 &&
      nextArrows[3] === 315 &&
      !isSolved
    ) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('japan_puzzle_4');
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setArrows([45, 135, 225, 45]);
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-3xl mx-auto p-5 md:p-6 bg-[#1a1528] border-3 border-[#38bdf8] shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#e3dfb1] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playCancel(state.soundEnabled);
              onBack();
            }}
            className="pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          <div>
            <div className="font-pixel text-[12px] text-[#38bdf8]">CHAMBER 04 · JAPAN</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE DISORDERED TEAROOM</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHint(!showHint);
            }}
            className={`pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-1.5 ${
              showHint ? 'border-[#38bdf8] bg-[#162738] text-[#67e8f9]' : ''
            }`}
          >
            <Lightbulb className="w-4 h-4 text-[#38bdf8]" />
            <span>HINT</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isSolved}
            className={`pixel-btn min-h-[44px] min-w-[44px] p-2 ${isSolved ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Reset Tearoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="my-5 flex flex-col items-center">
        <div className="font-silkscreen text-[16px] text-[#67e8f9] mb-4 text-center">
          Rotate corner tatami arrows to face toward the central hearth.
        </div>

        {showHint && !isSolved && (
          <div className="mb-4 px-4 py-2 bg-[#120e1c] border-2 border-[#38bdf8] text-[#67e8f9] font-silkscreen text-[14px]">
            No four corners may meet: all arrows must point inward.
          </div>
        )}

        {/* 4x4 Tatami Chamber Floor Grid */}
        <div className="p-4 bg-[#120e1c] border-4 border-[#3a334a] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] w-72 h-72 sm:w-80 sm:h-80 grid grid-cols-4 gap-2">
          {/* Tile 0: TL Corner Arrow */}
          <button
            onClick={() => rotateArrow(0)}
            className="border-3 border-[#38bdf8] bg-[#1a2536] flex items-center justify-center text-3xl font-bold cursor-pointer hover:border-[#ffffff] active:scale-95"
            style={{ transform: `rotate(${arrows[0]}deg)` }}
          >
            ➔
          </button>
          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">═</div>
          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">═</div>
          {/* Tile 3: TR Corner Arrow */}
          <button
            onClick={() => rotateArrow(1)}
            className="border-3 border-[#38bdf8] bg-[#1a2536] flex items-center justify-center text-3xl font-bold cursor-pointer hover:border-[#ffffff] active:scale-95"
            style={{ transform: `rotate(${arrows[1]}deg)` }}
          >
            ➔
          </button>

          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">║</div>
          <div className="col-span-2 row-span-2 border-2 border-[#e8b84a] bg-[#221728] flex flex-col items-center justify-center text-sm font-pixel text-[#fde047]">
            <span>🍵</span>
            <span className="text-[10px] mt-1">HEARTH</span>
          </div>
          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">║</div>

          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">║</div>
          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">║</div>

          {/* Tile 12: BL Corner Arrow */}
          <button
            onClick={() => rotateArrow(2)}
            className="border-3 border-[#38bdf8] bg-[#1a2536] flex items-center justify-center text-3xl font-bold cursor-pointer hover:border-[#ffffff] active:scale-95"
            style={{ transform: `rotate(${arrows[2]}deg)` }}
          >
            ➔
          </button>
          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">═</div>
          <div className="border border-[#2a2238] bg-[#151120] flex items-center justify-center text-xs text-[#676b76]">═</div>
          {/* Tile 15: BR Corner Arrow */}
          <button
            onClick={() => rotateArrow(3)}
            className="border-3 border-[#38bdf8] bg-[#1a2536] flex items-center justify-center text-3xl font-bold cursor-pointer hover:border-[#ffffff] active:scale-95"
            style={{ transform: `rotate(${arrows[3]}deg)` }}
          >
            ➔
          </button>
        </div>
      </div>

      {/* Footer / Reward */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 border-2 border-[#71717a] bg-[#120e1c] flex items-center justify-center text-2xl shrink-0">
            🖤
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#e4e4e7]">SOVEREIGN OBSIDIAN</div>
            <div className="font-silkscreen text-[14px] text-[#e3dfb1]/75">
              {isSolved ? 'Earned & Stored in Tray' : 'Gemstone Key Reward'}
            </div>
          </div>
        </div>

        {isSolved && (
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[14px] text-[#10b981] flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
              SOLVED
            </span>
            <button
              onClick={onBack}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-5 text-[14px]"
            >
              CONTINUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
