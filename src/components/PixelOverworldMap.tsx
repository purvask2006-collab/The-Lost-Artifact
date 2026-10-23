import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { CivilizationId } from '../types/game';
import { soundManager } from '../utils/audio';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface PixelOverworldMapProps {
  onSelectCivilization: (civId: CivilizationId) => void;
}

export const PixelOverworldMap: React.FC<PixelOverworldMapProps> = ({
  onSelectCivilization,
}) => {
  const { state } = useGame();
  const [hoveredCiv, setHoveredCiv] = useState<CivilizationId | null>(null);

  const isIndiaCompleted = Boolean(state.recoveredFragments.fragment_solar_wheel);
  const isJapanUnlocked = Boolean(state.unlockedCivs.japan || state.recoveredFragments.fragment_solar_wheel);
  const isJapanCompleted = Boolean(state.recoveredFragments.fragment_celestial_mirror);
  const isEgyptUnlocked = Boolean(state.unlockedCivs.egypt || state.recoveredFragments.fragment_celestial_mirror);
  const isEgyptCompleted = Boolean(state.recoveredFragments.fragment_eternal_eye);

  const handleClick = (civId: CivilizationId) => {
    if (civId === 'japan' && !isJapanUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    if (civId === 'egypt' && !isEgyptUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    soundManager.playTravel(state.soundEnabled);
    onSelectCivilization(civId);
  };

  return (
    <div className="relative w-full aspect-[16/9] max-h-[80vh] min-h-[460px] bg-[#130e20] border-4 border-[#676b76] shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(232,184,74,0.3)] overflow-hidden select-none">
      {/* 1. Authentic Overworld Map Image (Provided by User) */}
      <img
        src="/assets/aistudio/The_Lost_Artifact_World_Map_123794b3.png"
        alt="The Lost Artifact World Diorama"
        className="w-full h-full object-cover object-center filter saturate-110 contrast-105 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* 2. Interactive Clickable Landmark Hitboxes */}
      {/* INDIA TEMPLE (Left side: 5% - 35% X, 15% - 85% Y) */}
      <div
        onClick={() => handleClick('india')}
        onMouseEnter={() => {
          soundManager.playHover(state.soundEnabled);
          setHoveredCiv('india');
        }}
        onMouseLeave={() => setHoveredCiv(null)}
        className="absolute top-[12%] left-[4%] w-[32%] h-[74%] cursor-pointer group z-10 flex flex-col justify-between p-3"
        title="India: Temple of the Golden Chakra (Amara)"
      >
        {/* Glow indicator on hover */}
        <div className={`absolute inset-0 border-3 transition-all ${
          hoveredCiv === 'india' 
            ? 'border-[#f59e0b] bg-[#f59e0b]/15 shadow-[0_0_25px_rgba(245,158,11,0.5)]' 
            : 'border-transparent'
        }`} />

        {/* Status Pill Badge */}
        <div className="relative z-10 self-start px-3 py-1 bg-[#130e20]/90 border-2 border-[#f59e0b] shadow-[0_2px_0_#000] flex items-center gap-2">
          <span className="text-lg text-[#f59e0b]">☸</span>
          <span className="font-pixel text-[14px] text-[#fef08a] font-bold">INDIA</span>
          {isIndiaCompleted && (
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          )}
        </div>

        {/* Bottom prompt */}
        <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-[#130e20] border-2 border-[#f59e0b] text-[#fde047] font-silkscreen text-[14px]">
          ENTER TEMPLE
        </div>
      </div>

      {/* JAPAN SHRINE (Center: 36% - 64% X, 15% - 85% Y) */}
      <div
        onClick={() => handleClick('japan')}
        onMouseEnter={() => {
          if (isJapanUnlocked) soundManager.playHover(state.soundEnabled);
          setHoveredCiv('japan');
        }}
        onMouseLeave={() => setHoveredCiv(null)}
        className={`absolute top-[15%] left-[36%] w-[28%] h-[72%] z-10 flex flex-col justify-between p-3 ${
          isJapanUnlocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-85'
        }`}
        title={isJapanUnlocked ? 'Japan: Whispering Torii Shrine (Yuki)' : 'Locked: Solve India first'}
      >
        <div className={`absolute inset-0 border-3 transition-all ${
          isJapanUnlocked && hoveredCiv === 'japan'
            ? 'border-[#38bdf8] bg-[#38bdf8]/15 shadow-[0_0_25px_rgba(56,189,248,0.5)]'
            : 'border-transparent'
        }`} />

        {/* Status Pill Badge */}
        <div className="relative z-10 self-start px-3 py-1 bg-[#130e20]/90 border-2 border-[#38bdf8] shadow-[0_2px_0_#000] flex items-center gap-2">
          <span className="text-lg text-[#f472b6]">⛩</span>
          <span className="font-pixel text-[14px] text-[#e0f2fe] font-bold">JAPAN</span>
          {isJapanCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          ) : !isJapanUnlocked ? (
            <Lock className="w-4 h-4 text-[#676b76]" />
          ) : null}
        </div>

        {/* Center lock or enter prompt */}
        {!isJapanUnlocked ? (
          <div className="relative z-10 self-center px-3 py-1 bg-[#130e20]/90 border border-[#676b76] text-[#94a3b8] font-silkscreen text-[13px] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>SOLVE INDIA FIRST</span>
          </div>
        ) : (
          <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-[#130e20] border-2 border-[#38bdf8] text-[#38bdf8] font-silkscreen text-[14px]">
            ENTER SHRINE
          </div>
        )}
      </div>

      {/* EGYPT PYRAMID (Right: 66% - 96% X, 15% - 85% Y) */}
      <div
        onClick={() => handleClick('egypt')}
        onMouseEnter={() => {
          if (isEgyptUnlocked) soundManager.playHover(state.soundEnabled);
          setHoveredCiv('egypt');
        }}
        onMouseLeave={() => setHoveredCiv(null)}
        className={`absolute top-[12%] right-[4%] w-[32%] h-[74%] z-10 flex flex-col justify-between p-3 ${
          isEgyptUnlocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-85'
        }`}
        title={isEgyptUnlocked ? 'Egypt: Pyramid of Secrets (Kiya)' : 'Locked: Solve Japan first'}
      >
        <div className={`absolute inset-0 border-3 transition-all ${
          isEgyptUnlocked && hoveredCiv === 'egypt'
            ? 'border-[#06b6d4] bg-[#06b6d4]/15 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
            : 'border-transparent'
        }`} />

        {/* Status Pill Badge */}
        <div className="relative z-10 self-start px-3 py-1 bg-[#130e20]/90 border-2 border-[#06b6d4] shadow-[0_2px_0_#000] flex items-center gap-2">
          <span className="text-lg text-[#06b6d4]">𓁹</span>
          <span className="font-pixel text-[14px] text-[#67e8f9] font-bold">EGYPT</span>
          {isEgyptCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          ) : !isEgyptUnlocked ? (
            <Lock className="w-4 h-4 text-[#676b76]" />
          ) : null}
        </div>

        {/* Center lock or enter prompt */}
        {!isEgyptUnlocked ? (
          <div className="relative z-10 self-center px-3 py-1 bg-[#130e20]/90 border border-[#676b76] text-[#94a3b8] font-silkscreen text-[13px] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>SOLVE JAPAN FIRST</span>
          </div>
        ) : (
          <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-[#130e20] border-2 border-[#06b6d4] text-[#67e8f9] font-silkscreen text-[14px]">
            ENTER PYRAMID
          </div>
        )}
      </div>
    </div>
  );
};
