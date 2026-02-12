'use client';

/**
 * DatePicker - Date selection input component
 */

import React, { useId } from 'react';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  disabled = false,
  className = '',
  label,
  placeholder,
}: DatePickerProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type="date"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      />
    </div>
  );
}
