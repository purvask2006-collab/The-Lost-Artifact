import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS } from '../data/gameData';
import { CivilizationId, PuzzleId, MechanismId } from '../types/game';
import { LocationTarget } from './LocationModal';
import { soundManager } from '../utils/audio';

interface PixelOverworldMapProps {
  onSelectLocation: (target: LocationTarget) => void;
  activeLocationId: string | null;
}

export const PixelOverworldMap: React.FC<PixelOverworldMapProps> = ({
  onSelectLocation,
  activeLocationId,
}) => {
  const { state } = useGame();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Progression checks
  const isIndiaMechanismUnlocked = state.unlockedMechanisms.india_mechanism;
  const isJapanMechanismUnlocked = state.unlockedMechanisms.japan_mechanism;

  const isJapanUnlocked = isIndiaMechanismUnlocked;
  const isEgyptUnlocked = isJapanMechanismUnlocked;

  // Determine status for India locations
  const getIndiaPuzzle1Status = (): 'available' | 'completed' | 'locked' => 
    state.solvedPuzzles.india_puzzle_1 ? 'completed' : 'available';

  const getIndiaPuzzle2Status = (): 'available' | 'completed' | 'locked' => 
    state.solvedPuzzles.india_puzzle_2 ? 'completed' : 'available';

  const getIndiaMechanismStatus = (): 'available' | 'completed' | 'locked' => {
    if (state.unlockedMechanisms.india_mechanism) return 'completed';
    if (state.solvedPuzzles.india_puzzle_1 && state.solvedPuzzles.india_puzzle_2) return 'available';
    return 'locked';
  };

  // Determine status for Japan locations
  const getJapanPuzzle1Status = (): 'available' | 'completed' | 'locked' => {
    if (!isJapanUnlocked) return 'locked';
    return state.solvedPuzzles.japan_puzzle_1 ? 'completed' : 'available';
  };

  const getJapanPuzzle2Status = (): 'available' | 'completed' | 'locked' => {
    if (!isJapanUnlocked) return 'locked';
    return state.solvedPuzzles.japan_puzzle_2 ? 'completed' : 'available';
  };

  const getJapanMechanismStatus = (): 'available' | 'completed' | 'locked' => {
    if (!isJapanUnlocked) return 'locked';
    if (state.unlockedMechanisms.japan_mechanism) return 'completed';
    if (state.solvedPuzzles.japan_puzzle_1 && state.solvedPuzzles.japan_puzzle_2) return 'available';
    return 'locked';
  };

  // Determine status for Egypt locations
  const getEgyptPuzzle1Status = (): 'available' | 'completed' | 'locked' => {
    if (!isEgyptUnlocked) return 'locked';
    return state.solvedPuzzles.egypt_puzzle_1 ? 'completed' : 'available';
  };

  const getEgyptPuzzle2Status = (): 'available' | 'completed' | 'locked' => {
    if (!isEgyptUnlocked) return 'locked';
    return state.solvedPuzzles.egypt_puzzle_2 ? 'completed' : 'available';
  };

  const getEgyptMechanismStatus = (): 'available' | 'completed' | 'locked' => {
    if (!isEgyptUnlocked) return 'locked';
    if (state.unlockedMechanisms.egypt_mechanism) return 'completed';
    if (state.solvedPuzzles.egypt_puzzle_1 && state.solvedPuzzles.egypt_puzzle_2) return 'available';
    return 'locked';
  };

  // Node Click Handlers
  const handleNodeClick = (node: LocationTarget) => {
    soundManager.playClick(state.soundEnabled);
    onSelectLocation(node);
  };

  // Location nodes dictionary for coordinate anchoring
  const locationCoords: Record<string, { x: number; y: number }> = {
    // Egypt (West)
    egypt_puzzle_1: { x: 140, y: 470 },
    egypt_puzzle_2: { x: 280, y: 530 },
    egypt_mechanism: { x: 210, y: 320 },
    // India (Center)
    india_puzzle_1: { x: 500, y: 470 },
    india_puzzle_2: { x: 690, y: 470 },
    india_mechanism: { x: 595, y: 280 },
    // Japan (East)
    japan_puzzle_1: { x: 910, y: 390 },
    japan_puzzle_2: { x: 1060, y: 350 },
    japan_mechanism: { x: 990, y: 190 },
  };

  // Determine active player marker position
  const activeLocId = activeLocationId || 'india_puzzle_1';
  const playerPos = locationCoords[activeLocId] || { x: 500, y: 470 };

  return (
    <div className="relative w-full aspect-[16/9] max-h-[72vh] min-h-[420px] bg-[#0c0d12] border-4 border-amber-800/90 shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden select-none">
      {/* SVG Overworld World Map Canvas */}
      <svg
        viewBox="0 0 1200 680"
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle animated water ripple */}
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081426" />
            <stop offset="50%" stopColor="#0b1a30" />
            <stop offset="100%" stopColor="#050e1c" />
          </linearGradient>

          {/* India Ochre Gradient */}
          <radialGradient id="indiaGround" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c1917" />
          </radialGradient>

          {/* Japan Moss Gradient */}
          <radialGradient id="japanGround" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="70%" stopColor="#022c22" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Egypt Sand Gradient */}
          <radialGradient id="egyptGround" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="70%" stopColor="#713f12" />
            <stop offset="100%" stopColor="#1c1917" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="pixelGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Ocean / Cosmic Abyss Background */}
        <rect width="1200" height="680" fill="url(#oceanGrad)" />

        {/* Ocean Grid Lines (Ancient Nautical Cartography) */}
        <g stroke="#1e293b" strokeWidth="1" strokeDasharray="4 8" opacity="0.4">
          <line x1="0" y1="170" x2="1200" y2="170" />
          <line x1="0" y1="340" x2="1200" y2="340" />
          <line x1="0" y1="510" x2="1200" y2="510" />
          <line x1="300" y1="0" x2="300" y2="680" />
          <line x1="600" y1="0" x2="600" y2="680" />
          <line x1="900" y1="0" x2="900" y2="680" />
        </g>

        {/* ======================================================== */}
        {/* REGION 1: EGYPT — THE PYRAMID OF SECRETS (West: X: 40-380) */}
        {/* ======================================================== */}
        <g id="region-egypt">
          {/* Desert Landmass */}
          <path
            d="M 60 220 Q 200 180 340 240 Q 380 380 360 520 Q 320 640 180 650 Q 50 630 40 450 Z"
            fill="url(#egyptGround)"
            stroke="#b45309"
            strokeWidth="3"
          />

          {/* Sand Dunes Layers (Pixel Art Sand Ribbons) */}
          <path d="M 70 340 Q 150 310 240 350 Q 320 380 350 340" fill="none" stroke="#d97706" strokeWidth="3" />
          <path d="M 80 430 Q 180 400 280 450 Q 330 460 350 440" fill="none" stroke="#ca8a04" strokeWidth="2" />
          <path d="M 60 540 Q 170 510 270 560 Q 310 580 330 550" fill="none" stroke="#d97706" strokeWidth="3" />

          {/* The Nile Turquoise Ribbon */}
          <path
            d="M 290 220 Q 310 320 280 420 Q 250 510 290 620"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 290 220 Q 310 320 280 420 Q 250 510 290 620"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="2"
            strokeDasharray="6 8"
          />

          {/* Desert Palm Trees */}
          {[
            { x: 300, y: 390 },
            { x: 260, y: 440 },
            { x: 310, y: 480 },
            { x: 110, y: 360 },
          ].map((pt, i) => (
            <g key={`palm-${i}`}>
              <rect x={pt.x + 4} y={pt.y + 10} width="3" height="12" fill="#78350f" />
              <polygon points={`${pt.x + 5},${pt.y + 4} ${pt.x + 12},${pt.y + 12} ${pt.x + 8},${pt.y + 12}`} fill="#15803d" />
              <polygon points={`${pt.x + 5},${pt.y + 4} ${pt.x - 2},${pt.y + 12} ${pt.x + 2},${pt.y + 12}`} fill="#15803d" />
              <polygon points={`${pt.x + 5},${pt.y} ${pt.x + 5},${pt.y + 6} ${pt.x + 2},${pt.y + 5}`} fill="#16a34a" />
            </g>
          ))}

          {/* Sandstone Obelisk Near Nile */}
          <polygon points="310,290 314,290 315,340 309,340" fill="#facc15" />
          <polygon points="312,284 314,290 310,290" fill="#fef08a" />
          <rect x="307" y="340" width="10" height="4" fill="#a16207" />

          {/* Region Title Label */}
          <text x="210" y="240" fill="#facc15" fontFamily="'Press Start 2P', monospace" fontSize="11" textAnchor="middle">
            EGYPT
          </text>
          <text x="210" y="258" fill="#fef08a" fontFamily="'Silkscreen', monospace" fontSize="9" textAnchor="middle" opacity="0.8">
            The Pyramid of Secrets
          </text>
        </g>

        {/* ======================================================== */}
        {/* REGION 2: INDIA — THE CHAKRA OF BALANCE (Center: X: 420-780) */}
        {/* ======================================================== */}
        <g id="region-india">
          {/* Ochre Terracotta Landmass */}
          <path
            d="M 440 210 Q 600 170 760 210 Q 790 360 770 520 Q 720 630 600 640 Q 450 630 430 470 Z"
            fill="url(#indiaGround)"
            stroke="#d97706"
            strokeWidth="3"
          />

          {/* Carved Mandala Paving Floor Rings */}
          <circle cx="595" cy="400" r="130" fill="none" stroke="#92400e" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
          <circle cx="595" cy="400" r="85" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />

          {/* Stepped Water Tank (Baoli Stepwell) */}
          <rect x="555" y="380" width="80" height="40" fill="#0369a1" stroke="#92400e" strokeWidth="4" />
          <rect x="563" y="386" width="64" height="28" fill="#0284c7" />
          <rect x="571" y="392" width="48" height="16" fill="#38bdf8" />
          {/* Animated Water Sparkles */}
          <rect x="585" y="396" width="4" height="2" fill="#ffffff" opacity="0.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="600" y="402" width="4" height="2" fill="#ffffff" opacity="0.6">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.8s" repeatCount="indefinite" />
          </rect>

          {/* Terracotta Shikhara Temple Spires */}
          <g transform="translate(470, 240)">
            <rect x="0" y="20" width="28" height="24" fill="#92400e" />
            <polygon points="14,0 28,20 0,20" fill="#b45309" />
            <polygon points="14,4 24,20 4,20" fill="#d97706" />
            <rect x="13" y="-4" width="2" height="6" fill="#facc15" />
            <rect x="8" y="32" width="12" height="12" fill="#1c1917" />
          </g>

          <g transform="translate(700, 240)">
            <rect x="0" y="20" width="28" height="24" fill="#92400e" />
            <polygon points="14,0 28,20 0,20" fill="#b45309" />
            <polygon points="14,4 24,20 4,20" fill="#d97706" />
            <rect x="13" y="-4" width="2" height="6" fill="#facc15" />
            <rect x="8" y="32" width="12" height="12" fill="#1c1917" />
          </g>

          {/* Sacred Banyan Tree */}
          <g transform="translate(450, 360)">
            <rect x="12" y="14" width="6" height="20" fill="#78350f" />
            <circle cx="15" cy="12" r="14" fill="#15803d" />
            <circle cx="22" cy="8" r="10" fill="#16a34a" />
            <circle cx="8" cy="8" r="10" fill="#15803d" />
          </g>

          {/* Region Title Label */}
          <text x="595" y="200" fill="#fbbf24" fontFamily="'Press Start 2P', monospace" fontSize="11" textAnchor="middle">
            INDIA
          </text>
          <text x="595" y="218" fill="#fde68a" fontFamily="'Silkscreen', monospace" fontSize="9" textAnchor="middle" opacity="0.8">
            The Chakra of Balance
          </text>
        </g>

        {/* ======================================================== */}
        {/* REGION 3: JAPAN — THE SHRINE OF MEMORIES (East: X: 820-1160) */}
        {/* ======================================================== */}
        <g id="region-japan">
          {/* Moss Green Archipelago Islands */}
          <path
            d="M 830 200 Q 980 100 1120 180 Q 1160 320 1130 460 Q 1060 560 920 540 Q 820 470 820 320 Z"
            fill="url(#japanGround)"
            stroke="#059669"
            strokeWidth="3"
          />

          {/* Koi Pond with Stone Garden Trim */}
          <path
            d="M 960 300 Q 1020 280 1060 310 Q 1070 360 1010 370 Q 950 360 960 300 Z"
            fill="#0f766e"
            stroke="#475569"
            strokeWidth="3"
          />
          {/* Wooden Arched Bridge across Pond */}
          <path d="M 970 330 Q 1010 315 1050 330" fill="none" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
          <path d="M 972 328 Q 1010 314 1048 328" fill="none" stroke="#dc2626" strokeWidth="2" />

          {/* Cherry Blossom Trees (Muted Pink with Falling Petals) */}
          {[
            { x: 860, y: 260 },
            { x: 1080, y: 220 },
            { x: 860, y: 450 },
            { x: 1110, y: 410 },
          ].map((tree, i) => (
            <g key={`sakura-${i}`}>
              <rect x={tree.x + 8} y={tree.y + 14} width="4" height="16" fill="#78350f" />
              <circle cx={tree.x + 10} cy={tree.y + 10} r="14" fill="#f472b6" opacity="0.9" />
              <circle cx={tree.x + 16} cy={tree.y + 4} r="11" fill="#fbcfe8" opacity="0.95" />
              <circle cx={tree.x + 4} cy={tree.y + 6} r="10" fill="#f472b6" opacity="0.9" />
              {/* Drifting Petal */}
              <circle cx={tree.x + 20} cy={tree.y + 20} r="2" fill="#fbcfe8">
                <animate attributeName="cy" values={`${tree.y + 20};${tree.y + 36}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="cx" values={`${tree.x + 20};${tree.x + 26}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Stone Lanterns (Toro) with glowing candles */}
          {[
            { x: 920, y: 280 },
            { x: 1040, y: 260 },
          ].map((lantern, idx) => (
            <g key={`lantern-${idx}`}>
              <rect x={lantern.x + 2} y={lantern.y + 6} width="6" height="8" fill="#64748b" />
              <rect x={lantern.x} y={lantern.y + 4} width="10" height="3" fill="#94a3b8" />
              <rect x={lantern.x + 3} y={lantern.y + 7} width="4" height="4" fill="#fef08a">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
              </rect>
            </g>
          ))}

          {/* Region Title Label */}
          <text x="990" y="110" fill="#38bdf8" fontFamily="'Press Start 2P', monospace" fontSize="11" textAnchor="middle">
            JAPAN
          </text>
          <text x="990" y="128" fill="#bae6fd" fontFamily="'Silkscreen', monospace" fontSize="9" textAnchor="middle" opacity="0.8">
            The Shrine of Memories
          </text>
        </g>

        {/* ======================================================== */}
        {/* THE WINDING ANCIENT TRADE ROUTE (Cobblestones & Caravan) */}
        {/* ======================================================== */}
        <g id="trade-routes">
          {/* Western Route: Egypt to India */}
          <path
            d="M 220 340 Q 320 370 380 430 Q 420 480 490 470"
            fill="none"
            stroke="#52525b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="10 6"
          />
          <path
            d="M 220 340 Q 320 370 380 430 Q 420 480 490 470"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="6 8"
            opacity={isEgyptUnlocked ? 0.9 : 0.3}
          />

          {/* Internal India Route: Courtyard to Mechanism & Hearths */}
          <path
            d="M 500 460 Q 550 430 595 320"
            fill="none"
            stroke="#78350f"
            strokeWidth="6"
            strokeDasharray="8 6"
          />
          <path
            d="M 690 460 Q 640 430 595 320"
            fill="none"
            stroke="#78350f"
            strokeWidth="6"
            strokeDasharray="8 6"
          />

          {/* Eastern Route: India to Japan across archipelago bridge */}
          <path
            d="M 610 280 Q 720 250 780 320 Q 820 360 890 380"
            fill="none"
            stroke="#52525b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="10 6"
          />
          <path
            d="M 610 280 Q 720 250 780 320 Q 820 360 890 380"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="6 8"
            opacity={isJapanUnlocked ? 0.9 : 0.3}
          />

          {/* Internal Japan Route */}
          <path
            d="M 910 380 Q 940 320 985 230"
            fill="none"
            stroke="#065f46"
            strokeWidth="6"
            strokeDasharray="8 6"
          />
          <path
            d="M 1060 340 Q 1020 300 985 230"
            fill="none"
            stroke="#065f46"
            strokeWidth="6"
            strokeDasharray="8 6"
          />
        </g>

        {/* ======================================================== */}
        {/* VISUAL LOCKS ON LOCKED REGIONS */}
        {/* ======================================================== */}
        {/* Japan Spiritual Fog Lock */}
        {!isJapanUnlocked && (
          <g id="japan-lock-barrier" opacity="0.9">
            <rect x="800" y="80" width="370" height="500" fill="#030712" opacity="0.65" />
            <g transform="translate(820, 310)">
              <circle cx="16" cy="16" r="22" fill="#18181b" stroke="#dc2626" strokeWidth="3" />
              <rect x="10" y="14" width="12" height="10" fill="#dc2626" />
              <path d="M 12 14 Q 16 8 20 14" fill="none" stroke="#dc2626" strokeWidth="2.5" />
              <text x="16" y="50" fill="#f87171" fontFamily="'Press Start 2P', monospace" fontSize="8" textAnchor="middle">
                SEALED PASSAGE
              </text>
            </g>
          </g>
        )}

        {/* Egypt Sandstorm Lock */}
        {!isEgyptUnlocked && (
          <g id="egypt-lock-barrier" opacity="0.9">
            <rect x="30" y="160" width="370" height="510" fill="#030712" opacity="0.65" />
            <g transform="translate(350, 400)">
              <circle cx="16" cy="16" r="22" fill="#18181b" stroke="#dc2626" strokeWidth="3" />
              <rect x="10" y="14" width="12" height="10" fill="#dc2626" />
              <path d="M 12 14 Q 16 8 20 14" fill="none" stroke="#dc2626" strokeWidth="2.5" />
              <text x="16" y="50" fill="#f87171" fontFamily="'Press Start 2P', monospace" fontSize="8" textAnchor="middle">
                SEALED CARAVAN
              </text>
            </g>
          </g>
        )}

        {/* ======================================================== */}
        {/* INTERACTIVE CLICKABLE LOCATIONS (9 Landmarks) */}
        {/* ======================================================== */}

        {/* --- INDIA 1: The Cracked Courtyard --- */}
        <g
          id="node-india-puzzle-1"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'puzzle',
              civId: 'india',
              id: 'india_puzzle_1',
              name: 'The Cracked Courtyard',
              description: CIVILIZATIONS.india.puzzles[0].description,
              riddle: CIVILIZATIONS.india.puzzles[0].riddle,
              status: getIndiaPuzzle1Status(),
              rewardName: CIVILIZATIONS.india.puzzles[0].reward.name,
              rewardIcon: CIVILIZATIONS.india.puzzles[0].reward.icon,
              rewardDesc: CIVILIZATIONS.india.puzzles[0].reward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('india_puzzle_1')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Fractured Mandala Paving Stone */}
          <g transform="translate(480, 440)">
            <rect x="0" y="0" width="40" height="30" fill="#78350f" stroke="#b45309" strokeWidth="2" />
            <line x1="8" y1="0" x2="32" y2="30" stroke="#f59e0b" strokeWidth="2" />
            <line x1="0" y1="16" x2="40" y2="14" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="20" cy="15" r="5" fill="#facc15" />
          </g>
          {/* Status Pin */}
          <LocationPin
            x={500}
            y={430}
            status={getIndiaPuzzle1Status()}
            isHovered={hoveredNodeId === 'india_puzzle_1'}
            label="Cracked Courtyard"
          />
        </g>

        {/* --- INDIA 2: The Five Hearths --- */}
        <g
          id="node-india-puzzle-2"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'puzzle',
              civId: 'india',
              id: 'india_puzzle_2',
              name: 'The Five Hearths',
              description: CIVILIZATIONS.india.puzzles[1].description,
              riddle: CIVILIZATIONS.india.puzzles[1].riddle,
              status: getIndiaPuzzle2Status(),
              rewardName: CIVILIZATIONS.india.puzzles[1].reward.name,
              rewardIcon: CIVILIZATIONS.india.puzzles[1].reward.icon,
              rewardDesc: CIVILIZATIONS.india.puzzles[1].reward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('india_puzzle_2')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Stepped Sacrificial Fire Braziers */}
          <g transform="translate(670, 440)">
            <rect x="0" y="10" width="40" height="20" fill="#78350f" stroke="#b45309" strokeWidth="2" />
            {/* 3 Visible flame braziers */}
            <rect x="4" y="6" width="8" height="6" fill="#ea580c" />
            <polygon points="8,0 12,6 4,6" fill="#fef08a" />
            <rect x="16" y="6" width="8" height="6" fill="#ea580c" />
            <polygon points="20,0 24,6 16,6" fill="#fef08a" />
            <rect x="28" y="6" width="8" height="6" fill="#ea580c" />
            <polygon points="32,0 36,6 28,6" fill="#fef08a" />
          </g>
          {/* Status Pin */}
          <LocationPin
            x={690}
            y={430}
            status={getIndiaPuzzle2Status()}
            isHovered={hoveredNodeId === 'india_puzzle_2'}
            label="The Five Hearths"
          />
        </g>

        {/* --- INDIA MECHANISM: The Chakra of Balance --- */}
        <g
          id="node-india-mechanism"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'mechanism',
              civId: 'india',
              id: 'india_mechanism',
              name: 'The Chakra of Balance',
              description: CIVILIZATIONS.india.mechanism.description,
              status: getIndiaMechanismStatus(),
              lockReason: 'Complete both "The Cracked Courtyard" and "The Five Hearths" to align the Chakra mechanism.',
              rewardName: CIVILIZATIONS.india.mechanism.fragmentReward.name,
              rewardDesc: CIVILIZATIONS.india.mechanism.fragmentReward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('india_mechanism')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Grand Golden Chakra Astrolabe */}
          <g transform="translate(565, 250)">
            <rect x="0" y="44" width="60" height="16" fill="#292524" stroke="#78350f" strokeWidth="2" />
            <circle cx="30" cy="24" r="22" fill="#92400e" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="30" cy="24" r="14" fill="#d97706" />
            {/* Rotating spoke illusion */}
            <line x1="30" y1="4" x2="30" y2="44" stroke="#fef08a" strokeWidth="2.5" />
            <line x1="10" y1="24" x2="50" y2="24" stroke="#fef08a" strokeWidth="2.5" />
            <circle cx="30" cy="24" r="5" fill="#fef08a" />
          </g>
          <MechanismPin
            x={595}
            y={240}
            status={getIndiaMechanismStatus()}
            isHovered={hoveredNodeId === 'india_mechanism'}
            label="The Chakra of Balance"
          />
        </g>

        {/* --- JAPAN 1: The Misplaced Screen --- */}
        <g
          id="node-japan-puzzle-1"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'puzzle',
              civId: 'japan',
              id: 'japan_puzzle_1',
              name: 'The Misplaced Screen',
              description: CIVILIZATIONS.japan.puzzles[0].description,
              riddle: CIVILIZATIONS.japan.puzzles[0].riddle,
              status: getJapanPuzzle1Status(),
              lockReason: 'Activate India\'s "The Chakra of Balance" first to open the sea passage to Japan.',
              rewardName: CIVILIZATIONS.japan.puzzles[0].reward.name,
              rewardIcon: CIVILIZATIONS.japan.puzzles[0].reward.icon,
              rewardDesc: CIVILIZATIONS.japan.puzzles[0].reward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('japan_puzzle_1')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Tatami Shoji Pavilion */}
          <g transform="translate(890, 360)">
            <polygon points="20,0 42,12 -2,12" fill="#78350f" />
            <rect x="2" y="12" width="36" height="20" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <line x1="14" y1="12" x2="14" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="26" y1="12" x2="26" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
          <LocationPin
            x={910}
            y={350}
            status={getJapanPuzzle1Status()}
            isHovered={hoveredNodeId === 'japan_puzzle_1'}
            label="The Misplaced Screen"
          />
        </g>

        {/* --- JAPAN 2: The Bell Sequence --- */}
        <g
          id="node-japan-puzzle-2"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'puzzle',
              civId: 'japan',
              id: 'japan_puzzle_2',
              name: 'The Bell Sequence',
              description: CIVILIZATIONS.japan.puzzles[1].description,
              riddle: CIVILIZATIONS.japan.puzzles[1].riddle,
              status: getJapanPuzzle2Status(),
              lockReason: 'Activate India\'s "The Chakra of Balance" first to open the sea passage to Japan.',
              rewardName: CIVILIZATIONS.japan.puzzles[1].reward.name,
              rewardIcon: CIVILIZATIONS.japan.puzzles[1].reward.icon,
              rewardDesc: CIVILIZATIONS.japan.puzzles[1].reward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('japan_puzzle_2')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Wooden Bell Belfry */}
          <g transform="translate(1040, 320)">
            <polygon points="18,0 38,10 -2,10" fill="#451a03" />
            <rect x="4" y="10" width="4" height="22" fill="#78350f" />
            <rect x="28" y="10" width="4" height="22" fill="#78350f" />
            {/* Hanging Bronze Bell */}
            <path d="M 12 16 Q 18 14 24 16 L 26 25 L 10 25 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="1" />
          </g>
          <LocationPin
            x={1060}
            y={310}
            status={getJapanPuzzle2Status()}
            isHovered={hoveredNodeId === 'japan_puzzle_2'}
            label="The Bell Sequence"
          />
        </g>

        {/* --- JAPAN MECHANISM: The Shrine of Memories --- */}
        <g
          id="node-japan-mechanism"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'mechanism',
              civId: 'japan',
              id: 'japan_mechanism',
              name: 'The Shrine of Memories',
              description: CIVILIZATIONS.japan.mechanism.description,
              status: getJapanMechanismStatus(),
              lockReason: !isJapanUnlocked
                ? 'Activate India\'s "The Chakra of Balance" first to reach Japan.'
                : 'Complete both "The Misplaced Screen" and "The Bell Sequence" to release the Shrine gate.',
              rewardName: CIVILIZATIONS.japan.mechanism.fragmentReward.name,
              rewardDesc: CIVILIZATIONS.japan.mechanism.fragmentReward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('japan_mechanism')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Grand Torii Gate & Pagoda Shrine */}
          <g transform="translate(960, 150)">
            <rect x="0" y="8" width="60" height="6" fill="#dc2626" />
            <rect x="6" y="14" width="48" height="4" fill="#991b1b" />
            <rect x="12" y="18" width="6" height="34" fill="#dc2626" />
            <rect x="42" y="18" width="6" height="34" fill="#dc2626" />
            {/* Sacred Shimenawa Rope */}
            <rect x="18" y="22" width="24" height="3" fill="#fef08a" />
          </g>
          <MechanismPin
            x={990}
            y={140}
            status={getJapanMechanismStatus()}
            isHovered={hoveredNodeId === 'japan_mechanism'}
            label="The Shrine of Memories"
          />
        </g>

        {/* --- EGYPT 1: The Scattered Ceiling --- */}
        <g
          id="node-egypt-puzzle-1"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'puzzle',
              civId: 'egypt',
              id: 'egypt_puzzle_1',
              name: 'The Scattered Ceiling',
              description: CIVILIZATIONS.egypt.puzzles[0].description,
              riddle: CIVILIZATIONS.egypt.puzzles[0].riddle,
              status: getEgyptPuzzle1Status(),
              lockReason: 'Activate Japan\'s "The Shrine of Memories" first to unlock the caravan route to Egypt.',
              rewardName: CIVILIZATIONS.egypt.puzzles[0].reward.name,
              rewardIcon: CIVILIZATIONS.egypt.puzzles[0].reward.icon,
              rewardDesc: CIVILIZATIONS.egypt.puzzles[0].reward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('egypt_puzzle_1')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Star Hypostyle Colonnade Ruin */}
          <g transform="translate(120, 440)">
            <rect x="0" y="0" width="38" height="6" fill="#d97706" />
            <rect x="4" y="6" width="6" height="24" fill="#b45309" />
            <rect x="16" y="6" width="6" height="24" fill="#b45309" />
            <rect x="28" y="6" width="6" height="24" fill="#b45309" />
            {/* Inlaid blue lapis stars */}
            <rect x="8" y="2" width="3" height="2" fill="#0284c7" />
            <rect x="20" y="2" width="3" height="2" fill="#facc15" />
          </g>
          <LocationPin
            x={140}
            y={430}
            status={getEgyptPuzzle1Status()}
            isHovered={hoveredNodeId === 'egypt_puzzle_1'}
            label="The Scattered Ceiling"
          />
        </g>

        {/* --- EGYPT 2: The Cracked Basin --- */}
        <g
          id="node-egypt-puzzle-2"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'puzzle',
              civId: 'egypt',
              id: 'egypt_puzzle_2',
              name: 'The Cracked Basin',
              description: CIVILIZATIONS.egypt.puzzles[1].description,
              riddle: CIVILIZATIONS.egypt.puzzles[1].riddle,
              status: getEgyptPuzzle2Status(),
              lockReason: 'Activate Japan\'s "The Shrine of Memories" first to unlock the caravan route to Egypt.',
              rewardName: CIVILIZATIONS.egypt.puzzles[1].reward.name,
              rewardIcon: CIVILIZATIONS.egypt.puzzles[1].reward.icon,
              rewardDesc: CIVILIZATIONS.egypt.puzzles[1].reward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('egypt_puzzle_2')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Turquoise Alabaster Spring Basin */}
          <g transform="translate(260, 500)">
            <rect x="0" y="10" width="40" height="22" fill="#78350f" stroke="#b45309" strokeWidth="2" />
            <rect x="6" y="14" width="28" height="14" fill="#06b6d4" />
            {/* Crack fracture lines */}
            <line x1="8" y1="14" x2="20" y2="28" stroke="#1c1917" strokeWidth="2" />
            <line x1="28" y1="14" x2="22" y2="24" stroke="#1c1917" strokeWidth="1.5" />
          </g>
          <LocationPin
            x={280}
            y={490}
            status={getEgyptPuzzle2Status()}
            isHovered={hoveredNodeId === 'egypt_puzzle_2'}
            label="The Cracked Basin"
          />
        </g>

        {/* --- EGYPT MECHANISM: The Pyramid of Secrets --- */}
        <g
          id="node-egypt-mechanism"
          className="cursor-pointer"
          onClick={() =>
            handleNodeClick({
              type: 'mechanism',
              civId: 'egypt',
              id: 'egypt_mechanism',
              name: 'The Pyramid of Secrets',
              description: CIVILIZATIONS.egypt.mechanism.description,
              status: getEgyptMechanismStatus(),
              lockReason: !isEgyptUnlocked
                ? 'Activate Japan\'s "The Shrine of Memories" first to reach Egypt.'
                : 'Complete both "The Scattered Ceiling" and "The Cracked Basin" to unlock the Pyramid portal.',
              rewardName: CIVILIZATIONS.egypt.mechanism.fragmentReward.name,
              rewardDesc: CIVILIZATIONS.egypt.mechanism.fragmentReward.description,
            })
          }
          onMouseEnter={() => setHoveredNodeId('egypt_mechanism')}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          {/* Landmark: Monumental Golden Pyramid */}
          <g transform="translate(180, 270)">
            <polygon points="30,0 64,54 -4,54" fill="#b45309" />
            <polygon points="30,0 64,54 30,54" fill="#92400e" />
            <polygon points="30,0 38,15 22,15" fill="#fef08a" />
            {/* Pyramid Portal Doorway */}
            <rect x="25" y="42" width="10" height="12" fill="#09090b" stroke="#facc15" strokeWidth="1.5" />
          </g>
          <MechanismPin
            x={210}
            y={260}
            status={getEgyptMechanismStatus()}
            isHovered={hoveredNodeId === 'egypt_mechanism'}
            label="The Pyramid of Secrets"
          />
        </g>

        {/* ======================================================== */}
        {/* ANIMATED PLAYER EXPLORER SPRITE / MARKER */}
        {/* ======================================================== */}
        <g
          id="player-adventurer-sprite"
          transform={`translate(${playerPos.x - 12}, ${playerPos.y + 12})`}
          className="transition-all duration-500 ease-out pointer-events-none"
        >
          {/* Explorer Hat */}
          <rect x="2" y="0" width="20" height="4" fill="#78350f" />
          <rect x="6" y="-3" width="12" height="4" fill="#92400e" />
          {/* Head & Face */}
          <rect x="7" y="4" width="10" height="8" fill="#fde047" />
          <rect x="9" y="6" width="2" height="2" fill="#18181b" />
          <rect x="13" y="6" width="2" height="2" fill="#18181b" />
          {/* Explorer Jacket & Pack */}
          <rect x="6" y="12" width="12" height="10" fill="#047857" />
          <rect x="18" y="13" width="4" height="8" fill="#78350f" />
          {/* Boots */}
          <rect x="7" y="22" width="4" height="6" fill="#451a03" />
          <rect x="13" y="22" width="4" height="6" fill="#451a03" />
          {/* Glowing Compass Beacon */}
          <circle cx="2" cy="16" r="3" fill="#38bdf8">
            <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
          </circle>
          {/* "YOU ARE HERE" Indicator */}
          <rect x="1" y="-12" width="22" height="8" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
          <text x="12" y="-6" fill="#fef08a" fontFamily="'Press Start 2P', monospace" fontSize="5" textAnchor="middle">
            YOU
          </text>
        </g>
      </svg>
    </div>
  );
};

// Reusable Location Pin Component
const LocationPin: React.FC<{
  x: number;
  y: number;
  status: 'available' | 'completed' | 'locked';
  isHovered: boolean;
  label: string;
}> = ({ x, y, status, isHovered, label }) => {
  const colors = {
    available: { bg: '#d97706', border: '#fbbf24', text: '#fef08a', icon: '✦' },
    completed: { bg: '#059669', border: '#34d399', text: '#a7f3d0', icon: '✓' },
    locked: { bg: '#27272a', border: '#52525b', text: '#a1a1aa', icon: '🔒' },
  }[status];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pulsing ring if available */}
      {status === 'available' && (
        <circle cx="0" cy="0" r="10" fill="none" stroke="#fbbf24" strokeWidth="1.5">
          <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Main Pin Diamond */}
      <polygon
        points="0,-8 8,0 0,8 -8,0"
        fill={colors.bg}
        stroke={isHovered ? '#ffffff' : colors.border}
        strokeWidth="2"
      />
      <text x="0" y="3" fill={colors.text} fontFamily="'Press Start 2P', monospace" fontSize="7" textAnchor="middle">
        {colors.icon}
      </text>

      {/* Label Tooltip on hover */}
      {isHovered && (
        <g transform="translate(0, -18)">
          <rect x="-60" y="-8" width="120" height="14" fill="#09090b" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="0" y="2" fill="#fef08a" fontFamily="'Silkscreen', monospace" fontSize="8" textAnchor="middle">
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// Reusable Mechanism Pin Component (Larger)
const MechanismPin: React.FC<{
  x: number;
  y: number;
  status: 'available' | 'completed' | 'locked';
  isHovered: boolean;
  label: string;
}> = ({ x, y, status, isHovered, label }) => {
  const colors = {
    available: { bg: '#f59e0b', border: '#fde047', text: '#000000', icon: '⚙' },
    completed: { bg: '#059669', border: '#34d399', text: '#ffffff', icon: '★' },
    locked: { bg: '#18181b', border: '#52525b', text: '#a1a1aa', icon: '🔒' },
  }[status];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Radiant beacon if available */}
      {status === 'available' && (
        <circle cx="0" cy="0" r="14" fill="none" stroke="#fde047" strokeWidth="2">
          <animate attributeName="r" values="10;18;10" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Octagonal Vault Pin */}
      <polygon
        points="-4,-11 4,-11 11,-4 11,4 4,11 -4,11 -11,4 -11,-4"
        fill={colors.bg}
        stroke={isHovered ? '#ffffff' : colors.border}
        strokeWidth="2.5"
      />
      <text x="0" y="4" fill={colors.text} fontFamily="'Press Start 2P', monospace" fontSize="8" textAnchor="middle">
        {colors.icon}
      </text>

      {/* Label Tooltip */}
      {isHovered && (
        <g transform="translate(0, -22)">
          <rect x="-70" y="-8" width="140" height="15" fill="#09090b" stroke="#fde047" strokeWidth="1.5" />
          <text x="0" y="3" fill="#fde047" fontFamily="'Press Start 2P', monospace" fontSize="7" textAnchor="middle">
            {label}
          </text>
        </g>
      )}
    </g>
  );
};
