/**
 * Chat types - Messages, reasoning steps, and tool calls for the chat interface
 */

export interface ReasoningStep {
  /** Step order */
  step: number;
  /** Reasoning explanation */
  text: string;
}

export interface ToolCall {
  /** Tool name from MCP */
  tool: string;
  /** Arguments passed */
  args: Record<string, unknown>;
  /** Tool return value */
  result: unknown;
}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  /** Unique message ID */
  id: string;
  /** Message sender role */
  role: ChatRole;
  /** Message text content */
  content: string;
  /** When message was sent (ISO 8601) */
  timestamp: string;
  /** AI reasoning steps (assistant only) */
  reasoning?: ReasoningStep[];
  /** MCP tool calls made (assistant only) */
  toolCalls?: ToolCall[];
  /** Summary of UI changes (assistant only) */
  changeSummary?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageInput {
  content: string;
  userId: string;
}
