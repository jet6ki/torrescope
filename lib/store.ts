import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProcessedGenome } from '@/types/torre';

interface CompareState {
  compareUsername: string | null;
  compareData: ProcessedGenome | null;
  setCompareUsername: (username: string | null) => void;
  setCompareData: (data: ProcessedGenome | null) => void;
  clearComparison: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      compareUsername: null,
      compareData: null,
      setCompareUsername: (username) => set({ compareUsername: username }),
      setCompareData: (data) => set({ compareData: data }),
      clearComparison: () => set({ compareUsername: null, compareData: null }),
    }),
    {
      name: 'torre-radar-compare',
      partialize: (state) => ({
        compareData: state.compareData,
      }),
    }
  )
);

interface AppState {
  recentSearches: string[];
  addRecentSearch: (username: string) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (username) => {
        const current = get().recentSearches;
        const filtered = current.filter((u) => u !== username);
        const updated = [username, ...filtered].slice(0, 5);
        set({ recentSearches: updated });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'torre-radar-app',
    }
  )
);