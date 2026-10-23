import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { YukiShrineOracle } from './YukiShrineOracle';
import { FragmentPixelBadge } from '../PixelArtwork';
import { ArrowLeft, Unlock, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const ShrineOfMemoriesMechanism: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, unlockMechanism } = useGame();

  const hasSeal1 = Boolean(state.solvedPuzzles.japan_puzzle_1);
  const hasSeal2 = Boolean(state.solvedPuzzles.japan_puzzle_2);
  const isMechanismAlreadyUnlocked = state.unlockedMechanisms.japan_mechanism;

  const [slottedSeal1, setSlottedSeal1] = useState<boolean>(isMechanismAlreadyUnlocked || hasSeal1);
  const [slottedSeal2, setSlottedSeal2] = useState<boolean>(isMechanismAlreadyUnlocked || hasSeal2);
  const [lanternPhase, setLanternPhase] = useState<number>(isMechanismAlreadyUnlocked ? 3 : 0);
  const [gateOpen, setGateOpen] = useState<boolean>(isMechanismAlreadyUnlocked);
  const [animating, setAnimating] = useState<boolean>(false);

  const canActivate = hasSeal1 && hasSeal2 && !gateOpen;

  const handleSlotSeal = (sealNum: 1 | 2) => {
    if (gateOpen || animating) return;
    soundManager.playClick(state.soundEnabled);
    if (sealNum === 1) setSlottedSeal1(true);
    if (sealNum === 2) setSlottedSeal2(true);
  };

  const handleActivateGate = () => {
    if (!slottedSeal1 || !slottedSeal2 || gateOpen || animating) return;

    setAnimating(true);
    soundManager.playBell(0, state.soundEnabled);

    // Illuminate Lantern 1
    setTimeout(() => {
      setLanternPhase(1);
      soundManager.playBell(1, state.soundEnabled);

      // Illuminate Lantern 2
      setTimeout(() => {
        setLanternPhase(2);
        soundManager.playBell(2, state.soundEnabled);

        // Illuminate Altar Center Lantern
        setTimeout(() => {
          setLanternPhase(3);
          soundManager.playBell(3, state.soundEnabled);

          // Open Torii Gate with stone mechanism sound
          setTimeout(() => {
            soundManager.playGateOpen(state.soundEnabled);
            setGateOpen(true);
            setAnimating(false);
            soundManager.playSolve(state.soundEnabled);
            unlockMechanism('japan_mechanism');
          }, 600);
        }, 500);
      }, 500);
    }, 500);
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-zinc-950/95 border-4 border-sky-800 shadow-[0_0_35px_rgba(2,132,199,0.3)] text-zinc-100 flex flex-col justify-between">
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
          <span className="font-pixel text-[10px] text-sky-400">JAPAN · SACRED MECHANISM</span>
          <h2 className="text-sm md:text-base font-pixel text-zinc-100">
            THE SHRINE OF MEMORIES
          </h2>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Altar Playfield */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
        {/* Left: Companion Yuki advice */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start p-4 bg-zinc-900 border-2 border-sky-900/60">
          <div className="flex items-center gap-3 mb-3">
            <YukiShrineOracle size="md" interactive={false} />
            <div>
              <div className="font-pixel text-xs text-sky-400">YUKI</div>
              <div className="text-[10px] text-zinc-400 font-silkscreen">Shrine Oracle</div>
            </div>
          </div>
          <p className="font-silkscreen text-xs text-zinc-300 leading-relaxed mb-4">
            "The Torii gate requires the twin Spirit Seals from both chambers. Slot them into the stone altar to ignite the sacred lanterns and release the Celestial Mirror."
          </p>

          {/* Requirements Checklist */}
          <div className="w-full space-y-2 text-xs font-silkscreen p-3 bg-zinc-950 border border-zinc-800 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">1. Spirit Seal 1 (Shoji Screen)</span>
              <span className={hasSeal1 ? 'text-emerald-400 font-pixel text-[9px]' : 'text-red-400 font-pixel text-[9px]'}>
                {hasSeal1 ? 'RECOVERED' : 'MISSING'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">2. Spirit Seal 2 (Bell Belfry)</span>
              <span className={hasSeal2 ? 'text-emerald-400 font-pixel text-[9px]' : 'text-red-400 font-pixel text-[9px]'}>
                {hasSeal2 ? 'RECOVERED' : 'MISSING'}
              </span>
            </div>
          </div>

          {gateOpen && (
            <div className="w-full p-3 bg-sky-950/60 border-2 border-sky-400 text-sky-200 font-pixel text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <div>TORII GATE OPENED!</div>
                <div className="text-[9px] text-sky-300 font-silkscreen mt-0.5">
                  Celestial Mirror Revealed · Egypt Unlocked
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: The Grand Vermilion Torii Gate & Altar Slots */}
        <div className="md:col-span-8 flex flex-col items-center">
          {/* Animated Torii Gate Viewport */}
          <div className="relative w-full max-w-md aspect-[4/3] bg-gradient-to-b from-[#091528] to-[#12081f] border-4 border-[#334155] shadow-[0_0_25px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center justify-end p-4">
            {/* Mountain mist & Cherry blossom particles in background */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-6 left-8 w-24 h-12 bg-sky-200/10 blur-md rounded-full" />
              <div className="absolute top-12 right-12 w-32 h-14 bg-sky-200/10 blur-md rounded-full" />
              {/* Sun disk */}
              <circle cx="200" cy="80" r="32" fill="#dc2626" opacity="0.65" />
            </div>

            {/* Left Stone Lantern (Lantern 1) */}
            <div className="absolute left-6 bottom-16 flex flex-col items-center">
              <div
                className={`w-5 h-5 border border-zinc-700 transition-all ${
                  lanternPhase >= 1 ? 'bg-amber-400 shadow-[0_0_20px_#f59e0b]' : 'bg-zinc-800'
                }`}
              />
              <div className="w-3 h-8 bg-zinc-700" />
            </div>

            {/* Right Stone Lantern (Lantern 2) */}
            <div className="absolute right-6 bottom-16 flex flex-col items-center">
              <div
                className={`w-5 h-5 border border-zinc-700 transition-all ${
                  lanternPhase >= 2 ? 'bg-amber-400 shadow-[0_0_20px_#f59e0b]' : 'bg-zinc-800'
                }`}
              />
              <div className="w-3 h-8 bg-zinc-700" />
            </div>

            {/* The Vermilion Torii Gate */}
            <div className="relative z-10 w-64 h-56 flex flex-col items-center justify-between">
              {/* Torii Top Crossbeam */}
              <div className="w-full h-5 bg-[#dc2626] border-2 border-[#991b1b] shadow-md rounded-xs" />
              <div className="w-56 h-3 bg-[#b91c1c] border border-[#7f1d1d] -mt-1" />

              {/* Shrine Center Chamber (Behind the sliding gate doors) */}
              <div className="relative w-44 h-36 border-2 border-[#451a03] bg-[#1a0e05] overflow-hidden flex items-center justify-center">
                {/* Revealed Fragment 2: Celestial Mirror */}
                {gateOpen ? (
                  <div className="flex flex-col items-center animate-in zoom-in-75 duration-700">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 rounded-full border-4 border-sky-400 bg-sky-950 flex items-center justify-center text-3xl shadow-[0_0_30px_#38bdf8]">
                        ⛩
                      </div>
                      <div className="absolute -inset-2 rounded-full border border-sky-300 animate-ping opacity-40" />
                    </div>
                    <span className="font-pixel text-[9px] text-sky-300">
                      CELESTIAL MIRROR
                    </span>
                    <span className="text-[8px] text-zinc-400 font-silkscreen">
                      Artifact Fragment 2
                    </span>
                  </div>
                ) : (
                  <div className="text-center font-pixel text-[9px] text-zinc-600">
                    VAULT SEALED
                  </div>
                )}

                {/* Sliding Gate Doors (Open when gateOpen is true) */}
                <div
                  className={`absolute top-0 left-0 w-1/2 h-full bg-[#7f1d1d] border-r border-[#991b1b] transition-transform duration-700 ease-in-out ${
                    gateOpen ? '-translate-x-full' : 'translate-x-0'
                  }`}
                />
                <div
                  className={`absolute top-0 right-0 w-1/2 h-full bg-[#7f1d1d] border-l border-[#991b1b] transition-transform duration-700 ease-in-out ${
                    gateOpen ? 'translate-x-full' : 'translate-x-0'
                  }`}
                />
              </div>

              {/* Torii Pillars */}
              <div className="w-full flex justify-between px-3">
                <div className="w-5 h-16 bg-[#dc2626] border border-[#991b1b]" />
                <div className="w-5 h-16 bg-[#dc2626] border border-[#991b1b]" />
              </div>
            </div>

            {/* Stone Altar Receptacle Matrix */}
            <div className="relative z-20 w-full max-w-xs p-3 bg-zinc-900 border-2 border-zinc-700 flex items-center justify-around mt-2">
              {/* Receptacle 1 (Spirit Seal 1) */}
              <button
                onClick={() => handleSlotSeal(1)}
                disabled={!hasSeal1 || slottedSeal1 || gateOpen}
                className={`w-14 h-14 border-2 flex flex-col items-center justify-center transition-all ${
                  slottedSeal1
                    ? 'border-sky-400 bg-sky-950 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    : hasSeal1
                    ? 'border-amber-400 bg-amber-950/80 text-amber-300 animate-pulse cursor-pointer'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-700 cursor-not-allowed'
                }`}
                title="Slot Spirit Seal 1"
              >
                <span className="text-lg">{slottedSeal1 ? '🎐' : '❓'}</span>
                <span className="font-pixel text-[7px] mt-0.5">
                  {slottedSeal1 ? 'SEAL 1' : hasSeal1 ? 'SLOT 1' : 'LOCKED'}
                </span>
              </button>

              {/* Center Altar Flame (Lantern 3) */}
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  lanternPhase >= 3
                    ? 'border-amber-300 bg-amber-400 text-black shadow-[0_0_20px_#f59e0b]'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-700'
                }`}
              >
                <span className="text-xs">🏮</span>
              </div>

              {/* Receptacle 2 (Spirit Seal 2) */}
              <button
                onClick={() => handleSlotSeal(2)}
                disabled={!hasSeal2 || slottedSeal2 || gateOpen}
                className={`w-14 h-14 border-2 flex flex-col items-center justify-center transition-all ${
                  slottedSeal2
                    ? 'border-sky-400 bg-sky-950 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    : hasSeal2
                    ? 'border-amber-400 bg-amber-950/80 text-amber-300 animate-pulse cursor-pointer'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-700 cursor-not-allowed'
                }`}
                title="Slot Spirit Seal 2"
              >
                <span className="text-lg">{slottedSeal2 ? '📿' : '❓'}</span>
                <span className="font-pixel text-[7px] mt-0.5">
                  {slottedSeal2 ? 'SEAL 2' : hasSeal2 ? 'SLOT 2' : 'LOCKED'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Button */}
          {!gateOpen && (
            <button
              onClick={handleActivateGate}
              disabled={!slottedSeal1 || !slottedSeal2 || animating}
              className={`pixel-btn px-6 py-3 mt-4 font-pixel text-xs font-bold border-2 flex items-center gap-2 transition-all ${
                slottedSeal1 && slottedSeal2
                  ? 'bg-sky-500 hover:bg-sky-400 text-zinc-950 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.6)] cursor-pointer'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Unlock className="w-4 h-4" />
              <span>{animating ? 'IGNITING LANTERNS...' : 'OPEN TORII SPIRIT GATE'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t-2 border-zinc-800 flex items-center justify-between text-xs font-silkscreen">
        <span className="text-zinc-400">
          Mechanism State: <strong className={gateOpen ? 'text-sky-300 font-pixel text-[11px]' : 'text-amber-400 font-pixel text-[11px]'}>
            {gateOpen ? 'GATE RELEASED · EGYPT UNLOCKED' : 'SEALS REQUIRED'}
          </strong>
        </span>

        <button
          onClick={onBack}
          className="pixel-btn px-4 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 font-pixel text-xs hover:text-white"
        >
          RETURN TO SHRINE
        </button>
      </div>
    </div>
  );
};
