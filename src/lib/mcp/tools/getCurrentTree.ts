/**
 * get_current_tree MCP tool
 *
 * Gets the current UI tree for a user.
 */

import type { UITree } from '@/types';
import { getUserUIState } from '@/lib/storage/userState';
import { NotFoundError } from '@/lib/errorHandling';

export interface GetCurrentTreeParams {
  userId: string;
}

/**
 * Get the current UI tree for a user
 */
export async function getCurrentTree(
  params: GetCurrentTreeParams,
): Promise<UITree> {
  const { userId } = params;

  const state = await getUserUIState(userId);
  if (!state) {
    throw new NotFoundError('User', userId);
  }

  return state.tree;
}
