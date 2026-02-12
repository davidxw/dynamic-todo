/**
 * ChangeLog entity - Record of UI modifications for history display
 */

import type { UITree } from './ui';

export interface ChangeLog {
  /** Unique change ID */
  id: string;
  /** When change was made (ISO 8601) */
  timestamp: string;
  /** Human-readable change description */
  description: string;
  /** UI state before change */
  beforeTree: UITree;
  /** UI state after change */
  afterTree: UITree;
  /** Chat message ID that caused this */
  triggeredBy: string;
}

export interface ChangeHistoryResponse {
  userId: string;
  changes: ChangeLog[];
  total: number;
}

export interface GetUIHistoryParams {
  userId: string;
  limit?: number;
}
