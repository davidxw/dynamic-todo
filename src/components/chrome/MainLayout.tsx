'use client';

/**
 * MainLayout Component
 *
 * Client-side wrapper that provides chat panel toggle and reset functionality.
 */

import { useState } from 'react';
import { AppHeader } from '@/components/chrome';
import { ChatPanel } from '@/components/chat';
import { useUIStore } from '@/lib/stores/uiStore';
import { useUserStore } from '@/lib/stores/userStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useUserStore();
  const { resetUIState, uiState, fetchUIState } = useUIStore();

  const currentUserId = currentUser?.id || 'default';

  const handleReset = async () => {
    await resetUIState(currentUserId);
  };

  const handleUserChange = (userId: string) => {
    // When user changes, close the chat to reset context
    setIsChatOpen(false);
    // User store already handles the switch
  };

  // ===== TEMPORARY TEST BUTTON - REMOVE AFTER TESTING =====
  const handleTestUIChange = async () => {
    console.log('[TEST] Starting test UI modification...');
    console.log('[TEST] Current UI state:', uiState);
    
    try {
      // Make a simple API call to modify the UI
      const response = await fetch('/api/ui/test-modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
      
      if (!response.ok) {
        console.error('[TEST] API call failed:', response.statusText);
        return;
      }
      
      const result = await response.json();
      console.log('[TEST] API response:', result);
      
      // Refresh UI state
      console.log('[TEST] Refreshing UI state...');
      await fetchUIState(currentUserId);
      console.log('[TEST] UI state refreshed');
    } catch (error) {
      console.error('[TEST] Error:', error);
    }
  };
  // ===== END TEMPORARY TEST BUTTON =====

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        showChatToggle
        isChatOpen={isChatOpen}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        showResetButton
        onReset={handleReset}
        showUserSwitcher
        onUserChange={handleUserChange}
        // TEMPORARY: Add test button
        showTestButton
        onTest={handleTestUIChange}
      />
      <div className="flex-1 flex">
        <main className={`flex-1 ${isChatOpen ? 'pr-0' : ''}`}>
          {children}
        </main>
        {isChatOpen && (
          <aside className="w-96 flex-shrink-0 h-[calc(100vh-64px)]">
            <ChatPanel userId={currentUserId} onClose={() => setIsChatOpen(false)} />
          </aside>
        )}
      </div>
    </div>
  );
}
