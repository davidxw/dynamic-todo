/**
 * Chat State Management with Zustand
 *
 * Manages chat messages, loading state, and AI interactions.
 * Messages are persisted to localStorage per user.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ReasoningStep, ToolCall } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useUIStore } from './uiStore';

interface ChatState {
  messages: ChatMessage[];
  currentUserId: string | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (userId: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateLastAssistantMessage: (updates: Partial<ChatMessage>) => void;
  sendMessage: (content: string, userId: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
  messages: [],
  currentUserId: null,
  isLoading: false,
  error: null,

  setCurrentUser: (userId) => {
    const { currentUserId } = get();
    if (currentUserId !== userId) {
      set({ currentUserId: userId });
    }
  },

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  updateLastAssistantMessage: (updates) => {
    set((state) => {
      const messages = [...state.messages];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') {
          messages[i] = { ...messages[i], ...updates };
          break;
        }
      }
      return { messages };
    });
  },

  sendMessage: async (content, userId) => {
    const { addMessage, updateLastAssistantMessage } = get();

    // Add user message
    addMessage({ role: 'user', content });

    // Set loading state
    set({ isLoading: true, error: null });

    try {
      // Call chat API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      // Add initial assistant message
      addMessage({ role: 'assistant', content: '' });

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      const reasoning: ReasoningStep[] = [];
      const toolCalls: ToolCall[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const event = JSON.parse(data);

            switch (event.type) {
              case 'text':
                accumulatedContent += event.text;
                updateLastAssistantMessage({ content: accumulatedContent });
                break;

              case 'reasoning':
                reasoning.push(event.step);
                updateLastAssistantMessage({ reasoning: [...reasoning] });
                break;

              case 'tool_call':
                toolCalls.push(event.toolCall);
                updateLastAssistantMessage({ toolCalls: [...toolCalls] });
                // Refresh UI state after each tool call to show changes in real-time
                console.log('[ChatStore] Tool call received, refreshing UI state for user:', userId);
                try {
                  await useUIStore.getState().fetchUIState(userId);
                  console.log('[ChatStore] UI state refreshed successfully');
                } catch (err) {
                  console.error('[ChatStore] Failed to refresh UI state:', err);
                }
                break;

              case 'summary':
                updateLastAssistantMessage({ changeSummary: event.summary });
                break;

              case 'error':
                set({ error: event.message });
                break;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message });

      // Add error message to chat
      addMessage({
        role: 'assistant',
        content: `I encountered an error: ${message}. Please try again.`,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },
    }),
    {
      name: 'dynamic-todo-chat',
      partialize: (state) => ({
        messages: state.messages,
        currentUserId: state.currentUserId,
      }),
    }
  )
);
