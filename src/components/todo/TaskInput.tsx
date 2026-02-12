'use client';

/**
 * TaskInput - Component for adding new tasks
 */

import React, { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { TextInput } from '@/components/ui';

interface TaskInputProps {
  placeholder?: string;
  onAddTask: (title: string) => Promise<void>;
  disabled?: boolean;
}

export function TaskInput({
  placeholder = 'What needs to be done?',
  onAddTask,
  disabled = false,
}: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      const trimmedTitle = title.trim();
      if (!trimmedTitle || isSubmitting) return;

      setIsSubmitting(true);
      try {
        await onAddTask(trimmedTitle);
        setTitle('');
      } finally {
        setIsSubmitting(false);
      }
    },
    [title, isSubmitting, onAddTask]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <TextInput
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        aria-label="New task title"
        className="w-full text-lg py-3"
      />
    </form>
  );
}
