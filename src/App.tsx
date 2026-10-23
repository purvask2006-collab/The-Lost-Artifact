/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TitleScreen } from './components/TitleScreen';
import { WorldMap } from './components/WorldMap';
import { CivHub } from './components/CivHub';
import { AssemblyScreen } from './components/AssemblyScreen';

const GameShell: React.FC = () => {
  const { state } = useGame();

  const renderActiveScreen = () => {
    switch (state.currentScreen) {
      case 'TITLE':
        return <TitleScreen />;
      case 'WORLD_MAP':
        return <WorldMap />;
      case 'CIV_HUB':
        return <CivHub />;
      case 'ASSEMBLY':
      case 'COMPLETION':
        return <AssemblyScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 font-silkscreen select-none text-zinc-100 overflow-x-hidden">
      {/* Screen Router */}
      {renderActiveScreen()}

      {/* Global Retro CRT Scanlines & Vignette Filter Overlay */}
      {state.crtFilterEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 scanlines opacity-60" />
          <div className="absolute inset-0 crt-vignette opacity-70" />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
