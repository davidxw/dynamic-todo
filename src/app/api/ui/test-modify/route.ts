/**
 * TEMPORARY TEST ENDPOINT - Remove after testing
 * 
 * Makes a simple UI modification to test if dynamic rendering works.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserUIState, saveUserUIState } from '@/lib/storage/userState';
import type { UIState } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    console.log('[TEST API] Getting current state for user:', userId);
    const currentState = await getUserUIState(userId);

    if (!currentState) {
      return NextResponse.json({ error: 'User state not found' }, { status: 404 });
    }

    console.log('[TEST API] Current state version:', currentState.version);
    console.log('[TEST API] Current tree:', JSON.stringify(currentState.tree, null, 2));

    // Toggle a simple prop to test dynamic rendering
    const newTree = JSON.parse(JSON.stringify(currentState.tree));
    
    // Add or update a test badge/text to prove the UI changed
    const testTimestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    // Update the TodoApp props with a test marker
    if (!newTree.props) {
      newTree.props = {};
    }
    newTree.props.testMarker = `Test @ ${testTimestamp}`;
    newTree.props.showHeader = !newTree.props.showHeader; // Toggle header

    const newState: UIState = {
      version: currentState.version + 1,
      userId,
      tree: newTree,
      lastModified: new Date().toISOString(),
    };

    console.log('[TEST API] Saving new state version:', newState.version);
    console.log('[TEST API] New tree:', JSON.stringify(newTree, null, 2));

    await saveUserUIState(userId, newState);

    console.log('[TEST API] State saved successfully');

    return NextResponse.json({
      success: true,
      previousVersion: currentState.version,
      newVersion: newState.version,
      change: `Toggled showHeader to ${newTree.props.showHeader}, added testMarker: ${newTree.props.testMarker}`,
    });
  } catch (error) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
