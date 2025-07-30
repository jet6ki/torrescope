'use client';

import { useState, useCallback } from 'react';

export type AppView = 'search' | 'profile';

interface AppState {
  view: AppView;
  selectedUsername: string | null;
  isInitialLoad: boolean;
}

export function useAppState() {
  const [state, setState] = useState<AppState>({
    view: 'search',
    selectedUsername: null,
    isInitialLoad: true,
  });

  const showSearch = useCallback((isReset = false) => {
    setState(prev => ({
      ...prev,
      view: 'search',
      selectedUsername: null,
      isInitialLoad: isReset, 
    }));
  }, []);

  const showProfile = useCallback((username: string) => {
    setState(prev => ({
      ...prev,
      view: 'profile',
      selectedUsername: username,
      isInitialLoad: false,
    }));
  }, []);

  const markAnimationComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      isInitialLoad: false,
    }));
  }, []);

  return {
    ...state,
    showSearch,
    showProfile,
    markAnimationComplete,
  };
}
