import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface MandalaTile {
  id: number;
  label: string;
  solvedRotation: number;
  currentRotation: number;
  symbol: string;
  quadrant: string;
}

const INITIAL_MANDALA_TILES: { id: number; label: string; solvedRot: number; initRot: number; symbol: string; quadrant: string }[] = [
  { id: 1, label: 'North-West', solvedRot: 0, initRot: 90, symbol: '◜', quadrant: 'NW' },
  { id: 2, label: 'North', solvedRot: 0, initRot: 270, symbol: '▲', quadrant: 'N' },
  { id: 3, label: 'North-East', solvedRot: 0, initRot: 180, symbol: '◝', quadrant: 'NE' },
  { id: 4, label: 'West', solvedRot: 0, initRot: 90, symbol: '◀', quadrant: 'W' },
  { id: 5, label: 'Center', solvedRot: 0, initRot: 0, symbol: '☸', quadrant: 'CORE' },
  { id: 6, label: 'East', solvedRot: 0, initRot: 270, symbol: '▶', quadrant: 'E' },
  { id: 7, label: 'South-West', solvedRot: 0, initRot: 180, symbol: '◟', quadrant: 'SW' },
  { id: 8, label: 'South', solvedRot: 0, initRot: 90, symbol: '▼', quadrant: 'S' },
  { id: 9, label: 'South-East', solvedRot: 0, initRot: 270, symbol: '◞', quadrant: 'SE' },
];

export const CrackedCourtyardPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.india_puzzle_1);

  const [tiles, setTiles] = useState<MandalaTile[]>(() => {
    return INITIAL_MANDALA_TILES.map(t => ({
      id: t.id,
      label: t.label,
      solvedRotation: t.solvedRot,
      currentRotation: isAlreadySolved ? 0 : t.initRot,
      symbol: t.symbol,
      quadrant: t.quadrant,
    }));
  });

  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  const rotateTile = (id: number) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    const nextTiles = tiles.map(t => {
      if (t.id === id) {
        return {
          ...t,
          currentRotation: (t.currentRotation + 90) % 360,
        };
      }
      return t;
    });

    setTiles(nextTiles);

    const allAligned = nextTiles.every(t => (t.currentRotation % 360) === (t.solvedRotation % 360));
    if (allAligned && !isSolved) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('india_puzzle_1');
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setTiles(INITIAL_MANDALA_TILES.map(t => ({
      id: t.id,
      label: t.label,
      solvedRotation: t.solvedRot,
      currentRotation: t.initRot,
      symbol: t.symbol,
      quadrant: t.quadrant,
    })));
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-3xl mx-auto p-5 md:p-6 bg-[#1a1528] border-3 border-[#e8b84a] shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#e3dfb1] flex flex-col justify-between select-none">
      {/* Top Header Strip */}
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
            <div className="font-pixel text-[12px] text-[#f59e0b]">CHAMBER 01 · INDIA</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE CRACKED COURTYARD</h2>
          </div>
        </div>

        {/* Action Controls */}
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
            title="Reset Stones"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Center */}
      <div className="my-5 flex flex-col items-center">
        {/* Objective line: Max 8 words */}
        <div className="font-silkscreen text-[16px] text-[#fef08a] mb-4 text-center">
          Rotate stones to radiate cosmic rays outward from center.
        </div>

        {/* Visual Clue Pill */}
        {showHint && !isSolved && (
          <div className="mb-4 px-4 py-2 bg-[#120e1c] border-2 border-[#e8b84a] text-[#fef08a] font-silkscreen text-[14px]">
            Cardinals (▲, ▶, ▼, ◀) point outward (N, E, S, W).
          </div>
        )}

        {/* 3x3 Sandstone Mandala Grid */}
        <div className="p-4 bg-[#120e1c] border-4 border-[#676b76] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
          <div className="grid grid-cols-3 gap-3">
            {tiles.map(tile => {
              const isCenter = tile.id === 5;
              const isTileAligned = (tile.currentRotation % 360) === (tile.solvedRotation % 360);

              return (
                <button
                  key={tile.id}
                  onClick={() => !isCenter && rotateTile(tile.id)}
                  disabled={isSolved || isCenter}
                  className={`w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center border-4 transition-all ${
                    isSolved
                      ? 'border-[#10b981] bg-[#1a2e26] text-[#6ee7b7] shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : isTileAligned
                      ? 'border-[#e8b84a] bg-[#2a1f14] text-[#fef08a] hover:border-[#ffffff]'
                      : 'border-[#443c54] bg-[#241d33] text-[#a1a1aa] hover:border-[#e8b84a]'
                  } ${isCenter ? 'cursor-default ring-2 ring-[#e8b84a]' : 'cursor-pointer active:scale-95'}`}
                >
                  <div
                    className="text-3xl sm:text-4xl font-bold transition-transform duration-200"
                    style={{ transform: `rotate(${tile.currentRotation}deg)` }}
                  >
                    {tile.symbol}
                  </div>
                  <span className="font-pixel text-[12px] text-[#e8b84a] mt-1">
                    {tile.quadrant}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Reward Strip */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 border-2 border-[#ef4444] bg-[#2a1318] flex items-center justify-center text-2xl shrink-0">
            ♦
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#ef4444]">VEDIC FIRE RUBY</div>
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
