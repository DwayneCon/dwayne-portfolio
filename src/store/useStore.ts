import { create } from 'zustand';

interface AppState {
  currentSection: string;
  isLoading: boolean;
  isDarkMode: boolean;
  commandPaletteOpen: boolean;
  terminalOpen: boolean;
  soundEnabled: boolean;
  konamiActivated: boolean;
  gameActive: boolean;
  selectedSkillCategory: string | null;
  visitedSections: string[];
  achievements: string[];
  setCurrentSection: (section: string) => void;
  setLoading: (loading: boolean) => void;
  toggleDarkMode: () => void;
  toggleCommandPalette: () => void;
  toggleTerminal: () => void;
  toggleSound: () => void;
  activateKonami: () => void;
  toggleGame: () => void;
  setSelectedSkillCategory: (category: string | null) => void;
  addVisitedSection: (section: string) => void;
  unlockAchievement: (achievement: string) => void;
}

const useStore = create<AppState>((set) => ({
  currentSection: 'hero',
  isLoading: true,
  isDarkMode: true,
  commandPaletteOpen: false,
  terminalOpen: false,
  soundEnabled: false,
  konamiActivated: false,
  gameActive: false,
  selectedSkillCategory: null,
  visitedSections: [],
  achievements: [],
  setCurrentSection: (section) => set({ currentSection: section }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  activateKonami: () => set({ konamiActivated: true }),
  toggleGame: () => set((state) => ({ gameActive: !state.gameActive })),
  setSelectedSkillCategory: (category) => set({ selectedSkillCategory: category }),
  addVisitedSection: (section) => set((state) => ({
    visitedSections: [...new Set([...state.visitedSections, section])]
  })),
  unlockAchievement: (achievement) => set((state) => ({
    achievements: [...new Set([...state.achievements, achievement])]
  })),
}));

export default useStore;