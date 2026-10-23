import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { IndianPriestessSprite } from '../IndianPriestessSprite';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
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
  { id: 1, label: 'North-West Ray', solvedRot: 0, initRot: 90, symbol: '◜', quadrant: 'North-West' },
  { id: 2, label: 'North Ray (Surya)', solvedRot: 0, initRot: 270, symbol: '▲', quadrant: 'North' },
  { id: 3, label: 'North-East Ray', solvedRot: 0, initRot: 180, symbol: '◝', quadrant: 'North-East' },
  { id: 4, label: 'West Ray (Vayu)', solvedRot: 0, initRot: 90, symbol: '◀', quadrant: 'West' },
  { id: 5, label: 'Central Bindu', solvedRot: 0, initRot: 0, symbol: '☸', quadrant: 'Center Core' },
  { id: 6, label: 'East Ray (Indra)', solvedRot: 0, initRot: 270, symbol: '▶', quadrant: 'East' },
  { id: 7, label: 'South-West Ray', solvedRot: 0, initRot: 180, symbol: '◟', quadrant: 'South-West' },
  { id: 8, label: 'South Ray (Yama)', solvedRot: 0, initRot: 90, symbol: '▼', quadrant: 'South' },
  { id: 9, label: 'South-East Ray', solvedRot: 0, initRot: 270, symbol: '◞', quadrant: 'South-East' },
];

export const CrackedCourtyardPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = state.solvedPuzzles.india_puzzle_1;

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

  const checkSolution = (currentTiles: MandalaTile[]) => {
    const allAligned = currentTiles.every(t => (t.currentRotation % 360) === (t.solvedRotation % 360));
    if (allAligned && !isSolved) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('india_puzzle_1');
    }
  };

  const rotateTile = (id: number) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    setTiles(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            currentRotation: (t.currentRotation + 90) % 360,
          };
        }
        return t;
      });
      checkSolution(updated);
      return updated;
    });
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
    <div className="relative min-h-[580px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-stone-950 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.35)] text-zinc-100 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playCancel(state.soundEnabled);
              onBack();
            }}
            className="pixel-btn px-3 py-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-pixel text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK</span>
          </button>
          <div>
            <span className="font-pixel text-[10px] text-amber-500">ANCIENT INDIA · PUZZLE 1</span>
            <h2 className="font-pixel text-sm md:text-base text-amber-400">THE CRACKED COURTYARD</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHint(!showHint);
            }}
            className={`pixel-btn px-3 py-1.5 border-2 text-xs font-pixel flex items-center gap-1.5 ${
              showHint ? 'border-amber-400 bg-amber-950/60 text-amber-300' : 'border-zinc-700 bg-zinc-900 text-zinc-400'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>HINT</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isSolved}
            className={`pixel-btn p-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white ${
              isSolved ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            title="Reset Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="my-4 flex flex-col items-center">
        {/* Priestess Guidance */}
        <div className="w-full max-w-xl mb-4 flex items-center gap-4 p-3 bg-amber-950/40 border-2 border-amber-700/60">
          <IndianPriestessSprite size="sm" direction="south" />
          <div className="text-xs font-silkscreen text-amber-200">
            {isSolved ? (
              <span className="text-amber-300 font-pixel text-[11px]">
                "The sandstone mandalas align with the cosmic meridian! The Golden Gnomon of Ujjain is revealed!"
              </span>
            ) : (
              <span>
                "Click each cracked paving stone to rotate it 90 degrees. Align all eight cosmic rays outward from the central bindu."
              </span>
            )}
          </div>
        </div>

        {/* Hint Box */}
        {showHint && !isSolved && (
          <div className="w-full max-w-xl mb-3 p-2.5 bg-zinc-900 border border-amber-500 text-amber-200 font-silkscreen text-xs animate-in fade-in">
            ✦ Clue: The outer arrow markers (▲, ▶, ▼, ◀) must point outward toward the cardinal directions (North, East, South, West).
          </div>
        )}

        {/* 3x3 Sandstone Mandala Grid */}
        <div className="p-4 bg-stone-900 border-4 border-amber-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-3 gap-2.5">
            {tiles.map(tile => {
              const isCenter = tile.id === 5;
              const isTileAligned = (tile.currentRotation % 360) === (tile.solvedRotation % 360);

              return (
                <button
                  key={tile.id}
                  onClick={() => !isCenter && rotateTile(tile.id)}
                  disabled={isSolved || isCenter}
                  className={`w-20 h-20 md:w-24 md:h-24 p-2 flex flex-col items-center justify-center border-4 transition-all ${
                    isSolved
                      ? 'border-amber-400 bg-amber-900/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : isTileAligned
                      ? 'border-amber-600 bg-stone-800 text-amber-400 hover:border-amber-400'
                      : 'border-stone-700 bg-stone-900 text-stone-400 hover:border-amber-500 hover:bg-stone-800'
                  } ${isCenter ? 'cursor-default ring-2 ring-amber-400/50' : 'cursor-pointer active:scale-95'}`}
                >
                  <div
                    className="text-2xl md:text-3xl font-bold transition-transform duration-200"
                    style={{ transform: `rotate(${tile.currentRotation}deg)` }}
                  >
                    {tile.symbol}
                  </div>
                  <span className="font-pixel text-[8px] text-amber-300/80 mt-1">
                    {tile.quadrant}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Reward */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-800 pt-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 bg-stone-900 flex items-center justify-center text-xl">
            ☀️
          </div>
          <div>
            <div className="font-pixel text-xs text-amber-300">GOLDEN GNOMON OF UJJAIN</div>
            <div className="text-[10px] font-silkscreen text-zinc-400">
              {isSolved ? 'Acquired and stored in Codex' : 'Reward for solving The Cracked Courtyard'}
            </div>
          </div>
        </div>

        {isSolved ? (
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SOLVED
            </span>
            <button
              onClick={onBack}
              className="pixel-btn px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-pixel text-xs font-bold border-2 border-amber-300"
            >
              CONTINUE JOURNEY
            </button>
          </div>
        ) : (
          <div className="text-xs font-silkscreen text-zinc-400">
            Rotate stone tiles until cosmic mandala lines form a continuous current
          </div>
        )}
      </div>
    </div>
  );
};
