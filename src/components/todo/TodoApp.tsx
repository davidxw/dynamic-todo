'use client';

/**
 * TodoApp - Main container component for the Todo application
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFilter } from '@/types/task';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { Card } from '@/components/ui';
import { API_PATHS, DEFAULT_USER_ID } from '@/constants';

interface TodoAppProps {
  showHeader?: boolean;
  userId?: string;
  initialFilter?: TaskFilter;
  // TEMPORARY: Test marker to verify dynamic rendering - remove after testing
  testMarker?: string;
}

export function TodoApp({
  showHeader = true,
  userId = DEFAULT_USER_ID,
  initialFilter = 'all',
  testMarker,
}: TodoAppProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>(initialFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on mount and when userId changes
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_PATHS.TASKS}?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const handleAddTask = useCallback(
    async (title: string) => {
      try {
        const response = await fetch(API_PATHS.TASKS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, title }),
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }

        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add task');
      }
    },
    [userId]
  );

  // Toggle task completion
  const handleToggle = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );

      try {
        const response = await fetch(`${API_PATHS.TASKS}/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, completed: !task.completed }),
        });

        if (!response.ok) {
          // Revert on failure
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, completed: task.completed } : t
            )
          );
          throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updatedTask : t))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    },
    [tasks, userId]
  );

  // Delete a task
  const handleDelete = useCallback(
    async (taskId: string) => {
      // Optimistic update
      const previousTasks = tasks;
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      try {
        const response = await fetch(
          `${API_PATHS.TASKS}/${taskId}?userId=${userId}`,
          { method: 'DELETE' }
        );

        if (!response.ok) {
          // Revert on failure
          setTasks(previousTasks);
          throw new Error('Failed to delete task');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    },
    [tasks, userId]
  );

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {/* TEMPORARY: Test marker display - remove after testing */}
      {testMarker && (
        <div className="mb-4 p-2 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded text-orange-800 dark:text-orange-200 text-sm font-mono">
          TEST MARKER: {testMarker}
        </div>
      )}

      {showHeader && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dynamic Todo
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeCount} active, {completedCount} completed
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-4">
        <TaskInput onAddTask={handleAddTask} disabled={isLoading} />

        {/* Filter tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {(['all', 'active', 'completed'] as TaskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === f
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <TaskList
          tasks={tasks}
          filter={filter}
          onToggle={handleToggle}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
}
