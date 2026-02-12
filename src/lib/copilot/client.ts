/**
 * GitHub Copilot SDK client wrapper
 *
 * Provides streaming chat completions and tool calling for UI customization
 * using the official GitHub Copilot SDK.
 */

import { CopilotClient as SDKClient, defineTool } from '@github/copilot-sdk';

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CopilotTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface CopilotToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface CopilotStreamEvent {
  type: 'text' | 'tool_use' | 'end';
  text?: string;
  toolCall?: CopilotToolCall;
}

export interface ChatCompletionOptions {
  messages: CopilotMessage[];
  tools?: CopilotTool[];
  systemPrompt?: string;
  onEvent?: (event: CopilotStreamEvent) => void;
  toolHandler?: (name: string, input: Record<string, unknown>) => Promise<unknown>;
}

export interface ChatCompletionResult {
  content: string;
  toolCalls: CopilotToolCall[];
  stopReason: string;
}

// Singleton client instance
let sdkClient: SDKClient | null = null;

/**
 * Get GitHub token from environment variables (in priority order per SDK docs)
 * Returns undefined if no token is found, allowing SDK to fall back to signed-in user
 */
function getGitHubToken(): string | undefined {
  // Priority order as per SDK documentation:
  // 1. COPILOT_GITHUB_TOKEN - Recommended for explicit Copilot usage
  // 2. GH_TOKEN - GitHub CLI compatible
  // 3. GITHUB_TOKEN - GitHub Actions compatible
  return (
    process.env.COPILOT_GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_TOKEN ||
    undefined
  );
}

/**
 * Get or create the Copilot SDK client
 * 
 * Authentication priority:
 * 1. Environment variables (COPILOT_GITHUB_TOKEN, GH_TOKEN, GITHUB_TOKEN)
 * 2. GitHub signed-in user (from `copilot auth login`)
 */
async function getClient(): Promise<SDKClient> {
  if (!sdkClient) {
    const githubToken = getGitHubToken();
    
    // Build client options - only include githubToken if we have one
    // If no token is provided, SDK falls back to signed-in user auth
    const clientOptions: {
      autoStart: boolean;
      logLevel: 'none' | 'error' | 'warning' | 'info' | 'debug' | 'all';
      githubToken?: string;
      useLoggedInUser?: boolean;
    } = {
      autoStart: true,
      logLevel: 'warning',
    };

    if (githubToken) {
      // Use environment variable token
      clientOptions.githubToken = githubToken;
      clientOptions.useLoggedInUser = false;
      console.log('Copilot SDK: Using environment variable authentication');
    } else {
      // Fall back to signed-in user authentication
      clientOptions.useLoggedInUser = true;
      console.log('Copilot SDK: Using signed-in user authentication (copilot auth login)');
    }

    sdkClient = new SDKClient(clientOptions);
    await sdkClient.start();
  }
  return sdkClient;
}

/**
 * Create a Copilot client instance
 */
export function createCopilotClient() {
  return {
    /**
     * Stream chat completion with optional tool calling
     */
    async streamCompletion(
      options: ChatCompletionOptions,
    ): Promise<ChatCompletionResult> {
      const { messages, tools, systemPrompt, onEvent, toolHandler } = options;

      const result: ChatCompletionResult = {
        content: '',
        toolCalls: [],
        stopReason: 'end_turn',
      };

      try {
        const client = await getClient();

        // Convert tools to SDK format with handlers
        const sdkTools = tools?.map((tool) => {
          return defineTool(tool.name, {
            description: tool.description,
            // Pass raw JSON schema as Record<string, unknown>
            parameters: tool.input_schema as Record<string, unknown>,
            handler: async (input: Record<string, unknown>) => {
              const toolCall: CopilotToolCall = {
                id: `tool_${Date.now()}`,
                name: tool.name,
                input,
              };
              result.toolCalls.push(toolCall);
              onEvent?.({ type: 'tool_use', toolCall });
              
              if (toolHandler) {
                return await toolHandler(tool.name, input);
              }
              return { success: true };
            },
          });
        });

        // Create session with custom system message
        const session = await client.createSession({
          model: 'gpt-4o',
          streaming: true,
          systemMessage: systemPrompt ? {
            content: systemPrompt,
          } : undefined,
          tools: sdkTools,
        });

        // Set up streaming event handlers
        const done = new Promise<void>((resolve) => {
          session.on('assistant.message_delta', (event) => {
            const deltaContent = event.data.deltaContent;
            if (deltaContent) {
              result.content += deltaContent;
              onEvent?.({ type: 'text', text: deltaContent });
            }
          });

          session.on('session.idle', () => {
            onEvent?.({ type: 'end' });
            resolve();
          });
        });

        // Build the prompt from message history
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        if (lastUserMessage) {
          await session.send({ prompt: lastUserMessage.content });
        }

        await done;

        // Clean up session
        await session.destroy();

        result.stopReason = result.toolCalls.length > 0 ? 'tool_use' : 'end_turn';
      } catch (error) {
        console.error('Copilot stream error:', error);
        throw error;
      }

      return result;
    },

    /**
     * Non-streaming completion for simpler use cases
     */
    async completion(
      options: Omit<ChatCompletionOptions, 'onEvent'>,
    ): Promise<ChatCompletionResult> {
      return this.streamCompletion(options);
    },
  };
}

/**
 * Default system prompt for UI customization
 */
export function getDefaultSystemPrompt(): string {
  return `You are a helpful UI customization assistant for a Todo application.

Your role is to help users modify the Todo app's interface by:
1. Understanding what changes they want to make
2. Using the available MCP tools to inspect and modify the UI tree
3. Explaining your reasoning as you make changes

Available tools:
- get_current_tree: Get the current UI component tree for a user
- get_component_details: Get information about a specific component and its props
- validate_tree: Validate a UI tree structure before applying
- modify_ui: Apply changes to the UI tree (add, remove, update, replace operations)

When making changes:
1. First, examine the current tree to understand the structure
2. Identify which components need to be modified
3. Validate your proposed changes
4. Apply the modifications
5. Summarize what was changed

Be conversational and explain what you're doing. If a request is unclear, ask for clarification.`;
}

export type CopilotClientType = ReturnType<typeof createCopilotClient>;
