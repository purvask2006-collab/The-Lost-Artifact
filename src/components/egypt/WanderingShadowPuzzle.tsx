import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Sun } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

// 3 Stages: 0=Dawn (Akhet, angle 90°), 1=Flood (Peret, angle 180°), 2=Harvest (Shemu, angle 270°)
const STAGES = [
  { name: 'Dawn (Akhet)', angle: 90, glyph: '𓇳', desc: 'Summer Solstice Dawn' },
  { name: 'Flood (Peret)', angle: 180, glyph: '𓈗', desc: 'Nile Inundation' },
  { name: 'Harvest (Shemu)', angle: 270, glyph: '𓌏', desc: 'Golden Grain Harvest' },
];

export const WanderingShadowPuzzle: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, solvePuzzle } = useGame();
  const isAlreadySolved = Boolean(state.solvedPuzzles.egypt_puzzle_3);

  const [currentStage, setCurrentStage] = useState<number>(isAlreadySolved ? 3 : 0);
  const [dialAngle, setDialAngle] = useState<number>(0);
  const [shutterOpen, setShutterOpen] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(isAlreadySolved);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const rotateDial = (delta: number) => {
    if (isSolved) return;
    soundManager.playRotateTile(state.soundEnabled);
    setDialAngle(prev => (prev + delta + 360) % 360);
    setFeedback('');
  };

  const toggleShutter = () => {
    if (isSolved) return;
    soundManager.playSlide(state.soundEnabled);
    setShutterOpen(prev => !prev);
    setFeedback('');
  };

  const handleConfirmShadow = () => {
    if (isSolved) return;

    if (!shutterOpen) {
      soundManager.playCancel(state.soundEnabled);
      setFeedback('Shutter blocks the solar light path! Slide shutter open.');
      return;
    }

    const target = STAGES[currentStage];
    if (dialAngle === target.angle) {
      soundManager.playSolve(state.soundEnabled);
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setShutterOpen(false);

      if (nextStage >= STAGES.length) {
        setIsSolved(true);
        solvePuzzle('egypt_puzzle_3');
      } else {
        setFeedback(`Stage ${currentStage + 1} Aligned! Next: ${STAGES[nextStage].name}`);
      }
    } else {
      soundManager.playCancel(state.soundEnabled);
      setFeedback('Shadow misaligned from the sacred seasonal glyph.');
    }
  };

  const handleReset = () => {
    if (isSolved) return;
    soundManager.playClick(state.soundEnabled);
    setCurrentStage(0);
    setDialAngle(0);
    setShutterOpen(false);
    setFeedback('');
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-3xl mx-auto p-5 md:p-6 bg-[#1a1528] border-3 border-[#06b6d4] shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#e3dfb1] flex flex-col justify-between select-none">
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
            <div className="font-pixel text-[12px] text-[#06b6d4]">CHAMBER 03 · EGYPT</div>
            <h2 className="font-pixel text-[18px] text-[#ffffff] tracking-wide">THE WANDERING SHADOW</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick(state.soundEnabled);
              setShowHint(!showHint);
            }}
            className={`pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-1.5 ${
              showHint ? 'border-[#06b6d4] bg-[#12232e] text-[#67e8f9]' : ''
            }`}
          >
            <Lightbulb className="w-4 h-4 text-[#06b6d4]" />
            <span>HINT</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isSolved}
            className={`pixel-btn min-h-[44px] min-w-[44px] p-2 ${isSolved ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Reset Sundial"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="my-5 flex flex-col items-center">
        <div className="font-silkscreen text-[16px] text-[#67e8f9] mb-4 text-center">
          Cast obelisk shadow in sequence: Dawn → Flood → Harvest.
        </div>

        {/* Current Stage Indicator */}
        <div className="flex items-center gap-4 px-5 py-2 bg-[#120e1c] border-2 border-[#676b76] mb-5">
          {STAGES.map((s, idx) => (
            <div
              key={s.name}
              className={`flex items-center gap-1.5 px-3 py-1 font-pixel text-[12px] ${
                currentStage > idx
                  ? 'border border-[#10b981] text-[#10b981] bg-[#12241d]'
                  : currentStage === idx
                  ? 'border-2 border-[#e8b84a] text-[#fef08a] bg-[#2a1d12] animate-pulse'
                  : 'text-[#676b76] opacity-40'
              }`}
            >
              <span>{s.glyph}</span>
              <span>{s.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {/* Obelisk Sundial Visual Box */}
        <div className="relative w-72 h-72 rounded-full border-4 border-[#3a334a] bg-[#120e1c] flex items-center justify-center shadow-[inset_0_0_25px_rgba(0,0,0,0.9)]">
          {/* Outer Seasonal Glyphs */}
          <span className="absolute top-3 font-pixel text-xl text-[#67e8f9]" title="Noon">𓇳</span>
          <span className="absolute right-3 font-pixel text-xl text-[#f59e0b]" title="Dawn 90°">𓇳</span>
          <span className="absolute bottom-3 font-pixel text-xl text-[#38bdf8]" title="Flood 180°">𓈗</span>
          <span className="absolute left-3 font-pixel text-xl text-[#eab308]" title="Harvest 270°">𓌏</span>

          {/* Cast Shadow Vector */}
          <div
            className="absolute w-2 h-28 bg-gradient-to-t from-black via-black/80 to-transparent origin-bottom transition-transform duration-200"
            style={{ transform: `rotate(${dialAngle}deg)` }}
          />

          {/* Central Obelisk Needle */}
          <div className="w-10 h-10 border-2 border-[#e8b84a] bg-[#241a12] flex items-center justify-center text-xl z-10 shadow-[0_0_10px_rgba(232,184,74,0.5)]">
            ▲
          </div>

          {/* Shutter Status Indicator */}
          <div className="absolute bottom-2 text-center font-silkscreen text-[11px] text-[#676b76]">
            {shutterOpen ? 'SHUTTER: OPEN' : 'SHUTTER: CLOSED'}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => rotateDial(-45)}
            className="pixel-btn min-h-[44px] px-3.5 text-[14px]"
          >
            ↺ -45°
          </button>

          <button
            onClick={toggleShutter}
            className={`pixel-btn min-h-[44px] px-4 text-[14px] ${
              shutterOpen ? 'border-[#10b981] bg-[#163328] text-[#6ee7b7]' : 'border-[#676b76]'
            }`}
          >
            {shutterOpen ? 'SHUTTER OPEN' : 'SLIDE SHUTTER'}
          </button>

          <button
            onClick={() => rotateDial(45)}
            className="pixel-btn min-h-[44px] px-3.5 text-[14px]"
          >
            ↻ +45°
          </button>

          <button
            onClick={handleConfirmShadow}
            className="pixel-btn pixel-btn-primary min-h-[44px] px-5 text-[14px]"
          >
            CONFIRM
          </button>
        </div>

        {feedback && (
          <div className="mt-3 font-silkscreen text-[14px] text-[#fef08a]">
            {feedback}
          </div>
        )}
      </div>

      {/* Footer / Reward */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#3a334a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 border-2 border-[#ea580c] bg-[#2b1712] flex items-center justify-center text-2xl shrink-0">
            🧡
          </div>
          <div>
            <div className="font-pixel text-[14px] text-[#ea580c]">HORIZON CARNELIAN</div>
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
