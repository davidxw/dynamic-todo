'use client';

/**
 * TaskStats - Display task completion statistics
 */

import React from 'react';

interface TaskStatsProps {
  total?: number;
  completed?: number;
  active?: number;
  className?: string;
}

export function TaskStats({
  total = 0,
  completed = 0,
  active = 0,
  className = '',
}: TaskStatsProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 dark:text-gray-400">Total:</span>
        <span className="font-medium text-gray-900 dark:text-white">{total}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 dark:text-gray-400">Active:</span>
        <span className="font-medium text-blue-600 dark:text-blue-400">{active}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 dark:text-gray-400">Done:</span>
        <span className="font-medium text-green-600 dark:text-green-400">{completed}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 dark:text-gray-400">Progress:</span>
        <span className="font-medium text-gray-900 dark:text-white">{percentage}%</span>
      </div>
    </div>
  );
}
