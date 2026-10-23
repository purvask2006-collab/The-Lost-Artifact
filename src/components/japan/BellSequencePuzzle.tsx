import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { YukiShrineOracle } from './YukiShrineOracle';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Play } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface BellDef {
  id: number;
  name: string;
  element: string;
  colorName: string;
  bgHex: string;
  glowHex: string;
  borderHex: string;
  symbol: string;
}

const BELLS: BellDef[] = [
  {
    id: 0,
    name: 'Dawn Bell',
    element: 'Sun & Bronze',
    colorName: 'Amber',
    bgHex: '#78350f',
    glowHex: '#f59e0b',
    borderHex: '#fbbf24',
    symbol: '☀️',
  },
  {
    id: 1,
    name: 'Spring Jade Bell',
    element: 'Mist & Bamboo',
    colorName: 'Jade',
    bgHex: '#064e3b',
    glowHex: '#10b981',
    borderHex: '#34d399',
    symbol: '🎋',
  },
  {
    id: 2,
    name: 'Autumn Wind Bell',
    element: 'Fire & Maple',
    colorName: 'Vermilion',
    bgHex: '#7f1d1d',
    glowHex: '#ef4444',
    borderHex: '#f87171',
    symbol: '🍁',
  },
  {
    id: 3,
    name: 'Night Moon Bell',
    element: 'Lunar & Indigo',
    colorName: 'Indigo',
    bgHex: '#1e1b4b',
    glowHex: '#6366f1',
    borderHex: '#818cf8',
    symbol: '🌙',
  },
];

// Fixed achievable sequence rounds:
// Round 1 (len 3): [0, 2, 1]
// Round 2 (len 4): [1, 3, 0, 2]
// Round 3 (len 5): [2, 0, 3, 1, 3]
const SEQUENCES = [
  [0, 2, 1],
  [1, 3, 0, 2],
  [2, 0, 3, 1, 3],
];

export const BellSequencePuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = state.solvedPuzzles.japan_puzzle_2;

  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [activeBellId, setActiveBellId] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Press "Hear Sequence" to listen and observe.');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play demonstration sequence for current round
  const playSequence = (roundIdx = currentRound) => {
    if (isPlayingDemo || isSolved) return;

    setIsPlayingDemo(true);
    setPlayerInput([]);
    setFeedbackMessage('Observe the temple bells...');

    const seq = SEQUENCES[roundIdx];
    let step = 0;

    const playStep = () => {
      if (step >= seq.length) {
        setActiveBellId(null);
        setIsPlayingDemo(false);
        setFeedbackMessage('Your turn: Strike the bells in the exact sequence.');
        return;
      }

      const bellId = seq[step];
      setActiveBellId(bellId);
      soundManager.playBell(bellId, state.soundEnabled);

      timeoutRef.current = setTimeout(() => {
        setActiveBellId(null);
        step++;
        timeoutRef.current = setTimeout(playStep, 250);
      }, 550);
    };

    timeoutRef.current = setTimeout(playStep, 350);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle player clicking a bell
  const handleBellClick = (bellId: number) => {
    if (isPlayingDemo || isSolved) return;

    // Visual strike feedback
    setActiveBellId(bellId);
    soundManager.playBell(bellId, state.soundEnabled);
    setTimeout(() => setActiveBellId(null), 250);

    const nextInput = [...playerInput, bellId];
    setPlayerInput(nextInput);

    const targetSeq = SEQUENCES[currentRound];
    const currentStep = nextInput.length - 1;

    // Check if the strike matches
    if (nextInput[currentStep] !== targetSeq[currentStep]) {
      // Mistake
      soundManager.playCancel(state.soundEnabled);
      setFeedbackMessage('The rhythm was broken. Press "Replay Sequence" to listen again.');
      setPlayerInput([]);
      return;
    }

    // Check if full round completed
    if (nextInput.length === targetSeq.length) {
      if (currentRound < SEQUENCES.length - 1) {
        soundManager.playSolve(state.soundEnabled);
        setFeedbackMessage(`Harmony aligned! Preparing Round ${currentRound + 2}...`);
        setTimeout(() => {
          setCurrentRound(prev => prev + 1);
          setPlayerInput([]);
          playSequence(currentRound + 1);
        }, 1000);
      } else {
        // All 3 rounds complete!
        setIsSolved(true);
        soundManager.playSolve(state.soundEnabled);
        solvePuzzle('japan_puzzle_2');
        setFeedbackMessage('All spirit cadences restored! Spirit Seal 2 has awakened.');
      }
    }
  };

  const handleRestart = () => {
    soundManager.playClick(state.soundEnabled);
    setCurrentRound(0);
    setPlayerInput([]);
    setIsPlayingDemo(false);
    setActiveBellId(null);
    setFeedbackMessage('Bells reset. Press "Hear Sequence" to begin.');
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
          <span className="font-pixel text-[10px] text-sky-400">JAPAN · CHAMBER II</span>
          <h2 className="text-sm md:text-base font-pixel text-zinc-100">
            THE BELL SEQUENCE
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playSequence()}
            disabled={isPlayingDemo || isSolved}
            className="pixel-btn p-1.5 border-2 border-sky-700 bg-sky-950/60 text-sky-300 font-pixel text-xs disabled:opacity-50"
            title="Replay Sequence"
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

      {/* Main Belfry Chamber */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
        {/* Left: Companion Yuki guidance */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start p-4 bg-zinc-900 border-2 border-sky-900/60">
          <div className="flex items-center gap-3 mb-3">
            <YukiShrineOracle size="md" interactive={false} />
            <div>
              <div className="font-pixel text-xs text-sky-400">YUKI</div>
              <div className="text-[10px] text-zinc-400 font-silkscreen">Shrine Oracle</div>
            </div>
          </div>
          <p className="font-silkscreen text-xs text-zinc-300 leading-relaxed mb-3">
            "Four sacred bells guard the wind sanctuary. Observe both their glowing light and harmonic chimes, then repeat the melody in harmony."
          </p>

          {/* Round Progression Progress */}
          <div className="w-full p-2.5 bg-zinc-950 border border-zinc-800 mb-3 text-xs font-silkscreen">
            <div className="text-[10px] font-pixel text-zinc-400 mb-1">CHAMBER CADENCE:</div>
            <div className="flex items-center gap-2">
              {[0, 1, 2].map(rIdx => (
                <div
                  key={`round-pip-${rIdx}`}
                  className={`flex-1 py-1 text-center font-pixel text-[9px] border ${
                    rIdx < currentRound || isSolved
                      ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                      : rIdx === currentRound
                      ? 'border-amber-400 bg-amber-950 text-amber-300 animate-pulse'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-600'
                  }`}
                >
                  R{rIdx + 1} ({SEQUENCES[rIdx].length})
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Bar */}
          <div className="w-full p-2.5 bg-sky-950/40 border border-sky-800/80 text-[11px] text-sky-200 font-silkscreen">
            {feedbackMessage}
          </div>

          {isSolved && (
            <div className="w-full mt-3 p-3 bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 font-pixel text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div>HARMONY ACHIEVED!</div>
                <div className="text-[9px] text-emerald-400/80 font-silkscreen mt-0.5">
                  Spirit Seal 2 Recovered
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: The Four Interactive Sacred Temple Bells */}
        <div className="md:col-span-8 flex flex-col items-center">
          {/* Demonstration Action CTA */}
          {!isSolved && playerInput.length === 0 && !isPlayingDemo && (
            <button
              onClick={() => playSequence()}
              className="pixel-btn px-4 py-2 mb-4 bg-sky-600 hover:bg-sky-500 text-zinc-950 font-pixel text-xs font-bold border-2 border-sky-300 flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>HEAR SEQUENCE (ROUND {currentRound + 1})</span>
            </button>
          )}

          {/* Visual Sequence History Markers (Non-Audio Accessible) */}
          <div className="w-full max-w-md flex items-center justify-center gap-2 mb-4">
            <span className="font-pixel text-[9px] text-zinc-500">INPUT:</span>
            {SEQUENCES[currentRound].map((_, stepIdx) => {
              const entered = playerInput[stepIdx] !== undefined;
              const bellId = playerInput[stepIdx];
              const bell = bellId !== undefined ? BELLS[bellId] : null;

              return (
                <div
                  key={`step-${stepIdx}`}
                  className={`w-7 h-7 border-2 flex items-center justify-center text-xs transition-all ${
                    entered && bell
                      ? 'border-amber-400 bg-amber-950/80'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-600'
                  }`}
                >
                  {entered && bell ? bell.symbol : '·'}
                </div>
              );
            })}
          </div>

          {/* The 4 Hanging Bells (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-4 max-w-md w-full">
            {BELLS.map(bell => {
              const isActive = activeBellId === bell.id;

              return (
                <button
                  key={bell.id}
                  onClick={() => handleBellClick(bell.id)}
                  disabled={isPlayingDemo || isSolved}
                  className={`pixel-btn p-5 border-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                    isActive
                      ? 'scale-105 shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                      : 'hover:scale-102'
                  }`}
                  style={{
                    backgroundColor: isActive ? bell.glowHex : bell.bgHex,
                    borderColor: isActive ? '#ffffff' : bell.borderHex,
                    boxShadow: isActive ? `0 0 30px ${bell.glowHex}` : undefined,
                  }}
                >
                  {/* Hanging Wooden Beam & Bell Graphic */}
                  <div className="relative mb-2">
                    <svg viewBox="0 0 40 40" className="w-16 h-16">
                      {/* Hanging Cord */}
                      <line x1="20" y1="0" x2="20" y2="8" stroke="#d97706" strokeWidth="2" />
                      {/* Bronze Bell Body */}
                      <path
                        d="M 12 10 Q 20 6 28 10 L 32 28 Q 20 32 8 28 Z"
                        fill={isActive ? '#fef08a' : '#27272a'}
                        stroke={isActive ? '#ffffff' : bell.borderHex}
                        strokeWidth="2"
                      />
                      {/* Sacred Crest Symbol on Bell */}
                      <circle cx="20" cy="20" r="4" fill={isActive ? '#dc2626' : bell.borderHex} />
                      {/* Striker Chime Clapper */}
                      <circle cx="20" cy="30" r="3" fill="#fbbf24" />

                      {/* Visual Pulsing Soundwaves if active */}
                      {isActive && (
                        <circle cx="20" cy="20" r="16" fill="none" stroke="#ffffff" strokeWidth="2">
                          <animate attributeName="r" values="14;22" dur="0.4s" repeatCount="1" />
                          <animate attributeName="opacity" values="1;0" dur="0.4s" repeatCount="1" />
                        </circle>
                      )}
                    </svg>
                  </div>

                  <div className="font-pixel text-[11px] text-white mb-0.5">
                    {bell.name}
                  </div>
                  <div className="text-[10px] text-zinc-300 font-silkscreen">
                    {bell.element} ({bell.colorName})
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t-2 border-zinc-800 flex items-center justify-between text-xs font-silkscreen">
        <span className="text-zinc-400">
          Belfry Status: <strong className={isSolved ? 'text-emerald-400 font-pixel text-[11px]' : 'text-amber-400 font-pixel text-[11px]'}>
            {isSolved ? 'ALL CADENCES HARMONIZED' : `ROUND ${currentRound + 1}/3`}
          </strong>
        </span>

        {isSolved ? (
          <button
            onClick={onBack}
            className="pixel-btn px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-pixel text-xs font-bold border-2 border-emerald-300"
          >
            CLAIM SPIRIT SEAL 2 & RETURN
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
