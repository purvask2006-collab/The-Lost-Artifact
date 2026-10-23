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
  | 'japan_puzzle_1' 
  | 'japan_puzzle_2' 
  | 'egypt_puzzle_1' 
  | 'egypt_puzzle_2';

export type MechanismId = 
  | 'india_mechanism' 
  | 'japan_mechanism' 
  | 'egypt_mechanism';

export type FragmentId = 
  | 'fragment_solar_wheel' 
  | 'fragment_celestial_mirror' 
  | 'fragment_eternal_eye';

export interface RelicReward {
  id: string;
  name: string;
  civilization: CivilizationId;
  description: string;
  icon: string;
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

export interface PuzzleInfo {
  id: PuzzleId;
  civilization: CivilizationId;
  name: string;
  chamberName: string;
  description: string;
  riddle: string;
  reward: RelicReward;
}

export interface MechanismInfo {
  id: MechanismId;
  civilization: CivilizationId;
  name: string;
  description: string;
  fragmentReward: ArtifactFragment;
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
  fragmentId: FragmentId;
  puzzles: PuzzleInfo[];
  mechanism: MechanismInfo;
  mapCoords: { x: number; y: number }; // percentage on map
}

export interface GameState {
  currentScreen: GameScreen;
  selectedCiv: CivilizationId | null;
  activePuzzleId: PuzzleId | null;
  activeMechanismId: MechanismId | null;
  
  unlockedCivs: Record<CivilizationId, boolean>;
  solvedPuzzles: Record<PuzzleId, boolean>;
  collectedRewards: Record<string, boolean>;
  unlockedMechanisms: Record<MechanismId, boolean>;
  recoveredFragments: Record<FragmentId, boolean>;
  
  artifactAssembled: boolean;
  gameCompleted: boolean;
  
  soundEnabled: boolean;
  crtFilterEnabled: boolean;
  
  hasStarted: boolean;
  lastSavedAt: number | null;
  playtimeSeconds: number;
}
