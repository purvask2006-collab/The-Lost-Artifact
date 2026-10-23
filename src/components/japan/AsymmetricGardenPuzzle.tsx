import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

interface GardenItem {
  id: string;
  name: string;
  icon: string;
  type: 'stone' | 'lantern' | 'bamboo';
}

const ITEMS: GardenItem[] = [
  { id: 'stone_1', name: 'Moss Stone', icon: '🪨', type: 'stone' },
  { id: 'lantern_1', name: 'Stone Lantern', icon: '🏮', type: 'lantern' },
  { id: 'bamboo_1', name: 'Bamboo Sprout', icon: '🎍', type: 'bamboo' },
  { id: 'stone_2', name: 'River Pebble', icon: '⚪', type: 'stone' },
];

export const AsymmetricGardenPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.japan_puzzle_2);

  // 4 right-side garden slots: [Top, Right, Bottom, Center]
  // Target solution matching mirror harmony: Top=Lantern, Center=Bamboo, Bottom=Stone, Right=Stone2
  const [placed, setPlaced] = useState<(GardenItem | null)[]>(() => {
    return isAlreadySolved ? [ITEMS[1], ITEMS[3], ITEMS[0], ITEMS[2]] : [null, null, null, null];
  });

  const [selectedItem, setSelectedItem] = useState<GardenItem | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  const placedIds = placed.filter((i): i is GardenItem => i !== null).map(i => i.id);
  const availableItems = ITEMS.filter(i => !placedIds.includes(i.id));

  const handleSelect = (item: GardenItem) => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setSelectedItem(item);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (isSolved) return;

    if (selectedItem) {
      soundManager.playSlide(state.soundEnabled);
      const nextPlaced = [...placed];
      nextPlaced[slotIdx] = selectedItem;
      setPlaced(nextPlaced);
      setSelectedItem(null);

      // Check win condition: slot 0 is lantern, slot 3 is bamboo, slots 1 & 2 are stones
      if (
        nextPlaced[0]?.type === 'lantern' &&
        nextPlaced[3]?.type === 'bamboo' &&
        nextPlaced[1]?.type === 'stone' &&
        nextPlaced[2]?.type === 'stone'
      ) {
        setIsSolved(true);
        soundManager.playSolve(state.soundEnabled);
        solvePuzzle('japan_puzzle_2');
      }
    } else if (placed[slotIdx] !== null) {
      soundManager.playClick(state.soundEnabled);
      setSelectedItem(placed[slotIdx]);
      const nextPlaced = [...placed];
      nextPlaced[slotIdx] = null;
      setPlaced(nextPlaced);
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setPlaced([null, null, null, null]);
    setSelectedItem(null);
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
            <div className="font-pixel text-[12px] text-[#38bdf8]">CHAMBER 02 · JAPAN</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE ASYMMETRIC GARDEN</h2>
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
            title="Reset Garden"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Garden Area */}
      <div className="my-5 flex flex-col items-center">
        <div className="font-silkscreen text-[16px] text-[#67e8f9] mb-4 text-center">
          Arrange garden elements to balance the stream reflection.
        </div>

        {showHint && !isSolved && (
          <div className="mb-4 px-4 py-2 bg-[#120e1c] border-2 border-[#38bdf8] text-[#67e8f9] font-silkscreen text-[14px]">
            No stones touch; lantern faces water.
          </div>
        )}

        {/* Garden Split Stream Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 bg-[#120e1c] border-4 border-[#3a334a] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
          {/* Left Side: Fixed Natural Features */}
          <div className="p-3 bg-[#16201b] border-2 border-[#10b981]/50 flex flex-col items-center justify-between h-56">
            <span className="font-pixel text-[11px] text-[#6ee7b7]">WEST BANK (FIXED)</span>
            <div className="grid grid-cols-2 gap-3 w-full my-auto">
              <div className="h-16 border-2 border-[#10b981]/40 bg-[#121c17] flex items-center justify-center text-2xl">🏮</div>
              <div className="h-16 border-2 border-[#10b981]/40 bg-[#121c17] flex items-center justify-center text-2xl">🪨</div>
              <div className="h-16 border-2 border-[#10b981]/40 bg-[#121c17] flex items-center justify-center text-2xl">🎍</div>
              <div className="h-16 border-2 border-[#10b981]/40 bg-[#121c17] flex items-center justify-center text-2xl">⚪</div>
            </div>
          </div>

          {/* Right Side: Interactive Placement Sockets */}
          <div className="p-3 bg-[#191e2b] border-2 border-[#38bdf8]/50 flex flex-col items-center justify-between h-56">
            <span className="font-pixel text-[11px] text-[#67e8f9]">EAST BANK (ARRANGE)</span>
            <div className="grid grid-cols-2 gap-3 w-full my-auto">
              {[0, 1, 2, 3].map(idx => (
                <button
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  className={`h-16 border-3 flex flex-col items-center justify-center transition-all ${
                    placed[idx]
                      ? 'border-[#38bdf8] bg-[#162738] text-2xl'
                      : 'border-[#443c54] bg-[#120e1c] text-[#676b76] hover:border-[#38bdf8]'
                  }`}
                >
                  {placed[idx]?.icon || '·'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Available Items Bench */}
        <div className="mt-5 flex items-center gap-3">
          {availableItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`min-h-[48px] px-3.5 py-2 border-3 flex items-center gap-2 transition-all ${
                selectedItem?.id === item.id
                  ? 'border-[#ffffff] bg-[#223647] scale-105 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                  : 'border-[#676b76] bg-[#241d33] hover:border-[#38bdf8]'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-silkscreen text-[13px]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Reward */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 border-2 border-[#f8fafc] bg-[#222b3d] flex items-center justify-center text-2xl shrink-0">
            🤍
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#f8fafc]">LUMINESCENT MOONSTONE</div>
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
