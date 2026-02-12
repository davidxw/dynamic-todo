/**
 * Chat API Endpoint
 *
 * Handles chat messages and streams AI responses with tool calls.
 */

import { NextRequest } from 'next/server';
import { createCopilotClient } from '@/lib/copilot/client';
import { getMCPServer, MCP_TOOLS } from '@/lib/mcp/server';
import type { SendMessageInput } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageInput = await request.json();
    const { content, userId } = body;

    if (!content || !userId) {
      return Response.json(
        { error: 'content and userId are required' },
        { status: 400 },
      );
    }

    // Create Copilot client
    const copilot = createCopilotClient();

    // Create encoder for SSE
    const encoder = new TextEncoder();

    // Create readable stream for response
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (type: string, data: Record<string, unknown>) => {
          const message = `data: ${JSON.stringify({ type, ...data })}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        try {
          // Convert MCP tools to Copilot tool format
          const copilotTools = MCP_TOOLS.map((tool) => ({
            name: tool.name,
            description: tool.description,
            input_schema: tool.inputSchema,
          }));

          const mcpServer = getMCPServer();
          let fullContent = '';
          let reasoningCount = 0;

          // Stream chat completion with tool calling
          const result = await copilot.streamCompletion({
            messages: [{ role: 'user', content }],
            tools: copilotTools,
            systemPrompt: getSystemPrompt(userId),
            onEvent: async (event) => {
              if (event.type === 'text' && event.text) {
                fullContent += event.text;
                sendEvent('text', { text: event.text });

                // Detect reasoning steps (lines starting with "Step" or numbered)
                const lines = event.text.split('\n');
                for (const line of lines) {
                  if (/^(?:Step\s*\d+[:.:]|^\d+\.)/.test(line.trim())) {
                    reasoningCount++;
                    sendEvent('reasoning', {
                      step: { step: reasoningCount, text: line.trim() },
                    });
                  }
                }
              } else if (event.type === 'tool_use' && event.toolCall) {
                // Execute tool and send result
                const toolResult = await mcpServer.handleRequest({
                  jsonrpc: '2.0',
                  id: event.toolCall.id,
                  method: 'tools/call',
                  params: {
                    name: event.toolCall.name,
                    arguments: event.toolCall.input,
                  },
                });

                sendEvent('tool_call', {
                  toolCall: {
                    tool: event.toolCall.name,
                    args: event.toolCall.input,
                    result: toolResult.result,
                  },
                });
              }
            },
          });

          // Send completion summary if there were tool calls
          if (result.toolCalls.length > 0) {
            sendEvent('summary', {
              summary: `Applied ${result.toolCalls.length} UI modification${result.toolCalls.length > 1 ? 's' : ''}`,
            });
          }

          // Signal end of stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('Chat error:', error);
          const message =
            error instanceof Error ? error.message : 'Unknown error';
          sendEvent('error', { message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat request error:', error);
    return Response.json(
      { error: 'Failed to process chat message' },
      { status: 500 },
    );
  }
}

function getSystemPrompt(userId: string): string {
  return `You are a helpful UI customization assistant for a Todo application.

Current user: ${userId}

Your role is to help users modify the Todo app's interface by:
1. Understanding what changes they want to make
2. Using the available MCP tools to inspect and modify the UI tree
3. Explaining your reasoning as you make changes

Available tools:
- get_current_tree: Get the current UI component tree for the user
- get_component_details: Get information about a specific component and its props
- validate_tree: Validate a UI tree structure before applying
- modify_ui: Apply changes to the UI tree (add, remove, update, replace operations)

When making changes:
1. First, examine the current tree to understand the structure
2. Identify which components need to be modified
3. Validate your proposed changes if complex
4. Apply the modifications
5. Summarize what was changed

Be conversational and explain what you're doing. If a request is unclear, ask for clarification.

Example modifications:
- "Add a priority dropdown" → Update TaskItem with showPriority: true
- "Show due dates" → Update TaskItem or TaskInput with showDueDate: true
- "Add a filter bar" → Add TaskFilter component to the tree`;
}
