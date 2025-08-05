/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { FieldValues, Path } from 'react-hook-form';

// Type guard to check if schema is a ZodObject
function isZodObject(schema: z.ZodSchema<any>): schema is z.ZodObject<any> {
  return schema instanceof z.ZodObject;
}

// Form validation helpers
export function createFormValidator<T extends FieldValues>(
  schema: z.ZodSchema<T>
) {
  return {
    validate: (data: unknown): T => schema.parse(data),
    validateSafe: (data: unknown) => {
      try {
        return { success: true, data: schema.parse(data) };
      } catch (error) {
        return { success: false, error: error as z.ZodError };
      }
    },
  };
}

// Field validation helpers - safely access shape only for ZodObject
export function createFieldValidator<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  fieldName: Path<T>
) {
  return {
    validateField: (value: unknown) => {
      try {
        // Only access shape if schema is a ZodObject
        if (isZodObject(schema)) {
          const fieldSchema =
            schema.shape[fieldName as keyof z.infer<typeof schema>];
          if (fieldSchema) {
            fieldSchema.parse(value);
            return { success: true };
          }
        }

        // Fallback: validate the entire schema
        schema.parse({ [fieldName]: value });
        return { success: true };
      } catch (error) {
        return { success: false, error: error as z.ZodError };
      }
    },
  };
}

// Form submission helpers
export function createFormSubmitHandler<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  onSubmit: (data: T) => Promise<void> | void,
  onError?: (error: z.ZodError) => void
) {
  return async (data: unknown) => {
    try {
      const validatedData = schema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        onError?.(error);
      } else {
        throw error;
      }
    }
  };
}

// Utility functions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  POSTAL_CODE: /^[A-Z0-9\s-]{3,10}$/i,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  URL: /^https?:\/\/.+/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHA_ONLY: /^[a-zA-Z\s]+$/,
  NUMERIC_ONLY: /^[0-9]+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
} as const;

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be less than ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be less than ${max}`,
  PATTERN: 'Please enter a valid value',
  PASSWORD_MATCH: "Passwords don't match",
  UNIQUE: 'This value already exists',
  INVALID_FORMAT: 'Invalid format',
} as const;
