import { z } from 'zod';
import { useForm, UseFormProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Generic form hook with Zod validation
export function useValidatedForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema as any),
    mode: 'onBlur', // Validate on blur for better UX
    ...options,
  });
}

// Form validation helpers
export function createFormValidator<T extends FieldValues>(schema: z.ZodSchema<T>) {
  return {
    validate: (data: unknown): T => schema.parse(data),
    validateSafe: (data: unknown) => {
      try {
        return { success: true, data: schema.parse(data) };
      } catch (error) {
        return { success: false, error: error as z.ZodError };
      }
    },
    validatePartial: (data: unknown) => {
      try {
        return { success: true, data: schema.partial().parse(data) };
      } catch (error) {
        return { success: false, error: error as z.ZodError };
      }
    },
  };
}

// Field validation helpers
export function createFieldValidator<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  fieldName: Path<T>
) {
  return {
    validateField: (value: unknown) => {
      try {
        const fieldSchema = schema.shape[fieldName as keyof z.infer<typeof schema>];
        if (fieldSchema) {
          fieldSchema.parse(value);
          return { success: true };
        }
        return { success: false, error: new Error('Field not found in schema') };
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

// Async validation helpers
export function createAsyncValidator<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  asyncValidations: Record<string, (value: any) => Promise<boolean | string>>
) {
  return {
    validateAsync: async (data: unknown): Promise<T> => {
      // First validate with Zod schema
      const validatedData = schema.parse(data);
      
      // Then run async validations
      for (const [field, validator] of Object.entries(asyncValidations)) {
        const value = validatedData[field as keyof T];
        const result = await validator(value);
        if (result !== true) {
          throw new z.ZodError([
            {
              code: 'custom',
              path: [field],
              message: typeof result === 'string' ? result : 'Validation failed',
            },
          ]);
        }
      }
      
      return validatedData;
    },
  };
}

// Form state helpers
export function getFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  Object.keys(form.formState.errors).forEach((key) => {
    const error = form.formState.errors[key as Path<T>];
    if (error?.message) {
      errors[key] = error.message;
    }
  });
  
  return errors;
}

export function hasFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>
): boolean {
  return Object.keys(form.formState.errors).length > 0;
}

export function isFormValid<T extends FieldValues>(
  form: UseFormReturn<T>
): boolean {
  return form.formState.isValid && !hasFormErrors(form);
}

// Form reset helpers
export function resetFormWithData<T extends FieldValues>(
  form: UseFormReturn<T>,
  data: Partial<T>
) {
  form.reset(data as T);
}

export function clearFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>
) {
  form.clearErrors();
}

// Field focus helpers
export function focusField<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
) {
  const element = document.getElementById(fieldName);
  if (element) {
    element.focus();
  }
}

export function focusFirstError<T extends FieldValues>(
  form: UseFormReturn<T>
) {
  const firstError = Object.keys(form.formState.errors)[0];
  if (firstError) {
    focusField(form, firstError as Path<T>);
  }
}

// Form validation modes
export const VALIDATION_MODES = {
  ON_BLUR: 'onBlur',
  ON_CHANGE: 'onChange',
  ON_SUBMIT: 'onSubmit',
  ON_TOUCH: 'onTouched',
  ALL: 'all',
} as const;

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

// Form validation utilities
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

// Form data transformation helpers
export function transformFormData<T extends FieldValues>(
  data: T,
  transformers: Record<string, (value: any) => any>
): T {
  const transformed = { ...data };
  
  Object.entries(transformers).forEach(([key, transformer]) => {
    if (key in transformed) {
      transformed[key as keyof T] = transformer(transformed[key as keyof T]);
    }
  });
  
  return transformed;
}

export function sanitizeFormData<T extends FieldValues>(
  data: T,
  fieldsToSanitize: (keyof T)[]
): T {
  const sanitized = { ...data };
  
  fieldsToSanitize.forEach((field) => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = (sanitized[field] as string).trim() as T[keyof T];
    }
  });
  
  return sanitized;
}

// Form validation hooks
export function useFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options?: {
    mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
    reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
    criteriaMode?: 'firstError' | 'all';
  }
) {
  const form = useValidatedForm(schema, options);
  
  return {
    ...form,
    isValid: isFormValid(form),
    hasErrors: hasFormErrors(form),
    errors: getFormErrors(form),
    focusFirstError: () => focusFirstError(form),
    clearErrors: () => clearFormErrors(form),
    resetWithData: (data: Partial<T>) => resetFormWithData(form, data),
  };
}

// Form submission hooks
export function useFormSubmission<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  onSubmit: (data: T) => Promise<void> | void,
  onError?: (error: z.ZodError | Error) => void
) {
  const form = useValidatedForm(schema);
  
  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      onError?.(error as Error);
    }
  };
  
  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
