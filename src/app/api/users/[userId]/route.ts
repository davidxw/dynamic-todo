/**
 * User Detail API
 *
 * GET: Get a specific user by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/storage/userState';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/users/[userId]
 * Get a specific user
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;
    const user = await getUser(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 },
    );
  }
}
