/**
 * Task by ID API - GET, PATCH, DELETE endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTask, updateTask, deleteTask } from '@/lib/services/taskService';
import { formatErrorResponse, getErrorStatusCode, logger } from '@/lib/errorHandling';

interface RouteParams {
  params: Promise<{ taskId: string }>;
}

/**
 * GET /api/tasks/[taskId] - Get a single task
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = await params;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const task = await getTask(userId, taskId);

    return NextResponse.json(task);
  } catch (error) {
    logger.error('Failed to get task', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: getErrorStatusCode(error) }
    );
  }
}

/**
 * PATCH /api/tasks/[taskId] - Update a task
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const { userId, title, completed, metadata } = body;

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const task = await updateTask(userId, taskId, { title, completed, metadata });

    return NextResponse.json(task);
  } catch (error) {
    logger.error('Failed to update task', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: getErrorStatusCode(error) }
    );
  }
}

/**
 * DELETE /api/tasks/[taskId] - Delete a task
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = await params;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    await deleteTask(userId, taskId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error('Failed to delete task', error);
    return NextResponse.json(
      formatErrorResponse(error),
      { status: getErrorStatusCode(error) }
    );
  }
}
