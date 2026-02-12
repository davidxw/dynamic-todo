/**
 * Users API
 *
 * GET: List all available users
 */

import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/storage/userState';

/**
 * GET /api/users
 * List all available users
 */
export async function GET() {
  try {
    const users = await getUsers();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 },
    );
  }
}
