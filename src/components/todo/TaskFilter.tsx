'use client';

/**
 * TaskFilter - Filter buttons for All/Active/Completed tasks
 */

import React from 'react';

export type TaskFilterValue = 'all' | 'active' | 'completed';

interface TaskFilterProps {
  current?: TaskFilterValue;
  onChange?: (filter: TaskFilterValue) => void;
  className?: string;
}

export function TaskFilter({
  current = 'all',
  onChange,
  className = '',
}: TaskFilterProps) {
  const filters: TaskFilterValue[] = ['all', 'active', 'completed'];

  return (
    <div className={`flex items-center gap-1 ${className}`} role="tablist">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange?.(filter)}
          role="tab"
          aria-selected={current === filter}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            current === filter
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
