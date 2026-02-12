'use client';

/**
 * TaskItem - Displays a single task with toggle and delete
 */

import React, { useCallback } from 'react';
import type { Task } from '@/types/task';
import { Checkbox, Badge } from '@/components/ui';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showDueDate?: boolean;
  showPriority?: boolean;
}

const priorityColors: Record<string, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  showDueDate = false,
  showPriority = false,
}: TaskItemProps) {
  const handleToggle = useCallback(() => {
    onToggle(task.id);
  }, [task.id, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDelete(task.id);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle(task.id);
      }
    },
    [task.id, onDelete, onToggle]
  );

  const priority = task.metadata?.priority as string | undefined;
  const dueDate = task.metadata?.dueDate as string | undefined;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        task.completed
          ? 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
          : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listitem"
      aria-label={`Task: ${task.title}${task.completed ? ', completed' : ''}`}
    >
      <Checkbox
        checked={task.completed}
        onChange={handleToggle}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="flex-1 min-w-0">
        <span
          className={`text-base ${
            task.completed
              ? 'line-through text-gray-500 dark:text-gray-400'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {task.title}
        </span>

        <div className="flex gap-2 mt-1">
          {showPriority && priority && (
            <Badge variant={priorityColors[priority] || 'default'}>
              {priority}
            </Badge>
          )}
          {showDueDate && dueDate && (
            <Badge variant="default">
              Due: {new Date(dueDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
        aria-label={`Delete "${task.title}"`}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
