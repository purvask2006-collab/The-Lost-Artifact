import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FragmentPixelBadge } from '../PixelArtwork';
import { ArrowLeft, Lock, Sparkles, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { GEMSTONES } from '../../data/gameData';
import { GemstoneId } from '../../types/game';

interface ChakraOfBalanceMechanismProps {
  onBack: () => void;
}

const INDIA_GEMS: { id: GemstoneId; slotLabel: string; deg: number }[] = [
  { id: 'ruby', slotLabel: 'NORTH · VEDIC FIRE', deg: 0 },
  { id: 'emerald', slotLabel: 'EAST · VERDANT LOTUS', deg: 90 },
  { id: 'sapphire', slotLabel: 'SOUTH · CELESTIAL MANTRA', deg: 180 },
  { id: 'citrine', slotLabel: 'WEST · SOLAR BINDU', deg: 270 },
];

export const ChakraOfBalanceMechanism: React.FC<ChakraOfBalanceMechanismProps> = ({ onBack }) => {
  const { state, unlockMechanism, socketGemstone, selectCivilization, returnToWorldMap } = useGame();

  const isMechanismAlreadyUnlocked = Boolean(state.unlockedMechanisms.india_mechanism);
  const socketed = state.socketedGemstones.india_mechanism || [];

  const [localSocketed, setLocalSocketed] = useState<GemstoneId[]>(() => {
    return isMechanismAlreadyUnlocked 
      ? ['ruby', 'emerald', 'sapphire', 'citrine'] 
      : socketed;
  });

  const [chakraRotation, setChakraRotation] = useState<number>(isMechanismAlreadyUnlocked ? 360 : 0);
  const [vaultOpen, setVaultOpen] = useState<boolean>(isMechanismAlreadyUnlocked);
  const [animating, setAnimating] = useState<boolean>(false);

  // Check which gems player owns
  const ownedGems = INDIA_GEMS.map(g => ({
    ...g,
    gem: GEMSTONES[g.id],
    isOwned: Boolean(state.collectedGemstones[g.id] || state.solvedPuzzles[GEMSTONES[g.id].earnedFromPuzzleId]),
    isSocketed: localSocketed.includes(g.id),
  }));

  const all4Socketed = INDIA_GEMS.every(g => localSocketed.includes(g.id));
  const hasAll4Owned = ownedGems.every(g => g.isOwned);

  const handleSocketOne = (gemId: GemstoneId) => {
    if (vaultOpen || animating || localSocketed.includes(gemId)) return;
    const isOwned = Boolean(state.collectedGemstones[gemId] || state.solvedPuzzles[GEMSTONES[gemId].earnedFromPuzzleId]);
    if (!isOwned) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }

    soundManager.playSnapKeystone(state.soundEnabled);
    const updated = [...localSocketed, gemId];
    setLocalSocketed(updated);
    socketGemstone('india_mechanism', gemId);
  };

  const handleSocketAll = () => {
    if (vaultOpen || animating || !hasAll4Owned) return;
    soundManager.playSnapKeystone(state.soundEnabled);
    const all = ['ruby', 'emerald', 'sapphire', 'citrine'] as GemstoneId[];
    setLocalSocketed(all);
    all.forEach(g => socketGemstone('india_mechanism', g));
  };

  const handleActivateChakra = () => {
    if (!all4Socketed || vaultOpen || animating) return;

    setAnimating(true);
    soundManager.playBell(0, state.soundEnabled);

    // Sequence rotation
    setTimeout(() => {
      setChakraRotation(120);
      soundManager.playRotateTile(state.soundEnabled);

      setTimeout(() => {
        setChakraRotation(240);
        soundManager.playRotateTile(state.soundEnabled);

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
    <div className="relative min-h-[620px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-[#171120] border-4 border-[#e8b84a] shadow-[0_0_35px_rgba(232,184,74,0.35)] text-[#e3dfb1] flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#3a334a] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playCancel(state.soundEnabled);
              onBack();
            }}
            className="pixel-btn min-h-[44px] px-3.5 text-[14px] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          <div>
            <div className="font-pixel text-[12px] text-[#f59e0b]">ANCIENT INDIA · GRAND MECHANISM</div>
            <h2 className="font-pixel text-[18px] md:text-[22px] text-[#ffffff]">THE CHAKRA OF BALANCE</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {vaultOpen ? (
            <div className="font-pixel text-[13px] text-[#6ee7b7] flex items-center gap-2 px-3.5 py-1.5 bg-[#142e22] border-2 border-[#10b981]">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span>CHAKRA AWAKENED</span>
            </div>
          ) : (
            <div className="font-pixel text-[13px] text-[#e8b84a] flex items-center gap-2 px-3.5 py-1.5 bg-[#251b14] border-2 border-[#e8b84a]">
              <Lock className="w-4 h-4 text-[#e8b84a]" />
              <span>{all4Socketed ? 'READY TO AWAKEN' : `${localSocketed.length}/4 KEYS SOCKETED`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Altar Area */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        {/* Environmental Guardian Altar Banner */}
        <div className="w-full max-w-xl mb-4 px-4 py-2.5 bg-[#241a12] border-2 border-[#e8b84a] text-center shadow-[0_3px_0_#000]">
          <span className="font-silkscreen text-[14px] text-[#fde047]">
            {vaultOpen
              ? 'THE COSMIC CHAKRA HAS TURNED · FRAGMENT UNSEALED'
              : all4Socketed
              ? 'ALL 4 GEMSTONE KEYS SEATED · TURN THE WHEEL'
              : 'PLACE 4 REGIONAL GEMSTONES INTO THE DAIS RECEPTACLES'}
          </span>
        </div>

        {/* Central Sandstone Chakra Wheel Animation Graphic */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-[#e8b84a] bg-[#130e20] shadow-[inset_0_0_35px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden p-4">
          {/* Animated Turning Chakra Wheel */}
          <div
            className="w-52 h-52 md:w-64 md:h-64 rounded-full border-8 border-[#f59e0b] flex items-center justify-center transition-transform duration-700 ease-out shadow-[0_0_25px_rgba(245,158,11,0.5)]"
            style={{ transform: `rotate(${chakraRotation}deg)` }}
          >
            {/* 24 Rays Spoke Graphic */}
            <div className="relative w-full h-full flex items-center justify-center">
              {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map(deg => (
                <div
                  key={deg}
                  className="absolute w-full h-0.5 bg-[#f59e0b]/60"
                  style={{ transform: `rotate(${deg}deg)` }}
                />
              ))}
              {/* Inner Hub */}
              <div className="w-20 h-20 rounded-full bg-[#130e20] border-4 border-[#fde047] flex items-center justify-center z-10 shadow-[0_0_15px_rgba(253,224,71,0.6)]">
                <span className="text-3xl text-[#fde047]">☸</span>
              </div>
            </div>
          </div>

          {/* Center Fragment if unlocked */}
          {vaultOpen && (
            <div className="absolute inset-0 bg-[#130e20]/80 flex flex-col items-center justify-center z-20 animate-in zoom-in-75 duration-500">
              <FragmentPixelBadge fragmentId="fragment_solar_wheel" collected={true} size="lg" />
              <span className="font-pixel text-[14px] text-[#fde047] mt-3 tracking-wider">
                FRAGMENT OF THE SOLAR WHEEL
              </span>
            </div>
          )}
        </div>

        {/* 4 Gemstone Sockets Grid */}
        <div className="w-full max-w-xl mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ownedGems.map(item => {
            return (
              <div
                key={item.id}
                onClick={() => item.isOwned && !item.isSocketed && handleSocketOne(item.id)}
                className={`p-3 border-3 flex flex-col items-center justify-center text-center transition-all min-h-[96px] ${
                  item.isSocketed
                    ? 'border-[#10b981] bg-[#142e22] text-[#e3dfb1] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : item.isOwned
                    ? 'border-[#e8b84a] bg-[#2a1f14] hover:border-[#fde047] cursor-pointer text-[#ffffff] animate-pixel-glow'
                    : 'border-[#3a334a] bg-[#151120] text-[#676b76] opacity-60 cursor-not-allowed'
                }`}
                title={item.isOwned ? `Click to socket ${item.gem.name}` : `${item.gem.name} (Not yet collected)`}
              >
                <div
                  className="w-10 h-10 border-2 border-current flex items-center justify-center text-xl mb-1.5"
                  style={{ color: item.gem.hexColor }}
                >
                  {item.isSocketed ? item.gem.icon : item.isOwned ? item.gem.icon : <Lock className="w-4 h-4 text-[#676b76]" />}
                </div>
                <div className="font-silkscreen text-[12px] font-bold text-[#ffffff] leading-tight">
                  {item.gem.name.split(' ')[0]}
                </div>
                <div className="font-silkscreen text-[11px] mt-0.5" style={{ color: item.isSocketed ? '#10b981' : item.gem.hexColor }}>
                  {item.isSocketed ? 'SOCKETED' : item.isOwned ? 'READY' : 'LOCKED'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#3a334a]">
        <div>
          {!all4Socketed && hasAll4Owned && (
            <button
              onClick={handleSocketAll}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-5 text-[14px] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>PLACE ALL 4 KEYS</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {vaultOpen ? (
            <button
              onClick={() => selectCivilization('japan')}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-6 text-[15px] flex items-center gap-2"
            >
              <span>CONTINUE TO JAPAN</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleActivateChakra}
              disabled={!all4Socketed || animating}
              className={`min-h-[44px] px-6 text-[15px] pixel-btn flex items-center gap-2 font-pixel ${
                all4Socketed && !animating
                  ? 'pixel-btn-primary animate-pixel-glow cursor-pointer'
                  : 'border-[#3a334a] bg-[#151120] text-[#676b76] cursor-not-allowed opacity-60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{animating ? 'TURNING CHAKRA...' : 'AWAKEN CHAKRA'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
