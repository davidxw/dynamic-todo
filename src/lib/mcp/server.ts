/**
 * MCP Server Implementation
 *
 * Implements the Model Context Protocol server for UI component discovery
 * and manipulation. Uses HTTP transport with SSE for server-to-client
 * and POST for client-to-server communication.
 */

import type {
  UITree,
  ComponentDetails,
  ModifyUIParams,
  ModifyUIResult,
  ValidateTreeParams,
} from '@/types';
import {
  modifyUI,
  validateTree,
  getCurrentTree,
  getComponentDetails,
} from './tools';
import type { ValidationResult } from './tools';
import { getAllComponents } from './components';

// MCP Protocol Types
export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: {
    suggestion?: string;
  };
}

export interface MCPNotification {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
}

// MCP Error Codes
export const MCP_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  COMPONENT_NOT_FOUND: -32000,
  INVALID_TREE: -32001,
  VERSION_CONFLICT: -32002,
} as const;

// Tool definitions for MCP protocol
export const MCP_TOOLS = [
  {
    name: 'get_current_tree',
    description: 'Get the current UI tree for a user',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID to get the tree for',
        },
      },
      required: ['userId'],
    },
  },
  {
    name: 'get_component_details',
    description:
      'Get detailed information about a specific UI component including props and examples',
    inputSchema: {
      type: 'object' as const,
      properties: {
        componentName: {
          type: 'string',
          description: 'The name of the component (e.g., TaskItem, Container)',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'validate_tree',
    description: 'Validate a UI tree structure before applying changes',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tree: {
          type: 'object',
          description: 'The UI tree to validate',
        },
      },
      required: ['tree'],
    },
  },
  {
    name: 'modify_ui',
    description:
      'Modify the UI tree for a user by applying add, remove, update, or replace operations',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: {
          type: 'string',
          description: 'Target user ID',
        },
        operation: {
          type: 'string',
          enum: ['add', 'remove', 'update', 'replace'],
          description: 'The operation to perform',
        },
        path: {
          type: 'string',
          description:
            'JSONPath to the target location (e.g., $.children[0], $.children[1].props)',
        },
        component: {
          type: 'object',
          description: 'The component tree to add or replace (for add/replace operations)',
        },
        props: {
          type: 'object',
          description: 'Props to update (for update operation)',
        },
      },
      required: ['userId', 'operation', 'path'],
    },
  },
];

// Resource definitions for MCP protocol
export const MCP_RESOURCES = [
  {
    uri: 'components://registry',
    name: 'Component Registry',
    description: 'List of all available UI components',
    mimeType: 'application/json',
  },
];

/**
 * MCP Server class that handles requests and manages state
 */
export class MCPServer {
  private sseClients: Map<string, (event: MCPNotification) => void> = new Map();

  /**
   * Handle an MCP request
   */
  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    const { id, method, params } = request;

    try {
      let result: unknown;

      switch (method) {
        case 'initialize':
          result = this.handleInitialize();
          break;

        case 'tools/list':
          result = { tools: MCP_TOOLS };
          break;

        case 'resources/list':
          result = { resources: MCP_RESOURCES };
          break;

        case 'resources/read':
          result = await this.handleResourceRead(params as { uri: string });
          break;

        case 'tools/call':
          result = await this.handleToolCall(
            params as { name: string; arguments: Record<string, unknown> },
          );
          break;

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: MCP_ERROR_CODES.METHOD_NOT_FOUND,
              message: `Method not found: ${method}`,
            },
          };
      }

      return { jsonrpc: '2.0', id, result };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: this.errorToMCPError(error),
      };
    }
  }

  /**
   * Handle initialize request
   */
  private handleInitialize() {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo: {
        name: 'dynamic-todo-mcp',
        version: '1.0.0',
      },
    };
  }

  /**
   * Handle resource read request
   */
  private async handleResourceRead(params: { uri: string }) {
    const { uri } = params;

    if (uri === 'components://registry') {
      const components = getAllComponents();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ components }, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  }

  /**
   * Handle tool call request
   */
  private async handleToolCall(params: {
    name: string;
    arguments: Record<string, unknown>;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    const { name, arguments: args } = params;

    let result: UITree | ComponentDetails | ValidationResult | ModifyUIResult;

    switch (name) {
      case 'get_current_tree':
        result = await getCurrentTree(args as unknown as { userId: string });
        break;

      case 'get_component_details':
        result = getComponentDetails(args as unknown as { componentName: string });
        break;

      case 'validate_tree':
        result = validateTree(args as unknown as ValidateTreeParams);
        break;

      case 'modify_ui':
        result = await modifyUI(args as unknown as ModifyUIParams);
        // Notify SSE clients of the change
        this.notifyClients({
          jsonrpc: '2.0',
          method: 'ui/changed',
          params: { userId: (args as unknown as ModifyUIParams).userId, result },
        });
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * Register an SSE client for notifications
   */
  registerSSEClient(
    clientId: string,
    callback: (event: MCPNotification) => void,
  ): void {
    this.sseClients.set(clientId, callback);
  }

  /**
   * Unregister an SSE client
   */
  unregisterSSEClient(clientId: string): void {
    this.sseClients.delete(clientId);
  }

  /**
   * Notify all SSE clients of an event
   */
  private notifyClients(notification: MCPNotification): void {
    for (const callback of this.sseClients.values()) {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error notifying SSE client:', error);
      }
    }
  }

  /**
   * Convert an error to MCP error format
   */
  private errorToMCPError(error: unknown): MCPError {
    if (error instanceof Error) {
      // Check for specific error types
      if (error.name === 'NotFoundError') {
        return {
          code: MCP_ERROR_CODES.COMPONENT_NOT_FOUND,
          message: error.message,
        };
      }
      if (error.name === 'ValidationError') {
        return {
          code: MCP_ERROR_CODES.INVALID_PARAMS,
          message: error.message,
        };
      }
      if (error.name === 'VersionConflictError') {
        return {
          code: MCP_ERROR_CODES.VERSION_CONFLICT,
          message: error.message,
        };
      }

      return {
        code: MCP_ERROR_CODES.INTERNAL_ERROR,
        message: error.message,
      };
    }

    return {
      code: MCP_ERROR_CODES.INTERNAL_ERROR,
      message: 'Unknown error',
    };
  }
}

// Singleton server instance
let serverInstance: MCPServer | null = null;

/**
 * Get the MCP server instance
 */
export function getMCPServer(): MCPServer {
  if (!serverInstance) {
    serverInstance = new MCPServer();
  }
  return serverInstance;
}
