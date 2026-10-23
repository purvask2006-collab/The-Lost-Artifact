export type GameScreen = 
  | 'TITLE'
  | 'WORLD_MAP'
  | 'CIV_HUB'
  | 'PUZZLE'
  | 'MECHANISM'
  | 'ASSEMBLY'
  | 'COMPLETION';

export type CivilizationId = 'india' | 'japan' | 'egypt';

export type PuzzleId = 
  | 'india_puzzle_1' 
  | 'india_puzzle_2' 
  | 'india_puzzle_3'
  | 'india_puzzle_4'
  | 'japan_puzzle_1' 
  | 'japan_puzzle_2' 
  | 'japan_puzzle_3'
  | 'japan_puzzle_4'
  | 'egypt_puzzle_1' 
  | 'egypt_puzzle_2'
  | 'egypt_puzzle_3'
  | 'egypt_puzzle_4';

export type MechanismId = 
  | 'india_mechanism' 
  | 'japan_mechanism' 
  | 'egypt_mechanism';

export type FragmentId = 
  | 'fragment_solar_wheel' 
  | 'fragment_celestial_mirror' 
  | 'fragment_eternal_eye';

export type GemstoneId = 
  | 'ruby'
  | 'emerald'
  | 'sapphire'
  | 'citrine'
  | 'rose_quartz'
  | 'moonstone'
  | 'amethyst'
  | 'obsidian'
  | 'lapis_lazuli'
  | 'turquoise'
  | 'carnelian'
  | 'malachite';

export interface GemstoneInfo {
  id: GemstoneId;
  name: string;
  civilization: CivilizationId;
  colorName: string;
  hexColor: string;
  shape: string;
  icon: string;
  description: string;
  earnedFromPuzzleId: PuzzleId;
}

export interface ArtifactFragment {
  id: FragmentId;
  name: string;
  civilization: CivilizationId;
  civilizationName: string;
  description: string;
  symbol: string;
  paletteColor: string;
}

export interface GuardianInfo {
  name: string;
  title: string;
  role: string;
  philosophy: string;
  environmentalObjects: {
    primary: string;
    secondary: string;
    description: string;
  };
  completionEcho: string;
}

export interface PuzzleInfo {
  id: PuzzleId;
  puzzleNumber: number; // 1 to 4
  civilization: CivilizationId;
  name: string;
  chamberName: string;
  description: string;
  riddle: string;
  gemstone: GemstoneInfo;
  guardianNote: string;
}

export interface MechanismInfo {
  id: MechanismId;
  civilization: CivilizationId;
  name: string;
  description: string;
  fragmentReward: ArtifactFragment;
  requiredGemstones: GemstoneId[];
  requiredPuzzles: PuzzleId[];
}

export interface CivilizationInfo {
  id: CivilizationId;
  name: string;
  subtitle: string;
  region: string;
  era: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  lore: string;
  guardian: GuardianInfo;
  fragmentId: FragmentId;
  puzzles: PuzzleInfo[];
  mechanism: MechanismInfo;
  mapCoords: { x: number; y: number };
}

export interface GameState {
  currentScreen: GameScreen;
  selectedCiv: CivilizationId | null;
  activePuzzleId: PuzzleId | null;
  activeMechanismId: MechanismId | null;
  
  unlockedCivs: Record<CivilizationId, boolean>;
  solvedPuzzles: Record<PuzzleId, boolean>;
  collectedGemstones: Record<GemstoneId, boolean>;
  socketedGemstones: Record<MechanismId, GemstoneId[]>;
  unlockedMechanisms: Record<MechanismId, boolean>;
  recoveredFragments: Record<FragmentId, boolean>;
  
  artifactAssembled: boolean;
  gameCompleted: boolean;
  
  soundEnabled: boolean;
  musicEnabled: boolean;
  crtFilterEnabled: boolean;
  
  hasStarted: boolean;
  lastSavedAt: number | null;
  playtimeSeconds: number;
}

