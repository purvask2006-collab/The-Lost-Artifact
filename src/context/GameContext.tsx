import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  GameScreen, 
  CivilizationId, 
  PuzzleId, 
  MechanismId, 
  FragmentId, 
  GemstoneId,
  GameState 
} from '../types/game';
import { CIVILIZATIONS, GEMSTONES } from '../data/gameData';
import { soundManager, bgmManager } from '../utils/audio';

interface GameContextType {
  state: GameState;
  hasSavedGame: boolean;
  startAdventure: () => void;
  continueAdventure: () => void;
  goToScreen: (screen: GameScreen) => void;
  selectCivilization: (civId: CivilizationId) => void;
  returnToWorldMap: () => void;
  returnToTitle: () => void;
  openChamber: (puzzleId: PuzzleId) => void;
  openMechanism: (mechanismId: MechanismId) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleCrtFilter: () => void;
  resetGame: () => void;
  solvePuzzle: (puzzleId: PuzzleId) => void;
  socketGemstone: (mechanismId: MechanismId, gemstoneId: GemstoneId) => void;
  unlockMechanism: (mechanismId: MechanismId) => void;
  assembleFinalArtifact: () => void;
}

const STORAGE_KEY = 'the_lost_artifact_save_v2';

const INITIAL_STATE: GameState = {
  currentScreen: 'TITLE',
  selectedCiv: null,
  activePuzzleId: null,
  activeMechanismId: null,

  unlockedCivs: {
    india: true,
    japan: false, // Unlocks after India's Chakra reveals Fragment 1
    egypt: false, // Unlocks after Japan's Shrine reveals Fragment 2
  },

  solvedPuzzles: {
    india_puzzle_1: false,
    india_puzzle_2: false,
    india_puzzle_3: false,
    india_puzzle_4: false,
    japan_puzzle_1: false,
    japan_puzzle_2: false,
    japan_puzzle_3: false,
    japan_puzzle_4: false,
    egypt_puzzle_1: false,
    egypt_puzzle_2: false,
    egypt_puzzle_3: false,
    egypt_puzzle_4: false,
  },

  collectedGemstones: {
    ruby: false,
    emerald: false,
    sapphire: false,
    citrine: false,
    rose_quartz: false,
    moonstone: false,
    amethyst: false,
    obsidian: false,
    lapis_lazuli: false,
    turquoise: false,
    carnelian: false,
    malachite: false,
  },

  socketedGemstones: {
    india_mechanism: [],
    japan_mechanism: [],
    egypt_mechanism: [],
  },

  unlockedMechanisms: {
    india_mechanism: false,
    japan_mechanism: false,
    egypt_mechanism: false,
  },

  recoveredFragments: {
    fragment_solar_wheel: false,
    fragment_celestial_mirror: false,
    fragment_eternal_eye: false,
  },

  artifactAssembled: false,
  gameCompleted: false,

  soundEnabled: true,
  musicEnabled: true,
  crtFilterEnabled: false, // Clean retro display without over-darkening

  hasStarted: false,
  lastSavedAt: null,
  playtimeSeconds: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window === 'undefined') return INITIAL_STATE;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mechs = parsed.unlockedMechanisms || {};
        const frags = parsed.recoveredFragments || {};
        return {
          ...INITIAL_STATE,
          ...parsed,
          unlockedCivs: {
            india: true,
            japan: Boolean(frags.fragment_solar_wheel || mechs.india_mechanism),
            egypt: Boolean(frags.fragment_celestial_mirror || mechs.japan_mechanism),
          },
          currentScreen: 'TITLE',
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved game state', e);
    }
    return INITIAL_STATE;
  });

  const [hasSavedGame, setHasSavedGame] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.hasStarted);
      }
    } catch {
      return false;
    }
    return false;
  });

  const persistState = useCallback((nextState: GameState) => {
    try {
      const toSave = {
        ...nextState,
        lastSavedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setHasSavedGame(true);
    } catch (e) {
      console.warn('Failed to persist game state', e);
    }
  }, []);

  // Playtime counter
  useEffect(() => {
    if (state.currentScreen === 'TITLE') return;
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        playtimeSeconds: prev.playtimeSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.currentScreen]);

  // Screen music synchronization
  useEffect(() => {
    if (!state.musicEnabled) {
      bgmManager.pause();
      return;
    }

    if (state.currentScreen === 'TITLE' || state.currentScreen === 'WORLD_MAP') {
      bgmManager.play('mainTheme', true);
    } else if (state.currentScreen === 'CIV_HUB' || state.currentScreen === 'PUZZLE' || state.currentScreen === 'MECHANISM') {
      if (state.selectedCiv === 'japan') {
        bgmManager.play('shrineTheme', true);
      } else if (state.selectedCiv === 'egypt') {
        bgmManager.play('pyramidTheme', true);
      } else {
        bgmManager.play('mainTheme', true);
      }
    } else if (state.currentScreen === 'ASSEMBLY' || state.currentScreen === 'COMPLETION') {
      bgmManager.play('shrineTheme', true);
    }
  }, [state.currentScreen, state.selectedCiv, state.musicEnabled]);

  const startAdventure = useCallback(() => {
    soundManager.playStartAdventure(state.soundEnabled);
    setState(prev => {
      const next: GameState = {
        ...prev,
        hasStarted: true,
        currentScreen: 'WORLD_MAP',
        selectedCiv: null,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const continueAdventure = useCallback(() => {
    soundManager.playClick(state.soundEnabled);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({
          ...INITIAL_STATE,
          ...parsed,
          currentScreen: 'WORLD_MAP',
        });
        return;
      }
    } catch (e) {
      console.warn('Failed to load continue state', e);
    }
    startAdventure();
  }, [state.soundEnabled, startAdventure]);

  const goToScreen = useCallback((screen: GameScreen) => {
    soundManager.playClick(state.soundEnabled);
    setState(prev => {
      const next = { ...prev, currentScreen: screen };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const selectCivilization = useCallback((civId: CivilizationId) => {
    soundManager.playTravel(state.soundEnabled);
    setState(prev => {
      const next: GameState = {
        ...prev,
        selectedCiv: civId,
        currentScreen: 'CIV_HUB',
        activePuzzleId: null,
        activeMechanismId: null,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const returnToWorldMap = useCallback(() => {
    soundManager.playCancel(state.soundEnabled);
    setState(prev => {
      const next: GameState = {
        ...prev,
        currentScreen: 'WORLD_MAP',
        selectedCiv: null,
        activePuzzleId: null,
        activeMechanismId: null,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const returnToTitle = useCallback(() => {
    soundManager.playCancel(state.soundEnabled);
    setState(prev => {
      const next: GameState = {
        ...prev,
        currentScreen: 'TITLE',
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const openChamber = useCallback((puzzleId: PuzzleId) => {
    soundManager.playClick(state.soundEnabled);
    setState(prev => {
      const civId = (puzzleId.split('_')[0] as CivilizationId) || prev.selectedCiv || 'india';
      const next: GameState = {
        ...prev,
        selectedCiv: civId,
        activePuzzleId: puzzleId,
        currentScreen: 'PUZZLE',
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const openMechanism = useCallback((mechanismId: MechanismId) => {
    soundManager.playClick(state.soundEnabled);
    setState(prev => {
      const civId = (mechanismId.split('_')[0] as CivilizationId) || prev.selectedCiv || 'india';
      const next: GameState = {
        ...prev,
        selectedCiv: civId,
        activeMechanismId: mechanismId,
        currentScreen: 'MECHANISM',
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const toggleSound = useCallback(() => {
    setState(prev => {
      const nextEnabled = !prev.soundEnabled;
      if (nextEnabled) {
        soundManager.playSoundTest();
      } else {
        soundManager.playToggle(true);
      }
      const next = { ...prev, soundEnabled: nextEnabled };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const toggleMusic = useCallback(() => {
    setState(prev => {
      const nextMusic = !prev.musicEnabled;
      if (!nextMusic) {
        bgmManager.pause();
      } else {
        bgmManager.resume(true);
      }
      const next = { ...prev, musicEnabled: nextMusic };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const toggleCrtFilter = useCallback(() => {
    soundManager.playToggle(state.soundEnabled);
    setState(prev => {
      const next = { ...prev, crtFilterEnabled: !prev.crtFilterEnabled };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const resetGame = useCallback(() => {
    soundManager.playCancel(state.soundEnabled);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage', e);
    }
    setState(INITIAL_STATE);
    setHasSavedGame(false);
  }, [state.soundEnabled]);

  const solvePuzzle = useCallback((puzzleId: PuzzleId) => {
    soundManager.playGemstoneEarned(state.soundEnabled);
    setState(prev => {
      // Find the associated gemstone
      const gemstoneEntry = Object.values(GEMSTONES).find(g => g.earnedFromPuzzleId === puzzleId);
      const nextSolved = { ...prev.solvedPuzzles, [puzzleId]: true };
      const nextGems = { ...prev.collectedGemstones };
      if (gemstoneEntry) {
        nextGems[gemstoneEntry.id] = true;
      }

      const next: GameState = {
        ...prev,
        solvedPuzzles: nextSolved,
        collectedGemstones: nextGems,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const socketGemstone = useCallback((mechanismId: MechanismId, gemstoneId: GemstoneId) => {
    soundManager.playSnapKeystone(state.soundEnabled);
    setState(prev => {
      const currentList = prev.socketedGemstones[mechanismId] || [];
      if (currentList.includes(gemstoneId)) return prev;

      const nextList = [...currentList, gemstoneId];
      const nextSockets = {
        ...prev.socketedGemstones,
        [mechanismId]: nextList,
      };

      // Check if all 4 required gemstones are now slotted
      const civ = Object.values(CIVILIZATIONS).find(c => c.mechanism.id === mechanismId);
      const isComplete = civ ? civ.mechanism.requiredGemstones.every(g => nextList.includes(g)) : false;

      let nextMechs = prev.unlockedMechanisms;
      let nextFrags = prev.recoveredFragments;
      let nextUnlockedCivs = prev.unlockedCivs;

      if (isComplete && !prev.unlockedMechanisms[mechanismId]) {
        soundManager.playGateOpen(state.soundEnabled);
        nextMechs = { ...prev.unlockedMechanisms, [mechanismId]: true };
        if (civ) {
          nextFrags = { ...prev.recoveredFragments, [civ.fragmentId]: true };
        }

        // Progression unlocks
        nextUnlockedCivs = {
          india: true,
          japan: Boolean(nextMechs.india_mechanism || nextFrags.fragment_solar_wheel),
          egypt: Boolean(nextMechs.japan_mechanism || nextFrags.fragment_celestial_mirror),
        };
      }

      const next: GameState = {
        ...prev,
        socketedGemstones: nextSockets,
        unlockedMechanisms: nextMechs,
        recoveredFragments: nextFrags,
        unlockedCivs: nextUnlockedCivs,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const unlockMechanism = useCallback((mechanismId: MechanismId) => {
    soundManager.playSolve(state.soundEnabled);
    setState(prev => {
      const civ = Object.values(CIVILIZATIONS).find(c => c.mechanism.id === mechanismId);
      const nextMechs = { ...prev.unlockedMechanisms, [mechanismId]: true };
      let nextFrags = prev.recoveredFragments;
      if (civ) {
        nextFrags = { ...prev.recoveredFragments, [civ.fragmentId]: true };
      }

      const nextUnlockedCivs = {
        india: true,
        japan: Boolean(nextMechs.india_mechanism || nextFrags.fragment_solar_wheel),
        egypt: Boolean(nextMechs.japan_mechanism || nextFrags.fragment_celestial_mirror),
      };

      const allRecovered = Object.values(nextFrags).every(Boolean);

      const next: GameState = {
        ...prev,
        unlockedCivs: nextUnlockedCivs,
        unlockedMechanisms: nextMechs,
        recoveredFragments: nextFrags,
        currentScreen: allRecovered ? 'ASSEMBLY' : prev.currentScreen,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const assembleFinalArtifact = useCallback(() => {
    soundManager.playSolve(state.soundEnabled);
    setState(prev => {
      const next: GameState = {
        ...prev,
        artifactAssembled: true,
        gameCompleted: true,
        currentScreen: 'COMPLETION',
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  return (
    <GameContext.Provider
      value={{
        state,
        hasSavedGame,
        startAdventure,
        continueAdventure,
        goToScreen,
        selectCivilization,
        returnToWorldMap,
        returnToTitle,
        openChamber,
        openMechanism,
        toggleSound,
        toggleMusic,
        toggleCrtFilter,
        resetGame,
        solvePuzzle,
        socketGemstone,
        unlockMechanism,
        assembleFinalArtifact,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
