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
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-6 bg-zinc-950 text-zinc-100 select-none overflow-x-hidden">
      {/* Background starlight */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b-2 border-zinc-800 pb-3">
        <button
          onClick={returnToWorldMap}
          className="pixel-btn px-3 py-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-300 font-pixel text-xs flex items-center gap-1.5"
        >
          <Map className="w-3.5 h-3.5" />
          <span>WORLD MAP</span>
        </button>

        <h1 className="font-pixel text-xs md:text-sm text-amber-400">
          THE SANCTUM OF REASSEMBLY
        </h1>
      </header>

      {/* Centerpiece */}
      <main className="relative z-10 w-full max-w-2xl my-auto text-center flex flex-col items-center py-6">
        <div className="mb-4">
          <AncientArtifactLockup className="w-56 h-56 md:w-64 md:h-64 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
        </div>

        {!state.artifactAssembled ? (
          <>
            <h2 className="text-xl md:text-2xl font-pixel text-amber-400 mb-2">
              ALL THREE KEYSTONES GATHERED
            </h2>
            <p className="font-silkscreen text-xs md:text-sm text-zinc-300 max-w-lg mx-auto mb-6 leading-relaxed">
              The Solar Wheel of Bharat, the Celestial Mirror of Yamato, and the Eternal Eye of Khem are reunited upon the primordial pedestal. Align them to unlock the Forgotten Truth.
            </p>

            <button
              onClick={handleAssemble}
              className="pixel-btn px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-sm font-bold border-4 border-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.6)] flex items-center gap-3 transition-transform"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>UNITE THE LOST ARTIFACT</span>
            </button>
          </>
        ) : (
          <div className="p-6 bg-zinc-900 border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] max-w-lg">
            <div className="flex justify-center mb-3">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
            <h2 className="text-lg md:text-xl font-pixel text-amber-300 mb-2">
              EXPEDITION COMPLETE
            </h2>
            <p className="font-silkscreen text-xs text-zinc-300 mb-4 leading-relaxed">
              "When the sun disc, lunar mirror, and cosmic eye converge, humanity awakens to find that ancient wisdom was never three divided fragments, but one single harmonic harmony."
            </p>
            <div className="text-[10px] text-zinc-500 font-pixel mb-6">
              Total Playtime: {Math.floor(state.playtimeSeconds / 60)}m {state.playtimeSeconds % 60}s · All 6 Relics Found
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={returnToWorldMap}
                className="pixel-btn px-4 py-2 border-2 border-zinc-700 bg-zinc-800 text-zinc-300 font-pixel text-xs"
              >
                RETURN TO MAP
              </button>
              <button
                onClick={resetGame}
                className="pixel-btn px-4 py-2 border-2 border-red-500 bg-red-700 hover:bg-red-600 text-white font-pixel text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl text-center text-[10px] text-zinc-500 font-silkscreen border-t border-zinc-800/80 pt-4">
        THE LOST ARTIFACT · A PIXEL-ART PUZZLE ADVENTURE
      </footer>
    </div>
  );
};
