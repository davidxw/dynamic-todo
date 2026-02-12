'use client';

/**
 * ChatMessage Component
 *
 * Displays a single chat message with optional reasoning steps and tool calls.
 */

import type { ChatMessage as ChatMessageType } from '@/types';
import { ReasoningDisplay } from './ReasoningDisplay';
import { ToolCallDisplay } from './ToolCallDisplay';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap">{message.content}</div>

        {/* Reasoning steps for assistant messages */}
        {isAssistant && message.reasoning && message.reasoning.length > 0 && (
          <ReasoningDisplay steps={message.reasoning} />
        )}

        {/* Tool calls for assistant messages */}
        {isAssistant && message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.toolCalls.map((toolCall, index) => (
              <ToolCallDisplay key={index} toolCall={toolCall} />
            ))}
          </div>
        )}

        {/* Change summary */}
        {isAssistant && message.changeSummary && (
          <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm text-green-800 dark:text-green-200">
            <span className="font-medium">Changes applied: </span>
            {message.changeSummary}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
