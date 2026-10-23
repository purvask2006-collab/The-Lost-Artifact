import React from 'react';
import { GemstoneId } from '../types/game';

/**
 * Pixel-art SVG components rendered with crisp edge rules and authentic retro palettes.
 */

export const AncientArtifactLockup: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg viewBox="0 0 128 128" className={`pixel-art ${className}`} style={{ imageRendering: 'pixelated' }}>
      {/* Altar Pedestal Base */}
      <rect x="20" y="114" width="88" height="10" fill="#18181b" />
      <rect x="24" y="106" width="80" height="8" fill="#27272a" />
      <rect x="30" y="98" width="68" height="8" fill="#3f3f46" />
      <rect x="38" y="90" width="52" height="8" fill="#52525b" />

      {/* Carved Runes on Pedestal */}
      <rect x="34" y="108" width="4" height="4" fill="#ca8a04" />
      <rect x="46" y="108" width="4" height="4" fill="#38bdf8" />
      <rect x="62" y="108" width="4" height="4" fill="#fbbf24" />
      <rect x="78" y="108" width="4" height="4" fill="#ca8a04" />
      <rect x="90" y="108" width="4" height="4" fill="#38bdf8" />

      {/* Floating Ancient Keystone Rings */}
      <circle cx="64" cy="54" r="34" fill="none" stroke="#713f12" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
      <circle cx="64" cy="54" r="26" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="8 6" />
      <circle cx="64" cy="54" r="18" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />

      {/* 3 Shimmering Keystone Fragments */}
      {/* Top: Solar Wheel (India - Mandala motif) */}
      <path d="M 64 28 L 74 42 L 54 42 Z" fill="#f59e0b" />
      <circle cx="64" cy="38" r="4" fill="#fef08a" />
      <rect x="62" y="34" width="4" height="8" fill="#d97706" />

      {/* Bottom Right: Celestial Mirror (Japan - Torii curve motif) */}
      <path d="M 80 62 L 72 76 L 62 68 Z" fill="#0284c7" />
      <circle cx="71" cy="69" r="4.5" fill="#bae6fd" />
      <rect x="68" y="66" width="6" height="6" fill="#38bdf8" />

      {/* Bottom Left: Eternal Eye (Egypt - Wedjat motif) */}
      <path d="M 48 62 L 56 76 L 66 68 Z" fill="#eab308" />
      <circle cx="57" cy="69" r="4.5" fill="#fde047" />
      <rect x="55" y="66" width="4" height="4" fill="#1e1b4b" />

      {/* Core Keystone Crystal Center */}
      <polygon points="64,44 74,54 64,64 54,54" fill="#fef9c3" />
      <polygon points="64,47 71,54 64,61 57,54" fill="#ffffff" />

      {/* Left Guardian Relic: Amara's Copper Bowl & Sandalwood Cord */}
      <rect x="12" y="92" width="16" height="6" fill="#b45309" rx="2" />
      <path d="M 8 90 Q 14 84 20 90" fill="none" stroke="#d97706" strokeWidth="2" />

      {/* Center Guardian Relic: Yuki's Silver Bell & Gohei */}
      <polygon points="64,84 68,90 60,90" fill="#e2e8f0" />
      <circle cx="64" cy="83" r="1.5" fill="#f87171" />

      {/* Right Guardian Relic: Kiya's Wax Tablet & Sighting Tool */}
      <rect x="100" y="88" width="14" height="10" fill="#78350f" rx="1" />
      <rect x="102" y="90" width="10" height="6" fill="#fef08a" />
      <line x1="98" y1="86" x2="114" y2="98" stroke="#06b6d4" strokeWidth="1.5" />
    </svg>
  );
};

export const GuardianEnvironmentalDisplay: React.FC<{
  civId: 'india' | 'japan' | 'egypt';
  compact?: boolean;
}> = ({ civId, compact = false }) => {
  if (civId === 'india') {
    return (
      <div className={`flex items-center gap-3 p-2.5 bg-amber-950/40 border-2 border-amber-700/70 text-amber-200 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0" style={{ imageRendering: 'pixelated' }}>
          {/* Stone Plinth */}
          <rect x="4" y="24" width="24" height="6" fill="#44403c" />
          {/* Copper Offering Bowl */}
          <path d="M 8 18 Q 16 26 24 18 Z" fill="#b45309" stroke="#d97706" strokeWidth="1" />
          <ellipse cx="16" cy="18" rx="8" ry="2" fill="#f59e0b" />
          {/* Sandalwood Measuring Cord draped over rail */}
          <path d="M 4 12 Q 10 20 18 14 Q 24 10 28 16" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
        <div className="flex-1">
          <div className="font-pixel text-[9px] text-amber-400">AMARA'S MEASURING CORD & OFFERING BOWL</div>
          <p className="font-silkscreen text-zinc-300 italic leading-tight mt-0.5">
            "Every mess is a pattern waiting to be understood, and every structure is a frozen mantra."
          </p>
        </div>
      </div>
    );
  }

  if (civId === 'japan') {
    return (
      <div className={`flex items-center gap-3 p-2.5 bg-sky-950/40 border-2 border-sky-700/70 text-sky-200 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0" style={{ imageRendering: 'pixelated' }}>
          {/* Cedar Stand */}
          <rect x="4" y="24" width="24" height="6" fill="#292524" />
          {/* Silver Bell */}
          <path d="M 12 14 Q 16 10 20 14 L 22 20 L 10 20 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="16" cy="10" r="1.5" fill="#f87171" />
          {/* Red silk cord */}
          <line x1="16" y1="10" x2="16" y2="24" stroke="#dc2626" strokeWidth="1.5" />
          {/* Gohei paper wand */}
          <line x1="6" y1="24" x2="14" y2="8" stroke="#78350f" strokeWidth="1" />
          <polygon points="12,10 16,8 14,14" fill="#f8fafc" />
          <polygon points="10,14 14,12 12,18" fill="#f8fafc" />
        </svg>
        <div className="flex-1">
          <div className="font-pixel text-[9px] text-sky-400">YUKI'S SILVER BELL & GOHEI WAND</div>
          <p className="font-silkscreen text-zinc-300 italic leading-tight mt-0.5">
            "She senses wrongness instantly and restores spaces with quiet apologies and precise kindness."
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-2.5 bg-yellow-950/40 border-2 border-yellow-700/70 text-yellow-200 ${compact ? 'text-[10px]' : 'text-xs'}`}>
      <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0" style={{ imageRendering: 'pixelated' }}>
        {/* Stone Observatory Ledge */}
        <rect x="2" y="24" width="28" height="6" fill="#57534e" />
        {/* Wax Writing Tablet */}
        <rect x="4" y="12" width="14" height="12" fill="#78350f" rx="1" />
        <rect x="6" y="14" width="10" height="8" fill="#fef08a" />
        {/* Bronze Merkhet Sighting Tool */}
        <line x1="18" y1="22" x2="28" y2="8" stroke="#ca8a04" strokeWidth="2" />
        <circle cx="28" cy="8" r="2.5" fill="#06b6d4" />
        {/* Plumb line */}
        <line x1="28" y1="8" x2="28" y2="24" stroke="#eab308" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
      <div className="flex-1">
        <div className="font-pixel text-[9px] text-yellow-400">KIYA'S WAX TABLET & BRONZE SIGHTING TOOL</div>
        <p className="font-silkscreen text-zinc-300 italic leading-tight mt-0.5">
          "She treats every misaligned star and shadow as a personal insult against the order of the sky."
        </p>
      </div>
    </div>
  );
};

export const PixelGemstoneBadge: React.FC<{
  gemstoneId: GemstoneId;
  collected: boolean;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}> = ({ gemstoneId, collected, size = 'md', showName = false }) => {
  const GEM_PROPS: Record<GemstoneId, { name: string; hex: string; stroke: string; icon: string }> = {
    ruby: { name: 'Ruby', hex: '#ef4444', stroke: '#fca5a5', icon: '♦' },
    emerald: { name: 'Emerald', hex: '#10b981', stroke: '#6ee7b7', icon: '🪷' },
    sapphire: { name: 'Sapphire', hex: '#3b82f6', stroke: '#93c5fd', icon: '▲' },
    citrine: { name: 'Citrine', hex: '#f59e0b', stroke: '#fde047', icon: '●' },
    rose_quartz: { name: 'Rose Quartz', hex: '#f472b6', stroke: '#fbcfe8', icon: '🌸' },
    moonstone: { name: 'Moonstone', hex: '#f8fafc', stroke: '#e0e7ff', icon: '○' },
    amethyst: { name: 'Amethyst', hex: '#a855f7', stroke: '#d8b4fe', icon: '✦' },
    obsidian: { name: 'Obsidian', hex: '#18181b', stroke: '#71717a', icon: '◼' },
    lapis_lazuli: { name: 'Lapis Lazuli', hex: '#1d4ed8', stroke: '#60a5fa', icon: '★' },
    turquoise: { name: 'Turquoise', hex: '#06b6d4', stroke: '#67e8f9', icon: '◆' },
    carnelian: { name: 'Carnelian', hex: '#ea580c', stroke: '#fdba74', icon: '☀' },
    malachite: { name: 'Malachite', hex: '#059669', stroke: '#34d399', icon: '◎' },
  };

  const gem = GEM_PROPS[gemstoneId] || { name: gemstoneId, hex: '#eab308', stroke: '#fde047', icon: '💎' };

  const sizeBox = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  }[size];

  return (
    <div className="flex flex-col items-center select-none" title={`${gem.name} Gemstone Key`}>
      <div
        className={`${sizeBox} border-2 flex items-center justify-center transition-all ${
          collected
            ? 'shadow-[0_0_10px_rgba(255,255,255,0.25)]'
            : 'border-zinc-800 bg-zinc-950 text-zinc-700 opacity-40'
        }`}
        style={{
          backgroundColor: collected ? `${gem.hex}22` : undefined,
          borderColor: collected ? gem.stroke : undefined,
          color: collected ? gem.stroke : undefined,
        }}
      >
        <span className="font-pixel">{gem.icon}</span>
      </div>
      {showName && (
        <span className={`font-pixel text-[8px] mt-1 ${collected ? 'text-zinc-200' : 'text-zinc-600'}`}>
          {gem.name.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export const FragmentPixelBadge: React.FC<{ 
  fragmentId: 'fragment_solar_wheel' | 'fragment_celestial_mirror' | 'fragment_eternal_eye';
  collected: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ fragmentId, collected, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }[size];

  if (fragmentId === 'fragment_solar_wheel') {
    return (
      <div 
        className={`${sizeClasses} border-2 flex items-center justify-center transition-all ${
          collected 
            ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.6)]' 
            : 'border-zinc-800 bg-zinc-900/60 text-zinc-700 opacity-60'
        }`}
        title="Fragment 1: Solar Wheel (India)"
      >
        <span className="font-pixel">☸</span>
      </div>
    );
  }

  if (fragmentId === 'fragment_celestial_mirror') {
    return (
      <div 
        className={`${sizeClasses} border-2 flex items-center justify-center transition-all ${
          collected 
            ? 'border-sky-400 bg-sky-950/80 text-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.6)]' 
            : 'border-zinc-800 bg-zinc-900/60 text-zinc-700 opacity-60'
        }`}
        title="Fragment 2: Celestial Mirror (Japan)"
      >
        <span className="font-pixel">⛩</span>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses} border-2 flex items-center justify-center transition-all ${
        collected 
          ? 'border-yellow-400 bg-yellow-950/80 text-yellow-300 shadow-[0_0_14px_rgba(234,179,8,0.6)]' 
          : 'border-zinc-800 bg-zinc-900/60 text-zinc-700 opacity-60'
      }`}
      title="Fragment 3: Eternal Eye (Egypt)"
    >
      <span className="font-pixel">𓁹</span>
    </div>
  );
};
