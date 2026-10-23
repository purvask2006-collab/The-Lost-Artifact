import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

export const BrokenMandalaPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.india_puzzle_4);

  // Offsets in 45° steps (0-7). Solved when all are 0.
  const [outerOffset, setOuterOffset] = useState<number>(isAlreadySolved ? 0 : 3);
  const [middleOffset, setMiddleOffset] = useState<number>(isAlreadySolved ? 0 : 5);
  const [innerOffset, setInnerOffset] = useState<number>(isAlreadySolved ? 0 : 2);
  const [outerTurns, setOuterTurns] = useState<number>(0);

  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  const checkWin = (out: number, mid: number, inn: number) => {
    if ((out % 8 === 0) && (mid % 8 === 0) && (inn % 8 === 0) && !isSolved) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('india_puzzle_4');
    }
  };

  const rotateOuter = (dir: 1 | -1) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    const nextOuter = (outerOffset + dir + 8) % 8;
    const nextTurns = outerTurns + 1;
    // Every 2nd outer turn rotates middle by 1 step
    const nextMiddle = nextTurns % 2 === 0 ? (middleOffset + 1) % 8 : middleOffset;
    const nextInner = innerOffset;

    setOuterOffset(nextOuter);
    setMiddleOffset(nextMiddle);
    setOuterTurns(nextTurns);

    checkWin(nextOuter, nextMiddle, nextInner);
  };

  const rotateMiddle = (dir: 1 | -1) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    const nextMiddle = (middleOffset + dir + 8) % 8;
    // Turning middle clockwise also rotates inner counterclockwise
    const nextInner = dir === 1 ? (innerOffset - 1 + 8) % 8 : (innerOffset + 1) % 8;
    const nextOuter = outerOffset;

    setMiddleOffset(nextMiddle);
    setInnerOffset(nextInner);

    checkWin(nextOuter, nextMiddle, nextInner);
  };

  const rotateInner = (dir: 1 | -1) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    const nextInner = (innerOffset + dir + 8) % 8;
    setInnerOffset(nextInner);

    checkWin(outerOffset, middleOffset, nextInner);
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setOuterOffset(3);
    setMiddleOffset(5);
    setInnerOffset(2);
    setOuterTurns(0);
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-3xl mx-auto p-5 md:p-6 bg-[#1a1528] border-3 border-[#e8b84a] shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#e3dfb1] flex flex-col justify-between select-none">
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
            <div className="font-pixel text-[12px] text-[#f59e0b]">CHAMBER 04 · INDIA</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE BROKEN MANDALA</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHint(!showHint);
            }}
            className={`pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-1.5 ${
              showHint ? 'border-[#e8b84a] bg-[#3a2818] text-[#fef08a]' : ''
            }`}
          >
            <Lightbulb className="w-4 h-4 text-[#fde047]" />
            <span>HINT</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isSolved}
            className={`pixel-btn min-h-[44px] min-w-[44px] p-2 ${isSolved ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Reset Rings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Rings Area */}
      <div className="my-5 flex flex-col items-center">
        <div className="font-silkscreen text-[16px] text-[#fef08a] mb-4 text-center">
          Rotate concentric rings to connect the radial golden paths.
        </div>

        {showHint && !isSolved && (
          <div className="mb-4 px-4 py-2 bg-[#120e1c] border-2 border-[#e8b84a] text-[#fef08a] font-silkscreen text-[14px]">
            Turning Middle ring rotates Inner ring counterclockwise.
          </div>
        )}

        {/* The Concentric Rings Altar Visual */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#3a334a] bg-[#120e1c] flex items-center justify-center p-2 shadow-[inset_0_0_25px_rgba(0,0,0,0.9)]">
          {/* Outer Ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-[#f59e0b] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${outerOffset * 45}deg)` }}
          >
            <span className="absolute top-2 font-pixel text-xs text-[#fef08a]">☀️</span>
            <span className="absolute bottom-2 font-pixel text-xs text-[#fef08a]">☸</span>
            <span className="absolute left-2 font-pixel text-xs text-[#fef08a]">🪷</span>
            <span className="absolute right-2 font-pixel text-xs text-[#fef08a]">🔷</span>
          </div>

          {/* Middle Ring */}
          <div
            className="absolute inset-8 rounded-full border-4 border-[#38bdf8] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${middleOffset * 45}deg)` }}
          >
            <span className="absolute top-2 font-pixel text-xs text-[#67e8f9]">☀️</span>
            <span className="absolute bottom-2 font-pixel text-xs text-[#67e8f9]">☸</span>
            <span className="absolute left-2 font-pixel text-xs text-[#67e8f9]">🪷</span>
            <span className="absolute right-2 font-pixel text-xs text-[#67e8f9]">🔷</span>
          </div>

          {/* Inner Ring */}
          <div
            className="absolute inset-16 rounded-full border-4 border-[#10b981] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${innerOffset * 45}deg)` }}
          >
            <span className="absolute top-1.5 font-pixel text-xs text-[#6ee7b7]">☀️</span>
            <span className="absolute bottom-1.5 font-pixel text-xs text-[#6ee7b7]">☸</span>
            <span className="absolute left-1.5 font-pixel text-xs text-[#6ee7b7]">🪷</span>
            <span className="absolute right-1.5 font-pixel text-xs text-[#6ee7b7]">🔷</span>
          </div>

          {/* Central Bindu Core */}
          <div className="w-10 h-10 rounded-full border-2 border-[#e8b84a] bg-[#f59e0b] flex items-center justify-center text-sm font-pixel text-[#130e20] z-10 animate-pulse">
            ☸
          </div>
        </div>

        {/* Ring Rotation Controls */}
        <div className="mt-5 grid grid-cols-3 gap-3 w-full max-w-md">
          {/* Outer Controls */}
          <div className="flex flex-col items-center gap-1 p-2 bg-[#120e1c] border-2 border-[#f59e0b]">
            <span className="font-pixel text-[11px] text-[#f59e0b]">OUTER</span>
            <div className="flex gap-1.5 mt-1">
              <button onClick={() => rotateOuter(-1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↺</button>
              <button onClick={() => rotateOuter(1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↻</button>
            </div>
          </div>

          {/* Middle Controls */}
          <div className="flex flex-col items-center gap-1 p-2 bg-[#120e1c] border-2 border-[#38bdf8]">
            <span className="font-pixel text-[11px] text-[#38bdf8]">MIDDLE</span>
            <div className="flex gap-1.5 mt-1">
              <button onClick={() => rotateMiddle(-1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↺</button>
              <button onClick={() => rotateMiddle(1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↻</button>
            </div>
          </div>

          {/* Inner Controls */}
          <div className="flex flex-col items-center gap-1 p-2 bg-[#120e1c] border-2 border-[#10b981]">
            <span className="font-pixel text-[11px] text-[#10b981]">INNER</span>
            <div className="flex gap-1.5 mt-1">
              <button onClick={() => rotateInner(-1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↺</button>
              <button onClick={() => rotateInner(1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↻</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Reward */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 border-2 border-[#f59e0b] bg-[#2a1e12] flex items-center justify-center text-2xl shrink-0">
            🟡
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#f59e0b]">SOLAR BINDU CITRINE</div>
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
