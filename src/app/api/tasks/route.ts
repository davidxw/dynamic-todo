/**
 * Tasks API - GET (list) and POST (create) endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { listTasks, createTask } from '@/lib/services/taskService';
import { formatErrorResponse, getErrorStatusCode, logger } from '@/lib/errorHandling';
import type { TaskFilter, TaskSortField, SortOrder } from '@/types/task';

/**
 * GET /api/tasks - List all tasks for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const filter = (searchParams.get('filter') as TaskFilter) || 'all';
    const sortBy = (searchParams.get('sortBy') as TaskSortField) || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

    const result = await listTasks({ userId, filter, sortBy, sortOrder });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Failed to list tasks', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: getErrorStatusCode(error) }
    );
  }
}

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, metadata } = body;

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { message: 'title is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const task = await createTask({ userId, title, metadata });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    logger.error('Failed to create task', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: getErrorStatusCode(error) }
    );
  }
}
