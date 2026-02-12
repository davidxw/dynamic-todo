/**
 * Bulk Task Operations API
 */

import { NextRequest, NextResponse } from 'next/server';
import { bulkTaskOperation } from '@/lib/services/taskService';
import { formatErrorResponse, getErrorStatusCode, logger } from '@/lib/errorHandling';
import type { BulkOperation } from '@/types/task';

/**
 * POST /api/tasks/bulk - Perform bulk operations on tasks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, operation, taskIds, metadata } = body;

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!operation) {
      return NextResponse.json(
        { message: 'operation is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const validOperations: BulkOperation[] = ['complete', 'uncomplete', 'delete', 'updateMetadata'];
    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        {
          message: `Invalid operation. Must be one of: ${validOperations.join(', ')}`,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { message: 'taskIds must be a non-empty array', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const result = await bulkTaskOperation({ userId, operation, taskIds, metadata });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Failed to perform bulk operation', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: getErrorStatusCode(error) }
    );
  }
}
