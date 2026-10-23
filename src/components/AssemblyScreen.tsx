import React from 'react';
import { useGame } from '../context/GameContext';
import { AncientArtifactLockup } from './PixelArtwork';
import { Sparkles, Trophy, RotateCcw, Map } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const AssemblyScreen: React.FC = () => {
  const { state, assembleFinalArtifact, returnToWorldMap, resetGame } = useGame();

  const handleAssemble = () => {
    soundManager.playSolve(state.soundEnabled);
    assembleFinalArtifact();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 md:p-6 bg-[#130e20] text-[#e3dfb1] select-none overflow-x-hidden">
      {/* Background starlight */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b-2 border-[#3a334a] pb-3">
        <button
          onClick={returnToWorldMap}
          className="pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-2"
        >
          <Map className="w-4 h-4" />
          <span>MAP</span>
        </button>

        <h1 className="font-pixel text-[16px] md:text-[20px] text-[#e8b84a]">
          THE SANCTUM OF REASSEMBLY
        </h1>
      </header>

      {/* Centerpiece */}
      <main className="relative z-10 w-full max-w-2xl my-auto text-center flex flex-col items-center py-6">
        <div className="mb-6">
          <AncientArtifactLockup className="w-60 h-60 md:w-72 md:h-72 drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]" />
        </div>

        {!state.artifactAssembled ? (
          <>
            <h2 className="text-[20px] md:text-[26px] font-pixel text-[#ffffff] mb-3">
              ALL 3 ARTIFACT FRAGMENTS GATHERED
            </h2>
            <p className="font-silkscreen text-[15px] text-[#e3dfb1] max-w-lg mx-auto mb-6 leading-relaxed">
              The Solar Wheel of Bharat, the Celestial Mirror of Yamato, and the Eternal Eye of Khem unite on the primordial altar.
            </p>

            <button
              onClick={handleAssemble}
              className="pixel-btn pixel-btn-primary min-h-[48px] px-8 py-3 text-[16px] font-bold shadow-[0_0_25px_rgba(232,184,74,0.6)] flex items-center gap-3 animate-pixel-glow"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>UNITE THE ARTIFACT</span>
            </button>
          </>
        ) : (
          <div className="p-6 bg-[#1f192b] border-4 border-[#e8b84a] shadow-[0_0_35px_rgba(232,184,74,0.5)] max-w-lg">
            <div className="flex justify-center mb-3">
              <Trophy className="w-12 h-12 text-[#e8b84a] animate-bounce" />
            </div>
            <h2 className="text-[20px] md:text-[24px] font-pixel text-[#e8b84a] mb-3">
              EXPEDITION COMPLETE
            </h2>
            <p className="font-silkscreen text-[15px] text-[#ffffff] mb-4 leading-relaxed">
              When the sun disc, lunar mirror, and cosmic eye converge, ancient wisdom shines as one harmonic truth.
            </p>
            <div className="text-[14px] text-[#fde047] font-silkscreen mb-6">
              Total Playtime: {Math.floor(state.playtimeSeconds / 60)}m {state.playtimeSeconds % 60}s · All 12 Gemstone Keys Discovered
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={returnToWorldMap}
                className="pixel-btn min-h-[44px] px-5 text-[14px]"
              >
                RETURN TO MAP
              </button>
              <button
                onClick={resetGame}
                className="pixel-btn min-h-[44px] px-5 text-[14px] border-2 border-red-500 bg-red-800 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl text-center text-[14px] text-[#676b76] font-silkscreen border-t border-[#3a334a] pt-3">
        THE LOST ARTIFACT · A PIXEL-ART PUZZLE ADVENTURE
      </footer>
    </div>
  );
};
