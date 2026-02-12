/**
 * MCP API Endpoint
 *
 * Handles MCP JSON-RPC requests for tool invocations and resource reads.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMCPServer, type MCPRequest } from '@/lib/mcp/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate JSON-RPC request
    if (!body.jsonrpc || body.jsonrpc !== '2.0') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: body.id ?? null,
          error: {
            code: -32600,
            message: 'Invalid JSON-RPC request',
          },
        },
        { status: 400 },
      );
    }

    if (!body.method || typeof body.method !== 'string') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: body.id ?? null,
          error: {
            code: -32600,
            message: 'Method is required',
          },
        },
        { status: 400 },
      );
    }

    const mcpRequest: MCPRequest = {
      jsonrpc: '2.0',
      id: body.id ?? 1,
      method: body.method,
      params: body.params,
    };

    const server = getMCPServer();
    const response = await server.handleRequest(mcpRequest);

    // Return appropriate status based on error
    const status = response.error ? getErrorStatus(response.error.code) : 200;

    return NextResponse.json(response, { status });
  } catch (error) {
    console.error('MCP request error:', error);

    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error',
        },
      },
      { status: 400 },
    );
  }
}

/**
 * Map MCP error codes to HTTP status codes
 */
function getErrorStatus(code: number): number {
  switch (code) {
    case -32700: // Parse error
    case -32600: // Invalid request
    case -32602: // Invalid params
      return 400;
    case -32601: // Method not found
      return 404;
    case -32000: // Component not found
      return 404;
    case -32001: // Invalid tree
      return 422;
    case -32002: // Version conflict
      return 409;
    default:
      return 500;
  }
}
