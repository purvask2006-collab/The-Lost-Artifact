import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  GameScreen, 
  CivilizationId, 
  PuzzleId, 
  MechanismId, 
  FragmentId, 
  GameState 
} from '../types/game';
import { CIVILIZATIONS } from '../data/gameData';
import { soundManager } from '../utils/audio';

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
  toggleCrtFilter: () => void;
  resetGame: () => void;
  solvePuzzle: (puzzleId: PuzzleId) => void;
  unlockMechanism: (mechanismId: MechanismId) => void;
  assembleFinalArtifact: () => void;
}

const STORAGE_KEY = 'the_lost_artifact_save_v1';

const INITIAL_STATE: GameState = {
  currentScreen: 'TITLE',
  selectedCiv: null,
  activePuzzleId: null,
  activeMechanismId: null,

  unlockedCivs: {
    india: true,
    japan: false, // Unlocks after India's Chakra mechanism is activated
    egypt: false, // Unlocks after Japan's shrine mechanism is activated
  },
  solvedPuzzles: {
    india_puzzle_1: false,
    india_puzzle_2: false,
    japan_puzzle_1: false,
    japan_puzzle_2: false,
    egypt_puzzle_1: false,
    egypt_puzzle_2: false,
  },
  collectedRewards: {},
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
  crtFilterEnabled: true,

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
        return {
          ...INITIAL_STATE,
          ...parsed,
          unlockedCivs: {
            india: true,
            japan: Boolean(mechs.india_mechanism),
            egypt: Boolean(mechs.japan_mechanism),
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

  // Save progress helper
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

  // Update playtime tick
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
          ...parsed,
          currentScreen: 'WORLD_MAP',
        });
        return;
      }
    } catch (e) {
      console.warn('Failed to load continue state', e);
    }
    // Fallback if no valid save
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
      console.warn('Failed to clear local storage', e);
    }
    setState(INITIAL_STATE);
    setHasSavedGame(false);
  }, [state.soundEnabled]);

  const solvePuzzle = useCallback((puzzleId: PuzzleId) => {
    soundManager.playSolve(state.soundEnabled);
    setState(prev => {
      const civ = CIVILIZATIONS[prev.selectedCiv || 'india'];
      const pInfo = civ.puzzles.find(p => p.id === puzzleId);
      const nextSolved = { ...prev.solvedPuzzles, [puzzleId]: true };
      const nextRewards = { ...prev.collectedRewards };
      if (pInfo) {
        nextRewards[pInfo.reward.id] = true;
      }
      const next: GameState = {
        ...prev,
        solvedPuzzles: nextSolved,
        collectedRewards: nextRewards,
      };
      persistState(next);
      return next;
    });
  }, [state.soundEnabled, persistState]);

  const unlockMechanism = useCallback((mechanismId: MechanismId) => {
    soundManager.playSolve(state.soundEnabled);
    setState(prev => {
      const civ = CIVILIZATIONS[prev.selectedCiv || 'india'];
      const fragId = civ.fragmentId;
      const nextMechs = { ...prev.unlockedMechanisms, [mechanismId]: true };
      const nextFrags = { ...prev.recoveredFragments, [fragId]: true };

      const nextUnlockedCivs = {
        india: true,
        japan: Boolean(nextMechs.india_mechanism),
        egypt: Boolean(nextMechs.japan_mechanism),
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
        toggleCrtFilter,
        resetGame,
        solvePuzzle,
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
