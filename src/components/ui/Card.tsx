'use client';

/**
 * Card - Shared card container component
 */

import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  padding?: number;
}

export function Card({ children, className = '', header, footer, title, padding = 16 }: CardProps) {
  // Use title as header if provided and no header specified
  const headerContent = header ?? (title ? <span className="font-semibold">{title}</span> : null);
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      {headerContent && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          {headerContent}
        </div>
      )}
      <div style={{ padding: `${padding}px` }}>{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
