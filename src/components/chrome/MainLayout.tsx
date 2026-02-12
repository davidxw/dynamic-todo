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
  const { resetUIState } = useUIStore();

  const currentUserId = currentUser?.id || 'default';

  const handleReset = async () => {
    await resetUIState(currentUserId);
  };

  const handleUserChange = (userId: string) => {
    // When user changes, close the chat to reset context
    setIsChatOpen(false);
    // User store already handles the switch
  };

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
