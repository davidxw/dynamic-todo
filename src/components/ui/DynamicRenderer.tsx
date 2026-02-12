'use client';

/**
 * DynamicRenderer Component
 *
 * Renders a UI tree using the component registry.
 * This component takes a UITree and recursively renders it
 * using registered React components.
 */

import React from 'react';
import type { UITree } from '@/types';

// Import all renderable components
import { Button, TextInput, Checkbox, Card, Badge } from '@/components/ui';
import { TaskInput, TaskItem, TaskList, TodoApp } from '@/components/todo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

// Component registry for runtime lookup
const COMPONENT_REGISTRY: Record<string, AnyComponent> = {
  // Layout
  Container,
  Card,
  Divider,

  // Input
  TextInput,
  Checkbox,
  Select,
  DatePicker,
  Button,

  // Display
  Text,
  Badge,
  Icon,

  // Todo
  TodoApp,
  TaskList,
  TaskItem,
  TaskInput,
  TaskFilter,
  TaskStats,
};

interface DynamicRendererProps {
  tree: UITree;
  /** Additional props to pass to components at runtime */
  runtimeProps?: Record<string, unknown>;
}

export function DynamicRenderer({ tree, runtimeProps = {} }: DynamicRendererProps) {
  return renderNode(tree, runtimeProps, 'root');
}

function renderNode(
  node: UITree,
  runtimeProps: Record<string, unknown>,
  key: string,
): React.ReactNode {
  const Component = COMPONENT_REGISTRY[node.component];

  if (!Component) {
    console.warn(`Unknown component: ${node.component}`);
    return (
      <div key={key} className="p-2 border border-red-300 bg-red-50 text-red-700 text-sm rounded">
        Unknown component: {node.component}
      </div>
    );
  }

  // Merge static props with runtime props
  const props = { ...node.props, ...runtimeProps };

  // Render children if present
  const children = node.children?.map((child, index) =>
    renderNode(child, runtimeProps, `${key}-${index}`),
  );

  return (
    <Component key={key} {...props}>
      {children}
    </Component>
  );
}

// =============================================================================
// Built-in Component Implementations
// =============================================================================

interface ContainerProps {
  direction?: 'row' | 'column';
  gap?: number;
  padding?: number;
  className?: string;
  children?: React.ReactNode;
}

function Container({
  direction = 'column',
  gap = 16,
  padding = 0,
  className = '',
  children,
}: ContainerProps) {
  return (
    <div
      className={`flex ${direction === 'row' ? 'flex-row' : 'flex-col'} ${className}`}
      style={{ gap: `${gap}px`, padding: `${padding}px` }}
    >
      {children}
    </div>
  );
}

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  return (
    <div
      className={`${
        orientation === 'horizontal'
          ? 'h-px w-full'
          : 'w-px h-full'
      } bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

interface SelectProps {
  value?: string;
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function Select({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className = '',
}: SelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
    >
      {!value && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
}

function DatePicker({
  value,
  onChange,
  min,
  max,
  disabled = false,
  className = '',
}: DatePickerProps) {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      min={min}
      max={max}
      disabled={disabled}
      className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
    />
  );
}

interface TextDisplayProps {
  content: string;
  variant?: 'body' | 'heading' | 'caption' | 'label';
  bold?: boolean;
  muted?: boolean;
  className?: string;
}

function Text({
  content,
  variant = 'body',
  bold = false,
  muted = false,
  className = '',
}: TextDisplayProps) {
  const variantClasses = {
    body: 'text-base',
    heading: 'text-xl font-semibold',
    caption: 'text-sm',
    label: 'text-sm font-medium',
  };

  return (
    <span
      className={`
        ${variantClasses[variant]}
        ${bold ? 'font-bold' : ''}
        ${muted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}
        ${className}
      `}
    >
      {content}
    </span>
  );
}

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

function Icon({ name, size = 20, className = '' }: IconProps) {
  // Simple SVG icons
  const icons: Record<string, React.ReactNode> = {
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    ),
    trash: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    ),
    plus: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    ),
    calendar: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  };

  return (
    <svg
      className={`fill-none stroke-current ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {icons[name] || icons.check}
    </svg>
  );
}

interface TaskFilterProps {
  current?: 'all' | 'active' | 'completed';
  onChange?: (filter: 'all' | 'active' | 'completed') => void;
  className?: string;
}

function TaskFilter({
  current = 'all',
  onChange,
  className = '',
}: TaskFilterProps) {
  const filters: Array<'all' | 'active' | 'completed'> = ['all', 'active', 'completed'];

  return (
    <div className={`flex gap-2 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange?.(filter)}
          className={`px-3 py-1 rounded text-sm capitalize ${
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

interface TaskStatsProps {
  totalCount?: number;
  completedCount?: number;
  activeCount?: number;
  className?: string;
}

function TaskStats({
  totalCount = 0,
  completedCount = 0,
  activeCount = 0,
  className = '',
}: TaskStatsProps) {
  return (
    <div className={`flex gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <span>Total: {totalCount}</span>
      <span>Active: {activeCount}</span>
      <span>Completed: {completedCount}</span>
    </div>
  );
}
