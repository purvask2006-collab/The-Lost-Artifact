import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { KiyaHorizonWatcher } from './KiyaHorizonWatcher';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Droplets } from 'lucide-react';
import { soundManager } from '../../utils/audio';

// Pipe connections: [top, right, bottom, left]
export type PipeOpenings = [boolean, boolean, boolean, boolean];

interface PipeTile {
  id: number;
  type: 'straight' | 'elbow' | 'tee' | 'cross';
  baseOpenings: PipeOpenings;
  solvedRotation: number;
  initialRotation: number;
  currentRotation: number;
}

function getRotatedPipeOpenings(base: PipeOpenings, rotation: number): PipeOpenings {
  const steps = (Math.floor(rotation / 90) % 4 + 4) % 4;
  const rotated: PipeOpenings = [false, false, false, false];
  for (let i = 0; i < 4; i++) {
    rotated[(i + steps) % 4] = base[i];
  }
  return rotated;
}

// 4x4 Grid tested layout
// Connects (0,0) (Inlet at top) -> (3,3) (Outlet at right into Basin)
const INITIAL_PIPE_TILES: { id: number; type: 'straight' | 'elbow' | 'tee' | 'cross'; base: PipeOpenings; solvedRot: number; initRot: number }[] = [
  // Row 0
  { id: 1, type: 'elbow', base: [true, true, false, false], solvedRot: 90, initRot: 0 },    // (0,0) Inlet from Top, turns Right [T, R] -> solved: [R, B]
  { id: 2, type: 'straight', base: [false, true, false, true], solvedRot: 0, initRot: 90 }, // (0,1) Horizontal [R, L]
  { id: 3, type: 'elbow', base: [true, true, false, false], solvedRot: 180, initRot: 270 }, // (0,2) Turns Down [B, L]
  { id: 4, type: 'straight', base: [true, false, true, false], solvedRot: 0, initRot: 90 }, // (0,3) Filler
  // Row 1
  { id: 5, type: 'straight', base: [true, false, true, false], solvedRot: 0, initRot: 90 }, // (1,0) Filler
  { id: 6, type: 'straight', base: [false, true, false, true], solvedRot: 0, initRot: 90 }, // (1,1) Filler
  { id: 7, type: 'straight', base: [true, false, true, false], solvedRot: 0, initRot: 90 }, // (1,2) Vertical [T, B]
  { id: 8, type: 'elbow', base: [true, true, false, false], solvedRot: 90, initRot: 180 },   // (1,3) Filler
  // Row 2
  { id: 9, type: 'elbow', base: [true, true, false, false], solvedRot: 90, initRot: 270 },   // (2,0) Filler
  { id: 10, type: 'straight', base: [false, true, false, true], solvedRot: 0, initRot: 90 }, // (2,1) Filler
  { id: 11, type: 'elbow', base: [true, true, false, false], solvedRot: 0, initRot: 270 },   // (2,2) Turns Right [T, R]
  { id: 12, type: 'elbow', base: [true, true, false, false], solvedRot: 180, initRot: 90 },  // (2,3) Turns Down [B, L]
  // Row 3
  { id: 13, type: 'straight', base: [false, true, false, true], solvedRot: 0, initRot: 90 }, // (3,0) Filler
  { id: 14, type: 'elbow', base: [true, true, false, false], solvedRot: 90, initRot: 0 },   // (3,1) Filler
  { id: 15, type: 'straight', base: [false, true, false, true], solvedRot: 0, initRot: 90 }, // (3,2) Filler
  { id: 16, type: 'elbow', base: [true, true, false, false], solvedRot: 270, initRot: 90 },  // (3,3) Enters from Top, flows Right to Basin [T, R]
];

export const CrackedBasinPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = state.solvedPuzzles.egypt_puzzle_2;

  const [tiles, setTiles] = useState<PipeTile[]>(() => {
    return INITIAL_PIPE_TILES.map(t => ({
      id: t.id,
      type: t.type,
      baseOpenings: t.base,
      solvedRotation: t.solvedRot,
      initialRotation: t.initRot,
      currentRotation: isAlreadySolved ? t.solvedRot : t.initRot,
    }));
  });

  const [waterPath, setWaterPath] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Validate complete water path from (0,0) to (3,3)
  const validateWaterFlow = useCallback((currentTiles: PipeTile[]) => {
    const size = 4;
    const startIndex = 0;
    const destIndex = 15;

    // Inlet enters at top of (0,0)
    const startOpenings = getRotatedPipeOpenings(
      currentTiles[startIndex].baseOpenings,
      currentTiles[startIndex].currentRotation
    );
    if (!startOpenings[0]) {
      setWaterPath([]);
      return false;
    }

    const visited = new Set<number>();
    const queue: { idx: number; path: number[] }[] = [{ idx: startIndex, path: [startIndex] }];
    visited.add(startIndex);

    let winningPath: number[] | null = null;

    while (queue.length > 0) {
      const { idx, path } = queue.shift()!;
      if (idx === destIndex) {
        // Destination outlet must open towards the basin (Right)
        const destOpenings = getRotatedPipeOpenings(
          currentTiles[destIndex].baseOpenings,
          currentTiles[destIndex].currentRotation
        );
        if (destOpenings[1]) {
          winningPath = path;
          break;
        }
      }

      const r = Math.floor(idx / size);
      const c = idx % size;
      const openings = getRotatedPipeOpenings(
        currentTiles[idx].baseOpenings,
        currentTiles[idx].currentRotation
      );

      const neighbors = [
        { dr: -1, dc: 0, open: openings[0], opp: 2 }, // Top
        { dr: 0, dc: 1, open: openings[1], opp: 3 },  // Right
        { dr: 1, dc: 0, open: openings[2], opp: 0 },  // Bottom
        { dr: 0, dc: -1, open: openings[3], opp: 1 }, // Left
      ];

      for (const { dr, dc, open, opp } of neighbors) {
        if (!open) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;

        const nIdx = nr * size + nc;
        if (visited.has(nIdx)) continue;

        const neighborOpenings = getRotatedPipeOpenings(
          currentTiles[nIdx].baseOpenings,
          currentTiles[nIdx].currentRotation
        );

        if (neighborOpenings[opp]) {
          visited.add(nIdx);
          queue.push({ idx: nIdx, path: [...path, nIdx] });
        }
      }
    }

    if (winningPath) {
      setWaterPath(winningPath);
      return true;
    } else {
      setWaterPath(Array.from(visited));
      return false;
    }
  }, []);

  useEffect(() => {
    const solved = validateWaterFlow(tiles);
    if (solved && !isSolved) {
      setIsSolved(true);
      soundManager.playWaterFlow(state.soundEnabled);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('egypt_puzzle_2');
    }
  }, [tiles, validateWaterFlow, isSolved, solvePuzzle, state.soundEnabled]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);

    setTiles(prev =>
      prev.map((tile, i) =>
        i === index ? { ...tile, currentRotation: (tile.currentRotation + 90) % 360 } : tile
      )
    );
    setHintMessage(null);
  };

  const handleRestart = () => {
    soundManager.playClick(state.soundEnabled);
    setTiles(
      INITIAL_PIPE_TILES.map(t => ({
        id: t.id,
        type: t.type,
        baseOpenings: t.base,
        solvedRotation: t.solvedRot,
        initialRotation: t.initRot,
        currentRotation: t.initRot,
      }))
    );
    setIsSolved(isAlreadySolved);
    setHintMessage(null);
  };

  const handleHint = () => {
    soundManager.playClick(state.soundEnabled);
    setHintMessage(
      'Align the top-left aqueduct pipe so it catches the inlet from above and flows right through the upper conduit.'
    );
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-zinc-950/95 border-4 border-yellow-800 shadow-[0_0_35px_rgba(202,138,4,0.3)] text-zinc-100 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
        <button
          onClick={onBack}
          className="pixel-btn px-3 py-1.5 flex items-center gap-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-300 font-pixel text-xs hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <div className="text-center">
          <span className="font-pixel text-[10px] text-yellow-400">EGYPT · CHAMBER II</span>
          <h2 className="text-sm md:text-base font-pixel text-zinc-100">
            THE CRACKED BASIN
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleHint}
            className="pixel-btn p-1.5 border-2 border-yellow-700 bg-yellow-950/60 text-yellow-300 font-pixel text-xs"
            title="Hint"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            onClick={handleRestart}
            className="pixel-btn p-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"
            title="Reset Puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
        {/* Left: Companion Kiya & Aqueduct Objectives */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start p-4 bg-zinc-900 border-2 border-yellow-900/60">
          <div className="flex items-center gap-3 mb-3">
            <KiyaHorizonWatcher size="md" interactive={false} />
            <div>
              <div className="font-pixel text-xs text-yellow-400">KIYA</div>
              <div className="text-[10px] text-zinc-400 font-silkscreen">Horizon Watcher</div>
            </div>
          </div>
          <p className="font-silkscreen text-xs text-zinc-300 leading-relaxed mb-3">
            "Rotate the aqueduct segments. The Nile spring waters must flow continuously from the upper conduit until they fill the alabaster basin."
          </p>

          {/* Basin Reservoir Status */}
          <div className="w-full p-2.5 bg-zinc-950 border border-cyan-800/70 mb-3 text-xs font-silkscreen">
            <div className="text-[10px] font-pixel text-cyan-400 mb-1 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>ALABASTER BASIN LEVEL:</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Reservoir Water:</span>
              <span className={isSolved ? 'text-cyan-300 font-pixel font-bold' : 'text-zinc-500'}>
                {isSolved ? 'FULL & RADIANT' : 'PARCHED & EMPTY'}
              </span>
            </div>
          </div>

          {hintMessage && (
            <div className="w-full p-2 bg-yellow-950/40 border border-yellow-600/70 text-[11px] text-yellow-200 font-silkscreen mb-3">
              {hintMessage}
            </div>
          )}

          {isSolved && (
            <div className="w-full p-3 bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 font-pixel text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div>BASIN FILLED!</div>
                <div className="text-[9px] text-emerald-400/80 font-silkscreen mt-0.5">
                  Sun Symbol 2 Recovered
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: The 4x4 Rotatable Pipe Aqueduct Grid */}
        <div className="md:col-span-8 flex flex-col items-center">
          {/* Inlet & Outlet Indicators */}
          <div className="w-full max-w-[340px] flex items-center justify-between text-[10px] font-pixel mb-2 px-1">
            <span className="text-cyan-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400 animate-bounce" />
              NILE INLET (SOURCE)
            </span>
            <span className={isSolved ? 'text-cyan-300 font-bold' : 'text-zinc-500'}>
              TURQUOISE BASIN 🏺
            </span>
          </div>

          {/* Pipe Grid */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-[#130d06] border-4 border-yellow-900 shadow-[0_0_25px_rgba(0,0,0,0.9)]">
            {tiles.map((tile, idx) => {
              const openings = getRotatedPipeOpenings(tile.baseOpenings, tile.currentRotation);
              const hasWater = waterPath.includes(idx);
              const isStart = idx === 0;
              const isDest = idx === 15;

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(idx)}
                  disabled={isSolved}
                  className={`relative w-16 h-16 border-2 transition-transform cursor-pointer active:scale-95 ${
                    isSolved
                      ? 'border-cyan-500 bg-[#08202b]'
                      : 'border-zinc-700 hover:border-yellow-400 bg-[#1c140d]'
                  } ${
                    hasWater
                      ? 'shadow-[inset_0_0_12px_rgba(6,182,212,0.6)]'
                      : ''
                  }`}
                  title="Click to rotate pipe 90°"
                >
                  {/* Sandstone Conduit Surface */}
                  <div className="absolute inset-0.5 bg-[#291b10] border border-[#452d18] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 32 32" className="w-full h-full">
                      {/* Pipe Outer Channel (Gray/Gold Sandstone) */}
                      <rect x="10" y="10" width="12" height="12" fill="#523a24" />

                      {/* Pipe Inner Flow (Cyan Water if connected, dark stone if empty) */}
                      <rect
                        x="12"
                        y="12"
                        width="8"
                        height="8"
                        fill={hasWater ? '#06b6d4' : '#1c140d'}
                      />

                      {/* Top Opening */}
                      {openings[0] && (
                        <>
                          <rect x="10" y="0" width="12" height="12" fill="#523a24" />
                          <rect x="12" y="0" width="8" height="12" fill={hasWater ? '#06b6d4' : '#1c140d'} />
                        </>
                      )}
                      {/* Right Opening */}
                      {openings[1] && (
                        <>
                          <rect x="20" y="10" width="12" height="12" fill="#523a24" />
                          <rect x="20" y="12" width="12" height="8" fill={hasWater ? '#06b6d4' : '#1c140d'} />
                        </>
                      )}
                      {/* Bottom Opening */}
                      {openings[2] && (
                        <>
                          <rect x="10" y="20" width="12" height="12" fill="#523a24" />
                          <rect x="12" y="20" width="8" height="12" fill={hasWater ? '#06b6d4' : '#1c140d'} />
                        </>
                      )}
                      {/* Left Opening */}
                      {openings[3] && (
                        <>
                          <rect x="0" y="10" width="12" height="12" fill="#523a24" />
                          <rect x="0" y="12" width="12" height="8" fill={hasWater ? '#06b6d4' : '#1c140d'} />
                        </>
                      )}

                      {/* Water shimmer effect if active */}
                      {hasWater && (
                        <circle cx="16" cy="16" r="3" fill="#bae6fd">
                          <animate attributeName="r" values="2;4;2" dur="1.2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Inlet Marker */}
                      {isStart && (
                        <circle cx="16" cy="4" r="2.5" fill="#facc15" />
                      )}

                      {/* Outlet Marker */}
                      {isDest && (
                        <circle cx="28" cy="16" r="2.5" fill="#06b6d4" />
                      )}
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-[10px] text-zinc-500 font-silkscreen">
            Click pipe conduits to rotate them 90° and connect the water flow.
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t-2 border-zinc-800 flex items-center justify-between text-xs font-silkscreen">
        <span className="text-zinc-400">
          Aqueduct Status: <strong className={isSolved ? 'text-emerald-400 font-pixel text-[11px]' : 'text-cyan-400 font-pixel text-[11px]'}>
            {isSolved ? 'WATER ROUTE ESTABLISHED' : 'PIPE ROTATION INCOMPLETE'}
          </strong>
        </span>

        {isSolved ? (
          <button
            onClick={onBack}
            className="pixel-btn px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-pixel text-xs font-bold border-2 border-emerald-300"
          >
            CLAIM SUN SYMBOL 2 & RETURN
          </button>
        ) : (
          <button
            onClick={onBack}
            className="pixel-btn px-4 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 font-pixel text-xs"
          >
            RETURN TO NECROPOLIS
          </button>
        )}
      </div>
    </div>
  );
};
