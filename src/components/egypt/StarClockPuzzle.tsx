import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

export const StarClockPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.egypt_puzzle_4);

  // Offsets (0-7). Solved when all are 0.
  const [outerOffset, setOuterOffset] = useState<number>(isAlreadySolved ? 0 : 3);
  const [middleOffset, setMiddleOffset] = useState<number>(isAlreadySolved ? 0 : 6);
  const [innerOffset, setInnerOffset] = useState<number>(isAlreadySolved ? 0 : 2);

  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  const checkWin = (out: number, mid: number, inn: number) => {
    if ((out % 8 === 0) && (mid % 8 === 0) && (inn % 8 === 0) && !isSolved) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('egypt_puzzle_4');
    }
  };

  const rotateOuter = (dir: 1 | -1) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    const nextOuter = (outerOffset + dir + 8) % 8;
    // Turning outer clockwise advances inner by 1 step
    const nextInner = dir === 1 ? (innerOffset + 1) % 8 : innerOffset;
    const nextMiddle = middleOffset;

    setOuterOffset(nextOuter);
    setInnerOffset(nextInner);

    checkWin(nextOuter, nextMiddle, nextInner);
  };

  const rotateMiddle = (dir: 1 | -1) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    const nextMiddle = (middleOffset + dir + 8) % 8;
    // Turning middle counterclockwise advances outer by 1 step
    const nextOuter = dir === -1 ? (outerOffset + 1) % 8 : outerOffset;
    const nextInner = innerOffset;

    setMiddleOffset(nextMiddle);
    setOuterOffset(nextOuter);

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
    setMiddleOffset(6);
    setInnerOffset(2);
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-3xl mx-auto p-5 md:p-6 bg-[#1a1528] border-3 border-[#059669] shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#e3dfb1] flex flex-col justify-between select-none">
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
            <div className="font-pixel text-[12px] text-[#059669]">CHAMBER 04 · EGYPT</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE STAR CLOCK</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHint(!showHint);
            }}
            className={`pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-1.5 ${
              showHint ? 'border-[#059669] bg-[#12241d] text-[#6ee7b7]' : ''
            }`}
          >
            <Lightbulb className="w-4 h-4 text-[#10b981]" />
            <span>HINT</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isSolved}
            className={`pixel-btn min-h-[44px] min-w-[44px] p-2 ${isSolved ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Reset Clock"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="my-5 flex flex-col items-center">
        <div className="font-silkscreen text-[16px] text-[#6ee7b7] mb-3 text-center">
          Align target decans at top marker: Flood (𓈗) · Falcon (𓅃) · Moon (☽).
        </div>

        {/* Target Dial Clue Pill */}
        <div className="flex items-center gap-4 px-4 py-1.5 bg-[#120e1c] border-2 border-[#676b76] mb-4 font-pixel text-[13px]">
          <span className="text-[#38bdf8]">OUTER: 𓈗</span>
          <span>·</span>
          <span className="text-[#f59e0b]">MID: 𓅃</span>
          <span>·</span>
          <span className="text-[#f8fafc]">INN: ☽</span>
        </div>

        {/* Triple Star Clock Rings */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#3a334a] bg-[#120e1c] flex items-center justify-center p-2 shadow-[inset_0_0_25px_rgba(0,0,0,0.9)]">
          {/* Top Alignment Pointer Marker */}
          <div className="absolute -top-3 z-20 text-[#e8b84a] text-xl font-bold animate-bounce">
            ▼
          </div>

          {/* Outer Ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-[#06b6d4] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${outerOffset * 45}deg)` }}
          >
            <span className="absolute top-1.5 font-pixel text-lg text-[#67e8f9]">𓈗</span>
            <span className="absolute bottom-1.5 font-pixel text-lg text-[#67e8f9]">𓇳</span>
            <span className="absolute left-1.5 font-pixel text-lg text-[#67e8f9]">𓌏</span>
            <span className="absolute right-1.5 font-pixel text-lg text-[#67e8f9]">𓁹</span>
          </div>

          {/* Middle Ring */}
          <div
            className="absolute inset-8 rounded-full border-4 border-[#f59e0b] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${middleOffset * 45}deg)` }}
          >
            <span className="absolute top-1.5 font-pixel text-lg text-[#fde047]">𓅃</span>
            <span className="absolute bottom-1.5 font-pixel text-lg text-[#fde047]">𓃭</span>
            <span className="absolute left-1.5 font-pixel text-lg text-[#fde047]">𓆗</span>
            <span className="absolute right-1.5 font-pixel text-lg text-[#fde047]">𓃠</span>
          </div>

          {/* Inner Ring */}
          <div
            className="absolute inset-16 rounded-full border-4 border-[#10b981] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `rotate(${innerOffset * 45}deg)` }}
          >
            <span className="absolute top-1 font-pixel text-base text-[#6ee7b7]">☽</span>
            <span className="absolute bottom-1 font-pixel text-base text-[#6ee7b7]">●</span>
            <span className="absolute left-1 font-pixel text-base text-[#6ee7b7]">◐</span>
            <span className="absolute right-1 font-pixel text-base text-[#6ee7b7]">◑</span>
          </div>

          {/* Center Polaris Hub */}
          <div className="w-10 h-10 rounded-full border-2 border-[#059669] bg-[#163328] flex items-center justify-center text-sm font-pixel text-[#6ee7b7] z-10">
            ★
          </div>
        </div>

        {/* Ring Rotation Controls */}
        <div className="mt-5 grid grid-cols-3 gap-3 w-full max-w-md">
          {/* Outer Controls */}
          <div className="flex flex-col items-center gap-1 p-2 bg-[#120e1c] border-2 border-[#06b6d4]">
            <span className="font-pixel text-[11px] text-[#06b6d4]">OUTER</span>
            <div className="flex gap-1.5 mt-1">
              <button onClick={() => rotateOuter(-1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↺</button>
              <button onClick={() => rotateOuter(1)} className="pixel-btn min-h-[38px] px-2 text-[12px]">↻</button>
            </div>
          </div>

          {/* Middle Controls */}
          <div className="flex flex-col items-center gap-1 p-2 bg-[#120e1c] border-2 border-[#f59e0b]">
            <span className="font-pixel text-[11px] text-[#f59e0b]">MIDDLE</span>
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
          <div className="w-11 h-11 border-2 border-[#059669] bg-[#12241d] flex items-center justify-center text-2xl shrink-0">
            ❇️
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#059669]">BANDED STAR MALACHITE</div>
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
