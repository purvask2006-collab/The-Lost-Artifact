import React from 'react';

/**
 * Pixel-art SVG components rendered with crisp edge rules and retro palettes.
 */

export const AncientArtifactLockup: React.FC<{ className?: string }> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg viewBox="0 0 128 128" className={`pixel-art ${className}`} style={{ imageRendering: 'pixelated' }}>
      {/* Altar Pedestal Base */}
      <rect x="24" y="112" width="80" height="12" fill="#18181b" />
      <rect x="28" y="104" width="72" height="8" fill="#27272a" />
      <rect x="34" y="96" width="60" height="8" fill="#3f3f46" />
      <rect x="42" y="88" width="44" height="8" fill="#52525b" />

      {/* Carved Runes on Pedestal */}
      <rect x="36" y="106" width="4" height="4" fill="#ca8a04" />
      <rect x="48" y="106" width="4" height="4" fill="#38bdf8" />
      <rect x="62" y="106" width="4" height="4" fill="#fbbf24" />
      <rect x="76" y="106" width="4" height="4" fill="#ca8a04" />
      <rect x="88" y="106" width="4" height="4" fill="#38bdf8" />

      {/* Floating Ancient Keystone Rings */}
      <circle cx="64" cy="56" r="32" fill="none" stroke="#713f12" strokeWidth="4" strokeDasharray="6 4" opacity="0.6" />
      <circle cx="64" cy="56" r="24" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="8 6" />
      <circle cx="64" cy="56" r="16" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />

      {/* Three Shimmering Fragment Slots */}
      {/* Top: Solar Wheel (India) */}
      <path d="M 64 36 L 70 46 L 58 46 Z" fill="#f59e0b" />
      <rect x="62" y="38" width="4" height="4" fill="#fef08a" />

      {/* Bottom Right: Celestial Mirror (Japan) */}
      <path d="M 78 64 L 72 74 L 64 68 Z" fill="#0284c7" />
      <circle cx="72" cy="69" r="3" fill="#bae6fd" />

      {/* Bottom Left: Eternal Eye (Egypt) */}
      <path d="M 50 64 L 56 74 L 64 68 Z" fill="#eab308" />
      <circle cx="56" cy="69" r="3" fill="#fef08a" />

      {/* Core Keystone Crystal Center */}
      <polygon points="64,48 72,56 64,64 56,56" fill="#fef9c3" />
      <polygon points="64,51 69,56 64,61 59,56" fill="#ffffff" />

      {/* Floating Glyphs and Sparkles */}
      <rect x="36" y="40" width="3" height="3" fill="#38bdf8" opacity="0.7" />
      <rect x="90" y="44" width="3" height="3" fill="#f59e0b" opacity="0.8" />
      <rect x="42" y="72" width="3" height="3" fill="#facc15" opacity="0.6" />
      <rect x="84" y="76" width="3" height="3" fill="#38bdf8" opacity="0.7" />

      {/* Left Brazier Torch */}
      <rect x="14" y="80" width="8" height="28" fill="#27272a" />
      <rect x="12" y="76" width="12" height="4" fill="#3f3f46" />
      <polygon points="18,66 22,76 14,76" fill="#ea580c" />
      <polygon points="18,70 20,76 16,76" fill="#fef08a" />

      {/* Right Brazier Torch */}
      <rect x="106" y="80" width="8" height="28" fill="#27272a" />
      <rect x="104" y="76" width="12" height="4" fill="#3f3f46" />
      <polygon points="110,66 114,76 106,76" fill="#ea580c" />
      <polygon points="110,70 112,76 108,76" fill="#fef08a" />
    </svg>
  );
};

export const IndiaPixelIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 32 32" className={`pixel-art ${className}`}>
    {/* Stepped Altar / Temple */}
    <rect x="4" y="24" width="24" height="6" fill="#78350f" />
    <rect x="8" y="18" width="16" height="6" fill="#92400e" />
    <rect x="12" y="12" width="8" height="6" fill="#b45309" />
    <polygon points="16,4 20,12 12,12" fill="#d97706" />
    {/* Sun Spire */}
    <rect x="15" y="2" width="2" height="4" fill="#fde047" />
    <circle cx="16" cy="15" r="2" fill="#fbbf24" />
  </svg>
);

export const JapanPixelIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 32 32" className={`pixel-art ${className}`}>
    {/* Torii Gate */}
    <rect x="4" y="6" width="24" height="4" fill="#dc2626" />
    <rect x="6" y="10" width="20" height="2" fill="#991b1b" />
    <rect x="8" y="12" width="4" height="18" fill="#dc2626" />
    <rect x="20" y="12" width="4" height="18" fill="#dc2626" />
    <rect x="6" y="28" width="8" height="2" fill="#374151" />
    <rect x="18" y="28" width="8" height="2" fill="#374151" />
    {/* Hanging sacred shimenawa straw rope */}
    <rect x="12" y="12" width="8" height="2" fill="#fef08a" />
  </svg>
);

export const EgyptPixelIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 32 32" className={`pixel-art ${className}`}>
    {/* Great Pyramid of Giza */}
    <polygon points="16,6 30,28 2,28" fill="#d97706" />
    <polygon points="16,6 30,28 16,28" fill="#b45309" />
    {/* Golden Capstone */}
    <polygon points="16,6 20,12 12,12" fill="#fef08a" />
    {/* Entrance Portal */}
    <rect x="14" y="24" width="4" height="4" fill="#18181b" />
  </svg>
);

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
            ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
            : 'border-zinc-800 bg-zinc-900/60 text-zinc-700 opacity-60'
        }`}
        title="Fragment of the Solar Wheel (India)"
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
            ? 'border-sky-400 bg-sky-950/80 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.6)]' 
            : 'border-zinc-800 bg-zinc-900/60 text-zinc-700 opacity-60'
        }`}
        title="Fragment of the Celestial Mirror (Japan)"
      >
        <span className="font-pixel">⛩</span>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses} border-2 flex items-center justify-center transition-all ${
        collected 
          ? 'border-yellow-400 bg-yellow-950/80 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.6)]' 
          : 'border-zinc-800 bg-zinc-900/60 text-zinc-700 opacity-60'
      }`}
      title="Fragment of the Eternal Eye (Egypt)"
    >
      <span className="font-pixel">𓁹</span>
    </div>
  );
};
