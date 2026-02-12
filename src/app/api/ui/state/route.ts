/**
 * UI State API
 *
 * GET: Get current UI state for a user
 * PUT: Update UI state with optimistic locking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserUIState, saveUserUIState } from '@/lib/storage/userState';
import type { UIState, UpdateUIStateInput } from '@/types';

// Disable Next.js caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/ui/state?userId=default
 * Get the current UI state for a user
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';

  try {
    const state = await getUserUIState(userId);

    if (!state) {
      return NextResponse.json(
        { error: 'User state not found' },
        { status: 404 },
      );
    }

    // Prevent caching to ensure UI updates are immediately visible
    return NextResponse.json(state, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error getting UI state:', error);
    return NextResponse.json(
      { error: 'Failed to get UI state' },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/ui/state
 * Update UI state with optimistic locking
 */
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateUIStateInput = await request.json();
    const { userId, version, tree } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    if (typeof version !== 'number') {
      return NextResponse.json(
        { error: 'version is required and must be a number' },
        { status: 400 },
      );
    }

    if (!tree || !tree.component) {
      return NextResponse.json(
        { error: 'tree is required and must have a component' },
        { status: 400 },
      );
    }

    // Get current state for version check
    const currentState = await getUserUIState(userId);

    if (!currentState) {
      return NextResponse.json(
        { error: 'User state not found' },
        { status: 404 },
      );
    }

    // Optimistic locking: check version
    if (currentState.version !== version) {
      return NextResponse.json(
        {
          error: 'Version conflict',
          currentVersion: currentState.version,
          providedVersion: version,
        },
        { status: 409 },
      );
    }

    // Create new state with incremented version
    const newState: UIState = {
      version: version + 1,
      userId,
      tree,
      lastModified: new Date().toISOString(),
    };

    await saveUserUIState(userId, newState);

    return NextResponse.json(newState);
  } catch (error) {
    console.error('Error updating UI state:', error);
    return NextResponse.json(
      { error: 'Failed to update UI state' },
      { status: 500 },
    );
  }
}
