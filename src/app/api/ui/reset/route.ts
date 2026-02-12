/**
 * UI Reset API
 *
 * POST: Reset UI state to default for a user
 */

import { NextRequest, NextResponse } from 'next/server';
import { resetUserState } from '@/lib/storage/userState';

/**
 * POST /api/ui/reset
 * Reset UI state to default
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    const newState = await resetUserState(userId);

    return NextResponse.json(newState);
  } catch (error) {
    console.error('Error resetting UI state:', error);
    return NextResponse.json(
      { error: 'Failed to reset UI state' },
      { status: 500 },
    );
  }
}
