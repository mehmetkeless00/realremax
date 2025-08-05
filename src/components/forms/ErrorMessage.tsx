'use client';

import { FieldError } from 'react-hook-form';

export interface ErrorMessageProps {
  error?: FieldError;
  className?: string;
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error || !error.message) return null;
  return (
    <p className={`text-red-600 text-sm mt-1 ${className}`.trim()}>
      {error.message}
    </p>
  );
}
