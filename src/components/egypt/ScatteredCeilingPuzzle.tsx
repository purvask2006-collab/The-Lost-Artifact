import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { KiyaHorizonWatcher } from './KiyaHorizonWatcher';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

// Tile connections: [top, right, bottom, left]
export type StarTileConnections = [boolean, boolean, boolean, boolean];

interface ConstellationTile {
  id: number;
  initialRotation: number; // 0, 90, 180, 270 degrees
  baseConnections: StarTileConnections; // at 0 deg: [top, right, bottom, left]
  currentRotation: number;
  hasStar?: boolean;
}

// Function to rotate connections by rotation degrees (in multiples of 90)
function getRotatedConnections(base: StarTileConnections, rotation: number): StarTileConnections {
  const steps = (Math.floor(rotation / 90) % 4 + 4) % 4;
  const rotated: StarTileConnections = [false, false, false, false];
  for (let i = 0; i < 4; i++) {
    rotated[(i + steps) % 4] = base[i];
  }
  return rotated;
}

// 4x4 Grid definition
// Designed so that at target rotation, an unbroken constellation connects (0,0) -> (3,3)
const INITIAL_CONSTELLATION_TILES: { id: number; base: StarTileConnections; solvedRot: number; initRot: number; hasStar?: boolean }[] = [
  // Row 0
  { id: 1, base: [false, true, true, false], solvedRot: 0, initRot: 90, hasStar: true },   // (0,0) Sirius [R, B]
  { id: 2, base: [false, true, false, true], solvedRot: 0, initRot: 270 },                 // (0,1) Horizontal [R, L]
  { id: 3, base: [false, false, true, true], solvedRot: 0, initRot: 180 },                 // (0,2) Corner [B, L]
  { id: 4, base: [false, true, false, true], solvedRot: 0, initRot: 90 },                  // (0,3) Filler
  // Row 1
  { id: 5, base: [true, false, true, false], solvedRot: 0, initRot: 90 },                  // (1,0) Filler
  { id: 6, base: [false, true, true, false], solvedRot: 0, initRot: 270, hasStar: true },  // (1,1) Belt Star 1 [R, B]
  { id: 7, base: [true, false, true, false], solvedRot: 0, initRot: 90 },                  // (1,2) Vertical [T, B]
  { id: 8, base: [false, true, true, false], solvedRot: 0, initRot: 180 },                 // (1,3) Filler
  // Row 2
  { id: 9, base: [true, false, true, false], solvedRot: 0, initRot: 90 },                  // (2,0) Filler
  { id: 10, base: [true, true, false, false], solvedRot: 0, initRot: 180, hasStar: true }, // (2,1) Belt Star 2 [T, R]
  { id: 11, base: [true, true, true, false], solvedRot: 0, initRot: 270, hasStar: true },  // (2,2) Belt Star 3 [T, R, B]
  { id: 12, base: [false, true, false, true], solvedRot: 0, initRot: 90 },                 // (2,3) Filler
  // Row 3
  { id: 13, base: [true, false, false, false], solvedRot: 0, initRot: 90 },                // (3,0) Filler
  { id: 14, base: [false, true, false, true], solvedRot: 0, initRot: 270 },                // (3,1) Filler
  { id: 15, base: [false, true, false, true], solvedRot: 0, initRot: 90 },                 // (3,2) Horizontal [R, L]
  { id: 16, base: [true, false, false, true], solvedRot: 0, initRot: 180, hasStar: true }, // (3,3) Zenith Star [T, L]
];

export const ScatteredCeilingPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = state.solvedPuzzles.egypt_puzzle_1;

  const [tiles, setTiles] = useState<ConstellationTile[]>(() => {
    return INITIAL_CONSTELLATION_TILES.map(t => ({
      id: t.id,
      baseConnections: t.base,
      initialRotation: t.initRot,
      currentRotation: isAlreadySolved ? t.solvedRot : t.initRot,
      hasStar: t.hasStar,
    }));
  });

  const [connectedPath, setConnectedPath] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Validate constellation path from (0,0) to (3,3)
  const validateConstellation = useCallback((currentTiles: ConstellationTile[]) => {
    const size = 4;
    const startIndex = 0;
    const endIndex = 15;

    const visited = new Set<number>();
    const queue: { idx: number; path: number[] }[] = [{ idx: startIndex, path: [startIndex] }];
    visited.add(startIndex);

    let winningPath: number[] | null = null;

    while (queue.length > 0) {
      const { idx, path } = queue.shift()!;
      if (idx === endIndex) {
        winningPath = path;
        break;
      }

      const r = Math.floor(idx / size);
      const c = idx % size;
      const conn = getRotatedConnections(currentTiles[idx].baseConnections, currentTiles[idx].currentRotation);

      const neighbors = [
        { dr: -1, dc: 0, open: conn[0], opp: 2 }, // Top
        { dr: 0, dc: 1, open: conn[1], opp: 3 },  // Right
        { dr: 1, dc: 0, open: conn[2], opp: 0 },  // Bottom
        { dr: 0, dc: -1, open: conn[3], opp: 1 }, // Left
      ];

      for (const { dr, dc, open, opp } of neighbors) {
        if (!open) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;

        const nIdx = nr * size + nc;
        if (visited.has(nIdx)) continue;

        const neighborConn = getRotatedConnections(
          currentTiles[nIdx].baseConnections,
          currentTiles[nIdx].currentRotation
        );

        if (neighborConn[opp]) {
          visited.add(nIdx);
          queue.push({ idx: nIdx, path: [...path, nIdx] });
        }
      }
    }

    if (winningPath) {
      setConnectedPath(winningPath);
      return true;
    } else {
      setConnectedPath(Array.from(visited));
      return false;
    }
  }, []);

  useEffect(() => {
    const solved = validateConstellation(tiles);
    if (solved && !isSolved) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('egypt_puzzle_1');
    }
  }, [tiles, validateConstellation, isSolved, solvePuzzle, state.soundEnabled]);

  // Handle tile rotation click
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
      INITIAL_CONSTELLATION_TILES.map(t => ({
        id: t.id,
        baseConnections: t.base,
        initialRotation: t.initRot,
        currentRotation: t.initRot,
        hasStar: t.hasStar,
      }))
    );
    setIsSolved(isAlreadySolved);
    setHintMessage(null);
  };

  const handleHint = () => {
    soundManager.playClick(state.soundEnabled);
    setHintMessage(
      'Align the center star tiles (Belt Stars) so their meridian lines point diagonal towards the High Zenith star in the bottom-right.'
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
          <span className="font-pixel text-[10px] text-yellow-400">EGYPT · CHAMBER I</span>
          <h2 className="text-sm md:text-base font-pixel text-zinc-100">
            THE SCATTERED CEILING
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
        {/* Left: Companion Kiya & Target Pattern Blueprint */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start p-4 bg-zinc-900 border-2 border-yellow-900/60">
          <div className="flex items-center gap-3 mb-3">
            <KiyaHorizonWatcher size="md" interactive={false} />
            <div>
              <div className="font-pixel text-xs text-yellow-400">KIYA</div>
              <div className="text-[10px] text-zinc-400 font-silkscreen">Horizon Watcher</div>
            </div>
          </div>
          <p className="font-silkscreen text-xs text-zinc-300 leading-relaxed mb-3">
            "Rotate the carved celestial slabs. The holy meridian of Sirius must link with the three Belt Stars to the High Zenith."
          </p>

          {/* Target Pattern Reference Card */}
          <div className="w-full p-2.5 bg-zinc-950 border border-yellow-700/60 mb-3 text-xs font-silkscreen">
            <div className="text-[10px] font-pixel text-yellow-400 mb-1 flex items-center gap-1">
              <span>✦</span>
              <span>ORION CONSTELLATION MERIDIAN</span>
            </div>
            <div className="text-[11px] text-zinc-400 space-y-0.5">
              <div>• Origin: Sirius Star (Top-Left)</div>
              <div>• Meridian: Three Belt Stars</div>
              <div>• Apex: High Zenith (Bottom-Right)</div>
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
                <div>CONSTELLATION ALIGNED!</div>
                <div className="text-[9px] text-emerald-400/80 font-silkscreen mt-0.5">
                  Sun Symbol 1 Recovered
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: The 4x4 Rotatable Constellation Ceiling Grid */}
        <div className="md:col-span-8 flex flex-col items-center">
          {/* Constellation Header */}
          <div className="w-full max-w-[340px] flex items-center justify-between text-[10px] font-pixel mb-2 px-1">
            <span className="text-yellow-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              SIRIUS (START)
            </span>
            <span className={isSolved ? 'text-yellow-300 font-bold' : 'text-zinc-500'}>
              ZENITH APEX (END) ⭐
            </span>
          </div>

          {/* Grid of Rotatable Tiles */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-[#0a0f1d] border-4 border-yellow-900 shadow-[0_0_25px_rgba(0,0,0,0.9)]">
            {tiles.map((tile, idx) => {
              const conn = getRotatedConnections(tile.baseConnections, tile.currentRotation);
              const isConnected = connectedPath.includes(idx);
              const isStart = idx === 0;
              const isEnd = idx === 15;

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(idx)}
                  disabled={isSolved}
                  className={`relative w-16 h-16 border-2 transition-transform cursor-pointer active:scale-95 ${
                    isSolved
                      ? 'border-yellow-500 bg-[#0d172e]'
                      : 'border-zinc-700 hover:border-yellow-400 bg-[#0a0f1d]'
                  } ${
                    isConnected
                      ? 'shadow-[inset_0_0_12px_rgba(250,204,21,0.5)]'
                      : ''
                  }`}
                  title="Click to rotate tile 90°"
                >
                  {/* Granite Stone Tile Surface */}
                  <div className="absolute inset-0.5 bg-[#1e293b]/70 border border-[#334155] flex items-center justify-center overflow-hidden">
                    {/* SVG Constellation Line Segments */}
                    <svg viewBox="0 0 32 32" className="w-full h-full">
                      {/* Deep night stars background dots */}
                      <circle cx="6" cy="6" r="0.8" fill="#94a3b8" opacity="0.4" />
                      <circle cx="26" cy="24" r="0.8" fill="#94a3b8" opacity="0.4" />

                      {/* Center Hub */}
                      <circle
                        cx="16"
                        cy="16"
                        r={tile.hasStar ? 4 : 2}
                        fill={isConnected ? '#fde047' : '#94a3b8'}
                        stroke={isConnected ? '#ca8a04' : '#475569'}
                        strokeWidth={tile.hasStar ? 1.5 : 0.5}
                      />

                      {/* Top Line Segment */}
                      {conn[0] && (
                        <line
                          x1="16"
                          y1="0"
                          x2="16"
                          y2="16"
                          stroke={isConnected ? '#fde047' : '#94a3b8'}
                          strokeWidth={isConnected ? 3 : 2}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Right Line Segment */}
                      {conn[1] && (
                        <line
                          x1="16"
                          y1="16"
                          x2="32"
                          y2="16"
                          stroke={isConnected ? '#fde047' : '#94a3b8'}
                          strokeWidth={isConnected ? 3 : 2}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Bottom Line Segment */}
                      {conn[2] && (
                        <line
                          x1="16"
                          y1="16"
                          x2="16"
                          y2="32"
                          stroke={isConnected ? '#fde047' : '#94a3b8'}
                          strokeWidth={isConnected ? 3 : 2}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Left Line Segment */}
                      {conn[3] && (
                        <line
                          x1="0"
                          y1="16"
                          x2="16"
                          y2="16"
                          stroke={isConnected ? '#fde047' : '#94a3b8'}
                          strokeWidth={isConnected ? 3 : 2}
                          strokeLinecap="round"
                        />
                      )}

                      {/* Golden Star Glyph for marked stars */}
                      {tile.hasStar && (
                        <g transform="translate(12, 12)">
                          <polygon
                            points="4,0 5.2,2.8 8,4 5.2,5.2 4,8 2.8,5.2 0,4 2.8,2.8"
                            fill={isConnected ? '#fef08a' : '#06b6d4'}
                          />
                        </g>
                      )}

                      {/* Start indicator */}
                      {isStart && (
                        <circle cx="16" cy="16" r="6" fill="none" stroke="#facc15" strokeWidth="1.5">
                          <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* End indicator */}
                      {isEnd && (
                        <circle cx="16" cy="16" r="6" fill="none" stroke="#06b6d4" strokeWidth="1.5">
                          <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-[10px] text-zinc-500 font-silkscreen">
            Tap or click stone slabs to rotate them 90° and connect the stars.
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t-2 border-zinc-800 flex items-center justify-between text-xs font-silkscreen">
        <span className="text-zinc-400">
          Ceiling Status: <strong className={isSolved ? 'text-emerald-400 font-pixel text-[11px]' : 'text-yellow-400 font-pixel text-[11px]'}>
            {isSolved ? 'CONSTELLATION MERIDIAN COMPLETE' : 'ROTATION REQUIRED'}
          </strong>
        </span>

        {isSolved ? (
          <button
            onClick={onBack}
            className="pixel-btn px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-pixel text-xs font-bold border-2 border-emerald-300"
          >
            CLAIM SUN SYMBOL 1 & RETURN
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
