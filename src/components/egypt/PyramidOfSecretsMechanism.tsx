import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { KiyaHorizonWatcher } from './KiyaHorizonWatcher';
import { FragmentPixelBadge } from '../PixelArtwork';
import { ArrowLeft, Unlock, Lock, Sparkles, CheckCircle2, Sun } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface PyramidOfSecretsMechanismProps {
  onBack: () => void;
}

export const PyramidOfSecretsMechanism: React.FC<PyramidOfSecretsMechanismProps> = ({ onBack }) => {
  const { state, unlockMechanism, goToScreen } = useGame();

  const hasSymbol1 = Boolean(state.solvedPuzzles.egypt_puzzle_1);
  const hasSymbol2 = Boolean(state.solvedPuzzles.egypt_puzzle_2);
  const isMechanismAlreadyUnlocked = Boolean(state.unlockedMechanisms.egypt_mechanism);

  const [slottedSymbol1, setSlottedSymbol1] = useState<boolean>(isMechanismAlreadyUnlocked || hasSymbol1);
  const [slottedSymbol2, setSlottedSymbol2] = useState<boolean>(isMechanismAlreadyUnlocked || hasSymbol2);
  const [doorPhase, setDoorPhase] = useState<number>(isMechanismAlreadyUnlocked ? 3 : 0);
  const [portalOpen, setPortalOpen] = useState<boolean>(isMechanismAlreadyUnlocked);
  const [animating, setAnimating] = useState<boolean>(false);

  const canActivate = hasSymbol1 && hasSymbol2 && !portalOpen;

  const handleSlotSymbol = (symNum: 1 | 2) => {
    if (portalOpen || animating) return;
    soundManager.playClick(state.soundEnabled);
    if (symNum === 1) setSlottedSymbol1(true);
    if (symNum === 2) setSlottedSymbol2(true);
  };

  const handleActivatePyramid = () => {
    if (!slottedSymbol1 || !slottedSymbol2 || portalOpen || animating) return;

    setAnimating(true);
    soundManager.playBell(0, state.soundEnabled);

    // Step 1: Solar disc alignment
    setTimeout(() => {
      setDoorPhase(1);
      soundManager.playBell(2, state.soundEnabled);

      // Step 2: Turquoise ankh energy channel activation
      setTimeout(() => {
        setDoorPhase(2);
        soundManager.playWaterFlow(state.soundEnabled);

        // Step 3: Sandstone portal slides open
        setTimeout(() => {
          soundManager.playGateOpen(state.soundEnabled);
          setDoorPhase(3);

          setTimeout(() => {
            setPortalOpen(true);
            setAnimating(false);
            soundManager.playSolve(state.soundEnabled);
            unlockMechanism('egypt_mechanism');
          }, 800);
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="relative min-h-[580px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-zinc-950 border-4 border-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.35)] text-zinc-100 flex flex-col justify-between">
      {/* Background Starry Sandstone Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-yellow-700/80 pb-3">
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
            <span className="font-pixel text-[10px] text-yellow-400">ANCIENT EGYPT · GRAND MECHANISM</span>
            <h2 className="font-pixel text-sm md:text-base text-yellow-300">THE PYRAMID OF SECRETS</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {portalOpen ? (
            <div className="font-pixel text-xs text-yellow-400 flex items-center gap-1.5 px-3 py-1 bg-yellow-950/60 border border-yellow-500">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" />
              <span>PYRAMID UNSEALED</span>
            </div>
          ) : (
            <div className="font-pixel text-xs text-zinc-400 flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700">
              <Lock className="w-3.5 h-3.5 text-yellow-500" />
              <span>SANCTUARY SEALED</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Altar & Pyramid Doorway Centerpiece */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        {/* Companion Dialogue strip */}
        <div className="w-full max-w-xl mb-4 flex items-center gap-4 p-3 bg-yellow-950/30 border-2 border-yellow-700/60">
          <KiyaHorizonWatcher size="sm" />
          <div className="text-xs font-silkscreen text-yellow-200">
            {portalOpen ? (
              <span className="text-yellow-300 font-pixel text-[11px]">
                "The golden doors of Ra have opened! Behold the Eternal Eye of Khem, keystone of cosmic truth!"
              </span>
            ) : canActivate ? (
              <span>
                "Both Sun Symbols are ready. Slot them into the twin solar cartouches to break the eternal seal of the tomb."
              </span>
            ) : (
              <span>
                "The inner sanctum requires the electrum Sun Symbol 1 from the starry ceiling and the lapis Sun Symbol 2 from the water basin."
              </span>
            )}
          </div>
        </div>

        {/* Grand Pyramid Portal Visual Graphic */}
        <div className="relative w-full max-w-lg h-64 md:h-72 bg-gradient-to-b from-stone-900 via-amber-950/80 to-stone-950 border-4 border-yellow-600/90 shadow-[inset_0_0_25px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between p-4 overflow-hidden">
          {/* Obelisk columns on sides */}
          <div className="absolute left-3 top-2 bottom-2 w-7 bg-stone-800 border-2 border-yellow-700/80 flex flex-col justify-around items-center py-2 text-[9px] text-yellow-500 font-pixel">
            <span>𓋹</span>
            <span>𓊽</span>
            <span>𓇯</span>
            <span>𓁹</span>
          </div>
          <div className="absolute right-3 top-2 bottom-2 w-7 bg-stone-800 border-2 border-yellow-700/80 flex flex-col justify-around items-center py-2 text-[9px] text-yellow-500 font-pixel">
            <span>𓁹</span>
            <span>𓇯</span>
            <span>𓊽</span>
            <span>𓋹</span>
          </div>

          {/* Starry Night Sky Ceiling */}
          <div className="w-full flex items-center justify-center gap-4 text-yellow-300 text-xs font-pixel py-1 border-b border-yellow-700/50">
            <Sun className="w-4 h-4 text-yellow-400 animate-spin [animation-duration:16s]" />
            <span className="tracking-widest">PORTAL OF THE RISING SUN</span>
            <Sun className="w-4 h-4 text-yellow-400 animate-spin [animation-duration:16s]" />
          </div>

          {/* Sandstone Sliding Door / Revealed Sanctum */}
          <div className="relative w-48 h-40 md:w-56 md:h-44 border-4 border-yellow-600 bg-stone-950 flex items-center justify-center overflow-hidden">
            {portalOpen ? (
              /* Opened Chamber with Glowing Eternal Eye */
              <div className="relative flex flex-col items-center justify-center animate-in zoom-in-75 duration-700">
                <div className="absolute inset-0 bg-yellow-500/25 blur-xl pointer-events-none" />
                <FragmentPixelBadge fragmentId="fragment_eternal_eye" collected={true} size="lg" />
                <span className="font-pixel text-[11px] text-yellow-300 mt-2 tracking-wide drop-shadow-[0_2px_0_#000]">
                  FRAGMENT OF THE ETERNAL EYE
                </span>
                <span className="text-[10px] font-silkscreen text-yellow-400/90 mt-0.5">
                  KEYSTONE OF ANCIENT EGYPT
                </span>
              </div>
            ) : (
              /* Sealed Sandstone Slabs */
              <div className="w-full h-full relative flex">
                {/* Left Sandstone Slab */}
                <div
                  className={`w-1/2 h-full bg-gradient-to-r from-stone-800 to-amber-900 border-r-2 border-yellow-600/80 flex flex-col items-center justify-center transition-transform duration-700 ${
                    doorPhase >= 3 ? '-translate-x-full' : ''
                  }`}
                >
                  <div className="text-xl text-yellow-500/60 font-pixel">𓁹</div>
                  <div className="w-2 h-8 border border-yellow-700 mt-2 bg-yellow-950/40" />
                </div>
                {/* Right Sandstone Slab */}
                <div
                  className={`w-1/2 h-full bg-gradient-to-l from-stone-800 to-amber-900 border-l-2 border-yellow-600/80 flex flex-col items-center justify-center transition-transform duration-700 ${
                    doorPhase >= 3 ? 'translate-x-full' : ''
                  }`}
                >
                  <div className="text-xl text-yellow-500/60 font-pixel">𓋹</div>
                  <div className="w-2 h-8 border border-yellow-700 mt-2 bg-yellow-950/40" />
                </div>

                {/* Center Seal Lock */}
                {doorPhase < 3 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-stone-900 border-2 border-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                      <Lock className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lower Stepped Altar Base */}
          <div className="w-full bg-stone-900 border-t-2 border-yellow-700/80 py-1.5 px-4 flex items-center justify-around text-[10px] font-silkscreen text-yellow-400">
            <span>ALABASTER PEDESTAL</span>
            <span>·</span>
            <span>ELECTRUM MATRIX</span>
            <span>·</span>
            <span>SIRIUS MERIDIAN</span>
          </div>
        </div>

        {/* Twin Receptacle Sockets for Sun Symbols */}
        <div className="w-full max-w-lg mt-4 grid grid-cols-2 gap-4">
          {/* Socket 1: Sun Symbol 1 */}
          <div
            onClick={() => hasSymbol1 && handleSlotSymbol(1)}
            className={`p-3 border-2 flex items-center gap-3 transition-colors ${
              slottedSymbol1
                ? 'border-yellow-400 bg-yellow-950/40 text-yellow-200'
                : hasSymbol1
                ? 'border-yellow-600 bg-zinc-900 hover:border-yellow-400 cursor-pointer text-zinc-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 border border-yellow-600/80 bg-stone-900 flex items-center justify-center text-xl shrink-0">
              {slottedSymbol1 ? '☀️' : hasSymbol1 ? '☀️' : '🔒'}
            </div>
            <div className="flex-1">
              <div className="font-pixel text-[11px] text-yellow-400 flex items-center justify-between">
                <span>SUN SYMBOL 1</span>
                {slottedSymbol1 ? (
                  <span className="text-emerald-400 text-[9px]">SLOTTED</span>
                ) : hasSymbol1 ? (
                  <span className="text-amber-400 text-[9px]">CLICK TO SLOT</span>
                ) : (
                  <span className="text-zinc-500 text-[9px]">SEALED</span>
                )}
              </div>
              <div className="text-[10px] font-silkscreen text-zinc-400">
                {slottedSymbol1 ? 'Electrum Solar Disc aligned' : hasSymbol1 ? 'Found in Scattered Ceiling' : 'Solve Chamber I puzzle'}
              </div>
            </div>
          </div>

          {/* Socket 2: Sun Symbol 2 */}
          <div
            onClick={() => hasSymbol2 && handleSlotSymbol(2)}
            className={`p-3 border-2 flex items-center gap-3 transition-colors ${
              slottedSymbol2
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                : hasSymbol2
                ? 'border-cyan-600 bg-zinc-900 hover:border-cyan-400 cursor-pointer text-zinc-300'
                : 'border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <div className="w-10 h-10 border border-cyan-600/80 bg-stone-900 flex items-center justify-center text-xl shrink-0">
              {slottedSymbol2 ? '☥' : hasSymbol2 ? '☥' : '🔒'}
            </div>
            <div className="flex-1">
              <div className="font-pixel text-[11px] text-cyan-400 flex items-center justify-between">
                <span>SUN SYMBOL 2</span>
                {slottedSymbol2 ? (
                  <span className="text-emerald-400 text-[9px]">SLOTTED</span>
                ) : hasSymbol2 ? (
                  <span className="text-amber-400 text-[9px]">CLICK TO SLOT</span>
                ) : (
                  <span className="text-zinc-500 text-[9px]">SEALED</span>
                )}
              </div>
              <div className="text-[10px] font-silkscreen text-zinc-400">
                {slottedSymbol2 ? 'Lapis Lazuli Ankh placed' : hasSymbol2 ? 'Found in Cracked Basin' : 'Solve Chamber II puzzle'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-yellow-700/80 pt-3">
        <button
          onClick={() => {
            soundManager.playCancel(state.soundEnabled);
            onBack();
          }}
          className="pixel-btn px-4 py-2 border-2 border-zinc-700 bg-zinc-800 text-zinc-300 font-pixel text-xs"
        >
          RETURN TO HUB
        </button>

        {portalOpen ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToScreen('ASSEMBLY')}
              className="pixel-btn px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center gap-2 animate-pulse"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>PROCEED TO ARTIFACT REASSEMBLY</span>
            </button>
          </div>
        ) : canActivate ? (
          <button
            onClick={handleActivatePyramid}
            disabled={animating}
            className={`pixel-btn px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-pixel text-xs font-bold border-2 border-yellow-300 shadow-[0_3px_0_#854d0e] flex items-center gap-2 ${
              animating ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>{animating ? 'UNSEALING TOMB...' : 'UNSEAL THE PYRAMID OF SECRETS'}</span>
          </button>
        ) : (
          <div className="text-xs font-silkscreen text-zinc-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Collect both Sun Symbols to awaken the pyramid mechanism</span>
          </div>
        )}
      </div>
    </div>
  );
};
