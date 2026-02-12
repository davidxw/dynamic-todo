/**
 * UI State Management with Zustand
 *
 * Manages the dynamic UI tree state for rendering.
 */

import { create } from 'zustand';
import type { UIState, UITree } from '@/types';

interface UIStoreState {
  uiState: UIState | null;
  isLoading: boolean;
  error: string | null;
  fetchUIState: (userId: string) => Promise<void>;
  updateUITree: (tree: UITree) => Promise<void>;
  resetUIState: (userId: string) => Promise<void>;
  setUIState: (state: UIState) => void;
  clearError: () => void;
}

export const useUIStore = create<UIStoreState>((set, get) => ({
  uiState: null,
  isLoading: false,
  error: null,

  fetchUIState: async (userId) => {
    console.log('[UIStore] Fetching UI state for user:', userId);
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/ui/state?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          // User not found, use default structure
          set({
            uiState: getDefaultUIState(userId),
            isLoading: false,
          });
          return;
        }
        throw new Error(`Failed to fetch UI state: ${response.statusText}`);
      }

      const state: UIState = await response.json();
      console.log('[UIStore] Received UI state, version:', state.version, 'tree:', state.tree?.component);
      set({ uiState: state, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  updateUITree: async (tree) => {
    const { uiState } = get();
    if (!uiState) {
      set({ error: 'No UI state to update' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/ui/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: uiState.userId,
          version: uiState.version,
          tree,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          // Version conflict - refetch and retry
          const { fetchUIState } = get();
          await fetchUIState(uiState.userId);
          set({ error: 'State was modified. Please try again.' });
          return;
        }
        throw new Error(`Failed to update UI state: ${response.statusText}`);
      }

      const newState: UIState = await response.json();
      set({ uiState: newState, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  resetUIState: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/ui/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reset UI state: ${response.statusText}`);
      }

      const newState: UIState = await response.json();
      set({ uiState: newState, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  setUIState: (state) => {
    set({ uiState: state });
  },

  clearError: () => {
    set({ error: null });
  },
}));

/**
 * Default UI state structure
 */
function getDefaultUIState(userId: string): UIState {
  return {
    version: 1,
    userId,
    tree: {
      component: 'TodoApp',
      props: { title: 'My Tasks' },
      children: [
        { component: 'TaskInput' },
        { component: 'TaskList' },
      ],
    },
    lastModified: new Date().toISOString(),
  };
}
