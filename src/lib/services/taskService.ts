/**
 * Task Service - CRUD operations for tasks
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ListTasksParams,
  TaskListResponse,
  BulkTaskOperationInput,
  BulkOperationResult,
} from '@/types/task';
import { getUserTasks, saveUserTasks } from '@/lib/storage/userState';
import { NotFoundError, ValidationError } from '@/lib/errorHandling';
import { TASK_TITLE_MAX_LENGTH, TASK_TITLE_MIN_LENGTH } from '@/constants';

/**
 * Validates task title
 */
function validateTitle(title: string): void {
  if (!title || title.trim().length < TASK_TITLE_MIN_LENGTH) {
    throw new ValidationError('Task title cannot be empty', 'title');
  }
  if (title.length > TASK_TITLE_MAX_LENGTH) {
    throw new ValidationError(
      `Task title cannot exceed ${TASK_TITLE_MAX_LENGTH} characters`,
      'title'
    );
  }
}

/**
 * Creates a new task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  validateTitle(input.title);

  const tasks = await getUserTasks(input.userId);

  const newTask: Task = {
    id: uuidv4(),
    title: input.title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    metadata: input.metadata || {},
  };

  tasks.push(newTask);
  await saveUserTasks(input.userId, tasks);

  return newTask;
}

/**
 * Gets a single task by ID
 */
export async function getTask(userId: string, taskId: string): Promise<Task> {
  const tasks = await getUserTasks(userId);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    throw new NotFoundError('Task', taskId);
  }

  return task;
}

/**
 * Lists tasks with optional filtering and sorting
 */
export async function listTasks(params: ListTasksParams): Promise<TaskListResponse> {
  let tasks = await getUserTasks(params.userId);

  // Apply filter
  if (params.filter && params.filter !== 'all') {
    tasks = tasks.filter((t) =>
      params.filter === 'completed' ? t.completed : !t.completed
    );
  }

  // Apply sorting
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';

  tasks.sort((a, b) => {
    let aVal: string;
    let bVal: string;

    switch (sortBy) {
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case 'priority':
        aVal = (a.metadata?.priority as string) || 'low';
        bVal = (b.metadata?.priority as string) || 'low';
        break;
      case 'dueDate':
        aVal = (a.metadata?.dueDate as string) || '';
        bVal = (b.metadata?.dueDate as string) || '';
        break;
      case 'createdAt':
      default:
        aVal = a.createdAt;
        bVal = b.createdAt;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return {
    tasks,
    total: tasks.length,
  };
}

/**
 * Updates a task
 */
export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput
): Promise<Task> {
  const tasks = await getUserTasks(userId);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    throw new NotFoundError('Task', taskId);
  }

  if (input.title !== undefined) {
    validateTitle(input.title);
    tasks[taskIndex].title = input.title.trim();
  }

  if (input.completed !== undefined) {
    tasks[taskIndex].completed = input.completed;
    if (input.completed) {
      tasks[taskIndex].completedAt = new Date().toISOString();
    } else {
      delete tasks[taskIndex].completedAt;
    }
  }

  if (input.metadata !== undefined) {
    tasks[taskIndex].metadata = {
      ...tasks[taskIndex].metadata,
      ...input.metadata,
    };
  }

  await saveUserTasks(userId, tasks);

  return tasks[taskIndex];
}

/**
 * Deletes a task
 */
export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const tasks = await getUserTasks(userId);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    throw new NotFoundError('Task', taskId);
  }

  tasks.splice(taskIndex, 1);
  await saveUserTasks(userId, tasks);
}

/**
 * Performs bulk operations on tasks
 */
export async function bulkTaskOperation(
  input: BulkTaskOperationInput
): Promise<BulkOperationResult> {
  const tasks = await getUserTasks(input.userId);
  let updated = 0;
  const failed: string[] = [];

  for (const taskId of input.taskIds) {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      failed.push(taskId);
      continue;
    }

    switch (input.operation) {
      case 'complete':
        tasks[taskIndex].completed = true;
        tasks[taskIndex].completedAt = new Date().toISOString();
        updated++;
        break;

      case 'uncomplete':
        tasks[taskIndex].completed = false;
        delete tasks[taskIndex].completedAt;
        updated++;
        break;

      case 'delete':
        tasks.splice(taskIndex, 1);
        updated++;
        break;

      case 'updateMetadata':
        if (input.metadata) {
          tasks[taskIndex].metadata = {
            ...tasks[taskIndex].metadata,
            ...input.metadata,
          };
        }
        updated++;
        break;
    }
  }

  // For delete operations, save after all deletions
  if (input.operation !== 'delete' || updated > 0) {
    await saveUserTasks(input.userId, tasks);
  }

  return { updated, failed };
}
