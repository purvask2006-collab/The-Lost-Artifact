import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Scale } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

// 6 Stones with shape IDs and weights (dots 1 to 5)
interface ArchStone {
  id: number;
  name: string;
  weight: number;
  icon: string;
  isKeystone?: boolean;
}

const AVAILABLE_STONES: ArchStone[] = [
  { id: 1, name: 'Left Base', weight: 4, icon: '▙' },
  { id: 2, name: 'Left Haunch', weight: 3, icon: '▛' },
  { id: 3, name: 'Right Base', weight: 4, icon: '▟' },
  { id: 4, name: 'Right Haunch', weight: 3, icon: '▜' },
  { id: 5, name: 'Central Keystone', weight: 2, icon: '▼', isKeystone: true },
];

export const CrookedArchPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.india_puzzle_3);

  // Slots: 0=Left Base, 1=Left Haunch, 2=Right Haunch, 3=Right Base, 4=Keystone (center top)
  const [placedSlots, setPlacedSlots] = useState<(ArchStone | null)[]>(() => {
    return isAlreadySolved ? [AVAILABLE_STONES[0], AVAILABLE_STONES[1], AVAILABLE_STONES[3], AVAILABLE_STONES[2], AVAILABLE_STONES[4]] : [null, null, null, null, null];
  });

  const [selectedStone, setSelectedStone] = useState<ArchStone | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Left load = slots 0 & 1 weight; Right load = slots 2 & 3 weight
  const leftLoad = (placedSlots[0]?.weight || 0) + (placedSlots[1]?.weight || 0);
  const rightLoad = (placedSlots[2]?.weight || 0) + (placedSlots[3]?.weight || 0);
  const isBalanced = leftLoad > 0 && leftLoad === rightLoad;

  const placedIds = placedSlots.filter((s): s is ArchStone => s !== null).map(s => s.id);
  const inventoryStones = AVAILABLE_STONES.filter(s => !placedIds.includes(s.id));

  const handleSelectStone = (stone: ArchStone) => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setSelectedStone(stone);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (isSolved) return;

    // Slot 4 is the keystone - can only be placed when left and right are fully placed and balanced
    if (slotIdx === 4 && (!isBalanced || placedSlots[0] === null || placedSlots[1] === null || placedSlots[2] === null || placedSlots[3] === null)) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }

    if (selectedStone) {
      if (slotIdx === 4 && !selectedStone.isKeystone) {
        soundManager.playCancel(state.soundEnabled);
        return;
      }
      if (slotIdx !== 4 && selectedStone.isKeystone) {
        soundManager.playCancel(state.soundEnabled);
        return;
      }

      soundManager.playSnapKeystone(state.soundEnabled);
      const nextSlots = [...placedSlots];
      nextSlots[slotIdx] = selectedStone;
      setPlacedSlots(nextSlots);
      setSelectedStone(null);

      // Check win condition
      const allFilled = nextSlots.every(s => s !== null);
      const nextLeft = (nextSlots[0]?.weight || 0) + (nextSlots[1]?.weight || 0);
      const nextRight = (nextSlots[2]?.weight || 0) + (nextSlots[3]?.weight || 0);

      if (allFilled && nextLeft === nextRight && nextSlots[4]?.isKeystone) {
        setIsSolved(true);
        soundManager.playSolve(state.soundEnabled);
        solvePuzzle('india_puzzle_3');
      }
    } else if (placedSlots[slotIdx] !== null) {
      // Pick up stone from slot
      soundManager.playClick(state.soundEnabled);
      setSelectedStone(placedSlots[slotIdx]);
      const nextSlots = [...placedSlots];
      nextSlots[slotIdx] = null;
      setPlacedSlots(nextSlots);
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setPlacedSlots([null, null, null, null, null]);
    setSelectedStone(null);
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
            <div className="font-pixel text-[12px] text-[#f59e0b]">CHAMBER 03 · INDIA</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE CROOKED ARCH</h2>
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
            title="Reset Arch"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="my-5 flex flex-col items-center">
        {/* Objective */}
        <div className="font-silkscreen text-[16px] text-[#fef08a] mb-3 text-center">
          Balance arch loads equally (7 vs 7) before inserting keystone.
        </div>

        {/* Load Balance Indicator Bar */}
        <div className="flex items-center gap-6 px-6 py-2 bg-[#120e1c] border-2 border-[#676b76] mb-5">
          <div className="flex items-center gap-2 font-pixel text-[14px]">
            <span className="text-[#38bdf8]">LEFT: {leftLoad}</span>
          </div>
          <Scale className={`w-6 h-6 ${isBalanced ? 'text-[#10b981] animate-pulse' : 'text-[#f59e0b]'}`} />
          <div className="flex items-center gap-2 font-pixel text-[14px]">
            <span className="text-[#f472b6]">RIGHT: {rightLoad}</span>
          </div>
        </div>

        {/* The Arch Framework */}
        <div className="relative w-80 h-64 border-4 border-[#3a334a] bg-[#120e1c] p-4 flex flex-col justify-between items-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          {/* Top Keystone Socket (Slot 4) */}
          <button
            onClick={() => handleSlotClick(4)}
            className={`w-20 h-16 border-3 flex flex-col items-center justify-center transition-all ${
              placedSlots[4]
                ? 'border-[#10b981] bg-[#1a2e26] text-[#6ee7b7]'
                : isBalanced
                ? 'border-[#e8b84a] bg-[#2a1f14] animate-pixel-glow cursor-pointer'
                : 'border-[#443c54] bg-[#181324] opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="font-pixel text-xl">{placedSlots[4]?.icon || '▼'}</span>
            <span className="font-silkscreen text-[11px] text-[#e8b84a]">KEYSTONE</span>
          </button>

          {/* Arch Left and Right Haunches & Bases */}
          <div className="w-full flex items-center justify-between px-3 mt-4">
            {/* Left Haunch (Slot 1) */}
            <button
              onClick={() => handleSlotClick(1)}
              className={`w-18 h-16 border-3 flex flex-col items-center justify-center ${
                placedSlots[1] ? 'border-[#38bdf8] bg-[#182736]' : 'border-[#443c54] bg-[#151120]'
              }`}
            >
              <span className="font-pixel text-xl">{placedSlots[1]?.icon || '·'}</span>
              <span className="font-silkscreen text-[11px]">HAUNCH ({placedSlots[1]?.weight || '?'})</span>
            </button>

            {/* Right Haunch (Slot 2) */}
            <button
              onClick={() => handleSlotClick(2)}
              className={`w-18 h-16 border-3 flex flex-col items-center justify-center ${
                placedSlots[2] ? 'border-[#f472b6] bg-[#2b1828]' : 'border-[#443c54] bg-[#151120]'
              }`}
            >
              <span className="font-pixel text-xl">{placedSlots[2]?.icon || '·'}</span>
              <span className="font-silkscreen text-[11px]">HAUNCH ({placedSlots[2]?.weight || '?'})</span>
            </button>
          </div>

          <div className="w-full flex items-center justify-between px-2">
            {/* Left Base (Slot 0) */}
            <button
              onClick={() => handleSlotClick(0)}
              className={`w-20 h-16 border-3 flex flex-col items-center justify-center ${
                placedSlots[0] ? 'border-[#38bdf8] bg-[#182736]' : 'border-[#443c54] bg-[#151120]'
              }`}
            >
              <span className="font-pixel text-xl">{placedSlots[0]?.icon || '·'}</span>
              <span className="font-silkscreen text-[11px]">BASE ({placedSlots[0]?.weight || '?'})</span>
            </button>

            {/* Right Base (Slot 3) */}
            <button
              onClick={() => handleSlotClick(3)}
              className={`w-20 h-16 border-3 flex flex-col items-center justify-center ${
                placedSlots[3] ? 'border-[#f472b6] bg-[#2b1828]' : 'border-[#443c54] bg-[#151120]'
              }`}
            >
              <span className="font-pixel text-xl">{placedSlots[3]?.icon || '·'}</span>
              <span className="font-silkscreen text-[11px]">BASE ({placedSlots[3]?.weight || '?'})</span>
            </button>
          </div>
        </div>

        {/* Stone Inventory Bench */}
        <div className="mt-5 w-full flex items-center justify-center gap-3">
          {inventoryStones.map(stone => (
            <button
              key={stone.id}
              onClick={() => handleSelectStone(stone)}
              className={`min-h-[48px] px-3.5 py-2 border-3 flex items-center gap-2 transition-all ${
                selectedStone?.id === stone.id
                  ? 'border-[#ffffff] bg-[#3a2f52] shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-105'
                  : 'border-[#676b76] bg-[#241d33] hover:border-[#e8b84a]'
              }`}
            >
              <span className="text-xl">{stone.icon}</span>
              <div className="text-left font-silkscreen text-[13px]">
                <div className="font-bold">{stone.name}</div>
                <div className="text-[#f59e0b]">WEIGHT: {stone.weight}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Reward */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 border-2 border-[#3b82f6] bg-[#131d2e] flex items-center justify-center text-2xl shrink-0">
            🔷
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#3b82f6]">MANTRA CELESTIAL SAPPHIRE</div>
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
