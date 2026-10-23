import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FragmentPixelBadge } from '../PixelArtwork';
import { ArrowLeft, Lock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { GEMSTONES } from '../../data/gameData';
import { GemstoneId } from '../../types/game';

interface ShrineOfMemoriesMechanismProps {
  onBack: () => void;
}

const JAPAN_GEMS: { id: GemstoneId; slotLabel: string }[] = [
  { id: 'rose_quartz', slotLabel: 'BLOSSOM ROSE QUARTZ' },
  { id: 'moonstone', slotLabel: 'LUMINESCENT MOONSTONE' },
  { id: 'amethyst', slotLabel: 'TWILIGHT BELL AMETHYST' },
  { id: 'obsidian', slotLabel: 'SOVEREIGN OBSIDIAN' },
];

export const ShrineOfMemoriesMechanism: React.FC<ShrineOfMemoriesMechanismProps> = ({ onBack }) => {
  const { state, unlockMechanism, socketGemstone, selectCivilization } = useGame();

  const isMechanismAlreadyUnlocked = Boolean(state.unlockedMechanisms.japan_mechanism);
  const socketed = state.socketedGemstones.japan_mechanism || [];

  const [localSocketed, setLocalSocketed] = useState<GemstoneId[]>(() => {
    return isMechanismAlreadyUnlocked 
      ? ['rose_quartz', 'moonstone', 'amethyst', 'obsidian'] 
      : socketed;
  });

  const [lanternPhase, setLanternPhase] = useState<number>(isMechanismAlreadyUnlocked ? 4 : 0);
  const [gateOpen, setGateOpen] = useState<boolean>(isMechanismAlreadyUnlocked);
  const [animating, setAnimating] = useState<boolean>(false);

  const ownedGems = JAPAN_GEMS.map(g => ({
    ...g,
    gem: GEMSTONES[g.id],
    isOwned: Boolean(state.collectedGemstones[g.id] || state.solvedPuzzles[GEMSTONES[g.id].earnedFromPuzzleId]),
    isSocketed: localSocketed.includes(g.id),
  }));

  const all4Socketed = JAPAN_GEMS.every(g => localSocketed.includes(g.id));
  const hasAll4Owned = ownedGems.every(g => g.isOwned);

  const handleSocketOne = (gemId: GemstoneId) => {
    if (gateOpen || animating || localSocketed.includes(gemId)) return;
    const isOwned = Boolean(state.collectedGemstones[gemId] || state.solvedPuzzles[GEMSTONES[gemId].earnedFromPuzzleId]);
    if (!isOwned) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }

    soundManager.playSnapKeystone(state.soundEnabled);
    const updated = [...localSocketed, gemId];
    setLocalSocketed(updated);
    socketGemstone('japan_mechanism', gemId);
  };

  const handleSocketAll = () => {
    if (gateOpen || animating || !hasAll4Owned) return;
    soundManager.playSnapKeystone(state.soundEnabled);
    const all = ['rose_quartz', 'moonstone', 'amethyst', 'obsidian'] as GemstoneId[];
    setLocalSocketed(all);
    all.forEach(g => socketGemstone('japan_mechanism', g));
  };

  const handleActivateGate = () => {
    if (!all4Socketed || gateOpen || animating) return;

    setAnimating(true);
    soundManager.playBell(0, state.soundEnabled);

    // Lantern step 1
    setTimeout(() => {
      setLanternPhase(1);
      soundManager.playBell(1, state.soundEnabled);

      // Lantern step 2
      setTimeout(() => {
        setLanternPhase(2);
        soundManager.playBell(2, state.soundEnabled);

        // Lantern step 3
        setTimeout(() => {
          setLanternPhase(3);
          soundManager.playBell(3, state.soundEnabled);

          // Lantern step 4 + Torii open
          setTimeout(() => {
            setLanternPhase(4);
            soundManager.playGateOpen(state.soundEnabled);

            setTimeout(() => {
              setGateOpen(true);
              setAnimating(false);
              soundManager.playSolve(state.soundEnabled);
              unlockMechanism('japan_mechanism');
            }, 700);
          }, 500);
        }, 500);
      }, 500);
    }, 400);
  };

  return (
    <div className="relative min-h-[620px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-[#161224] border-4 border-[#38bdf8] shadow-[0_0_35px_rgba(56,189,248,0.35)] text-[#e3dfb1] flex flex-col justify-between select-none">
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
            <div className="font-pixel text-[12px] text-[#38bdf8]">FEUDAL JAPAN · GRAND MECHANISM</div>
            <h2 className="font-pixel text-[18px] md:text-[22px] text-[#ffffff]">THE SHRINE OF MEMORIES</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {gateOpen ? (
            <div className="font-pixel text-[13px] text-[#6ee7b7] flex items-center gap-2 px-3.5 py-1.5 bg-[#142e22] border-2 border-[#10b981]">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span>SHRINE UNLOCKED</span>
            </div>
          ) : (
            <div className="font-pixel text-[13px] text-[#38bdf8] flex items-center gap-2 px-3.5 py-1.5 bg-[#162534] border-2 border-[#38bdf8]">
              <Lock className="w-4 h-4 text-[#38bdf8]" />
              <span>{all4Socketed ? 'READY TO AWAKEN' : `${localSocketed.length}/4 KEYS SOCKETED`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Altar Area */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        {/* Environmental Guardian Altar Banner */}
        <div className="w-full max-w-xl mb-4 px-4 py-2.5 bg-[#172230] border-2 border-[#38bdf8] text-center shadow-[0_3px_0_#000]">
          <span className="font-silkscreen text-[14px] text-[#7dd3fc]">
            {gateOpen
              ? 'THE SACRED TORII HAS OPENED · CELESTIAL MIRROR REVEALED'
              : all4Socketed
              ? 'ALL 4 SHRINE GEMS PLACED · IGNITE THE SPIRIT LANTERNS'
              : 'PLACE 4 REGIONAL GEMSTONES INTO THE CEREMONIAL ALTAR'}
          </span>
        </div>

        {/* Central Torii Gate & Spirit Altar Graphic */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-[#38bdf8] bg-[#110e1e] shadow-[inset_0_0_35px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden p-4">
          {/* Torii Gate Outline */}
          <div className="relative w-52 h-52 md:w-64 md:h-64 flex flex-col items-center justify-center">
            {/* Top Beam */}
            <div className="w-44 md:w-56 h-4 bg-[#f43f5e] border-2 border-[#fda4af] shadow-[0_0_15px_rgba(244,63,94,0.6)] mb-1" />
            <div className="w-36 md:w-48 h-2 bg-[#e11d48] border-b border-[#fda4af] mb-4" />

            {/* Pillars & Lanterns */}
            <div className="w-36 md:w-48 flex justify-between items-center relative h-32">
              <div className="w-4 h-full bg-[#f43f5e] border-r-2 border-[#fda4af]" />

              {/* Center Basin / Mirror / Gate Opening */}
              <div className="w-24 h-24 border-3 border-[#38bdf8] bg-[#192233] flex items-center justify-center relative">
                {gateOpen ? (
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-500">
                    <FragmentPixelBadge fragmentId="fragment_celestial_mirror" collected={true} size="md" />
                    <span className="font-pixel text-[11px] text-[#7dd3fc] mt-1">MIRROR</span>
                  </div>
                ) : (
                  <span className="text-3xl text-[#38bdf8] opacity-75">⛩</span>
                )}
              </div>

              <div className="w-4 h-full bg-[#f43f5e] border-l-2 border-[#fda4af]" />
            </div>

            {/* 4 Altar Lanterns */}
            <div className="flex items-center gap-3 mt-3">
              {[1, 2, 3, 4].map(idx => {
                const isLit = lanternPhase >= idx;
                return (
                  <div
                    key={idx}
                    className={`w-6 h-8 border-2 flex items-center justify-center text-xs transition-all ${
                      isLit
                        ? 'border-[#fde047] bg-[#ca8a04] shadow-[0_0_15px_rgba(253,224,71,0.8)] text-[#ffffff]'
                        : 'border-[#475569] bg-[#1e293b] text-[#64748b]'
                    }`}
                  >
                    🏮
                  </div>
                );
              })}
            </div>
          </div>
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
                    ? 'border-[#38bdf8] bg-[#1b273b] hover:border-[#7dd3fc] cursor-pointer text-[#ffffff] animate-pixel-glow'
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
          {gateOpen ? (
            <button
              onClick={() => selectCivilization('egypt')}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-6 text-[15px] flex items-center gap-2"
            >
              <span>CONTINUE TO EGYPT</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleActivateGate}
              disabled={!all4Socketed || animating}
              className={`min-h-[44px] px-6 text-[15px] pixel-btn flex items-center gap-2 font-pixel ${
                all4Socketed && !animating
                  ? 'pixel-btn-primary animate-pixel-glow cursor-pointer'
                  : 'border-[#3a334a] bg-[#151120] text-[#676b76] cursor-not-allowed opacity-60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{animating ? 'ILLUMINATING...' : 'ILLUMINATE SHRINE'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
