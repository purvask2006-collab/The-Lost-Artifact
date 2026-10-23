import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { IndianPriestessSprite } from '../IndianPriestessSprite';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Flame } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface Hearth {
  id: number;
  name: string;
  element: string;
  frequency: number;
  color: string;
}

const HEARTHS: Hearth[] = [
  { id: 0, name: 'Bhumi (Earth)', element: 'Lowest Ember', frequency: 220, color: '#b45309' },
  { id: 1, name: 'Jala (Water)', element: 'Cool Spark', frequency: 277, color: '#0284c7' },
  { id: 2, name: 'Agni (Fire)', element: 'Radiant Heat', frequency: 330, color: '#ea580c' },
  { id: 3, name: 'Vayu (Wind)', element: 'Ascending Gale', frequency: 392, color: '#10b981' },
  { id: 4, name: 'Akasha (Spirit/Sky)', element: 'Highest Solar Flare', frequency: 440, color: '#eab308' },
];

// Target order: from lowest ember to highest solar flare (0 -> 1 -> 2 -> 3 -> 4)
const TARGET_SEQUENCE = [0, 1, 2, 3, 4];

export const FiveHearthsPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = state.solvedPuzzles.india_puzzle_2;

  const [litHearths, setLitHearths] = useState<number[]>(isAlreadySolved ? [0, 1, 2, 3, 4] : []);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [mistakeFlash, setMistakeFlash] = useState<boolean>(false);

  const handleIgniteHearth = (hearthId: number) => {
    if (isSolved || litHearths.includes(hearthId)) return;

    const nextExpected = TARGET_SEQUENCE[litHearths.length];
    if (hearthId === nextExpected) {
      soundManager.playBell(hearthId % 4, state.soundEnabled);
      const updated = [...litHearths, hearthId];
      setLitHearths(updated);

      if (updated.length === TARGET_SEQUENCE.length) {
        setIsSolved(true);
        soundManager.playSolve(state.soundEnabled);
        solvePuzzle('india_puzzle_2');
      }
    } else {
      // Mistake: embers extinguish
      soundManager.playCancel(state.soundEnabled);
      setMistakeFlash(true);
      setTimeout(() => {
        setLitHearths([]);
        setMistakeFlash(false);
      }, 500);
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setLitHearths([]);
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
            <span className="font-pixel text-[10px] text-amber-500">ANCIENT INDIA · PUZZLE 2</span>
            <h2 className="font-pixel text-sm md:text-base text-amber-400">THE FIVE HEARTHS</h2>
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
            title="Extinguish Embers"
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
                "The sacred Pancha-Maha-Bhuta fires burn in perfect cosmic harmony! The Carved Ruby Lotus Key is yours!"
              </span>
            ) : (
              <span>
                "Kindle the five sacrificial hearths from lowest dense matter to highest spiritual illumination: Earth, Water, Fire, Wind, Spirit."
              </span>
            )}
          </div>
        </div>

        {/* Hint Box */}
        {showHint && !isSolved && (
          <div className="w-full max-w-xl mb-3 p-2.5 bg-zinc-900 border border-amber-500 text-amber-200 font-silkscreen text-xs animate-in fade-in">
            ✦ Clue: Follow natural ascendance: 1. Bhumi (Earth) ➔ 2. Jala (Water) ➔ 3. Agni (Fire) ➔ 4. Vayu (Wind) ➔ 5. Akasha (Spirit/Sky).
          </div>
        )}

        {/* Five Hearths Altar */}
        <div className={`p-6 bg-stone-900 border-4 ${mistakeFlash ? 'border-red-600 bg-red-950/40' : 'border-amber-700'} shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] transition-colors duration-200`}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {HEARTHS.map(hearth => {
              const isLit = litHearths.includes(hearth.id);

              return (
                <button
                  key={hearth.id}
                  onClick={() => handleIgniteHearth(hearth.id)}
                  disabled={isSolved || isLit}
                  className={`w-28 h-36 p-3 flex flex-col items-center justify-between border-4 transition-all ${
                    isLit
                      ? 'border-amber-400 bg-amber-950/80 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                      : 'border-stone-700 bg-stone-950 hover:border-amber-500 hover:bg-stone-800 cursor-pointer active:scale-95'
                  }`}
                >
                  <div className="text-center">
                    <span className="font-pixel text-[9px] text-amber-400">HEARTH {hearth.id + 1}</span>
                    <div className="font-pixel text-[11px] text-zinc-100">{hearth.name.split(' ')[0]}</div>
                  </div>

                  {/* Flame Icon / Visual */}
                  <div className="my-2 relative flex items-center justify-center">
                    {isLit ? (
                      <div className="relative animate-bounce">
                        <Flame className="w-10 h-10 text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_#f59e0b]" />
                        <div className="absolute inset-0 bg-yellow-400/40 blur-sm rounded-full pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-stone-800 bg-stone-900 flex items-center justify-center text-stone-600 font-pixel text-xs">
                        ○
                      </div>
                    )}
                  </div>

                  <div className="text-center font-silkscreen text-[9px] text-zinc-400">
                    {hearth.element}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-center font-pixel text-[10px] text-amber-400">
            BURNING HEARTHS: {litHearths.length} / 5
          </div>
        </div>
      </div>

      {/* Footer / Reward */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-800 pt-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 bg-stone-900 flex items-center justify-center text-xl">
            🪷
          </div>
          <div>
            <div className="font-pixel text-xs text-amber-300">CARVED RUBY LOTUS KEY</div>
            <div className="text-[10px] font-silkscreen text-zinc-400">
              {isSolved ? 'Acquired and stored in Codex' : 'Reward for solving The Five Hearths'}
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
            Light the five sacrificial fire pits from lowest ember to highest flare
          </div>
        )}
      </div>
    </div>
  );
};
