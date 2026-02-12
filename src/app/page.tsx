'use client';

import { useEffect } from 'react';
import { DynamicRenderer } from '@/components/ui';
import { TodoApp } from '@/components/todo';
import { useUIStore } from '@/lib/stores/uiStore';
import { useUserStore } from '@/lib/stores/userStore';
import { DEFAULT_USER_ID } from '@/constants';

export default function Home() {
  const { uiState, isLoading, fetchUIState } = useUIStore();
  const { currentUser } = useUserStore();
  
  const userId = currentUser?.id || DEFAULT_USER_ID;

  // Debug: Log UI state changes
  useEffect(() => {
    console.log('[Page] UI state changed:', uiState?.version, uiState?.tree?.component);
  }, [uiState]);

  // Fetch UI state on mount and when user changes
  useEffect(() => {
    fetchUIState(userId);
  }, [userId, fetchUIState]);

  // Show loading state
  if (isLoading && !uiState) {
    return (
      <div className="py-8 px-4 flex justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // If we have a UI tree, render it dynamically
  if (uiState?.tree) {
    return (
      <div className="py-8 px-4">
        <DynamicRenderer 
          tree={uiState.tree} 
          runtimeProps={{ userId }}
        />
      </div>
    );
  }

  // Fallback to static TodoApp if no UI state
  return (
    <div className="py-8 px-4">
      <TodoApp userId={userId} />
    </div>
  );
}
