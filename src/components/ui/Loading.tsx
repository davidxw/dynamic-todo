'use client';

/**
 * Loading - Reusable loading spinner component
 */

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

export function Loading({ size = 'md', className = '', text }: LoadingProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
}

/**
 * LoadingOverlay - Full container loading overlay
 */
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}

export function LoadingOverlay({
  isLoading,
  children,
  text = 'Loading...',
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg">
          <Loading size="lg" text={text} />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton - Loading placeholder for content
 */
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = false,
}: SkeletonProps) {
  return (
    <div
      className={`${width} ${height} bg-gray-200 dark:bg-gray-700 animate-pulse ${
        rounded ? 'rounded-full' : 'rounded'
      } ${className}`}
    />
  );
}

/**
 * TaskSkeleton - Loading placeholder for task items
 */
export function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
      <Skeleton width="w-5" height="h-5" rounded />
      <Skeleton width="w-3/4" height="h-4" />
      <div className="ml-auto">
        <Skeleton width="w-6" height="h-6" rounded />
      </div>
    </div>
  );
}

/**
 * TaskListSkeleton - Loading placeholder for task list
 */
interface TaskListSkeletonProps {
  count?: number;
}

export function TaskListSkeleton({ count = 3 }: TaskListSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </div>
  );
}
