'use client';

/**
 * TaskList - Displays a list of tasks with filtering
 */

import React from 'react';
import type { Task, TaskFilter } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter?: TaskFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showDueDate?: boolean;
  showPriority?: boolean;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  filter = 'all',
  onToggle,
  onDelete,
  showDueDate = false,
  showPriority = false,
  isLoading = false,
}: TaskListProps) {
  // Apply filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {filter === 'all' && 'No tasks yet. Add one above!'}
        {filter === 'active' && 'No active tasks. Great work!'}
        {filter === 'completed' && 'No completed tasks yet.'}
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Task list">
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            showDueDate={showDueDate}
            showPriority={showPriority}
          />
        </li>
      ))}
    </ul>
  );
}
