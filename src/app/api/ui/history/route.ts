/**
 * UI History API
 *
 * GET: Get change history for a user
 */

import { NextRequest, NextResponse } from 'next/server';
import { readJsonFile, getUserDataPath } from '@/lib/storage/fileUtils';
import type { ChangeHistoryResponse, ChangeLog } from '@/types';

/**
 * GET /api/ui/history?userId=default&limit=20
 * Get change history for a user
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'default';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const historyPath = getUserDataPath(userId, 'history.json');
    const history = await readJsonFile<ChangeLog[]>(historyPath);

    if (!history) {
      // Return empty history if file doesn't exist
      const response: ChangeHistoryResponse = {
        userId,
        changes: [],
        total: 0,
      };
      return NextResponse.json(response);
    }

    // Sort by timestamp descending and apply limit
    const sortedHistory = [...history]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);

    const response: ChangeHistoryResponse = {
      userId,
      changes: sortedHistory,
      total: history.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting UI history:', error);
    return NextResponse.json(
      { error: 'Failed to get UI history' },
      { status: 500 },
    );
  }
}
