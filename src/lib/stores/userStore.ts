/**
 * User Store - Zustand store for current user state management
 */

import { create } from 'zustand';
import type { User } from '@/types';
import { fetchUsers } from '@/lib/services/userService';

interface UserStoreState {
  /** Currently selected user */
  currentUser: User | null;
  /** List of available users */
  users: User[];
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Fetch available users */
  fetchUsers: () => Promise<void>;
  /** Switch to a different user */
  switchUser: (userId: string) => Promise<void>;
  /** Clear any error */
  clearError: () => void;
}

const DEFAULT_USER: User = {
  id: 'default',
  displayName: 'Default User',
  isDefault: true,
};

export const useUserStore = create<UserStoreState>((set, get) => ({
  currentUser: DEFAULT_USER,
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const users = await fetchUsers();
      set({ users, isLoading: false });

      // Set default user if no current user
      const { currentUser } = get();
      if (!currentUser && users.length > 0) {
        set({ currentUser: users[0] });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      set({ error: message, isLoading: false });
    }
  },

  switchUser: async (userId) => {
    const { users, fetchUsers: loadUsers } = get();

    // Load users if not already loaded
    if (users.length === 0) {
      await loadUsers();
    }

    const { users: updatedUsers } = get();
    const user = updatedUsers.find((u) => u.id === userId);

    if (user) {
      set({ currentUser: user, error: null });
    } else {
      set({ error: `User ${userId} not found` });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
