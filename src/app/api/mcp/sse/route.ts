/**
 * MCP SSE Endpoint
 *
 * Server-Sent Events endpoint for MCP server-to-client communication.
 */

import { NextRequest } from 'next/server';
import { getMCPServer } from '@/lib/mcp/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = request.headers.get('x-client-id') || crypto.randomUUID();
  const server = getMCPServer();

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const connectMessage = `data: ${JSON.stringify({
        jsonrpc: '2.0',
        method: 'connection/established',
        params: { clientId },
      })}\n\n`;
      controller.enqueue(encoder.encode(connectMessage));

      // Register for notifications
      const callback = (notification: unknown) => {
        const message = `data: ${JSON.stringify(notification)}\n\n`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch {
          // Stream closed, ignore
        }
      };

      server.registerSSEClient(clientId, callback);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        server.unregisterSSEClient(clientId);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });

      // Send periodic keep-alive
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch {
          clearInterval(keepAlive);
          server.unregisterSSEClient(clientId);
        }
      }, 30000);

      // Cleanup on abort
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Client-ID': clientId,
    },
  });
}
