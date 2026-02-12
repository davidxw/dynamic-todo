'use client';

/**
 * AppHeader - Application header with theme toggle
 */

import React from 'react';
import { useTheme, Button } from '@/components/ui';
import { ResetButton } from './ResetButton';
import { UserSwitcher } from './UserSwitcher';

interface AppHeaderProps {
  showChatToggle?: boolean;
  onChatToggle?: () => void;
  isChatOpen?: boolean;
  showResetButton?: boolean;
  onReset?: () => Promise<void>;
  showUserSwitcher?: boolean;
  onUserChange?: (userId: string) => void;
}

export function AppHeader({
  showChatToggle = false,
  onChatToggle,
  isChatOpen = false,
  showResetButton = false,
  onReset,
  showUserSwitcher = false,
  onUserChange,
}: AppHeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Dynamic Todo
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Switcher */}
            {showUserSwitcher && (
              <UserSwitcher onUserChange={onUserChange} />
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {resolvedTheme === 'light' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Button>

            {/* Reset Button */}
            {showResetButton && onReset && (
              <ResetButton onReset={onReset} />
            )}

            {/* Chat Toggle */}
            {showChatToggle && (
              <Button
                variant={isChatOpen ? 'primary' : 'ghost'}
                size="sm"
                onClick={onChatToggle}
                aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 hidden sm:inline">Chat</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
