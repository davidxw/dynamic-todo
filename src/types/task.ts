/**
 * Task entity - A todo item representing a single task in the user's list
 */

export interface Task {
  /** Unique identifier (UUID v4) */
  id: string;
  /** Task description text (1-500 chars) */
  title: string;
  /** Whether task is marked done */
  completed: boolean;
  /** When task was created (ISO 8601) */
  createdAt: string;
  /** When task was completed (ISO 8601) - set when completed is true */
  completedAt?: string;
  /** Extensible properties for UI customizations (priority, dueDate, tags, notes, etc.) */
  metadata?: Record<string, unknown>;
}

export interface CreateTaskInput {
  userId: string;
  title: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
  metadata?: Record<string, unknown>;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export type TaskSortField = 'createdAt' | 'title' | 'priority' | 'dueDate';

export type SortOrder = 'asc' | 'desc';

export interface ListTasksParams {
  userId: string;
  filter?: TaskFilter;
  sortBy?: TaskSortField;
  sortOrder?: SortOrder;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

export type BulkOperation = 'complete' | 'uncomplete' | 'delete' | 'updateMetadata';

export interface BulkTaskOperationInput {
  userId: string;
  operation: BulkOperation;
  taskIds: string[];
  metadata?: Record<string, unknown>;
}

export interface BulkOperationResult {
  updated: number;
  failed: string[];
}
