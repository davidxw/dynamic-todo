/**
 * Configuration constants for the Dynamic Todo application
 */

// User data paths
export const DATA_DIR = 'data';
export const USERS_DIR = `${DATA_DIR}/users`;
export const DEFAULT_USER_ID = 'default';

// Sample users
export const SAMPLE_USERS = [
  { id: 'default', displayName: 'Default', isDefault: true },
  { id: 'alice', displayName: 'Alice (Custom Theme)', isDefault: false },
  { id: 'bob', displayName: 'Bob (Extended UI)', isDefault: false },
] as const;

// File names for user data
export const TASKS_FILE = 'tasks.json';
export const STATE_FILE = 'state.json';
export const HISTORY_FILE = 'history.json';

// Task validation
export const TASK_TITLE_MAX_LENGTH = 500;
export const TASK_TITLE_MIN_LENGTH = 1;

// UI state
export const INITIAL_UI_VERSION = 1;

// Change history
export const DEFAULT_HISTORY_LIMIT = 20;
export const MAX_HISTORY_LIMIT = 100;

// Performance targets (in milliseconds)
export const UI_UPDATE_TARGET_MS = 500;
export const AI_RESPONSE_INITIATION_TARGET_MS = 2000;
export const RESET_COMPLETION_TARGET_MS = 3000;
export const USER_SWITCH_TARGET_MS = 2000;
export const THEME_TOGGLE_TARGET_MS = 500;

// Task operations timeout
export const TASK_OPERATION_TIMEOUT_MS = 5000;

// API paths
export const API_PATHS = {
  TASKS: '/api/tasks',
  TASKS_BULK: '/api/tasks/bulk',
  UI_STATE: '/api/ui/state',
  UI_RESET: '/api/ui/reset',
  UI_HISTORY: '/api/ui/history',
  USERS: '/api/users',
  MCP: '/api/mcp',
  MCP_SSE: '/api/mcp/sse',
} as const;

// MCP error codes
export const MCP_ERROR_CODES = {
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  COMPONENT_NOT_FOUND: -32000,
  INVALID_TREE_STRUCTURE: -32001,
  VERSION_CONFLICT: -32002,
} as const;

// Theme
export const THEME_STORAGE_KEY = 'dynamic-todo-theme';
export type Theme = 'light' | 'dark' | 'system';
export const DEFAULT_THEME: Theme = 'system';

// Local storage keys
export const STORAGE_KEYS = {
  THEME: THEME_STORAGE_KEY,
  CURRENT_USER: 'dynamic-todo-current-user',
} as const;
