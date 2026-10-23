import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { YukiShrineOracle } from './YukiShrineOracle';
import { Sparkles, RotateCcw, Lightbulb, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

// Path connections for each tile: [top, right, bottom, left]
export type TilePassage = [boolean, boolean, boolean, boolean];

interface ScreenTile {
  id: number;
  passages: TilePassage; // [top, right, bottom, left]
  isEmpty?: boolean;
}

// Initial 5x5 layout designed to be solvable in a few intuitive sliding moves
const INITIAL_TILES: ScreenTile[] = [
  // Row 0
  { id: 1, passages: [false, true, true, false] },   // (0,0) Start [R, B]
  { id: 2, passages: [false, true, false, true] },   // (0,1) Horizontal [R, L]
  { id: 3, passages: [false, true, true, false] },   // (0,2) [R, B]
  { id: 4, passages: [false, false, true, true] },   // (0,3) [B, L]
  { id: 5, passages: [false, false, true, true] },   // (0,4)
  // Row 1
  { id: 6, passages: [true, false, true, false] },   // (1,0) Vertical [T, B]
  { id: 7, passages: [true, true, false, false] },   // (1,1)
  { id: 8, passages: [true, false, true, false] },   // (1,2) Vertical [T, B]
  { id: 9, passages: [true, true, true, true] },     // (1,3) Cross
  { id: 10, passages: [true, false, true, false] },  // (1,4)
  // Row 2
  { id: 11, passages: [true, true, false, false] },  // (2,0)
  { id: 12, passages: [false, true, false, true] },  // (2,1)
  { id: 13, passages: [true, true, true, false] },   // (2,2) T-junction [T, R, B]
  { id: 14, passages: [false, true, false, true] },  // (2,3)
  { id: 15, passages: [true, false, true, false] },  // (2,4)
  // Row 3
  { id: 16, passages: [false, true, true, false] },  // (3,0)
  { id: 17, passages: [false, true, false, true] },  // (3,1)
  { id: 18, passages: [true, false, true, false] },  // (3,2) Vertical [T, B]
  { id: 19, passages: [false, true, true, true] },   // (3,3)
  { id: 20, passages: [true, false, true, false] },  // (3,4)
  // Row 4
  { id: 21, passages: [true, false, false, false] },  // (4,0)
  { id: 22, passages: [false, true, false, true] },   // (4,1)
  { id: 23, passages: [true, true, false, false] },   // (4,2) Corner [T, R]
  { id: 24, passages: [false, true, false, true] },   // (4,3) Horizontal [R, L]
  { id: 25, passages: [true, false, false, true] },   // (4,4) Destination [T, L]
];

// In the initial state, one tile is empty so the player can slide screens
const INITIAL_EMPTY_INDEX = 23; // Row 4, Col 3 starts empty

export const MisplacedScreenPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = state.solvedPuzzles.japan_puzzle_1;

  const [board, setBoard] = useState<ScreenTile[]>(() => {
    return INITIAL_TILES.map((t, idx) => ({
      ...t,
      isEmpty: idx === INITIAL_EMPTY_INDEX,
    }));
  });

  const [emptyIndex, setEmptyIndex] = useState<number>(INITIAL_EMPTY_INDEX);
  const [connectedPath, setConnectedPath] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Check connectivity from (0,0) [index 0] to (4,4) [index 24]
  const evaluatePath = useCallback((currentBoard: ScreenTile[]) => {
    const rows = 5;
    const cols = 5;
    const startIndex = 0;
    const destIndex = 24;

    // Check if start tile exists and has passages
    if (currentBoard[startIndex].isEmpty || currentBoard[destIndex].isEmpty) {
      setConnectedPath([]);
      return false;
    }

    const visited = new Set<number>();
    const queue: { idx: number; path: number[] }[] = [{ idx: startIndex, path: [startIndex] }];
    visited.add(startIndex);

    let winningPath: number[] | null = null;

    while (queue.length > 0) {
      const { idx, path } = queue.shift()!;
      if (idx === destIndex) {
        winningPath = path;
        break;
      }

      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const [top, right, bottom, left] = currentBoard[idx].passages;

      // Directions: [dr, dc, myPassage, neighborPassage]
      const neighbors = [
        { dr: -1, dc: 0, open: top, opp: 2 },    // Top neighbor (needs bottom opening)
        { dr: 0, dc: 1, open: right, opp: 3 },   // Right neighbor (needs left opening)
        { dr: 1, dc: 0, open: bottom, opp: 0 },  // Bottom neighbor (needs top opening)
        { dr: 0, dc: -1, open: left, opp: 1 },   // Left neighbor (needs right opening)
      ];

      for (const { dr, dc, open, opp } of neighbors) {
        if (!open) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        const nIdx = nr * cols + nc;
        if (visited.has(nIdx) || currentBoard[nIdx].isEmpty) continue;

        const neighborTile = currentBoard[nIdx];
        if (neighborTile.passages[opp]) {
          visited.add(nIdx);
          queue.push({ idx: nIdx, path: [...path, nIdx] });
        }
      }
    }

    if (winningPath) {
      setConnectedPath(winningPath);
      return true;
    } else {
      // Find connected from start for visual glow feedback
      setConnectedPath(Array.from(visited));
      return false;
    }
  }, []);

  useEffect(() => {
    const solved = evaluatePath(board);
    if (solved && !isSolved) {
      setIsSolved(true);
      soundManager.playSolve(state.soundEnabled);
      solvePuzzle('japan_puzzle_1');
    }
  }, [board, evaluatePath, isSolved, solvePuzzle, state.soundEnabled]);

  // Handle tile sliding click
  const handleTileClick = (index: number) => {
    if (isSolved || board[index].isEmpty) return;

    const r = Math.floor(index / 5);
    const c = index % 5;
    const er = Math.floor(emptyIndex / 5);
    const ec = emptyIndex % 5;

    // Check orthogonal adjacency to empty slot
    const isAdjacent = (Math.abs(r - er) === 1 && c === ec) || (Math.abs(c - ec) === 1 && r === er);

    if (!isAdjacent) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }

    // Slide tile into empty space
    soundManager.playSlide(state.soundEnabled);
    const newBoard = [...board];
    newBoard[emptyIndex] = { ...board[index], isEmpty: false };
    newBoard[index] = { ...board[emptyIndex], isEmpty: true };

    setBoard(newBoard);
    setEmptyIndex(index);
    setHintMessage(null);
  };

  const handleRestart = () => {
    soundManager.playClick(state.soundEnabled);
    setBoard(INITIAL_TILES.map((t, idx) => ({ ...t, isEmpty: idx === INITIAL_EMPTY_INDEX })));
    setEmptyIndex(INITIAL_EMPTY_INDEX);
    setIsSolved(isAlreadySolved);
    setHintMessage(null);
  };

  const handleHint = () => {
    soundManager.playClick(state.soundEnabled);
    setHintMessage(
      'Slide the horizontal screen at the bottom to connect the stone channel leading straight to the lantern.'
    );
  };

  return (
    <div className="relative min-h-[560px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-zinc-950/95 border-4 border-sky-800 shadow-[0_0_35px_rgba(2,132,199,0.3)] text-zinc-100 flex flex-col justify-between">
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
          <span className="font-pixel text-[10px] text-sky-400">JAPAN · CHAMBER I</span>
          <h2 className="text-sm md:text-base font-pixel text-zinc-100">
            THE MISPLACED SCREEN
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleHint}
            className="pixel-btn p-1.5 border-2 border-sky-700 bg-sky-950/60 text-sky-300 font-pixel text-xs"
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
        {/* Left: Companion Guidance */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start p-4 bg-zinc-900 border-2 border-sky-900/60">
          <div className="flex items-center gap-3 mb-3">
            <YukiShrineOracle size="md" interactive={false} />
            <div>
              <div className="font-pixel text-xs text-sky-400">YUKI</div>
              <div className="text-[10px] text-zinc-400 font-silkscreen">Shrine Oracle</div>
            </div>
          </div>
          <p className="font-silkscreen text-xs text-zinc-300 leading-relaxed mb-3">
            "Slide the wooden shoji panels so the glowing spirit orb in the upper corner connects smoothly to the sacred stone lantern below."
          </p>

          {hintMessage && (
            <div className="w-full p-2.5 bg-sky-950/40 border border-sky-700/70 text-[11px] text-sky-200 font-silkscreen">
              {hintMessage}
            </div>
          )}

          {isSolved && (
            <div className="w-full mt-3 p-3 bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 font-pixel text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div>LANTERN LIT!</div>
                <div className="text-[9px] text-emerald-400/80 font-silkscreen mt-0.5">
                  Spirit Seal 1 Recovered
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: The 5x5 Sliding Screen Grid */}
        <div className="md:col-span-8 flex flex-col items-center">
          {/* Target Indicators */}
          <div className="w-full max-w-[340px] flex items-center justify-between text-[10px] font-pixel mb-2 px-1">
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              START (ORB)
            </span>
            <span className={isSolved ? 'text-amber-300 font-bold' : 'text-zinc-500'}>
              {isSolved ? '🏮 LANTERN (ILLUMINATED)' : '🏮 DESTINATION'}
            </span>
          </div>

          {/* Grid Board */}
          <div className="grid grid-cols-5 gap-1.5 p-3 bg-zinc-900 border-4 border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            {board.map((tile, idx) => {
              const r = Math.floor(idx / 5);
              const c = idx % 5;
              const er = Math.floor(emptyIndex / 5);
              const ec = emptyIndex % 5;
              const isAdjacent = (Math.abs(r - er) === 1 && c === ec) || (Math.abs(c - ec) === 1 && r === er);
              const isStart = idx === 0;
              const isDest = idx === 24;
              const isConnected = connectedPath.includes(idx);

              if (tile.isEmpty) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="w-14 h-14 bg-zinc-950/80 border-2 border-dashed border-zinc-800 flex items-center justify-center"
                  >
                    <span className="font-pixel text-[8px] text-zinc-700">EMPTY</span>
                  </div>
                );
              }

              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(idx)}
                  disabled={isSolved || !isAdjacent}
                  className={`relative w-14 h-14 border-2 transition-all cursor-pointer ${
                    isAdjacent && !isSolved
                      ? 'border-sky-400 hover:scale-105 shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                      : 'border-zinc-800'
                  } ${
                    isConnected
                      ? 'bg-sky-950/60 shadow-[inset_0_0_10px_rgba(56,189,248,0.5)]'
                      : 'bg-zinc-800/90'
                  }`}
                  title={isAdjacent ? 'Click to slide' : ''}
                >
                  {/* Shoji Wood Frame Texture */}
                  <div className="absolute inset-0.5 bg-[#2d1b13] border border-[#52301c] flex items-center justify-center">
                    {/* SVG Drawn Channel Passages */}
                    <svg viewBox="0 0 32 32" className="w-full h-full">
                      {/* Center Hub if any passage */}
                      <rect x="12" y="12" width="8" height="8" fill={isConnected ? '#38bdf8' : '#e2e8f0'} />
                      {/* Top Passage */}
                      {tile.passages[0] && (
                        <rect x="12" y="0" width="8" height="12" fill={isConnected ? '#38bdf8' : '#e2e8f0'} />
                      )}
                      {/* Right Passage */}
                      {tile.passages[1] && (
                        <rect x="20" y="12" width="12" height="8" fill={isConnected ? '#38bdf8' : '#e2e8f0'} />
                      )}
                      {/* Bottom Passage */}
                      {tile.passages[2] && (
                        <rect x="12" y="20" width="8" height="12" fill={isConnected ? '#38bdf8' : '#e2e8f0'} />
                      )}
                      {/* Left Passage */}
                      {tile.passages[3] && (
                        <rect x="0" y="12" width="12" height="8" fill={isConnected ? '#38bdf8' : '#e2e8f0'} />
                      )}

                      {/* Start Orb Indicator */}
                      {isStart && (
                        <circle cx="16" cy="16" r="5" fill="#facc15" stroke="#fef08a" strokeWidth="1.5">
                          <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Destination Lantern Indicator */}
                      {isDest && (
                        <g transform="translate(10, 10)">
                          <rect x="2" y="2" width="8" height="8" fill={isSolved ? '#fbbf24' : '#64748b'} />
                          {isSolved && (
                            <circle cx="6" cy="6" r="7" fill="#fef08a" opacity="0.6">
                              <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite" />
                            </circle>
                          )}
                        </g>
                      )}
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-[10px] text-zinc-500 font-silkscreen">
            Click highlighted screens adjacent to the open slot to slide them.
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t-2 border-zinc-800 flex items-center justify-between text-xs font-silkscreen">
        <span className="text-zinc-400">
          Chamber Status: <strong className={isSolved ? 'text-emerald-400 font-pixel text-[11px]' : 'text-amber-400 font-pixel text-[11px]'}>
            {isSolved ? 'SOLVED' : 'IN PROGRESS'}
          </strong>
        </span>

        {isSolved ? (
          <button
            onClick={onBack}
            className="pixel-btn px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-pixel text-xs font-bold border-2 border-emerald-300"
          >
            CLAIM SPIRIT SEAL 1 & RETURN
          </button>
        ) : (
          <button
            onClick={onBack}
            className="pixel-btn px-4 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 font-pixel text-xs"
          >
            RETURN TO SHRINE
          </button>
        )}
      </div>
    </div>
  );
};
