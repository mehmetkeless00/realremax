import { FieldError } from 'react-hook-form';

// Error message component props
export interface ErrorMessageProps {
  error?: FieldError;
  className?: string;
}

// Form field props
export interface FormFieldProps {
  label: string;
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  error?: FieldError;
}

// Common form validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  url: /^https?:\/\/.+/,
  postalCode: /^[A-Za-z0-9\s\-]{4,10}$/,
};

// Common error messages
export const errorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be less than ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be less than ${max}`,
  invalidFormat: 'Invalid format',
  passwordsDontMatch: "Passwords don't match",
};

// Format validation error message
export const formatErrorMessage = (error: FieldError): string => {
  if (error.message) {
    return error.message;
  }

  switch (error.type) {
    case 'required':
      return errorMessages.required;
    case 'minLength':
      return errorMessages.minLength(error.ref?.minLength || 0);
    case 'maxLength':
      return errorMessages.maxLength(error.ref?.maxLength || 0);
    case 'min':
      return errorMessages.min(error.ref?.min || 0);
    case 'max':
      return errorMessages.max(error.ref?.max || 0);
    case 'pattern':
      return errorMessages.invalidFormat;
    default:
      return 'Invalid input';
  }
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Parse currency string to number
export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[$,]/g, '')) || 0;
};

// Format phone number
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};

// Parse phone number
export const parsePhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Validate file upload
export const validateFileUpload = (
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
};

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Form submission handler with loading state
export const createFormSubmitHandler = <T>(
  onSubmit: (data: T) => Promise<void>,
  onError?: (error: any) => void
) => {
  return async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      onError?.(error);
    }
  };
};

// Reset form with default values
export const resetFormWithDefaults = <T>(
  reset: (values?: T) => void,
  defaultValues: T
) => {
  reset(defaultValues);
};

// Check if form is dirty (has changes)
export const isFormDirty = (dirtyFields: Record<string, any>): boolean => {
  return Object.keys(dirtyFields).length > 0;
};

// Get field error class
export const getFieldErrorClass = (
  error?: FieldError,
  className?: string
): string => {
  const baseClass = className || '';
  return error
    ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`.trim()
    : baseClass;
};

// Get error message class
export const getErrorMessageClass = (className?: string): string => {
  return `text-red-600 text-sm mt-1 ${className || ''}`.trim();
};

// Validate required fields
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !!value;
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  return validationPatterns.email.test(email);
};

// Validate phone format
export const validatePhone = (phone: string): boolean => {
  return validationPatterns.phone.test(phone);
};

// Validate password strength
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('At least one lowercase letter');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('At least one uppercase letter');

  if (/\d/.test(password)) score++;
  else feedback.push('At least one number');

  if (/[@$!%*?&]/.test(password)) score++;
  else feedback.push('At least one special character');

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};
