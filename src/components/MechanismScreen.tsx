import React from 'react';
import { useGame } from '../context/GameContext';
import { ChakraOfBalanceMechanism } from './india/ChakraOfBalanceMechanism';
import { ShrineOfMemoriesMechanism } from './japan/ShrineOfMemoriesMechanism';
import { PyramidOfSecretsMechanism } from './egypt/PyramidOfSecretsMechanism';
import { ArrowLeft, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const MechanismScreen: React.FC = () => {
  const { state, returnToWorldMap, selectCivilization } = useGame();

  const mechId = state.activeMechanismId;
  const civId = state.selectedCiv || (mechId ? (mechId.split('_')[0] as any) : 'india');

  const handleBack = () => {
    soundManager.playCancel(state.soundEnabled);
    if (civId) {
      selectCivilization(civId);
    } else {
      returnToWorldMap();
    }
  };

  const renderMechanism = () => {
    switch (mechId) {
      case 'india_mechanism':
        return <ChakraOfBalanceMechanism onBack={handleBack} />;
      case 'japan_mechanism':
        return <ShrineOfMemoriesMechanism onBack={handleBack} />;
      case 'egypt_mechanism':
        return <PyramidOfSecretsMechanism onBack={handleBack} />;
      default:
        return (
          <div className="p-8 text-center">
            <p className="font-pixel text-sm text-zinc-400 mb-4">No active mechanism selected</p>
            <button
              onClick={returnToWorldMap}
              className="pixel-btn px-4 py-2 bg-amber-500 text-zinc-950 font-pixel text-xs"
            >
              RETURN TO WORLD MAP
            </button>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col justify-between p-3 md:p-6 select-none overflow-x-hidden">
      {/* Top Header Navigation Strip */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between border-b-2 border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="pixel-btn px-3 py-1.5 border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-pixel text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXIT VAULT</span>
          </button>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500 animate-spin [animation-duration:15s]" />
            <span className="font-pixel text-xs text-amber-400 tracking-wider">
              {civId ? civId.toUpperCase() : 'EXPEDITION'} · GRAND MECHANISM VAULT
            </span>
          </div>
        </div>

        <button
          onClick={returnToWorldMap}
          className="pixel-btn px-3 py-1.5 border-2 border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-pixel text-xs flex items-center gap-1.5"
        >
          <span>WORLD MAP</span>
        </button>
      </header>

      {/* Main Mechanism Component */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto flex items-center justify-center">
        {renderMechanism()}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto border-t border-zinc-800/80 pt-3 text-center text-[10px] font-silkscreen text-zinc-500">
        THE LOST ARTIFACT · SLOT ALL REQUIRED RELICS TO UNSEAL ANCIENT MECHANISMS
      </footer>
    </div>
  );
};
