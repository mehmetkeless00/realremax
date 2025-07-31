'use client';

import { FieldError } from 'react-hook-form';
import {
  formatErrorMessage,
  getErrorMessageClass,
} from '@/lib/validation/formUtils';

interface ErrorMessageProps {
  error?: FieldError;
  className?: string;
}

const ErrorMessage = ({ error, className }: ErrorMessageProps) => {
  if (!error) return null;

  const errorClass = getErrorMessageClass(className);

  return (
    <p className={errorClass} role="alert">
      {formatErrorMessage(error)}
    </p>
  );
};

export default ErrorMessage;
