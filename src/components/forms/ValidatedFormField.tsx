'use client';

import React from 'react';
import {
  FieldError,
  UseFormRegister,
  Path,
  FieldValues,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ValidatedFormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  value?: string | number;
  onChange?: (value: string | number | boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  helpText?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  minLength?: number;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    validate?: (value: string | number | boolean) => boolean | string;
  };
}

export function ValidatedFormField<T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  options = [],
  rows = 3,
  min,
  max,
  step,
  pattern,
  autoComplete,
  autoFocus = false,
  readOnly = false,
  value,
  onChange,
  onBlur,
  onFocus,
  helpText,
  showCharacterCount = false,
  maxLength,
  minLength,
  validation,
}: ValidatedFormFieldProps<T>) {
  const [charCount, setCharCount] = React.useState(0);

  const baseInputClasses = cn(
    'w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary-blue focus:border-primary-blue sm:text-sm transition-colors duration-200',
    {
      'border-red-300 focus:ring-red-500 focus:border-red-500': error,
      'border-gray-300': !error,
      'bg-gray-50 cursor-not-allowed': disabled,
      'bg-white': !disabled,
    },
    inputClassName
  );

  const baseLabelClasses = cn(
    'block text-sm font-medium text-gray-700 mb-1',
    {
      'text-red-600': error,
      'text-gray-700': !error,
    },
    labelClassName
  );

  const baseErrorClasses = cn('mt-1 text-sm text-red-600', errorClassName);

  const renderField = () => {
    const commonProps = {
      id: name,
      ...register(name, validation),
      className: baseInputClasses,
      placeholder,
      disabled,
      autoComplete,
      autoFocus,
      readOnly,
      'aria-describedby': error
        ? `${name}-error`
        : helpText
          ? `${name}-help`
          : undefined,
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            maxLength={maxLength}
            minLength={minLength}
            onChange={(e) => {
              if (showCharacterCount) {
                setCharCount(e.target.value.length);
              }
              onChange?.(e.target.value);
            }}
          />
        );

      case 'select':
        return (
          <select {...commonProps} value={value}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              className={cn(
                baseInputClasses,
                'w-4 h-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded'
              )}
            />
            <label htmlFor={name} className={cn(baseLabelClasses, 'ml-2 mb-0')}>
              {label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  {...commonProps}
                  type="radio"
                  value={option.value}
                  className={cn(
                    baseInputClasses,
                    'w-4 h-4 text-primary-blue focus:ring-primary-blue border-gray-300'
                  )}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className={cn(baseLabelClasses, 'ml-2 mb-0')}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            maxLength={maxLength}
            minLength={minLength}
            onChange={(e) => {
              if (showCharacterCount) {
                setCharCount(e.target.value.length);
              }
              onChange?.(e.target.value);
            }}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      {type !== 'checkbox' && type !== 'radio' && (
        <label htmlFor={name} className={baseLabelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderField()}

      {showCharacterCount && maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {charCount}/{maxLength}
        </div>
      )}

      {helpText && !error && (
        <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${name}-error`} className={baseErrorClasses}>
          {error.message}
        </p>
      )}
    </div>
  );
}

// Specialized form field components
export function TextField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="text" />;
}

export function EmailField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="email" />;
}

export function PasswordField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="password" />;
}

export function NumberField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="number" />;
}

export function PhoneField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="tel" />;
}

export function UrlField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="url" />;
}

export function TextAreaField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="textarea" />;
}

export function SelectField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="select" />;
}

export function CheckboxField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="checkbox" />;
}

export function RadioField<T extends FieldValues>(
  props: Omit<ValidatedFormFieldProps<T>, 'type'>
) {
  return <ValidatedFormField<T> {...props} type="radio" />;
}
