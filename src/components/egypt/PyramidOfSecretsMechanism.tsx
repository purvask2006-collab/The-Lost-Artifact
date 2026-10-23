import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FragmentPixelBadge } from '../PixelArtwork';
import { ArrowLeft, Lock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { GEMSTONES } from '../../data/gameData';
import { GemstoneId } from '../../types/game';

interface PyramidOfSecretsMechanismProps {
  onBack: () => void;
}

const EGYPT_GEMS: { id: GemstoneId; slotLabel: string }[] = [
  { id: 'lapis_lazuli', slotLabel: 'COSMIC LAPIS LAZULI' },
  { id: 'turquoise', slotLabel: 'NILE BASIN TURQUOISE' },
  { id: 'carnelian', slotLabel: 'SOLAR ZENITH CARNELIAN' },
  { id: 'malachite', slotLabel: 'ZODIAC DECAN MALACHITE' },
];

export const PyramidOfSecretsMechanism: React.FC<PyramidOfSecretsMechanismProps> = ({ onBack }) => {
  const { state, unlockMechanism, socketGemstone, goToScreen } = useGame();

  const isMechanismAlreadyUnlocked = Boolean(state.unlockedMechanisms.egypt_mechanism);
  const socketed = state.socketedGemstones.egypt_mechanism || [];

  const [localSocketed, setLocalSocketed] = useState<GemstoneId[]>(() => {
    return isMechanismAlreadyUnlocked 
      ? ['lapis_lazuli', 'turquoise', 'carnelian', 'malachite'] 
      : socketed;
  });

  const [doorPhase, setDoorPhase] = useState<number>(isMechanismAlreadyUnlocked ? 3 : 0);
  const [portalOpen, setPortalOpen] = useState<boolean>(isMechanismAlreadyUnlocked);
  const [animating, setAnimating] = useState<boolean>(false);

  const ownedGems = EGYPT_GEMS.map(g => ({
    ...g,
    gem: GEMSTONES[g.id],
    isOwned: Boolean(state.collectedGemstones[g.id] || state.solvedPuzzles[GEMSTONES[g.id].earnedFromPuzzleId]),
    isSocketed: localSocketed.includes(g.id),
  }));

  const all4Socketed = EGYPT_GEMS.every(g => localSocketed.includes(g.id));
  const hasAll4Owned = ownedGems.every(g => g.isOwned);

  const handleSocketOne = (gemId: GemstoneId) => {
    if (portalOpen || animating || localSocketed.includes(gemId)) return;
    const isOwned = Boolean(state.collectedGemstones[gemId] || state.solvedPuzzles[GEMSTONES[gemId].earnedFromPuzzleId]);
    if (!isOwned) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }

    soundManager.playSnapKeystone(state.soundEnabled);
    const updated = [...localSocketed, gemId];
    setLocalSocketed(updated);
    socketGemstone('egypt_mechanism', gemId);
  };

  const handleSocketAll = () => {
    if (portalOpen || animating || !hasAll4Owned) return;
    soundManager.playSnapKeystone(state.soundEnabled);
    const all = ['lapis_lazuli', 'turquoise', 'carnelian', 'malachite'] as GemstoneId[];
    setLocalSocketed(all);
    all.forEach(g => socketGemstone('egypt_mechanism', g));
  };

  const handleActivatePyramid = () => {
    if (!all4Socketed || portalOpen || animating) return;

    setAnimating(true);
    soundManager.playBell(0, state.soundEnabled);

    // Step 1: Solar disc alignment
    setTimeout(() => {
      setDoorPhase(1);
      soundManager.playBell(2, state.soundEnabled);

      // Step 2: Turquoise Nile energy channel
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
      }, 500);
    }, 500);
  };

  return (
    <div className="relative min-h-[620px] w-full max-w-4xl mx-auto p-4 md:p-6 bg-[#18111e] border-4 border-[#06b6d4] shadow-[0_0_35px_rgba(6,182,212,0.35)] text-[#e3dfb1] flex flex-col justify-between select-none">
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
            <div className="font-pixel text-[12px] text-[#06b6d4]">ANCIENT EGYPT · GRAND MECHANISM</div>
            <h2 className="font-pixel text-[18px] md:text-[22px] text-[#ffffff]">THE PYRAMID OF SECRETS</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {portalOpen ? (
            <div className="font-pixel text-[13px] text-[#6ee7b7] flex items-center gap-2 px-3.5 py-1.5 bg-[#142e22] border-2 border-[#10b981]">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span>PYRAMID UNLOCKED</span>
            </div>
          ) : (
            <div className="font-pixel text-[13px] text-[#06b6d4] flex items-center gap-2 px-3.5 py-1.5 bg-[#14232c] border-2 border-[#06b6d4]">
              <Lock className="w-4 h-4 text-[#06b6d4]" />
              <span>{all4Socketed ? 'READY TO AWAKEN' : `${localSocketed.length}/4 KEYS SOCKETED`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Altar Area */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        {/* Environmental Guardian Altar Banner */}
        <div className="w-full max-w-xl mb-4 px-4 py-2.5 bg-[#19242d] border-2 border-[#06b6d4] text-center shadow-[0_3px_0_#000]">
          <span className="font-silkscreen text-[14px] text-[#67e8f9]">
            {portalOpen
              ? 'THE GOLDEN PORTAL SLIDES OPEN · ETERNAL EYE REVEALED'
              : all4Socketed
              ? 'ALL 4 STELLAR GEMS SEATED · ALIGN THE SOLAR DISC'
              : 'PLACE 4 REGIONAL GEMSTONES INTO KIYA’S SOLAR DAIS'}
          </span>
        </div>

        {/* Central Sandstone Pyramid & Solar Portal Graphic */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-[#06b6d4] bg-[#120e1e] shadow-[inset_0_0_35px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden p-4">
          {/* Pyramid Contour Graphic */}
          <div className="relative w-52 h-52 md:w-64 md:h-64 flex flex-col items-center justify-center">
            {/* Pyramid Apex Gold Capstone */}
            <div className="w-12 h-10 border-2 border-[#fde047] bg-[#eab308] flex items-center justify-center text-xs shadow-[0_0_15px_rgba(253,224,71,0.6)]">
              𓇳
            </div>

            {/* Pyramid Tiers */}
            <div className="w-32 h-6 border-2 border-[#b45309] bg-[#78350f] mt-1" />
            <div className="w-44 h-8 border-2 border-[#b45309] bg-[#78350f] mt-1 flex items-center justify-center">
              {/* Cyan Energy Channel */}
              <div className={`h-1.5 transition-all duration-500 ${doorPhase >= 2 ? 'w-36 bg-[#06b6d4] shadow-[0_0_10px_#06b6d4]' : 'w-12 bg-[#1e293b]'}`} />
            </div>

            {/* Central Portal Gate */}
            <div className="w-56 h-28 border-4 border-[#b45309] bg-[#292524] mt-1 flex items-center justify-center relative overflow-hidden">
              {portalOpen ? (
                <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-500 z-10">
                  <FragmentPixelBadge fragmentId="fragment_eternal_eye" collected={true} size="md" />
                  <span className="font-pixel text-[11px] text-[#fde047] mt-1">ETERNAL EYE</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-20 bg-[#44403c] border-r-2 border-[#fde047] transition-transform duration-700 ${doorPhase >= 3 ? '-translate-x-12' : ''}`} />
                  <span className="text-3xl text-[#06b6d4]">𓁹</span>
                  <div className={`w-12 h-20 bg-[#44403c] border-l-2 border-[#fde047] transition-transform duration-700 ${doorPhase >= 3 ? 'translate-x-12' : ''}`} />
                </div>
              )}
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
                    ? 'border-[#06b6d4] bg-[#172533] hover:border-[#67e8f9] cursor-pointer text-[#ffffff] animate-pixel-glow'
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
          {portalOpen ? (
            <button
              onClick={() => goToScreen('ASSEMBLY')}
              className="pixel-btn pixel-btn-primary min-h-[44px] px-6 text-[15px] flex items-center gap-2"
            >
              <span>ENTER FINAL CHAMBER</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleActivatePyramid}
              disabled={!all4Socketed || animating}
              className={`min-h-[44px] px-6 text-[15px] pixel-btn flex items-center gap-2 font-pixel ${
                all4Socketed && !animating
                  ? 'pixel-btn-primary animate-pixel-glow cursor-pointer'
                  : 'border-[#3a334a] bg-[#151120] text-[#676b76] cursor-not-allowed opacity-60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{animating ? 'ALIGNING DISC...' : 'AWAKEN PYRAMID'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
