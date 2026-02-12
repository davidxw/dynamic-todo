'use client';

/**
 * Checkbox - Shared checkbox component
 */

import React, { forwardRef, useId } from 'react';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, className = '', id, ...props }, ref) {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 ${className}`}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
