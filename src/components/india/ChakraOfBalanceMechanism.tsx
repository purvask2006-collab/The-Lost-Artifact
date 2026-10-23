import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { IndianPriestessSprite } from '../IndianPriestessSprite';
import { FragmentPixelBadge } from '../PixelArtwork';
import { ArrowLeft, Unlock, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ChakraOfBalanceMechanismProps {
  onBack: () => void;
}

export const ChakraOfBalanceMechanism: React.FC<ChakraOfBalanceMechanismProps> = ({ onBack }) => {
  const { state, unlockMechanism, returnToWorldMap } = useGame();

  const hasGnomon = Boolean(state.solvedPuzzles.india_puzzle_1);
  const hasLotusKey = Boolean(state.solvedPuzzles.india_puzzle_2);
  const isMechanismAlreadyUnlocked = Boolean(state.unlockedMechanisms.india_mechanism);

  const [slottedGnomon, setSlottedGnomon] = useState<boolean>(isMechanismAlreadyUnlocked || hasGnomon);
  const [slottedLotusKey, setSlottedLotusKey] = useState<boolean>(isMechanismAlreadyUnlocked || hasLotusKey);
  const [chakraRotation, setChakraRotation] = useState<number>(isMechanismAlreadyUnlocked ? 360 : 0);
  const [vaultOpen, setVaultOpen] = useState<boolean>(isMechanismAlreadyUnlocked);
  const [animating, setAnimating] = useState<boolean>(false);

  const canActivate = hasGnomon && hasLotusKey && !vaultOpen;

  const handleSlotRelic = (relicNum: 1 | 2) => {
    if (vaultOpen || animating) return;
    soundManager.playClick(state.soundEnabled);
    if (relicNum === 1) setSlottedGnomon(true);
    if (relicNum === 2) setSlottedLotusKey(true);
  };

  const handleActivateChakra = () => {
    if (!slottedGnomon || !slottedLotusKey || vaultOpen || animating) return;

    setAnimating(true);
    soundManager.playBell(0, state.soundEnabled);

    // Chakra rotation step 1
    setTimeout(() => {
      setChakraRotation(120);
      soundManager.playRotateTile(state.soundEnabled);

      // Step 2
      setTimeout(() => {
        setChakraRotation(240);
        soundManager.playRotateTile(state.soundEnabled);

        // Step 3: Vault aligns and opens
        setTimeout(() => {
          setChakraRotation(360);
          soundManager.playGateOpen(state.soundEnabled);

          setTimeout(() => {
            setVaultOpen(true);
            setAnimating(false);
            soundManager.playSolve(state.soundEnabled);
            unlockMechanism('india_mechanism');
          }, 800);
        }, 600);
      }, 600);
    }, 500);
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-stone-950 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.35)] text-zinc-100 flex flex-col justify-between">
      {/* Atmosphere overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-800 pb-3">
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
            <span className="font-pixel text-[10px] text-amber-500">ANCIENT INDIA · GRAND MECHANISM</span>
            <h2 className="font-pixel text-sm md:text-base text-amber-400">THE CHAKRA OF BALANCE</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {vaultOpen ? (
            <div className="font-pixel text-xs text-amber-300 flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>CHAKRA AWAKENED</span>
            </div>
          ) : (
            <div className="font-pixel text-xs text-zinc-400 flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>VAULT SEALED</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Altar View */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        {/* Priestess Dialogue */}
        <div className="w-full max-w-xl mb-4 flex items-center gap-4 p-3 bg-amber-950/40 border-2 border-amber-700/60">
          <IndianPriestessSprite size="sm" direction="south" />
          <div className="text-xs font-silkscreen text-amber-200">
            {vaultOpen ? (
              <span className="text-amber-300 font-pixel text-[11px]">
                "The cosmic chakra has turned! The Fragment of the Solar Wheel is released, and the eastern path to Japan's Shrine of Memories is now open!"
              </span>
            ) : canActivate ? (
              <span>
                "Both sacred keys are placed upon the stone dais. Turn the monumental wheel to awaken the solar energy!"
              </span>
            ) : (
              <span>
                "The Chakra remains motionless. Retrieve the Golden Gnomon from the Courtyard and the Ruby Lotus Key from the Five Hearths."
              </span>
            )}
          </div>
        </div>

        {/* Central Sandstone Chakra Wheel Animation Graphic */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 border-4 border-amber-700 bg-stone-900 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden p-4">
          {/* Animated Turning Chakra Wheel */}
          <div
            className="w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-amber-500 flex items-center justify-center transition-transform duration-700 ease-out shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            style={{ transform: `rotate(${chakraRotation}deg)` }}
          >
            {/* 24 Rays Spoke Graphic */}
            <div className="relative w-full h-full flex items-center justify-center">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                <div
                  key={deg}
                  className="absolute w-full h-0.5 bg-amber-400/60"
                  style={{ transform: `rotate(${deg}deg)` }}
                />
              ))}
              {/* Inner Hub */}
              <div className="w-20 h-20 rounded-full bg-stone-950 border-4 border-amber-400 flex items-center justify-center z-10">
                <span className="text-2xl text-amber-300">☸</span>
              </div>
            </div>
          </div>

          {/* Center Fragment if unlocked */}
          {vaultOpen && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 animate-in zoom-in-75 duration-500">
              <FragmentPixelBadge fragmentId="fragment_solar_wheel" collected={true} size="lg" />
              <span className="font-pixel text-[11px] text-amber-300 mt-2">
                FRAGMENT OF THE SOLAR WHEEL
              </span>
            </div>
          )}
        </div>

        {/* Receptacles */}
        <div className="w-full max-w-lg mt-4 grid grid-cols-2 gap-4">
          {/* Socket 1 */}
          <div
            onClick={() => hasGnomon && handleSlotRelic(1)}
            className={`p-3 border-2 flex items-center gap-3 transition-colors ${
              slottedGnomon
                ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                : hasGnomon
                ? 'border-amber-600 bg-stone-900 hover:border-amber-400 cursor-pointer text-zinc-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 border border-amber-600/80 bg-stone-900 flex items-center justify-center text-xl shrink-0">
              {slottedGnomon ? '☀️' : hasGnomon ? '☀️' : '🔒'}
            </div>
            <div className="flex-1">
              <div className="font-pixel text-[11px] text-amber-400 flex items-center justify-between">
                <span>GNOMON OF UJJAIN</span>
                {slottedGnomon ? (
                  <span className="text-emerald-400 text-[9px]">SLOTTED</span>
                ) : hasGnomon ? (
                  <span className="text-amber-400 text-[9px]">CLICK TO SLOT</span>
                ) : (
                  <span className="text-zinc-500 text-[9px]">SEALED</span>
                )}
              </div>
              <div className="text-[10px] font-silkscreen text-zinc-400">
                {slottedGnomon ? 'Aligned in North Socket' : hasGnomon ? 'Found in Courtyard' : 'Solve Courtyard puzzle'}
              </div>
            </div>
          </div>

          {/* Socket 2 */}
          <div
            onClick={() => hasLotusKey && handleSlotRelic(2)}
            className={`p-3 border-2 flex items-center gap-3 transition-colors ${
              slottedLotusKey
                ? 'border-red-400 bg-red-950/40 text-red-200'
                : hasLotusKey
                ? 'border-red-600 bg-stone-900 hover:border-red-400 cursor-pointer text-zinc-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 border border-red-600/80 bg-stone-900 flex items-center justify-center text-xl shrink-0">
              {slottedLotusKey ? '🪷' : hasLotusKey ? '🪷' : '🔒'}
            </div>
            <div className="flex-1">
              <div className="font-pixel text-[11px] text-red-400 flex items-center justify-between">
                <span>RUBY LOTUS KEY</span>
                {slottedLotusKey ? (
                  <span className="text-emerald-400 text-[9px]">SLOTTED</span>
                ) : hasLotusKey ? (
                  <span className="text-amber-400 text-[9px]">CLICK TO SLOT</span>
                ) : (
                  <span className="text-zinc-500 text-[9px]">SEALED</span>
                )}
              </div>
              <div className="text-[10px] font-silkscreen text-zinc-400">
                {slottedLotusKey ? 'Turned in South Socket' : hasLotusKey ? 'Found in Five Hearths' : 'Solve Hearths puzzle'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-amber-800 pt-3">
        <button
          onClick={() => {
            soundManager.playCancel(state.soundEnabled);
            onBack();
          }}
          className="pixel-btn px-4 py-2 border-2 border-zinc-700 bg-zinc-800 text-zinc-300 font-pixel text-xs"
        >
          RETURN TO HUB
        </button>

        {vaultOpen ? (
          <button
            onClick={returnToWorldMap}
            className="pixel-btn px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.5)] flex items-center gap-2 animate-pulse"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>JOURNEY TO JAPAN (NOW UNLOCKED)</span>
          </button>
        ) : canActivate ? (
          <button
            onClick={handleActivateChakra}
            disabled={animating}
            className={`pixel-btn px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-amber-300 shadow-[0_3px_0_#92400e] flex items-center gap-2 ${
              animating ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>{animating ? 'AWAKENING CHAKRA...' : 'ACTIVATE THE CHAKRA OF BALANCE'}</span>
          </button>
        ) : (
          <div className="text-xs font-silkscreen text-zinc-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Slot both relics to turn the Chakra</span>
          </div>
        )}
      </div>
    </div>
  );
};
