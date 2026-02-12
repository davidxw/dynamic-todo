/**
 * User state storage service for managing per-user data
 */

import path from 'path';
import type { Task } from '@/types/task';
import type { UIState, UITree } from '@/types/ui';
import type { ChangeLog } from '@/types/changelog';
import type { User } from '@/types/user';
import {
  readJsonFile,
  writeJsonFile,
  getUserDataPath,
  getDataPath,
  copyDir,
  ensureDir,
  fileExists,
} from './fileUtils';
import {
  TASKS_FILE,
  STATE_FILE,
  HISTORY_FILE,
  DEFAULT_USER_ID,
  SAMPLE_USERS,
  INITIAL_UI_VERSION,
} from '@/constants';

// Default UI tree for a new user
const DEFAULT_UI_TREE: UITree = {
  component: 'TodoApp',
  props: { showHeader: true },
  children: [
    {
      component: 'TaskInput',
      props: { placeholder: 'What needs to be done?' },
    },
    {
      component: 'TaskList',
      props: { filter: 'all' },
      children: [],
    },
  ],
};

/**
 * Gets all tasks for a user
 */
export async function getUserTasks(userId: string): Promise<Task[]> {
  const filePath = getUserDataPath(userId, TASKS_FILE);
  const data = await readJsonFile<{ tasks: Task[] }>(filePath);
  return data?.tasks ?? [];
}

/**
 * Saves tasks for a user
 */
export async function saveUserTasks(userId: string, tasks: Task[]): Promise<void> {
  const filePath = getUserDataPath(userId, TASKS_FILE);
  await writeJsonFile(filePath, { tasks });
}

/**
 * Gets UI state for a user
 */
export async function getUserUIState(userId: string): Promise<UIState | null> {
  const filePath = getUserDataPath(userId, STATE_FILE);
  const data = await readJsonFile<UIState>(filePath);
  
  if (data) {
    return data;
  }
  
  // Return null if no state exists - caller must handle default
  return null;
}

/**
 * Saves UI state for a user (overwrites existing)
 */
export async function saveUserUIState(
  userId: string,
  state: UIState
): Promise<void> {
  const filePath = getUserDataPath(userId, STATE_FILE);
  await writeJsonFile(filePath, state);
}

/**
 * Gets change history for a user
 */
export async function getUserHistory(
  userId: string,
  limit: number = 20
): Promise<ChangeLog[]> {
  const filePath = getUserDataPath(userId, HISTORY_FILE);
  const data = await readJsonFile<{ changes: ChangeLog[] }>(filePath);
  const changes = data?.changes ?? [];
  return changes.slice(0, limit);
}

/**
 * Adds a change log entry
 */
export async function addChangeLogEntry(
  userId: string,
  entry: ChangeLog
): Promise<void> {
  const history = await getUserHistory(userId, 100);
  history.unshift(entry);
  
  const filePath = getUserDataPath(userId, HISTORY_FILE);
  await writeJsonFile(filePath, { changes: history });
}

/**
 * Resets a user's state to default
 */
export async function resetUserState(userId: string): Promise<UIState> {
  const defaultPath = getUserDataPath(DEFAULT_USER_ID);
  const userPath = getUserDataPath(userId);
  
  // Copy default state to user directory
  await copyDir(defaultPath, userPath);
  
  // Return the new state (should always exist after copy)
  const state = await getUserUIState(userId);
  if (!state) {
    // If state still doesn't exist, create a default one
    const defaultState: UIState = {
      version: INITIAL_UI_VERSION,
      userId,
      tree: DEFAULT_UI_TREE,
      lastModified: new Date().toISOString(),
    };
    await saveUserUIState(userId, defaultState);
    return defaultState;
  }
  return state;
}

/**
 * Gets list of all users
 */
export async function getUsers(): Promise<User[]> {
  const usersFilePath = getDataPath('users', 'users.json');
  const data = await readJsonFile<{ users: User[] }>(usersFilePath);
  return data?.users ?? [...SAMPLE_USERS];
}

/**
 * Gets a specific user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === userId) ?? null;
}

/**
 * Initializes user directories with default data
 */
export async function initializeUserDirectories(): Promise<void> {
  for (const user of SAMPLE_USERS) {
    const userPath = getUserDataPath(user.id);
    const exists = await fileExists(path.join(userPath, TASKS_FILE));
    
    if (!exists) {
      await ensureDir(userPath);
      
      // Create default tasks
      await saveUserTasks(user.id, []);
      
      // Create default UI state
      const defaultState: UIState = {
        version: INITIAL_UI_VERSION,
        userId: user.id,
        tree: DEFAULT_UI_TREE,
        lastModified: new Date().toISOString(),
      };
      await writeJsonFile(path.join(userPath, STATE_FILE), defaultState);
      
      // Create empty history
      await writeJsonFile(path.join(userPath, HISTORY_FILE), { changes: [] });
    }
  }
  
  // Save users list
  const usersFilePath = getDataPath('users', 'users.json');
  await writeJsonFile(usersFilePath, { users: [...SAMPLE_USERS] });
}
