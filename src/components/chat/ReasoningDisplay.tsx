'use client';

/**
 * ReasoningDisplay Component
 *
 * Displays AI reasoning steps with expandable details.
 */

import { useState } from 'react';
import type { ReasoningStep } from '@/types';

interface ReasoningDisplayProps {
  steps: ReasoningStep[];
}

export function ReasoningDisplay({ steps }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        type="button"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="font-medium">Reasoning</span>
        <span className="text-gray-400 dark:text-gray-500">
          ({steps.length} step{steps.length > 1 ? 's' : ''})
        </span>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {steps.map((step) => (
            <div
              key={step.step}
              className="flex gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                {step.step}
              </span>
              <span>{step.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
