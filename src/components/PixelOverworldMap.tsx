import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CIVILIZATIONS } from '../data/gameData';
import { CivilizationId, PuzzleId, MechanismId } from '../types/game';
import { LocationTarget } from './LocationModal';
import { PRIESTESS_SPRITES, SpriteDirection } from './IndianPriestessSprite';
import { soundManager } from '../utils/audio';

interface PixelOverworldMapProps {
  onSelectLocation: (target: LocationTarget) => void;
  activeLocationId: string | null;
  onSelectCivilization?: (civId: CivilizationId) => void;
}

interface NodeCoord {
  x: number;
  y: number;
  civId: CivilizationId;
  type: 'puzzle' | 'mechanism';
  id: PuzzleId | MechanismId;
  name: string;
  chamberNum: string;
  relicIcon: string;
  relicName: string;
}

const MAP_NODES: Record<string, NodeCoord> = {
  // India (Left Realm)
  india_puzzle_1: {
    x: 160,
    y: 520,
    civId: 'india',
    type: 'puzzle',
    id: 'india_puzzle_1',
    name: 'The Cracked Courtyard',
    chamberNum: 'CHAMBER I',
    relicIcon: '☀️',
    relicName: 'Golden Gnomon',
  },
  india_puzzle_2: {
    x: 485,
    y: 715,
    civId: 'india',
    type: 'puzzle',
    id: 'india_puzzle_2',
    name: 'The Five Hearths',
    chamberNum: 'CHAMBER II',
    relicIcon: '🪷',
    relicName: 'Ruby Lotus Key',
  },
  india_mechanism: {
    x: 350,
    y: 355,
    civId: 'india',
    type: 'mechanism',
    id: 'india_mechanism',
    name: 'The Chakra of Balance',
    chamberNum: 'GRAND MECHANISM',
    relicIcon: '☸',
    relicName: 'Solar Wheel',
  },

  // Egypt (Center Realm)
  egypt_puzzle_1: {
    x: 770,
    y: 575,
    civId: 'egypt',
    type: 'puzzle',
    id: 'egypt_puzzle_1',
    name: 'The Scattered Ceiling',
    chamberNum: 'CHAMBER I',
    relicIcon: '☀️',
    relicName: 'Sun Symbol 1',
  },
  egypt_puzzle_2: {
    x: 1190,
    y: 605,
    civId: 'egypt',
    type: 'puzzle',
    id: 'egypt_puzzle_2',
    name: 'The Cracked Basin',
    chamberNum: 'CHAMBER II',
    relicIcon: '☥',
    relicName: 'Sun Symbol 2',
  },
  egypt_mechanism: {
    x: 975,
    y: 335,
    civId: 'egypt',
    type: 'mechanism',
    id: 'egypt_mechanism',
    name: 'The Pyramid of Secrets',
    chamberNum: 'GRAND MECHANISM',
    relicIcon: '𓁹',
    relicName: 'Eternal Eye',
  },

  // Japan (Right Realm)
  japan_puzzle_1: {
    x: 1410,
    y: 635,
    civId: 'japan',
    type: 'puzzle',
    id: 'japan_puzzle_1',
    name: 'The Misplaced Screen',
    chamberNum: 'CHAMBER I',
    relicIcon: '🎐',
    relicName: 'Spirit Seal 1',
  },
  japan_puzzle_2: {
    x: 1805,
    y: 625,
    civId: 'japan',
    type: 'puzzle',
    id: 'japan_puzzle_2',
    name: 'The Bell Sequence',
    chamberNum: 'CHAMBER II',
    relicIcon: '📿',
    relicName: 'Spirit Seal 2',
  },
  japan_mechanism: {
    x: 1605,
    y: 430,
    civId: 'japan',
    type: 'mechanism',
    id: 'japan_mechanism',
    name: 'The Shrine of Memories',
    chamberNum: 'GRAND MECHANISM',
    relicIcon: '⛩',
    relicName: 'Celestial Mirror',
  },
};

export const PixelOverworldMap: React.FC<PixelOverworldMapProps> = ({
  onSelectLocation,
  activeLocationId,
  onSelectCivilization,
}) => {
  const { state, selectCivilization, goToScreen, openChamber, openMechanism } = useGame();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredCivId, setHoveredCivId] = useState<CivilizationId | null>(null);
  const [playerDirection, setPlayerDirection] = useState<SpriteDirection>('south');
  const [prevPos, setPrevPos] = useState<{ x: number; y: number }>({ x: 160, y: 520 });

  // Progression checks
  const isIndiaMechanismUnlocked = Boolean(state.unlockedMechanisms.india_mechanism);
  const isJapanMechanismUnlocked = Boolean(state.unlockedMechanisms.japan_mechanism);
  const isEgyptMechanismUnlocked = Boolean(state.unlockedMechanisms.egypt_mechanism);

  // Linear progression: India -> Japan -> Egypt
  const isJapanUnlocked = isIndiaMechanismUnlocked;
  const isEgyptUnlocked = isJapanMechanismUnlocked;

  const fragmentsCount = Object.values(state.recoveredFragments).filter(Boolean).length;
  const allFragmentsRecovered = fragmentsCount === 3;

  // Status checks for India
  const getIndiaPuzzle1Status = (): 'available' | 'completed' | 'locked' =>
    state.solvedPuzzles.india_puzzle_1 ? 'completed' : 'available';

  const getIndiaPuzzle2Status = (): 'available' | 'completed' | 'locked' =>
    state.solvedPuzzles.india_puzzle_2 ? 'completed' : 'available';

  const getIndiaMechanismStatus = (): 'available' | 'completed' | 'locked' => {
    if (state.unlockedMechanisms.india_mechanism) return 'completed';
    if (state.solvedPuzzles.india_puzzle_1 && state.solvedPuzzles.india_puzzle_2) return 'available';
    return 'locked';
  };

  // Status checks for Japan
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

  // Status checks for Egypt
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

  const getNodeStatus = (nodeId: string): 'available' | 'completed' | 'locked' => {
    switch (nodeId) {
      case 'india_puzzle_1': return getIndiaPuzzle1Status();
      case 'india_puzzle_2': return getIndiaPuzzle2Status();
      case 'india_mechanism': return getIndiaMechanismStatus();
      case 'japan_puzzle_1': return getJapanPuzzle1Status();
      case 'japan_puzzle_2': return getJapanPuzzle2Status();
      case 'japan_mechanism': return getJapanMechanismStatus();
      case 'egypt_puzzle_1': return getEgyptPuzzle1Status();
      case 'egypt_puzzle_2': return getEgyptPuzzle2Status();
      case 'egypt_mechanism': return getEgyptMechanismStatus();
      default: return 'locked';
    }
  };

  const buildLocationTarget = (nodeId: string): LocationTarget => {
    const node = MAP_NODES[nodeId];
    const civ = CIVILIZATIONS[node.civId];
    const status = getNodeStatus(nodeId);

    if (node.type === 'puzzle') {
      const pInfo = civ.puzzles.find(p => p.id === node.id)!;
      let lockReason: string | undefined;
      if (status === 'locked') {
        if (node.civId === 'japan') lockReason = 'Unlock India’s Chakra of Balance mechanism first.';
        if (node.civId === 'egypt') lockReason = 'Unlock Japan’s Shrine of Memories mechanism first.';
      }
      return {
        type: 'puzzle',
        civId: node.civId,
        id: node.id as PuzzleId,
        name: pInfo.name,
        description: pInfo.description,
        status,
        lockReason,
        rewardName: pInfo.reward.name,
        rewardIcon: pInfo.reward.icon,
        rewardDesc: pInfo.reward.description,
        riddle: pInfo.riddle,
      };
    } else {
      const mInfo = civ.mechanism;
      let lockReason: string | undefined;
      if (status === 'locked') {
        if (node.civId === 'japan' && !isJapanUnlocked) {
          lockReason = 'Unlock India’s Chakra of Balance first.';
        } else if (node.civId === 'egypt' && !isEgyptUnlocked) {
          lockReason = 'Unlock Japan’s Shrine of Memories first.';
        } else {
          lockReason = `Solve both chambers in ${civ.name} to activate this mechanism.`;
        }
      }
      return {
        type: 'mechanism',
        civId: node.civId,
        id: node.id as MechanismId,
        name: mInfo.name,
        description: mInfo.description,
        status,
        lockReason,
        rewardName: mInfo.fragmentReward.name,
        rewardIcon: '💎',
        rewardDesc: mInfo.fragmentReward.description,
      };
    }
  };

  const handleNodeClick = (nodeId: string) => {
    soundManager.playClick(state.soundEnabled);
    const target = buildLocationTarget(nodeId);
    onSelectLocation(target);
  };

  const handleCivClick = (civId: CivilizationId) => {
    soundManager.playClick(state.soundEnabled);
    if (civId === 'japan' && !isJapanUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    if (civId === 'egypt' && !isEgyptUnlocked) {
      soundManager.playCancel(state.soundEnabled);
      return;
    }
    if (onSelectCivilization) {
      onSelectCivilization(civId);
    } else {
      selectCivilization(civId);
    }
  };

  // Determine active player position
  const activeLocId = activeLocationId || 'india_puzzle_1';
  const playerPos = MAP_NODES[activeLocId] || { x: 160, y: 520 };

  // Calculate direction angle when traveling between nodes
  useEffect(() => {
    const nextPos = MAP_NODES[activeLocId] || { x: 160, y: 520 };
    const dx = nextPos.x - prevPos.x;
    const dy = nextPos.y - prevPos.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      let dir: SpriteDirection = 'south';
      if (angle >= -22.5 && angle < 22.5) dir = 'east';
      else if (angle >= 22.5 && angle < 67.5) dir = 'south-east';
      else if (angle >= 67.5 && angle < 112.5) dir = 'south';
      else if (angle >= 112.5 && angle < 157.5) dir = 'south-west';
      else if (angle >= 157.5 || angle < -157.5) dir = 'west';
      else if (angle >= -157.5 && angle < -112.5) dir = 'north-west';
      else if (angle >= -112.5 && angle < -67.5) dir = 'north';
      else if (angle >= -67.5 && angle < -22.5) dir = 'north-east';

      setPlayerDirection(dir);
      setPrevPos(nextPos);
    }
  }, [activeLocId, prevPos.x, prevPos.y]);

  const activeInspectNode = hoveredNodeId ? MAP_NODES[hoveredNodeId] : MAP_NODES[activeLocId];
  const activeInspectStatus = activeInspectNode ? getNodeStatus(activeInspectNode.id) : 'available';

  return (
    <div className="relative w-full aspect-[16/9] max-h-[85vh] min-h-[500px] bg-black border-4 border-amber-600 shadow-[0_0_50px_rgba(0,0,0,0.98),0_0_20px_rgba(217,119,6,0.3)] overflow-hidden select-none">
      {/* 1. Authentic Overworld Map Image (Crisp pixelated rendering) */}
      <img
        src="/assets/aistudio/The_Lost_Artifact_World_Map_123794b3.png"
        alt="The Lost Artifact Overworld Map"
        className="w-full h-full object-cover object-center filter saturate-115 contrast-110 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* 2. Pixel scanline mesh overlay for authentic retro arcade feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px] opacity-25" />

      {/* 3. Interactive SVG Layer with Chunky, High-Visibility Pixel Badges */}
      <svg
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full pointer-events-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Intense pixel glow filters */}
          <filter id="pixelGlowGold" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="pixelGlowGreen" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* ANIMATED PIXEL DOTTED TRADE ROUTE FLOW                   */}
        {/* ======================================================== */}
        {/* India to Egypt Trade Route */}
        <path
          d="M 520 720 Q 640 700 750 670 Q 820 650 880 620"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          strokeDasharray="8 12"
          opacity="0.8"
        >
          <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Egypt to Japan Trade Route */}
        <path
          d="M 1220 590 Q 1300 630 1400 640 Q 1500 640 1560 550"
          fill="none"
          stroke={isJapanUnlocked ? '#38bdf8' : '#52525b'}
          strokeWidth="4"
          strokeDasharray="8 12"
          opacity={isJapanUnlocked ? '0.85' : '0.4'}
        >
          {isJapanUnlocked && (
            <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
          )}
        </path>

        {/* ======================================================== */}
        {/* CIVILIZATION REALM INTERACTIVE BANNERS                   */}
        {/* ======================================================== */}

        {/* 1. INDIA BANNER (x: 200-480, y: 740-815) */}
        <g
          className="cursor-pointer group"
          onClick={() => handleCivClick('india')}
          onMouseEnter={() => setHoveredCivId('india')}
          onMouseLeave={() => setHoveredCivId(null)}
        >
          {/* Black shadow border */}
          <rect x="204" y="744" width="272" height="68" fill="#000000" rx="4" />
          {/* Main frame */}
          <rect
            x="200"
            y="740"
            width="272"
            height="68"
            fill="#064e3b"
            stroke={hoveredCivId === 'india' ? '#34d399' : '#059669'}
            strokeWidth={hoveredCivId === 'india' ? '4' : '3'}
            rx="4"
          />
          {/* Inner bevel */}
          <rect x="204" y="744" width="264" height="60" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
          {/* Text Lockup */}
          <text x="245" y="782" fill="#34d399" fontFamily="'Press Start 2P', monospace" fontSize="22">
            ☸
          </text>
          <text x="350" y="776" fill="#fef08a" fontFamily="'Press Start 2P', monospace" fontSize="18" textAnchor="middle" fontWeight="bold">
            INDIA
          </text>
          <text x="350" y="798" fill="#a7f3d0" fontFamily="'Silkscreen', monospace" fontSize="11" textAnchor="middle">
            {state.unlockedMechanisms.india_mechanism ? '★ VAULT RECOVERED' : '✦ STEPWELL SANCTUARY'}
          </text>
        </g>

        {/* 2. EGYPT BANNER (x: 820-1100, y: 700-775) */}
        <g
          className={`cursor-pointer group ${!isEgyptUnlocked ? 'opacity-90' : ''}`}
          onClick={() => handleCivClick('egypt')}
          onMouseEnter={() => setHoveredCivId('egypt')}
          onMouseLeave={() => setHoveredCivId(null)}
        >
          <rect x="824" y="704" width="272" height="68" fill="#000000" rx="4" />
          <rect
            x="820"
            y="700"
            width="272"
            height="68"
            fill={isEgyptUnlocked ? '#78350f' : '#18181b'}
            stroke={isEgyptUnlocked ? (hoveredCivId === 'egypt' ? '#fde047' : '#f59e0b') : '#52525b'}
            strokeWidth={hoveredCivId === 'egypt' ? '4' : '3'}
            rx="4"
          />
          <rect x="824" y="704" width="264" height="60" fill="none" stroke={isEgyptUnlocked ? '#fbbf24' : '#3f3f46'} strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
          <text x="865" y="742" fill={isEgyptUnlocked ? '#fde047' : '#71717a'} fontFamily="'Press Start 2P', monospace" fontSize="22">
            ☥
          </text>
          <text x="970" y="736" fill={isEgyptUnlocked ? '#fef08a' : '#a1a1aa'} fontFamily="'Press Start 2P', monospace" fontSize="18" textAnchor="middle" fontWeight="bold">
            EGYPT
          </text>
          <text x="970" y="758" fill={isEgyptUnlocked ? '#fde68a' : '#71717a'} fontFamily="'Silkscreen', monospace" fontSize="11" textAnchor="middle">
            {state.unlockedMechanisms.egypt_mechanism ? '★ VAULT RECOVERED' : isEgyptUnlocked ? '✦ PYRAMID OF SECRETS' : '🔒 UNLOCK JAPAN FIRST'}
          </text>
        </g>

        {/* 3. JAPAN BANNER (x: 1470-1750, y: 740-815) */}
        <g
          className={`cursor-pointer group ${!isJapanUnlocked ? 'opacity-90' : ''}`}
          onClick={() => handleCivClick('japan')}
          onMouseEnter={() => setHoveredCivId('japan')}
          onMouseLeave={() => setHoveredCivId(null)}
        >
          <rect x="1474" y="744" width="272" height="68" fill="#000000" rx="4" />
          <rect
            x="1470"
            y="740"
            width="272"
            height="68"
            fill={isJapanUnlocked ? '#1e1b4b' : '#18181b'}
            stroke={isJapanUnlocked ? (hoveredCivId === 'japan' ? '#38bdf8' : '#0284c7') : '#52525b'}
            strokeWidth={hoveredCivId === 'japan' ? '4' : '3'}
            rx="4"
          />
          <rect x="1474" y="744" width="264" height="60" fill="none" stroke={isJapanUnlocked ? '#38bdf8' : '#3f3f46'} strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
          <text x="1515" y="782" fill={isJapanUnlocked ? '#f87171' : '#71717a'} fontFamily="'Press Start 2P', monospace" fontSize="22">
            ⛩
          </text>
          <text x="1620" y="776" fill={isJapanUnlocked ? '#e0f2fe' : '#a1a1aa'} fontFamily="'Press Start 2P', monospace" fontSize="18" textAnchor="middle" fontWeight="bold">
            JAPAN
          </text>
          <text x="1620" y="798" fill={isJapanUnlocked ? '#bae6fd' : '#71717a'} fontFamily="'Silkscreen', monospace" fontSize="11" textAnchor="middle">
            {state.unlockedMechanisms.japan_mechanism ? '★ VAULT RECOVERED' : isJapanUnlocked ? '✦ SHRINE OF MEMORIES' : '🔒 UNLOCK INDIA FIRST'}
          </text>
        </g>

        {/* ======================================================== */}
        {/* ROUTE LOCK MILESTONES (High-Contrast Chunky Badges)      */}
        {/* ======================================================== */}

        {/* Route milestone between India and Egypt (x: 720, y: 685) */}
        <g transform="translate(720, 685)" className="pointer-events-none">
          <circle cx="0" cy="0" r="22" fill="#000000" stroke="#f59e0b" strokeWidth="3" />
          <circle cx="0" cy="0" r="17" fill={isEgyptUnlocked ? '#065f46' : '#27272a'} />
          <text x="0" y="6" fill="#ffffff" fontFamily="'Press Start 2P', monospace" fontSize="12" textAnchor="middle">
            {isEgyptUnlocked ? '✓' : '🔒'}
          </text>
          <rect x="-45" y="26" width="90" height="18" fill="#09090b" stroke="#52525b" strokeWidth="1.5" rx="3" />
          <text x="0" y="38" fill={isEgyptUnlocked ? '#34d399' : '#a1a1aa'} fontFamily="'Silkscreen', monospace" fontSize="8" textAnchor="middle">
            {isEgyptUnlocked ? 'ROUTE OPEN' : 'SEALED'}
          </text>
        </g>

        {/* Route milestone between Egypt and Japan (x: 1295, y: 625) */}
        <g transform="translate(1295, 625)" className="pointer-events-none">
          <circle cx="0" cy="0" r="22" fill="#000000" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="0" cy="0" r="17" fill={isJapanUnlocked ? '#065f46' : '#27272a'} />
          <text x="0" y="6" fill="#ffffff" fontFamily="'Press Start 2P', monospace" fontSize="12" textAnchor="middle">
            {isJapanUnlocked ? '✓' : '🔒'}
          </text>
          <rect x="-45" y="26" width="90" height="18" fill="#09090b" stroke="#52525b" strokeWidth="1.5" rx="3" />
          <text x="0" y="38" fill={isJapanUnlocked ? '#34d399' : '#a1a1aa'} fontFamily="'Silkscreen', monospace" fontSize="8" textAnchor="middle">
            {isJapanUnlocked ? 'ROUTE OPEN' : 'SEALED'}
          </text>
        </g>

        {/* Bottom Center Reassembly Sanctum Altar Node (x: 1040, y: 835) */}
        <g
          transform="translate(1040, 835)"
          className="cursor-pointer group"
          onClick={() => {
            soundManager.playClick(state.soundEnabled);
            goToScreen('ASSEMBLY');
          }}
        >
          {allFragmentsRecovered ? (
            <>
              {/* Pulsing Beacon Halo */}
              <circle cx="0" cy="0" r="32" fill="none" stroke="#fde047" strokeWidth="4" filter="url(#pixelGlowGold)">
                <animate attributeName="r" values="28;42;28" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
              </circle>
              {/* Altar base */}
              <rect x="-35" y="-20" width="70" height="40" fill="#000000" rx="4" />
              <rect x="-32" y="-18" width="64" height="36" fill="#78350f" stroke="#facc15" strokeWidth="3" rx="3" />
              <text x="0" y="6" fill="#fef08a" fontFamily="'Press Start 2P', monospace" fontSize="18" textAnchor="middle">
                ✦
              </text>
              {/* Name Tag */}
              <rect x="-100" y="24" width="200" height="26" fill="#000000" stroke="#facc15" strokeWidth="2" rx="4" />
              <text x="0" y="41" fill="#fde047" fontFamily="'Press Start 2P', monospace" fontSize="9" textAnchor="middle" fontWeight="bold">
                UNITE THE LOST ARTIFACT
              </text>
            </>
          ) : (
            <>
              <circle cx="0" cy="0" r="26" fill="#000000" stroke="#52525b" strokeWidth="3" />
              <circle cx="0" cy="0" r="20" fill="#18181b" />
              <text x="0" y="6" fill="#eab308" fontFamily="'Press Start 2P', monospace" fontSize="14" textAnchor="middle">
                △
              </text>
              <rect x="-80" y="30" width="160" height="22" fill="#09090b" stroke="#52525b" strokeWidth="1.5" rx="3" />
              <text x="0" y="45" fill="#fde047" fontFamily="'Silkscreen', monospace" fontSize="10" textAnchor="middle">
                SANCTUM: {fragmentsCount}/3 KEYSTONES
              </text>
            </>
          )}
        </g>

        {/* ======================================================== */}
        {/* CHUNKY HIGH-VISIBILITY PIXEL-ART PUZZLE & MECHANISM NODES */}
        {/* ======================================================== */}
        {Object.entries(MAP_NODES).map(([nodeId, node]) => {
          const status = getNodeStatus(nodeId);
          const isSelected = activeLocationId === nodeId;
          const isHovered = hoveredNodeId === nodeId;
          const isMechanism = node.type === 'mechanism';

          // Color themes based on state
          const badgeTheme = {
            completed: {
              main: '#059669',
              border: '#34d399',
              accent: '#a7f3d0',
              text: '#ffffff',
              glow: 'pixelGlowGreen',
              label: 'CLEARED',
            },
            available: {
              main: isMechanism ? '#b45309' : '#d97706',
              border: isMechanism ? '#fde047' : '#fbbf24',
              accent: '#fef08a',
              text: '#ffffff',
              glow: 'pixelGlowGold',
              label: isMechanism ? 'READY' : 'ACTIVE',
            },
            locked: {
              main: '#18181b',
              border: '#52525b',
              accent: '#71717a',
              text: '#a1a1aa',
              glow: '',
              label: 'LOCKED',
            },
          }[status];

          return (
            <g
              key={nodeId}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer group"
              onClick={() => handleNodeClick(nodeId)}
              onMouseEnter={() => setHoveredNodeId(nodeId)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              {/* 1. Pulsing Concentric Reticle for Available Nodes */}
              {status === 'available' && (
                <circle cx="0" cy="0" r={isMechanism ? 38 : 28} fill="none" stroke={badgeTheme.border} strokeWidth="3" opacity="0.8">
                  <animate attributeName="r" values={isMechanism ? '32;46;32' : '24;36;24'} dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* 2. Drop Shadow Under Badge */}
              <rect
                x={isMechanism ? -32 : -25}
                y={isMechanism ? -32 : -25}
                width={isMechanism ? 64 : 50}
                height={isMechanism ? 64 : 50}
                fill="#000000"
                rx={isMechanism ? 12 : 6}
                transform="translate(4, 4)"
              />

              {/* 3. Main Chunky Badge Body */}
              <rect
                x={isMechanism ? -32 : -25}
                y={isMechanism ? -32 : -25}
                width={isMechanism ? 64 : 50}
                height={isMechanism ? 64 : 50}
                fill={badgeTheme.main}
                stroke={isSelected || isHovered ? '#ffffff' : badgeTheme.border}
                strokeWidth={isSelected || isHovered ? '4' : '3'}
                rx={isMechanism ? 12 : 6}
                filter={isSelected || isHovered ? `url(#${badgeTheme.glow})` : undefined}
              />

              {/* Inner 3D Highlight Border */}
              <rect
                x={isMechanism ? -29 : -22}
                y={isMechanism ? -29 : -22}
                width={isMechanism ? 58 : 44}
                height={isMechanism ? 58 : 44}
                fill="none"
                stroke={badgeTheme.accent}
                strokeWidth="1.5"
                rx={isMechanism ? 9 : 4}
                opacity="0.8"
              />

              {/* Central Iconic Graphic */}
              <text
                x="0"
                y={isMechanism ? '9' : '7'}
                fill={badgeTheme.text}
                fontFamily="'Press Start 2P', monospace"
                fontSize={isMechanism ? '20' : '16'}
                textAnchor="middle"
                fontWeight="bold"
              >
                {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : node.relicIcon}
              </text>

              {/* Chamber Number Tag (Below Icon) */}
              <g transform="translate(0, 36)">
                {/* Tag Shadow */}
                <rect x="-56" y="2" width="112" height="20" fill="#000000" rx="3" />
                {/* Tag Body */}
                <rect
                  x="-58"
                  y="0"
                  width="116"
                  height="20"
                  fill="#09090b"
                  stroke={isSelected || isHovered ? '#ffffff' : badgeTheme.border}
                  strokeWidth="2"
                  rx="3"
                />
                <text
                  x="0"
                  y="14"
                  fill={badgeTheme.accent}
                  fontFamily="'Press Start 2P', monospace"
                  fontSize="7"
                  textAnchor="middle"
                >
                  {node.chamberNum}
                </text>
              </g>

              {/* Persistent/Hover Name Header Pill (Above Icon) */}
              <g transform="translate(0, -42)">
                <rect x="-80" y="2" width="160" height="24" fill="#000000" rx="4" />
                <rect
                  x="-82"
                  y="0"
                  width="164"
                  height="24"
                  fill="#09090b"
                  stroke={isSelected || isHovered ? '#ffffff' : badgeTheme.border}
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x="0"
                  y="16"
                  fill={status === 'completed' ? '#34d399' : status === 'available' ? '#fde047' : '#d4d4d8'}
                  fontFamily="'Silkscreen', monospace"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.name.toUpperCase()}
                </text>
              </g>

              {/* Status Ribbon Pill */}
              <g transform="translate(0, -18)">
                <rect
                  x="-32"
                  y="0"
                  width="64"
                  height="14"
                  fill={status === 'completed' ? '#065f46' : status === 'available' ? '#b45309' : '#27272a'}
                  stroke={badgeTheme.border}
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x="0"
                  y="10"
                  fill="#ffffff"
                  fontFamily="'Press Start 2P', monospace"
                  fontSize="6"
                  textAnchor="middle"
                >
                  {badgeTheme.label}
                </text>
              </g>

              {/* Bouncing Pointer Arrow on Selected Node */}
              {isSelected && (
                <g transform="translate(0, -75)">
                  <polygon points="-8,-12 8,-12 0,0" fill="#fde047" stroke="#000000" strokeWidth="2">
                    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="0.8s" repeatCount="indefinite" />
                  </polygon>
                </g>
              )}
            </g>
          );
        })}

        {/* ======================================================== */}
        {/* 8-DIRECTIONAL PRIESTESS CHARACTER SPRITE (SCALED & VISIBLE)*/}
        {/* ======================================================== */}
        <g
          transform={`translate(${playerPos.x}, ${playerPos.y + 4})`}
          className="transition-all duration-300 ease-out pointer-events-none"
        >
          {/* Glowing Ground Pedestal Ring */}
          <ellipse cx="0" cy="24" rx="28" ry="10" fill="#000000" fillOpacity="0.85" />
          <ellipse cx="0" cy="24" rx="22" ry="8" fill="none" stroke="#facc15" strokeWidth="3" opacity="0.9">
            <animate attributeName="rx" values="20;25;20" dur="1s" repeatCount="indefinite" />
          </ellipse>

          {/* 8-Directional Character Sprite (Chunky, Scaled 54x54) */}
          <g transform="translate(-27, -32)">
            <image
              href={PRIESTESS_SPRITES[playerDirection]}
              x="0"
              y="0"
              width="54"
              height="54"
              style={{ imageRendering: 'pixelated' }}
            />
          </g>

          {/* Player Name Banner */}
          <g transform="translate(0, -42)">
            <rect x="-42" y="-1" width="84" height="18" fill="#000000" rx="3" />
            <rect x="-40" y="-3" width="80" height="18" fill="#d97706" stroke="#fef08a" strokeWidth="2" rx="3" />
            <text x="0" y="9" fill="#000000" fontFamily="'Press Start 2P', monospace" fontSize="7" textAnchor="middle" fontWeight="bold">
              ANANYA
            </text>
          </g>
        </g>
      </svg>

      {/* 4. Top Quick-Inspect HUD Card (Instant readability on current or hovered location) */}
      {activeInspectNode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto bg-zinc-950/95 border-3 border-amber-500 shadow-[0_0_25px_rgba(0,0,0,0.9),0_0_15px_rgba(245,158,11,0.4)] px-4 py-2.5 flex items-center gap-4 animate-in fade-in duration-150">
          <div className="w-10 h-10 border-2 border-amber-400 bg-stone-900 flex items-center justify-center text-xl shrink-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            {activeInspectNode.relicIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[9px] text-amber-400">
                {CIVILIZATIONS[activeInspectNode.civId].name.toUpperCase()} · {activeInspectNode.chamberNum}
              </span>
              <span
                className={`font-pixel text-[8px] px-1.5 py-0.5 border ${
                  activeInspectStatus === 'completed'
                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                    : activeInspectStatus === 'available'
                    ? 'border-amber-400 bg-amber-950 text-amber-300 animate-pulse'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-500'
                }`}
              >
                {activeInspectStatus === 'completed' ? '✓ CLEARED' : activeInspectStatus === 'available' ? '★ AVAILABLE' : '🔒 LOCKED'}
              </span>
            </div>
            <h3 className="font-pixel text-xs text-zinc-100 tracking-wide mt-0.5">
              {activeInspectNode.name}
            </h3>
          </div>

          <button
            onClick={() => handleNodeClick(activeInspectNode.id)}
            className={`pixel-btn ml-2 px-3.5 py-1.5 font-pixel text-[10px] border-2 flex items-center gap-1.5 transition-colors ${
              activeInspectStatus === 'completed'
                ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900'
                : activeInspectStatus === 'available'
                ? 'border-amber-300 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
          >
            {activeInspectStatus === 'completed' ? 'REPLAY' : activeInspectStatus === 'available' ? 'EXPLORE' : 'INSPECT'}
          </button>
        </div>
      )}
    </div>
  );
};
