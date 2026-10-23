import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CivilizationId } from '../types/game';
import { soundManager } from '../utils/audio';
import { Lock, CheckCircle2, Sparkles } from 'lucide-react';

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
    <div className="relative w-full aspect-[16/9] max-h-[80vh] min-h-[480px] bg-[#130e20] border-4 border-[#676b76] shadow-[0_0_40px_rgba(0,0,0,0.95),0_0_20px_rgba(232,184,74,0.3)] overflow-hidden select-none">
      {/* 1. Authentic Overworld Map Image (Provided by User) */}
      <img
        src="/assets/aistudio/The_Lost_Artifact_World_Map_123794b3.png"
        alt="The Lost Artifact World Diorama"
        className="w-full h-full object-cover object-center filter saturate-115 contrast-105 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* 2. Three Interactive Landmarks */}

      {/* LANDMARK 1: INDIA (Left 4% - 35% X) - Sandstone Temple & Golden Chakra */}
      <div
        onClick={() => handleClick('india')}
        onMouseEnter={() => {
          soundManager.playHover(state.soundEnabled);
          setHoveredCiv('india');
        }}
        onMouseLeave={() => setHoveredCiv(null)}
        className="absolute top-[8%] left-[4%] w-[32%] h-[78%] cursor-pointer group z-10 flex flex-col justify-between p-3"
        title="India: Temple of the Golden Chakra (Amara)"
      >
        {/* Glow Frame */}
        <div className={`absolute inset-0 border-4 transition-all ${
          hoveredCiv === 'india' 
            ? 'border-[#f59e0b] bg-[#f59e0b]/20 shadow-[0_0_30px_rgba(245,158,11,0.6)]' 
            : 'border-transparent'
        }`} />

        {/* High-Contrast Large Landmark Banner (Top) */}
        <div className="relative z-10 self-start px-4 py-2 bg-[#130e20] border-3 border-[#f59e0b] shadow-[0_4px_0_#000] flex items-center gap-3">
          <span className="text-2xl text-[#f59e0b]">☸</span>
          <div>
            <div className="font-pixel text-[16px] text-[#fef08a] font-bold tracking-wider">INDIA</div>
            <div className="font-silkscreen text-[12px] text-[#f59e0b]">GUARDIAN AMARA</div>
          </div>
          {isIndiaCompleted && (
            <CheckCircle2 className="w-5 h-5 text-[#10b981] ml-1" />
          )}
        </div>

        {/* Hover Action Prompt (Bottom) */}
        <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity px-4 py-1.5 bg-[#130e20] border-3 border-[#f59e0b] text-[#fde047] font-pixel text-[14px] shadow-[0_3px_0_#000]">
          ENTER TEMPLE
        </div>
      </div>

      {/* LANDMARK 2: JAPAN (Center 36% - 64% X) - Torii Gate, Bamboo, Sakura Blossoms */}
      <div
        onClick={() => handleClick('japan')}
        onMouseEnter={() => {
          if (isJapanUnlocked) soundManager.playHover(state.soundEnabled);
          setHoveredCiv('japan');
        }}
        onMouseLeave={() => setHoveredCiv(null)}
        className={`absolute top-[8%] left-[36%] w-[28%] h-[78%] z-10 flex flex-col justify-between p-3 ${
          isJapanUnlocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-90'
        }`}
        title={isJapanUnlocked ? 'Japan: Whispering Torii Shrine (Yuki)' : 'Locked: Solve India first'}
      >
        {/* Glow Frame */}
        <div className={`absolute inset-0 border-4 transition-all ${
          isJapanUnlocked && hoveredCiv === 'japan'
            ? 'border-[#f472b6] bg-[#f472b6]/20 shadow-[0_0_30px_rgba(244,114,182,0.6)]'
            : 'border-transparent'
        }`} />

        {/* High-Contrast Large Landmark Banner (Top) */}
        <div className="relative z-10 self-start px-4 py-2 bg-[#130e20] border-3 border-[#f472b6] shadow-[0_4px_0_#000] flex items-center gap-3">
          <span className="text-2xl text-[#f472b6]">⛩</span>
          <div>
            <div className="font-pixel text-[16px] text-[#fbcfe8] font-bold tracking-wider">JAPAN</div>
            <div className="font-silkscreen text-[12px] text-[#38bdf8]">GUARDIAN YUKI</div>
          </div>
          {isJapanCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#10b981] ml-1" />
          ) : !isJapanUnlocked ? (
            <Lock className="w-5 h-5 text-[#676b76] ml-1" />
          ) : null}
        </div>

        {/* Center lock or enter prompt (Bottom) */}
        {!isJapanUnlocked ? (
          <div className="relative z-10 self-center px-3.5 py-1.5 bg-[#130e20] border-2 border-[#676b76] text-[#cbd5e1] font-silkscreen text-[13px] flex items-center gap-2 shadow-[0_2px_0_#000]">
            <Lock className="w-4 h-4 text-[#e8b84a]" />
            <span>SOLVE INDIA FIRST</span>
          </div>
        ) : (
          <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity px-4 py-1.5 bg-[#130e20] border-3 border-[#f472b6] text-[#fbcfe8] font-pixel text-[14px] shadow-[0_3px_0_#000]">
            ENTER SHRINE
          </div>
        )}
      </div>

      {/* LANDMARK 3: EGYPT (Right 66% - 96% X) - Great Pyramid, Obelisk, Desert Dunes */}
      <div
        onClick={() => handleClick('egypt')}
        onMouseEnter={() => {
          if (isEgyptUnlocked) soundManager.playHover(state.soundEnabled);
          setHoveredCiv('egypt');
        }}
        onMouseLeave={() => setHoveredCiv(null)}
        className={`absolute top-[8%] right-[4%] w-[32%] h-[78%] z-10 flex flex-col justify-between p-3 ${
          isEgyptUnlocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-90'
        }`}
        title={isEgyptUnlocked ? 'Egypt: Pyramid of Secrets (Kiya)' : 'Locked: Solve Japan first'}
      >
        {/* Glow Frame */}
        <div className={`absolute inset-0 border-4 transition-all ${
          isEgyptUnlocked && hoveredCiv === 'egypt'
            ? 'border-[#06b6d4] bg-[#06b6d4]/20 shadow-[0_0_30px_rgba(6,182,212,0.6)]'
            : 'border-transparent'
        }`} />

        {/* High-Contrast Large Landmark Banner (Top) */}
        <div className="relative z-10 self-start px-4 py-2 bg-[#130e20] border-3 border-[#06b6d4] shadow-[0_4px_0_#000] flex items-center gap-3">
          <span className="text-2xl text-[#06b6d4]">𓁹</span>
          <div>
            <div className="font-pixel text-[16px] text-[#67e8f9] font-bold tracking-wider">EGYPT</div>
            <div className="font-silkscreen text-[12px] text-[#fde047]">GUARDIAN KIYA</div>
          </div>
          {isEgyptCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#10b981] ml-1" />
          ) : !isEgyptUnlocked ? (
            <Lock className="w-5 h-5 text-[#676b76] ml-1" />
          ) : null}
        </div>

        {/* Center lock or enter prompt (Bottom) */}
        {!isEgyptUnlocked ? (
          <div className="relative z-10 self-center px-3.5 py-1.5 bg-[#130e20] border-2 border-[#676b76] text-[#cbd5e1] font-silkscreen text-[13px] flex items-center gap-2 shadow-[0_2px_0_#000]">
            <Lock className="w-4 h-4 text-[#e8b84a]" />
            <span>SOLVE JAPAN FIRST</span>
          </div>
        ) : (
          <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity px-4 py-1.5 bg-[#130e20] border-3 border-[#06b6d4] text-[#67e8f9] font-pixel text-[14px] shadow-[0_3px_0_#000]">
            ENTER PYRAMID
          </div>
        )}
      </div>
    </div>
  );
};
